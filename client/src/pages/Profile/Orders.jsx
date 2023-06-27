import { useState, useEffect, useContext } from 'react';
import { LoggedInContext } from "../../App.js";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const { loggedIn } = useContext(LoggedInContext);
    const [items, setItems] = useState([]);
    const [patches, setPatches] = useState([]);
    const [map, setMap] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8080/users/${loggedIn.id}/orders`)
            .then(res => res.json())
            .then(data => {
                let newData = fixItem(data);
                newData = fixPatch(newData);
                setOrders(newData);
            })
            .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        let itemArr = [];
        let patchArr = [];
        orders.forEach(order => {
            let promiseItemArr = order.item_id.map(item => {
                return fetch(`http://localhost:8080/items/${item}`).then(res => res.json());
            })
            Promise.all(promiseItemArr)
                .then(data => itemArr.push(data))
                .catch(err => console.error(err))

            let promisePatchArr = order.patch_id.map(patch => {
                return fetch(`http://localhost:8080/patches/${patch}`).then(res => res.json())
            })
            Promise.all(promisePatchArr)
                .then(data => patchArr.push(data))
                .catch(err => console.error(err))
        })
        let ordersMap = orders.map((order, index) =>
            <div key={index} className='OrderInfo w-full md:w-1/3 bg-neutral-700/25 rounded-md shadow p-4'>
                <p className='Name text-center font-semibold text-[#45A29E]'>{loggedIn.name}</ p>
                <p className='ShipLocation text-center font-semibold text-[#45A29E]'>Ship location: {order.location}</ p>
                <div className='OrderDetails m-auto bg-gray-300 relative flex flex-row p-4 justify-center rounded-xl shadow-lg mb-4'>
                    <p className='OrderTimeStamp text-center font-semibold text-[#45A29E]'>Order placed on: {order.created_at}</ p>
                    <div className='testCont'>
                        {items.map((group, index2) => {
                            console.log(items);
                            return (<div key={index2} className='test'>TEST
                                {/* {group.map((item, index) => {
                            return (
                                <div className='ItemDetails text-center font-semibold text-[#45A29E]' key={index}>
                                    <p>TEST</p>
                                    <img className='ItemImage text-center font-semibold text-[#45A29E]' src={item[0].picture_url} alt={item[0].name} />
                                    <p className='ItemName text-center font-semibold text-[#45A29E]'>{item[0].name}</p>
                                    <p className='ItemPrice text-center font-semibold text-[#45A29E]'>{item[0].price}</p>
                                </ div>
                            )
                        })} */}
                            </ div>)
                        }
                        )}
                    </div>
                    {/* {patches.map((patch, index) =>
                <div className='PatchDetails m-auto bg-gray-300 relative flex flex-row p-4 justify-center rounded-xl shadow-lg mb-4' key={index}>
                    <img className='PatchImage' src='' alt={patch.name} />
                    <p className='PatchName text-center font-semibold text-[#45A29E]'>{patch.name}</ p>
                    <p className='PatchPrice text-center font-semibold text-[#45A29E]'>{patch.price}</ p>
                </ div>
            )} */}
                    {order.total}
                </ div>
            </ div>
        )
        setMap(ordersMap);
        setItems(itemArr);
        setPatches(patchArr);
    }, [orders])





    const fixItem = (data) => {
        let item = data;
        for (let i = 0; i < item.length; i++) {
            let fixed = item[i].item_id.replace(/[{}]/g, '').replace(/\[|\]/g, '').split(',').map(id => id.trim().replace(/['"]/g, ''))
            item[i].item_id = fixed
        }
        return item;
    }

    const fixPatch = (data) => {
        let item = data;
        for (let i = 0; i < item.length; i++) {
            let fixed = item[i].patch_id.replace(/[{}]/g, '').replace(/\[|\]/g, '').split(',').map(id => id.trim().replace(/['"]/g, ''))
            item[i].patch_id = fixed
        }
        return item;
    }

    return (
        <div className='OrdersContainer mt-28 mb-20 lg:mx-16 my-4 gap-5'>
            <h3 className='OrdersTitle text-[#45A29E] text-4xl font-semibold mb-4 text-center'>Your orders</ h3>
            {orders.length > 0 ?
                map
                : <p className='NoOrders text-center font-semibold text-[#45A29E]'>No orders to display</ p>}
        </ div>
    )
}

export default Orders;