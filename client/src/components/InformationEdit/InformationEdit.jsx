import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoggedInContext } from '../../App';

/*

PATCH REQUEST FOR USER INFORMATION

*/



const InformationEdit = () => {

  const { loggedIn } = useContext(LoggedInContext);

  return (
    <div className='InformationEdit'>

    </div>
  )
}

export default InformationEdit;