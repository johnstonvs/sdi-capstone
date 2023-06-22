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

    fetch('http://localhost:8080/patches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name, price: price, picture_url: imageUrl, user_id: loggedIn.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        closeModal();
      })
      .catch((err) => console.error(err));
  }

  if (!isOpen) return null;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="">
        <div className=""></div>
        <span className="">&#8203;</span>
        <div className="">
          <div className="">
            <h1 className=''>Upload a Patch</h1>
            <input
              className=""
              type="text"
              placeholder="Patch Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className=""
              type="text"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <input
              className=""
              type="file"
              placeholder="Image URL"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <button
              className=""
              onClick={patchSubmit}
            >
              Submit
            </button>
          </div>
          <div className="">
            <button
              type="button"
              className=""
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadPatch