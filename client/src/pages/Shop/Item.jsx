import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Item = () => {
    const [item, setItem] = useState([]);
    const location = useLocation();
    let split = location.pathname.split('/');
    const id = split[3];

    useEffect(() => {
            fetch(`http://localhost:8080/items/${id}`)
                .then(res => res.json())
                .then(data => setItem(data[0]))
                .catch(err => console.error(err))
    }, [])

    return (
        <div className='ItemContainer place-content-center bg-gray-300 p-4 rounded shadow-inner m-8'>
            <h1 className='ItemTitle text-[#45A29E] text-5xl'>{item.name}</ h1>
            <img className='ItemImage' src={item.picture_url} alt={item.name} />
            <h3 className='ItemPrice text-2xl text-[#45A29E]'>${item.price}</ h3>
            <h3 className='ItemShip text-2xl text-[#45A29E]'>{item.can_ship ? 'Item can be shipped to your local Attic.' : 'Item cannot be shipped to your local Attic.'}</ h3>
        </ div>
    )
}

export default Item;