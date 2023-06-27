import React, { useState, useContext } from 'react';
import { TagsContext } from '../../App';
import { ConfirmationModal } from '../../components/index.js';

const EditItem = ({ item, discard }) => {

  const { tags } = useContext(TagsContext);
  const [newTags, setNewTags] = useState([]);
  const [newItem, setNewItem] = useState(item);
  const [imageUrl, setImageUrl] = useState('');

  const handleItemChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  }

  const handleCheckedTag = (e) => {
      setNewTags(newTags.includes(e.target.name) ? newTags.filter(item => item !== e.target.name) : newTags.concat([e.target.name]))
  }

  const handleSave = () => {

    if (imageUrl) {
      const formData = new FormData();
      formData.append('name', newItem.name);
      formData.append('description', newItem.description);
      formData.append('price', newItem.price);
      formData.append('can_ship', newItem.can_ship);
      formData.append('tags', newTags ? JSON.stringify(newTags) : newItem.tags);
      formData.append('image', imageUrl);

      fetch(`http://localhost:8080/items/withimage/${item.id}`, {
        method: 'PATCH',
        body: formData,
      })
        .then(res => res.json())
        .then(data => {
          setImageUrl('');
          discard();
        })
        .catch((err) => console.error(err));
    } else {
      fetch(`http://localhost:8080/items/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: newItem.name,
          description: newItem.description,
          price: newItem.price,
          can_ship: newItem.can_ship,
          tags: newItem.tags
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
        .then(res => res.json())
        .then(data => {
          setImageUrl('');
          discard();
          })

        .catch((err) => console.error(err));
    }
  }

  return (

    <div className='w-screen flex flex-col'>
      <form className='StockTool w-1/2 place-self-center max-w-lg bg-gray-300 rounded place-self-center mt-20 p-5'> {/* stocking tool */}
        <h1 className='Name text-2xl text-[#45A29E] font-semibold mb-3 text-center'>Edit {item.name}</h1>
        <label className='NameLabel text-[#222222]'>Item Name</label>
        <input name='name' className='EditHeader w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={newItem.name} type='text' onChange={(e) => handleItemChange(e)} />
        <label className='NameLabel text-[#222222]'>Description</label>
        <textarea name='description' className='EditHeader w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={newItem.description} type='text' onChange={(e) => handleItemChange(e)} />
        <div className='PriceAndShip flex'>
          <div className='PriceContainer flex flex-col pr-12'>
            <label className='Price text-[#222222]'>Price</label>
            <div>$ <input name='price' value={newItem.price} className='EditPrice w-24 p-2 mb-4 bg-white rounded-md shadow mt-1' type='number' step='0.01' min='0.00' onChange={(e) => handleItemChange(e)} /></div>
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
          <button type='submit' className='PostSubmit bg-[#003b4d] text-white p-2 rounded mt-4 w-16 hover:bg-[#006280]' onClick={handleSave}>Save</button>
          <button className='PostDiscard bg-[#ff3300] text-white p-2 rounded mt-4 hover:bg-[#ff5c33]' onClick={discard}>Discard</button>
        </div>
      </form>
    </div>

  )
}

export default EditItem;