import React from "react";
import "./navbar.css";
import Logo from "../../svg_componets/Logo";
import User from "../../svg_componets/User";
import { useState } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [display, setDisplay] = useState(false);
  return (
    <div
      className="navbar"
      style={{
        width: "96%",
        margin: "auto",
      }}
    >
      <div className="navbar-left">
        <div className="logocontainer">
          <Logo />
          <Link className="text logoname" to="/">
            SecureSign
          </Link>
        </div>
      </div>
      <div
        className="navbar-center"
        style={{
          width: "70%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <Link
          to="/profilenew"
          style={{
            textDecoration: "none",
            fontSize: "1.5rem",
          }}
        >
          <span className="text navlink">Dashboard</span>
        </Link>
        <Link
          to="/add"
          style={{
            textDecoration: "none",
            fontSize: "1.5rem",
          }}
        >
          <span className="text navlink">Add Document</span>
        </Link>
        <Link
          to="/status"
          style={{
            textDecoration: "none",
            fontSize: "1.5rem",
          }}
        >
          <span className="text navlink">Document Status</span>
        </Link>
        <Link
          to="/searchDoc"
          style={{
            textDecoration: "none",
            fontSize: "1.5rem",
          }}
        >
          <span className="text navlink">Search Document</span>
        </Link>
      </div>
      <div className="navbar-right">
        <div
          className="usericoncontainer"
          onClick={() => {
            setDisplay(!display);
          }}
        >
          <User />
        </div>
        <div className={`usertextconatiner ${!display && "nodisplay"}`}>
          <span className="text login spacedown text-box">Login</span>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
