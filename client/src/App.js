import FacebookLogin from "react-facebook-login";
import React from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [fbResponse, setFbResponse] = React.useState([]);

  const responseFacebook = async (response) => {
    if (response.status === "unknown") {
      // @ts-ignore
      window.location.reload(false);
    }
    let pageTokenRes = await axios.get(
      `https://graph.facebook.com/${response.userID}/accounts?access_token=${response.accessToken}`
    );

    let saveUser = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/users`,
      {
        accessToken: response.accessToken,
        userId: response.userID,
        name: response.name,
        pagestoken: pageTokenRes.data.data[0].access_token,
        profilepictureurl: response.picture.data.url,
      }
    );
    setFbResponse(saveUser.data);
  };

  return (
    <>
      {fbResponse.length === 0 && (
        <div className="loginBtn">
          <FacebookLogin
            // @ts-ignore
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            autoLoad={false}
            fields="name,email,picture"
            callback={responseFacebook}
            scope="pages_show_list,pages_messaging"
            icon="fa-facebook"
          />
        </div>
      )}
      <div>
        {fbResponse &&
          fbResponse.map((response) => {
            return (
              <>
                <div>
                  <div className="container mt-4 mb-4 p-3 d-flex justify-content-center">
                    <div className="card p-4">
                      <div className="image d-flex flex-column justify-content-center align-items-center">
                        <button className="btn btn-secondary">
                          <img
                            // @ts-ignore
                            src={response.profilepictureurl}
                            height="50"
                            width="50"
                            alt="profile"
                          />
                        </button>
                        <span className="name mt-3">
                          {
                            // @ts-ignore
                            response.name
                          }
                        </span>
                        <span className="idd">@code.zedd</span>
                        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
                          <span className="idd1">
                            {
                              // @ts-ignore
                              response.userid
                            }
                          </span>
                          <span>
                            <i className="fa fa-copy"></i>
                          </span>
                        </div>
                        <div className="d-flex flex-row justify-content-center align-items-center mt-3">
                          <span className="number">
                            1069<span className="follow">Followers</span>
                          </span>
                        </div>
                        <div className=" d-flex mt-2">
                          <button className="btn1 btn-dark">
                            Edit Profile
                          </button>
                        </div>
                        <div className="text mt-3">
                          <span>
                            Access Token:
                            <p style={{ wordWrap: "break-word" }}>
                              {
                                // @ts-ignore
                                response.accesstoken
                              }
                            </p>
                            <br></br> Pages Token:
                            <p>
                              {
                                // @ts-ignore
                                response.pagestoken
                              }
                            </p>
                            {}
                          </span>
                        </div>
                        <div className="gap-3 mt-3 icons d-flex flex-row justify-content-center align-items-center">
                          <span>
                            <i className="fa fa-twitter"></i>
                          </span>{" "}
                          <span>
                            <i className="fa fa-facebook-f"></i>
                          </span>{" "}
                          <span>
                            <i className="fa fa-instagram"></i>
                          </span>{" "}
                          <span>
                            <i className="fa fa-linkedin"></i>
                          </span>
                        </div>
                        <div className=" px-2 rounded mt-4 date ">
                          <span className="join">Joined May,2017</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
      </div>
    </>
  );
};

export default App;
