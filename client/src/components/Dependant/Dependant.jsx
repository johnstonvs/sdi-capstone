import { useState } from 'react';
import { ConfirmationModal } from '../index';
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

const Dependant = ({ submit, baseList, sendToLogin, user, setUser }) => {
    const [showModal, setShowModal] = useState(false);
    const [rentery, setReentry] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });

        if (e.target.name === 'password') {
          setPasswordsMatch(user.password === rentery);
        }
      };

    return (
        <div>
            <form className='DependantContainer bg-gray-300 flex flex-col justify-center p-4 rounded shadow-inner w-96' onSubmit={submit}>
                <h1 className='DependantTitle text-[#45A29E] text-3xl font-semibold mb-10 text-center'>Create Dependant Account</h1>
                <label className='BodyLabel text-[#222222]'>Email:</label>
                <input name='email' className='DependantEmail w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={user.email} placeholder='Enter your email' type='email' required onChange={(e) => handleChange(e)} />
                <label className='BodyLabel text-[#222222]'>Full Name:</label>
                <input name='name' className='DependantName w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={user.name} placeholder='Enter your full name' type='text' required onChange={(e) => handleChange(e)} />
                <label className='BodyLabel text-[#222222]'>Sponsor's Full Name:</label>
                <input name='sponsorName' required className='DependantSponsName w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={user.sponsorName} placeholder="Enter your sponsor's full name" type='text' onChange={(e) => handleChange(e)} />
                <label className='BodyLabel text-[#222222]'>Sponsor's DOD ID Number:</label>
                <input name='sponsorDOD' className='DependantSponsDOD w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={user.sponsorDOD} placeholder="Enter your sponsor's DOD ID" type='text' required onChange={(e) => handleChange(e)} />
                <label className='BodyLabel text-[#222222]'>Base <span className='text-gray-500'>(optional)</span> :</label>
                <select name='base' className='DependantBase w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={user.base} placeholder='Enter your base' type='text' onChange={(e) => handleChange(e)}>
                    <option></option>
                    {baseList ? (
                        baseList.map((base, index) => {
                            return <option key={index}>{base.location}</option>
                        })
                    ) : null}
                </select>
                <label className='BodyLabel text-[#222222]'>Password:</label>
                <input name='password' className='DependantPassword w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={user.password} placeholder='Enter your password' type='password' required onChange={(e) => handleChange(e)} />
                <label className='BodyLabel text-[#222222]'>Re-enter Password:</label>
                <input className='DependantReEnter w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder='Re-enter your password' type='password' required onChange={(e) => setReentry(e.target.value)} />
                <p className='PassMatch'>{rentery ? (rentery === user.password ? <p className='flex flex-row items-center gap-2'><AiOutlineCheck className='text-green-500' /> Passwords match! </p> : <p className='flex flex-row items-center gap-2'><AiOutlineClose className='text-red-500' />Passwords do not match! </p>) : null}</p>
                <button type='submit' className='DependantButt bg-[#2ACA90] text-white p-2 mt-4 rounded hover:bg-[#5DD3CB] hover:scale-105' disabled={passwordsMatch} >Submit</button>
            </ form>
            <ConfirmationModal
                message="You have successfully registered a new account! Please log in!"
                show={showModal}
                handleClose={() => {
                    setShowModal(false)
                    sendToLogin()
                }} />
        </ div>
    )
}

export default Dependant;