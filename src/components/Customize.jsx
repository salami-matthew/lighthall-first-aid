import React, { useEffect, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Form, Button } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { collection, query, updateDoc, where, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import { toast } from 'react-toastify';
import ClipLoader from "react-spinners/ClipLoader";


const Customize = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const [userData, setUserData] = useState({
    name: "",
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

  const userid = location.state;

  async function getUserData() {
    const userDbData = await getDoc(doc(db, "users", userid));
    setUserData(userDbData.data());
  }

  useEffect(() => {
    setLoading(false);
    Promise.all([getUserData()])
      .then(() => setLoading(false))
      .catch(error => console.log(error));
  }, []);


  async function saveUserData(e) {
    e.preventDefault();
    try {
      await updateDoc(doc(db, "users", userid), {
        name: userData.name,
        age: userData.age,
        gender: userData.gender,
        alcoholic: userData.alcoholic,
        pregnant: userData.pregnant,
        primaryContact: {
          name: userData.primaryContact.name,
          phone: userData.primaryContact.phone,
          relationship: userData.primaryContact.relationship
        },
        secondaryContact: {
          name: userData.secondaryContact.name,
          phone: userData.secondaryContact.phone,
          relationship: userData.secondaryContact.relationship
        },
        medicalConditions: {
          anaphylaxis: userData.medicalConditions.anaphylaxis,
          asthma: userData.medicalConditions.asthma,
          diabetes: userData.medicalConditions.diabetes,
          heartDisease: userData.medicalConditions.heartDisease,
          epilepsy: userData.medicalConditions.epilepsy,
          hypertension: userData.medicalConditions.hypertension,
          stroke: userData.medicalConditions.stroke,
          allergy: userData.medicalConditions.allergy
        }
      });
      toast.success("Saved Successfully!");
      navigate(`/${userid}/plan`, { state: userid });
    } catch (error) {
      toast.error("Oops, something went wrong")
    }

  }

  return (
    <>
      {loading ?
        <div className='loader'>
          <ClipLoader
            color={"#FB186A"}
            loading={loading}
            size={70}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
        :

        <div className='container '>
          <h1 className='mt-4'>Personalization</h1>
          <p>(Please fill in your details for the best app experience)</p>
          <Form onSubmit={saveUserData} className='p-3 mt-2 personal-form'>

            {/* General Info */}
            <Row className='mb-3'><h5>General Information</h5></Row>
            <Row className='mb-3'>
              <Col>
                <Form.Group className="d-flex align-items-center gap-3" controlId="userName">
                  <Form.Label>Name: </Form.Label>
                  <Form.Control
                    type="text" autoComplete='off'
                    value={userData?.name}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        name: e.target.value,
                      })}
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="d-flex align-items-center gap-3" controlId="userAge">
                  <Form.Label>Age: </Form.Label>
                  <Form.Control type="number" value={userData?.age}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        age: e.target.value,
                      })} />
                </Form.Group>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col sm={5}>
                <Form.Group className="d-flex align-items-center gap-3" controlId="userGender">
                  <Form.Label>Gender: </Form.Label>
                  <Form.Control type="text" autoComplete='off' value={userData?.gender}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        gender: e.target.value,
                      })} />
                </Form.Group>
              </Col>
            </Row>
            <Row className='mb-3'>
              <Col><Form.Group className="mb-3" controlId="smoke">
                <Form.Check
                  type="checkbox" label="Do you smoke or drink?"
                  checked={userData?.alcoholic}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      alcoholic: e.target.checked,
                    })}
                />
              </Form.Group></Col>
              <Col><Form.Group className="mb-3" controlId="pregnant">
                <Form.Check type="checkbox" label="Are you currently pregnant?"
                  checked={userData?.pregnant}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      pregnant: e.target.checked,
                    })}
                />
              </Form.Group></Col>
            </Row>




            <Row className='mb-3'><h5>Emergency Contacts</h5></Row>
            {/* Primary contact info */}
            <Row className='mb-3'><h6>Primary</h6></Row>
            <Row className='mb-3'>
              <Form.Group className="d-flex align-items-center gap-3" controlId="primaryName">
                <Form.Label>Name: </Form.Label>
                <Form.Control type="text"
                  value={userData?.primaryContact?.name}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      primaryContact: { ...userData.primaryContact, name: e.target.value },
                    })} />
              </Form.Group>
            </Row>
            <Row className='mb-3'>
              <Col>
                <Form.Group className="d-flex align-items-center gap-3" controlId="primaryPhone">
                  <Form.Label>Phone: </Form.Label>
                  <Form.Control type="text" autoComplete='off'
                    value={userData?.primaryContact?.phone}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        primaryContact: { ...userData.primaryContact, phone: e.target.value },
                      })} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="d-flex align-items-center gap-3" controlId="primaryRelationship">
                  <Form.Label>Relationship: </Form.Label>
                  <Form.Control type="text"
                    value={userData?.primaryContact?.relationship}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        primaryContact: { ...userData.primaryContact, relationship: e.target.value },
                      })}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Secondary contact info */}
            <Row className='mb-3'><h6>Secondary</h6></Row>
            <Row className='mb-3'>
              <Form.Group className="d-flex align-items-center gap-3" controlId="primaryName">
                <Form.Label>Name: </Form.Label>
                <Form.Control type="text"
                  value={userData?.secondaryContact?.name}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      secondaryContact: { ...userData.secondaryContact, name: e.target.value },
                    })}
                />
              </Form.Group>
            </Row>
            <Row className='mb-3'>
              <Col>
                <Form.Group className="d-flex align-items-center gap-3" controlId="primaryPhone">
                  <Form.Label>Phone: </Form.Label>
                  <Form.Control type="text" autoComplete='off'
                    value={userData?.secondaryContact?.phone}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        secondaryContact: { ...userData.secondaryContact, phone: e.target.value },
                      })} />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="d-flex align-items-center gap-3" controlId="primaryRelationship">
                  <Form.Label>Relationship: </Form.Label>
                  <Form.Control type="text"
                    value={userData?.secondaryContact?.relationship}
                    onChange={(e) =>
                      setUserData({
                        ...userData,
                        secondaryContact: { ...userData.secondaryContact, relationship: e.target.value },
                      })}
                  />
                </Form.Group>
              </Col>
            </Row>




            {/* Medical Conditions */}
            <Row className='mb-3'><h5>Medical Conditions</h5></Row>

            <Row className='mb-3'>
              <Col><Form.Group className="mb-3" controlId="Anaphylaxis">
                <Form.Check type="checkbox" label="Anaphylaxis"
                  checked={userData?.medicalConditions?.anaphylaxis}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      medicalConditions: { ...userData.medicalConditions, anaphylaxis: e.target.checked },
                    })}
                />
              </Form.Group></Col>
              <Col><Form.Group className="mb-3" controlId="Asthma">
                <Form.Check type="checkbox" label="Asthma"
                  checked={userData?.medicalConditions?.asthma}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      medicalConditions: { ...userData.medicalConditions, asthma: e.target.checked },
                    })}
                />
              </Form.Group></Col>
              <Col><Form.Group className="mb-3" controlId="Diabetes">
                <Form.Check type="checkbox" label="Diabetes"
                  checked={userData?.medicalConditions?.diabetes}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      medicalConditions: { ...userData.medicalConditions, diabetes: e.target.checked },
                    })}
                />
              </Form.Group></Col>
            </Row>


            <Row className='mb-3'>
              <Col><Form.Group className="mb-3" controlId="Heart Disease">
                <Form.Check type="checkbox" label="Heart Disease"
                  checked={userData?.medicalConditions?.heartDisease}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      medicalConditions: { ...userData.medicalConditions, heartDisease: e.target.checked },
                    })}
                />
              </Form.Group></Col>
              <Col><Form.Group className="mb-3" controlId="Epilepsy">
                <Form.Check type="checkbox" label="Epilepsy"
                  checked={userData?.medicalConditions?.epilepsy}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      medicalConditions: { ...userData.medicalConditions, epilepsy: e.target.checked },
                    })}
                />
              </Form.Group></Col>
              <Col><Form.Group className="mb-3" controlId="High Blood Pressure">
                <Form.Check type="checkbox" label="Hypertension"
                  checked={userData?.medicalConditions?.hypertension}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      medicalConditions: { ...userData.medicalConditions, hypertension: e.target.checked },
                    })}
                />
              </Form.Group></Col>
            </Row>


            <Row className='mb-3'>
              <Col><Form.Group className="mb-3" controlId="Stroke">
                <Form.Check type="checkbox" label="Stroke"
                  checked={userData?.medicalConditions?.stroke}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      medicalConditions: { ...userData.medicalConditions, stroke: e.target.checked },
                    })}
                />
              </Form.Group></Col>
              <Col><Form.Group className="mb-3" controlId="Food Allergies">
                <Form.Check type="checkbox" label="Food Allergies"
                  checked={userData?.medicalConditions?.allergy}
                  onChange={(e) =>
                    setUserData({
                      ...userData,
                      medicalConditions: { ...userData.medicalConditions, allergy: e.target.checked },
                    })}
                />
              </Form.Group></Col>
              <Col></Col>
            </Row>


            <Button className='mt-3 w-100 fill-btn' variant="primary" type="submit">
              Save
            </Button>
          </Form>

        </div>}
    </>
  )
}

export default Customize