import { useState } from "react";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import API from "../api/API.js";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { setUser } = useContext(UserContext);

  function handleEmailChange(event) {
    setEmail(event.target.value);
  }
  function handlePasswordChange(event) {
    setPassword(event.target.value);
  }
  function handleSubmit(event) {
    event.preventDefault();

    if (!email || !password) {
      setError("Both email and password are required");
      return;
    }

    API.login(email, password)
      .then((user) => {
        setUser(user);
        setError("");
        navigate("/");
      })
      .catch((err) => {
        setError(err.message);
      });
  }
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          {error && (
            <Alert className="" variant="danger">
              {error}
            </Alert>
          )}
          <div>
            <h2>Login</h2>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={handleEmailChange}
                />
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
              </Form.Group>

              <Button className="mt-2" variant="outline-primary" type="submit">
                Login
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
