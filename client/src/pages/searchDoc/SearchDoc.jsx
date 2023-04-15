import React from "react";
import "./searchDoc.css";
import Navbar from "../../component/navbar/Navbar";

import Inputholder from "../../style-component/input_holder/Inputholder";
import Web3 from "web3";
import {
  IDENTITY_CONTRACT_ADDRESS,
  IDENTITY_CONTRACT_ABI,
} from "../../contracts/constance";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Iframe from "react-iframe";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const SearchDoc = () => {
  const [identityContract, setIdentityContract] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [docCID, setDocCID] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [docDetails, setDocDetails] = React.useState({});
  const [userDeatils, setUserDetails] = React.useState({});
  const [docLoading, setDocLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [currentDoc, setCurrentDoc] = React.useState(null);
  const [currentIdentity, setCurrentIdentity] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
  });

  const [datas, setData] = React.useState(
    {
      0: false,
      1: {
        documentCID: "",
        identityAddress: "",
        timestamp: "",
        verified: false,
      },
    },
    []
  );

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

        const admin = await identityContract.methods
          .admin()
          .call({ from: account });
        if (admin === account) {
          setIsAdmin(true);
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

  const checkValidity = async () => {
    setDocLoading(true);
    const data = await identityContract.methods
      .isVerified(docCID)
      .call({ from: account });
    setData(data);
    setDocLoading(false);
    handleClickOpen(data[1].documentCID, data[1].identityAddress);
    console.log(datas);
  };

  const handleClickOpen = async (doc, identityAddress) => {
    //fetch identity
    console.log(datas);
    setCurrentIdentity({
      name: "",
      email: "",
      phone: "",
      address: "",
      dob: "",
    });
    let identity = await identityContract.methods
      .getIdentity(identityAddress)
      .call();
    setCurrentIdentity(identity);
    console.log(identity);
    setCurrentDoc(doc);
    setOpen(true);
  };

  const handleClose = async () => {
    setOpen(false);
    // window.location.reload();
  };

  const close = () => {
    setOpen(false);
  };
  return (
    <div className="body">
      <div className="navbarContainer">
        <Navbar />
      </div>
      <div className="container">
        <span
          className="textsm"
          style={{
            marginTop: "20px",
            margin: "auto",
          }}
        >
          Search For the Document With CID...
        </span>
        <div
          className="searchContai"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
            marginTop: "0px",
          }}
        >
          <Inputholder
            placeholder="Enter Your CID"
            value={docCID}
            onChange={(e) => setDocCID(e.target.value)}
          />
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
            }}
            onClick={() => checkValidity()}
            disabled={docCID === ""}
          >
            {docLoading ? "Loading..." : "Check Document"}
          </button>
        </div>
        <Dialog
          fullScreen
          open={open}
          onClose={close}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative", backgroundColor: "#1E1E1E" }}>
            <Toolbar>
              <IconButton
                edge="start"
                color="inherit"
                onClick={close}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                Document Details
              </Typography>
              <Button autoFocus color="inherit" onClick={handleClose}>
                Close
              </Button>
            </Toolbar>
          </AppBar>

          <Grid
            container
            spacing={3}
            style={{
              height: "100vh",
              // width: "100vw",
              overflow: "auto",
              backgroundColor: "#1E1E1E",
            }}
          >
            <Grid item xs={6}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#1E1E1E",
                }}
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  component="div"
                  style={{
                    color: "#e8eaed",
                  }}
                >
                  Document Details
                </Typography>
                <Typography
                  style={{
                    color: "#e8eaed",
                  }}
                  variant="h6"
                  gutterBottom
                  component="div"
                >
                  Document Name: {datas[1].documentName}
                </Typography>
                <Typography
                  style={{
                    color: "#e8eaed",
                  }}
                  variant="h6"
                  gutterBottom
                  component="div"
                >
                  Document CID: {datas[1].documentCID}
                </Typography>
                <Typography
                  style={{
                    color: "#e8eaed",
                    display: "flex",
                    alignItems: "center",
                  }}
                  variant="h6"
                  gutterBottom
                  component="div"
                >
                  Document Verified:{" "}
                  {datas[1].verified ? "Verified" : "Not Verified"}
                  {datas[1].verified ? (
                    <CheckCircleIcon
                      sx={{ color: "green", marginLeft: "10px" }}
                    />
                  ) : (
                    <CancelIcon sx={{ color: "red", marginLeft: "10px" }} />
                  )}
                </Typography>
                <Typography
                  style={{
                    color: "#e8eaed",
                  }}
                  variant="h6"
                  gutterBottom
                  component="div"
                >
                  Document Validity:{" "}
                  {new Date(datas[1].validityUpTo * 1000).toDateString()}
                </Typography>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#1E1E1E",
                }}
              >
                <Typography
                  style={{
                    color: "#e8eaed",
                  }}
                  variant="h6"
                  gutterBottom
                  component="div"
                >
                  Account Details
                </Typography>
                <Typography
                  style={{
                    color: "#e8eaed",
                  }}
                  variant="h6"
                  gutterBottom
                  component="div"
                >
                  Address: {datas[1].identityAddress}
                </Typography>
                <Typography
                  style={{
                    color: "#e8eaed",
                  }}
                  variant="h6"
                  gutterBottom
                  component="div"
                >
                  Name: {currentIdentity["name"]}
                </Typography>
                <Typography
                  style={{
                    color: "#e8eaed",
                  }}
                  variant="h6"
                  gutterBottom
                  component="div"
                >
                  Email: {currentIdentity["email"]}
                </Typography>

                <Typography
                  style={{
                    color: "#e8eaed",
                    display: "flex",
                    alignItems: "center",
                  }}
                  variant="h6"
                  gutterBottom
                  component="div"
                >
                  Account Verified:
                  {currentIdentity["verified"] ? "Verified" : "Not Verified"}
                  {currentIdentity["verified"] ? (
                    <CheckCircleIcon
                      sx={{ color: "green", marginLeft: "10px" }}
                    />
                  ) : (
                    <CancelIcon sx={{ color: "red", marginLeft: "10px" }} />
                  )}
                </Typography>
              </Paper>
            </Grid>
            <Grid
              item
              xs={6}
              style={{
                backgroundColor: "#1E1E1E",
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  backgroundColor: "#1E1E1E",
                }}
              >
                <Iframe
                  url={`https://gateway.pinata.cloud/ipfs/${currentDoc}`}
                  width="100%"
                  height="100%"
                  id=""
                  className=""
                  display="block"
                  position="relative"
                />
              </Paper>
            </Grid>
          </Grid>
        </Dialog>
      </div>
    </div>
  );
};

export default SearchDoc;
