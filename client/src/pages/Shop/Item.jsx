import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { LoggedInContext, LoadingContext } from "../../App.js";
import {Loader} from '../../components/index'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './item.css';

const Item = () => {
  const [item, setItem] = useState([]);
  const [attics, setAttics] = useState([]);
  const { loggedIn } = useContext(LoggedInContext);
  const { loading, setLoading } = useContext(LoadingContext);
  const location = useLocation();
  let split = location.pathname.split('/');
  const id = split[3];
  var cart = [];
  const nav = useNavigate()

  useEffect(() => {
    fetch(`http://localhost:8080/items/${id}`)
      .then(res => res.json())
      .then(data => {
        let newData = addLocation(data);
        newData = fixTags(newData[0])
        setItem(newData);
        setLoading(false)
      })
      .catch(err => console.error(err))
  }, [attics])

  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:8080/attics')
      .then(res => res.json())
      .then(data => setAttics(data))
      .catch(err => console.error(err))
  }, [])

  const addLocation = (data) => {
    for (let i = 0; i < attics.length; i++) {
      if (attics[i].id === data[0].attic_id) {
        data[0].location = attics[i].location;
      }
    }
    return data;
  }

  const addCartItem = () => {
    if (localStorage.getItem('itemCart')) {
      cart = JSON.parse(localStorage.getItem('itemCart'));
    }
    cart.push(item.id);
    localStorage.setItem('itemCart', JSON.stringify(cart));
    toast.success("Added to cart!");
  }

  const addToWishlist = () => {
    fetch(`http://localhost:8080/items_wishlist`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: loggedIn.id,
        item_id: item.id
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(data => {
        toast.success("Added to wishlist!")})
      .catch(err => console.log(err))
  }

  const fixTags = (data) => {
    let item = data;
    let tags = item.tags.replace(/\[|\]/g, '').replace(/\{\}/g,'').split(',').map(tag => tag.trim().replace(/['"]/g, ''));
    item.tags = tags;

    return item;
  };


  return (
    loading ? (
      <div className="flex justify-center items-center h-screen">
      <Loader />
      </div>
    ) : (
      <div className='bg-gray-700/25 mt-28 p-6 rounded-xl shadow-xl m-auto fade-in h-full w-2/3'>
      <div className='ItemContainer flex flex-row items-start'>
        <div className="flex justify-start items-start mr-10">
          <img className="ItemImage w-96 object-cover object-center drop-shadow-xl rounded-lg filter brightness-110 hover:brightness-125 transition-all ease-in-out" src={item.picture_url} alt={item.name} />
        </div>
        <div>
        <h1 className='ItemTitle text-[#45A29E] text-3xl text-left w-2/3'>{item.name}</ h1>
        {item?.tags?.length > 0 ? (
          <div className='flex flex-row gap-2 mt-3 text-white'>
            <p className='mr-1'>Tags:</p>
            {item.tags.map((tag, index) => (
              <Link key={index} className='hover:text-[#5DD3CB] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#5DD3CB]' to={`/shop?tag=${tag.replace(/[{}]/g, "")}`}><p>{tag.replace(/[\[\]]/g, "")}</p></Link>
            ))}
          </div>
          ) : null}
          <p className='ItemPrice text-2xl text-white mt-10'>${item.price}</p>
          {item.description ? <p className='ItemPrice text-white mt-20'>{item.description}</p> : null}
          <p className='ItemLocation text-white mt-20'>Location: {item.location}</p>
        </div>
      </div>
                {item.can_ship ?
            <>
              <div className='ItemButtons flex justify-between w-full mt-10'>
              <button className='BackButton text-white p-2 rounded-md bg-[#FF3300] hover:bg-[#FF9980] hover:scale-105' onClick={() => nav('/shop')}>Back</button>
                <button className='AddToCart bg-[#2ACA90] text-white p-2 rounded-md hover:bg-[#5DD3CB] hover:scale-105' onClick={() => { addCartItem() }} >Add to cart</button>
                <button className='AddToWishlistButton bg-[#2ACA90] text-white p-2 rounded-md hover:bg-[#5DD3CB] hover:scale-105' onClick={() => addToWishlist()}>Add to Wishlist</button>
              </div>
            </>
            :
            <>
            <h3 className='ItemShip text-2xl text-[#45A29E] mt-10 mb-5'>'Item cannot be shipped to your local Attic.'</h3>
            <div className='NoShip flex justify-between w-full'>
              <button className='BackButton text-white p-2 rounded-md bg-[#FF3300] hover:bg-[#FF9980] hover:scale-105' onClick={() => nav('/shop')}>Back</button>
              <button className='AddToWishlistButton bg-[#2ACA90] text-white p-2 rounded-md hover:bg-[#5DD3CB] hover:scale-105' onClick={() => addToWishlist()}>Add to Wishlist</button>
            </div>
            </>
          }
      <ToastContainer position="bottom-right" />
    </div>
    )

  )
}

export default Item;

// import React, { useState, useContext, useEffect } from "react";
// import { selectedWalletContext, cartContext } from "../App";
// import { Navbar } from "../Navbar/Navbar";
// import './AccessoriesDetails.css'

// export const AccessoriesDetails = () => {
//     const {selectedWallet, setSelectedWallet} = useContext(selectedWalletContext);
//     const [focusedImage, setFocusedImage] = useState();
//     const {cart, setCart} = useContext(cartContext)

//     const handleImageFocus = (imageToFocus) => {
//         setFocusedImage(imageToFocus)
//     }

//     const handleAddToCartClick = (wantedWallet) => {
//         setCart([...cart, wantedWallet])
//     }

//     useEffect(() => {
//         setFocusedImage(selectedWallet.back)
//     }, [])

//     return (
//         <>
//         <Navbar />
//         <div className="details-container">
//             <div className="details-info">
//                 <h1 className="details-title">{selectedWallet.name}</h1>
//                 <p className="details-price"> ${selectedWallet.price}</p>
//                 <ul className="details-list">
//                     <li className="details-item">{selectedWallet.color}</li>
//                     {selectedWallet.info.map((info) => {
//                         return (
//                             <li className="details-item">{info}</li>
//                         )
//                     })}
//                 </ul>
//         </div>
//         <div className="focused-image-container">
//             <img className= "focused-image" src = {focusedImage} />
//         </div>
//         <div className="wallet-images-container">
//             <img className="wallet-images" onClick = {() => { handleImageFocus(selectedWallet.image) }} src={selectedWallet.image} />
//             <img className="wallet-images" onClick = {() => { handleImageFocus(selectedWallet.back) }} src={selectedWallet.back} />
//         </div>
//         </div>
//         <div className="add-to-cart">
//             <button id="add-to-cart-button" onClick={() =>  {handleAddToCartClick(selectedWallet);  alert(`${selectedWallet.name} add to the cart for you. You're welcome!`);} }>Add to cart!</button>
//         </div>
//         </>
//     )
// }

