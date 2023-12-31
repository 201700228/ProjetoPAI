import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { Formik, Field, Form as FormikForm } from "formik";
import * as Yup from "yup";
import { AuthContext } from "../../helpers/AuthContext";
import { Form, Button, Row, Col } from "react-bootstrap";
import { sepia, invert, grayscale, normal } from "../../Filters";
import { imageDataToFile, getImageTypeFromBase64 } from "../../Files";
import "./Profile.css";

function Profile() {
  const formikRef = useRef();
  const { authState } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    profilePicture: null,
  });
  const [isImageChanged, setIsImageChanged] = useState(false);

  useEffect(() => {
    if (authState.status) {
      loadUserData(authState.id);
    }
  }, [authState]);

  const loadUserData = (userId) => {
    axios
      .get(`http://localhost:3001/auth/basicinfo/${userId}`)
      .then((response) => {
        const imageArray = response.data.profilePicture.data;
        const imageData = new Uint8Array(imageArray);
        const imageBase64 = btoa(String.fromCharCode.apply(null, imageData));
        const imageUrl = `data:image/jpeg;base64,${imageBase64}`;

        setUserData({
          username: response.data.username,
          email: response.data.email,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          birthDate: response.data.birthDate.split("T")[0],
          profilePicture: imageUrl,
        });

        if (response.data.profilePicture.data) {
          const canvas = document.getElementById("imageCanvas");
          const ctx = canvas.getContext("2d");
          const img = new Image();
          img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
          };
          setImage(imageUrl);

          img.src = imageUrl;
        }
      })
      .catch((error) => {
        console.error("Erro ao carregar dados do utilizador:", error);
      });
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    const canvas = document.getElementById("imageCanvas");
    const ctx = canvas.getContext("2d");

    if (selectedImage) {
      const imageUrl = URL.createObjectURL(selectedImage);
      const img = new Image();

      img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };

      img.src = imageUrl;

      setImage(imageUrl);
      setIsImageChanged(true);

      setUserData((prevValues) => ({
        ...prevValues,
        profilePicture: selectedImage,
      }));
    }
  };

  const applyFilter = async (filter) => {
    const canvas = document.getElementById("imageCanvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    let filteredImageData;

    img.onload = function () {
      ctx.drawImage(img, 0, 0);

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

      imageDataToFile(filteredImageData, "image", getImageTypeFromBase64(image))
        .then((file) => {
          setIsImageChanged(true);
          setUserData((prevValues) => ({
            ...prevValues,
            profilePicture: file,
          }));
          setImage(canvas.toDataURL());
        })
        .catch((error) => {
          console.error("Error converting ImageData to File:", error);
        });
    };

    img.src = image;
  };

  const handleUpdate = async (data) => {
    try {
      if (authState.status) {
        const formData = new FormData();
        formData.append("username", data.username);
        formData.append("email", data.email);
        formData.append("firstName", data.firstName);
        formData.append("lastName", data.lastName);
        formData.append("birthDate", data.birthDate);
        if (data.profilePicture) {
          formData.append("profilePicture", data.profilePicture);
        }

        await axios.put(
          `http://localhost:3001/auth/${authState.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
    } catch (error) {
      console.error("Error:", error);
    }
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
      <h2>Perfil</h2>

      <div
        className="image-container"
        onClick={() => document.getElementById("inputFile").click()}
      >
        <div className="icon-overlay">
          <canvas id="imageCanvas" className="preview-image" />
          <div className="icon-dropdown">
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
        innerRef={formikRef}
        enableReinitialize={true}
        initialValues={userData}
        validationSchema={validationSchema}
        onSubmit={(data) => {
          handleUpdate(data);
        }}
      >
        {({ handleSubmit }) => (
          <FormikForm noValidate onSubmit={handleSubmit} className="inner-form">
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
              disabled={
                formikRef.current &&
                (!formikRef.current.isValid || !formikRef.current.dirty) &&
                !isImageChanged
              }
              className="submit-button"
            >
              Atualizar
            </Button>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
}

export default Profile;
