import React, { useState, useEffect } from 'react';
import Accordion from 'react-bootstrap/Accordion';
import ClipLoader from "react-spinners/ClipLoader";

function Handbook() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  // get FAQs from NHS site
  var myHeaders = new Headers();
  myHeaders.append("subscription-key", import.meta.env.VITE_NHS_API_KEY);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  // fetch("https://api.nhs.uk/common-health-questions/accidents-first-aid-and-treatments", requestOptions)
  //   .then(response => response.text())
  //   .then(result => console.log(result.significantLink))
  //   .catch(error => console.log('error', error));

  useEffect(() => {
    setLoading(true)

    const fetchTopics = async () => {
      try {
        const response = await fetch("https://api.nhs.uk/common-health-questions/accidents-first-aid-and-treatments", requestOptions);
        const data = await response.json();
        const result = data.significantLink;
        setTopics(result);
      } catch (error) {
        console.error(error);
      }
    };

    Promise.all([fetchTopics()])
      .then(() => setLoading(false))
      .catch(error => console.log(error));
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
        <div className='handbook'>
          <h1>First Aid Handbook</h1>

          <h3>ABCs of First Aid</h3>

          <p>
            If someone is unconscious or unresponsive, the basic principle of first aid that you need to know is ABC: airway, breathing, and circulation.

            Airway: If someone’s not breathing, the first thing you need to do is clear their airway.
            Breathing: If you have cleared a person’s airway but they’re still not breathing, provide rescue breathing.
            Circulation: As you are doing rescue breathing, perform chest compressions to keep the person’s blood circulating. If the person is breathing but is not responsive, check their pulse. If their heart has stopped, provide chest compressions.</p>
          <em><span className='mb-5'>source:<a href='https://www.verywellhealth.com/basic-first-aid-procedures-1298578' target='_blank'> https://www.verywellhealth.com/basic-first-aid-procedures-1298578</a></span></em>

          <Accordion className='accord mt-3 mb-3'>
            {topics?.map(topic => (
              <Accordion.Item eventKey={topic.name}>
                <Accordion.Header>{topic.name}</Accordion.Header>
                <Accordion.Body>
                  {topic.description}
                  <a href={topic.url} target='_blank'>more info</a>
                </Accordion.Body>
              </Accordion.Item>


            ))}
          </Accordion>
          <em><p>Author: <a href='www.nhs.uk' target='_blank'>www.nhs.uk</a></p></em>
        </div>}
    </>
  );
}

export default Handbook;



