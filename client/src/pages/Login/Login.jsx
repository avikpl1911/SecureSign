import React from "react";
import "./login.css";
import Navbar from "../../component/navbar/Navbar";
import Identity from "../../svg_componets/Identity";
import Inputholder from "../../style-component/input_holder/Inputholder";
import Loader from "../../style-component/loaderimg/Loader";
import Upload from "../../svg_componets/Upload";
import Web3 from "web3";
import axios from "axios";
import Button from "@mui/material/Button";
import {
  IDENTITY_CONTRACT_ADDRESS,
  IDENTITY_CONTRACT_ABI,
} from "../../contracts/constance";
import CameraComponent from "../../component/CameraComponent";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import { CircularProgress } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const handleClick = () => {
  document.getElementById("takeID").click();
};

const Login = () => {
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
  const [isGovid, setIsGovid] = React.useState(false);

  const navigate = useNavigate();
  const loadWeb3 = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:7545");
        const accounts = await web3.eth.requestAccounts();
        console.log(accounts);
        const account = accounts[0];
        const identityContract = new web3.eth.Contract(
          IDENTITY_CONTRACT_ABI,
          IDENTITY_CONTRACT_ADDRESS
        );
        setIdentityContract(identityContract);
        // console.log(identityContract);
        // console.log(account);
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
            navigate("/profilenew");
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
      setRequestPredicting(true);
      setTimeout(() => {
        setRequestPredicting(false);
        setModelPredicting(true);
      }, 5000);

      const formData2 = new FormData();
      formData2.append("File1", govid);
      formData2.append("label", email);
      await axios
        .post("https://34.125.14.8/post-face", formData2, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((res) => {
          console.log(res);
          if (res.data.message !== "Face data stored successfully") {
            alert(res.data.message + " Please try again");
            window.location.reload();
            return;
          }
        })
        .catch((err) => {
          console.log(err);
          alert("Face not verified , Please try again");
          window.location.reload();
        });

      const formData3 = new FormData();
      formData3.append("File1", dataURLtoFile(fileImgUrl, "image.png"));
      let verified = false;
      await axios
        .post("https://34.125.14.8/check-face", formData3, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(async (res) => {
          if (res.data.message === "No face detected") {
            console.log("No face detected");
            verified = false;
          } else {
            console.log(res.data.result[0]._label);
            console.log("Face detected");
            if (res.data.result[0]._label === email) {
              verified = true;
            } else {
              verified = false;
            }
          }
          await identityContract.methods
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
          navigate("/profilenew");
        })
        .catch((err) => {
          console.log(err);
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
    console.log(name, email, phone, physicalAddress, govid);
    if (name && email && phone && physicalAddress && isGovid) {
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
      //check if govid is uploade
      setContinueToRegister(true);
    } else {
      alert("Please fill all the fields");
    }
  };
  return (
    <div className="body">
      <Navbar />
      <div className="containern">
        <div className="bodyLeft">
          <div className="bodyLeftContainerr">
            <div className="loaderContainer">
              <Loader />
            </div>
            <div className="imgPrompt textsl1">
              {!isGovid
                ? "Upload your Government ID"
                : "Government ID Uploaded"}
            </div>
          </div>
        </div>
        <div className="bodyRight">
          <div className="logoContainer">
            <div className="Accountcontainer textsl1">
              Account :{" "}
              <span>
                {account ? account.slice(0, 20) + "..." : "Not Connected"}
              </span>
            </div>
            {!continueToRegister && (
              <>
                <Identity />
                <div className="textlogo textsl">Register Your Identity.</div>
              </>
            )}
          </div>
          {continueToRegister ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "20px",
              }}
            >
              <CameraComponent setFileImgUrl={setFileImgUrl} />
              {fileImgUrl !== "" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <img
                    src={fileImgUrl}
                    alt="img"
                    className="specialImage"
                    style={{
                      width: "340px",
                      height: "257px",
                      marginTop: "45px",
                    }}
                  />
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
                      marginTop: "20px",
                      marginLeft: "50px",
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      setFileImgUrl("");
                    }}
                  >
                    Remove/Refresh
                  </button>

                  {fileImgUrl && (
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
                        marginTop: "20px",
                        marginLeft: "50px",
                      }}
                      onClick={handleClickOpen}
                    >
                      Finish Registration
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="formContainer">
              <Inputholder
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Inputholder
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Inputholder
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <Inputholder
                placeholder="Physical Address"
                value={physicalAddress}
                onChange={(e) => setPhysicalAddress(e.target.value)}
              />
              <div className="buttonscontainer">
                <div className="uploadfile">
                  <input
                    type="file"
                    id="takeID"
                    className="fileInput"
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
                        setIsGovid(true);
                        setGovid(file);
                      } else {
                        alert("Please upload an image file");
                      }
                    }}
                  />
                  <div className="uploadlogo" onClick={handleClick}>
                    <Upload />
                  </div>
                  <div className="uploadtext textsl">
                    {/* Upload Most Recent Goverment ID */}
                    {isGovid ? govid.name : "Upload Most Recent Goverment ID"}
                  </div>
                </div>
                <div className="submitbutton">
                  <div className="mysubmitbutton" onClick={handleSubmit}>
                    <span
                      className="textsl submitbtntext"
                      onClick={handleSubmit}
                    >
                      Continue
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
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
    </div>
  );
};

export default Login;
