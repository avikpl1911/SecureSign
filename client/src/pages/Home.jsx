import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import { Web3Storage } from "web3.storage";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import {
  IDENTITY_CONTRACT_ADDRESS,
  IDENTITY_CONTRACT_ABI,
} from "../contracts/constance";

const theme = createTheme();
const storage = new Web3Storage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBiNzQ0Y2Q1OGFhMDA1MUQyMkNGNDgwZTJmN0ExZEI2MzEzNDUzODAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzcxMzYzMjc4MzUsIm5hbWUiOiJ0ZXN0aW5nIn0.rVioEmlj8oDKtEGg0DOJge58WuQgtH1xLk-PXEhVcOw",
});
export default function App() {
  const [identityContract, setIdentityContract] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [web3, setWeb3] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isRegistered, setIsRegistered] = React.useState(false);

  //User Details
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [physicalAddress, setPhysicalAddress] = React.useState("");
  // const [fileImg, setFileImg] = React.useState("");
  const [cid, setCid] = React.useState("");
  const [uploading, setUploading] = React.useState(false);

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
        // console.log(identityContract);
        setAccount(account);
        setWeb3(web3);
        const admin = await identityContract.methods
          .admin()
          .call({ from: account });
        if (admin === account) {
          setIsAdmin(true);
          navigate("/admin");
        } else {
          setIsAdmin(false);
          // navigate("/user");
          //check if user is registered
          const isRegistered = await identityContract.methods
            .isRegistered(account)
            .call({ from: account });
          if (isRegistered) {
            setIsRegistered(true);
            navigate("/user");
          } else {
            setIsRegistered(false);
          }
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

  const sendFileToIPFS = async (fileImg) => {
    if (fileImg) {
      console.log("Sending File to IPFS");
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", fileImg);

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
        setCid(resFile.data.IpfsHash);
        setUploading(false);
      } catch (error) {
        console.log("Error sending File to IPFS: ");
        console.log(error);
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && email && phone && physicalAddress && cid) {
      try {
        const res = await identityContract.methods
          .createIdentity(name, email, phone, physicalAddress, cid)
          .send({ from: account });
        console.log(res);
        navigate("/user");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Please fill all the fields");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(https://source.unsplash.com/random)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Typography
            component="p"
            variant="p"
            sx={{
              my: 4,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            Account : {account}
          </Typography>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>

            <Typography component="h1" variant="h5">
              Register Your Identity
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Name"
                name="name"
                autoComplete="name"
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="phone"
                label="Phone"
                type="number"
                id="phone"
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="current-phone"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="physicalAddress"
                label="Physical Address"
                type="text"
                id="physicalAddress"
                onChange={(e) => setPhysicalAddress(e.target.value)}
                autoComplete="current-physicalAddress"
              />
              <Typography component="p" variant="p">
                Upload Any Valid Government ID *
              </Typography>

              <TextField
                margin="normal"
                required
                fullWidth
                name="govtId"
                type="file"
                id="govtId"
                autoComplete="govtId"
                onChange={(e) => {
                  //the file should be an image it can be png or jpeg or jpg
                  console.log(e.target.files[0].type);
                  if (
                    e.target.files[0].type === "image/png" ||
                    e.target.files[0].type === "image/jpeg" ||
                    e.target.files[0].type === "image/jpg"
                  ) {
                    const file = e.target.files[0];
                    // setFileImg(file);
                    sendFileToIPFS(file);
                  } else {
                    alert("Please upload an image file");
                  }
                }}
              />

              <Button
                type="submit"
                fullWidth
                loading={true}
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={uploading}
              >
                {uploading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  "Register"
                )}
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
