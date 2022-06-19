import React, { useState, useEffect } from "react";

import "./Table.css";

import edit_icon from "../../Assets/images/edit_icon.png";
import trash_icon from "../../Assets/images/trash_icon.png";

function Table() {
  const [adminData, setAdminData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [btns, setBtns] = useState([]);
  const [pageNum, setPageNum] = useState(1);
  const [lastPageNum, setLastPageNum] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json");
      const data = await response.json();
      // console.log(data);
      setAdminData(data);
    };
    fetchData().catch(console.error);
  }, []);

  useEffect(() => {
    let length = adminData.length;
    if (length > 0) {
      if (length % 10 === 0) setLastPageNum(Math.floor(length / 10));
      else setLastPageNum(Math.floor(length / 10) + 1);
      let temp = [];
      for (let i = (pageNum - 1) * 10; i < (pageNum === lastPageNum ? adminData.length : pageNum * 10); i++) {
        temp.push(adminData[i]);
      }
      setPageData(temp.filter((item) => item));
      setBtns([...Array(lastPageNum).keys()].map((x) => ++x));
    }
  }, [adminData, pageNum, lastPageNum]);

  // useEffect(() => {
  //   console.log(pageData);
  // }, [pageData]);

  function pageDecrease() {
    if (pageNum > 1) setPageNum(pageNum - 1);
  }
  function pageIncrease() {
    if (pageNum < lastPageNum) setPageNum(pageNum + 1);
  }

  return (
    <div className="table">
      <input type="text" className="search_box" placeholder="Search by name, email or role"></input>
      <div className="table_data">
        <div className="row bold">
          <div className="cell">
            <input type="checkbox" className="select_all"></input>
          </div>
          <div className="cell">Name</div>
          <div className="cell">Email</div>
          <div className="cell">Role</div>
          <div className="cell">Actions</div>
        </div>
        {pageData.length > 0 &&
          pageData.map(({ id, name, email, role }) => {
            return (
              <div key={id} className="row">
                <div className="cell">
                  <input type="checkbox" className="select_all"></input>
                </div>
                <div className="cell">{name}</div>
                <div className="cell">{email}</div>
                <div className="cell">{role}</div>
                <div className="cell actions">
                  <img src={edit_icon} alt=""></img>
                  <img src={trash_icon} alt=""></img>
                </div>
              </div>
            );
          })}
      </div>
      <div className="table_buttons">
        <button className="delete_selected">Delete Selected</button>
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
    </div>
  );
}

export default Table;
