import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      agree: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
      agree: Yup.boolean().oneOf([true], 'You must agree to the terms.'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await axios.post('http://localhost:5000/api/auth/register', {
          email: values.email,
          password: values.password,
        });
        if (response.status === 201) {
          toast.success(`Account created for: ${values.email}`);
          setTimeout(() => navigate('/signin'), 2000);
        }
      } catch (error) {
        toast.error('Error occurred while creating the account');
        console.log('Signup error:', error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="w-100" style={{ maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <h2>Create Your Account</h2>
          <p className="text-muted">
            Serving you from: <strong>United States</strong>
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="bg-white p-4 rounded shadow">
          <div className="mb-3">
            <input
              type="email"
              className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
              placeholder="e.g. tom@myspace.com"
              {...formik.getFieldProps('email')}
              style={{ border: '1px solid rgb(196, 67, 21)' }}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="invalid-feedback">{formik.errors.email}</div>
            )}
          </div>

          <div className="mb-3">
            <input
              type="password"
              className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
              placeholder="Enter your password"
              {...formik.getFieldProps('password')}
              style={{ border: '1px solid rgb(196, 67, 21)' }}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="invalid-feedback">{formik.errors.password}</div>
            )}
          </div>

          <div className="form-check mb-3">
            <input
              className={`form-check-input ${formik.touched.agree && formik.errors.agree ? 'is-invalid' : ''}`}
              type="checkbox"
              id="agree"
              name="agree"
              checked={formik.values.agree}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <label className="form-check-label ms-2" htmlFor="agree">
              I agree to the{' '}
              <a href="#" className="text-decoration-none" style={{ color: 'rgb(196, 67, 21)' }}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-decoration-none" style={{ color: 'rgb(196, 67, 21)' }}>
                Privacy Policy
              </a>
            </label>
            {formik.touched.agree && formik.errors.agree && (
              <div className="text-danger small">{formik.errors.agree}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn text-white mb-3"
            style={{
              backgroundColor: 'rgb(196, 67, 21)',
              border: 'none',
              width: '100%',
            }}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Creating...' : 'Create Account'}
          </button>

          <div className="text-center">
            <span className="text-muted">or, </span>
            <Link to="/signin" className="text-decoration-none" style={{ color: 'rgb(196, 67, 21)' }}>
              sign in to your account
            </Link>
          </div>
        </form>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default Signup;
