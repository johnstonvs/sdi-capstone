import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import PatchCard from '../../components/PatchCard/PatchCard';
import ItemCard from '../../components/ItemCard/ItemCard';
import Checkout from './Checkout';

const Cart = () => {

  //Patch state variables
  const [patchCartItems, setPatchCartItems] = useState([])
  const [allPatches, setAllPatches] = useState([]);
  const [matchingPatches, setMatchingPatches] = useState([])

  //Item state variables
  const [itemCartItems, setItemCartItems] = useState([])
  const [allItems, setAllItems] = useState([]);
  const [matchingItems, setMatchingItems] = useState([])

  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/patches`)
      .then(res => res.json())
      .then(data => setAllPatches(data))
      .catch(err => console.log(err))
    const savedCart = JSON.parse(localStorage.getItem('patchCart'));
    setPatchCartItems(savedCart);
  }, [])

  useEffect(() => {
    fetch(`http://localhost:8080/items`)
      .then(res => res.json())
      .then(data => setAllItems(data))
      .catch(err => console.log(err))
    const savedCart = JSON.parse(localStorage.getItem('itemCart'));
    setItemCartItems(savedCart);
  }, [])

  useEffect(() => {
    var matchPatch = [];
    if (patchCartItems) {
      for (let i = 0; i < allPatches.length; i++) {
        patchCartItems.map((savedPatchID) => {
          if (savedPatchID === allPatches[i].id) {
            matchPatch.push(allPatches[i])
          }
        })
      }
      setMatchingPatches(matchPatch)
    }
  }, [allPatches])

  useEffect(() => {
    var matchItem = [];
    if (itemCartItems) {
      for (let i = 0; i < allItems.length; i++) {
        itemCartItems.map((savedItemID) => {
          if (savedItemID === allItems[i].id) {
            matchItem.push(allItems[i])
          }
        })
      }
      setMatchingItems(matchItem)
    }
  }, [allItems])

  const clearTheCart = () => {
    localStorage.removeItem("patchCart");
    localStorage.removeItem("itemCart");
    setAllPatches([])
    setAllItems([])
  };

  const displayTotals = () => {
    let patchTotal = 0;
    matchingPatches.map(patch => {
      return patchTotal += +patch.price;
    })
    let itemTotal = 0;
    matchingItems.map(item => {
      return itemTotal += +item.price;
    })
    let total = (Math.round(patchTotal * 100) / 100) + (Math.round(itemTotal * 100) / 100);
    return (
      <>
        <p className='mb-2'>Patch Total: {Math.round(patchTotal * 100) / 100}</p>
        <p className='mb-2'>Item Total: {Math.round(itemTotal * 100) / 100}</p>
        <p className='mb-2'>Overall Total: {total}</p>
      </>
    );
  };

  return (
  <>
    {checkingOut ?
    <>
      <Checkout matchingPatches={matchingPatches} matchingItems={matchingItems} />
    </>
    :
    <div className='CartContainer flex flex-col md:flex-row justify-between mx-4 md:mx-8 lg:mx-16 my-4 gap-5'>
      <div className='PatchCartContainer w-full md:w-1/3 bg-gray-300 rounded-md shadow p-4'>
        {
          patchCartItems ?
            matchingPatches.map((patch, index) => {
              return (
                <Link to={{ pathname: `/shop/patch/${patch.id}` }} key={index} className='Patch' >
                  <div className='PatchCardContainer bg-gray-300 flex flex-col justify-center p-4 rounded shadow-inner gap-3'>
                    <img className='PatchImage h-52 object-cover object-center w-40 h-40' src={patch.picture_url} alt={patch.name} />
                    <h2 className='PatchName text-center font-semibold text-[#45A29E]'>{patch.name}</h2>
                    <h1 className='PatchPrice text-center font-semibold text-[#222222]'>${patch.price}</h1>
                  </div>
                </Link>
              );
            })
            :
            <div className='text-center py-4'>
              <h1 className='text-xl font-semibold text-[#45A29E]'>You have no patches in your cart!</h1>
            </div>
        }
      </div>
      <div className='ItemCartContainer w-full md:w-1/3 bg-gray-300 rounded-md shadow p-4'>
        {
          itemCartItems ?
            matchingItems.map((item, index) => {
              return (
                <Link to={{ pathname: `/shop/item/${item.id}` }} key={index} className='Item' >
                  <div className='ItemCardContainer bg-gray-300 flex flex-col justify-center p-4 rounded shadow-inner gap-3 z-5'>
                    <img className='ItemImage h-52 object-cover object-center w-40 h-40' src={item.picture_url} alt={item.name} />
                    <h2 className='ItemName text-center font-semibold text-[#45A29E]'>{item.name}</h2>
                    <h1 className='ItemPrice text-center font-semibold text-[#222222]'>${item.price}</h1>
                    <p className='ItemShip text-center text-[#222222]'>{item.can_ship ? 'Item can be shipped' : 'Item cannot be shipped'}</p>
                    <p className='ItemLocation text-center text-[#222222]'>Location: {item.location}</p>
                  </div>
                </Link>
              );
            })
            :
            <div className='text-center py-4'>
              <h1 className='text-xl font-semibold text-[#45A29E]'>You have no items in your cart!</h1>
            </div>
        }
      </div>
      <div className='ItemizedList w-full md:w-1/3 bg-gray-300 shadow-lg rounded-lg p-4'>
        <div className='Patches mb-4'>
          {
            matchingPatches.map((patch, index) => {
              return (
                <div className='flex justify-between border-b py-2'>
                  <span className=''>{patch.name}</span>
                  <span className=''>{patch.price}</span>
                </div>
              );
            })
          }
        </div>
        <div className='Items'>
          {
            matchingItems.map((item, index) => {
              return (
                <div className='flex justify-between border-b py-2'>
                  <span className=''>{item.name}</span>
                  <span className=''>{item.price}</span>
                </div>
              );
            })
          }
        </div>
        <div className='Totals justify-between py-4 flex items-center'>
          <div>
            {displayTotals()}
          </div>
          <button className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105'onClick={() => setCheckingOut(true)}>Checkout</button>
          <button className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105' onClick={() => clearTheCart()}>CLEAR CART</button>
        </div>
      </div>
    </div>
    }
  </>
  )
}

export default Cart;

//
//2. Implement a stop from adding more than one of same-product to cart OR add quantity counter (on hold)
//
//4. Implement total counter of price for all cart items to display in itemized column view
//5. Stylize each card to fit in the smaller columns for a preview rather than full item view
//6. Implement a Remove Item/Patch button