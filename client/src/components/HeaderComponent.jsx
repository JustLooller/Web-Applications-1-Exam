import { useContext, useState, useEffect } from "react";
import {
  Navbar,
  Nav,
  Button,
  Container,
  Col,
  Form,
  InputGroup,
} from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import PropTypes from "prop-types";
import API from "../api/API.js";
import { UserContext } from "../contexts/UserContext.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
import "../styles/ShakeInput.css";

export default function HeaderComponent() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.getSiteTitle()
      .then((title) => {
        setTitle(title);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error retrieving site title " + err);
      });
  }, []);

  function handleClick() {
    //check which button is clicked and do the proper redirect
    if (document.getElementById("loginButton")) {
      navigate("/login");
    } else if (document.getElementById("logoutButton")) {
      API.logout().then(() => {
        navigate("/");
        setUser(null);
      });
    }
  }

  function handleTitleChange(event) {
    event.preventDefault();

    if (!newTitle || newTitle.trim() === "") {
      setError("Title cannot be empty");
      return;
    }

    API.editSiteTitle(newTitle)
      .then(() => {
        setTitle(newTitle);
        setEditMode(false);
      })
      .catch((err) => {
        setError("Error editing site title " + err);
      });
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Navbar bg="light" expand="lg" className="shadow p-3 mb-5 bg-white rounded">
      <Container>
        {editMode ? (
          <Col>
            <Form onSubmit={handleTitleChange} inline className="ml-auto">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder={error ? error : "Enter new title"}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={error ? "shake-animation" : ""}
                />
                <Button
                  className="mx-2"
                  variant="outline-success"
                  type="submit"
                  onClick={handleTitleChange}
                >
                  Save
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setEditMode(false);
                    setError("");
                  }}
                >
                  Cancel
                </Button>
              </InputGroup>
            </Form>
          </Col>
        ) : (
          <Link to={"/"}>
            <Navbar.Brand>{title}</Navbar.Brand>
          </Link>
        )}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {user?.role === "admin" && !editMode && (
              <Nav.Item>
                <Button
                  variant="outline-secondary"
                  onClick={() => setEditMode(true)}
                >
                  Edit Title
                </Button>
              </Nav.Item>
            )}
          </Nav>

          <Nav className="ms-auto">
            {user && (
              <Nav.Item>
                <Navbar.Text className="me-3">
                  Welcome, {user.username}!
                </Navbar.Text>
              </Nav.Item>
            )}
          </Nav>
          <Nav>
            <Nav.Item>
              <Link to="/">
                <Button className="me-2" variant="outline-primary">
                  FrontOffice
                </Button>
              </Link>
            </Nav.Item>
            <Nav.Item>
              <Link to="/backoffice">
                <Button className="me-2" variant="outline-primary">
                  BackOffice
                </Button>
              </Link>
            </Nav.Item>
          </Nav>
          <Nav>
            {user ? (
              <Nav.Item>
                <Link to="/">
                  <Button
                    className="me-2"
                    id="logoutButton"
                    onClick={handleClick}
                    variant="outline-primary"
                  >
                    Logout
                  </Button>
                </Link>
              </Nav.Item>
            ) : (
              <Nav.Item>
                <Link to="/login">
                  <Button
                    id="loginButton"
                    onClick={handleClick}
                    variant="outline-primary"
                  >
                    Login
                  </Button>
                </Link>
              </Nav.Item>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

HeaderComponent.propTypes = {
  loggedIn: PropTypes.bool,
  username: PropTypes.string,
};
