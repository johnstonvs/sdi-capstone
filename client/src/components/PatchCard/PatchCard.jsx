

const PatchCard = ({ patch }) => {

  return (
    <div className='PatchCardContainer bg-gray-300 flex flex-col justify-center p-4 rounded-xl shadow-md gap-3 transform hover:scale-105 transition duration-200 ease-in-out h-full'>
      <img className='PatchImage self-center h-40 w-40 object-cover object-center rounded-lg' src={patch.picture_url} alt={patch.name}/>
      <h2 className='PatchName text-center font-semibold text-[#45A29E] truncate'>{patch.name}</h2>
      <h1 className='PatchPrice text-center font-semibold text-[#222222]'>${patch.price}</h1>
    </div>
  )
}

export default PatchCard;