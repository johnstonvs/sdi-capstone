import { useState, useEffect } from 'react';

const PatchCard = ({ patch }) => {

  return (
    <div className='PatchCardContainer bg-gray-300 flex flex-col justify-center p-4 rounded shadow-inner gap-3 hover:scale-105'>
      <img className='PatchImage h-52 object-cover object-center w-40 h-40' src={patch.picture_url} alt={patch.name}/>
      <h2 className='PatchName text-center font-semibold text-[#45A29E]'>{patch.name}</h2>
      <h1 className='PatchPrice text-center font-semibold text-[#222222]'>${patch.price}</h1>
    </div>
  )
}

export default PatchCard;