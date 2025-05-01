import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4 shadow-sm">
      <div className="container-fluid">
        {/* Left: Logo & Slogan */}
        <Link to="/" className="navbar-brand">
          <h4 className="m-0">OneTime Secret</h4>
          <small className="text-muted">Signed. Sealed. Delivered.</small>
        </Link>

        {/* Right: Navigation Links */}
        <div className="ms-auto d-flex gap-3">
          <Link to="/signup" className="nav-link">Create Account</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/signin" className="nav-link">Sign In</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
