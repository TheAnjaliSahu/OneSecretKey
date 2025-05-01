import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Footer = () => {
  return (
    <footer className="bg-light text-dark py-5 w-100">
        
      <div className="container">
        <div className="row text-start">
          {/* Column 1: Company */}
          <div className="col-md-4 mb-3">
            <h5 className="text-uppercase">Company</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-dark text-decoration-none">About</a></li>
              <li><a href="#" className="text-dark text-decoration-none">Pricing</a></li>
              <li><a href="#" className="text-dark text-decoration-none">Blog</a></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div className="col-md-4 mb-3">
            <h5 className="text-uppercase">Resources</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-dark text-decoration-none">GitHub</a></li>
              <li><a href="#" className="text-dark text-decoration-none">Docs</a></li>
              <li><a href="#" className="text-dark text-decoration-none">API</a></li>
              <li><a href="#" className="text-dark text-decoration-none">Status</a></li>
            </ul>
          </div>

          {/* Column 3: Other */}
          <div className="col-md-4 mb-3">
            <h5 className="text-uppercase">Other</h5>
            <ul className="list-unstyled">
              <li><a href="#" className="text-dark text-decoration-none">Privacy</a></li>
              <li><a href="#" className="text-dark text-decoration-none">Terms</a></li>
              <li><a href="#" className="text-dark text-decoration-none">Security</a></li>
              <li><a href="#" className="text-dark text-decoration-none">European Union</a></li>
              <li><a href="#" className="text-dark text-decoration-none">Feedback</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center mt-4 text-muted small">
          © 2025 <strong>OnetimeSecret.com</strong>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

