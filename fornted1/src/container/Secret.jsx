import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button, Card, Form, Alert, Spinner } from 'react-bootstrap';

const Secret = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [input, setInput] = useState('');
  const [secret, setSecret] = useState(null);
  const [error, setError] = useState(null);
  const [incorrectPassphrase, setIncorrectPassphrase] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passphraseRequired, setPassphraseRequired] = useState(false);
  const [awaitingReveal, setAwaitingReveal] = useState(false); // for passphrase = null

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/secret/${id}`);
        // setSecret(response.data.secret); // If passphrase not needed and secret is returned
        if (response.data.passphraseRequired) {
          setPassphraseRequired(true);
        } else {
          setAwaitingReveal(true); // no passphrase, but user must click reveal
        }
      } catch (err) {
        // 
        if (err.response?.status === 410) {
          // Secret expired or already viewed
          setError('This secret has been viewed or expired.');
        } else if (err.response?.status === 403) {
          // Invalid passphrase case
          setIncorrectPassphrase(true);
        } else {
          // Other error
          setError('An error occurred. Please try again.');
        }
      }
    };

     fetchSecret();
    },[id]);

  const handleReveal = async () => {
    if (passphraseRequired && !input.trim()) {
      // setLoading(true);
      setIncorrectPassphrase(true);
      return;
    }

    setLoading(true);
    try {
      // const url = input
      const url = passphraseRequired
      ? `http://localhost:5000/api/secret/${id}?passphrase=${encodeURIComponent(input)}&reveal=true`
      : `http://localhost:5000/api/secret/${id}?reveal=true`;
   
      const response = await axios.get(url);
      setSecret(response.data.secret);
      setIncorrectPassphrase(false);
      setAwaitingReveal(false);
    } catch (err) {
      if (err.response?.status === 403) {
        setIncorrectPassphrase(true);
      } else {
        setError('This secret has been viewed or expired.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 text-center">
      {secret && (
        <>
          <h4>This message is for you:</h4>
          <Card className="p-4 mb-3">
            <p><strong>Secret content:</strong></p>
            <p>{secret}</p>
            <p><em>(This message will not be shown again.)</em></p>
          </Card>
          <Button variant="outline-dark" onClick={() => navigator.clipboard.writeText(secret)}>
            📋 Copy to clipboard
          </Button>
          <p className="mt-3 text-muted">You can close this window when done.</p>
        </>
      )}

      {passphraseRequired && !secret && !error && (
        <>
          <h4>Your secure message is ready.</h4>
          <p>This message requires a passphrase:</p>
          <Form className="mb-3">
            <Form.Control
              type="password"
              placeholder="Enter the passphrase here"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="mb-2"
            />
            {incorrectPassphrase && (
              <Alert variant="danger">❌ Passphrase is incorrect. Please try again.</Alert>
            )}
            <Button variant="danger" onClick={handleReveal} disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : '🔓 Click to Reveal'}
            </Button>
          </Form>
        </>
      )}

      {!passphraseRequired && awaitingReveal && !secret && !error && (
        <>
          <h4>Your secure message is ready.</h4>
          <p>This message does not require a passphrase.</p>
          <Button variant="primary" onClick={handleReveal} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : '🔓 Click to Reveal'}
          </Button>
        </>
      )}


      {error && (
        <>
          <h4>This secret has been viewed or expired.</h4>
          <p>Need help?</p>
          <Button variant="primary" onClick={() => navigate('/')}>🏠 Return to Home</Button>
        </>
      )}
    </div>
  );
};

export default Secret;