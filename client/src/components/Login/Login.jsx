import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'
import { LoggedInContext } from '../../App.js';

const Login = () => {
  const [user, setUser] = useState({
    email: '',
    password: ''
  });

  const [buttonClicked, setButtonClicked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('')
  const { loggedIn, setLoggedIn } = useContext(LoggedInContext);
  const nav = useNavigate()


  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value })
  };

  const authenticate = (e) => {
    e.preventDefault()
    fetch('http://localhost:8080/authenticate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(data => {
        if (!data.error)
        {
          setLoggedIn(data)
          setButtonClicked(true);
        } else {
          setErrorMessage(data.error);
          setButtonClicked(true);
        }
      })
      .catch(err => console.log(err))
      setUser({
        email: '',
        password: ''
      })
  };

  useEffect(() => {
    if (loggedIn.id) {
      fetch(`http://localhost:8080/users/${loggedIn.id}`)
        .then(res => res.json())
        .then(data => {
          setLoggedIn({
            ...loggedIn,
            admin: data[0].attic_admin
          })
          localStorage.setItem('user', JSON.stringify(loggedIn));
          if (loggedIn.isLoggedIn) nav('/');
        })
    }

  }, [loggedIn])

  return (
      <form className='LoginContainer bg-gray-300 flex flex-col justify-center p-4 rounded shadow-inner w-96' onSubmit={authenticate}>
        <h1 className='LoginHeader text-3xl text-[#45A29E] font-semibold mb-10 text-center'>Login</h1>
        <label className='NameLabel text-[#222222]'>Email:</label>
        <input className='LoginEmail w-full p-2 mb-4 bg-white rounded-md shadow mt-1' name='email' value={user.email} placeholder='Enter your email' type='email' required onChange={(e) => handleChange(e)} />
        <label className='NameLabel text-[#222222]'>Password:</label>
        <input className='LoginPassword w-full p-2 mb-4 bg-white rounded-md shadow mt-1' name='password' value={user.password} placeholder='Enter your password' type='password' required onChange={(e) => handleChange(e)} />
        <button className='LoginButton bg-[#2ACA90] text-white p-2 rounded mt-4 hover:bg-[#5DD3CB] hover:scale-105' type='submit' >Login</button>
        <p className='RetryMessage'>{!buttonClicked ? '' : loggedIn.isLoggedIn ? 'Logged in successfully!' : 'Wrong email or password, try again...'}</p>
      </form>
  )
}

export default Login;