import { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LoggedInContext } from "../../App.js";

const Item = (props) => {
  const [item, setItem] = useState([]);
  const [attics, setAttics] = useState([]);
  const { loggedIn } = useContext(LoggedInContext);
  const location = useLocation();
  let split = location.pathname.split('/');
  const id = split[3];
  var cart = [];
  const nav = useNavigate()

  useEffect((props) => {
    fetch(`http://localhost:8080/items/${id}`)
      .then(res => res.json())
      .then(data => {
        let newData = addLocation(data);
        setItem(newData[0]);
      })
      .catch(err => console.error(err))
  }, [])

  useEffect(() => {
    fetch('http://localhost:8080/attics')
      .then(res => res.json())
      .then(data => setAttics(data))
      .catch(err => console.error(err))
  }, [item])

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
      .then(data => console.log(data))
      .catch(err => console.log(err))
  }

  return (
    <>
      <div className='ItemContainer place-content-center bg-gray-300 mt-28 p-4 rounded shadow-inner m-8'>
        <h1 className='ItemTitle text-[#45A29E] text-5xl'>{item.name}</ h1>
        <img className='ItemImage' src={item.picture_url} alt={item.name} />
        <h3 className='ItemPrice text-2xl text-[#45A29E]'>${item.price}</ h3>
        <h3 className='ItemLocation text-2xl text-[#45A29E]'>Location: {item.location}</ h3>
        {item.can_ship ?
          <>
            <h3 className='ItemShip text-2xl text-[#45A29E]'>'Item can be shipped to your local Attic.'</h3>
            <div className='ItemButtons flex justify-between w-full'>
              <button className='AddToCart bg-[#2ACA90] text-white p-2 rounded-md hover:bg-[#5DD3CB] hover:scale-105' onClick={() => { addCartItem() }} >Add to cart</ button>
              <button className='AddToWishlistButton bg-[#2ACA90] text-white p-2 rounded-md hover:bg-[#5DD3CB] hover:scale-105' onClick={() => addToWishlist()}>Add to Wishlist</button>
              <button className='BackButton text-white p-2 rounded-md bg-[#FF3300] hover:bg-[#FF9980] hover:scale-105' onClick={() => nav('/shop')}>Back</button>
            </div>
          </>
          :
          <div className='NoShip flex justify-between w-full'>
            <h3 className='ItemShip text-2xl text-[#45A29E]'>'Item cannot be shipped to your local Attic.'</ h3>
            <button className='AddToWishlistButton bg-[#2ACA90] text-white p-2 rounded-md hover:bg-[#5DD3CB] hover:scale-105' onClick={() => addToWishlist()}>Add to Wishlist</button>
            <button className='BackButton text-white p-2 rounded-md bg-[#FF3300] hover:bg-[#FF9980] hover:scale-105' onClick={() => nav('/shop')}>Back</button>
          </div>
        }
      </ div>
    </>
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

