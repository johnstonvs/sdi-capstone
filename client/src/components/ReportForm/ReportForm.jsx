import { useState, useEffect } from 'react';
import { ConfirmationModal } from '../index';
import emailjs from '@emailjs/browser';

const ReportForm = ({ patch, closeForm }) => {
  const [formInfo, setFormInfo] = useState({
    patch_id: patch.id,
    type:'',
    email:'',
    body:''
  })

  const [showModal, setShowModal] = useState(false);

  const serviceId = process.env.REACT_APP_SERVICE_ID;
  const template2Id = process.env.REACT_APP_TEMPLATE_ID_2;
  const emailKey = process.env.REACT_APP_EMAIL_JS_KEY;

  const handleChange = (e) => {
    setFormInfo({ ...formInfo, [e.target.name]: e.target.value})
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.send(serviceId, template2Id, formInfo, emailKey)
    .then((res) => {
        console.log('res:', res);
    }, (error) => {
        console.log('error:', error);
    });
    setFormInfo({
      patch_id: patch.id,
      type:'',
      email:'',
      body:''
    })
    setShowModal(true);
  };

  return (
    <div className='top-1/4 fixed z-10 inset-0 overflow-y-auto'>
    <div className='ReportFormContainer bg-white flex flex-col w-1/4 m-auto items-center justify-center p-4 rounded shadow-inner'>
      <h1 className='ReportHeader text-[#45A29E] text-3xl font-semibold mb-10'>Report</h1>
      <form onSubmit={handleSubmit}>
      <label className='NameLabel text-[#222222]'>Email:</label>
        <input required name='email' className='ContactUsInput border-2 border-[#45A29E] w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder='Enter your email...' onChange={handleChange} value={formInfo.email}/>
      <label className='TypeLabel text-[#222222]'>Report Type:</label>
        <select required name='type' className='ReportType border-2 border-[#45A29E] w-full p-2 mb-4 bg-white rounded-md shadow mt-1' onChange={handleChange} value={formInfo.type}>
          <option className='ReportOption' value=''></option>
          <option className='ReportOption' value='Illegal Content'>Illegal Content</option>
          <option className='ReportOption' value='Inappropriate Content'>Inappropriate Content</option>
          <option className='ReportOption' value='Price Gouging'>Price Gouging</option>
          <option className='ReportOption' value='Hate Speech or Discrimination'>Hate Speech or Discrimination</option>
          <option className='ReportOption' value='Other'>Other</option>
        </select>
        <label className='BodyLabel text-[#222222]'>Report Reason:</label>
        <textarea required name='body' className='ReportInput border-2 border-[#45A29E] w-full p-2 mt-1 mb-10 h-32 bg-white rounded-md shadow' placeholder='Enter in your report message...' onChange={handleChange} value={formInfo.body}/>
        <div className='flex flex-row justify-between'>
        <button
          className="LoginButton bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] hover:scale-105"
          type='submit'
        >
          Submit
        </button>
        <button
          className="LoginButton text-white p-2 rounded bg-[#FF3300] hover:bg-[#FF9980] hover:scale-105"
          onClick={() => closeForm()}
        >
          Cancel
        </button>
        </div>
      </form>
    </div>
          <ConfirmationModal
          message="You have successfully submitted a report form! We will address this issue ASAP!"
          show={showModal}
          handleClose={() => {
            setShowModal(false)
            closeForm()
          }}
        />
      </div>
  )

}

export default ReportForm