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
import CameraComponent from "../component/CameraComponent";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const theme = createTheme();
const storage = new Web3Storage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDBiNzQ0Y2Q1OGFhMDA1MUQyMkNGNDgwZTJmN0ExZEI2MzEzNDUzODAiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzcxMzYzMjc4MzUsIm5hbWUiOiJ0ZXN0aW5nIn0.rVioEmlj8oDKtEGg0DOJge58WuQgtH1xLk-PXEhVcOw",
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function App() {
  const [identityContract, setIdentityContract] = React.useState(null);
  const [account, setAccount] = React.useState(null);
  const [web3, setWeb3] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [continueToRegister, setContinueToRegister] = React.useState(false);
  const [fileImgUrl, setFileImgUrl] = React.useState("");
  const [open, setOpen] = React.useState(false);
  //User Details
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [physicalAddress, setPhysicalAddress] = React.useState("");
  // const [fileImg, setFileImg] = React.useState("");
  // const [cid, setCid] = React.useState("");
  // const [curr, setCurr] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [ipfsUploading, setIpfsUploading] = React.useState(false);
  const [requestPredictiing, setRequestPredicting] = React.useState(false);
  const [modelPredicting, setModelPredicting] = React.useState(false);
  const [result, setResult] = React.useState(false);
  const [isManualneeded, setIsManualneeded] = React.useState(false);
  const [govid, setGovid] = React.useState({});

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

  // const sendFileToIPFS = async (fileImg1, fileImg2) => {
  //   setIpfsUploading(true);
  //   if (fileImg1 && fileImg2) {
  //     console.log("Sending File to IPFS");
  //     setUploading(true);
  //     try {
  //       const formData = new FormData();
  //       formData.append("file", fileImg1);

  //       const resFile = await axios({
  //         method: "post",
  //         url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
  //         data: formData,
  //         headers: {
  //           pinata_api_key: process.env.REACT_APP_PINATA_API,
  //           pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });
  //       console.log("File sent to IPFS: ", resFile.data.IpfsHash);
  //       setCid(resFile.data.IpfsHash);

  //       const formData1 = new FormData();
  //       formData1.append("file", fileImg2);

  //       const resFile1 = await axios({
  //         method: "post",
  //         url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
  //         data: formData1,
  //         headers: {
  //           pinata_api_key: process.env.REACT_APP_PINATA_API,
  //           pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET,
  //           "Content-Type": "multipart/form-data",
  //         },
  //       });
  //       console.log("File sent to IPFS: ", resFile1.data.IpfsHash);
  //       setCurr(resFile1.data.IpfsHash);
  //       setIpfsUploading(false);
  //     } catch (error) {
  //       console.log("Error sending File to IPFS: ");
  //       console.log(error);
  //     }
  //   }
  // };
  function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }
  const handleClickOpen = async () => {
    setOpen(true);
    // setIpfsUploading(true);
    // //wait for 5 seconds
    // setTimeout(() => {
    //   setIpfsUploading(false);
    //   setRequestPredicting(true);
    // }, 5000);
    // //wait for 10 seconds
    // setTimeout(() => {
    //   setRequestPredicting(false);
    //   setModelPredicting(true);
    // }, 10000);
    // //wait for 15 seconds
    // setTimeout(() => {
    //   setModelPredicting(false);
    //   setResult(true);
    // }, 15000);
    try {
      let curr;
      let cid;
      console.log(
        govid,
        dataURLtoFile(fileImgUrl, "image.png"),
        name,
        email,
        phone,
        physicalAddress
      );
      setIpfsUploading(true);
      // sendFileToIPFS(govid, dataURLtoFile(fileImgUrl, "image.png"));
      const formData = new FormData();
      formData.append("file", govid);

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
      console.log("File sent to IPFS: ", resFile.data.IpfsHash);
      cid = resFile.data.IpfsHash;

      const formData1 = new FormData();
      formData1.append("file", dataURLtoFile(fileImgUrl, "image.png"));

      const resFile1 = await axios({
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        data: formData1,
        headers: {
          pinata_api_key: process.env.REACT_APP_PINATA_API,
          pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET,
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("File sent to IPFS: ", resFile1.data.IpfsHash);
      curr = resFile1.data.IpfsHash;
      setIpfsUploading(false);
      // wait untill cid and curr are set
      console.log(cid, curr);
      // setIpfsUploading(false);
      setRequestPredicting(true);
      // //wait for 5 seconds
      setTimeout(() => {
        setRequestPredicting(false);
        setModelPredicting(true);
      }, 5000);
      let verified = false;
      const formData2 = new FormData();
      formData2.append("File1", govid);
      formData2.append("label", email);
      await axios
        .post("http://localhost:5000/post-face", formData2, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          if (res.data.message !== "Face data stored successfully") {
            alert(res.data.message + " Please try again");
            window.location.reload();
            return;
          }
        })
        .catch((err) => {
          alert("Face not verified , Please try again");
          window.location.reload();
        });

      const newFormData = new FormData();
      newFormData.append("File1", dataURLtoFile(fileImgUrl, "image.png"));
      await axios
        .post("http://localhost:5000/check-face", newFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(async (res) => {
          if (res.data.result[0]._label === email) {
            verified = true;
          }
          try {
            if (verified) {
              const res = await identityContract.methods
                .createIdentity(
                  name,
                  email,
                  phone,
                  physicalAddress,
                  cid,
                  curr,
                  verified
                )
                .send({ from: account });
              console.log(res);
              navigate("/user");
              // setContinueToRegister(true);
            } else {
              alert("Face not verified , Please try again");
              window.location.reload();
            }
          } catch (error) {
            console.log(error);
          }
          console.log(res);
        })
        .catch((err) => {
          alert("Face not verified , Please try again");
          window.location.reload();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && email && phone && physicalAddress && govid !== {}) {
      //   try {
      //     const res = await identityContract.methods
      //       .createIdentity(name, email, phone, physicalAddress, cid)
      //       .send({ from: account });
      //     console.log(res);
      //     // navigate("/user");
      //     setContinueToRegister(true);
      //   } catch (error) {
      //     console.log(error);
      //   }
      setContinueToRegister(true);
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
          {continueToRegister ? (
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography component="h1" variant="h5">
                Face Verification
              </Typography>
              <CameraComponent setFileImgUrl={setFileImgUrl} />
              {fileImgUrl !== "" && (
                <>
                  <img
                    src={fileImgUrl}
                    alt="img"
                    className="specialImage"
                    style={{
                      width: "60%",
                      marginTop: "57px",
                      height: "auto",
                    }}
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    onClick={(e) => {
                      e.preventDefault();
                      setFileImgUrl("");
                    }}
                  >
                    Remove/Refresh
                  </Button>

                  {fileImgUrl && (
                    <Button variant="outlined" onClick={handleClickOpen}>
                      Finish Registration
                    </Button>
                  )}
                </>
              )}
            </Box>
          ) : (
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
                  Upload Most Recent Government ID *
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
                      // sendFileToIPFS(file);
                      setGovid(file);
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
                    "Continue For Face Verification"
                  )}
                </Button>
              </Box>
            </Box>
          )}
        </Grid>
      </Grid>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"Registration Process Status"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {ipfsUploading ? (
              <Typography component="h3" variant="h5">
                <CircularProgress color="inherit" size={20} /> Uploading Image
                to IPFS
              </Typography>
            ) : null}
            {requestPredictiing ? (
              <Typography component="h3" variant="h5">
                <CircularProgress color="inherit" size={20} /> Requesting for
                Face Prediction
              </Typography>
            ) : null}
            {modelPredicting ? (
              <Typography component="h3" variant="h5">
                <CircularProgress color="inherit" size={20} /> Model Face
                Prediction
              </Typography>
            ) : null}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
