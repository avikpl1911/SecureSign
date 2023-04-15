import React from 'react'
import "./navbar.css"
import Logo from '../../svg_componets/Logo'
import User from '../../svg_componets/User'
import { useState } from 'react'

function Navbar() {
  const [display,setDisplay]=useState(false)
  return (
    <div className="navbar">
        <div className="navbar-left">
            <div className="logocontainer">
                <Logo/>
                <span className='text logoname'>DocVERIFY</span>
            </div>
            
        </div>
        <div className="navbar-right">
          <div className="usericoncontainer" onClick={()=>{setDisplay(!display)}}>
          <User />
          </div>
          <div className={`usertextconatiner ${!display && "nodisplay"}`}>
          <span className='text login spacedown text-box'>Login</span>
            <span className='text register spacedown text-box'>Register</span>
          </div>
            
        </div>
    </div>
  )
}

export default Navbar