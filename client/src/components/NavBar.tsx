import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import Notification from "./Notification";

const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  return (
    <Navbar bg="dark" className="mb-4 navbar">
      <Container>
        <h2>
          <Link to="/" className="link-light text-decoration-none">Chat</Link>
        </h2>
        {user?._id ? <span className="text-color-pink">Logged in as {user?.name}</span> : ""}
        <Nav>
          <Stack direction="horizontal" gap={3}>
            <Notification />
            {user?._id ? (
              <>
                <Link
                  onClick={() => logoutUser()}
                  to="/login"
                  className="link-light text-decoration-none"
                >
                  Logout
                </Link>
              </>
            ) : (<>
              <Link to="/login" className="link-light text-decoration-none">Login</Link>
              <Link to="/register" className="link-light text-decoration-none">Register</Link>
            </>)}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;