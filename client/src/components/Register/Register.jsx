import { useState, useEffect } from 'react';
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { ConfirmationModal, Dependant, Veteran } from '../index';

const Register = ({ sendToLogin }) => {
    const [user, setUser] = useState({
        email: '',
        name: '',
        sponsorName: '',
        sponsorDOD: '',
        base: '',
        password: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [rentery, setReentry] = useState('');
    const [baseList, setBaseList] = useState()
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [dependant, setDependant] = useState(false);
    const [veteran, setVeteran] = useState(false);

    const handleChange = (e) => {
      setUser({ ...user, [e.target.name]: e.target.value });
      console.log(user)

      if (e.target.name === 'password') {
        setPasswordsMatch(user.password === rentery);
        console.log(passwordsMatch)
      }
    };

    const submit = (e) => {
        e.preventDefault();
        console.log(user);

        fetch('http://localhost:8080/users', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
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
        setShowModal(true);
    }

    useEffect(() => {
        fetch('http://localhost:8080/attics')
          .then(res => res.json())
          .then(data => {
            setBaseList(data)
          })
          .catch(err => console.error(err))
      }, []);

    return (
        <div>
            {dependant ?
                <Dependant submit={submit} baseList={baseList} handleChange={handleChange} sendToLogin={sendToLogin} user={user} setUser={setUser} />
                :
                veteran ?
                <Veteran baseList={baseList} handleChange={handleChange} sendToLogin={sendToLogin} user={user} setUser={setUser} />
                //display veteran card
            : <form className='RegisterContainer bg-gray-300 flex flex-col justify-center p-4 rounded shadow-inner w-96' onSubmit={submit}>
                <h1 className='RegisterTitle text-[#45A29E] text-3xl font-semibold mb-10 text-center'>Create Account</h1>
                <label className='BodyLabel text-[#222222]'>Email:</label>
                <input name='email' className='RegisterEmail w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={user.email} placeholder='Enter your military email' type='email' required onChange={(e) => handleChange(e)}/>
                <label className='BodyLabel text-[#222222]'>Full Name:</label>
                <input name='name' className='RegisterName w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={user.name} placeholder='Enter your full name' type='text' required onChange={(e) => handleChange(e)}/>
                <label className='BodyLabel text-[#222222]'>Base <span className='text-gray-500'>(optional)</span> :</label>
                <select name='base' className='RegisterBase w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={user.base} placeholder='Enter your base' type='text' onChange={(e) => handleChange(e)}>
                <option></option>
                {baseList ? (
                    baseList.map((base, index) => {
                        return <option key={index}>{base.location}</option>
                    })
                ) : null}
                </select>
                <label className='BodyLabel text-[#222222]'>Password:</label>
                <input name='password' className='RegisterPassword w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={user.password} placeholder='Enter your password' type='password' required onChange={(e) => handleChange(e)}/>
                <label className='BodyLabel text-[#222222]'>Re-enter Password:</label>
                <input className='RegisterReEnter w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder='Re-enter your password' type='password' required onChange={(e) => setReentry(e.target.value)} />
                <p className='PassMatch'>{rentery ? (rentery === user.password ? <p className='flex flex-row items-center gap-2'><AiOutlineCheck className='text-green-500'/> Passwords match! </p>  : <p className='flex flex-row items-center gap-2'><AiOutlineClose className='text-red-500'/>Passwords do not match! </p>): null}</p>
                <button type='submit' className='RegisterButt bg-[#2ACA90] text-white p-2 mt-4 rounded hover:bg-[#5DD3CB] hover:scale-105' disabled={passwordsMatch} >Submit</button>
            </form>
            }
            <ConfirmationModal
                message="You have successfully registered a new account! Please log in!"
                show={showModal}
                handleClose={() => {
                    setShowModal(false)
                    sendToLogin()
                }}/>
            <button className={dependant ? 'hidden' : 'mt-5 text-white p-2 rounded hover:text-[#5DD3CB] hover:scale-105'} onClick={() => setDependant(true)}>Dependant?</ button>
            <button className={veteran ? 'hidden' : 'mt-5 text-white p-2 rounded hover:text-[#5DD3CB] hover:scale-105'} onClick={() => setVeteran(true)}>Veteran?</ button>
        </div>
    )
}

export default Register;