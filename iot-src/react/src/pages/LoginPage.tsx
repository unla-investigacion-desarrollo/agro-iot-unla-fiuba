import { KeyOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Col, Form, Input, message, Row } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import AuthService from "../api/auth/AuthService";
import { URLs } from "../config/enums";
import { loginSuccessful } from "../redux/auth/authSlice";

interface FormFields {
  username: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [form] = Form.useForm<FormFields>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();
      const response = await AuthService.loginWithUsernameAndPassword(
        values.username,
        values.password
      );
      dispatch(loginSuccessful(response));
      navigate(URLs.ROOT);
    } catch (error) {
      message.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div style={{ minHeight: "100vh" }}>
      <Row>
        <Col xs={24} sm={24} md={10} lg={6}>
          <Card title="Agroecología IoT" style={{ minHeight: "100vh" }}>
            <Form form={form} onFinish={handleSubmit}>
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Ingrese un nombre de usuario" },
                ]}
                style={{ marginBottom: "2rem" }}
              >
                <Input
                  prefix={<UserOutlined />}
                  size="large"
                  placeholder="Nombre de usuario"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Ingrese una contraseña" }]}
                style={{ marginBottom: "2rem" }}
              >
                <Input.Password
                  prefix={<KeyOutlined />}
                  size="large"
                  placeholder="Contraseña"
                />
              </Form.Item>
              <Button
                loading={isSubmitting}
                type="primary"
                htmlType="submit"
                style={{ width: "100%", marginTop: 5 }}
              >
                Ingresar
              </Button>
            </Form>
          </Card>
        </Col>
        <Col xs={0} sm={0} md={14} lg={18}>
          <div className="login-background-image" />
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
