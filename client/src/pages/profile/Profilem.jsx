import Navbar from "../../component/navbar/Navbar"
import Loader from "../../style-component/loaderimg/Loader"
import "./profile.css"

function Profilem() {
  return (
    <div className="body">

      <Navbar/>
     <div className="container">
      <div className="containertop">
      <div className="bodyLeftContainer">
                        <div className="loaderContai">
                            <Loader/>
                        </div>
                        
                    </div>
                    <div className="accountcontainer">
                        <div className="textslm Accountcontai ">Account : <span>0x1843AA64120cF91aee61db54b4C77F950724a160</span></div>
                        <div className="textslm Accountcontai "><span>Your request is pending. You will be notified once your profile is verified.</span></div>
                        </div>
                        
      </div>
      <div className="containerbottom textslm">
            <div className="bottomleft ">
              <span className="name1 upmargin">Avik Paul</span>
              <span className="email1 upmargin">avikpl1911@gmail.com</span>
              <span className="Address1 upmargin">sdkjahfjksahfkajsdhf</span>
            </div>
            <div className="bottomRight">
              <span className="profilestat upmargin">PROFILE STATUS</span>
              <div className="verficationife upmargin"><span className="hasveri">is not Verified</span><div className="circleveri redbk"></div></div>
              <div className="govdocs upmargin"><span className="hasgov">Has Gov Documents</span><div className="circle-gov greenbk"></div> </div>
            </div>

      </div>
     </div>

    </div>
  )
}

export default Profilem