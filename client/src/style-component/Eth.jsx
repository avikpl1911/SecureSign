import React from "react";
import Ethlogo from "../svg_componets/Ethlogo";
import "./eth.css";

function Eth() {
  return (
    <div class="card">
      <Ethlogo />
      <div class="textBox">
        <p class="text head">SecureSign</p>
        <span className="meu">#SecureSign</span>
        <p class="text price mid">
          Securely verify your identity and documents with blockchain
          technology.
        </p>
      </div>
    </div>
  );
}

export default Eth;
