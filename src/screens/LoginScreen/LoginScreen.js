import React, { useState } from "react";
import { Button, Card, Col, Form, Image, Row, Spinner } from "react-bootstrap";
import "./LoginScreen.css";
import { loginURL } from "../../constant/URL";
import { useNavigate } from "react-router-dom";

function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const loginFunc = async (e) => {
    setIsError(false);
    e.preventDefault();
    if (username.length > 0 && password.length > 0) {
      setIsLoading(true);

      const data = { username, password };

      try {
        const resp = await fetch(loginURL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (resp.status === 200) {
          var response = await resp.json();
          localStorage.setItem("user", JSON.stringify(response));
          if (response.user_type === "doctor") {
            navigate("/doctor", { replace: true });
          } else {
            navigate("/patient", { replace: true });
          }
        } else {
          setErrorMessage(
            `Status Code: ${resp.status} with ${resp.statusText}`
          );
          setIsError(true);
        }
      } catch (e) {
        console.log(e);
        setErrorMessage("Error");
        setIsError(true);
      }

      setIsLoading(false);
    } else {
      setErrorMessage("Please fill all fields");
      setIsError(true);
    }
  };

  return (
    <div className="center-div p-5">      
      <Card className="shadow-lg p-3">
        <Card.Body>
          <Row>
            <Col>
              <Image style={{height: "480px"}} thumbnail src="https://imgur.com/XaTWxJX.jpg" />
            </Col>
            <Col>
              <div className="hello">
                <h2>Heart Rate Monitor</h2>
                <h4>Welcome back you have been missed! </h4>
              </div>

              <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    onChange={(e) => setUsername(e.currentTarget.value)}
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                  />
                  <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    value={password}
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.currentTarget.value)}
                  />
                </Form.Group>
                {isError ? <p className="text-danger">{errorMessage}</p> : null}
                {isLoading ? (
                  <Spinner variant="primary" />
                ) : (
                  <Button onClick={loginFunc} variant="primary" type="submit">
                    Submit
                  </Button>
                )}
              </Form>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
}

export default LoginScreen;
