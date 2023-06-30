import React, { useState, useContext } from 'react';
import { LoggedInContext } from '../../App';
import { ConfirmationModal } from '../index';

const UploadPatch = ({ isOpen, closeModal }) => {
  const { loggedIn } = useContext(LoggedInContext);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const patchSubmit = (e) => {
    e.preventDefault();

    if (!loggedIn.isLoggedIn) {
      alert("You must be logged in to upload a patch.");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('image', imageUrl);
    formData.append('user_id', loggedIn.id);

    fetch('http://localhost:8080/patches', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if(response.ok){
          return response.json();
        }else{
          throw new Error('Something went wrong');
        }
      })
      .then((data) => {
        setModalMessage('Patch created successfully!');
        setShowModal(true);
      })
      .catch((err) => {
        setModalMessage('Failed to create patch. Please try again later.');
        setShowModal(true);
        console.error(err)
      });
  }

  const handleModalClose = () => {
    setShowModal(false);
    closeModal();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
    <div className="bg-white rounded shadow p-6 m-4 w-1/4">
      {loggedIn.isLoggedIn ? (
      <>
      <div className="mb-4">
        <h1 className="text-[#45A29E] text-3xl font-semibold mb-8 text-center">Upload a Patch</h1>
        <label className='text-[#222222]'>Name:</label>
        <input
          className="w-full p-2 border-2 border-[#45A29E] rounded mb-4"
          type="text"
          placeholder="Patch Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
          <label className='text-[#222222]'>Description:</label>
          <textarea
          className="w-full p-2 border-2 border-[#45A29E] rounded mb-4"
          placeholder="Patch Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <label className='text-[#222222]'>Price:</label>
        <input
          className="w-full p-2 border-2 border-[#45A29E] rounded mb-4"
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <label className='text-[#222222]'>Patch Image</label>
        <input
          className="w-full p-2 border-2 border-[#45A29E] rounded mb-4"
          type="file"
          onChange={(e) => setImageUrl(e.target.files[0])}
          accept='image/*'
          required
        />
        <button
          className="w-full bg-[#2ACA90] text-white p-2 mt-10 rounded hover:bg-[#5DD3CB] text-center hover:scale-105"
          onClick={patchSubmit}
        >
          Submit
        </button>
      </div>
      <div className="text-right">
        <button
          type="button"
          className="bg-[#E54B4B] text-white p-2 rounded hover:bg-[#DB2C40] text-center hover:scale-105"
          onClick={closeModal}
        >
          Cancel
        </button>
      </div>
      </>) : (
        <>
        <h1 className="text-[#45A29E] text-3xl font-semibold mb-10 text-center">Please login to use the feature!</h1>
        <div className="text-right">
        <button
          type="button"
          className="bg-[#E54B4B] text-white p-2 rounded hover:bg-[#DB2C40] text-center hover:scale-105"
          onClick={closeModal}
        >
          Cancel
        </button>
      </div>
      </>
      ) }
    </div>
    <ConfirmationModal message={modalMessage} show={showModal} handleClose={handleModalClose}/>
  </div>
  );
}

export default UploadPatch