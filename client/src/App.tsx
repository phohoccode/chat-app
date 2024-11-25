import { useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar";
import { AuthContext, AuthContextType } from "./context/AuthContext";

function App() {
  const { user }: AuthContextType = useContext(AuthContext) || { user: null };

  return (
    <>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/" element={user ? <Chat /> : <Login />} />
          <Route path="/register" element={user ? <Chat /> : <Register />} />
          <Route path="/login" element={user ? <Chat /> : <Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
