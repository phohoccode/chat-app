import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

const Login = () => {
  const {
    loginInfo,
    updateLoginInfo,
    loginUser,
    loginError,
    isLoginLoading,
  }: any = useContext(AuthContext);

  return (
    <>
      <Form onSubmit={loginUser} className="mt-3">
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Login</h2>
              <Form.Control
                onChange={(e) =>
                  updateLoginInfo({
                    ...loginInfo,
                    email: e.target.value,
                  })
                }
                type="email"
                placeholder="Email"
              />
              <Form.Control
                onChange={(e) => updateLoginInfo({
                  ...loginInfo,
                  password: e.target.value,
                })}
                type="password"
                placeholder="Password"
              />
              <Button variant="primary" type="submit">
                {isLoginLoading ? "Loading..." : "Login"}
              </Button>

              {loginError?.error && (
                <Alert variant="danger">
                  <p>{loginError?.message}</p>
                </Alert>
              )}
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Login;
