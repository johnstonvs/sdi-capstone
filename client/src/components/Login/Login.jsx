import { useState, useEffect } from 'react';

const Login = () => {

  // HARD CODED EMAIL AND PASSWORD
  const email = 'johndoe@email.com';
  const password = 'password';

  const [user, setUser] = useState({
    email: '',
    password: ''
  });
  const [authenticated, setAuthenticated] = useState(false);
  const [buttonClicked, setButtonClicked]  = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value})
  };

  // checks if input email and password are correct
  const authenticate = () => {
    if (user.email === email && user.password === password) {
      setAuthenticated(true);
      setButtonClicked(true);
      // log user in and redirect to home
    } else {
      setAuthenticated(false);
      setButtonClicked(true);
    }
  };

  return (
    <div className='About'>
      <h1>Login</h1>
      <input className='LoginEmail' name='email' placeholder='Enter military email...' type='text' required onChange={(e) => handleChange(e)}/>
      <input className ='LoginPassword' name='password' placeholder='Enter password...' type='text' required onChange={(e) => handleChange(e)}/>
      <button onClick={authenticate}>Login</button>
      <p className='RetryMessage'>{!buttonClicked ? '' : authenticated ? 'Good login.' : 'Wrong email or password, try again...'}</p>
    </div>
  )
}

export default Login;