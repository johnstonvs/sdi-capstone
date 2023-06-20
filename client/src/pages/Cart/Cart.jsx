import { useState, useEffect } from 'react';

const Cart = () => {

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : null;
  })

  return (
    <div className='HomeContainer'>

    </div>
  )
}

export default Cart;