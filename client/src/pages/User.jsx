import * as React from "react";
import Nav from "../component/Nav";
import Web3 from "web3";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Profile from "../component/Profile";
import {
  IDENTITY_CONTRACT_ADDRESS,
  IDENTITY_CONTRACT_ABI,
} from "../contracts/constance";

const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const theme = createTheme();

const User = () => {
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
    <>
      <ThemeProvider theme={theme}>
        <Nav account={account} />
        <CssBaseline />

        <main>
          {/* Hero unit */}
          <Box
            sx={{
              bgcolor: "background.paper",
              pt: 8,
              pb: 6,
            }}
          >
            <Container maxWidth="sm">
              <Typography
                component="p"
                variant="p"
                align="center"
                color="text.primary"
                gutterBottom
                //style it
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  // letterSpacing: ".1rem",
                  fontSize: "1rem",
                  bgcolor: "background.paper",
                  border: 1,
                  borderColor: "text.primary",
                  borderRadius: 1,
                  p: 1,
                }}
              >
                Account : {account}
              </Typography>
            </Container>
          </Box>
          {
            //if profile verified then show profile write you are verified now otherwise Your request is pending. You will be notified once your profile is verified.

            identity.verified ? (
              <Typography
                component="p"
                variant="p"
                align="center"
                color="text.primary"
                gutterBottom
                //style it
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  // letterSpacing: ".1rem",
                  fontSize: "1rem",
                  marginBottom: "1rem",
                }}
              >
                Your profile is verified now
              </Typography>
            ) : (
              <Typography
                component="p"
                variant="p"
                align="center"
                color="text.primary"
                gutterBottom
                //style it
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 700,
                  // letterSpacing: ".1rem",
                  fontSize: "1rem",
                  marginBottom: "1rem",
                }}
              >
                Your request is pending. You will be notified once your profile
                is verified.
              </Typography>
            )
          }
          <Profile
            name={identity.name}
            email={identity.email}
            phone={identity.phone}
            address={identity.address}
            imageUrl={`https://gateway.pinata.cloud/ipfs/${identity.govCertificateCID}`}
            verified={identity.verified}
            hasGovCertificate={identity.hasGovCertificate}
          />
        </main>
      </ThemeProvider>
    </>
  );
};

export default User;
