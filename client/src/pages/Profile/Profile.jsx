import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoggedInContext } from '../../App';
import InformationEdit from '../../components/InformationEdit/InformationEdit'

const Profile = () => {

  const { loggedIn } = useContext(LoggedInContext);
  //Dummy Data
  const [itemWishlist, setItemWishlist] = useState(
  [{"user_id":4,"item_id":8},
  {"user_id":5,"item_id":18},
  {"user_id":6,"item_id":17},
  {"user_id":5,"item_id":14}]
  );
  //Dummy Data
  const [patchWishlist, setPatchWishlist] = useState(
  [{"user_id":5,"patch_id":6},
  {"user_id":9,"patch_id":16},
  {"user_id":4,"patch_id":6},
  {"user_id":1,"patch_id":9}]
  );

  /*
  useEffect(() => {
    fetch(http://localhost:8080//items_wishlist?loggedIn.id)
      fetch(http://localhost:8080//patches_wishlist?loggedIn.id)
        .then(response => response.json)
        .then(data => setPatchWishlist(data))
      .then(response => response.json)
      .then(data => setItemWishlist(data))
  },[])
  */

  return (
    <div className='Profile'>
      <div className='PatchWishlist'>
        {/* Map through state to display the patch image, name, price and total at the bottom*/}

      </div>
      <div className='ItemsWishlist'>
        {/* Map through state to display the item image, name, price and total at the bottom*/}
      </div>
      <div className='ProfileInformation'>
        {/* Button with onclick handler for the InformationEdit component */}

      </div>
    </div>
  )
}

export default Profile;