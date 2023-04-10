import * as React from "react";
import Nav from "../component/Nav";
import Web3 from "web3";
import {
  IDENTITY_CONTRACT_ADDRESS,
  IDENTITY_CONTRACT_ABI,
} from "../contracts/constance";
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
} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { CircularProgress } from "@mui/material";
import axios from "axios";

const theme = createTheme();

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
    <>
      {identity.verified ? (
        <ThemeProvider theme={theme}>
          <Nav account={account} />
          <Box sx={{ display: "flex" }}>
            <Box
              component="main"
              sx={{
                backgroundColor: (theme) =>
                  theme.palette.mode === "light"
                    ? theme.palette.grey[100]
                    : theme.palette.grey[900],
                flexGrow: 1,
                height: "100vh",
                overflow: "auto",
              }}
            >
              <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={8} lg={9}>
                    <Paper
                      sx={{ p: 2, display: "flex", flexDirection: "column" }}
                    >
                      <Typography
                        component="h2"
                        variant="h6"
                        color="primary"
                        gutterBottom
                      >
                        Add Document
                      </Typography>
                      <Box sx={{ pt: 4 }}>
                        <form noValidate autoComplete="off">
                          <Grid
                            container
                            spacing={3}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Grid item xs={12} md={6}>
                              <TextField
                                required
                                id="docName"
                                name=" docName"
                                label="Document Name"
                                fullWidth
                                autoComplete="docName"
                                onChange={(e) => {
                                  setDocName(e.target.value);
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} md={6}>
                              <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="govtId"
                                type="file"
                                id="govtId"
                                autoComplete="govtId"
                                onChange={(e) => {
                                  //it should be meore than 4 mb
                                  if (e.target.files[0].size > 4000000) {
                                    alert("File size should be less than 4mb");
                                  } else {
                                    setDoc(e.target.files[0]);
                                  }
                                }}
                              />
                            </Grid>
                            {/* <Grid item xs={12}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    color="secondary"
                                    name="saveAddress"
                                    value="yes"
                                  />
                                }
                                label="I want to save my address for next time"
                              />
                            </Grid> */}
                          </Grid>
                          <Box sx={{ pt: 2 }}>
                            <Button
                              color="primary"
                              variant="contained"
                              onClick={async (e) => {
                                e.preventDefault();
                                handleUpload();
                              }}
                            >
                              {docUploading ? (
                                <CircularProgress color="secondary" size={20} />
                              ) : (
                                "Upload"
                              )}
                            </Button>
                          </Box>
                        </form>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          </Box>
        </ThemeProvider>
      ) : (
        <ThemeProvider theme={theme}>
          <Nav account={account} />
          <main
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === "light"
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: "100vh",
              overflow: "auto",
            }}
          >
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              You are not verified yet
            </Typography>
            <Typography
              component="h2"
              variant="h6"
              color="primary"
              gutterBottom
              style={{ textAlign: "center" }}
            >
              To add document you need to verify your identity
            </Typography>
          </main>
        </ThemeProvider>
      )}
    </>
  );
};

export default AddDoc;
