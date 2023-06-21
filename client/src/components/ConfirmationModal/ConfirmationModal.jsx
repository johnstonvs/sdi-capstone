import { useEffect, useState } from 'react';

const ConfirmationModal = ({ message, show, handleClose }) => {
  return (
      show ?
      <div className='ModalContainer top-1/4 fixed z-10 inset-0 overflow-y-auto'>
          <div className='ModalContent bg-white rounded shadow p-4 m-4 sm:m-auto sm:w-1/3'>
              <h1 className='ModalTitle text-[#45A29E] text-3xl font-semibold mb-4 text-center'>Confirmation</h1>
              <p className='ModalMessage text-[#222222] mb-4 text-center'>{message}</p>
              <div className='ModalActions text-center'>
                  <button onClick={handleClose} className='CloseButton bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] hover:scale-105'>Close</button>
              </div>
          </div>
      </div>
      : null
  );
};

export default ConfirmationModal