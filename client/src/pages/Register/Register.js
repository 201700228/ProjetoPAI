import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import axios from "axios";
import "./Register.css"; 

function RegistrationForm() {
  const [isValidForm, setIsValidForm] = useState(true);

  const initialValues = {
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    birthDate: "",
  };

  return (
    <div className="form-container">
      <h2>Criar Conta</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          username: Yup.string().min(3).max(15).required(),
          password: Yup.string().min(4).max(20).required(),
          email: Yup.string().email().required(),
          firstName: Yup.string().required(),
          lastName: Yup.string().required(),
          birthDate: Yup.date().required(),
        })}
        onSubmit={(data, { resetForm }) => {
          axios.post("http://localhost:3001/auth", data)
            .then((response) => {
              console.log(response.data);
              resetForm(); 
              if (response.status === 200) {
                setIsValidForm(false); // Altera isValidForm para false se a resposta for 200
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }}
      >
        {({ handleSubmit, isValid }) => (
          <Form noValidate onSubmit={handleSubmit} className="inner-form">
            <Form.Group as={Row} controlId="formUsername">
              <Form.Label column sm={12} className="custom-label">
                Nome de Utilizador
              </Form.Label>
              <Col sm={12}>
                <Field as={Form.Control} name="username" />
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

            <Form.Group as={Row} controlId="formEmail">
              <Form.Label column sm={12} className="custom-label">
                Email
              </Form.Label>
              <Col sm={12}>
                <Field as={Form.Control} type="email" name="email" />
              </Col>
            </Form.Group>

            <div className="form-name-data">
              <Row>
                <Col sm={6}>
                  <Form.Group controlId="formFirstName">
                    <Form.Label className="custom-label">Nome</Form.Label>
                    <Field as={Form.Control} name="firstName" />
                  </Form.Group>
                </Col>
                <Col sm={6}>
                  <Form.Group controlId="formLastName">
                    <Form.Label className="custom-label">Apelido</Form.Label>
                    <Field as={Form.Control} name="lastName" />
                  </Form.Group>
                </Col>
              </Row>
            </div>

            <Form.Group as={Row} controlId="formBirthDate">
              <Form.Label column sm={12} className="custom-label">
                Data de Nascimento
              </Form.Label>
              <Col sm={12}>
                <Field as={Form.Control} type="date" name="birthDate" />
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
        <span className="info">Já tem conta?</span> <a href="/login">Login</a>
      </p>
    </div>
  );
}

export default RegistrationForm;