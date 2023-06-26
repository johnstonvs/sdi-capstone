
//  _____ _____ _____ _____ __    _____ _____ _____
// |     |     |   | |     |  |  |     |_   _|  |  |
// | | | |  |  | | | |  |  |  |__|-   -| | | |     |
// |_|_|_|_____|_|___|_____|_____|_____| |_| |__|__|


import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoggedInContext, TagsContext } from '../../App';
import { WishlistPatch, WishlistItem, ConfirmationModal } from '../../components/index.js';

const Profile = () => {

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
    tags: []
  })
  const [newAttic, setNewAttic] = useState({
    phone: '',
    hours: '',
    about: '',
    email: ''
  })
  const [imageUrl, setImageUrl] = useState('')


  useEffect(() => {
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
      .then(data => setItemWishList(data.map(item => item.item_id)))

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
      })
      .catch(err => console.log(err))

    setEditing(false);
    setNewUser({
      name: '',
      base: ''
    });
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
    <div className='ProfilePageContainer mt-28 flex flex-row justify-center space-x-4 mb-20'>
      <ConfirmationModal message='You have successfully posted to your attic feed!' show={postModal} handleClose={() => setPostModal(false)} />
      <ConfirmationModal message='You have successfully added an item to your attic store!' show={stockModal} handleClose={() => setStockModal(false)} />
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
                      baseList.map((base, index) => {
                        return <option key={index}>{base.location}</option>
                      })
                    ) : null}
                  </select>
                  <div className='EditButtons flex flex-row content-center space-x-4'>
                    <button className='EditSubmit bg-[#2ACA90] text-white p-2 rounded mt-4 hover:bg-[#5DD3CB] ' onClick={() => setSubmitting(true)}>Submit</button>
                    <button className='EditDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff5c33]' onClick={handleDiscard}>Discard</button>
                  </div>
                </div> : /*On first submit, user is shown what they're about to change*/
                <div className='Submitting flex flex-col space-y-3'>
                  <h1 className='text-2xl text-[#ff3300] font-semibold mb-3 text-center'>Make the following changes?</h1>
                  {newUser.name ? <p>Name: <span className='text-[#45A29E] font-semibold'>{newUser.name}</span> </p> : null}
                  {newUser.base ? <p>Base: <span className='text-[#45A29E] font-semibold'>{newUser.base}</span> </p> : null}
                  {!newUser.name && !newUser.base ? <p className='text-[#45A29E] font-semibold'>No changes will be made.</p> : null}
                  <div className='EditButtons flex flex-row content-center space-x-4'>
                    <button className='EditSubmit bg-[#2ACA90] text-white p-2 rounded mt-4 hover:bg-[#5DD3CB] space-x-4' onClick={handleSubmit}>Submit</button>
                    <button className='EditDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff5c33]' onClick={handleDiscard}>Discard</button>
                  </div>
                </div>
                : /*If user is not editing, display user information*/
                <div className='AdminInfo flex flex-col space-y-3'>
                  <h1 className='Name text-3xl text-[#45A29E] font-semibold mb-5 text-center'>Admin Profile</h1>
                  <p><span className='font-semibold'>Name: </span>{userData.name}</p>
                  <p><span className='font-semibold'>Base: </span>{userData.base ? userData.base : 'No base selected'}</p>
                  <p><span className='font-semibold'>Email: </span>{userData.email}</p>
                  <div className='EditButtons flex flex-row justify-between'>
                    <button className='Edit hover:text-[#45A29E] text-center mt-4' onClick={() => setEditing(true)}>Edit Profile</button>
                    <button className='WishlistButton bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]' onClick={() => setShowWishlist(true)}>Wishlist</button>
                  </div>
                </div>
            }
          </div>
          {/*Admin tools to add items to their store, post to their feed, */}
          <div className='AdminTools bg-gray-300 flex flex-col justify-center p-4 rounded shadow-inner'>
            { // if admin is posting, show posting tool
              posting ?
                <div className='PostTool'> {/* posting tool */}
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
                  <form className='StockTool' onSubmit={handleStock}> {/* stocking tool */}
                    <h1 className='Name text-2xl text-[#45A29E] font-semibold mb-3 text-center'>Add an Item</h1>
                    <label className='NameLabel text-[#222222]'>Item Name</label>
                    <input name='name' className='EditHeader w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder='Steel Toe Watchcap...' type='text' required onChange={(e) => handleItemChange(e)} />
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
                    <div className='StockButtons flex flex-row content-center space-x-4'>
                      <button type='submit' className='PostSubmit bg-[#003b4d] text-white p-2 rounded mt-4 w-16 hover:bg-[#006280]'>Add</button>
                      <button className='PostDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff5c33]' onClick={handleStockDiscard}>Discard</button>
                    </div>
                  </form>
                  : showAttic ?
                    <div className='AtticInfo'> {/* Attic info and editor tool */}
                      {
                        editAttic ? !submittingAttic ?
                          <>
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
                              <label>Attic Image</label>
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
                          </> :
                          <>
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
                          </>
                          :
                          <div className='space-y-3'>
                            <h1 className='text-2xl text-[#45A29E] font-semibold mb-3 text-center'>Attic Info</h1>
                            <img className='w-48 h-48 m-auto rounded-lg object-cover' src={adminAttic.picture_url} alt={`${adminAttic.location}'s thumbnail`} />
                            <p><span className='font-semibold'>Base: </span>{adminAttic.location}</p>
                            <p><span className='font-semibold'>Address: </span>{adminAttic.address}</p>
                            <p><span className='font-semibold'>Hours: </span>{adminAttic.hours}</p>
                            <p><span className='font-semibold'>Phone: </span>{adminAttic.phone}</p>
                            <p><span className='font-semibold'>Email: </span>{adminAttic.email}</p>
                            <p><span className='font-semibold'>About: </span>{adminAttic.about}</p>
                            <div className='AtticInfoButtons flex flex-row content-center space-x-4'>
                              <button className='EditAttic bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]' onClick={() => setEditAttic(true)}>Edit Info</button>
                              <button className='PostDiscard bg-[#003b4d] text-white p-2 w-16 rounded mt-4 hover:bg-[#006280]' onClick={() => setShowAttic(false)}>Back</button>
                            </div>
                          </div>
                      }
                    </div>
                    :
                    <>
                      <h1 className='Name text-2xl text-[#45A29E] font-semibold mb-3 text-center'>Admin Tools</h1>
                      <div className='AdminButtons flex flex-row justify-center space-x-4'>
                        <button className='PostButton bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]' onClick={() => setPosting(true)}>Post to feed</button>
                        <button className='AddItemsButton bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]' onClick={() => setStocking(true)}>Add items</button>
                        <button className='AtticInfoButton bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]' onClick={() => setShowAttic(true)}>Attic Info</button>
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
                      baseList.map((base, index) => {
                        return <option key={index}>{base.location}</option>
                      })
                    ) : null}
                  </select>
                  <div className='EditButtons flex flex-row content-center'>
                    <button className='EditSubmit bg-[#2ACA90] text-white p-2 rounded mt-4 hover:bg-[#5DD3CB]' onClick={() => setSubmitting(true)}>Submit</button>
                    <button className='EditDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff5c33]' onClick={handleDiscard}>Discard</button>
                  </div>
                </div> : /*On first submit, user is shown what they're about to change*/
                <div className='Submitting flex flex-col space-y-3'>
                  <h1 className='SubmitMessage text-[#ff3300] font-semibold mb-3'>Are you sure you want to make these changes?</h1>
                  {newUser.name ? <p>Name: <span className='text-[#45A29E] font-semibold'>{newUser.name}</span> </p> : null}
                  {newUser.base ? <p>Base: <span className='text-[#45A29E] font-semibold'>{newUser.base}</span> </p> : null}
                  <div className='EditButtons flex flex-row content-center space-x-4'>
                    <button className='EditSubmit bg-[#2ACA90] text-white p-2 rounded mt-4 hover:bg-[#5DD3CB]' onClick={handleSubmit}>Submit</button>
                    <button className='EditDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff5c33]' onClick={handleDiscard}>Discard</button>
                  </div>
                </div>
                : /*If user is not editing, display user information*/
                <div className='ProfileInfo flex flex-col space-y-3'>
                  <h1 className='text-3xl text-[#45A29E] font-semibold mb-5 text-center'>Profile</h1>
                  <p><span className='font-semibold'>Name: </span>{userData.name}</p>
                  <p><span className='font-semibold'>Base: </span>{userData.base ? userData.base : 'No base selected'}</p>
                  <p><span className='font-semibold'>Email: </span>{userData.email}</p>
                  <div className='EditButtons flex flex-row justify-between'>
                    <button className='Edit hover:text-[#45A29E] text-center mt-4' onClick={() => setEditing(true)}>Edit Profile</button>
                    <button className='WishlistButton bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280]' onClick={() => setShowWishlist(true)}>Wishlist</button>
                  </div>
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
                <Link to={{ pathname: `/patches/patch/${patch.id}` }} className='Item' >
                  <WishlistPatch patch={patch} />
                </Link>
                <button className='text-[#ff4d4d] hover:text-[#ff9980] justify-self-center' onClick={() => removePatch(patch.id, userData.id)}>Remove</button>
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
                <button className='text-[#ff4d4d] hover:text-[#ff9980] justify-self-center' onClick={() => removeItem(item.id, userData.id)}>Remove</button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Profile;