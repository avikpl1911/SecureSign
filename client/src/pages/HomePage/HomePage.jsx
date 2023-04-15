import React from "react";
import "./homepage.css";
import Navbar from "../../component/navbar/Navbar";
import Eth from "../../style-component/Eth";
import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div className="bodyy">
      <div className="navbarcontainer">
        <Navbar />
      </div>
      {/* <Navbar
       
      /> */}
      <div className="bodycontainer">
        <div className="bodyconatinerleft">
          <Eth />
        </div>
        <div className="bodycontainerright">
          <p className="text1 headingg">About SecureSign</p>
          <p className="text lower">
            SecureSign is a revolutionary solution that leverages the power of
            blockchain technology to provide secure and decentralized identity
            and document verification. With our DApp, you can easily upload your
            documents and profile information, which are securely stored on the
            blockchain. You can then share your CID with others, allowing them
            to see if the document and profile that uploaded that document are
            valid or not. But that's not all - to further enhance security, we
            are also using facial recognition and face matching to securely
            verify the profile identity. This ensures that the person uploading
            the documents is the same person whose identity is being verified,
            providing an additional layer of trust and security.
          </p>
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
            onClick={() => navigate("/register")}
          >
            Register Yourself
          </button>
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
            onClick={() => navigate("/searchDoc")}
          >
            Check Document/Certificate
          </button>
        </div>
      </div>
    </div>
  );
};
