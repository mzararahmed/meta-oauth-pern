import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { Facebook, Twitter } from '@mui/icons-material';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import React, { useEffect } from "react";
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import axios from "axios";

const Login = ({ setFbResponse }) => {
  let backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";
  useEffect(() => {
    let now = new Date().getTime();
    let setupTime = localStorage.getItem('setupTime');
    if (setupTime) {
      let hours = 1;
      if (now - setupTime > hours * 60 * 60 * 1000) {
        localStorage.clear();
        localStorage.setItem('setupTime', now);
      }
      else {
        let localUserData = localStorage.getItem("userData");
        if (localUserData) {
          let savedUser = JSON.parse(localUserData);
          console.log(savedUser);
          setFbResponse(savedUser);
        }
      }
    }
  }, [])
  const responseFacebook = async (response) => {
    if (response.status === "unknown") {
      window.location.reload(false);
    }

    let pageTokenRes = await axios.get(
      `https://graph.facebook.com/${response.userID}/accounts?access_token=${response.accessToken}`
    );

    let userPages = pageTokenRes.data.data;
    let savedUser = await axios.post(`${backendUrl}/users`, {
      name: response.name,
      userId: response.userID,
      accessToken: response.accessToken,
      profilepictureurl: response.picture.data.url,
      pages: userPages,
    });
    setFbResponse(savedUser.data);

    localStorage.setItem('userData', JSON.stringify(savedUser.data));
    
    let now = new Date().getTime();
    localStorage.setItem('setupTime', now);
    
    let pageTokens = [];
    userPages.forEach((page) => {
      pageTokens.push(page.access_token);
    });
  };

  return (
    <>
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: '100vh' }}
      >
        {/* Logo */}
        <Grid item xs={12}>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <img
              src="https://placehold.co/150x100?text=Logo\nHere" // Replace with the path to your logo image
              alt="Logo"
              style={{ width: '10%', maxWidth: '150px' }}
            />
          </div>
        </Grid>

        {/* Title */}
        <Grid item xs={12}>
          <h1 style={{ textAlign: 'center' }}>meta-oauth</h1>
        </Grid>

        {/* Dummy Paragraph */}
        <Grid item xs={12}>
          <p style={{ textAlign: 'center' }}>
            This is a dummy paragraph with two lines of text.
            <br />
            Line 2 of the paragraph.
          </p>
        </Grid>

        {/* Image Placeholders */}
        <Grid item xs={12}>
          <Card
            sx={{
              width: { xs: '90%', md: '40%' }, // Adjust width for mobile and desktop screens
              margin: '0 auto', // Center the card horizontally
            }}
          >
            <CardContent>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <img
                    src="https://placehold.co/150x100?text=Image" // Replace with the path to your first image
                    alt="1"
                    style={{ width: '100%', maxWidth: '300px' }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container direction="column" spacing={3}>
                    <Grid item xs={12} md={6}>
                      <img
                        src="https://placehold.co/350x100?text=Image" // Replace with the path to your second image
                        alt="2"
                        style={{ width: '100%', maxWidth: '300px' }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <img
                        src="https://placehold.co/350x100?text=Image" // Replace with the path to your third image
                        alt="3"
                        style={{ width: '100%', maxWidth: '300px' }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <FacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            scope="pages_show_list,pages_messaging"
            fields="name,email,picture"
            callback={responseFacebook}
            render={(renderProps) => (
              <Card>
                <CardContent>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: '#1877F2', // Facebook color
                      color: 'white',
                      marginBottom: 2,
                    }}
                    startIcon={<Facebook />}
                    onClick={renderProps.onClick}
                  >
                    Sign in with Facebook
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{
                      backgroundColor: '#1DA1F2', // Twitter color
                      color: 'white',
                    }}
                    startIcon={<Twitter />}
                    onClick={renderProps.onClick}
                  >
                    Sign in with Twitter
                  </Button>
                </CardContent>
              </Card>
            )}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Login;
