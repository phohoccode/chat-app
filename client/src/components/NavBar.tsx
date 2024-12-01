import { useContext } from "react";
import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext, AuthContextType } from "../context/AuthContext";
import Notification from "./chat/Notification";

const NavBar = () => {
  const { user, logoutUser }: AuthContextType = useContext(AuthContext) || {
    user: null,
  };

  return (
    <Navbar bg="dark" expand="lg">
      <Container>
        <h3>
          <Link className="link-light text-decoration-none" to="/">
            Chat App
          </Link>
        </h3>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {user && <span className="text-warning">Login as {user?.name}</span>}
        <Nav>
          <Stack direction="horizontal" gap={3}>
            {!user ? (
              <>
                <Link className="link-light text-decoration-none" to="/login">
                  Login
                </Link>
                <Link
                  className="link-light text-decoration-none"
                  to="/register"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Notification />
                <Link
                  onClick={logoutUser}
                  className="link-light text-decoration-none"
                  to="/register"
                >
                  Logout
                </Link>
              </>
            )}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
