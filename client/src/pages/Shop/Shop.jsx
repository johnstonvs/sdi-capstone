import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoggedInContext } from "../../App.js";
import { ItemCard } from '../../components/index.js';
import Item from './Item'

const Shop = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const { loggedIn } = useContext(LoggedInContext);
  const [base, setBase] = useState('');
  const [baseList, setBaseList] = useState([]);
  const [on, setOn] = useState(false);


  useEffect(() => {
    fetch('http://localhost:8080/attics')
      .then(res => res.json())
      .then(data => {
        setBaseList(data)
      })
      .catch(err => console.error(err))
  }, []);

  useEffect(() => {
    let bop = loggedIn.BOP;
    console.log(bop)
    let filteredArr = [];
    fetch('http://localhost:8080/items')
      .then(res => res.json())
      .then(data => {
        setItems(data)
        if (loggedIn.isLoggedIn) {
          let bopID = undefined;
          baseList.forEach(attic => {
            if (attic.location === bop) {
              bopID = attic.id
              console.log('id:', bopID)
            }
          })
          filteredArr = items.filter(item => item.attic_id === bopID)
        }
        console.log(filteredArr)
        setFiltered(filteredArr);
      })
  }, [baseList])

  useEffect(() => {
    let filteredArr = [];
    if (base !== 'Can Ship' && base !== 'All Items' && base !== '') {
      items.forEach(item => {
        if (item.attic_id === base) {
          return filteredArr.push(item);
        }
      })
    } else if (base === 'Can Ship') {
      items.forEach(item => {
        if (item.can_ship) {
          return filteredArr.push(item);
        }
      })
    }
    setFiltered(filteredArr);
  }, [base])

  return (
    <div className='Shop'>
      <div className='DropCont inline-block ' >
        <button className='ShopDrop bg-[#267458] group z-50' onMouseOver={(e) => {e.stopPropagation(); setOn(!on)}} >Base Select</ button>
      </ div>
      <div className={on ? 'ShopDropCont flex shadow-2xl z-50 gap-x-5' : 'ShopDropCont hidden absolute shadow-2xl'} onMouseOut={() => setOn(!on)}>
        <button className='CanShip bg-[#45A29E] block hover: bg-[#267458]' onClick={() => setBase('Can Ship')} >Can ship</ button>
        <button className='AllItems bg-[#45A29E] block hover: bg-[#267458]' onClick={() => setBase('All Items')}>All items</ button>
        {baseList ? baseList.map((loc, index) => (
          <button key={index} className='Base bg-[#45A29E] block hover: bg-[#267458]' onClick={() => base !== loc.location ? setBase(loc.id) : null}>{loc.location}</ button>
        )) : null}
      </ div>
      <div className='ItemsContainer grid grid-cols-5 grid-rows-5 gap-x-10 gap-y-20 m-4'>
        {filtered.length ? filtered.map((item, index) => (
          <Link to={{ pathname: `/shop/item/${item.id}` }} key={index} className='Item' >
            <ItemCard item={item} />
          </Link>
        )) : items.map((item, index) => (
          <Link to={{ pathname: `/shop/item/${item.id}` }} key={index} className='Item' >
            <ItemCard item={item} />
          </Link>
        ))}
      </div>
    </ div>
  )
}

export default Shop;