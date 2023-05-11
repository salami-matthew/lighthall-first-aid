import React, { useEffect, useState } from 'react';
import { emergencyInstructions } from './emergencyInstruction';
import { collection, query, updateDoc, where, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import ClipLoader from "react-spinners/ClipLoader";
import { Form, Button } from "react-bootstrap";


function PersonalizedEmergencyPlan() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const userid = location.state;
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
      allergy: false,
      other: false
    }
  });

  const [userHealthConditions, setUserHealthConditions] = useState([]);

  // to save as pdf
  const generatePdf = () => {
    var opt = {
      margin: [3, 10],
      filename: `${userData.name} emergency plan.pdf`,
      enableLinks: true,
      pagebreak: { avoid: ['li', 'a', 'h5'] }
    }
    const element = document.getElementById('pdf-container');
    html2pdf().set(opt).from(element).save();
  }


  async function getUserData() {
    const userDbData = await getDoc(doc(db, "users", userid));
    const newHealthConditionsArr = Object.entries(userDbData.data().medicalConditions)
    newHealthConditionsArr.forEach(condition => {
      if (condition[1] === true) {
        if (userHealthConditions.includes(condition[0])) {
        } else {
          setUserHealthConditions((prev) => [...prev, condition[0]])
        }
      }
    });

    setUserData(userDbData.data());
  }


  let initialized = false

  useEffect(() => {
    setLoading(true)
    if (!initialized) {
      initialized = true
      Promise.all([getUserData()])
        .then(() => setLoading(false))
        .catch(error => console.log(error));
    }
  }, []);

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
        <div className='container plan'>
          <div id='pdf-container'>


            <h1>Personalized Emergency Plan</h1>

            <h2>Emergency Contact Information:</h2>
            <p>Primary Emergency Contact: {userData?.primaryContact?.name} ({userData?.primaryContact?.relationship}), {userData?.primaryContact?.phone}</p>
            <p>Secondary Emergency Contact: {userData?.secondaryContact?.name} ({userData?.secondaryContact?.relationship}), {userData?.secondaryContact?.phone}</p>


            <h2>Health Conditions:</h2>
            <ul>
              {userHealthConditions?.map((condition, index) => (
                <li className='mt-2 mb-2' key={index}>{condition}</li>
              ))}
            </ul>

            <h2>Emergency instructions</h2>
            <ul>
              {emergencyInstructions?.map((item) => (
                userHealthConditions.includes(item.key) ?
                  <div key={item.name}>
                    <h5>In Case of {item.name}</h5>
                    {item.emergencyInstructions.map((i) => <li className='mt-2 mb-2'>{i}</li>)}
                    <p className='more-info'>more info: <a href={item.source} target='_blank'>{item.source}</a></p>
                  </div> : ""
              ))}
            </ul>

          </div>
          <Button onClick={generatePdf} className='mt-3 mb-3 w-100 fill-btn' variant="primary" type="submit">
            Download PDF
          </Button>

        </div>
      }
    </>
  );
}

export default PersonalizedEmergencyPlan;
