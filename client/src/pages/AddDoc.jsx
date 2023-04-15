import * as React from "react";
import Nav from "../component/Nav";
import Web3 from "web3";
import {
  IDENTITY_CONTRACT_ADDRESS,
  IDENTITY_CONTRACT_ABI,
} from "../contracts/constance";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Inputholder from "../style-component/input_holder/Inputholder";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import Upload from "../svg_componets/Upload";
import Navbar from "../component/navbar/Navbar";

const theme = createTheme();
const handleClick = () => {
  document.getElementById("takeID").click();
};

const AddDoc = () => {
  const [identityContract, setIdentityContract] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [web3, setWeb3] = React.useState(null);
  const [identity, setIdentity] = React.useState({});
  const [docName, setDocName] = React.useState("");
  const [docCID, setDocCID] = React.useState("");
  const [doc, setDoc] = React.useState(null);
  const [docUploading, setDocUploading] = React.useState(false);

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

  const handleUpload = async () => {
    if (doc && docName) {
      setDocUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", doc);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: process.env.REACT_APP_PINATA_API,
            pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET,
            "Content-Type": "multipart/form-data",
          },
        });

        console.log(resFile.data.IpfsHash);
        setDocCID(resFile.data.IpfsHash);
        setDocUploading(false);

        const res = await identityContract.methods
          .uploadDocument(resFile.data.IpfsHash, docName)
          .send({ from: account });
        console.log(res);

        navigate("/status");
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
        setDocUploading(false);
      }
    }
  };

  React.useEffect(() => {
    loadWeb3();
  }, []);
  return (
    <div
      style={{
        paddingTop: "10px",
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
      }}
    >
      {identity.verified ? (
        <ThemeProvider theme={theme}>
          {/* <Nav account={account} /> */}
          <Navbar />
          {/* <Box
            sx={{ display: "flex" }}
            style={{
              paddingTop: "10px",
              backgroundColor: "black",
            }}
          > */}

          <div
            className="formContainer"
            style={{
              marginTop: "40px",
            }}
          >
            <h3
              style={{
                color: "white",
                textAlign: "center",
                marginBottom: "20px",
                fontSize: "30px",
              }}
            >
              <b>Upload Document</b>
            </h3>
            <Inputholder
              placeholder="Document/Certificate Name"
              value={docName}
              required
              onChange={(e) => setDocName(e.target.value)}
            />

            <div
              className="buttonscontainer"
              style={{
                marginTop: "40px",
              }}
            >
              <div className="uploadfile">
                <input
                  type="file"
                  id="takeID"
                  className="fileInput"
                  required
                  onChange={(e) => {
                    if (e.target.files[0].size > 4000000) {
                      alert("File size should be less than 4mb");
                    } else {
                      setDoc(e.target.files[0]);
                      console.log(e.target.files[0].name);
                    }
                  }}
                />
                <div className="uploadlogo" onClick={handleClick}>
                  <Upload />
                </div>
                <div className="uploadtext textsl">
                  {doc ? doc.name : "Upload Document/Certificate"}
                </div>
              </div>
              <div className="submitbutton">
                <div
                  className="mysubmitbutton"
                  onClick={async (e) => {
                    e.preventDefault();
                    handleUpload();
                  }}
                >
                  <span className="textsl submitbtntext">
                    {" "}
                    {docUploading ? "Uploading" : "Upload"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* </Box> */}
        </ThemeProvider>
      ) : (
        <ThemeProvider theme={theme}>
          {/* <Nav account={account} /> */}
          <Navbar />
          <main
            sx={{
              backgroundColor: "black",
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="white"
              gutterBottom
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              You are not verified yet
            </Typography>
            <Typography
              component="h2"
              variant="h6"
              color="white"
              gutterBottom
              style={{ textAlign: "center" }}
            >
              To add document you need to verify your identity
            </Typography>
          </main>
        </ThemeProvider>
      )}
    </div>
  );
};

export default AddDoc;
