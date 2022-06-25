import React from "react";

import "./EditModal.css";

import cross from "../../Assets/images/cross.svg";

function EditModal({ editRow: { id, name, email, role }, setEditRow, setAdminData }) {
  // submit and save changes for the select record
  function handleSubmit(event) {
    event.preventDefault();

    setAdminData((adminData) => {
      adminData.forEach((data) => {
        // find the record selected record and edit it
        if (data.id === id) {
          data.name = document.getElementById("edit-modal-name").value;
          data.email = document.getElementById("edit-modal-email").value;
          data.role = document.getElementById("edit-modal-role").value;
        }
      });
      return adminData;
    });
    clickCross();
  }

  // close the edit Modal
  function clickCross() {
    // remove modal and add scroll to the HTML Element
    document.querySelector(".edit-modal-background").style.display = "none";
    document.querySelector("html").removeAttribute("style");
    setEditRow({});
  }

  return (
    <div className="edit-modal-background" style={{ display: "none" }}>
      <form onSubmit={handleSubmit}>
        <div key={id} className="edit-modal">
          <img src={cross} className="cross" alt="" onClick={clickCross} />
          <h2>EDIT DATA</h2>
          <span>Name</span>
          <input type="text" id="edit-modal-name" defaultValue={name} placeholder="Enter name" required></input>
          <span>Email</span>
          <input type="email" id="edit-modal-email" defaultValue={email} placeholder="Enter email" required></input>
          <span>Role</span>
          <input type="text" id="edit-modal-role" defaultValue={role} placeholder="Enter role" required></input>
          <button type="submit">SUBMIT</button>
        </div>
      </form>
    </div>
  );
}

export default EditModal;
