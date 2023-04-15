import React from "react";
import "./findDocument.css";
import { useState } from "react";
import Cross from "../../svg_componets/Cross";
import Navbar from "../../component/navbar/Navbar";
import Web3 from "web3";
import { useNavigate } from "react-router-dom";
import {
  IDENTITY_CONTRACT_ADDRESS,
  IDENTITY_CONTRACT_ABI,
} from "../../contracts/constance";

const FindDocument = () => {
  const [isPressed, setisPressed] = useState(false);
  const [identityContract, setIdentityContract] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [docList, setDocList] = React.useState([]);

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
        console.log(identityContract);
        setIdentityContract(identityContract);
        setAccount(account);

        let docList = await identityContract.methods
          .getDocuments(account)
          .call();
        console.log(docList);
        setDocList(docList);
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
    <div className="conatiner">
      <div class="box">
        <div className="navbarcontainer">
          <Navbar />
        </div>

        <div className="MainContainer">
          <span className="textsl heading">All Documents</span>
          <div className="documentinfoguide">
            <span className="textsl tlc name">Name</span>
            <span className="textsl tlc CID">certificate CID</span>
            <span className="textsl tlc vdoc">View Document</span>
            <span className="textsl tlc VU">Valid Until</span>
            <span className="textsl tlc VS">Verification status</span>
            <span className="textsl tlc SL">Share</span>
          </div>
          {/* <div className="documentinforow">
            <div className="documentonerow">
              <span className="textsl tlc pa name infor">Hii</span>
              <span className="textsl tlc pa CID infor">certificate CID</span>
              <div className="textsl tlc  vdoc">
                <div
                  className="mauto"
                  onClick={() => {
                    setisPressed(true);
                  }}
                >
                  View Document
                </div>
              </div>
              <span className="textsl tlc pa VU">Valid Until</span>
              <span className="textsl tlc pa VS">Verification status</span>
              <div className="textsl tlc  SL">
                {" "}
                <div className="mauto">Share</div>{" "}
              </div>
            </div>
          </div> */}

          {docList.length > 0 ? (
            docList.map((doc) => {
              return (
                <div className="documentinforow">
                  <div className="documentonerow">
                    <span className="textsl tlc pa name infor">{doc.name}</span>
                    <span className="textsl tlc pa CID infor">{doc.cid}</span>
                    <div className="textsl tlc  vdoc">
                      <div
                        className="mauto"
                        onClick={() => {
                          setisPressed(true);
                        }}
                      >
                        View Document
                      </div>
                    </div>
                    <span className="textsl tlc pa VU">{doc.validUntil}</span>
                    <span className="textsl tlc pa VS">{doc.verified}</span>
                    <div className="textsl tlc  SL">
                      {" "}
                      <div className="mauto">Share</div>{" "}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="documentinforow">
              <div className="documentonerow">
                <span className="textsl tlc pa name infor">
                  No Documents Found
                </span>
              </div>
            </div>
          )}
        </div>

        <div class={`hid-box ${isPressed && "ntop"}`}>
          <div className="topbar">
            <div
              onClick={() => {
                setisPressed(false);
              }}
              className="closeButton"
            >
              <Cross />
            </div>
          </div>

          <div className="docContainer">
            <div className="docContainerLeft"></div>
            <div className="docContainerRight">{/* pdf */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindDocument;
