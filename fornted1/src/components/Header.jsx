import React from "react";
import "../App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Header = () => {
  return (
    <header className="bg-light border-bottom shadow-sm py-3">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Logo Section */}
        <div className="d-flex align-items-center">
          <img
            src="https://onetimesecret.com/dist/assets/onetime-logo-v3-xl.CelDEh9e.svg"
            alt="Logo"
            className="me-2"
            style={{ height: "40px" }}
          />
          <h4 className="mb-0">Onetime Secret</h4>
        </div>

        {/* Navigation Links */}
        <nav>
          <ul className="nav">
            <li className="nav-item">
              <a href="/signup" className="nav-link text-dark">Create Account</a>
            </li>
            <li className="nav-item">
              <a href="/about" className="nav-link text-dark">About</a>
            </li>
            <li className="nav-item">
              <a href="/signin" className="nav-link text-dark">Sign In</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
