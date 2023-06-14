import { useState, useEffect } from 'react';
import {Login, Register} from '../../components/index.js';

const LoginPage = () => {

  const [login, setLogin] = useState(true);

  return (
    <div className='LoginPage'>
      {login ?
      <>
        <Login />
        <button onClick={() => setLogin(!login)}>Register</button>
      </> :
      <>
      <Register />
      <button onClick={() => setLogin(!login)}>Back to login</button>
      </>
      }
    </div>
  )
}

export default LoginPage;