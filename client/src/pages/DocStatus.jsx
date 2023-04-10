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

const DocStatus = () => {
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
    <>
      <Nav account={account} />
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
                    <TableCell>View Document</TableCell>
                    <TableCell>Vierified</TableCell>
                    <TableCell>Valid Until</TableCell>
                    <TableCell>Verification Status</TableCell>
                    <TableCell>Shareable Link</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {docList.map((doc) => (
                    <TableRow key={doc["documentName"]}>
                      <TableCell>{doc["documentName"]}</TableCell>
                      <TableCell>{doc["documentCID"]}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          href={`https://gateway.pinata.cloud/ipfs/${doc["documentCID"]}`}
                          target="_blank"
                        >
                          View
                        </Button>
                      </TableCell>

                      <TableCell>{doc["verified"] ? "Yes" : "No"}</TableCell>
                      <TableCell>
                        {new Date(
                          doc["validityUpTo"] * 1000
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {doc["verified"] ? "Verified" : "Pending"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          href={`https://gateway.pinata.cloud/ipfs/${doc["documentCID"]}`}
                          target="_blank"
                        >
                          Share
                        </Button>
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

export default DocStatus;
