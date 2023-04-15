import React from 'react'
import "./homepage.css"
import Navbar from '../../component/navbar/Navbar'
import Eth from '../../style-component/Eth'

export const HomePage = () => {
  return (
    <div className="body">
        <div className="navbarcontainer"><Navbar/></div>
        <div className="bodycontainer">
           <div className="bodyconatinerleft">
               <Eth/>
           </div>
           <div className="bodycontainerright">
              <p className='text1 heading'>About DocVerify.</p>
              <p className='text lower'>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
           </div>
        </div>
        
    </div>
  )
}
