import React from 'react'
import "./login.css"
import Navbar from '../../component/navbar/Navbar'
import Identity from '../../svg_componets/Identity'
import Inputholder from '../../style-component/input_holder/Inputholder'
import Loader from '../../style-component/loaderimg/Loader'
import Upload from '../../svg_componets/Upload'

const handleClick = ()=>{
 document.getElementById("takeID").click();
}

function Login() {
    return (
        <div className='body'>

            <Navbar />

            <div className="container">
                <div className="bodyLeft">
                    <div className="bodyLeftContainer">
                        <div className="loaderContainer">
                            <Loader/>
                        </div>
                        <div className="imgPrompt textsl">
                            Img Was not Found ...
                        </div>
                    </div>
                </div>
                <div className="bodyRight">
                    <div className="logoContainer">
                        <div className="Accountcontainer textsl">Account : <span>0x1843AA64120cF91aee61db54b4C77F950724a160</span></div>
                        <Identity/>
                        <div className="textlogo textsl">Register Your Identity.</div>
                    </div>
                    <div className="formContainer">
                      <Inputholder placeholder="Name"/>
                      <Inputholder placeholder="Email Address"/>
                      <Inputholder placeholder="Phone" />
                      <Inputholder placeholder="Physical Address"/>
                      <div className="buttonscontainer">
                        <div className="uploadfile">
                        <input type="file" id='takeID' className='fileInput'/>
                        <div className="uploadlogo" onClick={handleClick}><Upload/></div>
                        <div className="uploadtext textsl">Upload Most Recent</div>
                        <div className="uploadtext textsl">Goverment ID</div>
                        </div>
                        <div className="submitbutton"><div className="mysubmitbutton"><span className='textsl submitbtntext'>Submit</span></div></div>
                            
                        
                      </div>
                    </div>
                    
                </div>
            </div>


        </div>
    )
}

export default Login