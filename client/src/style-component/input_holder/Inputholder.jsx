import React from 'react'
import "./inputholder.css"

function Inputholder({placeholder}) {
  return (
    <input placeholder={placeholder} class="input myinputs" name="text" type="text"/>
  )
}

export default Inputholder