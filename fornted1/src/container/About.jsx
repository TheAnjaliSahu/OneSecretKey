import React from 'react';
import { Container } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="mt-5">
      <h2>🔐 About SecureShare</h2>
      <p>
        SecureShare is a simple and privacy-focused tool designed for securely sharing sensitive information like passwords, private notes, and API keys. When you create a secret, the platform generates a one-time link. Once the recipient views the message, it is permanently deleted.
      </p>

      <p>
        Our mission is to help users avoid the risks of leaving confidential data exposed in chats, emails, or logs. SecureShare ensures your secret vanishes after a single view or when a set expiration time is reached.
      </p>

      <p>
        All secrets are encrypted before being stored, and you can add an optional passphrase for extra protection. This way, even if someone intercepts the link, they won't be able to read the secret without the correct password.
      </p>

      <p>
        With flexible expiration options, you can control how long your secret remains active — from minutes to days — or make it self-destruct after the first view.
      </p>

      <p>
        Built using modern web technologies like <strong>React</strong> for the frontend, <strong>Node.js</strong> for the backend, and <strong>MongoDB</strong> for secure data storage, SecureShare is engineered to be fast, reliable, and user-friendly.
      </p>

      <p>
        Whether you’re sharing credentials, personal notes, or sensitive business info — SecureShare gives you peace of mind knowing your data won’t linger.
      </p>

      <p>
        💡 Start using SecureShare today and experience the safer way to exchange secrets.
      </p>

      <p>
        SecureShare is a simple, privacy-first tool for safely sharing secrets like passwords or notes through one-time links.
      </p>

      <p>
        Here’s an example of how a secret link looks:
      </p>

    </Container>
  );
};

export default About;
