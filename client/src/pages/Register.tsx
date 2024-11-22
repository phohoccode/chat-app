import { Alert, Button, Form, Row, Col, Stack } from "react-bootstrap";
import { createContext, useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

interface RegisterProps {
  user: {
    name: string;
  };
}

const Register = () => {
  const { registerInfo, updateRegisterInfo }: any = useContext(AuthContext);

  return (
    <>
      <Form className="mt-3">
        <Row
          style={{
            height: "100vh",
            justifyContent: "center",
            paddingTop: "10%",
          }}
        >
          <Col xs={6}>
            <Stack gap={3}>
              <h2>Register</h2>
              <Form.Control
                type="text"
                placeholder="Name"
                onChange={(event) =>
                  updateRegisterInfo({
                    ...registerInfo,
                    name: event.target.value,
                  })
                }
              />
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={(event) =>
                  updateRegisterInfo({
                    ...registerInfo,
                    email: event.target.value,
                  })
                }
              />
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(event) =>
                  updateRegisterInfo({
                    ...registerInfo,
                    password: event.target.value,
                  })
                }
              />
              <Button variant="primary" type="submit">
                Register
              </Button>

              <Alert variant="danger">
                <p>An error occured</p>
              </Alert>
            </Stack>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default Register;
