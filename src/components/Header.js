import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useState } from "react";
import Swal from "sweetalert2";

function Header(props) {
  let navigate = useNavigate();

  let getTokenDetails = () => {
    let token = localStorage.getItem("auth-token");
    if (token === null) return false;
    else {
      return jwt_decode(token);
    }
  };

  let [userLogin, setUserLogin] = useState(getTokenDetails());
  let onSuccess = (credentialResponse) => {
    let token = credentialResponse.credential;
    //console.log(data);
    localStorage.setItem("auth-token", token);
    Swal.fire({
      icon: "success",
      title: "User Logged in successfully",
      text: "",
    }).then(() => {
      window.location.reload();
    });
  };

  let Logout = () => {
    
    Swal.fire({
      title: 'Are you sure to Logout?',
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, log me out!'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("auth-token");
        window.location.reload();
        setUserLogin(false);
      }
    });   
  };

  let onError = () => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Login failed",
    }).then(() => {
      window.location.reload();
    });
  };

  return (
    <>
      <GoogleOAuthProvider clientId="408337861051-hctrg7bk27bfk8iobooa65qek8bddvjh.apps.googleusercontent.com">
        <div
          className="modal fade"
          id="login"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalCenterTitle"
          aria-hidden="true"
        >
          <div
            className="modal-width modal-dialog modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h3
                  className="modal-title"
                  id="SignUpTitle"
                  style={{ color: "#192F60" }}
                >
                  Google Login
                </h3>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="d-grid gap-2">
                  {/* <button className="btn" type="button"><span className="gmail-img"><img src="/images/gmail.png"></span>   Continue with Gmail</button> */}
                  <GoogleLogin onSuccess={onSuccess} onError={onError} />
                </div>
              </div>
              <div className="modal-footer mt-5 d-flex justify-content-center align-items-center">
                <p style={{ color: "#192F60" }}>
                  Create an Account ?
                  <a
                    href="#SignUp"
                    style={{ color: "#ED5A6B", textDecoration: "npne" }}
                  >
                    Sign Up
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        <section>
          <div className={"row justify-content-center " + props.color}>
            <div className="col-10 d-flex justify-content-between py-2">
              <p className="m-0 brand hand" onClick={() => navigate("/")}>
                e!
              </p>
              {userLogin ? (
                <div>
                  <span className="fs-5 fw-bold text-white me-3">
                    Welcome, {userLogin.given_name}
                  </span>
                  <button onClick={Logout} className="btn btn-outline-light">
                    <i className="fa fa-exit" aria-hidden="true"></i>
                    Logout
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    className="btn text-white"
                    data-bs-toggle="modal"
                    data-bs-target="#login"
                  >
                    Login
                  </button>
                  <button className="btn btn-outline-light">
                    <i
                      className="fa fa-search"
                      aria-hidden="true"
                      id="SignUp"
                    ></i>
                    Create an Account
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </GoogleOAuthProvider>
    </>
  );
}

export default Header;
