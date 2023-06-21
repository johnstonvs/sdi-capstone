import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoggedInContext, TagsContext } from "../../App.js";
import { ItemCard, FilterModal } from '../../components/index.js';

const Shop = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const { loggedIn } = useContext(LoggedInContext);
  // const {tags} = useContext(TagsContext);
  const [baseList, setBaseList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [bases, setBases] = useState([]);
  const [ship, setShip] = useState('');
  const [tag, setTag] = useState([]);



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
        console.log(newData)

        setItems(newData)
        if (loggedIn.isLoggedIn) {
          let bopID = undefined;
          baseList.forEach(attic => {
            if (attic.location === bop) {
              bopID = attic.id;
            }
          })
          filteredArr = newData.filter(item => item.attic_id === bopID)
        }
        setFiltered(filteredArr);
      })
  }, [baseList])

  useEffect( () => {
    let filteredArr = items.filter((item) => {
      if (bases.some(base => base === item.attic_id)) {
        return true
      }

      return false

    })

    let moreFilter = filteredArr.filter(item => {
      if (ship === 'Can Ship' && item.can_ship) {
        return true
      }
      return false
    })
    // filter can ship
    let evenMoreFiltering = moreFilter
    // filter on tags
    // if (filters.includes('Can Ship') && item.can_ship) {
    //   return true
    // }

    // if (filters.some(filter => filter === item.attic_id)) {
    //   return true
    // }

    // for (let tag of item.tags) {
    //   if (filters.includes(tag) && (!filters.includes('Can Ship') || item.can_ship) ) {
    //     return true;
    //   }
    // }


    console.log('filtered:', filteredArr)
    console.log('more filtered:', moreFilter)
    console.log('evenMoreFilter:', evenMoreFiltering)
    setFiltered(filteredArr);
  }, [showModal])

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
      // item = JSON.parse(item[i].tags)
    }
    return item;
  }

  return (
    <>
    <div className='Shop'>
      <div className='FilterContainer'>
        <button className='FilterButt bg-[#45A29E] rounded border-solid text-gray-800 hover:scale-105 hover:scale-105 hover:bg-[#267458]' onClick={() => {setShowModal(true)}}>Filter</ button>
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