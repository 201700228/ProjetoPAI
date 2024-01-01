import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import axios from "axios";
import "./Register.css";
import { sepia, invert, grayscale, normal } from "../../Filters";
import { imageDataToFile } from "../../Files";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import imagePlaceholder from "../../assets/image-placeholder.png";

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
    let filteredImageData;

    img.onload = function () {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      if (filter === "Sepia") {
        filteredImageData = sepia(ctx, canvas);
        ctx.putImageData(filteredImageData, 0, 0);
      } else if (filter === "Normal") {
        filteredImageData = normal(ctx, canvas);
        ctx.putImageData(filteredImageData, 0, 0);
      } else if (filter === "Invert") {
        filteredImageData = invert(ctx, canvas);
        ctx.putImageData(filteredImageData, 0, 0);
      } else if (filter === "GrayScale") {
        filteredImageData = grayscale(ctx, canvas);
        ctx.putImageData(filteredImageData, 0, 0);
      }

      imageDataToFile(
        filteredImageData,
        values.imageFile.name,
        values.imageFile.type
      )
        .then((file) => {
          setValues((prevValues) => ({ ...prevValues, imageFile: file }));
        })
        .catch((error) => {
          console.error("Error converting ImageData to File:", error);
        });
    };

    img.src = image;
  };

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
    <div className="main">
      <div className="container">
        <div className="header">
          <h2>Criar Conta</h2>
        </div>

        <div
          className="profile-picture"
          onClick={() => document.getElementById("inputFile").click()}
        >
          <div className="profile-picture-overlay">
            <canvas id="imageCanvas" className="profile-picture-preview" />
            {!isImageSelected && (
              <img
                src={imagePlaceholder}
                alt="Placeholder"
                className="profile-picture-preview"
              />
            )}
            {isImageSelected && (
              <div className="filter-options">
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    applyFilter("Normal");
                  }}
                >
                  Normal
                </p>
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    applyFilter("Sepia");
                  }}
                >
                  Sépia
                </p>
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    applyFilter("Invert");
                  }}
                >
                  Inverter
                </p>
                <p
                  onClick={(e) => {
                    e.stopPropagation();
                    applyFilter("GrayScale");
                  }}
                >
                  Preto e Branco
                </p>
              </div>
            )}
          </div>
        </div>

        <input
          type="file"
          id="inputFile"
          onChange={handleImageChange}
          accept="image/*"
          name="imageFile"
          style={{ display: "none" }}
        />

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
            const formData = new FormData();
            formData.append("username", data.username);
            formData.append("password", data.password);
            formData.append("email", data.email);
            formData.append("firstName", data.firstName);
            formData.append("lastName", data.lastName);
            formData.append("birthDate", data.birthDate);
            formData.append("imageFile", values.imageFile);

            axios
              .post("http://localhost:3001/auth", formData, {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              })
              .then((response) => {
                if (response.status === 201) {
                  toast.success("User created successfully", {
                    className: "toast-success",
                  });
                  resetForm();
                  setImage(null);
                  setIsImageSelected(false);
                  setValues({ ...values, imageFile: null });
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
            <Form noValidate onSubmit={handleSubmit} className="form">
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

              <div className="buttons">
                <Button
                  variant="primary"
                  type="submit"
                  className="submit-button"
                  disabled={!isValid || !isImageSelected}
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
