import {useState} from 'react';
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

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

    const submit = (e) => {
        e.preventDefault()
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
        // comfirmation modal

    }

    return (
        <form className='RegisterContainer bg-gray-300 flex flex-col justify-center p-4 rounded shadow-inner w-96' onSubmit={submit}>
            <h1 className='RegisterTitle text-[#45A29E] text-3xl font-semibold mb-10 text-center'>Create Account</h1>
            <label className='BodyLabel text-[#222222]'>Email:</label>
            <input name='email' className='RegisterEmail w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder='Enter your military email' type='text' required onChange={(e) => handleChange(e)}/>
            <label className='BodyLabel text-[#222222]'>Full Name:</label>
            <input name='name' className='RegisterName w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder='Enter your full name' type='text' required onChange={(e) => handleChange(e)}/>
            <label className='BodyLabel text-[#222222]'>Base:</label>
            <input name='base' className='RegisterBase w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder='Enter your base' type='text' onChange={(e) => handleChange(e)}/>
            <label className='BodyLabel text-[#222222]'>Password:</label>
            <input name='password' className='RegisterPassword w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder='Enter your password' type='text' required onChange={(e) => handleChange(e)}/>
            <label className='BodyLabel text-[#222222]'>Re-enter Password:</label>
            <input className='RegisterReEnter w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder='Re-enter your password' type='text' required onChange={(e) => setReentry(e.target.value)} />
            <p className='PassMatch'>{rentery ? (rentery === user.password ? <p className='flex flex-row items-center gap-2'><AiOutlineCheck className='text-green-500'/> Passwords match! </p>  : <p className='flex flex-row items-center gap-2'><AiOutlineClose className='text-red-500'/>Passwords do not match! </p>): null}</p>
            <button type='submit' className='RegisterButt bg-[#2ACA90] text-white p-2 mt-4 rounded hover:bg-[#5DD3CB] hover:scale-105' >Submit</button>
        </form>
    )
}

export default Register;