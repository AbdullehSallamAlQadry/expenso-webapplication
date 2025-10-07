import React, { useEffect, useState } from 'react';
import MainContainer from './main-container';
import logoImg from '../images/logo2.png';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMoneyBillWave, faGear, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

export default function Main({user}) {
  const[selectedSection, setSelectedSection] = useState("Home");

  useEffect(() => {
    document.title = selectedSection;
    return () => document.title = "Expenso";
  }, [selectedSection])

  return (
    <div className="main-container">
      <Profile user = {user} onSelectedSection = {setSelectedSection} selectedSection={selectedSection}/>
      <MainContainer user = {user} selectedSection = {selectedSection} onSelectedSection = {setSelectedSection}/>
    </div>
  );
}

function Profile({user, onSelectedSection, selectedSection}) {
  const Selection = [
    {icon: faHouse, selectName: "Home"},
    {icon: faMoneyBillWave, selectName: "Expense"},
    {icon: faGear, selectName: "Setting"},
    {icon: faCircleQuestion, selectName: "Support"},
  ]

  return (
    <div className="profile-container">
      <div className="User-info">
        {
          user.profile_picture ?
          <img src={user.profile_picture} alt={user.username}/>
          :
          <p className="img-field">{user.username.slice(0,1)}</p>
        }
        <h2>{user.username}</h2>
      </div>
      <div className='profile-btn-container'>
        {
          Selection.map(select => <SeletionBtn select = {select} onSelectedSection = {onSelectedSection} key={select.selectName} isHover={select.selectName === selectedSection ? 'hover' : ''}/>)
        }
      </div>
      <img src={logoImg} alt="Expenso Logo" />
    </div>
  )
}

function SeletionBtn({select, onSelectedSection, isHover}) {
  return (
    <button className={'profile-btn ' + isHover} onClick={() => onSelectedSection(select.selectName)}>
      <FontAwesomeIcon icon = {select.icon}/> {select.selectName}
    </button>
  )
}