import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LoggedInContext, LoadingContext } from "../../App.js";
import { MdReport } from "react-icons/md";
import { ReportForm, Loader } from '../../components/index'
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './patch.css';


const Patch = () => {
    const [patch, setPatch] = useState([]);
    const [userName, setUserName] = useState('');
    const { loggedIn } = useContext(LoggedInContext);
    const { loading, setLoading } = useContext(LoadingContext);
    const location = useLocation();
    const nav = useNavigate()


    const [showReportForm, setShowReportForm] = useState(false);

    let split = location.pathname.split('/');
    const id = split[3];
    var cart = [];


    useEffect(() => {
      setLoading(true)
        fetch(`http://localhost:8080/patches/${id}`)
        .then(res => res.json())
        .then(data => setPatch(data[0]))
        .catch(err => console.error(err))
    }, [])

    useEffect(() => {
        fetch(`http://localhost:8080/users/${patch.user_id}`)
            .then(res => res.json())
            .then(data => {
              setUserName(data[0].name)
              setLoading(false)})
            .catch(err => console.error(err))
    },[patch])

    const addCartItem = () => {
        if(localStorage.getItem('patchCart')) {
            cart = JSON.parse(localStorage.getItem('patchCart'));
        }
        cart.push(patch.id);
        localStorage.setItem('patchCart', JSON.stringify(cart));
        toast.success("Added to cart!");
    }

    const addToWishlist = () => {
      fetch(`http://localhost:8080/patches_wishlist`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: loggedIn.id,
          patch_id: patch.id
        }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8'
        }
      })
      .then(res => res.json())
      .then(() => toast.success("Added to wishlist!"))
      .catch(err => console.log(err))
    }

    return (
      loading ? (
        <div className="flex justify-center items-center h-screen">
        <Loader />
        </div>
      ) : (
<>
        {loggedIn.isLoggedIn ?
          <div className='bg-gray-700/25 mt-28 p-6 rounded-xl shadow-xl m-auto fade-in h-full w-2/3'>
            <div className='PatchContainer flex flex-row items-start'>
              <div className="flex justify-start items-start mr-10">
                <img className="PatchImage w-96 object-cover object-center drop-shadow-xl rounded-lg filter brightness-110 hover:brightness-125 transition-all ease-in-out" src={patch.picture_url} alt={patch.name} />
              </div>
              <div>
                <h1 className='PatchTitle text-[#45A29E] text-3xl text-left w-2/3'>{patch.name}</h1>
                <h3 className='PatchPoster text-white mt-10'>Posted By: {userName}</h3>
                <p className='PatchPrice text-2xl text-white mt-16'>${patch.price}</p>
                <p className='PatchPrice text-white mt-20'>{patch.description}</p>
              </div>
            </div>
            <div className='PatchButtons flex justify-between w-full mt-10'>
              <button className='AddToCartButton bg-[#2ACA90] text-white p-2 rounded-md hover:bg-[#5DD3CB] hover:scale-105' onClick={() => { addCartItem() }}>Add to Cart</button>
              <button className='AddToWishlistButton bg-[#2ACA90] text-white p-2 rounded-md hover:bg-[#5DD3CB] hover:scale-105' onClick={() => addToWishlist()}>Add to Wishlist</button>
              <button className='BackButton text-white p-2 rounded-md bg-[#FF3300] hover:bg-[#FF9980] hover:scale-105' onClick={() => nav('/patches')}>Back</button>
            </div>
          </ div>
          :
          <div className='LogInToPurchase flex flex-col items-center p-8 bg-gray-300 rounded-md shadow-inner m-8'>
            <h1 className='LoginNotification text-[#45A29E] text-2xl mb-4'>You must be logged in to Purchase Patches!</h1>
            <Link to='/login' className='LoginLink bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] hover:scale-105 text-[#45A29E] text-1xl'>Login Here!</Link>
          </div>
        }
        {showReportForm && <ReportForm patch={patch} closeForm={() => setShowReportForm(false)} />}
        <ToastContainer position="bottom-right" />
      </>
      )

    )
}

export default Patch;