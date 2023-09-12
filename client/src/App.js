// @ts-nocheck
import UserProfile from "./Components/FacebookResponseProfile";
import { FacebookLoginClient } from "@greatsumini/react-facebook-login";
import Login from "./Components/Login";
import axios from "axios";
import React from "react";
import "./App.css";

const App = () => {
  const [fbResponse, setFbResponse] = React.useState([]);
  let backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000"

  const handleLogout = () => {
    FacebookLoginClient.logout(() => {
      setFbResponse([]);
      localStorage.clear();
    });
  };

  const handleDeleteData = async () => {
    await axios.delete(`${backendUrl}/users`, {
      // @ts-ignores
      // Why do you have to use [0] ? Remove this.
      data: { userid: fbResponse[0].userid },
    });
    setFbResponse([]);
    localStorage.clear();
  };
  return (
    <>
      {fbResponse.length === 0 && <Login setFbResponse={setFbResponse} />}
      {fbResponse &&
        fbResponse.map((response) => {
          return <UserProfile response={response} key={response.userId} handleLogout={handleLogout} handleDeleteData={handleDeleteData}/>;
        })}
    </>
  );
};

export default App;
