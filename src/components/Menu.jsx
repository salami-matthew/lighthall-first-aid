import React, { useEffect, useState } from 'react'
import "./Navbar.css"
import { Link, useLocation, useParams } from 'react-router-dom';
import { IoIosMenu, IoIosClose } from "react-icons/io";
import { IconContext } from "react-icons";
import { auth } from "../../firebase-config";
import { signOut } from 'firebase/auth';



const Menu = (props) => {
  const [isClicked, setIsClicked] = useState(false);
  const location = useLocation();


  useEffect(() => {
    setIsClicked(false)
  }, [location])

  function handleClickNav() {
    setIsClicked(!isClicked)
  }

  async function logOut() {
    await signOut(auth);
    document.location.href = "/login";
  }

  return (
    <nav>
      <div className="nav-logo"><h4>Health Guardian</h4></div>
      <div className={isClicked === false ? "links" : "links mobile-links"}>
        <h6><Link state={props.userID} to={`/${props.userID}/dashboard`}>Dashboard</Link></h6>
        <h6><Link state={props.userID} to={`/${props.userID}/handbook`}>Handbook</Link></h6>
        <h6><Link state={props.userID} to={`/${props.userID}/plan`}>ePlan</Link></h6>
        <h6><Link state={props.userID} to={`/${props.userID}/customize`}>Settings</Link></h6>
        <h6 onClick={logOut}><Link>Sign Out</Link></h6>
      </div>

      <div className='toggle-button-container'>
        <button onClick={handleClickNav} className='toggle-button'>
          {isClicked === false ?
            <IconContext.Provider value={{ size: "2rem" }}>
              <IoIosMenu />
            </IconContext.Provider>
            :
            <IconContext.Provider value={{ size: "2.5rem" }}>
              <IoIosClose />
            </IconContext.Provider>
          }
        </button>
      </div>
    </nav>
  )
}
export default Menu;