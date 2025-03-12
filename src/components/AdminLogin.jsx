import React, { useState } from "react";
import { auth } from "./firebase"; // Firebase setup

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      alert("Login Successful");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        textAlign: "center",
        flexDirection: "column",
      }}
    >
      <h2>Admin Login</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default AdminLogin;
