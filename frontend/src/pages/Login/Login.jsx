import "./Login.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { loginUser }
from "../../services/authService";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const data =
        await loginUser(
          email,
          password
        );

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "role",
        data.role
      );

      localStorage.setItem(
        "name",
        data.name
      );

      if (data.role === "ADMIN") {

        navigate(
          "/admin/dashboard"
        );

      } else {

        navigate(
          "/citizen/dashboard"
        );
      }

    } catch (err) {

      setError(
        "Invalid Email or Password"
      );
    }
  };

  return (

    <div className="login-container">

      <div className="login-left">

        <h1>CleanCity</h1>

        <p>
          Intelligent Urban Waste
          Management System

          <br /><br />

          Monitor complaints,
          assign tasks,
          track performance
          and improve city cleanliness.
        </p>

      </div>

      <div className="login-right">

        <div className="login-card">

          <h2>Welcome Back</h2>

          <p>Sign in to continue</p>

          <form
            className="login-form"
            onSubmit={handleLogin}
          >

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

            <button type="submit">
              Login
            </button>

            {
              error &&
              <p className="error">
                {error}
              </p>
            }

          </form>

        </div>

      </div>

    </div>
  );
}

export default Login;