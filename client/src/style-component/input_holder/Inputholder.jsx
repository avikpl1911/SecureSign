import React from "react";
import "./inputholder.css";

function Inputholder({ placeholder, value, onChange }) {
  return (
    <input
      placeholder={placeholder}
      class="input myinputs"
      name="text"
      value={value}
      onChange={onChange}
      type="text"
    />
  );
}

export default Inputholder;
