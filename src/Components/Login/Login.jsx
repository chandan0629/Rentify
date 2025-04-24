import { Box, FormControl, Stack, TextField, Button } from "@mui/material";
import RentifyName from "../Home/Images/logoImage/rentifyName.jpg";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleSignin, handleGoogleLogin, sendOtp, verifyOtp } from "../../Redux/User/actions";
import { LoadingButton } from "@mui/lab";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';

function Login() {
  let Navigate = useNavigate();
  let dispatch = useDispatch();
  let Auth = useSelector((state) => state.Auth);

  if (Auth.isLogin === true) {
    Navigate("/");
  }

  let [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    address: "",
  });

  let [buttonLoading, setButtonLoading] = useState(false);
  let [buttonDisabled, setButtonDisabled] = useState(true);
  let [hidePassword, setHidePassword] = useState(true);

  // OTP login states
  let [otpMobile, setOtpMobile] = useState("");
  let [otpSent, setOtpSent] = useState(false);
  let [otp, setOtp] = useState("");
  let [otpLoading, setOtpLoading] = useState(false);
  let [otpButtonLoading, setOtpButtonLoading] = useState(false);

  let handleForm = ({ target }) => {
    setForm({ ...form, [target.name]: target.value });
  };

  let handleLogin = (e) => {
    setButtonLoading(true);
    dispatch(handleSignin(e, form, setButtonLoading));
  };

  let handleSendOtp = () => {
    if (otpMobile.length < 10) {
      alert("Enter valid mobile number");
      return;
    }
    setOtpButtonLoading(true);
    dispatch(sendOtp(otpMobile, setOtpSent, setOtpButtonLoading));
  };

  let handleVerifyOtp = () => {
    if (otp.length !== 6) {
      alert("Enter valid 6 digit OTP");
      return;
    }
    setOtpLoading(true);
    dispatch(verifyOtp(otpMobile, otp, setOtpLoading));
  };

  let handleGoogleSuccess = (credentialResponse) => {
    dispatch(handleGoogleLogin(credentialResponse.credential, setButtonLoading));
  };

  let handleGoogleFailure = () => {
    alert("Google login failed");
  };

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    if (form.email !== "" && form.password !== "") {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [form]);

  function scrollToTop() {
    window.scrollTo(0, 0);
  }

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <Box
        sx={{
          width: "100%",
          bgcolor: "#212121",
          minHeight: "110vh",
          margin: "0px",
          padding: "0px",
        }}
      >
        <Box
          sx={{
            width: "100vw",
            padding: "100px auto 0px",
            paddingTop: "80px",
            boxSizing: "border-box",
          }}
        >
          <Link to="/">
            <Box component="img" src={RentifyName} margin={"0px auto 30px"}></Box>
          </Link>
          <Box sx={{ margin: "auto", boxSizing: "border-box" }}>
            <Box
              component="h3"
              sx={{
                fontSize: "35px",
                boxShadow: "1px 1px 3px #111111",
                backgroundColor: "#212121",
                padding: { lg: "20px", md: "20px", sm: "20px", xs: "10px" },
                margin: "20px auto",
                maxWidth: { lg: "560px", md: "560px", sm: "550px", xs: "320px" },
              }}
            >
              <Box sx={{ paddingBottom: "20px" }} color="rgb(189, 186, 186)">
                LOGIN
              </Box>
              <FormControl>
                <Stack
                  sx={{
                    width: { lg: "500px", md: "500px", sm: "480px", xs: "280px" },
                    margin: "auto",
                    gap: "30px",
                  }}
                  gap="20px"
                >
                  <TextField
                    type="email"
                    id="email"
                    name="email"
                    label="Email"
                    placeholder="Enter Email"
                    variant="outlined"
                    InputLabelProps={{ className: "TextFieldLable" }}
                    inputProps={{ className: "TextFieldInput" }}
                    onChange={(e) => handleForm(e)}
                    required={true}
                    sx={{ outlineColor: "white" }}
                  />
                  <TextField
                    type={hidePassword ? "password" : "text"}
                    id="password"
                    name="password"
                    label="Password"
                    placeholder="Enter Password"
                    variant="outlined"
                    InputLabelProps={{ className: "TextFieldLable" }}
                    inputProps={{ className: "TextFieldInput" }}
                    onChange={(e) => handleForm(e)}
                    required
                  />
                  {hidePassword ? (
                    <VisibilityOffIcon
                      sx={{
                        color: "rgb(189, 186, 186)",
                        position: "absolute",
                        left: {
                          xl: "460px",
                          lg: "460px",
                          md: "460px",
                          sm: "440px",
                          xs: "240px",
                        },
                        bottom: "74px",
                        cursor: "pointer",
                      }}
                      onClick={() => setHidePassword(false)}
                    />
                  ) : (
                    <VisibilityIcon
                      sx={{
                        color: "rgb(189, 186, 186)",
                        position: "absolute",
                        left: {
                          xl: "460px",
                          lg: "460px",
                          md: "460px",
                          sm: "440px",
                          xs: "240px",
                        },
                        bottom: "74px",
                        cursor: "pointer",
                      }}
                      onClick={() => setHidePassword(true)}
                    />
                  )}
                  {buttonDisabled ? (
                    <LoadingButton
                      variant="contained"
                      sx={{
                        marginTop: { lg: "15px", md: "15px", sm: "15px", xs: "15px" },
                        width: "100%",
                        height: "40px",
                        "&.Mui-disabled": {
                          color: "#c0c0c0",
                        },
                      }}
                      disabled={true}
                    >
                      Login
                    </LoadingButton>
                  ) : (
                    <LoadingButton
                      variant="contained"
                      sx={{
                        marginTop: { lg: "15px", md: "15px", sm: "15px", xs: "15px" },
                        width: "100%",
                        height: "40px",
                      }}
                      onClick={(e) => handleLogin(e)}
                      loading={buttonLoading}
                    >
                      Login
                    </LoadingButton>
                  )}
                </Stack>
              </FormControl>
              <Box sx={{ marginTop: "20px", textAlign: "center" }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleFailure}
                />
              </Box>
              <Box sx={{ marginTop: "40px", color: "rgb(189, 186, 186)" }}>
                OR Login with OTP
              </Box>
              <FormControl>
                <Stack
                  sx={{
                    width: { lg: "500px", md: "500px", sm: "480px", xs: "280px" },
                    margin: "auto",
                    gap: "20px",
                    marginTop: "20px",
                  }}
                >
                  <TextField
                    type="text"
                    id="otpMobile"
                    name="otpMobile"
                    label="Mobile Number"
                    placeholder="Enter Mobile Number"
                    variant="outlined"
                    InputLabelProps={{ className: "TextFieldLable" }}
                    inputProps={{ className: "TextFieldInput" }}
                    value={otpMobile}
                    onChange={(e) => setOtpMobile(e.target.value)}
                  />
                  <LoadingButton
                    variant="contained"
                    onClick={handleSendOtp}
                    loading={otpButtonLoading}
                  >
                    Send OTP
                  </LoadingButton>
                  {otpSent && (
                    <>
                      <TextField
                        type="text"
                        id="otp"
                        name="otp"
                        label="Enter OTP"
                        placeholder="Enter OTP"
                        variant="outlined"
                        InputLabelProps={{ className: "TextFieldLable" }}
                        inputProps={{ className: "TextFieldInput" }}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <LoadingButton
                        variant="contained"
                        onClick={handleVerifyOtp}
                        loading={otpLoading}
                      >
                        Verify OTP
                      </LoadingButton>
                    </>
                  )}
                </Stack>
              </FormControl>
            </Box>
          </Box>
          <Box sx={{ color: "rgb(189, 186, 186)", marginTop: "30px" }}>
            Not a User?{" "}
            <Link to="/signup" style={{ color: "red", textDecoration: "none" }}>
              Sign Up
            </Link>
          </Box>
        </Box>
      </Box>
    </GoogleOAuthProvider>
  );
}

export default Login;
