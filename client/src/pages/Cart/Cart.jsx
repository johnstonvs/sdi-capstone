import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { LoadingContext } from '../../App';
import { Loader } from '../../components/index.js';

const Cart = () => {

  //Patch state variables
  const [patchCartItems, setPatchCartItems] = useState(JSON.parse(localStorage.getItem('patchCart')) || [])
  const [allPatches, setAllPatches] = useState([]);
  const [matchingPatches, setMatchingPatches] = useState([])

  //Item state variables
  const [itemCartItems, setItemCartItems] = useState(JSON.parse(localStorage.getItem('itemCart')) || [])
  const [allItems, setAllItems] = useState([]);
  const [matchingItems, setMatchingItems] = useState([])

  const { loading, setLoading } = useContext(LoadingContext);

  useEffect(() => {
    setLoading(true)
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
      .then(data => {
        setAllItems(data)
        setLoading(false)})
      .catch(err => console.log(err))
    const savedCart = JSON.parse(localStorage.getItem('itemCart'));
    setItemCartItems(savedCart);
  }, [])

  useEffect(() => {
    var matchPatch = [];
    if (patchCartItems) {
      for (let i = 0; i < allPatches.length; i++) {
        patchCartItems.forEach((savedPatchID) => {
          if (savedPatchID === allPatches[i].id) {
            matchPatch.push(allPatches[i])
          }
        })
      }
      setMatchingPatches(matchPatch)
    }
  }, [allPatches, patchCartItems])

  useEffect(() => {
    var matchItem = [];
    if (itemCartItems) {
      for (let i = 0; i < allItems.length; i++) {
        itemCartItems.forEach((savedItemID) => {
          if (savedItemID === allItems[i].id) {
            matchItem.push(allItems[i])
          }
        })
      }
      setMatchingItems(matchItem)
    }
  }, [allItems, itemCartItems])

  const displayTotals = () => {
    let patchTotal = 0;
    matchingPatches.map(patch => {
      return patchTotal += +patch.price;
    })
    let itemTotal = 0;
    matchingItems.map(item => {
      return itemTotal += +item.price;
    })
    let total = (Math.round((itemTotal) * 100) / 100) + (Math.round(patchTotal * 100) / 100);
    return (
      <>
        <p className='mb-2'>Patch Total: {Math.round(patchTotal * 100) / 100}</p>
        <p className='mb-2'>Item Total: {Math.round(itemTotal * 100) / 100}</p>
        <p className='mb-2'>Overall Total: {(Math.round((total) * 100) / 100)}</p>
      </>
    );
  };

  const removePatch = (patch) => {
    //Updating local storage
    let patches = JSON.parse(localStorage.getItem('patchCart')); //ids
    let index = patches.indexOf(patch.id); //Find index of patch
    let newPatches = [...patches]; //Reassign patches
    newPatches.splice(index, 1); //Remove the unwanted, unloved patch
    localStorage.setItem('patchCart', JSON.stringify(newPatches)); //Reset the localStorage

    //Updating the page
    setPatchCartItems(JSON.parse(localStorage.getItem('patchCart'))) //Update State
  };

  const removeItem = (item) => {
    //Updating local storage
    let items = JSON.parse(localStorage.getItem('itemCart')); //ids
    let index = items.indexOf(item.id); //Find index of item
    let newItems = [...items]; //Reassign items
    newItems.splice(index, 1); //Remove the unwanted, unloved item
    localStorage.setItem('itemCart', JSON.stringify(newItems)); //Reset the localStorage

    //Updating the page
    setItemCartItems(JSON.parse(localStorage.getItem('itemCart'))); //Update State
  };

  return (
    loading ? (
      <div className="flex justify-center items-center h-screen">
      <Loader />
      </div>
    ) : (
      <div className='CartContainer mt-28 mb-20 flex flex-col md:flex-row justify-between mx-4 md:mx-8 lg:mx-16 my-4 gap-5'>
      <div className='PatchCartContainer w-full md:w-1/3 bg-gray-700/25 rounded-md shadow p-4'>
        {
          patchCartItems && patchCartItems.length > 0 ?
            matchingPatches.map((patch, index) => {
              return (
                <>

                  <div className='PatchCardContainer m-auto bg-gray-300 relative flex flex-row p-4 justify-center rounded-xl shadow-lg mb-4'>
                    <Link to={{ pathname: `/patches/patch/${patch.id}` }} key={index} className='Patch' >
                      <img className='PatchImage object-cover object-center w-40 h-40 m-auto' src={patch.picture_url} alt={patch.name} />
                      <div className='m-auto'>
                        <h2 className='PatchName text-center font-semibold text-[#45A29E]'>{patch.name}</h2>
                        <h1 className='PatchPrice text-center font-semibold text-[#222222]'>${patch.price}</h1>
                      </div>
                    </Link>
                    <div className='flex justify-center items-start absolute top-2 right-2'>
                      <button className='bg-red-500 text-white p-1 w-8 rounded-full hover:bg-red-700 text-center hover:scale-105' onClick={() => removePatch(patch)}>X</button>
                    </div>
                  </div>
                </>
              );
            })
            :
            <div className='text-center py-4'>
              <h1 className='text-xl font-semibold text-[#45A29E]'>You have no patches in your cart!</h1>
            </div>
        }
      </div>
      <div className='ItemCartContainer w-full md:w-1/3 bg-gray-700/25 rounded-md shadow p-4'>
        {
          itemCartItems && itemCartItems.length > 0 ?
            matchingItems.map((item, index) => {
              return (
                <>
                  <div className='ItemCardContainer m-auto bg-gray-300 relative flex flex-row p-4 justify-center rounded-xl shadow-lg mb-4'>
                    <Link to={{ pathname: `/shop/item/${item.id}` }} key={index} className='Item' >
                      <img className='ItemImage object-cover object-center w-40 h-40 m-auto' src={item.picture_url} alt={item.name} />
                      <div className='m-auto'>
                        <h2 className='ItemName text-center font-semibold text-[#45A29E]'>{item.name}</h2>
                        <h1 className='ItemPrice text-center font-semibold text-[#222222]'>${item.price}</h1>
                      </div>
                    </Link>
                    <div className='flex justify-center items-start absolute top-2 right-2'>
                      <button className='bg-red-500 text-white p-1 w-8 rounded-full hover:bg-red-700 text-center hover:scale-105' onClick={() => removeItem(item)}>X</button>
                    </div>
                  </div>
                </>
              );
            })
            :
            <div className='text-center py-4'>
              <h1 className='text-xl font-semibold text-[#45A29E]'>You have no items in your cart!</h1>
            </div>
        }
      </div>
      <div className='ItemizedList w-full md:w-1/3 bg-gray-700/25 text-white shadow-lg rounded-lg p-4'>
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
          {
            patchCartItems.length > 0 || itemCartItems.length > 0 ?
              <Link to="./checkout">
                <button className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105'>Checkout</button>
              </Link>
              :
              null
          }
        </div>
      </div>
    </div>
    )

  )
}

export default Cart;

//
//2. Implement a stop from adding more than one of same-product to cart OR add quantity counter (on hold)
//
//4. Implement total counter of price for all cart items to display in itemized column view
//5. Stylize each card to fit in the smaller columns for a preview rather than full item view
//6. Implement a Remove Item/Patch button