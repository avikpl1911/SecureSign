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

const CheckAuth = () => {
  const [identityContract, setIdentityContract] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [docCID, setDocCID] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [docDetails, setDocDetails] = React.useState({});
  const [userDeatils, setUserDetails] = React.useState({});

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
    const validity = await identityContract.methods
      .isVerified(docCID)
      .call({ from: account });
    console.log(validity);
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
                  Verify Document
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
                  Verify
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}></Grid>
        </Grid>
      </Container>
    </>
  );
};

export default CheckAuth;
