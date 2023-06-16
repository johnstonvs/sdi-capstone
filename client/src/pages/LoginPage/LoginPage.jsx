import { useState, useEffect, useContext } from 'react';
import {Login, Register} from '../../components/index.js';
import { LoggedInContext } from '../../App.js';

const LoginPage = () => {

  const [login, setLogin] = useState(true);
  const {loggedIn} = useContext(LoggedInContext);

  return (
    <>
      {login ?
      <div className='flex flex-col items-center p-4 rounded'>
        <Login />
        <button className='mt-5 text-white p-2 rounded hover:text-[#5DD3CB] hover:scale-105' onClick={() => setLogin(!login)}>Register</button>
      </div> :
      <div className='flex flex-col items-center p-4 rounded'>
      <Register />
      <button className='mt-5 text-white p-2 rounded hover:text-[#5DD3CB] hover:scale-105' onClick={() => setLogin(!login)}>Back to login</button>
      </div>
      }
    </>
  )
}

export default LoginPage;