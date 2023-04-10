import * as React from "react";
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
import NavAdmin from "../component/NavAdmin";


const AdminHome = () => {
  const [identityContract, setIdentityContract] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [pendingIdentities, setPendingIdentities] = React.useState([]);

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
        //check if user is admin
        let isAdmin = await identityContract.methods.admin().call();
        if (isAdmin !== account) {
          navigate("/");
        }

        //get all identities that have not been verified
        let identities = await identityContract.methods.getIdentities().call();
        console.log(identities);
        //convertt arr to obj using destructuring
        identities = identities.map((identity) => {
          return {
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
        });
        console.log(identities);
        //only get identities that have not been verified
        identities = identities.filter((identity) => !identity.verified);

        setPendingIdentities(identities);
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
      <NavAdmin account={account} />
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
            <Typography variant="h6" gutterBottom component="div">
              Pending Identities
            </Typography>
            {pendingIdentities.length > 0 ? (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Has Gov Certificate</TableCell>
                    <TableCell>Gov Certificate CID</TableCell>
                    <TableCell>View Certificate</TableCell>
                    <TableCell>Gov Certificate Verified</TableCell>
                    <TableCell>Verify</TableCell>
                    <TableCell>Reject</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pendingIdentities.map((identity) => (
                    <TableRow key={identity.name}>
                      <TableCell>{identity.name}</TableCell>
                      <TableCell>{identity.email}</TableCell>
                      <TableCell>{identity.phone}</TableCell>
                      <TableCell>{identity.address}</TableCell>
                      <TableCell>
                        {identity.hasGovCertificate ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        {identity.govCertificateCID
                          ? identity.govCertificateCID
                          : "N/A"}
                      </TableCell>

                      <TableCell>
                        {identity.govCertificateCID ? (
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => {
                              window.open(
                                `https://gateway.pinata.cloud/ipfs/${identity.govCertificateCID}`
                              );
                            }}
                          >
                            View
                          </Button>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        {identity.govCertificateVerified ? "Yes" : "No"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="success"
                          onClick={() => {
                            identityContract.methods
                              .verifyGovCertificate(identity.govCertificateCID)
                              .send({ from: account })
                              .then((res) => {
                                console.log(res);
                                window.location.reload();
                              })
                              .catch((err) => {
                                console.log(err);
                              });
                          }}
                        >
                          Verify
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => {
                            identityContract.methods
                              .rejectUser(identity.address)
                              .send({ from: account })
                              .then((res) => {
                                console.log(res);
                                window.location.reload();
                              })
                              .catch((err) => {
                                console.log(err);
                              });
                          }}
                        >
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography variant="h6" gutterBottom component="div">
                No pending identities
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      {/* </Container> */}
    </>
  );
};

export default AdminHome;
