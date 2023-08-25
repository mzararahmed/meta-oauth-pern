import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { FacebookLoginClient } from "@greatsumini/react-facebook-login";
import { FaFacebook, FaGoogle, FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import React from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [fbResponse, setFbResponse] = React.useState([]);

  let backendUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:3000";

  const responseFacebook = async (response) => {
    if (response.status === "unknown") {
      // @ts-ignore
      window.location.reload(false);
    }
    let pageTokenRes = await axios.get(
      `https://graph.facebook.com/${response.userID}/accounts?access_token=${response.accessToken}`
    );

    let userPages = pageTokenRes.data.data;
    let saveUser = await axios.post(`${backendUrl}/users`, {
      name: response.name,
      userId: response.userID,
      accessToken: response.accessToken,
      profilepictureurl: response.picture.data.url,
      pages: pageTokenRes.data.data,
    });
    setFbResponse(saveUser.data);
    let pageTokens = [];
    userPages.forEach((page) => {
      pageTokens.push(page.access_token);
    });
  };

  const handleLogout = () => {
    FacebookLoginClient.logout(() => {
      setFbResponse([]);
    });
  };

  const handleCheckStatus = () => {
    FacebookLoginClient.getLoginStatus((res) => {
      console.log(res.status);
    });
  };

  const handleDeleteData = async () => {
    await axios.delete(`${backendUrl}/users`, {
      // @ts-ignore
      data: { userid: fbResponse[0].userid },
    });
    setFbResponse([]);
  };

  return (
    <>
      {fbResponse.length === 0 && (
        <div>
          <FacebookLogin
            // @ts-ignore
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            autoLoad={false}
            fields="name,picture"
            callback={responseFacebook}
            scope="pages_show_list,pages_messaging"
            render={(renderProps) => (
              <div className="container d-flex justify-content-center align-items-center">
                <div className="card">
                  <div className="card-header">
                    <h2 className="card-title">Login with...</h2>
                  </div>
                  <div className="card-body">
                    <button
                      className="btn btn-facebook"
                      onClick={renderProps.onClick}
                    >
                      <FaFacebook className="mr-2" />
                      <span className="font-weight-bold-i">
                        Continue with Facebook
                      </span>
                    </button>
                    <button
                      className="btn btn-google"
                      onClick={renderProps.onClick}
                    >
                      <FaGoogle className="mr-2" />
                      <span className="font-weight-bold-i">
                        Continue with Google
                      </span>
                    </button>
                    <button
                      className="btn btn-github"
                      onClick={renderProps.onClick}
                    >
                      <FaGithub className="mr-2" />
                      <span className="font-weight-bold-i">
                        Continue with Github
                      </span>
                    </button>
                    <button
                      className="btn btn-google"
                      onClick={renderProps.onClick}
                    >
                      <FaLinkedin className="mr-2" />
                      <span className="font-weight-bold-i">
                        Continue with Linkedin
                      </span>
                    </button>
                    <button
                      className="btn btn-github"
                      onClick={renderProps.onClick}
                    >
                      <FaInstagram className="mr-2" />
                      <span className="font-weight-bold-i">
                        Continue with Instagram
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          />
        </div>
      )}
      <div>
        {fbResponse &&
          fbResponse.map((response) => {
            return (
              <div
                key={
                  // @ts-ignore
                  response.userid
                }
              >
                <div className="container">
                  <div className="card">
                    <div className="card-header">
                      <h2 className="card-title">User Information</h2>
                    </div>
                    <div className="card-body user-info">
                      <img
                        // @ts-ignore
                        src={response.profilepictureurl}
                        alt="User Profile"
                        className="img-thumbnail rounded-circle"
                      />
                      <p>
                        Name:{" "}
                        {
                          // @ts-ignore
                          response.name
                        }
                      </p>
                      <p>
                        User ID:{" "}
                        {
                          // @ts-ignore
                          response.userid
                        }
                      </p>
                      <div className="d-flex flex-column align-items-center">
                        <p className="w-30">
                          Access Token:{" "}
                          {
                            // @ts-ignore
                            response.accesstoken
                          }
                        </p>
                        <h4>Pages List:</h4>
                        <ul className="w-30">
                          {response// @ts-ignore
                          .pages // @ts-ignore
                            .map((page) => {
                              let pageJSON = JSON.parse(page);
                              return (
                                <li key={pageJSON.id}>
                                  {pageJSON.name} : {pageJSON.access_token}
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                      <div className="d-flex flex-row justify-content-around w-80">
                        <div className="flex-item">
                          <button
                            className="btn btn-secondary mt-3 mr-2 "
                            onClick={handleLogout}
                          >
                            <FaFacebook className="mr-2" />
                            <span className="font-weight-bold-i">Logout</span>
                          </button>
                        </div>
                        <div className="flex-item">
                          <button
                            className="btn btn-success mt-3 flex-item"
                            onClick={handleCheckStatus}
                          >
                            <FaFacebook className="mr-2" />
                            <span className="font-weight-bold-i">
                              Check Status
                            </span>
                          </button>
                        </div>
                        <div className="flex-item">
                          <button
                            className="btn btn-danger mt-3 flex-item"
                            onClick={handleDeleteData}
                          >
                            <FaFacebook className="mr-2" />
                            <span className="font-weight-bold-i">
                              Delete User Data
                            </span>
                          </button>
                        </div>
                      </div>
                      {}
                      <div className="flex-item">
                        <button
                          className="btn btn-success mt-3 flex-item"
                          // onClick={handleCheckStatus}
                        >
                          <FaFacebook className="mr-2" />
                          <span className="font-weight-bold-i">
                            Check Status
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default App;
