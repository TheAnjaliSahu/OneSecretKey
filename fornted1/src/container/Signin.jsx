import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signin = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/signin', {
          email: values.email,
          password: values.password,
        });
        if (response.data.token) {
          toast.success('Signin successful');
          localStorage.setItem('authtoken', response.data.token);
          setTimeout(() => navigate('/'), 2000);
        }
      } catch (error) {
        toast.error('Error occurred while signing in');
        console.log("Signin error", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <div className="text-center mb-4">
          <h2>Welcome Back</h2>
          <p className="text-muted">
            Serving you from: <strong>European Union</strong>
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="bg-white p-4 rounded shadow">
          <div className="mb-3">
            <label htmlFor="email" className="form-label"></label>
            <input
              id="email"
              type="email"
              className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
              placeholder="Email Address"
              {...formik.getFieldProps('email')}
              style={{ border: '1px solid rgb(209, 213, 219)' }}
            />
            {formik.touched.email && formik.errors.email ? (
              <div className="invalid-feedback">{formik.errors.email}</div>
            ) : null}
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label"></label>
            <input
              id="password"
              type="password"
              className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
              placeholder="Enter your password"
              {...formik.getFieldProps('password')}
              style={{ border: '1px solid rgb(196, 67, 21)' }}
            />
            {formik.touched.password && formik.errors.password ? (
              <div className="invalid-feedback">{formik.errors.password}</div>
            ) : null}
          </div>

          <div className="mb-3 form-check d-flex align-items-center justify-content-between">
            <div>
              <input
                type="checkbox"
                className="form-check-input"
                id="rememberMe"
                checked={formik.values.rememberMe}
                onChange={formik.handleChange}
              />
              <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
            </div>
            <a href="#" className="text-muted text-decoration-none">Forgot your password?</a>
          </div>

          <button
            type="submit"
            className="btn text-white"
            style={{
              backgroundColor: 'rgb(196, 61, 27)',
              border: 'none',
              width: '100%',
            }}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="text-center my-3">
            <span className="text-muted">or</span>
          </div>

          <div className="text-center">
            <Link
              to="/Signup"
              className="text-decoration-none"
              style={{ color: 'rgb(196, 67, 21)' }}
            >
              Create your account today
            </Link>
          </div>
        </form>

        <button 
          onClick={goToHome}
          className="btn w-100 mt-3 text-white"
          style={{ backgroundColor: 'rgb(196, 67, 21)', border: '1px solid rgb(196, 67, 21)' }}
        >
          Go to Home
        </button>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Signin;
