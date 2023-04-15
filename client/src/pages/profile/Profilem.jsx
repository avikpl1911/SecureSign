import React from "react";
import Navbar from "../../component/navbar/Navbar";
import Loader from "../../style-component/loaderimg/Loader";
import "./profile.css";
import Web3 from "web3";
import {
  IDENTITY_CONTRACT_ADDRESS,
  IDENTITY_CONTRACT_ABI,
} from "../../contracts/constance";
import { useNavigate } from "react-router-dom";
const Profilem = () => {
  const [identityContract, setIdentityContract] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [web3, setWeb3] = React.useState(null);
  const [identity, setIdentity] = React.useState({});

  const navigate = useNavigate();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        const accounts = await web3.eth.requestAccounts();
        const account = accounts[0];
        const identityContract = new web3.eth.Contract(
          IDENTITY_CONTRACT_ABI,
          IDENTITY_CONTRACT_ADDRESS
        );
        setIdentityContract(identityContract);
        setAccount(account);
        setWeb3(web3);

        let identity = await identityContract.methods
          .getIdentity(account)
          .call();
        console.log(identity);
        //convertt arr to obj using destructuring
        console.log(account, identity);
        identity = {
          name: identity["name"],
          email: identity["email"],
          phone: identity["phoneNumber"],
          address: identity["physicalAddress"],
          hasGovCertificate: identity["hasGovCertificate"],
          verified: identity["verified"],
          govCertificateCID: identity["govCertificateCID"],
          documentsCID: identity["documentsCID"],
          govCertificateVerified: identity["govCertificateVerified"],
        };

        setIdentity(identity);
        console.log(identity);
        if (!identity.hasGovCertificate) {
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      window.alert("Please install MetaMask");
    }
  };

  React.useEffect(() => {
    loadWeb3();
  }, []);

  return (
    <div className="body">
      <Navbar />
      <div className="container">
        <div className="containertop">
          {/* <div className="bodyLeftContainer">
            <div className="loaderContai">
              <Loader />
            </div>
          </div> */}
          <div className="accountcontainer">
            <div className="textslm Accountcontai ">
              Account : <span>{account}</span>
            </div>
            <div className="textslm Accountcontai ">
              <span>
                {identity.verified
                  ? "Your profile is verified now"
                  : "Your request is pending. You will be notified once your profile is verified"}
              </span>
            </div>
          </div>
        </div>
        <div
          className="containerbottom textslm"
          style={{
            display: "flex",
          }}
        >
          <div className="bottomleft ">
            <span className="name1 upmargin">Name: {identity.name}</span>
            <span className="email1 upmargin">Email: {identity.email}</span>
            <span className="email1 upmargin">Phone: {identity.phone}</span>
            <span className="Address1 upmargin">Add: {identity.address}</span>
          </div>
          <div className="bottomRight">
            <span className="profilestat upmargin">PROFILE STATUS</span>
            <div className="verficationife upmargin">
              <span
                className="hasveri"
                style={{
                  color: identity.verified ? "#00B87C" : "#FF0000",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {identity.verified ? "Verified" : "Pending"}
                {identity.verified ? (
                  <div className="circle-gov greenbk"></div>
                ) : (
                  <div className="circleveri redbk"></div>
                )}
              </span>
            </div>
            <div className="govdocs upmargin">
              <span
                className="hasgov"
                style={{
                  color: identity.hasGovCertificate ? "#00B87C" : "#FF0000",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {identity.hasGovCertificate
                  ? "Government Certificate Verified"
                  : "Government Certificate Pending"}

                {identity.hasGovCertificate ? (
                  <div className="circle-gov greenbk"></div>
                ) : (
                  <div className="circleveri redbk"></div>
                )}
              </span>
            </div>
            <button
              className="text"
              style={{
                backgroundColor: "#1E1E1E",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "10px 20px",
                fontSize: "1.2rem",
                cursor: "pointer",
                marginTop: "20px",
                marginLeft: "50px",
                border: "1px solid white",
              }}
              onClick={() => {
                // https://gateway.pinata.cloud/ipfs/${identity.govCertificateCID}
                window.open(
                  `https://gateway.pinata.cloud/ipfs/${identity.govCertificateCID}`
                );
              }}
            >
              View Government Document
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profilem;
