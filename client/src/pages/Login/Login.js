import React, { useState, useContext } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";

const LoginForm = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const [isValidForm] = useState(true);

  const { setAuthState } = useContext(AuthContext);
  const history = useHistory();

  const login = (values) => {
    const data = { email: values.email, password: values.password };
    axios
      .post("http://localhost:3001/auth/login", data)
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          localStorage.setItem("accessToken", response.data.token);
          setAuthState({
            email: response.data.email,
            id: response.data.id,
            status: true,
          });
          history.push("/");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Email inválido")
            .required("Email é obrigatório"),
          password: Yup.string().required("Password é obrigatória"),
        })}
        onSubmit={(data, { resetForm }) => {
          axios
            .post("http://localhost:3001/auth/login", data)
            .then((response) => {
              if (response.status === 200) {
                localStorage.setItem("accessToken", response.data.token);
                setAuthState({
                  username: response.data.username,
                  id: response.data.id,
                  status: true,
                });
                history.push("/");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }}
      >
        {({ handleSubmit, isValid }) => (
          <Form noValidate onSubmit={handleSubmit} className="inner-form">
            <Form.Group as={Row} controlId="formEmail">
              <Form.Label column sm={12} className="custom-label">
                Email
              </Form.Label>
              <Col sm={12}>
                <Field as={Form.Control} type="email" name="email" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formPassword">
              <Form.Label column sm={12} className="custom-label">
                Palavra-Passe
              </Form.Label>
              <Col sm={12}>
                <Field as={Form.Control} type="password" name="password" />
              </Col>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="submit-button"
              disabled={!isValid || !isValidForm}
            >
              Registar
            </Button>
          </Form>
        )}
      </Formik>
      <p className="login-link">
        <span className="info">Ainda não tem conta?</span>{" "}
        <a href="/register">Registar</a>
      </p>
    </div>
  );
};

export default LoginForm;
