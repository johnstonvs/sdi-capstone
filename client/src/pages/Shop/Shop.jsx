import { useState, useEffect, useContext, createContext } from 'react';
import { Link } from 'react-router-dom';
import { LoggedInContext } from "../../App.js";
import { ItemCard } from '../../components/index.js';
import Item from './Item'

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
      <div className='DropCont relative inline-block '>
      <button className='ShopDrop bg-[#267458] hover:ShopDropCont:block'>Base Select</ button>
        <div className='ShopDropCont hidden absolute shadow-2xl'>
          <button className='CanShip bg-[#45A29E] block' onClick={() => setBase('Can Ship')}>Can ship</ button>
          {baseList ? baseList.map((loc, index) => (
            <button key={index} className='Base bg-[#45A29E] block' onClick={() => base !== loc.location ? setBase(loc.id) : null}>{loc.location}</ button>
          )) : null}
          </ div>
          </ div>
          <div className='ItemsContainer grid grid-cols-5 grid-rows-5 gap-x-10 gap-y-20 m-4'>
            {items ? items.map((item, index) => (
              <Link to={{pathname: `/shop/item/${item.id}`}} key={index} className='Item' >
                <ItemCard item={item} />
              </Link>
            )) : null}
          </div>
      </ div>
  )
}

export default Shop;