import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import NavBar from "./components/Navbar";
import HomePage from "./components/Home";
import LoginPage from "./components/Login";
import SignUpPage from "./components/SignUp";
import CreateRecipePage from "./components/CrateRecipe";
import ProfileSettingsPage from "./components/ProfileSettings";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  const [message, setMessage] = useState("");
  return (
    <Router>
      <div className="">
        <NavBar />
        <Routes>
          <Route
            exact
            path="/create-recipe"
            element={<CreateRecipePage />}
          ></Route>
          <Route
            exact
            path="/profile-settings"
            element={<ProfileSettingsPage />}
          ></Route>
          <Route exact path="/login" element={<LoginPage />}></Route>
          <Route exact path="/signup" element={<SignUpPage />}></Route>
          <Route exact path="/" element={<HomePage />}></Route>
        </Routes>
      </div>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
