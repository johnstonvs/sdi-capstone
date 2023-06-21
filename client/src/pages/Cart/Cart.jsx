import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PatchCard from '../../components/PatchCard/PatchCard';
import ItemCard from '../../components/ItemCard/ItemCard';

const Cart = () => {

  //Patch state variables
  const [patchCartItems, setPatchCartItems] = useState([])
  const [allPatches, setAllPatches] = useState([]);
  const [matchingPatches, setMatchingPatches] = useState([])

  //Item state variables
  const [itemCartItems, setItemCartItems] = useState([])
  const [allItems, setAllItems] = useState([]);
  const [matchingItems, setMatchingItems] = useState([])

  useEffect(() => {
    fetch(`http://localhost:8080/patches`)
      .then(res => res.json())
      .then(data => setAllPatches(data))
      .catch(err => console.log(err))
      const savedCart = JSON.parse(localStorage.getItem('patchCart'));
      setPatchCartItems(savedCart);
  },[])

  useEffect(() => {
    fetch(`http://localhost:8080/items`)
      .then(res => res.json())
      .then(data => setAllItems(data))
      .catch(err => console.log(err))
      const savedCart = JSON.parse(localStorage.getItem('itemCart'));
      setItemCartItems(savedCart);
  },[])

  useEffect(() => {
    var matchPatch = [];
    if(patchCartItems){
      for (let i=0; i<allPatches.length; i++){
        patchCartItems.map((savedPatchID) => {
          if(savedPatchID === allPatches[i].id){
            matchPatch.push(allPatches[i])
          }
        })
      }
      setMatchingPatches(matchPatch)
    }
  },[allPatches])

  useEffect(() => {
    var matchItem = [];
    if(itemCartItems){
      for (let i=0; i<allItems.length; i++){
        itemCartItems.map((savedItemID) => {
          if(savedItemID === allItems[i].id){
            matchItem.push(allItems[i])
          }
        })
      }
      setMatchingItems(matchItem)
    }
  },[allItems])

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
        <p>Patch Total: {Math.round(patchTotal * 100) / 100}</p>
        <p>Item Total: {Math.round(itemTotal * 100) / 100}</p>
        <p>Overall Total: {total}</p>
      </>
    );
  };

  return (
    <div className='CartContainer'>
      <div className='PatchCartContainer'>
        {
          patchCartItems ?
          matchingPatches.map((patch, index) => {
            return(
              <Link to={{pathname: `/shop/patch/${patch.id}`}} key={index} className='Patch' >
                <PatchCard patch={patch} />
              </Link>
            );
          })
          :
          <>
            {/* This needs styling */}
            <h1>You have no patches in your cart!</h1>
          </>
        }
      </div>
      <div className='ItemCartContainer'>
        {
          itemCartItems ?
          matchingItems.map((item, index) => {
            return(
              <Link to={{pathname: `/shop/item/${item.id}`}} key={index} className='Item' >
                <ItemCard item={item} />
              </Link>
            );
          })
          :
          <>
            {/* This needs styling */}
            <h1>You have no items in your cart!</h1>
          </>
        }
      </div>
      <div className='ItemizedList'>
        <div className='Patches'>
          {
            matchingPatches.map((patch, index) => {
              return (
              <li>{`${patch.name}: ${patch.price}`}</li>
              );
            })
          }
        </div>
        <div className='Items'>
          {
            matchingItems.map((item, index) => {
              return (
              <li>{`${item.name}: ${item.price}`}</li>
              );
            })
          }
        </div>
        <div className='Totals'>
          {displayTotals()}
        </div>
      </div>
      <button onClick={() => clearTheCart()}>Clear the cart for testing</button>
    </div>
  )
}

export default Cart;

//2. Implement a stop from adding more than one of same-product to cart OR add quantity counter (on hold)
//3. Implement 3 column view (patch cart, item cart, itemized list view)
//4. Implement total counter of price for all cart items to display in itemized column view
//5. Stylize each card to fit in the smaller columns for a preview rather than full item view
//6.