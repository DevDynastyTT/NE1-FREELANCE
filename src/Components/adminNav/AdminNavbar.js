import '../../static/css/adminnav.css'
import { AdminNavInfo } from "./AdminNavInfo";

import React from 'react'

function AdminNavbar() {
  return (
    <nav className="AdminNavbar">
        <div className="sidebar">
            <ul className="nav-list">
              {AdminNavInfo.map((val, key)=> {
                return (
                    <li key={key} className="row" id={window.location.pathname == val.link ? "active" : ""}
                    onClick={()=> {window.location.pathname = val.link}}>
                      {" "}
                      <div id="icon"> {val.icon}</div>{" "}
                      <div id="title"> {val.title}</div>
                    </li>
                );
        })}</ul>
        </div>
      
    </nav>
  )
}

export default AdminNavbar
