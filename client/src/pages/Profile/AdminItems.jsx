import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoggedInContext } from '../../App';
import { EditItem, ItemCard } from '../../components/index.js';

const AdminItems = () => {

  const { loggedIn } = useContext(LoggedInContext);
  const [itemList, setItemList] = useState([]);
  const [editing, setEditing] = useState(false);
  const [userData, setUserData] = useState({});
  const [newItem, setNewItem] = useState({});

  const navigate = useNavigate()

  useEffect(() => {
    // fetch user data
    fetch(`http://localhost:8080/users/${loggedIn.id}`)
      .then(res => res.json())
      .then(data => setUserData(data[0]))
      .catch(err => console.log(err))

  }, [])

  useEffect(() => {
    // fetch items
    fetch(`http://localhost:8080/items?attic_id=${userData.attic_id}`)
      .then(res => res.json())
      .then(data => setItemList(data))
      .catch(err => console.log(err))

  }, [userData])

  const goToEdit = (item) => {
    setNewItem(item);
    setEditing(true);
  }

  const handleDiscard = () => {
    setNewItem({});
    setEditing(false);
  }

  return (
    <div className='flex flex-col w-screen'>{editing ?
        <EditItem item={newItem} discard={handleDiscard} />
        :
        <div className='AdminItemsContainer flex flex-col mt-20 content-center'>
          <h1 className='text-2xl text-[#45A29E] font-semibold text-center'>Attic Items</h1>
          <h3 className='text-lg text-[#45A29E] mb-3 text-center'>click on an item to edit it</h3>
          <div className='flex flex-wrap space-x-4 space-y-4 bg-gradient-to-r from-[#003b4d] to-gray-700 rounded p-3 mr-12 ml-12'>
            {Array.isArray(itemList) ? itemList.map((item, index) => {
              return (
                <button key={index} onClick={() => goToEdit(item)}>
                  <ItemCard item={item} />
                </button>
              )
            }) :
              null}
          </div>
          <button className='WishlistButton bg-[#003b4d] text-white p-2 rounded mt-4 hover:bg-[#006280] w-64 place-self-center' onClick={() => navigate(`/profile/${loggedIn.id}`)}>Back to Profile</button>
        </div>
    }</div>
  )

}

export default AdminItems;