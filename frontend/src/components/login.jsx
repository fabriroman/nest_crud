import React, { useState } from "react";
import "./login.css";

const API_URL = "http://localhost:3000/auth/login";

const Login = ({ onLoginSuccess }) => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!loginEmail || !loginPassword) {
      setError("Por favor, rellene todos los campos.");
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      if (!res.ok) throw new Error("Error en la autenticación");

      const data = await res.json();

      localStorage.setItem("token", data.accessToken);

      console.log("Login exitoso con: " + loginEmail + " y " + loginPassword);
      onLoginSuccess(data.userId);
    } catch (error) {
      setError(error.message || "Error en la autenticación");
      return;
    }
  };

  return (
    <div className="login-container">
      <h1>LOGIN</h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Ingrese su loginEmail y contraseña</h2>
        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label htmlFor="loginEmail">Correo: </label>
          <input
            type="mail"
            id="loginemail"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            placeholder="example@example.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="loginPassword">Contraseña: </label>
          <input
            type="password"
            id="loginpassword"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            placeholder="contraseña"
          />
        </div>
        <button type="submit" className="login-button">
          Iniciar sesion
        </button>
      </form>
    </div>
  );
};
export default Login;
