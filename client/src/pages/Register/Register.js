import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import * as Yup from "yup";
import { Formik, Field } from "formik";
import axios from "axios";
import "./Register.css";
import { FaTint } from "react-icons/fa";

function RegistrationForm() {
  const initialValues = {
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    birthDate: "",
  };

  const [image, setImage] = useState(null);
  const [isImageSelected, setIsImageSelected] = useState(false);

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(URL.createObjectURL(selectedImage));
      setIsImageSelected(true);
    }
  };

  useEffect(() => {
    if (image) {
      const canvas = document.getElementById("imageCanvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = function () {
        const MAX_SIZE = 200; // Define o tamanho máximo desejado para largura ou altura

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

  const applyFilter = (filter) => {
    const canvas = document.getElementById("imageCanvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = function () {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // Desenha a imagem redimensionada no canvas

      if (filter === "Sepia") {
        sepia(ctx, canvas);
      } else if (filter === "Yellow") {
        yellow(ctx, canvas);
      } else if (filter === "Invert") {
        invert(ctx, canvas);
      } else if (filter === "GrayScale") {
        grayscale(ctx, canvas);
      }
    };

    img.src = image;
  };

  const sepia = (ctx, canvas) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const tr = Math.min(255, 0.393 * r + 0.769 * g + 0.189 * b);
      const tg = Math.min(255, 0.349 * r + 0.686 * g + 0.168 * b);
      const tb = Math.min(255, 0.272 * r + 0.534 * g + 0.131 * b);

      data[i] = tr;
      data[i + 1] = tg;
      data[i + 2] = tb;
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const yellow = (ctx, canvas) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255; // Definir o canal vermelho para 255 (amarelo)
      data[i + 1] = 255; // Definir o canal verde para 255 (amarelo)
      data[i + 2] = 0; // Definir o canal azul para 0 (amarelo)
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const invert = (ctx, canvas) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255 - data[i]; // Inverter o canal vermelho
      data[i + 1] = 255 - data[i + 1]; // Inverter o canal verde
      data[i + 2] = 255 - data[i + 2]; // Inverter o canal azul
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const grayscale = (ctx, canvas) => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = avg; // Escala de cinza - definir o canal vermelho
      data[i + 1] = avg; // Escala de cinza - definir o canal verde
      data[i + 2] = avg; // Escala de cinza - definir o canal azul
    }

    ctx.putImageData(imageData, 0, 0);
  };

  return (
    <div className="registration-container">
      <div className="registration-header">
        <h2>Criar Conta</h2>
      </div>
      <div className="registration-form-container">
        <Formik
          initialValues={initialValues}
          validationSchema={Yup.object().shape({
            username: Yup.string().min(3).max(100).required(),
            password: Yup.string().min(4).max(20).required(),
            email: Yup.string().email().required(),
            firstName: Yup.string().required(),
            lastName: Yup.string().required(),
            birthDate: Yup.date().required(),
          })}
          onSubmit={(data, { resetForm }) => {
            axios
              .post("http://localhost:3001/auth", data)
              .then((response) => {
                console.log(response.data);
                resetForm(); // Limpa os campos do formulário após o envio bem-sucedido
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

              <Form.Group as={Row} controlId="formImage">
                <Form.Label column sm={12} className="custom-label">
                  Foto de Perfil
                </Form.Label>
                <Col sm={12}>
                  <Form.Control
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                </Col>
              </Form.Group>

              {isImageSelected && (
                <div className="icon-overlay">
                  <canvas id="imageCanvas" className="image-canvas" />
                  <div className="icon-dropdown"> 
                    <p onClick={() => applyFilter("Yellow")}>Amarelo</p>
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
