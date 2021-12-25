import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";

const SignUpPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const [show, setShow] = useState(false);
  const [serverResponse, setServerResponse] = useState("");

  const submitForm = (data) => {
    if (data.password === data.confirmPassword) {
      const body = {
        username: data.username,
        email: data.email,
        password: data.password,
        firstname: data.firstname,
        lastname: data.lastname,
        address: data.address,
        city: data.city,
        country: data.country,
        phone: data.phone,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      };

      fetch("http://localhost:5000/auth/signup", requestOptions)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setServerResponse(data.message);
          setShow(true);
        })
        .catch((err) => console.log(err));

      reset();
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div className="container">
      <div className="form">
        {show ? (
          <>
            <Alert
              variant="success"
              onClose={() => {
                setShow(false);
              }}
              dismissible
            >
              <p>{serverResponse}</p>
            </Alert>

            <h1>Sign Up Page</h1>
          </>
        ) : (
          <h1>Sign Up Page</h1>
        )}
        <form>
          <Form.Group>
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Your username"
              {...register("username", { required: true, maxLength: 25 })}
            />

            {errors.username && (
              <small style={{ color: "red" }}>Username is required</small>
            )}
            {errors.username?.type === "maxLength" && (
              <p style={{ color: "red" }}>
                <small>Max characters should be 25 </small>
              </p>
            )}
          </Form.Group>
          <br></br>
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Your email"
              {...register("email", { required: true, maxLength: 80 })}
            />

            {errors.email && (
              <p style={{ color: "red" }}>
                <small>Email is required</small>
              </p>
            )}

            {errors.email?.type === "maxLength" && (
              <p style={{ color: "red" }}>
                <small>Max characters should be 80</small>
              </p>
            )}
          </Form.Group>
          <br></br>

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
      </div>
    </div>
  );
};

export default SignUpPage;
