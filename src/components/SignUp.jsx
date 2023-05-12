import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import Carousel from 'react-bootstrap/Carousel';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase-config';
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import bag from "../assets/bag.png"
import woman from "../assets/woman.png"
import plan from "../assets/plan.png"
import cross from "../assets/cross.png"
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  // const handleSignup = async (e) => {
  //   e.preventDefault();
  //   try {
  //     if (signUpData.password.length < 6) {
  //       throw new Error("Password must be at least 6 characters long");
  //     }

  //     await createUserWithEmailAndPassword(auth, signUpData.email, signUpData.password);

  //     // Add user to Firestore database
  //     const userRef = doc(db, "users", auth.currentUser.uid);
  //     await setDoc(userRef, {
  //       name: signUpData.name,
  //       age: "",
  //       gender: "",
  //       alcoholic: false,
  //       pregnant: false,
  //       primaryContact: {
  //         name: "",
  //         phone: "",
  //         relationship: ""
  //       },
  //       secondaryContact: {
  //         name: "",
  //         phone: "",
  //         relationship: ""
  //       },
  //       medicalConditions: {
  //         anaphylaxis: false,
  //         asthma: false,
  //         diabetes: false,
  //         heartDisease: false,
  //         epilepsy: false,
  //         hypertension: false,
  //         stroke: false,
  //         allergy: false
  //       }

  //     });

  //     // Wait for user data to be stored in Firestore before redirecting to dashboard
  //     const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
  //       if (firebaseUser) {
  //         unsubscribe();
  //         navigate(`/${firebaseUser.uid}/customize`, { state: firebaseUser.uid });
  //       }
  //     });
  //     // Return the cleanup function to remove the listener when the component unmounts
  //     return () => {
  //       unsubscribe();
  //     };

  //   } catch (error) {
  //     if (error.code === "auth/email-already-in-use") {
  //       setError("Email already in use");
  //     } else if (error.message === "Password must be at least 6 characters long") {
  //       setError(error.message)
  //     }
  //     else {
  //       setError("An error occurred while signing up");
  //     }
  //   }
  // };

  /////////////////////////////////////////////////////////////////////////////////////////////

  async function createUser() {
    try {
      if (signUpData.password.length < 6) {
        throw new Error("Password must be at least 6 characters long");
      }
      await createUserWithEmailAndPassword(auth, signUpData.email, signUpData.password);

      // Add user to Firestore database
      const userRef = doc(db, "users", auth.currentUser.uid);
      await setDoc(userRef, {
        name: signUpData.name,
        age: "",
        gender: "",
        alcoholic: false,
        pregnant: false,
        primaryContact: {
          name: "",
          phone: "",
          relationship: ""
        },
        secondaryContact: {
          name: "",
          phone: "",
          relationship: ""
        },
        medicalConditions: {
          anaphylaxis: false,
          asthma: false,
          diabetes: false,
          heartDisease: false,
          epilepsy: false,
          hypertension: false,
          stroke: false,
          allergy: false
        }

      });

    } catch (error) {
      setLoading(false);
      if (error.code === "auth/email-already-in-use") {
        setError("Email already in use");
      } else if (error.message === "Password must be at least 6 characters long") {
        setError(error.message)
      }
      else {
        setError("An error occurred while signing up");
      }
    }
  }





  const handleSignup = async (e) => {
    setLoading(true);
    e.preventDefault();
    Promise.all([createUser()]).then(() => {
      // Wait for user data to be stored in Firestore before redirecting to dashboard
      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          unsubscribe();
          navigate(`/${firebaseUser.uid}/customize`, { state: firebaseUser.uid });
        }
      });
      // Return the cleanup function to remove the listener when the component unmounts
      return () => {
        unsubscribe();
      };
    });

  };



  return (

    <>
      <div className="container">
        <div className="page">
          <div className="header">
            <div className="logo"><img src={cross} /><h4>Health Guardian</h4></div>
          </div>

          <div className="carousel-container mt-1">
            <Carousel className="carousel" variant="dark">
              <Carousel.Item interval={3000}>
                <div className="img-container w-100">
                  <img
                    className="img-lg carousel-img"
                    src={bag}
                    alt="First slide"
                  />
                </div>

                <Carousel.Caption>
                  <h3>Learn Essential First Aid Skills</h3>
                  <p>Our app provides access to general first-aid tips</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item interval={3000}>
                <div className="img-container w-100">
                  <img
                    className=" img-lg carousel-img"
                    src={woman}
                    alt="Second slide"
                  />
                </div>

                <Carousel.Caption>
                  <h3>Stay Healthy</h3>
                  <p>We provide personalized tips and guidance to help you stay safe and healthy.</p>
                </Carousel.Caption>
              </Carousel.Item>
              <Carousel.Item interval={3000}>
                <div className="img-container w-100">
                  <img
                    className="carousel-img"
                    src={plan}
                    alt="Third slide"
                  />
                </div>

                <Carousel.Caption>
                  <h3>Create a plan</h3>
                  <p>
                    Create your own personal emergency plan with
                    step-by-step guidance based on your health conditions.
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
            </Carousel>
          </div>
          <div className="get-started">
            <a href="#sign"><Button className="mb-5 mt-3 w-sm-50 fill-btn" >Get Started</Button></a>
          </div>

        </div>
        <div className="page">
          <div className="header mt-5">
            <h1 id="sign">Sign up</h1>
          </div>
          <Row className="justify-content-md-center">
            <Col md={5}>
              {error ? <div><Alert className="mt-3 mb-4" variant="danger">{error}</Alert></div> : ""}
              <Form className="form w-sm-50" onSubmit={handleSignup}>
                <Form.Group className="mb-3 form-grp" controlId="name">
                  <Form.Label>First Name: </Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Enter your first name"
                    autoComplete="off"
                    value={signUpData.name}
                    onChange={(e) =>
                      setSignUpData({
                        ...signUpData,
                        name: e.target.value,
                      })}
                  />
                </Form.Group>
                {/*  */}
                <Form.Group className="mb-3 form-grp" controlId="email">
                  <Form.Label>Email: </Form.Label>
                  <Form.Control
                    required
                    type="email"
                    placeholder="Email"
                    autoComplete="off"
                    value={signUpData.email}
                    onChange={(e) =>
                      setSignUpData({
                        ...signUpData,
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
                    placeholder="Password"
                    value={signUpData.password}
                    onChange={(e) =>
                      setSignUpData({
                        ...signUpData,
                        password: e.target.value,
                      })}
                  />
                </Form.Group>
                <Button className="mb-4 mt-3 w-100 fill-btn" type="submit" disabled={loading}>
                  {loading ? "Signing up..." : "Sign Up"}
                </Button>
              </Form>
              <div >
                <p>
                  Already have an account? <Link to="/login">Log In</Link>.
                </p>
              </div>

            </Col>
          </Row>

        </div>
      </div>
    </>
  )

};

export default SignUp;