import React from "react";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";

const styles = {
  root: {
    flexGrow: 1,
    padding: "15px 180px",
  },
  leftSection: {
    padding: "16px",
    backgroundColor: "#fff",
  },
  rightSection: {
    // padding: "16px",
  },
  avatar: {
    // aspectRatio: "1/1",
    width: "100%",
    height: "100%",
  },
};

const Profile = ({
  name,
  email,
  phone,
  address,
  imageUrl,
  verified,
  hasGovCertificate,
}) => {
  return (
    <div style={styles.root}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} style={styles.leftSection}>
          <Typography
            variant="h5"
            gutterBottom
            style={{
              fontFamily: "monospace",
              fontWeight: 700,

              fontSize: "2rem",
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            style={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Email: {email}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            style={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Phone: {phone}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            style={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            Address: {address}
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            style={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            {verified ? "Verified" : "Not Verified"}
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: verified ? "green" : "red",
                display: "inline-block",
                marginLeft: "5px",
              }}
            ></div>
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            style={{
              fontFamily: "monospace",
              fontWeight: 700,
              fontSize: "1rem",
            }}
          >
            {hasGovCertificate ? "Has Gov Certificate" : "No Gov Certificate"}
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: hasGovCertificate ? "green" : "red",
                display: "inline-block",
                marginLeft: "5px",
              }}
            ></div>
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} style={styles.rightSection}>
          <img alt={name} src={imageUrl} style={styles.avatar} />
        </Grid>
      </Grid>
    </div>
  );
};

export default Profile;
