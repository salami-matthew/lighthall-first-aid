import React, { useEffect, useState } from 'react';
import { emergencyInstructions } from './emergencyInstruction';
import { collection, query, updateDoc, where, getDoc, doc } from "firebase/firestore";
import { auth, db } from "../../firebase-config";
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import ClipLoader from "react-spinners/ClipLoader";
import { Form, Button } from "react-bootstrap";
import { BsShieldExclamation } from "react-icons/bs";


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
          <div className='tip mb-1'>
            <p> <BsShieldExclamation />  Remember to regularly visit the "Settings" tab to update your info for the best app experience</p>
          </div>
          <div id='pdf-container'>


            <h1>Personalized Emergency Plan</h1>

            <h2>Emergency Contact Information:</h2>
            <p>Primary Emergency Contact: {userData?.primaryContact?.name || 'Unknown'} ({userData?.primaryContact?.relationship || 'Unknown'}), {userData?.primaryContact?.phone || 'Unknown'}</p>
            <p>Secondary Emergency Contact: {userData?.secondaryContact?.name || 'Unknown'} ({userData?.secondaryContact?.relationship || 'Unknown'}), {userData?.secondaryContact?.phone || 'Unknown'}</p>


            {userHealthConditions.length > 0 && <h2>Health Condition</h2>}
            <ul>
              {userHealthConditions?.map((condition, index) => (
                <li className='mt-2 mb-2' key={index}>{condition}</li>
              ))}
            </ul>

            {userHealthConditions.length > 0 && <h2>Emergency instructions</h2>}
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

            <h2>Basic First Aid Tips:</h2>
            <h5>Performing CPR(Cardiopulmonary resuscitation):</h5>
            <ol className='general-plan'>
              <li>Check for responsiveness by gently tapping the person and shouting "Are you okay?"</li>
              <li>Call for emergency medical services (EMS).</li>
              <li>If the person is not breathing or has no pulse, start chest compressions. Place the heel of your hand on the center of the person's chest and place your other hand on top. Push down hard and fast, about 2 inches deep and at a rate of 100 to 120 compressions per minute.</li>
              <li>After 30 compressions, give two breaths by tilting the person's head back, lifting their chin, and pinching their nose. Give two full breaths while watching for the chest to rise. Continue with compressions and breaths until the EMS arrives.</li>
            </ol>

            <h5>Using an AED(Automated External Defibrillator):</h5>
            <ol className='general-plan'>
              <li>Turn on the AED and follow the voice prompts.</li>
              <li>Remove any clothing from the person's chest and wipe it dry.</li>
              <li>Attach the AED pads to the person's chest as shown on the pads or in the instructions.</li>
              <li>Make sure no one is touching the person and push the "analyze" button if prompted.</li>
              <li>If the AED advises a shock, make sure no one is touching the person and push the "shock" button.</li>
              <li>After the shock is delivered, immediately start chest compressions again as before. Continue with compressions and AED use until the EMS arrives.</li>
            </ol>

            <h5>Assembling a basic emergency kit</h5>
            <ol className='general-plan'>
              <li>Water - Store at least one gallon of water per person per day, for at least three days.</li>
              <li>Non-perishable food - Stock up on easy-to-prepare, non-perishable food items such as canned goods, protein bars, and dried fruits and nuts.</li>
              <li>First aid kit - Include bandages, gauze, antiseptic wipes, antibiotic ointment, pain relievers, scissors, and tweezers.</li>
              <li>Flashlights and extra batteries - Make sure you have a working flashlight and plenty of extra batteries.</li>
              <li>Multi-purpose tool - A basic tool kit including a wrench, pliers, and screwdriver can come in handy.</li>
              <li>Radio - Have a battery-powered or hand-crank radio to stay up-to-date with the latest news and weather updates.</li>
              <li>Medications - Make sure you have a supply of any prescription medications you or your family members may need.</li>
              <li>Personal hygiene items - Include items like toilet paper, wet wipes, and hand sanitizer.</li>
              <li>Cash - Keep some cash on hand in case ATMs are unavailable during an emergency.</li>
              <li>Important documents - Keep copies of important documents such as identification, insurance policies, and medical records in a waterproof container.</li>
            </ol>

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
