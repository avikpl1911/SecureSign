import React from 'react'
import "./findDocument.css"
import { useState } from 'react'
import Cross from '../../svg_componets/Cross'
import Navbar from '../../component/navbar/Navbar'


function FindDocument() {
    const [isPressed, setisPressed] = useState(false)
    return (
        <div className="conatiner">
            <div class="box">
                <div className="navbarcontainer"><Navbar/></div>


                <div className="MainContainer">
                   <span className='textsl heading'>All Documents</span>
                   <div className="documentinfoguide">
                    <span className='textsl tlc name'>Name</span>
                    <span className='textsl tlc CID'>certificate CID</span>
                    <span className='textsl tlc vdoc'>View Document</span> 
                    <span className='textsl tlc VU'>Valid Until</span>
                    <span className='textsl tlc VS'>Verification status</span>
                    <span className='textsl tlc SL'>Share</span>
                   </div>
                   <div className="documentinforow">
                    {/* mapthis */}

                       <div className="documentonerow">
                        <span className='textsl tlc pa name infor'>Name</span>
                        <span className='textsl tlc pa CID infor'>certificate CID</span>
                        <div className='textsl tlc  vdoc'><div className="mauto" onClick={() => { setisPressed(true) }}>View Document</div></div> 
                        <span className='textsl tlc pa VU'>Valid Until</span>
                        <span className='textsl tlc pa VS'>Verification status</span>
                        <div className='textsl tlc  SL'> <div className="mauto">Share</div>  </div>
                       </div>
                       
                   </div>
                   
                </div>
                
                
                <div class={`hid-box ${isPressed && "ntop"}`}>

                    <div className="topbar">    
                        <div onClick={() => { setisPressed(false) }} className="closeButton"><Cross/></div>
                    </div> 

                <div className="docContainer">
                    <div className="docContainerLeft">
                   
                    </div>
                    <div className="docContainerRight">
                       {/* pdf */}
                    </div>
                </div>  
                </div>

            </div>

        </div>

    )
}

export default FindDocument