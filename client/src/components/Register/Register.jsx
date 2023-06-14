import {useState} from 'react';

const Register = () => {
    const [user, setUser] = useState({
        email: '',
        name: '',
        base: '',
        password: ''
    });
    const [rentery, setReentry] = useState('');

    const handleChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value });
    };

    const submit = () => {
        fetch('http://localhost:8080/users', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                email: user.email,
                name: user.name,
                base: user.base,
                password: user.password
            })
        })
    }

    return (
        <div className='RegisterContainer'>
            <h1 className='RegisterTitle'>Create Account</h1>
            <input name='email' className='RegisterEmail' placeholder='Enter you military email' type='text' required onChange={(e) => handleChange(e)}/>
            <input name='name' className='RegisterName' placeholder='Enter your full name' type='text' required onChange={(e) => handleChange(e)}/>
            <input name='base' className='RegisterBase' placeholder='Enter your base' type='text' onChange={(e) => handleChange(e)}/>
            <input name='password' className='RegisterPassword' placeholder='Enter your password' type='text' required onChange={(e) => handleChange(e)}/>
            <input className='RegisterReEnter' placeholder='Please renter you password' type='text' required onChange={(e) => handleChange(e)} />
            <p className='PassMatch'>{rentery ? (rentery === user.password ? 'Passwords match'(<p className='Check'>&#10003;</p>)  : 'Passwords do not match'(<p className='X'>&#120;</p>)): null}</p>
            <button className='RegisterButt' onClick={() => submit()}>Submit</button>
        </div>
    )
}

export default Register;