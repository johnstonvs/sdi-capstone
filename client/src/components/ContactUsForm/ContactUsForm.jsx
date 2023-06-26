import { useState } from 'react';
import emailjs from '@emailjs/browser';
import { ConfirmationModal } from '../index';

const ContactUsForm = () => {
  const [formInfo, setFormInfo] = useState({
    type:'',
    name:'',
    email:'',
    body:''
  })

  const serviceId = process.env.REACT_APP_SERVICE_ID;
  const templateId = process.env.REACT_APP_TEMPLATE_ID;
  const emailKey = process.env.REACT_APP_EMAIL_JS_KEY;
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormInfo({ ...formInfo, [e.target.name]: e.target.value})
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.send(serviceId, templateId, formInfo, emailKey)
    .then((res) => {
        console.log('res:', res);
    }, (error) => {
        console.log('error:', error);
    });
    setFormInfo({
      type:'',
      name:'',
      email:'',
      body:''
    })
    setShowModal(true);
  };

  return (
    <div>
    <div className='ContactUsFormContainer bg-gray-300 flex flex-col w-2/4 m-auto items-center justify-center p-6 rounded-lg shadow-inner'>
      <h1 className='ContactUsHeader text-[#45A29E] text-3xl font-semibold mb-10'>Contact Us</h1>
      <form onSubmit={handleSubmit}>
      <label className='TypeLabel text-[#222222]'>Type:</label>
        <select required name='type' className='ContactUsType w-full p-2 mb-4 bg-white rounded-md shadow mt-1 focus:outline-none focus:ring-2 focus:ring-[#45A29E]' onChange={handleChange} value={formInfo.type}>
          <option className='ContactUsOption' value=''></option>
          <option className='ContactUsOption' value='Add an Attic'>Add an Attic</option>
          <option className='ContactUsOption' value='Feedback'>Feedback</option>
        </select>
        <label className='NameLabel text-[#222222]'>Name:</label>
        <input required name='name' className='ContactUsInput w-full p-2 mb-4 bg-white rounded-md shadow mt-1 focus:outline-none focus:ring-2 focus:ring-[#45A29E]' placeholder='Enter your name...' onChange={handleChange} value={formInfo.name}/>
        <label className='EmailLabel text-[#222222]'>Email:</label>
        <input required name='email' className='ContactUsInput w-full p-2 mb-4 bg-white rounded-md shadow mt-1 focus:outline-none focus:ring-2 focus:ring-[#45A29E]' placeholder='Enter your email address...' onChange={handleChange} value={formInfo.email}/>
        <label className='BodyLabel text-[#222222]'>Body:</label>
        <textarea required name='body' className='ContactUsInput w-full p-2 mt-1 mb-10 h-36 bg-white rounded-md shadow focus:outline-none focus:ring-2 focus:ring-[#45A29E]' placeholder='Enter in your message...' onChange={handleChange} value={formInfo.body}/>
        <button
                className="LoginButton bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#5DD3CB]"
                type='submit'
              >
                Submit
              </button>
      </form>
      </div>
          <ConfirmationModal
          message="You have successfully submitted a contact form!"
          show={showModal}
          handleClose={() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
            setShowModal(false)
          }}
        />
      </div>
  )
}

export default ContactUsForm
