import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Field } from "formik";
import * as Yup from "yup";
import "./Profile.css";
import { useContext } from "react";
import { AuthContext } from "../../helpers/AuthContext";
import { Form, Button, Row, Col } from "react-bootstrap";

function Profile() {
  const { authState } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    profileImage: "",
  });

  useEffect(() => {
    if (authState.status) {
      loadUserData(authState.id);
    }
  }, [authState]);

  const loadUserData = (userId) => {
    axios
      .get(`http://localhost:3001/auth/basicinfo/${userId}`)
      .then((response) => {
        const formattedData = {
          ...response.data,
          birthDate: response.data.birthDate.split("T")[0], 
        };
        setUserData(formattedData);
      })
      .catch((error) => {
        console.error("Erro ao carregar dados do usuário:", error);
      });
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().min(3).max(100).required(),
    email: Yup.string().email().required(),
    firstName: Yup.string().required(),
    lastName: Yup.string().required(),
    birthDate: Yup.date().required(),
  });

  return (
    <div className="form-container">
      <h2>Perfil </h2>
      <Formik
        initialValues={userData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          // Lógica para atualizar os dados do perfil
          console.log(values);
          setSubmitting(false);
        }}
        enableReinitialize
      >
        {({ isValid }) => (
          <Form className="inner-form">
            <Form.Group as={Row} controlId="formUsername">
              <Form.Label column sm={12} className="custom-label">
                Nome de Utilizador
              </Form.Label>
              <Col sm={12}>
                <Field as={Form.Control} name="username" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formEmail">
              <Form.Label column sm={12} className="custom-label">
                Email
              </Form.Label>
              <Col sm={12}>
                <Field as={Form.Control} name="email" />
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
              disabled={!isValid}
            >
              Atualizar
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Profile;
