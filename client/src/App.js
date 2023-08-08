import FacebookLogin from 'react-facebook-login';
import React, { useEffect } from 'react';
import axios from 'axios';

import "./App.css";
const App = () => {

  const [fbResponse, setFbResponse] = React.useState(null);

  useEffect(() => {
    // Initialize Facebook SDK here from above
  }, []);

  const responseFacebook = async (response) => {
    let data = {
      accessToken: response.accessToken,
      userId: response.userID,
      name: response.name
    };
    let saveUser = await axios.post('http://localhost:3000/users', data)
    console.log(saveUser)
  };

  return (
    <div className='loginBtn loginBtn--facebook'>
      <FacebookLogin
        appId="258809283577008"
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook}
        scope="ads_read,ads_management"
      />
    </div>
  );
};

export default App;