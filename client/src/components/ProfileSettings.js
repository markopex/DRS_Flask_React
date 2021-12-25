import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";

import { login } from "../auth";
import { Form, Button, Table, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const ProfileSettingsPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
  const [userInfo, setUserInfo] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [serverResponse, setServerResponse] = useState("");
  const [show, setShow] = useState(false);

  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${JSON.parse(token)}`,
    },
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = (id) => {
    setValue("username", userInfo.username);
    setValue("email", userInfo.email);
    setValue("password", userInfo.password);
    setValue("firstname", userInfo.firstname);
    setValue("lastname", userInfo.lastname);
    setValue("address", userInfo.address);
    setValue("city", userInfo.city);
    setValue("country", userInfo.country);
    setValue("phone", userInfo.phone);

    setShowModal(true);
  };

  const submitForm = (data) => {
    if (data.password === data.confirmPassword) {
      const body = {
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname,
        address: data.address,
        city: data.city,
        country: data.country,
        phone: data.phone,
      };

      const requestOptions = {
        method: "PUT",
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
        body: JSON.stringify(body),
      };

      fetch("http://localhost:5000/auth/userinfo", requestOptions)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setServerResponse(data.message);
          handleCloseModal();
          window.location.reload(false);
        })
        .catch((err) => console.log(err));

      reset();
    } else {
      alert("Passwords do not match");
    }
  };

  useEffect(() => {
    fetch("http://localhost:5000/auth/userinfo", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUserInfo(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      <div className="container">
        <div className="form">
          <h1>User profile info</h1>
          <h3>
            <Button className="btn btn-primary" onClick={handleShowModal}>
              Edit
            </Button>
          </h3>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>Username</th>
                <td>{userInfo.username}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{userInfo.email}</td>
              </tr>
              <tr>
                <th>Firstname</th>
                <td>{userInfo.firstname}</td>
              </tr>
              <tr>
                <th>Lastname</th>
                <td>{userInfo.lastname}</td>
              </tr>
              <tr>
                <th>Address</th>
                <td>{userInfo.address}</td>
              </tr>
              <tr>
                <th>Country</th>
                <td>{userInfo.country}</td>
              </tr>
              <tr>
                <th>Phone</th>
                <td>{userInfo.phone}</td>
              </tr>
            </thead>
            <tbody></tbody>
          </Table>
        </div>
      </div>

      {/* MODAL */}

      <Modal show={showModal} size="lg" onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update User profile info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <Form.Group>
              <Form.Label>First name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your firstname"
                {...register("firstname", { required: true, maxLength: 25 })}
              />

              {errors.firstname && (
                <small style={{ color: "red" }}>First name is required</small>
              )}
              {errors.firstname?.type === "maxLength" && (
                <p style={{ color: "red" }}>
                  <small>Max characters should be 25 </small>
                </p>
              )}
            </Form.Group>
            <br />

            <Form.Group>
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your lastname"
                {...register("lastname", { required: true, maxLength: 25 })}
              />

              {errors.lastname && (
                <small style={{ color: "red" }}>Last name is required</small>
              )}
              {errors.lastname?.type === "maxLength" && (
                <p style={{ color: "red" }}>
                  <small>Max characters should be 25 </small>
                </p>
              )}
            </Form.Group>
            <br />

            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your address"
                {...register("address", { required: true, maxLength: 25 })}
              />

              {errors.address && (
                <small style={{ color: "red" }}>Address is required</small>
              )}
              {errors.address?.type === "maxLength" && (
                <p style={{ color: "red" }}>
                  <small>Max characters should be 25 </small>
                </p>
              )}
            </Form.Group>
            <br />

            <Form.Group>
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your city"
                {...register("city", { required: true, maxLength: 25 })}
              />

              {errors.city && (
                <small style={{ color: "red" }}>City is required</small>
              )}
              {errors.city?.type === "maxLength" && (
                <p style={{ color: "red" }}>
                  <small>Max characters should be 25 </small>
                </p>
              )}
            </Form.Group>
            <br />

            <Form.Group>
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your country"
                {...register("country", { required: true, maxLength: 25 })}
              />

              {errors.country && (
                <small style={{ color: "red" }}>Country is required</small>
              )}
              {errors.country?.type === "maxLength" && (
                <p style={{ color: "red" }}>
                  <small>Max characters should be 25 </small>
                </p>
              )}
            </Form.Group>
            <br />

            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your phone"
                {...register("phone", { required: true, maxLength: 25 })}
              />

              {errors.phone && (
                <small style={{ color: "red" }}>Phone is required</small>
              )}
              {errors.phone?.type === "maxLength" && (
                <p style={{ color: "red" }}>
                  <small>Max characters should be 25 </small>
                </p>
              )}
            </Form.Group>
            <br />

            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Your password"
                {...register("password", { required: true })}
              />

              {errors.password && (
                <p style={{ color: "red" }}>
                  <small>Password is required</small>
                </p>
              )}
              {errors.password?.type === "minLength" && (
                <p style={{ color: "red" }}>
                  <small>Min characters should be 8</small>
                </p>
              )}
            </Form.Group>
            <br></br>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Your password"
                {...register("confirmPassword", { required: true })}
              />
              {errors.confirmPassword && (
                <p style={{ color: "red" }}>
                  <small>Confirm Password is required</small>
                </p>
              )}
              {errors.confirmPassword?.type === "minLength" && (
                <p style={{ color: "red" }}>
                  <small>Min characters should be 8</small>
                </p>
              )}
            </Form.Group>
            <br></br>
            <Form.Group>
              <Button
                as="sub"
                variant="primary"
                onClick={handleSubmit(submitForm)}
              >
                SignUp
              </Button>
            </Form.Group>
            <br></br>
            <Form.Group>
              <small>
                Already have an account, <Link to="/login">Log In</Link>
              </small>
            </Form.Group>
            <br></br>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ProfileSettingsPage;
