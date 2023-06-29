
//  _____ _____ _____ _____ __    _____ _____ _____
// |     |     |   | |     |  |  |     |_   _|  |  |
// | | | |  |  | | | |  |  |  |__|-   -| | | |     |
// |_|_|_|_____|_|___|_____|_____|_____| |_| |__|__|


import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoggedInContext, TagsContext, LoadingContext } from '../../App';
import { WishlistPatch, WishlistItem, ConfirmationModal, Loader } from '../../components/index.js';
import InfoSharpIcon from '@mui/icons-material/InfoSharp';
import AnnouncementSharpIcon from '@mui/icons-material/AnnouncementSharp';
import AddBoxSharpIcon from '@mui/icons-material/AddBoxSharp';
import CategorySharpIcon from '@mui/icons-material/CategorySharp';
import AddPhotoAlternateSharpIcon from '@mui/icons-material/AddPhotoAlternateSharp';

const Profile = () => {

  //The United States of Airman's Warehouse
  const { tags } = useContext(TagsContext);
  const { loggedIn, setLoggedIn } = useContext(LoggedInContext);
  const [userData, setUserData] = useState({});
  const [adminAttic, setAdminAttic] = useState({});
  const [itemWishList, setItemWishList] = useState([]);
  const [patchWishList, setPatchWishList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [patchList, setPatchList] = useState([]);
  const [baseList, setBaseList] = useState([])
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [posting, setPosting] = useState(false);
  const [stocking, setStocking] = useState(false);
  const [showAttic, setShowAttic] = useState(false);
  const [editAttic, setEditAttic] = useState(false);
  const [submittingAttic, setSubmittingAttic] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [postModal, setPostModal] = useState(false);
  const [stockModal, setStockModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    base: ''
  });
  const [newPost, setNewPost] = useState({
    header: '',
    body: ''
  })
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    can_ship: false,
    description: '',
    tags: []
  })
  const [newAttic, setNewAttic] = useState({
    phone: '',
    hours: '',
    about: '',
    email: ''
  })
  const [imageUrl, setImageUrl] = useState('')

  const { loading, setLoading } = useContext(LoadingContext);

  const navigate = useNavigate()


  useEffect(() => {
    setLoading(true)
    // set loggedIn admin status
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

    // fetch attics for base information
    fetch('http://localhost:8080/attics')
      .then(res => res.json())
      .then(data => {
        setBaseList(data);
        if (loggedIn.admin) {
          setAdminAttic(data.filter(attic => attic.location === loggedIn.BOP)[0]);
        }
      })
      .catch(err => console.error(err))

    // fetch patch wishlist with user_id
    fetch(`http://localhost:8080/patches_wishlist?user_id=${loggedIn.id}`)
      .then(res => res.json())
      .then(data => setPatchWishList(data.map(item => item.patch_id)))

    // fetch item wishlist with user_id
    fetch(`http://localhost:8080/items_wishlist?user_id=${loggedIn.id}`)
      .then(res => res.json())
      .then(data => {
        setItemWishList(data.map(item => item.item_id))
        setLoading(false)
      })

    // if user is admin, fetch data for that attic
    // TODO (maybe fixes refresh issue)

  }, []);

  // updates displayed attic info if info was patched
  useEffect(() => {
    fetch('http://localhost:8080/attics')
      .then(res => res.json())
      .then(data => {
        setAdminAttic(data.filter(attic => attic.location === loggedIn.BOP)[0])
      })
      .catch(err => console.error(err))
  }, [editAttic])

  useEffect(() => {
    setNewAttic({
      phone: adminAttic.phone,
      hours: adminAttic.hours,
      about: adminAttic.about,
      email: adminAttic.email
    })
  }, [adminAttic])

  useEffect(() => {

    // setPatchList(patchWishList)
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
        setUserData(data[0]);
      })
      .catch(err => console.log(err))

    // if new user data is submitted, fetch again
  }, [submitting])

  const handleSubmit = () => {

    if (imageUrl) {

      const formData = new FormData();
      formData.append('name', newUser.name ? newUser.name : userData.name);
      formData.append('base', newUser.base ? newUser.base : userData.base);
      formData.append('image', imageUrl);

      fetch(`http://localhost:8080/users/withimage/${userData.id}`, {
        method: 'PATCH',
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          if (newUser.base) {
            setLoggedIn({
              ...loggedIn,
              BOP: newUser.base
            })
          }
          if (newUser.name) {
            setLoggedIn({
              ...loggedIn,
              name: newUser.name
            })
          }
          setSubmitting(false);
          setEditing(false);
          setNewUser({
            name: '',
            base: ''
          });
          setImageUrl('');
        })
        .catch((err) => console.error(err));

    } else {

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
          if (newUser.base) {
            setLoggedIn({
              ...loggedIn,
              BOP: newUser.base
            })
          }
          setSubmitting(false);
          setEditing(false);
          setNewUser({
            name: '',
            base: ''
          });
        })
        .catch(err => console.log(err))
    }

  }

  const handlePost = () => {
    if (newPost.header && newPost.body) {
      fetch(`http://localhost:8080/posts`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: userData.id,
          attic_id: userData.attic_id,
          header: newPost.header,
          body: newPost.body
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
        .then(res => res.json())
        .then(data => {
          setPosting(false)
          setNewPost({
            header: '',
            body: ''
          });
          setPostModal(true);
        })
        .catch(err => console.log(err))
    }
  }

  const handleStock = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', newItem.name ? newItem.name : 'No Name');
    formData.append('description', newItem.description ? newItem.description : 'No Description');
    formData.append('price', newItem.price ? newItem.price : 0);
    formData.append('can_ship', newItem.can_ship);
    formData.append('tags', JSON.stringify(newItem.tags));
    formData.append('attic_id', userData.attic_id);
    if (imageUrl) {
      formData.append('image', imageUrl);
    }

    fetch('http://localhost:8080/items', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setStocking(false);
        setNewItem({
          name: '',
          price: '',
          can_ship: false,
          description: '',
          tags: []
        })
        setImageUrl('');
        setStockModal(true);
      })
      .catch((err) => console.error(err));

  }

  const handleAtticSubmit = () => {
    if (imageUrl) {
      const formData = new FormData();
      formData.append('phone', newAttic.phone ? newAttic.phone : adminAttic.phone)
      formData.append('hours', newAttic.hours ? newAttic.hours : adminAttic.hours)
      formData.append('about', newAttic.about ? newAttic.about : adminAttic.about)
      formData.append('email', newAttic.email ? newAttic.email : adminAttic.email)
      formData.append('image', imageUrl);


      fetch(`http://localhost:8080/attics/withimage/${adminAttic.id}`, {
        method: 'PATCH',
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          setEditAttic(false);
          setSubmittingAttic(false);
          setNewAttic({
            phone: adminAttic.phone,
            hours: adminAttic.hours,
            about: adminAttic.about,
            email: adminAttic.email
          })
          setImageUrl('');
        })
        .catch((err) => console.error(err));
    } else {
      fetch(`http://localhost:8080/attics/${adminAttic.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          phone: newAttic.phone ? newAttic.phone : adminAttic.phone,
          hours: newAttic.hours ? newAttic.hours : adminAttic.hours,
          about: newAttic.about ? newAttic.about : adminAttic.about,
          email: newAttic.email ? newAttic.email : adminAttic.email
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
        .then(res => res.json())
        .then(data => {
          setEditAttic(false);
          setSubmittingAttic(false);
          setNewAttic({
            phone: adminAttic.phone,
            hours: adminAttic.hours,
            about: adminAttic.about,
            email: adminAttic.email
          })
        })
        .catch((err) => console.error(err));
    }
  }

  const handleDiscard = () => {
    setEditing(false);
    setSubmitting(false);
    setNewUser({
      name: '',
      base: ''
    });
    setImageUrl('');
  }

  const handlePostDiscard = () => {
    setPosting(false);
    setNewPost({
      header: '',
      body: ''
    })
  }

  const handleStockDiscard = () => {
    setStocking(false);
    setNewItem({
      name: '',
      price: '',
      can_ship: false,
      description: '',
      tags: []
    })
    setImageUrl('');
  }

  const handleAtticDiscard = () => {
    setEditAttic(false);
    setSubmittingAttic(false);
    setNewAttic({
      phone: adminAttic.phone,
      hours: adminAttic.hours,
      about: adminAttic.about,
      email: adminAttic.email
    });
    setImageUrl('');
  }

  const handleChange = (e) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handlePostChange = (e) => {
    setNewPost({ ...newPost, [e.target.name]: e.target.value });
  }

  const handleItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  }

  const handleCheckedTag = (e) => {
    setNewItem({
      ...newItem,
      tags: newItem.tags.includes(e.target.name) ? newItem.tags.filter(item => item !== e.target.name) : newItem.tags.concat([e.target.name])
    })
  }

  const handleAtticChange = (e) => {
    setNewAttic({ ...newAttic, [e.target.name]: e.target.value });
  }

  const postModalClose = () => {
    setPostModal(false);
  }

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
      })
      .catch(err => console.log(err))
  }

  //Need to add another Ternary to check if logged in user is accessing profile for their userid
  return (
    loading ? (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    ) : (
      <div className='ProfilePageContainer mt-28 flex flex-row justify-center space-x-4 mb-20 w-full'>
        {!showWishlist ?
          <div className='w-screen'>
            <ConfirmationModal message='You have successfully posted to your attic feed!' show={postModal} handleClose={postModalClose} />
            <ConfirmationModal message='You have successfully added an item to your attic store!' show={stockModal} handleClose={() => setStockModal(false)} />
            {loggedIn.admin ?
              <div className='AdminProfile mr-20 ml-20 space-y-4 flex flex-col justify-center items-center'>
                <div className='AdminInformation bg-gray-300 flex flex-col justify-center pb-8 pt-4 pr-12 pl-12 rounded shadow-inner w-fit pb-10'>
                  {/*Checks to see if user is editing or submitting profile to display correct container*/
                    editing ? !submitting ?
                      <div className='EditProfile flex flex-col'>
                        <h1 className='Name text-3xl text-[#45A29E] font-semibold mb-10 text-center'>Edit Profile</h1>
                        <div className='w-1/2 max-w-lg self-center'>
                          <label className='NameLabel text-[#222222]'>Name</label>
                          <input name='name' className='EditName w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={newUser.name} placeholder={userData.name} type='text' required onChange={(e) => handleChange(e)} />
                          <label className='BaseLabel text-[#222222]'>Base</label>
                          <select name='base' className='EditBase w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={newUser.base} placeholder='Enter your base' type='text' onChange={(e) => handleChange(e)}>
                            <option>{userData.base}</option>
                            {baseList ? (
                              baseList.map((base, index) => {
                                return <option key={index}>{base.location}</option>
                              })
                            ) : null}
                          </select>
                          <div className='Image mt-3'>
                            <label className='mr-3'>Profile Picture</label>
                            <AddPhotoAlternateSharpIcon />
                            <input
                              className="w-full rounded mb-4"
                              type="file"
                              onChange={(e) => setImageUrl(e.target.files[0])}
                            />
                          </div>
                          <div className='EditButtons flex flex-row content-center space-x-4'>
                            <button className='EditSubmit bg-[#2ACA90] text-white p-2 rounded mt-4 hover:bg-[#5DD3CB] ' onClick={() => setSubmitting(true)}>Submit</button>
                            <button className='EditDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff5c33]' onClick={handleDiscard}>Discard</button>
                          </div>
                        </div>
                      </div> : /*On first submit, user is shown what they're about to change*/
                      <div className='Submitting flex flex-col space-y-3 place-self-center '>
                        <h1 className='text-2xl text-[#ff3300] font-semibold mb-3 text-center'>Make the following changes?</h1>
                        {newUser.name ? <p>Name: <span className='text-[#45A29E] font-semibold'>{newUser.name}</span> </p> : null}
                        {newUser.base ? <p>Base: <span className='text-[#45A29E] font-semibold'>{newUser.base}</span> </p> : null}
                        {imageUrl ? <p className='text-[#45A29E] font-semibold'>New Profile Image</p> : null}
                        {!newUser.name && !newUser.base && !imageUrl ? <p className='text-[#45A29E] font-semibold'>No changes will be made.</p> : null}
                        <div className='EditButtons flex flex-row content-center space-x-4'>
                          <button className='EditSubmit bg-[#2ACA90] text-white p-2 rounded mt-4 hover:bg-[#5DD3CB]' onClick={handleSubmit}>Submit</button>
                          <button className='EditDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff5c33]' onClick={handleDiscard}>Discard</button>
                        </div>
                      </div>
                      : /*If user is not editing, display user information*/
                      <>
                        <h1 className='Name text-3xl text-[#45A29E] font-semibold mb-5 text-center'>Admin Profile</h1>
                        <div className='AdminInfo flex flex-row space-x-12 justify-center'>
                          {userData.picture_url ? <div className='bg-gradient-to-r from-gray-500 to-gray-700 rounded flex flex-col place-content-center p-1 w-fit h-fit'><img src={userData.picture_url} alt={userData.name} className='w-52 h-52 rounded-lg object-cover' /></div> : <div className='bg-gradient-to-r from-gray-500 to-gray-700 w-64 h-64 rounded flex flex-col place-content-center'><p className='place-self-center text-white animate-pulse'>Edit profile to add a picture</p></div>}
                          <div className='flex flex-col'>
                            <div className='self-center space-y-3'>
                              <p><span className='font-semibold'>Name: </span>{userData.name}</p>
                              <p><span className='font-semibold'>Base: </span>{userData.base ? userData.base : 'No base selected'}</p>
                              <p><span className='font-semibold'>Email: </span>{userData.email}</p>
                            </div>
                            <div className='EditButtons space-x-10 mt-24'>
                              <button className='WishlistButton bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]' onClick={() => setShowWishlist(true)}>Wishlist</button>
                              <button className='Edit hover:text-[#45A29E] text-center mt-4' onClick={() => setEditing(true)}>Edit Profile</button>
                            </div>
                          </div>
                        </div>
                      </>
                  }
                </div>
                {/*Admin tools to add items to their store, post to their feed, */}
                <div className='AdminTools flex flex-col bg-gray-300 align-center p-4 rounded shadow-inner w-fit'>
                  { // if admin is posting, show posting tool
                    posting ?
                      <div className='PostTool flex flex-col place-self-center w-96'> {/* posting tool */}
                        <h1 className='Name text-2xl text-[#45A29E] font-semibold mb-3 text-center'>Make a Post</h1>
                        <label className='NameLabel text-[#222222]'>Header</label>
                        <input name='header' className='EditHeader w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder='Something eye catching...' type='text' required onChange={(e) => handlePostChange(e)} />
                        <label className='NameLabel text-[#222222]'>Body</label>
                        <textarea name='body' className='EditBody w-full p-2 mt-1 mb-10 h-32 bg-white rounded-md shadow' placeholder='This will go on your attic feed, state your business...' type='text' required onChange={(e) => handlePostChange(e)} />
                        <div className='EditButtons flex flex-row content-center space-x-4'>
                          <button className='PostSubmit bg-[#003b4d] text-white p-2 rounded mt-4 w-16 hover:bg-[#006280]' onClick={handlePost}>Post</button>
                          <button className='PostDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff5c33]' onClick={handlePostDiscard}>Discard</button>
                        </div>
                      </div>
                      :
                      stocking ?
                        <form className='StockTool w-96 place-self-center' onSubmit={handleStock}> {/* stocking tool */}
                          <h1 className='Name text-2xl text-[#45A29E] font-semibold mb-3 text-center'>Add an Item</h1>
                          <label className='NameLabel text-[#222222]'>Item Name</label>
                          <input name='name' className='EditHeader w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder='Steel Toe Watchcap...' type='text' required onChange={(e) => handleItemChange(e)} />
                          <label className='NameLabel text-[#222222]'>Description</label>
                          <textarea name='description' className='EditHeader w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder='Describe your item...' type='text' required onChange={(e) => handleItemChange(e)} />
                          <div className='PriceAndShip flex'>
                            <div className='PriceContainer flex flex-col pr-12'>
                              <label className='Price text-[#222222]'>Price</label>
                              <div>$ <input name='price' className='EditPrice w-24 p-2 mb-4 bg-white rounded-md shadow mt-1' type='number' step='0.01' min='0.00' required onChange={(e) => handleItemChange(e)} /></div>
                            </div>
                            <div>
                              <label className='ShippableLabel text-[#222222]'>Shippable</label>
                              <div><input name='can_ship' type='radio' value={true} onClick={(e) => handleItemChange(e)} /> Yes</div>
                              <div><input name='can_ship' type='radio' value={false} onClick={(e) => handleItemChange(e)} /> No</div>
                            </div>
                          </div>
                          <div className='Tags'>
                            <label className='TagsLabel'>Tags</label>
                            <div className='TagContainer flex flex-row flex-wrap'>
                              {tags.map((tag, index) => {
                                return <label key={index} className='pr-4'><input type='checkbox' name={tag} onChange={(e) => handleCheckedTag(e)} /> {tag}</label>
                              })}
                            </div>
                          </div>
                          <div className='Image mt-3'>
                            <label>Upload Image</label>
                            <input
                              className="w-full rounded mb-4"
                              type="file"
                              onChange={(e) => setImageUrl(e.target.files[0])}
                            />
                          </div>
                          <div className='StockButtons flex flex-row content-center space-x-4 justify-center'>
                            <button type='submit' className='PostSubmit bg-[#003b4d] text-white p-2 rounded mt-4 w-16 hover:bg-[#006280]'>Add</button>
                            <button className='PostDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff5c33]' onClick={handleStockDiscard}>Discard</button>
                          </div>
                        </form>
                        : showAttic ?
                          <div className='AtticInfo flex flex-col'> {/* Attic info and editor tool */}
                            {
                              editAttic ? !submittingAttic ?
                                <div className='w-1/2 place-self-center max-w-lg'> {/* Attic editor */}
                                  <h1 className='text-2xl text-[#45A29E] font-semibold mb-3 text-center'>Edit Attic Info</h1>
                                  <label className='NameLabel text-[#222222]'>Phone</label>
                                  <input name='phone' className='EditPhone w-full p-2 mb-4 bg-white rounded-md shadow' value={newAttic.phone} type='text' required onChange={(e) => handleAtticChange(e)} />
                                  <label className='NameLabel text-[#222222]'>Email</label>
                                  <input name='email' className='EditEmail w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={newAttic.email} type='text' required onChange={(e) => handleAtticChange(e)} />
                                  <label className='NameLabel text-[#222222]'>Hours</label>
                                  <input name='hours' className='EditHours w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={newAttic.hours} type='text' required onChange={(e) => handleAtticChange(e)} />
                                  <label className='NameLabel text-[#222222]'>About</label>
                                  <textarea name='about' className='EditAbout w-full p-2 mt-1 mb-10 h-32 bg-white rounded-md shadow' value={newAttic.about} required onChange={(e) => handleAtticChange(e)} />
                                  <div className='Image mt-3'>
                                    <label className='mr-3'>Attic Image</label>
                                    <AddPhotoAlternateSharpIcon />
                                    <input
                                      className="w-full rounded mb-4"
                                      type="file"
                                      onChange={(e) => setImageUrl(e.target.files[0])}
                                    />
                                  </div>
                                  <div className='AtticEditButtons flex flex-row content-center space-x-4'>
                                    <button className='EditAttic bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]' onClick={() => setSubmittingAttic(true)}>Submit</button>
                                    <button className='PostDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff5c33]' onClick={handleAtticDiscard}>Discard</button>
                                  </div>
                                </div> :
                                <div className='w-1/2 place-self-center max-w-lg'> {/* Confirm edit changes */}
                                  <h1 className='text-2xl text-[#ff3300] font-semibold mb-3 text-center'>Make the following changes?</h1>
                                  {newAttic.phone !== adminAttic.phone ? <p>Phone: <span className='text-[#003b4d] font-semibold'>{newAttic.phone}</span> </p> : null}
                                  {newAttic.email !== adminAttic.email ? <p>Email: <span className='text-[#003b4d] font-semibold'>{newAttic.email}</span> </p> : null}
                                  {newAttic.hours !== adminAttic.hours ? <p>Hours: <span className='text-[#003b4d] font-semibold'>{newAttic.hours}</span> </p> : null}
                                  {newAttic.about !== adminAttic.about ? <p>About: <span className='text-[#003b4d] font-semibold'>{newAttic.about}</span> </p> : null}
                                  {imageUrl ? <p><span className='text-[#003b4d] font-semibold'>New Attic Image</span> </p> : null}
                                  <div className='AtticEditButtons flex flex-row content-center space-x-4'>
                                    <button className='EditAttic bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]' onClick={handleAtticSubmit}>Submit</button>
                                    <button className='PostDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff5c33]' onClick={handleAtticDiscard}>Discard</button>
                                  </div>
                                </div>
                                :
                                <div className='space-y-3 flex flex-col'> {/* Attic info display */}
                                  <h1 className='text-2xl text-[#45A29E] font-semibold mb-3 text-center'>Attic Info</h1>
                                  <div className='flex flex-row justify-center space-x-12'>
                                    <img className='w-64 h-64 rounded-lg object-cover' src={adminAttic.picture_url} alt={`${adminAttic.location}'s thumbnail`} />
                                    <div className='flex flex-col place-self-center space-y-3'>
                                      <p><span className='font-semibold'>Base: </span>{adminAttic.location}</p>
                                      <p><span className='font-semibold'>Address: </span>{adminAttic.address}</p>
                                      <p><span className='font-semibold'>Hours: </span>{adminAttic.hours}</p>
                                      <p><span className='font-semibold'>Phone: </span>{adminAttic.phone}</p>
                                      <p><span className='font-semibold'>Email: </span>{adminAttic.email}</p>
                                      <p><span className='font-semibold'>About: </span>{adminAttic.about}</p>
                                    </div>
                                  </div>
                                  <div className='AtticInfoButtons flex flex-row content-center space-x-12 place-self-center'>
                                    <button className='EditAttic bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]' onClick={() => setEditAttic(true)}>Edit Info</button>
                                    <button className='PostDiscard bg-[#003b4d] text-white p-2 w-16 rounded mt-4 hover:bg-[#006280]' onClick={() => setShowAttic(false)}>Back</button>
                                  </div>
                                </div>
                            }
                          </div>
                          :
                          <div> {/* Admin tool buttons */}
                            <h1 className='Name text-2xl text-[#45A29E] font-semibold mb-3 text-center'>Admin Tools</h1>
                            <div className='AdminButtons flex flex-row justify-center space-x-4'>
                              <button className='AtticInfoButton bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]' onClick={() => setShowAttic(true)}><InfoSharpIcon /> <div>Attic Info</div></button>
                              <button className='PostButton bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]' onClick={() => setPosting(true)}><AnnouncementSharpIcon /> <div>Post to Feed</div></button>
                              <button className='AddItemsButton bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]' onClick={() => setStocking(true)}><AddBoxSharpIcon /> <div>Add Items</div></button>
                              <button className='AddItemsButton bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]' onClick={() => navigate(`/profile/${loggedIn.id}/adminitems`)}><CategorySharpIcon /><div>Stocked Items</div></button>
                            </div>
                          </div>
                  }
                </div>
              </div>
              :
              <div className='UserProfile flex flex-col w-screen mt-7 place-self-center'>
                <div className='ProfileInformation bg-gray-300 flex flex-col justify-center pb-8 pt-4 pr-12 pl-12 rounded shadow-inner w-fit pb-10 place-self-center'>
                  {/*Checks to see if user is editing or submitting profile to display correct container*/
                    editing ? !submitting ?
                      <div className='EditProfile flex flex-col'>
                        <h1 className='Name text-3xl text-[#45A29E] font-semibold mb-10 text-center'>Edit Profile</h1>
                        <div className='w-1/2 self-center'>
                          <label className='NameLabel text-[#222222]'>Name</label>
                          <input name='name' className='EditName w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={newUser.name} placeholder={userData.name} type='text' required onChange={(e) => handleChange(e)} />
                          <label className='BaseLabel text-[#222222]'>Base</label>
                          <select name='base' className='EditBase w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={newUser.base} placeholder='Enter your base' type='text' onChange={(e) => handleChange(e)}>
                            <option>{userData.base}</option>
                            {baseList ? (
                              baseList.map((base, index) => {
                                return <option key={index}>{base.location}</option>
                              })
                            ) : null}
                          </select>
                          <div className='Image mt-3'>
                            <label>Profile Picture</label>
                            <AddPhotoAlternateSharpIcon />
                            <input
                              className="w-full rounded mb-4"
                              type="file"
                              onChange={(e) => setImageUrl(e.target.files[0])}
                            />
                          </div>
                          <div className='EditButtons flex flex-row content-center space-x-4'>
                            <button className='EditSubmit bg-[#2ACA90] text-white p-2 rounded mt-4 hover:bg-[#5DD3CB] ' onClick={() => setSubmitting(true)}>Submit</button>
                            <button className='EditDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff5c33]' onClick={handleDiscard}>Discard</button>
                          </div>
                        </div>
                      </div> : /*On first submit, user is shown what they're about to change*/
                      <div className='Submitting flex flex-col space-y-3 place-self-center '>
                        <h1 className='text-2xl text-[#ff3300] font-semibold mb-3 text-center'>Make the following changes?</h1>
                        {newUser.name ? <p>Name: <span className='text-[#45A29E] font-semibold'>{newUser.name}</span> </p> : null}
                        {newUser.base ? <p>Base: <span className='text-[#45A29E] font-semibold'>{newUser.base}</span> </p> : null}
                        {imageUrl ? <p className='text-[#45A29E] font-semibold'>New Profile Image</p> : null}
                        {!newUser.name && !newUser.base && !imageUrl ? <p className='text-[#45A29E] font-semibold'>No changes will be made.</p> : null}
                        <div className='EditButtons flex flex-row content-center space-x-4'>
                          <button className='EditSubmit bg-[#2ACA90] text-white p-2 rounded mt-4 hover:bg-[#5DD3CB]' onClick={handleSubmit}>Submit</button>
                          <button className='EditDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff5c33]' onClick={handleDiscard}>Discard</button>
                        </div>
                      </div>
                      : /*If user is not editing, display user information*/
                      <div className='align-center place-self-center'>
                        <h1 className='Name text-3xl text-[#45A29E] font-semibold mb-5 text-center place-self-center w-1/2'>Profile</h1>
                        <div className='AdminInfo flex flex-row space-x-12 justify-center'>
                          {userData.picture_url ? <div className='bg-gradient-to-r from-gray-500 to-gray-700 rounded flex flex-col place-content-center p-1 w-fit h-fit'><img src={userData.picture_url} alt={userData.name} className='w-52 h-52 rounded-lg object-cover' /></div> : <div className='bg-gradient-to-r from-gray-500 to-gray-700 w-64 h-64 rounded flex flex-col place-content-center'><p className='place-self-center text-white animate-pulse'>Edit profile to add a picture</p></div>}
                          <div className='flex flex-col'>
                            <div className='self-center space-y-3'>
                              <p><span className='font-semibold'>Name: </span>{userData.name}</p>
                              <p><span className='font-semibold'>Base: </span>{userData.base ? userData.base : 'No base selected'}</p>
                              <p><span className='font-semibold'>Email: </span>{userData.email}</p>
                            </div>
                            <div className='EditButtons space-x-10 mt-24'>
                              <button className='WishlistButton bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]' onClick={() => setShowWishlist(true)}>Wishlist</button>
                              <button className='Edit hover:text-[#45A29E] text-center mt-4' onClick={() => setEditing(true)}>Edit Profile</button>
                            </div>
                          </div>
                        </div>
                      </div>
                  }
                </div>
              </div>
            }
          </div>
          :
          /*All wishlist items  */
          <div className='WishlistContainer flex flex-col space-x-4'>
            <div className='flex flex-col space-x-4 w-screen'>
              <div className='PatchWishlist flex flex-col'>
                <h1 className="PatchWishlistHeader font-semibold text-xl pr-3 pl-3 text-[#45A29E] place-self-center">Patch Wishlist</h1>
                <div className='flex flex-row space-x-3 rounded p-3 bg-gradient-to-r from-gray-700 to-[#003b4d] h-fit w-fit h-96 place-self-center justify-center shadow-2xl'>
                  {patchList.length === 0 ? <p className='w-36 text-center text-[#9bb4bf] animate-pulse'>You wish for no patches</p> : null}
                  {patchList.map((patch, index) => {
                    return (
                      <div className='WishlistPatch w-48 mb-4 flex flex-col' key={index}>
                        <Link to={{ pathname: `/patches/patch/${patch.id}` }} className='Item' >
                          <WishlistPatch patch={patch} />
                        </Link>
                        <button className='text-[#ff4d4d] hover:text-[#ff9980] justify-self-center' onClick={() => removePatch(patch.id, userData.id)}>Remove</button>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className='ItemsWishlist flex flex-col'>
                <h1 className="ItemWishlistHeader font-semibold text-xl pr-3 pl-3 text-[#45A29E] place-self-center">Item Wishlist</h1>
                <div className='flex flex-row space-x-3 bg-gradient-to-r from-[#003b4d] to-gray-700 rounded p-3 h-fit w-fit place-self-center justify-center shadow-2xl'>
                  {itemList.length === 0 ? <p className='w-36 text-center text-[#9bb4bf] animate-pulse'>You wish for no items</p> : null}
                  {itemList.map((item, index) => {
                    return (
                      <div className='WishlistItem w-48 mb-4 flex flex-col'>
                        <Link to={{ pathname: `/shop/item/${item.id}` }} key={index} className='Item' >
                          <WishlistItem item={item} />
                        </Link>
                        <button className='text-[#ff4d4d] hover:text-[#ff9980] justify-self-center' onClick={() => removeItem(item.id, userData.id)}>Remove</button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
            <button className='WishlistButton bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280] h-10 w-64 place-self-center' onClick={() => setShowWishlist(false)}>Back to Profile</button>
          </div>}
      </div>
    )

  )
}

export default Profile;