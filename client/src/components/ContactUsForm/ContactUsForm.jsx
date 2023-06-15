import { useState } from 'react';

const ContactUsForm = () => {
  const [formInfo, setFormInfo] = useState({
    type:'',
    name:'',
    email:'',
    body:''
  })

  const handleChange = (e) => {
    setFormInfo({ ...formInfo, [e.target.name]: e.target.value})
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formInfo);
    fetch('http://localhost:8080/email', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(formInfo)
    })
    .then(res => res.json())
    .then(data => alert(data))
    .catch(err => console.log(err))
  };

  return (
    <div className='ContactUsFormContainer bg-gray-300 flex flex-col items-center justify-center p-4 rounded shadow-inner'>
      <h1 className='ContactUsHeader text-[#45A29E] text-3xl font-semibold mb-10'>Contact Us</h1>
      <form onSubmit={handleSubmit}>
      <label className='TypeLabel text-[#222222]' for='type'>Type:</label>
        <select required name='type' className='ContactUsType w-full p-2 mb-4 bg-white rounded-md shadow mt-1' onChange={handleChange}>
          <option className='ContactUsOption' value=''></option>
          <option className='ContactUsOption' value='attic'>Add an Attic</option>
          <option className='ContactUsOption' value='feedback'>Feedback</option>
        </select>
        <label className='NameLabel text-[#222222]' for='name'>Name:</label>
        <input required name='name' className='ContactUsInput w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder='Enter your name...' onChange={handleChange}/>
        <label className='EmailLabel text-[#222222]' for='email'>Email:</label>
        <input required name='email' className='ContactUsInput w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder='Enter your email address...' onChange={handleChange}/>
        <label className='BodyLabel text-[#222222]' for='body'>Body:</label>
        <textarea required name='body' className='ContactUsInput w-full p-2 mt-1 mb-10 h-32 bg-white rounded-md shadow' placeholder='Enter in your message...' onChange={handleChange}/>
        <button
                className="LoginButton bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] hover:scale-105"
                type='submit'
              >
                Submit
              </button>
      </form>
    </div>
  )
}

export default ContactUsForm
