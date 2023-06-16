import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import {LoggedInContext} from "../../App.js";


const Shop = () => {
  const [items, setItems] = useState([]);
  const {loggedIn} = useContext(LoggedInContext);
  const [base, setBase] = useState('');
  const [baseList, setBaseList] = useState([]);

  useEffect(() => {
    if (loggedIn.isLoggedIn) {
      fetch(`http://localhost:8080/items?attic_id=${loggedIn.BOP}`)
        .then(res => res.json())
        .then(data => {
          setItems(data)
          fetch('http://localhost:8080/attics')
          .then(res => res.json())
          .then(data => {console.log('attics', data); setBaseList(data)})
          .catch(err => console.error(err))
          })
        .catch(err => console.error(err))
    } else {
        fetch('http://localhost:8080/items')
          .then(res => res.send)
          .then(data => {
            setItems(data)
            fetch('http://localhost:8080/attics')
              .then(res => res.json())
              .then(data => {console.log('attics', data); setBaseList(data)})
              .catch(err => console.error(err))
            })
          .catch(err => console.error(err))
      }
  }, []);

  useEffect(() => {
    if (base !== 'Can Ship') {
      fetch(`http://localhost:8080/items?attic_id=${base}`)
        .then(res => res.json())
        .then(data => setItems(data))
        .catch(err => console.error(err))
      } else {
        fetch('http://localhost:8080/items?can_ship=true')
          .then(res => res.json())
          .then(data => setItems(data))
          .catch(err => console.error(err))
        }

        console.log(baseList)
        console.log('items:', items);
  }, [base])

  return (
    <div className='Shop'>
      <button className='ShopDrop'>Base Select</ button>
        <div className='ShopDropCont'>
          <button className='CanShip' onClick={() => setBase('Can Ship')}>Can ship</ button>
          {baseList ? baseList.map((loc, index) => (
            <button className='Base' onClick={() => base !== loc.location ? setBase(loc.id) : null}>{loc.location}</ button>
          )) : null}
          </ div>
      {items ? items.map((item, index) => (
        <Link to={`/shop/item/${item.id}`} key={index} className='Item' params={ {item: item}} >
          <img className='ItemImage' src={item.picture_url} alt={item.name} />
          <p className='ItemName'>{item.name}</p>
          <p className='ItemPrice'>{item.cost}</p>
          <p className='ItemShip'>{item.can_ship ? 'Can be shipped' : 'Cannot be shipped'}</p>
        </Link>
      )) : null}
      </ div>
  )
}

export default Shop;