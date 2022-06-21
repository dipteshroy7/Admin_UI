import React from "react";

import "./EditModal.css";

import cross from "../../Assets/images/cross.svg";

function EditModal({ editRow: { id, name, email, role }, setEditRow, adminData, setAdminData }) {
  // submit and save changes for the select record
  function handleSubmit(event) {
    event.preventDefault();
    let nm = document.getElementById("e_name").value;
    let em = document.getElementById("e_email").value;
    let rl = document.getElementById("e_role").value;
    let temp = [...adminData];

    temp.forEach((data) => {
      if (data.id === id) {
        data.name = nm;
        data.email = em;
        data.role = rl;
      }
    });
    setAdminData(temp);
    clickCross();
  }

  // close the edit Modal
  function clickCross() {
    document.querySelector(".edit_modal_background").style.display = "none";
    document.querySelector("html").removeAttribute("style");
    setEditRow({});
  }

  return (
    <div className="edit_modal_background" style={{ display: "none" }}>
      <form onSubmit={handleSubmit}>
        <div key={id} className="edit_modal">
          <img src={cross} className="cross" alt="" onClick={clickCross} />
          <h2>EDIT DATA</h2>
          <span>Name</span>
          <input type="text" id="e_name" defaultValue={name} placeholder="Enter name" required></input>
          <span>Email</span>
          <input type="email" id="e_email" defaultValue={email} placeholder="Enter email" required></input>
          <span>Role</span>
          <input type="text" id="e_role" defaultValue={role} placeholder="Enter role" required></input>
          <button type="submit">SUBMIT</button>
        </div>
      </form>
    </div>
  );
}

export default EditModal;
