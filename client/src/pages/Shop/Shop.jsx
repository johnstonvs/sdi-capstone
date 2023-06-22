import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoggedInContext } from "../../App.js";
import { ItemCard, FilterModal } from '../../components/index.js';

const Shop = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const { loggedIn } = useContext(LoggedInContext);
  const [baseList, setBaseList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bases, setBases] = useState([]);
  const [ship, setShip] = useState('');
  const [tag, setTag] = useState([]);
  const [search, setSearch] = useState('');
  const[searchResults, setSearchResults] = useState([]);



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
    let filteredArr = [];
    fetch('http://localhost:8080/items')
      .then(res => res.json())
      .then(data => {
        let newData = addLocation(data);
        newData = fixTags(newData);

        setItems(newData);
        setSearchResults(newData);
        if (loggedIn.isLoggedIn) {
          let bopID = undefined;
          baseList.forEach(attic => {
            if (attic.location === bop) {
              bopID = attic.id;
              setBases([bopID]);
            }
          })
          filteredArr = newData.filter(item => item.attic_id === bopID)
        }
        setFiltered(filteredArr);
      })
  }, [baseList])

  useEffect(() => {
    let filteredArr = searchResults.filter((item) => {
      if (bases.some(base => base === item.attic_id)) {
        return true
      }
      return false
    })
    if (!filteredArr.length) {
      filteredArr = searchResults;
    }
    let moreFilter = filteredArr.filter(item => {
      if (ship === 'Can Ship' && item.can_ship) {
        return true
      }
      return false
    })
    if (!moreFilter.length) {
      moreFilter = filteredArr;
    }
    let evenMoreFiltering = moreFilter.filter(item => {
      if(tag.some(tag => item.tags.includes(tag))) {
        return true
      }
      return false
    })
    if(!evenMoreFiltering.length) {
      evenMoreFiltering = moreFilter;
    }
    setFiltered(evenMoreFiltering);
  }, [showModal, searchResults])

  useEffect(() => {
    setSearchResults(items.filter(item => item.name.toLowerCase().includes(search.toLowerCase())))
  }, [search])

  const addLocation = (data) => {
    let item = data;
    for (let i = 0; i < baseList.length; i++) {
      for (let j = 0; j < item.length; j++) {
        if (baseList[i].id === item[j].attic_id) {
          item[j].location = baseList[i].location;
        }
      }
    }
    return item;
  }

  const fixTags = (data) => {
    let item = data;
    for (let i = 0; i < item.length; i++) {
      let tags = item[i].tags.replace(/[{}]/g,'').split(',').map(tag => tag.trim().replace(/['"]/g, ''))
      item[i].tags = tags
    }
    return item;
  }

  return (
    <>
    <div className='Shop'>
      <div className='FilterContainer mb-10'>
        <input type='text' className='SearchBar w-full mt-5 mb-5 p-2 bg-white shadow mt-1' placeholder='Search . . .' onChange={(e) => setSearch(e.target.value)}/>
        <button className='FilterButt bg-[#2ACA90] ml-4 text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105' onClick={() => {setShowModal(true)}}>Filter</ button>
        <FilterModal baseList={baseList} show={showModal} handleClose={() => setShowModal(false)} setTag={setTag} tag={tag} bases={bases} setBases={setBases} ship={ship} setShip={setShip}/>
      </ div>
      <div className='ItemsContainer grid grid-cols-5 grid-rows-5 gap-x-10 gap-y-20 m-4'>
        {filtered.length ? filtered.map((item, index) =>  (
          <Link to={{ pathname: `/shop/item/${item.id}` }} key={index} className='Item' >
            <ItemCard item={item} />
          </Link>
        )) : items.map((item, index) => (
          <Link to={{ pathname: `/shop/item/${item.id}` }} key={index} className='Item' >
            <ItemCard item={item} />
          </Link>
        ))}
      </div>
      </div>
    </>
  )
}

export default Shop;