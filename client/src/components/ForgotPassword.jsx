import React, { useState } from "react";
import axios from "axios";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/user/forgot-password",
        { email }
      );

      alert(res.data.message);

    } catch (error) {

      alert(
        error?.response?.data?.message ||
        "Something went wrong"
      );

    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <form onSubmit={submitHandler}>

        <h2>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <br />
        <br />

        <button type="submit">
          Send Reset Link
        </button>

      </form>
    </div>
  );
}

export default ForgotPassword;