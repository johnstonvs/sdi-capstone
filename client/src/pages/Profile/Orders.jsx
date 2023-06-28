import { useState, useEffect, useContext } from 'react';
import { LoggedInContext, LoadingContext } from "../../App.js";
import { Loader } from '../../components/index.js';

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
<div className='OrdersContainer mt-28 mb-20 lg:mx-16 my-4 gap-5'>
      <h3 className='OrdersTitle text-[#45A29E] text-4xl font-semibold mb-4 text-center'>Your orders</ h3>
      {orders.length ?
        orders.map((order, index) => {
          return (
            <div key={index} className='OrderInfo w-full md:w-1/3 bg-neutral-700/25 rounded-md shadow p-4'>
              <p className='Name text-center font-semibold text-[#45A29E]'>{loggedIn.name}</ p>
              <p className='ShipLocation text-center font-semibold text-[#45A29E]'>Ship location: {order.location}</ p>
              <p className='OrderTimeStamp text-center font-semibold text-[#45A29E]'>Order placed on: {order.created_at}</ p>
              <div className='OrderDetails m-auto bg-gray-300 relative flex flex-row p-4 justify-center rounded-xl shadow-lg mb-4'>
                {items.filter(i => order.item_id.includes(i.id)).map((item, index1) =>
                        (
                          <div className='ItemDetails text-center font-semibold text-[#45A29E]' key={index1}>
                            <img className='ItemImage text-center font-semibold text-[#45A29E]' src={item.picture_url} alt={item.name} />
                            <p className='ItemName text-center font-semibold text-[#45A29E]'>{item.name}</p>
                            <p className='ItemPrice text-center font-semibold text-[#45A29E]'>{item.price}</p>
                          </ div>
                        )
                )}
                {patches.filter(p => order.patch_id.includes(p.id)).map((patch, index2) =>
                      <div className='PatchDetails m-auto bg-gray-300 relative flex flex-row p-4 justify-center rounded-xl shadow-lg mb-4' key={index2}>
                        <img className='PatchImage' src={patch.picture_url} alt={patch.name} />
                        <p className='PatchName text-center font-semibold text-[#45A29E]'>{patch.name}</ p>
                        <p className='PatchPrice text-center font-semibold text-[#45A29E]'>{patch.price}</ p>
                      </ div>
                    )}
                Total: ${order.total}
              </ div>
            </ div>
          )
        })
        : <p className='NoOrders text-center font-semibold text-[#45A29E]'>No orders to display</ p>
      }
    </ div>
    )

  )
}

export default Orders;