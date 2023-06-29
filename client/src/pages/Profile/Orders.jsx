import { useState, useEffect, useContext } from 'react';
import { LoggedInContext, LoadingContext } from "../../App.js";
import { Loader } from '../../components/index.js';
import moment from 'moment';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { loggedIn } = useContext(LoggedInContext);
  const [items, setItems] = useState([]);
  const [patches, setPatches] = useState([]);
  const { loading, setLoading } = useContext(LoadingContext);

  useEffect(() => {
    setLoading(true)
    fetch(`http://localhost:8080/users/${loggedIn.id}/orders`)
      .then(res => res.json())
      .then(data => {
        data.orders = data.orders.map(order => {
          order.item_id = order.item_id.map(id => parseInt(id))
          order.patch_id = order.patch_id.map(id => parseInt(id))
          return order;
        })
        setOrders(data.orders);
        setItems(data.items.flat())
        setPatches(data.patches.flat())
        setLoading(false)
      })
      .catch(err => console.error(err))
  }, [])

  return (
    loading ? (
      <div className="flex flex-rows justify-center items-center h-screen">
        <Loader />
      </div>
    ) : (
      <div className='OrdersContainer mt-28 mb-20 w-1/2 m-auto flex flex-col items-center justify-center py-12 px-4'>
        <h3 className='OrdersTitle text-[#45A29E] text-5xl font-semibold mb-8 text-center'>Your orders</ h3>
        {orders.length ?
          orders.map((order, index) => {
            return (
              <div key={index} className='OrderInfo w-full bg-gray-700/25 rounded-lg shadow-lg p-8 mb-8'>
                <p className='Name text-center text-xl font-semibold text-[#45A29E] mb-2'>{loggedIn.name}</ p>
                <p className='ShipLocation text-center font-semibold text-white mb-1'>Ship location: {order.location}</ p>
                <p className='OrderTimeStamp text-center font-semibold text-white mb-4'>Order placed on: {moment.utc(order.created_at).format("DD MMM YYYY")}</ p>
                <div className='OrderDetails grid grid-cols-1 gap-4 p-4'>
                  {order.item_id[0] !== '' ?
                    order.item_id.map((id) => items.filter(i => i && id === i.id).map((item, index1) =>
                    (
                      <div className='ItemDetails bg-gray-300 p-4 rounded-xl shadow-lg flex flex-col items-center text-center font-semibold text-[#45A29E]' key={index1}>
                        <img className='ItemImage w-32 h-32 object-cover rounded-xl shadow' src={item.picture_url} alt={item.name} />
                        <p className='ItemName mt-2 text-lg'>{item.name}</p>
                        <p className='ItemPrice mt-1 text-black'>${item.price}</p>
                      </ div>
                    )
                    ))
                    : null}
                  {order.patch_id[0] !== '' && patches ? patches.filter(p => p && order.patch_id.includes(p.id)).map((patch, index2) =>
                    <div className='PatchDetails bg-gray-300 p-4 rounded-xl shadow-lg flex flex-col items-center text-center font-semibold text-[#45A29E]' key={index2}>
                      <img className='PatchImage w-32 h-32 object-cover rounded-xl shadow' src={patch.picture_url} alt={patch.name} />
                      <p className='PatchName mt-2 text-lg'>{patch.name}</ p>
                      <p className='PatchPrice mt-1 text-black'>${patch.price}</ p>
                    </ div>
                  ) : null}
                  <div className='Total flex justify-center items-center mt-4 text-xl text-white'>
                    Total: ${order.total}
                  </div>
                </ div>
              </ div>
            )
          })
          : <p className='NoOrders text-center font-semibold text-xl mt-8 text-[#45A29E]'>No orders to display</ p>
        }
      </ div>
    )
  )
}

export default Orders;