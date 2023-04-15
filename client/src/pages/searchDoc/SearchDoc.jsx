import React from 'react'
import "./searchDoc.css"
import Navbar from '../../component/navbar/Navbar'

import Inputholder from '../../style-component/input_holder/Inputholder'

function SearchDoc() {
  return (
    <div className='body'>
        <div className="navbarContainer"><Navbar/></div>
        <div className="container">
             <div className="searchContai">
                <span className='textsm'>Search For the Document With CID...</span>
                <Inputholder placeholder="Enter Your CID"/>
             </div>
        </div>
        
    </div>
  )
}

export default SearchDoc