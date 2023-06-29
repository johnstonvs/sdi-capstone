import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LoggedInContext, LoadingContext } from "../../App.js";
import { ItemCard, FilterModal, Loader } from '../../components/index.js';

const Shop = () => {
  const location = useLocation()

  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const { loggedIn } = useContext(LoggedInContext);
  const [baseList, setBaseList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [tag, setTag] = useState([]);
  const [bases, setBases] = useState([]);
  const [ship, setShip] = useState('');
  const [price, setPrice] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { loading, setLoading } = useContext(LoadingContext);

  useEffect(() => {
    setLoading(true)
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
        if (loggedIn.isLoggedIn && tag.length === 0) {
          let bopID = undefined;
          baseList.forEach(attic => {
            if (attic.location === bop) {
              bopID = attic.id;
            }
          })
          if(bases.length === 0) {
            setBases([bopID]);
          } else {
          }
          filteredArr = newData.filter(item => item.attic_id === bopID)
        }
        setFiltered(filteredArr);
        setLoading(false)
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

    let priceFilter = [];
    if (price === 'Low to High') {
      priceFilter = filteredArr.sort((a, b) => a.price - b.price)
    } else if (price === 'High to Low') {
      priceFilter = filteredArr.sort((a, b) => b.price - a.price)
    }
    if(!priceFilter.length) {
      priceFilter = filteredArr;
    }

    let shipFilter = priceFilter.filter(item => {
      if (ship === 'Can Ship' && item.can_ship) {
        return true
      }
      return false
    })
    if (!shipFilter.length) {
      shipFilter = priceFilter;
    }

    let evenMoreFiltering = shipFilter.filter(item => {
      if(tag.some(tag => item.tags.includes(tag))) {
        return true
      }
      return false
    })
    if(!evenMoreFiltering.length) {
      evenMoreFiltering = shipFilter;
    }
    setFiltered(evenMoreFiltering);
  }, [showModal, searchResults])

  useEffect(() => {
    setSearchResults(items.filter(item => item.name.toLowerCase().includes(search.toLowerCase())))
  }, [search])

  useEffect(() => {
    const initalItems = async () => {
      const searchParams = new URLSearchParams(location.search);
      let initialTag = searchParams.get('tag');
      let initialLocation = searchParams.get('location')

      if (initialTag && tag.length === 0) {
        setTag([initialTag]);
      }
    }
    initalItems()
  }, [location])

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
      let tags = item[i].tags.replace(/[{}]/g,'').replace(/\[|\]/g, '').split(',').map(tag => tag.trim().replace(/['"]/g, ''))
      item[i].tags = tags
    }
    return item;
  }

  return (
    loading ? (
      <div className="flex justify-center items-center h-screen">
      <Loader />
      </div>
    ) : (
<>
    <div className='Shop mt-28 mb-20'>
      <div className='FilterContainer mb-10'>
        <input type='text' className='SearchBar w-full mt-5 mb-5 p-2 bg-white shadow mt-1' placeholder='Search . . .' onChange={(e) => setSearch(e.target.value)}/>
        <button className='FilterButt bg-[#2ACA90] ml-4 text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105' onClick={() => {setShowModal(true)}}>Filter</ button>
        <FilterModal baseList={baseList} show={showModal} handleClose={() => setShowModal(false)} setTag={setTag} tag={tag} bases={bases} setBases={setBases} ship={ship} setShip={setShip} setPrice={setPrice}/>
      </ div>
      <div className='ItemsContainer grid grid-cols-5 grid-rows-5 gap-x-10 gap-y-20 m-4'>
        {filtered.length > 0 ? filtered.map((item, index) =>  (
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
  )
}

export default Shop;