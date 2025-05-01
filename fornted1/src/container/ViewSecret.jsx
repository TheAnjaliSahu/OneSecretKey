import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Card, Form } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatDistanceToNow } from 'date-fns';

const SecretSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, link, expiresAt, createdAt: createdFromState } = location.state || {};

  const [copied, setCopied] = useState(false);
  const [passphraseRequired, setPassphraseRequired] = useState(false);
  const [inputPassphrase, setInputPassphrase] = useState('');
  const [loading, setLoading] = useState(false);
  const [remainingTime, setRemainingTime] = useState('');

  const createdAt = createdFromState ? new Date(createdFromState) : new Date();
  const expirationDate = expiresAt ? new Date(expiresAt) : null;

  // Countdown Timer
  useEffect(() => {
    if (!expirationDate) return;

    const interval = setInterval(() => {
      const now = new Date();
      const diffMs = expirationDate - now;

      if (diffMs <= 0) {
        setRemainingTime('Expired');
        clearInterval(interval);
        toast.error('⏱️ The secret has expired.');
        return setTimeout(() => navigate('/'), 3000);
      }

      const minutes = Math.floor(diffMs / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      setRemainingTime(`in ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [expirationDate, navigate]);

  // Check if passphrase is needed
  useEffect(() => {
    if (!id || !link) {
      navigate('/');
      return;
    }

    const checkPassphrase = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/secret/${id}`);
        if (response.data.passphraseRequired) {
          setPassphraseRequired(true);
        } else {
          setPassphraseRequired(false);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          toast.error("Secret not found.");
          navigate("/");
        } else {
          toast.error("Failed to check passphrase.");
        }
      }
    };
    

    checkPassphrase();
   }, [id ,link,navigate])//[id, link, navigate]);

  // Burn the secret
  const burnSecret = async () => {
    setLoading(true);

    // If passphrase is required, check if user entered it
    if (passphraseRequired && !inputPassphrase.trim()) {
      toast.warn('⚠️ Please enter the passphrase to burn the secret.');
      setLoading(false);
      return;
    }

    try {
      const url = `http://localhost:5000/api/secret/${id}`;
      const config = passphraseRequired
        ? { params: { passphrase: inputPassphrase.trim() } }
        : {};  // No passphrase needed if it's not required

     const response =  await axios.delete(url, config);
      // toast.success('🔥 Secret burned successfully!');
      toast.success(response.data.message);
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      const status = err.response?.status;
      if (status === 403) {
        toast.error('❌ Incorrect passphrase.');
      } else if (status === 404) {
        toast.error('⚠️ Secret already burned or not found.');
      } else {
        toast.error('❌ Failed to burn the secret.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Copy link to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      toast.info('📋 Link copied!');
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const formatDate = (date) => (date ? new Date(date).toLocaleString('en-GB') : 'N/A');

  return (
    <div className="container mt-5 text-center">
      <ToastContainer position="top-center" autoClose={2000} />
      <h4>✅ Secret Created Successfully!</h4>
      <p><strong>Careful: you will only see this once.</strong></p>

      <div className="d-flex flex-column align-items-center">
        <a href={link} target="_blank" rel="noopener noreferrer" className="mb-2">
          {link}
        </a>
        <Button variant="outline-dark" onClick={copyToClipboard}>
          {copied ? "✅ Copied!" : "📋 Copy Link"}
        </Button>
      </div>

      <Card className="p-4 mt-3">
        <h5>📅 Timeline</h5>
        <p>
          <strong>Created:</strong> {formatDate(createdAt)} <br />
          <small>{formatDistanceToNow(createdAt, { addSuffix: true })}</small>
        </p>
        <p>
          <strong>Expires:</strong> {formatDate(expirationDate)} <br />
          <small style={{ color: remainingTime === 'Expired' ? 'red' : 'green' }}>
            {expirationDate
              ? remainingTime === 'Expired'
                ? 'Expired'
                : formatDistanceToNow(expirationDate, { addSuffix: true })
              : 'N/A'}
          </small>
        </p>
      </Card>

      {passphraseRequired && (
        <Form className="mt-4 mb-3">
          <Form.Control
            type="password"
            placeholder="Enter your passphrase to burn"
            value={inputPassphrase}
            onChange={(e) => setInputPassphrase(e.target.value)}
            className="mb-2"
          />
        </Form>
      )}

      <Button
        variant="danger"
        onClick={burnSecret}
        disabled={loading}
        className="mt-3"
      >
        {loading ? 'Burning...' : '🔥 Burn this secret'}
      </Button>

      <Button
        variant="primary"
        onClick={() => navigate('/')}
        className="mt-2"
      >
        ➕ Create another secret
      </Button>
    </div>
  );
};

export default SecretSuccess;
