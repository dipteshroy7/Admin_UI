import React, { useState, useEffect } from "react";

import "./Table.css";

import edit_icon from "../../Assets/images/edit_icon.png";
import trash_icon from "../../Assets/images/trash_icon.png";

import { EditModal } from "../../components";

function Table() {
  const [search, setSearch] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [editRow, setEditRow] = useState({});
  const [adminData, setAdminData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [btns, setBtns] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [lastPageNum, setLastPageNum] = useState(0);

  // Initial data loading from the API
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
      const data = await response.json();
      setAdminData(data);
      setPageNum(1);
    };
    fetchData().catch(console.error);
  }, []);

  // show 10 records per page according to search or no search
  useEffect(() => {
    let length = searchedData.length;
    if (length > 0) {
      if (length % 10 === 0) setLastPageNum(Math.floor(length / 10));
      else setLastPageNum(Math.floor(length / 10) + 1);
      let temp = [];
      for (let i = (pageNum - 1) * 10; i < (pageNum === lastPageNum ? searchedData.length : pageNum * 10); i++) {
        temp.push(searchedData[i]);
      }
      setPageData(temp.filter((item) => item));
      setBtns([...Array(lastPageNum).keys()].map((x) => ++x));
    }
  }, [adminData, pageNum, lastPageNum, search, searchedData]);

  // page changes to previous page when all the records are deleted of the last page
  useEffect(() => {
    if (pageData.length === 0) setPageNum(lastPageNum);
  }, [pageData, lastPageNum]);

  // unselects all the selected records on page change
  useEffect(() => {
    document.getElementById("select_all").checked = false;
    setSelectedData([]);
  }, [pageNum]);

  // finds all the records according to the search
  useEffect(() => {
    setSearchedData(
      adminData.filter(({ name, email, role }) => {
        name = name.toLowerCase().trim();
        email = email.toLowerCase().trim();
        role = role.toLowerCase().trim();
        if (name.includes(search) || email.includes(search) || role.includes(search)) return true;
        else return false;
      })
    );
  }, [search, adminData]);

  // go to previous page
  function pageDecrease() {
    if (pageNum > 1) setPageNum(pageNum - 1);
  }

  // go to next page
  function pageIncrease() {
    if (pageNum < lastPageNum) setPageNum(pageNum + 1);
  }

  // open edit modal with selected record
  function editData(_id, _name, _email, _role) {
    console.log({ id: _id, name: _name, email: _email, role: _role });
    setEditRow({ id: _id, name: _name, email: _email, role: _role });
    document.querySelector("html").style.overflow = "hidden";
    document.querySelector(".edit_modal_background").style.display = "";
  }

  // delete single record
  function deleteData(id) {
    setAdminData(adminData.filter((data) => data.id !== id));
  }

  // delete multiple selected records together
  function deleteMultipleData() {
    if (selectedData.length > 0) {
      setAdminData(adminData.filter((data) => !selectedData.includes(data.id)));
      document.getElementById("select_all").checked = false;
      setSelectedData([]);
    }
  }

  // select a single record
  function selectData(id) {
    let row = document.getElementById(id + "_row");
    let actions = document.getElementById(id + "_actions");
    let cb = document.getElementById(id + "_cb");
    if (cb.checked === true) {
      setSelectedData([...selectedData, id]);
      row.style.backgroundColor = "#ddd";
      actions.style.display = "none";
    } else {
      document.getElementById("select_all").checked = false;
      setSelectedData(selectedData.filter((data) => data !== id));
      row.removeAttribute("style");
      actions.style.display = "flex";
    }
  }

  // select all the records of the current page
  function selectMultipleData() {
    let all = document.getElementById("select_all").checked;
    pageData.forEach(({ id }) => {
      document.getElementById(id + "_cb").checked = all;
      selectData(id);
    });
    if (all) setSelectedData(pageData.map(({ id }) => id));
    else setSelectedData([]);
  }

  // show records according to the search
  function searchData(e) {
    setPageNum(1);
    let searched = e.target.value.toLowerCase().trim();
    setSearch(searched);
  }

  return (
    <div className="table">
      <input
        type="text"
        className="search_box"
        onChange={searchData}
        placeholder="Search by name, email or role"
      ></input>
      <div className="table_data">
        <div className="row bold">
          <div className="cell">
            <input type="checkbox" id="select_all" onClick={selectMultipleData}></input>
          </div>
          <div className="cell">Name</div>
          <div className="cell">Email</div>
          <div className="cell">Role</div>
          <div className="cell">Actions</div>
        </div>
        {searchedData.length > 0 &&
          pageData.map(({ id, name, email, role }) => {
            return (
              <div key={id + name} id={id + "_row"} className="row">
                <div className="cell">
                  <input id={id + "_cb"} type="checkbox" onChange={() => selectData(id)}></input>
                </div>
                <div className="cell">{name}</div>
                <div className="cell">{email}</div>
                <div className="cell">{role}</div>
                <div className="cell actions">
                  <div id={id + "_actions"} style={{ display: "flex" }}>
                    <img src={edit_icon} alt="" onClick={() => editData(id, name, email, role)}></img>
                    <img src={trash_icon} alt="" onClick={() => deleteData(id)}></img>
                  </div>
                </div>
              </div>
            );
          })}
        {searchedData.length === 0 && (
          <div className="empty_box">
            <span>NO DATA FOUND</span>
          </div>
        )}
      </div>
      {searchedData.length > 0 && (
        <div className="table_buttons">
          <button className="delete_selected" onClick={deleteMultipleData}>
            Delete Selected
          </button>
          <button onClick={() => setPageNum(1)} className={pageNum === 1 ? "disbtn" : ""}>
            {"\u00AB"}
          </button>
          <button onClick={pageDecrease} className={pageNum === 1 ? "disbtn" : ""}>
            {"\u2039"}
          </button>
          {btns.map((btn) => (
            <button
              key={btn}
              onClick={() => setPageNum(btn)}
              className={`numbtns ${pageNum === btn ? " selectedbtn" : ""}`}
            >
              {btn}
            </button>
          ))}
          <button onClick={pageIncrease} className={pageNum === lastPageNum ? "disbtn" : ""}>
            {"\u203A"}
          </button>
          <button onClick={() => setPageNum(lastPageNum)} className={pageNum === lastPageNum ? "disbtn" : ""}>
            {"\u00BB"}
          </button>
        </div>
      )}
      <EditModal editRow={editRow} setEditRow={setEditRow} adminData={adminData} setAdminData={setAdminData} />
    </div>
  );
}

export default Table;
