import React, { useState, useContext } from 'react';
import { LoggedInContext } from '../../App';

const UploadPatch = ({ isOpen, closeModal }) => {
  const { loggedIn } = useContext(LoggedInContext);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const patchSubmit = (e) => {
    e.preventDefault();

    if (!loggedIn.isLoggedIn) {
      alert("You must be logged in to upload a patch.");
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('image', imageUrl);
    formData.append('user_id', loggedIn.id);

    fetch('http://localhost:8080/patches', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        closeModal();
      })
      .catch((err) => console.error(err));
  }

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center">
    <div className="bg-white rounded shadow p-6 m-4 w-1/4">
      {loggedIn.isLoggedIn ? (
      <>
      <div className="mb-4">
        <h1 className="text-[#45A29E] text-3xl font-semibold mb-4 text-center">Upload a Patch</h1>
        <input
          className="w-full p-2 border-2 border-[#45A29E] rounded mb-4"
          type="text"
          placeholder="Patch Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="w-full p-2 border-2 border-[#45A29E] rounded mb-4"
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <input
          className="w-full p-2 border-2 border-[#45A29E] rounded mb-4"
          type="file"
          onChange={(e) => setImageUrl(e.target.files[0])}
          accept='image/*'
        />
        <button
          className="w-full bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105"
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
  </div>
  );
}

export default UploadPatch