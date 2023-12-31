import React, { useState, useEffect, useCallback } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import axios from "axios";
import "./Register.css";
import { sepia, invert, grayscale } from "../../Filters";

function RegistrationForm() {
  const [image, setImage] = useState(null);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [values, setValues] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    imageFile: null,
  });

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(URL.createObjectURL(selectedImage));
      setIsImageSelected(true);
      setValues((prevValues) => ({ ...prevValues, imageFile: selectedImage }));
    } else {
      setImage(null);
      setIsImageSelected(false);
      setValues({ ...values, imageFile: null });
    }
  };

  const applyFilter = (filter) => {
    const canvas = document.getElementById("imageCanvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = function () {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (filter === "Sepia") {
        sepia(ctx, canvas);
      } else if (filter === "Normal") {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else if (filter === "Invert") {
        invert(ctx, canvas);
      } else if (filter === "GrayScale") {
        grayscale(ctx, canvas);
      }
    };

    img.src = image;

    let pic = values.imageFile;

    canvas.toBlob((blob) => {
      const modifiedImageFile = new File([blob], pic.name, {
        type: pic.type,
      });

      setValues((prevValues) => ({ ...prevValues, imageFile: modifiedImageFile }));
    }, pic.type);
  };

  const handleSubmit = useCallback(async (data, values) => {
    try {
      console.log(data, values);
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("email", data.email);
      formData.append("firstName", data.firstName);
      formData.append("lastName", data.lastName);
      formData.append("birthDate", data.birthDate);
      formData.append("imageFile", values.imageFile);
  
      await axios.post("http://localhost:3001/auth", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
    } catch (error) {
      console.error("Error:", error);
    }
  }, []);

  useEffect(() => {
    if (image) {
      const canvas = document.getElementById("imageCanvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
  
      img.onload = function () {
        const MAX_SIZE = 200;
  
        const aspectRatio = img.width / img.height;
        let width = img.width;
        let height = img.height;
  
        if (width > height && width > MAX_SIZE) {
          width = MAX_SIZE;
          height = width / aspectRatio;
        } else if (height > MAX_SIZE) {
          height = MAX_SIZE;
          width = height * aspectRatio;
        }
  
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
      };
  
      img.src = image;
    }
  }, [image]);

  return (
    <div className="registration-container">
      <div className="registration-header">
        <h2>Criar Conta</h2>
      </div>
      <div className="registration-form-container">
        <Formik
          initialValues={values}
          validationSchema={Yup.object().shape({
            username: Yup.string().min(3).max(100).required(),
            password: Yup.string().min(4).max(20).required(),
            email: Yup.string().email().required(),
            firstName: Yup.string().required(),
            lastName: Yup.string().required(),
            birthDate: Yup.date().required(),
          })}
          onSubmit={(data, { resetForm }) => {
            handleSubmit(data,values);
            resetForm();
          }}
          validate={(data) => {
            Yup.object()
              .shape({
                username: Yup.string().min(3).max(100).required(),
                password: Yup.string().min(4).max(20).required(),
                email: Yup.string().email().required(),
                firstName: Yup.string().required(),
                lastName: Yup.string().required(),
                birthDate: Yup.date().required(),
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

              <Form.Group as={Row} controlId="formImage">
                <Form.Label column sm={12} className="custom-label">
                  Foto de Perfil
                </Form.Label>
                <Col sm={12}>
                  <Form.Control
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    name="imageFile"
                  />
                </Col>
              </Form.Group>

              {isImageSelected && (
                <div className="icon-overlay">
                  <canvas id="imageCanvas" className="image-canvas" />
                  <div className="icon-dropdown">
                    <p onClick={() => applyFilter("Normal")}>Normal</p>
                    <p onClick={() => applyFilter("Sepia")}>Sépia</p>
                    <p onClick={() => applyFilter("Invert")}>Inverter</p>
                    <p onClick={() => applyFilter("GrayScale")}>
                      Preto e Branco
                    </p>
                  </div>
                </div>
              )}

              <div className="buttons">
                <Button
                  variant="primary"
                  type="submit"
                  className="submit-button"
                  disabled={!isValid}
                >
                  Registar
                </Button>

                <p className="login-link">
                  <span className="info">Já tem conta?</span>{" "}
                  <a href="/login">Login</a>
                </p>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default RegistrationForm;
