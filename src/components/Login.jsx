import React, { useEffect, useState, useRef } from 'react';
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import cross from "../assets/cross.png";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Login = () => {
  const [logInData, setLogInData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        window.location.href = `${user.uid}/dashboard`;
      } else {
        // User not logged in or has just logged out.
      }
    })
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, logInData.email, logInData.password);

    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      if (errorCode === 'auth/wrong-password') {
        setError('Incorrect email or password. Please try again.');
      } else if (errorCode === 'auth/user-not-found') {
        setError('User not found. Please check your email and try again.');
      } else {
        setError(errorMessage);
      }
    }
  };

  return (
    <div className='container'>
      <div className="header">
        <div className="logo"><img src={cross} /><h4>Health Guardian</h4></div>
        <h1>Welcome Back!</h1>
      </div>
      <Row className="justify-content-md-center">
        <Col md={5}>
          {error ? <div><Alert className="mt-3 mb-4" variant="danger">{error}</Alert></div> : ""}
          <Form className="form w-sm-50" onSubmit={handleLogin}>
            {/*  */}
            <Form.Group className="mb-3 form-grp" controlId="email">
              <Form.Label>Email: </Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Email"
                autoComplete="off"
                value={logInData.email}
                onChange={(e) =>
                  setLogInData({
                    ...logInData,
                    email: e.target.value,
                  })}
              />
            </Form.Group>

            {/* password */}
            <Form.Group className="mb-3 form-grp" controlId="password">
              <Form.Label>Password: </Form.Label>
              <Form.Control
                required
                type="password"
                autoComplete="off"
                placeholder='Password'
                value={logInData.password}
                onChange={(e) =>
                  setLogInData({
                    ...logInData,
                    password: e.target.value,
                  })}
              />
            </Form.Group>
            <Button className="mb-4 mt-3 w-100 fill-btn" type="submit">
              Log In
            </Button>
          </Form>
          <p>
            Don't have an account? <Link to="/">Sign up here</Link>.
          </p>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
