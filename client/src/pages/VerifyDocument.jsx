import React from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Web3 from "web3";
import {
  IDENTITY_CONTRACT_ADDRESS,
  IDENTITY_CONTRACT_ABI,
} from "../contracts/constance";
import FormControlLabel from "@mui/material/FormControlLabel";
import Nav from "../component/Nav";
import NavAdmin from "../component/NavAdmin";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Iframe from "react-iframe";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const VerifyDocument = () => {
  const [identityContract, setIdentityContract] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [docList, setDocList] = React.useState([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [currentDoc, setCurrentDoc] = React.useState(null);
  const [currentIdentity, setCurrentIdentity] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    dob: "",
  });

  const handleClickOpen = async (doc, identityAddress) => {
    //fetch identity
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
    let doc = currentDoc;
    let verify = await identityContract.methods
      .verifyDocument(doc)
      .send({ from: account });
    console.log(verify);

    setOpen(false);
    window.location.reload();
  };

  const close = () => {
    setOpen(false);
  };

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

        const admin = await identityContract.methods
          .admin()
          .call({ from: account });
        if (admin === account) {
          setIsAdmin(true);
        }

        let docList = await identityContract.methods.getAllDocument().call();
        docList = docList.filter((doc) => doc["verified"] === false);
        setDocList(docList);
        console.log(docList);
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
    <>
      {isAdmin ? <NavAdmin account={account} /> : <Nav account={account} />}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom component="div">
              All Documents
            </Typography>
            {docList.length > 0 ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Certificate CID</TableCell>
                    <TableCell>Account</TableCell>
                    <TableCell>Vierified</TableCell>
                    <TableCell>Valid Until</TableCell>
                    <TableCell>Verify</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {docList.map((doc) => (
                    <TableRow key={doc["documentName"]}>
                      <TableCell>{doc["documentName"]}</TableCell>
                      <TableCell>{doc["documentCID"]}</TableCell>
                      <TableCell>{doc["identityAddress"]}</TableCell>

                      <TableCell>{doc["verified"] ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        {new Date(
                          doc["validityUpTo"] * 1000
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => {
                            handleClickOpen(
                              doc["documentCID"],
                              doc["identityAddress"]
                            );
                          }}
                        >
                          View
                        </Button>
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
                              <Typography
                                sx={{ ml: 2, flex: 1 }}
                                variant="h6"
                                component="div"
                              >
                                Verify Document
                              </Typography>
                              <Button
                                autoFocus
                                color="inherit"
                                onClick={handleClose}
                              >
                                Verify
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
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                >
                                  Document Details
                                </Typography>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                >
                                  Document Name: {doc["documentName"]}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                >
                                  Document CID: {doc["documentCID"]}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                >
                                  Document Validity:{" "}
                                  {new Date(
                                    doc["validityUpTo"] * 1000
                                  ).toLocaleDateString()}
                                </Typography>
                              </Paper>
                              <Paper
                                sx={{
                                  p: 2,
                                  display: "flex",
                                  flexDirection: "column",
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                >
                                  Account Details
                                </Typography>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                >
                                  Address: {doc["identityAddress"]}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                >
                                  Name: {currentIdentity["name"]}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                >
                                  Email: {currentIdentity["email"]}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                >
                                  Phone: {currentIdentity["phoneNumber"]}
                                </Typography>
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                >
                                  Account Verified:
                                  {currentIdentity["verified"] ? (
                                    <CheckCircleIcon sx={{ color: "green" }} />
                                  ) : (
                                    <CancelIcon sx={{ color: "red" }} />
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="h6" gutterBottom component="div">
                No Documents Found
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      {/* </Container> */}
    </>
  );
};

export default VerifyDocument;
