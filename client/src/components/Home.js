import React from "react";
import { Link } from "react-router-dom";
import "../styles/main.css";

const HomePage = () => {
  return (
    <div className="container">
      <h1>Welcome to the Recipes</h1>
      <Link to="/signup" className="btn btn-primary btn-lg">
        Get started
      </Link>
    </div>
  );
};

export default HomePage;
