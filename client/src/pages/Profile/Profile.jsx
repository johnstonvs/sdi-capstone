import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoggedInContext } from '../../App';
import { PatchCard, ItemCard } from '../../components/index.js';

const Profile = () => {

  const { loggedIn, setLoggedIn } = useContext(LoggedInContext);
  const [userData, setUserData] = useState({})
  const [itemList, setItemList] = useState([]);
  const [patchList, setPatchList] = useState([]);
  const [baseList, setBaseList] = useState([])
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    base: ''
  });
  let newPatches = [];
  var newItems = [];


  useEffect(() => {
    fetch('http://localhost:8080/items_wishlist')
      .then(res => res.json())
      .then(data => {
        // filter data with user id out and push fetched item to array
        data.filter(item => item.user_id === userData.id).forEach(item => {
          console.log(item)
          fetch(`http://localhost:8080/items/${item.item_id}`)
            .then(res => res.json())
            .then(thing => {
              setItemList([...itemList, thing[0]]);
              console.log('itemList: ', itemList);
            })
            .catch(err => console.log(err))
        })
      })
      .catch(err => console.log(err))

    // fetch attics for base information
    fetch('http://localhost:8080/attics')
      .then(res => res.json())
      .then(data => {
        setBaseList(data)
      })
      .catch(err => console.error(err))

    // fetch wishlist patches and items based on user id
    fetch('http://localhost:8080/patches_wishlist')
      .then(res => res.json())
      .then(data => {
        // filter data with user id out and push fetched patch to array
        data.filter(item => item.user_id === userData.id).forEach(item => {
          fetch(`http://localhost:8080/patches/${item.patch_id}`)
            .then(res => res.json())
            .then(patch => newPatches.push(patch[0]))
        })
      })
      .then(() => setPatchList(newPatches))
      .catch(err => console.log(err))
  }, []);

  useEffect(() => {
    console.log('triggered')
  }, [itemList])


  useEffect(() => {
    // fetch all user data based on loggedIn.id
    fetch(`http://localhost:8080/users/${loggedIn.id}`)
      .then(res => res.json())
      .then(data => setUserData(data[0]))
      .catch(err => console.log(err))

    // if new user data is submitted, fetch again
  }, [submitting])

  const handleSubmit = () => {

    fetch(`http://localhost:8080/users/${userData.id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        name: newUser.name ? newUser.name : userData.name,
        base: newUser.base ? newUser.base : userData.base
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (newUser.base) {
          setLoggedIn({
            ...loggedIn,
            BOP: newUser.base
          })
        }
        setSubmitting(false);
      })
      .catch(err => console.log(err))

    setEditing(false);
    setNewUser({
      name: '',
      base: ''
    });
  }

  const handleDiscard = () => {
    setEditing(false);
    setSubmitting(false);
    setNewUser({
      name: '',
      base: ''
    });
  }

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const removeItem = (thing_id, user_id) => {
    fetch('http://localhost:8080/items_wishlist', {
      method: 'DELETE',
      body: JSON.stringify({
        item_id: thing_id,
        user_id: user_id
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err))
  }

  //Need to add another Ternary to check if logged in user is accessing profile for their userid
  return (
    <div className='ProfilePageContainer flex flex-row'>
      {loggedIn.admin ?
        <div className='AdminProfile'>
          {/*Includes admin tools like adding items to attics*/}
        </div>
        :
        <div className='UserProfile w-2/5'>
          <div className='ProfileInformation bg-gray-300 flex flex-col justify-center p-4 rounded shadow-inner m-2'>
            {/*Checks to see if user is editing or submitting profile to display correct container*/
              editing ? !submitting ?
                <div className='EditProfile'>
                  <h1 className='Name text-3xl text-[#45A29E] font-semibold mb-10 text-center'>Edit Profile</h1>
                  <label className='NameLabel text-[#222222]'>Name</label>
                  <input name='name' className='EditName w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={newUser.name} placeholder={userData.name} type='text' required onChange={(e) => handleChange(e)} />
                  <label className='BaseLabel text-[#222222]'>Base</label>
                  <select name='base' className='EditBase w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={newUser.base} placeholder='Enter your base' type='text' onChange={(e) => handleChange(e)}>
                    <option>{userData.base}</option>
                    {baseList ? (
                      baseList.map((base) => {
                        return <option>{base.location}</option>
                      })
                    ) : null}
                  </select>
                  <div className='EditButtons flex flex-row content-center space-x-4'>
                    <button className='EditSubmit bg-[#2ACA90] text-white p-2 rounded mt-4 hover:bg-[#5DD3CB]' onClick={() => setSubmitting(true)}>Submit</button>
                    <button className='EditDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff9980]' onClick={handleDiscard}>Discard</button>
                  </div>
                </div> : /*On first submit, user is shown what they're about to change*/
                <div className='Submitting'>
                  <h1 className='SubmitMessage text-[#ff3300] font-semibold mb-3'>Are you sure you want to make these changes?</h1>
                  {newUser.name ? <p>Name: <span className='text-[#45A29E] font-semibold'>{newUser.name}</span> </p> : null}
                  {newUser.base ? <p>Base: <span className='text-[#45A29E] font-semibold'>{newUser.base}</span> </p> : null}
                  <div className='EditButtons flex flex-row content-center space-x-4'>
                    <button className='EditSubmit bg-[#2ACA90] text-white p-2 rounded mt-4 hover:bg-[#5DD3CB]' onClick={handleSubmit}>Submit</button>
                    <button className='EditDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff9980]' onClick={handleDiscard}>Discard</button>
                  </div>
                </div>
                : /*If user is not editing, display user information*/
                <div className='ProfileInfo'>
                  <h1 className='Name text-3xl text-[#45A29E] font-semibold mb-10 text-center'>{userData.name}</h1>
                  <p><span className='font-semibold'>Email: </span>{userData.email}</p>
                  <p><span className='font-semibold'>Base: </span>{userData.base ? userData.base : 'No base selected'}</p>
                  <button className='Edit hover:text-[#45A29E] text-center mt-4' onClick={() => setEditing(true)}>Edit Profile</button>
                </div>
            }
          </div>
        </div>
      }
      {/*All wishlist items*/}
      <div className='WishlistContainer flex'>
        <div className='PatchWishlist'>
          <h1 className="PatchWishlistHeader text-xl pr-3 pl-3 text-[#45A29E]">Patch Wishlist</h1>
          {/* Map through state to display the patch image, name, price and total at the bottom*/}
        </div>
        <div className='ItemsWishlist flex flex-col'>
          <h1 className="ItemWishlistHeader text-xl pr-3 pl-3 text-[#45A29E]">Item Wishlist</h1>
          {itemList ? itemList.map((item, index) => {
            return (
              <>
                <Link to={{ pathname: `/shop/item/${item.id}` }} key={index} className='Item' >
                  <ItemCard item={item} />
                </Link>
                <button onClick={() => removeItem(item.id, userData.id)}>Remove from Wishlist</button>
              </>
            )
          }) : <p>No items</p>}
        </div>
      </div>
    </div>
  )
}

export default Profile;