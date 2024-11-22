import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <Navbar bg="dark" expand="lg">
      <Container>
        <h3>
          <Link className="link-light text-decoration-none" to="/">
            Chat App
          </Link>
        </h3>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <span className="text-warning">Login as phohoccode</span>
        <Nav>
          <Stack direction="horizontal" gap={3}>
            <Link className="link-light text-decoration-none" to="/login">
              Login
            </Link>
            <Link className="link-light text-decoration-none" to="/register">
              Register
            </Link>
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
