import React, { useState } from "react";

import { Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "../auth";

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const loginUser = (data) => {
    console.log(data);

    const requestOptions = {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch("http://localhost:5000/auth/login", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.access_token);

        if (data) {
          login(data.access_token);
          console.log("------------", data);
          localStorage.setItem("userData", JSON.stringify(data.userData));

          navigate("/");
        } else {
          alert("Invalid email or password");
        }
      });

    reset();
  };

  return (
    <div className="container">
      <div className="form">
        <h1>Login Page</h1>
        <form>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your email"
              {...register("email", { required: true, maxLength: 25 })}
            />
          </Form.Group>
          {errors.Email && (
            <p style={{ color: "red" }}>
              <small>Email is required</small>
            </p>
          )}
          {errors.email?.type === "maxLength" && (
            <p style={{ color: "red" }}>
              <small>Email should be 25 characters</small>
            </p>
          )}
          <br></br>

          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Your password"
              {...register("password", { required: true })}
            />
          </Form.Group>
          {errors.password && (
            <p style={{ color: "red" }}>
              <small>Password is required</small>
            </p>
          )}
          <br></br>
          <Form.Group>
            <Button
              as="sub"
              variant="primary"
              onClick={handleSubmit(loginUser)}
            >
              Login
            </Button>
          </Form.Group>
          <br></br>
          <Form.Group>
            <small>
              Do not have an account? <Link to="/signup">Create One</Link>
            </small>
          </Form.Group>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
