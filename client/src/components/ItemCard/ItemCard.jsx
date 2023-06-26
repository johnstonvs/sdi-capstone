
const ItemCard = ({ item }) => {

  return (
    <div className='ItemCardContainer bg-gray-300 flex flex-col justify-center p-4 rounded-xl shadow-md gap-3 transform hover:scale-105 transition duration-200 ease-in-out h-full'>
      <img className='ItemImage self-center h-40 w-40 object-cover object-center rounded-lg' src={item.picture_url} alt={item.name}/>
      <h2 className='ItemName text-center font-semibold text-[#45A29E] truncate'>{item.name.length > 20 ?
      item.name.slice(0, 20) + '. . . ' :
      item.name}</h2>
      <h1 className='ItemPrice text-center font-semibold text-[#222222]'>${item.price}</h1>
      <p className='ItemShip text-center text-[#222222]'>{item.can_ship ? 'Item can be shipped' : 'Item cannot be shipped'}</p>
      {item.location ? <p className='ItemLocation text-center text-[#222222]'>Location: {item.location}</p> : null}

    </div>
  )
}
export default ItemCard