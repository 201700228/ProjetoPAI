import React, { useContext, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { AuthContext } from "../../helpers/AuthContext";
import "./Login.css";
import "../../App.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm = () => {
  const initialValues = {
    email: "",
    password: "",
  };

  const [isValid, setIsValid] = useState(false);
  const { setAuthState } = useContext(AuthContext);
  const history = useHistory();

  return (
    <div className="main-login">
      <div className="container-login">
        <div className="header-login">
          <h2>Login</h2>
        </div>

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

                  toast.success("Login successful", {
                    className: "toast-success",
                  });
                }
              })
              .catch((error) => {
                toast.error(error.response.data.error, {
                  className: "toast-error",
                });
              });
          }}
          validate={(data) => {
            Yup.object()
              .shape({
                email: Yup.string().email().required(),
                password: Yup.string().min(4).max(20).required(),
              })
              .validate(data)
              .then(() => {
                setIsValid(true);
              })
              .catch(() => {
                setIsValid(false);
              });
          }}
        >
          {({ handleSubmit }) => (
            <Form noValidate onSubmit={handleSubmit} className="form">
              <Form.Group as={Row} controlId="formEmail">
                <Form.Label column sm={12} className="form-label">
                  Email
                </Form.Label>
                <Col sm={12}>
                  <Field as={Form.Control} type="email" name="email" />
                </Col>
              </Form.Group>

              <Form.Group as={Row} controlId="formPassword">
                <Form.Label column sm={12} className="form-label">
                  Palavra-Passe
                </Form.Label>
                <Col sm={12}>
                  <Field as={Form.Control} type="password" name="password" />
                </Col>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                className="form-button"
                disabled={!isValid} // Mantenha o "!"
              >
                Iniciar Sessão
              </Button>
            </Form>
          )}
        </Formik>
        <p className="form-link">
          <span className="info">Ainda não tem conta?</span>{" "}
          <a href="/register">Registar</a>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
