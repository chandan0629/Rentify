import { login } from "./actionTypes";
import axios from "axios";

let handleSignin = (e, form, setButtonLoading) => (dispatch) => {
  e.preventDefault();
  axios
    .post("https://tender-lime-pike.cyclic.app/user/login", {
      ...form,
    })
    .then((res) => {
      if (res.data == "Password is wrong") {
        alert("Password is Wrong");
      } else {
        dispatch({ type: login, payload: true });
        let token = res.data.token;
        localStorage.setItem("rentifyToken", JSON.stringify(token));
        alert("Logged in successfully");
      }
      setButtonLoading(false);
    })
    .catch((err) => {
      alert("User not found");
      setButtonLoading(false);
      console.log(err);
    });
};

let handleGoogleLogin = (token, setLoading) => (dispatch) => {
  setLoading(true);
  axios
    .post("https://tender-lime-pike.cyclic.app/user/google-login", { token })
    .then((res) => {
      dispatch({ type: login, payload: true });
      localStorage.setItem("rentifyToken", JSON.stringify(res.data.token));
      alert("Logged in successfully with Google");
      setLoading(false);
    })
    .catch((err) => {
      alert("Google login failed");
      setLoading(false);
      console.log(err);
    });
};

let sendOtp = (mobile, setOtpSent, setLoading) => (dispatch) => {
  setLoading(true);
  axios
    .post("https://tender-lime-pike.cyclic.app/user/send-otp", { mobile })
    .then((res) => {
      alert("OTP sent successfully");
      setOtpSent(true);
      setLoading(false);
    })
    .catch((err) => {
      alert("Failed to send OTP");
      setLoading(false);
      console.log(err);
    });
};

let verifyOtp = (mobile, otp, setLoading) => (dispatch) => {
  setLoading(true);
  axios
    .post("https://tender-lime-pike.cyclic.app/user/verify-otp", { mobile, otp })
    .then((res) => {
      dispatch({ type: login, payload: true });
      localStorage.setItem("rentifyToken", JSON.stringify(res.data.token));
      alert("Logged in successfully with OTP");
      setLoading(false);
    })
    .catch((err) => {
      alert("OTP verification failed");
      setLoading(false);
      console.log(err);
    });
};

export { handleSignin, handleGoogleLogin, sendOtp, verifyOtp };
