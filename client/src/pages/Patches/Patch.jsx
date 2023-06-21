import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { LoggedInContext } from "../../App.js";

const Patch = () => {
    const [patch, setPatch] = useState([]);
    const [userName, setUserName] = useState('');
    const { loggedIn } = useContext(LoggedInContext);
    const location = useLocation();
    let split = location.pathname.split('/');
    const id = split[3];
    var cart = [];


    useEffect(() => {
        fetch(`http://localhost:8080/patches/${id}`)
        .then(res => res.json())
        .then(data => setPatch(data[0]))
        .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        fetch(`http://localhost:8080/users/${patch.user_id}`)
            .then(res => res.json())
            .then(data => setUserName(data[0].name))
            .catch(err => console.error(err))
    },[patch])

    const addCartItem = () => {
        if(localStorage.getItem('patchCart')) {
            cart = JSON.parse(localStorage.getItem('patchCart'));
            console.log(cart);
        }
        cart.push(patch.id);
        localStorage.setItem('patchCart', JSON.stringify(cart));

        //Test the items being added to localStorage with these
        //var retrievedObject = localStorage.getItem('patchCart');
        //console.log('retrievedObject: ', retrievedObject);
    }

    const addToWishlist = () => {
      fetch(`http://localhost:8080/patches_wishlist`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: loggedIn.id,
          patch_id: patch.id
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
        {loggedIn.isLoggedIn ?
        <div className='PatchContainer flex flex-col p-8 gap-4 bg-gray-300 rounded-md shadow-inner m-8'>
            <h1 className='PatchTitle text-[#45A29E] text-4xl mb-4'>{patch.name}</h1>
            <img className='PatchImage w-96 object-contain' src={patch.picture_url} alt={patch.name} />
            <h3 className='PatchPoster text-[#[#222222]] text-2xl mb-2'>Posted By: {userName}</h3>
            <h3 className='PatchPrice text-[#[#222222]] text-2xl mb-4'>${patch.price}</h3>
            <div className='PatchButtons flex justify-between w-full'>
                <button className='AddToCartButton bg-[#2ACA90] text-white p-2 rounded-md hover:bg-[#5DD3CB] hover:scale-105' onClick={() => {addCartItem()}} >Add to Cart</button>
                <button className='AddToWishlistButton bg-[#2ACA90] text-white p-2 rounded-md hover:bg-[#5DD3CB] hover:scale-105' onClick={() => addToWishlist()}>Add to Wishlist</button>
            </div>
        </ div>
        :
        <div className='LogInToPurchase flex flex-col items-center p-8 bg-gray-300 rounded-md shadow-inner m-8'>
            <h1 className='LoginNotification text-[#45A29E] text-2xl mb-4'>You must be logged in to Purchase Patches!</h1>
            <Link to='/login' className='LoginLink bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] hover:scale-105 text-[#45A29E] text-1xl'>Login Here!</Link>
        </div>
        }
    </>
  )
}

export default Patch;