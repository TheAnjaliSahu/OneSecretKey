import React from 'react';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Home = () => {
  // Yup validation schema
  const validationSchema = Yup.object({
    secret: Yup.string().required('Secret is required'),
    passphrase: Yup.string(), // Optional, can add min length if needed
    expiration: Yup.string().required('Expiration is required'),
  });

  const initialValues = {
    secret: '',
    passphrase: '',
    expiration: '',
  };
  const navigate = useNavigate();
  //const handleSubmit = async (values) => {
    // parse out number + unit suffix
    // const amount = parseInt(values.expiration, 10);
    // const unit   = values.expiration.replace(amount, '');

    // // build payload
    // const payload = {
    //   content: values.secret,
    //   passphrase: values.passphrase || null,
    //   // only send the one the user picked:
    //   ...(unit === 'm' ? { expiresInMinutes: amount } : {}),
    //   ...(unit === 'h' ? { expiresInHours:   amount } : {}),
    //   ...(unit === 'd' ? { expiresInDays:    amount } : {}),
    // };   


    const handleSubmit = async (values) => {
      if (!values.expiration) {
        toast.warning("⚠️ Please select an expiration time.");
        return;
      }
    // const handleSubmit = async (values) => {
      const match = values.expiration.match(/^(\d+)([mhd])$/);
      if (!match) {
        toast.error("Invalid expiration format.");
        return;
      }
    
      const amount = parseInt(match[1], 10);
      const unit = match[2];
    
      const payload = {
        content: values.secret,
        passphrase: values.passphrase || null,
        ...(unit === 'm' ? { expiresInMinutes: amount } : {}),
        ...(unit === 'h' ? { expiresInHours: amount } : {}),
        ...(unit === 'd' ? { expiresInDays: amount } : {}),
      };
    
      // console.log('Expires in Days:', payload.expiresInDays);
        try{
      const response = await axios.post('http://localhost:5000/api/secret', payload);
       console.log("response",response);
      const { link,id,createdAt,expiresAt } = response.data;
      // const id = link.split('/').pop();
      // console.log(`"SECRET--:",${id}`);
      // const expireAt =new Yup.date();
      // expireAt.setDate(expireAt.getDate()+parseInt(values.expiration));
      // navigate(`/secret/${id}`);
      // navigate(/viewsecret, { state: { link } });
      toast.success("✅ Secret created successfully!");
      navigate('/viewsecret', { state: { link, id,createdAt,expiresAt } });
      //alert(`Secret created 🎉\n\nLink: ${link}`);
      // navigate('/succsess',{state:{id,expireAt}});
      // resetForm();
    } catch (error) {
      console.log('Error submitting secret:', error);
      toast.error("❌ Failed to create secret. Please try again.");

      //console.log('Form submitted with:', values);
      // TODO: Submit to backend
    }
  };

  return (
    <div className="container mt-5 text-center">
      {/* Title and Subtitle */}
      <h4>Paste a password, secret message or private link below.</h4>
      <p className="text-muted">Keep sensitive info out of your email and chat logs.</p>

      {/* Trust Banner */}
      <Card className="p-3 mb-3 text-start">
        <div className="d-flex justify-content-between align-items-center">
          <strong>🔒 INCREASE TRUST & SHARE WITH CONFIDENCE</strong>
          <Button variant="outline-danger" size="sm">With Custom Domains →</Button>
        </div>
      </Card>

      {/* Formik Form Start */}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange }) => (
          <FormikForm>
            {/* Secret Textarea */}
            <Form.Group className="mb-3 text-start" controlId="secret">
              <Form.Label>Secret</Form.Label>
              <Field
                as="textarea"
                name="secret"
                rows={4}
                placeholder="Secret content goes here..."
                className="form-control"
              />
              <div className="text-danger small">
                <ErrorMessage name="secret" />
              </div>
            </Form.Group>

            {/* Link Preview Placeholder */}
            <div className="border border-secondary-subtle p-3 mb-3 text-muted" style={{ borderStyle: 'dashed' }}>
              <em>Link Preview</em>
            </div>

            {/* Privacy Options */}
            <Card className="p-3 mb-4 text-start">
              <h6 className="fw-bold">Privacy Options</h6>
              <Form.Group className="mb-3" controlId="passphrase">
                <Form.Label>Passphrase</Form.Label>
                <Field
                  type="text"
                  name="passphrase"
                  placeholder="Enter a passphrase"
                  className="form-control"
                />
              </Form.Group>

              <Form.Group controlId="expiration">
                <Form.Label>Expiration Time</Form.Label>
                <Field
                  as="select"
                  name="expiration"
                  className="form-select"
                >
                  {/* minutes */}
                  <option value="" disabled>Select expiration...</option>
                  <optgroup label="Minutes">
                  <option value="1m">Expires in 1 minute</option>
                  <option value="5m">Expires in 5 minutes</option>
                  <option value="30m">Expires in 30 minutes</option>
                  </optgroup>
                  
                  {/* hours */}
                  <optgroup label="Hours">
                  <option value="1h">Expires in 1 hour</option>
                  <option value="4h">Expires in 4 hours</option>
                  <option value="12h">Expires in 12 hours</option>
                  </optgroup>
                 {/* days */}
                 <optgroup label="Days">
                  <option value="1d">Expires in 1 day</option>
                  <option value="3d">Expires in 3 days</option>
                  <option value="7d">Expires in 7 days</option>
                  </optgroup>
                </Field>
              </Form.Group>
            </Card>


            {/* Submit Button */}
            <div className="d-flex justify-content-center">
              <Button type='button' variant="warning" className="me-2">🔑</Button>
              <Button type="submit" variant="danger">Create a secret link*</Button>
            </div>
          </FormikForm>
        )}
      </Formik>
    </div>
  );
};

export default Home;
