import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoggedInContext } from '../../App';
import { WishlistPatch, WishlistItem } from '../../components/index.js';

const Profile = () => {

  const { loggedIn, setLoggedIn } = useContext(LoggedInContext);
  const [userData, setUserData] = useState({});
  const [itemWishList, setItemWishList] = useState([]);
  const [patchWishList, setPatchWishList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [patchList, setPatchList] = useState([]);
  const [baseList, setBaseList] = useState([])
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [posting, setPosting] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    base: ''
  });


  useEffect(() => {
    // fetch attics for base information
    fetch('http://localhost:8080/attics')
      .then(res => res.json())
      .then(data => {
        setBaseList(data);
      })
      .catch(err => console.error(err))

    // fetch patch wishlist with user_id
    fetch(`http://localhost:8080/patches_wishlist?user_id=${loggedIn.id}`)
      .then(res => res.json())
      .then(data => setPatchWishList(data.map(item => item.patch_id)))

    // fetch item wishlist with user_id
    fetch(`http://localhost:8080/items_wishlist?user_id=${loggedIn.id}`)
      .then(res => res.json())
      .then(data => setItemWishList(data.map(item => item.item_id)))

  }, []);

  useEffect(() => {

    setPatchList(patchWishList)
    // fetch all patches
    fetch('http://localhost:8080/patches')
      .then(res => res.json())
      .then(data => setPatchList(data.filter(item => patchWishList.includes(item.id))))

    // fetch all items
    fetch('http://localhost:8080/items')
      .then(res => res.json())
      .then(data => setItemList(data.filter(item => itemWishList.includes(item.id))))

  }, [itemWishList, patchWishList])


  useEffect(() => {
    // fetch all user data based on loggedIn.id
    fetch(`http://localhost:8080/users/${loggedIn.id}`)
      .then(res => res.json())
      .then(data => {
        setLoggedIn({
          ...loggedIn,
          admin: data[0].attic_admin
        })
        setUserData(data[0]);
      })
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

  const handlePostDiscard = () => {
    setPosting(false);
  }

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const removeItem = (thing_id, user_id) => {

    setItemList(itemList.filter(item => item.id !== thing_id))
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
      .then(data => {
        console.log(data)
      })
      .catch(err => console.log(err))
  }

  const removePatch = (thing_id, user_id) => {

    setPatchList(patchList.filter(item => item.id !== thing_id))
    fetch('http://localhost:8080/patches_wishlist', {
      method: 'DELETE',
      body: JSON.stringify({
        patch_id: thing_id,
        user_id: user_id
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8'
      }
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
      })
      .catch(err => console.log(err))
  }

  //Need to add another Ternary to check if logged in user is accessing profile for their userid
  return (
    <div className='ProfilePageContainer flex flex-row justify-center space-x-4'>
      {loggedIn.admin ?
        <div className='AdminProfile w-2/5 max-w-lg mt-7 space-y-4'>
          <div className='AdminInformation bg-gray-300 flex flex-col justify-center p-4 rounded shadow-inner'>
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
                  <div className='EditButtons flex flex-row content-center'>
                    <button className='EditSubmit bg-[#2ACA90] text-white p-2 rounded mt-4 hover:bg-[#5DD3CB]' onClick={() => setSubmitting(true)}>Submit</button>
                    <button className='EditDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff9980]' onClick={handleDiscard}>Discard</button>
                  </div>
                </div> : /*On first submit, user is shown what they're about to change*/
                <div className='Submitting flex flex-col space-y-3'>
                  <h1 className='SubmitMessage text-[#ff3300] font-semibold mb-3'>Are you sure you want to make these changes?</h1>
                  {newUser.name ? <p>Name: <span className='text-[#45A29E] font-semibold'>{newUser.name}</span> </p> : null}
                  {newUser.base ? <p>Base: <span className='text-[#45A29E] font-semibold'>{newUser.base}</span> </p> : null}
                  <div className='EditButtons flex flex-row content-center space-x-4'>
                    <button className='EditSubmit bg-[#2ACA90] text-white p-2 rounded mt-4 hover:bg-[#5DD3CB]' onClick={handleSubmit}>Submit</button>
                    <button className='EditDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff9980]' onClick={handleDiscard}>Discard</button>
                  </div>
                </div>
                : /*If user is not editing, display user information*/
                <div className='AdminInfo flex flex-col space-y-3'>
                  <h1 className='Name text-3xl text-[#45A29E] font-semibold mb-5 text-center'>Admin Profile</h1>
                  <p><span className='font-semibold'>Name: </span>{userData.name}</p>
                  <p><span className='font-semibold'>Base: </span>{userData.base ? userData.base : 'No base selected'}</p>
                  <p><span className='font-semibold'>Email: </span>{userData.email}</p>
                  <button className='Edit hover:text-[#45A29E] text-center mt-4' onClick={() => setEditing(true)}>Edit Profile</button>
                </div>
            }
          </div>
          {/*Admin tools to add items to their store, post to their feed, */}
          <div className='AdminTools bg-gray-300 flex flex-col justify-center p-4 rounded shadow-inner'>
            { // if admin is posting, show posting tool
              posting ?
                <div className='PostingTool'> {/* posting tool */}
                  <h1 className='Name text-2xl text-[#45A29E] font-semibold mb-3 text-center'>Make a Post</h1>
                  <button className='PostDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff9980]' onClick={handlePostDiscard}>Discard</button>
                </div> :
                <>
                  <h1 className='Name text-2xl text-[#45A29E] font-semibold mb-3 text-center'>Admin Tools</h1>
                  <div className='AdminButtons flex flex-row justify-center space-x-4'>
                    <button className='PostButton bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]' onClick={() => setPosting(true)}>Post to feed</button>
                    <button className='AddItemsButton bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]'>Add items</button>
                  </div>
                </>
            }
          </div>
        </div>
        :
        <div className='UserProfile w-2/5 max-w-lg mt-7'>
          <div className='ProfileInformation bg-gray-300 flex flex-col justify-center p-4 rounded shadow-inner'>
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
                  <div className='EditButtons flex flex-row content-center'>
                    <button className='EditSubmit bg-[#2ACA90] text-white p-2 rounded mt-4 hover:bg-[#5DD3CB]' onClick={() => setSubmitting(true)}>Submit</button>
                    <button className='EditDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff9980]' onClick={handleDiscard}>Discard</button>
                  </div>
                </div> : /*On first submit, user is shown what they're about to change*/
                <div className='Submitting flex flex-col space-y-3'>
                  <h1 className='SubmitMessage text-[#ff3300] font-semibold mb-3'>Are you sure you want to make these changes?</h1>
                  {newUser.name ? <p>Name: <span className='text-[#45A29E] font-semibold'>{newUser.name}</span> </p> : null}
                  {newUser.base ? <p>Base: <span className='text-[#45A29E] font-semibold'>{newUser.base}</span> </p> : null}
                  <div className='EditButtons flex flex-row content-center space-x-4'>
                    <button className='EditSubmit bg-[#2ACA90] text-white p-2 rounded mt-4 hover:bg-[#5DD3CB]' onClick={handleSubmit}>Submit</button>
                    <button className='EditDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff9980]' onClick={handleDiscard}>Discard</button>
                  </div>
                </div>
                : /*If user is not editing, display user information*/
                <div className='ProfileInfo flex flex-col space-y-3'>
                  <h1 className='Name text-3xl text-[#45A29E] font-semibold mb-5 text-center'>Profile</h1>
                  <p><span className='font-semibold'>Name: </span>{userData.name}</p>
                  <p><span className='font-semibold'>Base: </span>{userData.base ? userData.base : 'No base selected'}</p>
                  <p><span className='font-semibold'>Email: </span>{userData.email}</p>
                  <button className='Edit hover:text-[#45A29E] text-center mt-4' onClick={() => setEditing(true)}>Edit Profile</button>
                </div>
            }
          </div>
        </div>
      }
      {/*All wishlist items*/}
      <div className='WishlistContainer flex space-x-4'>
        <div className='PatchWishlist'>
          <h1 className="PatchWishlistHeader font-semibold text-xl pr-3 pl-3 text-[#45A29E]">Patch Wishlist</h1>
          {patchList.length === 0 ? <p className='w-36 text-center text-[#9bb4bf]'>You wish for no patches</p> : null}
          {patchList.map((patch, index) => {
            return (
              <div className='WishlistPatch w-48 mb-4 flex flex-col' key={index}>
                <Link to={{ pathname: `/shop/patch/${patch.id}` }} className='Item' >
                  <WishlistPatch patch={patch} />
                </Link>
                <button className='text-[#ff4d4d] justify-self-center' onClick={() => removePatch(patch.id, userData.id)}>Remove</button>
              </div>
            )
          })}
        </div>
        <div className='ItemsWishlist flex flex-col'>
          <h1 className="ItemWishlistHeader font-semibold text-xl pr-3 pl-3 text-[#45A29E]">Item Wishlist</h1>
          {itemList.length === 0 ? <p className='w-36 text-center text-[#9bb4bf]'>You wish for no items</p> : null}
          {itemList.map((item, index) => {
            return (
              <div className='WishlistItem w-48 mb-4 flex flex-col'>
                <Link to={{ pathname: `/shop/item/${item.id}` }} key={index} className='Item' >
                  <WishlistItem item={item} />
                </Link>
                <button className='text-[#ff4d4d] justify-self-center' onClick={() => removeItem(item.id, userData.id)}>Remove</button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Profile;