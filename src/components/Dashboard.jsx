import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase-config';
import { signOut } from 'firebase/auth';
import { BsShieldExclamation } from "react-icons/bs";
import { collection, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';
import ClipLoader from "react-spinners/ClipLoader";


const Dashboard = () => {
  const d = new Date();
  const today = d.toLocaleDateString();
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
  const { userid } = useParams();
  const [dailyTip, setDailyTip] = useState({});
  const [emergencyServ, setEmergencyServ] = useState([]);
  const userRef = doc(db, 'users', userid);
  const [loading, setLoading] = useState(false);



  async function getEmergencyServices() {
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = position.coords;

      // get emergency services
      var requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };

      try {
        const response = await fetch(`https://browse.search.hereapi.com/v1/discover?at=${latitude},${longitude}&limit=5&q=ambulance+hospital&apiKey=${import.meta.env.VITE_HERE_API_KEY}`, requestOptions)
        const result = await response.json();
        setEmergencyServ(result.items);
      } catch (error) {
        console.log('error', error);
      }
    });
  };

  //  get user data from db
  async function getUserData() {
    const userDbData = await getDoc(doc(db, "users", userid));
    setUserData(userDbData.data());
  }

  // get health tip from api based on some user data params
  async function getHealthTipFromApi() {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };

    try {
      const response = await fetch("https://health.gov/myhealthfinder/api/v3/myhealthfinder.json?lang=en&age=22&sex=male&tobaccoUse=0&pregnant=0", requestOptions);
      const result = await response.json();
      const tips = result.Result.Resources.all.Resource;
      const setTip = tips[Math.floor(Math.random() * tips.length)];
      return setTip;
    } catch (error) {
      console.log('error', error);
    }
  };

  // store health tip or get health tip from db
  async function getHealthTip() {
    const d = new Date();
    let currentDay = d.getDay();
    const t = await getDoc(doc(db, "dailyTip", "3Hqrt1eiHhWkHFCoO1nm"));
    if (t.data().lastChecked === currentDay) {
      setDailyTip(t.data());
    } else {
      const apiTip = await getHealthTipFromApi();
      // Add a new document in collection 
      await setDoc(doc(db, "dailyTip", "3Hqrt1eiHhWkHFCoO1nm"), {
        title: apiTip.Title,
        content: apiTip.Sections.section[0].Content,
        url: apiTip.AccessibleVersion,
        dateUpdated: apiTip.LastUpdate,
        lastChecked: currentDay
      });
      const t = await getDoc(doc(db, "dailyTip", "3Hqrt1eiHhWkHFCoO1nm"));
      setDailyTip(t.data());
    }
  }


  useEffect(() => {
    setLoading(true)
    Promise.all([getUserData(), getHealthTip(), getEmergencyServices()])
      .then(() => setLoading(false))
      .catch(error => console.log(error));
  }, []);


  // remove html tags
  function removeTags(str) {
    if (str) {
      if ((str === null) || (str === ''))
        return false;
      else
        str = str.toString();
      return str.replace(/(<([^>]+)>)|\&nbsp;|\&nbsp;/ig, '');
    }

  }

  // convert date in milliseconds to formatted date
  function toDate(date) {
    const d = new Date(date * 1000);
    const newDate = d.toLocaleString();
    return newDate
  }



  // main component
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

        <div className='dashboard'>
          <h1>Welcome, {userData?.name}</h1>
          <Row>
            <div className='tip'>
              <p><BsShieldExclamation /> Today's health talk ({today || "Unknown"})</p>
              <h5>{dailyTip?.title || "Unknown"}</h5>
              <p>{removeTags(dailyTip?.content || "Unknown")}</p>
              <a href={dailyTip?.url || "Unknown"} target="_blank" >More Info</a>
              <p>Last Updated: {toDate(dailyTip?.dateUpdated || "Unknown")}</p>
            </div>
          </Row>
          <Row>
            <Col><div className='emergency-contacts mb-5'>
              <h5>{userData?.name}'s Emergency Contact Information</h5>
              <h6>(Go to 'Settings' to update your emergency contact information and customize an emergency plan)</h6>
              <div className="contacts">
                <p>Primary Emergency contact: {userData?.primaryContact?.name || "Unknown"}, {userData?.primaryContact?.phone || "Unknown"}</p>
                <p>Secondary Emergency contact: {userData?.secondaryContact?.name || "Unknown"}, {userData?.secondaryContact?.phone || "Unknown"}</p>
              </div>

            </div></Col>
            <Col><div className='emergency-service'>
              <h5 className='mb-1'>Nearby emergency services</h5>
              {emergencyServ?.length > 0 ? (
                emergencyServ?.map((service, index) => {
                  const addressLabel = service?.address?.label || "Unknown";
                  const categoryName = service?.categories?.[0]?.name || "Unknown";
                  const phoneNumber1 = service?.contacts?.[0]?.phone?.[0]?.value || "Unknown";
                  const phoneNumber2 = service?.contacts?.[0]?.phone?.[1]?.value || "Unknown";
                  return (
                    <Row className='mt-3' key={index}>
                      <div>
                        <ul>
                          <li>
                            <h6>{service?.title}</h6>
                            <p>Address: {addressLabel} </p>
                            <p>Service: {categoryName}</p>
                            <p>Contact Info: {phoneNumber1} {phoneNumber2}</p>
                          </li>
                        </ul>

                      </div>
                    </Row>
                  )
                })
              ) : (
                <p>Please Enable access to your location to get emergency services around your area</p>
              )}
            </div>
            </Col>
          </Row>





        </div>
      }
    </>
  )
}

export default Dashboard