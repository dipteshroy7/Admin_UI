import React, { useState, useEffect } from "react";

import "./Table.css";

import editIcon from "../../Assets/images/edit_icon.png";
import trashIcon from "../../Assets/images/trash_icon.png";

import { EditModal } from "..";

function Table() {
  const [search, setSearch] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [selectedData, setSelectedData] = useState([]);
  const [editRow, setEditRow] = useState({});
  const [adminData, setAdminData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [paginationBtns, setPaginationBtns] = useState([]);
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
    let searchedDataLength = searchedData.length;
    let searchedDataExists = searchedDataLength > 0;

    if (searchedDataExists) {
      let lastPage = Math.floor(searchedDataLength / 10);

      if (searchedDataLength % 10 === 0) setLastPageNum(lastPage);
      else setLastPageNum(lastPage + 1);

      let tempPageData = [];

      let start = (pageNum - 1) * 10;
      let end = pageNum === lastPageNum ? searchedDataLength : pageNum * 10;

      for (let i = start; i < end; i++) tempPageData.push(searchedData[i]);

      // filtering null data
      tempPageData = tempPageData.filter((item) => item);

      setPageData(tempPageData);

      // creating an array from 1 to last page number and setting in pagination buttons
      setPaginationBtns([...Array(lastPageNum).keys()].map((x) => ++x));
    }
  }, [adminData, pageNum, lastPageNum, search, searchedData]);

  // page changes to previous page when all the records are deleted of the last page
  useEffect(() => {
    if (pageData.length === 0) setPageNum(lastPageNum);
  }, [pageData, lastPageNum]);

  // unselects all the selected records on page change
  useEffect(() => {
    document.getElementById("select-all").checked = false;
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
    let pageNumGreaterThanOne = pageNum > 1;
    if (pageNumGreaterThanOne) setPageNum((curPage) => curPage - 1);
  }

  // go to next page
  function pageIncrease() {
    let pageNumLessThanLast = pageNum < lastPageNum;
    if (pageNumLessThanLast) setPageNum((curPage) => curPage + 1);
  }

  // open edit modal with selected record
  function editData(_id, _name, _email, _role) {
    setEditRow({ id: _id, name: _name, email: _email, role: _role });

    // show modal and remove scroll to the HTML Element
    document.querySelector("html").style.overflow = "hidden";
    document.querySelector(".edit-modal-background").style.display = "";
  }

  // delete single record
  function deleteData(id) {
    setAdminData(adminData.filter((data) => data.id !== id));
  }

  // delete multiple selected records together
  function deleteMultipleData() {
    if (selectedData.length > 0) {
      setAdminData(adminData.filter((data) => !selectedData.includes(data.id)));
      document.getElementById("select-all").checked = false;
      setSelectedData([]);
    }
  }

  // select a single record
  function selectData(id) {
    let selectedRecord = document.getElementById(id + "_record");
    let selectedRecordActions = document.getElementById(id + "_actions");

    let selectedRecordCheckBox = document.getElementById(id + "_cb").checked;

    if (selectedRecordCheckBox) {
      setSelectedData([...selectedData, id]);
      selectedRecord.style.backgroundColor = "#ddd";
      selectedRecordActions.style.display = "none";
    } else {
      document.getElementById("select-all").checked = false;
      setSelectedData(selectedData.filter((data) => data !== id));
      selectedRecord.removeAttribute("style");
      selectedRecordActions.style.display = "flex";
    }
  }

  // select/unselect all the records of the current page
  function selectMultipleData() {
    let selectAllChecked = document.getElementById("select-all").checked;

    // if checked check all the page data and if unchecked uncheck all the page data
    pageData.forEach(({ id }) => {
      document.getElementById(id + "_cb").checked = selectAllChecked;
      selectData(id);
    });
    if (selectAllChecked) setSelectedData(pageData.map(({ id }) => id));
    else setSelectedData([]);
  }

  // show records according to the search
  function searchData(e) {
    setPageNum(1);
    let searched = e.target.value.toLowerCase().trim();
    setSearch(searched);
  }

  let LeftBtnClass = pageNum === 1 ? "disabled-btn" : "";
  let RightBtnClass = pageNum === lastPageNum ? "disabled-btn" : "";

  let searchedDataExists = searchedData.length > 0;

  return (
    <div className="table">
      <input
        type="text"
        className="search-box"
        onChange={searchData}
        placeholder="Search by name, email or role"
      ></input>
      <div className="table-data">
        <div className="row bold">
          <div className="cell">
            <input type="checkbox" id="select-all" onClick={selectMultipleData}></input>
          </div>
          <div className="cell">Name</div>
          <div className="cell">Email</div>
          <div className="cell">Role</div>
          <div className="cell">Actions</div>
        </div>
        {searchedDataExists &&
          pageData.map(({ id, name, email, role }) => {
            return (
              <div key={id + name} id={id + "_record"} className="row">
                <div className="cell">
                  <input id={id + "_cb"} type="checkbox" onChange={() => selectData(id)}></input>
                </div>
                <div className="cell">{name}</div>
                <div className="cell">{email}</div>
                <div className="cell">{role}</div>
                <div className="cell actions">
                  <div id={id + "_actions"} style={{ display: "flex" }}>
                    <img src={editIcon} alt="" onClick={() => editData(id, name, email, role)}></img>
                    <img src={trashIcon} alt="" onClick={() => deleteData(id)}></img>
                  </div>
                </div>
              </div>
            );
          })}
        {!searchedDataExists && (
          <div className="empty-box">
            <span>NO DATA FOUND</span>
          </div>
        )}
      </div>
      {searchedDataExists && (
        <div className="table-buttons">
          <button className="delete-selected" onClick={deleteMultipleData}>
            Delete Selected
          </button>
          <button onClick={() => setPageNum(1)} className={LeftBtnClass}>
            {"\u00AB"}
          </button>
          <button onClick={pageDecrease} className={LeftBtnClass}>
            {"\u2039"}
          </button>
          {paginationBtns.map((btn) => (
            <button
              key={btn}
              onClick={() => setPageNum(btn)}
              className={`pagination-btns ${pageNum === btn ? " selected-btn" : ""}`}
            >
              {btn}
            </button>
          ))}
          <button onClick={pageIncrease} className={RightBtnClass}>
            {"\u203A"}
          </button>
          <button onClick={() => setPageNum(lastPageNum)} className={RightBtnClass}>
            {"\u00BB"}
          </button>
        </div>
      )}
      <EditModal editRow={editRow} setEditRow={setEditRow} setAdminData={setAdminData} />
    </div>
  );
}

export default Table;
