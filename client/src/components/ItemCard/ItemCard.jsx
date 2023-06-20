
const ItemCard = ({ item }) => {

  return (
    <div className='ItemCardContainer bg-gray-300 flex flex-col justify-center p-4 rounded shadow-inner gap-3 hover:scale-105 z-5'>
      <img className='ItemImage h-52 object-cover object-center w-40 h-40' src={item.picture_url} alt={item.name}/>
      <h2 className='ItemName text-center font-semibold text-[#45A29E]'>{item.name}</h2>
      <h1 className='ItemPrice text-center font-semibold text-[#222222]'>${item.price}</h1>
      <p className='ItemShip text-center text-[#222222]'>{item.can_ship ? 'Can be shipped' : 'Cannot be shipped'}</p>
    </div>
  )
}
export default ItemCard