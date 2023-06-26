import { useState, useEffect } from 'react';
import { ConfirmationModal } from '../index';
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import emailjs from '@emailjs/browser';

const Veteran = ({ baseList, sendToLogin, user, setUser }) => {
  const [showModal, setShowModal] = useState(false);
  const [rentery, setReentry] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [render, setRender] = useState(false);
  const [formInfo, setFormInfo] = useState({
    type: 'DD-214 Verification',
    name: '',
    email: '',
    body: '',
  })

  const serviceId = process.env.REACT_APP_SERVICE_ID;
  const templateId = process.env.REACT_APP_TEMPLATE_ID;
  const emailKey = process.env.REACT_APP_EMAIL_JS_KEY;

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });

    if (e.target.name === 'name' || e.target.name === 'email') {
      setFormInfo({ ...formInfo, [e.target.name]: e.target.value });
    }
  };

  const submit = (e) => {
    e.preventDefault();

    let formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    formData.append('file', pdfUrl);

    fetch('http://localhost:8080/users/veterans', {
      method: 'POST',
      body: formData,
    })
      .then(res => res.json())
      .then(data => {
        setFormInfo({ ...formInfo, body: `The url for the DD-214 of ${user.name} is ${data}` })
        setRender(!render);
        return formInfo
    })
    .catch(err => console.error(err))

    fetch('http://localhost:8080/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: user.email,
        name: user.name,
        sponsor_name: user.sponsorName,
        sponsor_DOD_ID: user.sponsorDOD,
        base: user.base,
        password: user.password
      })
    })

    setUser({
      email: '',
      name: '',
      base: '',
      password: ''
    })

    setFormInfo({
      type: 'DD-214 Verification',
      name: '',
      email: '',
      body: ''
    })
    setShowModal(true);
  }

  useEffect(() => {
    emailjs.send(serviceId, templateId, formInfo, emailKey)
        .then((res) => {
        console.log('res:', res);
        }, (error) => {
        console.log('error:', error);
        })
  }, [render])

  useEffect(() => {
    setPasswordsMatch(user.password === rentery)
  }, [rentery, user])

  return (
    <div>
      <form id='form' className='VeteranContainer bg-gray-300 flex flex-col justify-center p-4 rounded shadow-inner w-96' onSubmit={submit}>
        <h1 className='VeteranTitle text-[#45A29E] text-3xl font-semibold mb-10 text-center'>Create Veteran Account</h1>
        <label className='BodyLabel text-[#222222]'>Email:</label>
        <input name='email' className='VeteranEmail w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={user.email} placeholder='Enter your email' type='email' required onChange={(e) => handleChange(e)} />
        <label className='BodyLabel text-[#222222]'>Full Name:</label>
        <input name='name' className='VeteranName w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={user.name} placeholder='Enter your full name' type='text' required onChange={(e) => handleChange(e)} />
        <label name='body' className='BodyLabel text-[#222222]'>DD-214:</ label>
        <input id='DD-214' className='FileButt w-full p-2 border-2 border-[#45A29E] rounded mb-4' accept='.pdf' type='file' onChange={(e) => { setPdfUrl(e.target.files[0]) }} />
        <label className='BodyLabel text-[#222222]'>Base <span className='text-gray-500'>(optional)</span> :</label>
        <select name='base' className='VeteranBase w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={user.base} placeholder='Enter your base' type='text' onChange={(e) => handleChange(e) }>
            <option></ option>
          {baseList ? (
            baseList.map((base, index) => {
              return <option key={index}>{base.location}</option>
            })
          ) : null}
        </select>
        <label className='BodyLabel text-[#222222]'>Password:</label>
        <input name='password' className='VeteranPassword w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={user.password} placeholder='Enter your password' type='password' required onChange={(e) => handleChange(e)} />
        <label className='BodyLabel text-[#222222]'>Re-enter Password:</label>
        <input className='VeteranReEnter w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder='Re-enter your password' type='password' required onChange={(e) => setReentry(e.target.value)} />
        <p className='PassMatch'>{rentery ? (rentery === user.password ? <p className='flex flex-row items-center gap-2'><AiOutlineCheck className='text-green-500' /> Passwords match! </p> : <p className='flex flex-row items-center gap-2'><AiOutlineClose className='text-red-500' />Passwords do not match! </p>) : null}</p>
        <button type='submit' className='VeteranButt bg-[#2ACA90] text-white p-2 mt-4 rounded hover:bg-[#5DD3CB] hover:scale-105' disabled={!passwordsMatch} >Submit</button>
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

export default Veteran;