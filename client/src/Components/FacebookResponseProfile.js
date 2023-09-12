import { Grid, Card, CardHeader, CardContent, CardActions, Button, Typography, Avatar, List, ListItem, ListItemText, ListItemAvatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { Facebook } from '@mui/icons-material';
import React, { useState } from 'react';

function UserProfile(props) {
  const { response, handleLogout, handleDeleteData } = props;
  const [isReportDialogOpen, setReportDialogOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [problemDescription, setProblemDescription] = useState('');

  const handleOpenReportDialog = () => {
    setReportDialogOpen(true);
  };

  const handleCloseReportDialog = () => {
    setReportDialogOpen(false);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleProblemDescriptionChange = (event) => {
    setProblemDescription(event.target.value);
  };
  


  const handleReportSubmit = () => {
    // Add your logic for handling the report submission here
    // You can send the email and problemDescription to your server, for example
    // Reset the form fields and close the dialog
    setEmail('');
    setProblemDescription('');
    setReportDialogOpen(false);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: '100vh' }}
    >
      <Grid item md={6} xs={12}>
        <Card elevation={3}>
          <CardHeader
            title="User Information"
            titleTypographyProps={{ variant: 'h5' }}
            avatar={
              <Avatar src={response.profilepictureurl} alt={response.name} variant="circle" />
            }
          />
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Hey {response.name}, You are now logged in!
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
              Your User ID: {response.userid}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Connected Pages:
            </Typography>
            <List>
              {response.pages &&
                response.pages.map((page) => {
                  const pagesJSON = JSON.parse(page);
                  return (
                    <ListItem key={pagesJSON.id}>
                      <ListItemAvatar>
                        <Avatar>
                          <Facebook />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={pagesJSON.name}
                        secondary={pagesJSON.access_token.toString().substring(0,70) + "....."}
                      />
                    </ListItem>
                  );
                })}
            </List>
          </CardContent>
          <CardActions>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLogout}
                  startIcon={<Facebook />}
                  fullWidth
                >
                  Logout
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleDeleteData}
                  fullWidth
                >
                  Opt Out & Delete Data
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenReportDialog}
                  fullWidth
                >
                  Report
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
        <Dialog
          open={isReportDialogOpen}
          onClose={handleCloseReportDialog}
          fullWidth
          maxWidth="md"
        >
          <DialogTitle>Report a Problem</DialogTitle>
          <DialogContent>
            <TextField
              label="Email Address"
              fullWidth
              margin="normal"
              variant="outlined"
              value={email}
              onChange={handleEmailChange}
            />
            <TextField
              label="Problem Description"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              variant="outlined"
              value={problemDescription}
              onChange={handleProblemDescriptionChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseReportDialog} color="primary">
              Cancel
            </Button>
            <Button onClick={handleReportSubmit} color="primary" variant="contained">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Grid>
  );
}

export default UserProfile;
