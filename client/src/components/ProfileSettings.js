import React from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";

import { login } from "../auth";
import { Form, Button, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";

const ProfileSettingsPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  return (
    <div className="container">
      <div className="container">
        <div className="form">
          <h1>User profile info</h1>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>Mark</td>
                <td>Otto</td>
                <td>@mdo</td>
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
