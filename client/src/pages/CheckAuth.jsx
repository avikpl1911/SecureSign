import React from "react";
import Web3 from "web3";
import {
  IDENTITY_CONTRACT_ADDRESS,
  IDENTITY_CONTRACT_ABI,
} from "../contracts/constance";
import FormControlLabel from "@mui/material/FormControlLabel";
import Nav from "../component/Nav";
import NavAdmin from "../component/NavAdmin";

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

const CheckAuth = () => {
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
    <>
      {isAdmin ? <NavAdmin account={account} /> : <Nav account={account} />}

      <Container
        style={{
          marginTop: "100px",
        }}
      >
        <Grid container spacing={1}>
          <Grid item xs={12} sm={6}>
            <Paper>
              <Box sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Check Document
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      id="docCID"
                      name="docCID"
                      label="Document CID"
                      fullWidth
                      autoComplete="docCID"
                      onChange={(e) => setDocCID(e.target.value)}
                    />
                  </Grid>
                  {/* <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      id="address"
                      name="address"
                      label="Address"
                      fullWidth
                      autoComplete="address"
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Grid> */}
                </Grid>
                <Button
                  variant="contained"
                  style={{
                    marginTop: "20px",
                  }}
                  onClick={checkValidity}
                >
                  {docLoading ? "Loading..." : "Check Document"}
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}></Grid>
        </Grid>
        <Dialog
          fullScreen
          open={open}
          onClose={close}
          TransitionComponent={Transition}
        >
          <AppBar sx={{ position: "relative" }}>
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
              width: "100vw",
              overflow: "auto",
            }}
          >
            <Grid item xs={6}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" gutterBottom component="div">
                  Document Details
                </Typography>
                <Typography variant="h6" gutterBottom component="div">
                  Document Name: {datas[1].documentName}
                </Typography>
                <Typography variant="h6" gutterBottom component="div">
                  Document CID: {datas[1].documentCID}
                </Typography>
                <Typography variant="h6" gutterBottom component="div">
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
                <Typography variant="h6" gutterBottom component="div">
                  Document Validity:{" "}
                  {new Date(datas[1].validityUpTo * 1000).toDateString()}
                </Typography>
              </Paper>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Typography variant="h6" gutterBottom component="div">
                  Account Details
                </Typography>
                <Typography variant="h6" gutterBottom component="div">
                  Address: {datas[1].identityAddress}
                </Typography>
                <Typography variant="h6" gutterBottom component="div">
                  Name: {currentIdentity["name"]}
                </Typography>
                <Typography variant="h6" gutterBottom component="div">
                  Email: {currentIdentity["email"]}
                </Typography>

                <Typography variant="h6" gutterBottom component="div">
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
            <Grid item xs={6}>
              <Paper
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
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
      </Container>
    </>
  );
};

export default CheckAuth;
