import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {LoggedInContext} from "../../App.js";


const Shop = () => {
  const [items, setItems] = useState([]);
  const {LoggedIn} = useContext(LoggedInContext);
  const [base, setBase] = useState('');
  const [baseList, setBaseList] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/items?attic_id=${LoggedIn.BOP}`)
    .then(res => res.json())
    .then(data => {
      setItems(data)
      fetch('http://localhost:8080/attics')
      .then(res => res.json())
      .then(data => setBaseList(data))
      .catch(err => console.error(err))
      })
    .catch(err => console.error(err))
  }, []);

  useEffect(() => {
    fetch(`http://localhost:8080/items?attic_id=${base}`)
    .then(res => res.json())
    .then(data => setItems(data))
  }, [base])

  return (
    <div className='Shop'>
      <button className='ShopDrop'>Base Select</ button>
        <div className='ShopDropCont'>
          {baseList.map((loc, index) => (
            <button className='Base' onClick={() => base !== loc.location ? setBase(loc.location) : null}>{loc.location}</ button>
          ))}
          </ div>
      {items.map((item, index) => (
        <Link to={`/shop/item/${item.id}`} key={index} className='Item' >
          <img className='ItemImage' src={item.picture_url} alt={item.name} />
          <p className='ItemName'>{item.name}</p>
          <p className='ItemPrice'>{item.cost}</p>
          <p className='ItemShip'>{item.can_ship ? 'Can be shipped' : 'Cannot be shipped'}</p>
        </Link>
      ))}
      </ div>
  )
}

export default Shop;