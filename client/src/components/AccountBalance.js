import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";
import { useForm } from "react-hook-form";
import { Form, Button, Table, Modal } from "react-bootstrap";

const HomePage = () => {
  const token = localStorage.getItem("REACT_TOKEN_AUTH_KEY");
  const [accountBalance, setAccountBalance] = useState([]);

  useEffect(() => {
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${JSON.parse(token)}`,
      },
    };

    fetch("http://localhost:5000/auth/account-balance", requestOptions)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setAccountBalance(data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <div className="container">
      <h1>Your account balance</h1>

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>Account number</th>
            <td>{accountBalance.id}</td>
          </tr>
          <tr>
            <th>Balance</th>
            <td>{accountBalance.balance}</td>
          </tr>
          <tr>
            <th>Currency</th>
            <td>{accountBalance.currency}</td>
          </tr>
        </thead>
        <tbody></tbody>
      </Table>
    </div>
  );
};

export default HomePage;
