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
import Navbar from "../component/navbar/Navbar";

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
    <div
      style={{
        paddingTop: "10px",
        backgroundColor: "black",
        color: "white",
        minHeight: "100vh",
      }}
    >
      {/* <Nav account={account} /> */}
      <Navbar />
      <Grid
        container
        spacing={3}
        style={{
          paddingTop: "10px",
          backgroundColor: "black",
        }}
      >
        <Grid
          item
          xs={12}
          style={{
            backgroundColor: "black",
            color: "white",
          }}
        >
          <Paper
            sx={{
              p: 2,
              display: "flex",
              flexDirection: "column",
              backgroundColor: "black",
              color: "white",
            }}
          >
            <Typography variant="h6" gutterBottom component="div">
              All Documents
            </Typography>
            {docList.length > 0 ? (
              <Table size="small" color="white" width="90%">
                <TableHead>
                  <TableRow>
                    <TableCell
                      //change the font color
                      style={{ color: "white" }}
                    >
                      Name
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      Certificate CID
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      View Document
                    </TableCell>
                    <TableCell style={{ color: "white" }}>Vierified</TableCell>
                    <TableCell style={{ color: "white" }}>
                      Valid Until
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      Verification Status
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      Shareable Link
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {docList.map((doc) => (
                    <TableRow key={doc["documentName"]}>
                      <TableCell style={{ color: "white" }}>
                        {doc["documentName"]}
                      </TableCell>
                      <TableCell style={{ color: "white" }}>
                        {doc["documentCID"]}
                      </TableCell>
                      <TableCell style={{ color: "white" }}>
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
                            marginTop: "10px",
                            marginBottom: "10px",
                          }}
                          // href={`https://gateway.pinata.cloud/ipfs/${doc["documentCID"]}`}
                          // target="_blank"
                          onClick={() => {
                            window.open(
                              `https://gateway.pinata.cloud/ipfs/${doc["documentCID"]}`
                            );
                          }}
                        >
                          View
                        </button>
                      </TableCell>

                      <TableCell style={{ color: "white" }}>
                        {doc["verified"] ? "Yes" : "No"}
                      </TableCell>
                      <TableCell style={{ color: "white" }}>
                        {new Date(
                          doc["validityUpTo"] * 1000
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell style={{ color: "white" }}>
                        {doc["verified"] ? "Verified" : "Pending"}
                      </TableCell>
                      <TableCell style={{ color: "white" }}>
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
                            marginTop: "10px",
                            marginBottom: "10px",
                          }}
                          onClick={() => {
                            window.open(
                              `https://gateway.pinata.cloud/ipfs/${doc["documentCID"]}`
                            );
                          }}

                          // href={`https://gateway.pinata.cloud/ipfs/${doc["documentCID"]}`}
                          // target="_blank"
                        >
                          Share
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                style={{
                  backgroundColor: "black",
                  color: "white",
                }}
              >
                No Documents Found
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      {/* </Container> */}
    </div>
  );
};

export default DocStatus;
