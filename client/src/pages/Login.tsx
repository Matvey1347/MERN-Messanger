import { FormEvent, useContext } from "react";
import { Col, Form, Row, Stack, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import ErrorPreview from "../components/ErrorPreview";

const LoginPage = () => {
  const { loginInfo, loginError, isLoginLoading, setLoginInfo, loginUser } = useContext(AuthContext);

  return (<>
    <Form onSubmit={(e: FormEvent) => loginUser(e)}>
      <Row style={{ justifyContent: "center" }}>
        <Col xs={6}>
          <Stack gap={3}>
            <h2 className="text-black">Login</h2>
            <Form.Control
              type="email"
              placeholder="Email"
              onChange={(e) => {
                setLoginInfo({ ...loginInfo, email: e.target.value })
              }}
            />
            <Form.Control
              type="password"
              placeholder="Password"
              onChange={(e) => {
                setLoginInfo({ ...loginInfo, password: e.target.value })
              }}
            />
            <Button variant="dark" type="submit">
              {isLoginLoading ? "Login to your account..." : "Login"}
            </Button>
            <ErrorPreview
              error={loginError}
            />
          </Stack>
        </Col>
      </Row>
    </Form>
  </>);
}

export default LoginPage;