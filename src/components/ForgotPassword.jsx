import React, { useEffect, useState, useRef } from 'react';
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { sendPasswordResetEmail } from "firebase/auth";
import cross from "../assets/cross.png";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Success! Please check your email for your password reset link");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/user-not-found') {
        setError('User Not Found, please check the email or create a new account');
      } else {
        setError(errorMessage)
      }
    };
  }

  return (
    <div className='container'>
      <div className='page'>
        <div className="header">
          <div className="logo"><img src={cross} /><h4>Health Guardian</h4></div>
          <h1>Reset Password</h1>

        </div>

        <Row className="justify-content-md-center">
          <Col md={5}>

            {error ? <div><Alert className="mt-3 mb-4" variant="danger">{error}</Alert></div> : ""}
            {message ? <div><Alert className="mt-3 mb-4" variant="success">{message}</Alert></div> : ""}

            <Form className="form w-sm-50" onSubmit={handleReset}>
              {/*  */}
              <Form.Group className="mb-3 form-grp" controlId="email">
                <Form.Label>Email: </Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="Email"
                  autoComplete="off"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value,
                    )}
                />
              </Form.Group>
              <p>(Enter your email and we'll send a reset link to you)</p>
              <Button className="mb-4 mt-3 w-100 fill-btn" type="submit">
                Submit
              </Button>
            </Form>
            <p>
              Back to <Link to="/">Home Page</Link>.
            </p>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default ForgotPassword;
