import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LoggedInContext, LoadingContext } from '../../App';
import { PatchCard, ItemCard, StarRating, Loader } from '../../components/index.js';
import { AiOutlineArrowRight, AiOutlineCaretRight } from 'react-icons/ai';
import { motion } from "framer-motion";
import HomeLogo from '../../assets/logo.png'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './Home.css'

const Home = () => {
  const [items, setItems] = useState([]);
  const [patches, setPatches] = useState([]);
  const [baseList, setBaseList] = useState()
  const { loading, setLoading } = useContext(LoadingContext);
  const { loggedIn } = useContext(LoggedInContext);
  const nav = useNavigate();

  var settings = {
    className: 'items-center mb-10',
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    autoplaySpeed: 4000,
    centerMode: true,
    centerPadding: "0px",
    cssEase: "linear",
    focusOnSelect: true,
    arrows: false
  };

  useEffect(() => {
    setLoading(true)
    const fetchData = async () => {
      const responseAttics = await fetch('http://localhost:8080/attics');
      const dataAttics = await responseAttics.json();
      setBaseList(dataAttics);

      const responsePatches = await fetch('http://localhost:8080/patches');
      const dataPatches = await responsePatches.json();
      setPatches(dataPatches.slice(0, 5));

      let responseItems;
      if (loggedIn.isLoggedIn && loggedIn.BOP) {
        responseItems = await fetch(`http://localhost:8080/items?base=${loggedIn.BOP}`);
      } else {
        responseItems = await fetch('http://localhost:8080/items');
      }
      const dataItems = await responseItems.json();
      setItems(dataItems.slice(0, 5));

      setLoading(false);
    };

    fetchData();
  }, []);



  return (
    loading ? (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    ) : (
      <div className='relative'>
        <div className='background-image'
            style={{
            backgroundImage: `url(${HomeLogo})`,
          }}
        >

        </div>
        <div className="HomeContainer pt-20 pb-32 flex flex-col h-fit">
          <Slider {...settings}>

            <div className='StoreInfo flex flex-col justify-center p-4 rounded shadow-inner w-96 mt-6'>
              <h1 className='StoreInfoHeading mb-2 text-center font-semibold text-xl text-white'>Browse the Shop</h1>
              <p className='StoreInfoBody bg-gray-300 w-screen p-3 text-center'>Visit the shop page to browse affordable items at your base's Airman's Attic or shippable items at other bases.</p>
            </div>

            <div className='LocationsInfo flex flex-col justify-center p-4 shadow-inner w-64 mt-6'>
              <h1 className='LocationsInfoHeading mb-2 text-center font-semibold text-xl text-white'>Find Attic's</h1>
              <p className='LocationsInfoBody bg-gray-300 w-screen p-3 text-center'>Use the location page to find Attics at other bases and browse their selections.</p>
            </div>

            <div className='PatchesInfo flex flex-col justify-center p-4 shadow-inner w-64 mt-6'>
              <h1 className='PatchesInfoHeading mb-2 text-center font-semibold text-xl text-white'>Trade Patches</h1>
              <p className='PatchesInfoBody bg-gray-300 w-screen p-3 text-center'>Visit the patches page to find patches you may like, or post your patches online to sell or trade with other patch connoisseurs.</p>
            </div>

          </Slider>

          {loggedIn.isLoggedIn ? (
            loggedIn.BOP ? (
              <div className="LoggedInBOPContainer mt-6 flex flex-col space-y-6 justify-center">
                <div className="LoggedInBOPItems flex flex-row gap-4 justify-center">
                  <h1 className="LoggedInBOPItemsHeader w-52 h-52 font-semibold text-xl self-center pr-3 pl-3 -rotate-45 text-[#45A29E]">{loggedIn.BOP} Products</h1>
                  <div className='flex flex-row space-x-3 rounded-lg p-3 h-fit w-fit h-96 place-self-center justify-center '>
                    {items ? items.map((item, index) => {
                      return (
                        <motion.div key={index}  className="LoggedInItems flex flex-row space-x-4 justify-center"
                          initial={{ x: -200, opacity: 0 }}
                          animate={!loading ? { x: 0, opacity: 1 } : {}}
                          transition={{ delay: index * 0.2, duration: .25 }}
                        >
                          <Link to={{ pathname: `/shop/item/${item.id}` }} className='Item' >
                            <ItemCard item={item} />
                          </Link>
                        </motion.div>
                      )
                    }) : <p>No Items From Base {loggedIn.BOP}</p>}
                  </div>
                  <Link
                    className="NavbarLinks rounded border-solid w-52 h-52 flex justify-center"
                    to="/shop">
                    <div className="flex items-center justify-center flex-column bg-gray-300 px-2 py-1 rounded shadow-lg w-20 text-gray-800 hover:scale-105 hover:bg-[#5DD3CB] self-center">
                      More <AiOutlineArrowRight />
                    </div>
                  </Link>
                </div>
                <div className="LoggedInBOPPatches flex flex-row space-x-4 justify-center">
                  <h1 className="LoggedInBOPPatchesHeader w-52 h-52 font-semibold text-xl self-center pr-3 pl-3 -rotate-45 text-[#45A29E]">Recommended Patches</h1>
                  <div className='flex flex-row space-x-3 rounded p-3 h-fit w-fit h-96 place-self-center justify-center '>
                    {patches.map((patch, index) => {
                      return (
                        <motion.div className="LoggedInItems flex flex-row space-x-4 justify-center"
                          initial={{ x: -200, opacity: 0 }}
                          animate={!loading ? { x: 0, opacity: 1 } : {}}
                          transition={{ delay: index * 0.2, duration: .25 }}
                          key={index}
                        >
                          <Link to={{ pathname: `/patches/patch/${patch.id}` }}  className='Patch' >
                            <PatchCard patch={patch} />
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                  <Link
                    className="NavbarLinks rounded border-solid w-52 h-52 flex justify-center"
                    to="/patches">
                    <div className="flex items-center justify-center flex-column bg-gray-300 px-2 py-1 rounded shadow-lg w-20 text-gray-800 hover:scale-105 hover:bg-[#5DD3CB] self-center">
                      More <AiOutlineArrowRight />
                    </div>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="LoggedInContainer mt-6 flex flex-col space-y-6 justify-center">
                <div className="LoggedInItems flex flex-row gap-4 justify-center">
                  <h1 className="LoggedInItemsHeader w-52 h-52 font-semibold text-xl self-center pr-3 pl-3 -rotate-45 text-[#45A29E]">Products</h1>
                  <div className='flex flex-row space-x-3 rounded p-3 h-fit w-fit h-96 place-self-center justify-center '>
                    {items.map((item, index) => {
                      return (
                        <motion.div className="LoggedInItems flex flex-row space-x-4 justify-center"
                          initial={{ x: -200, opacity: 0 }}
                          animate={!loading ? { x: 0, opacity: 1 } : {}}
                          transition={{ delay: index * 0.2, duration: .25 }}
                        >
                          <Link to={{ pathname: `/shop/item/${item.id}` }} key={index} className='Item' >
                            <ItemCard item={item} />
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                  <Link
                    className="NavbarLinks rounded border-solid w-52 h-52 flex justify-center"
                    to="/shop">
                    <div className="flex items-center justify-center flex-column bg-gray-300 px-2 py-1 rounded shadow-lg w-20 text-gray-800 hover:scale-105 hover:bg-[#5DD3CB] self-center">
                      More <AiOutlineArrowRight />
                    </div>
                  </Link>
                </div>
                <div className="LoggedInPatches flex flex-row space-x-4 justify-center">
                  <h1 className="LoggedInPatchesHeader  w-52 h-52 font-semibold text-xl self-center pr-3 pl-3 -rotate-45 text-[#45A29E]">Patches</h1>
                  <div className='flex flex-row space-x-3 rounded p-3 h-fit w-fit h-96 place-self-center justify-center '>
                    {patches.map((patch, index) => {
                      return (
                        <motion.div className="LoggedInItems flex flex-row space-x-4 justify-center"
                          initial={{ x: -200, opacity: 0 }}
                          animate={!loading ? { x: 0, opacity: 1 } : {}}
                          transition={{ delay: index * 0.2, duration: .25 }}
                        >
                          <Link to={{ pathname: `/shop/patch/${patch.id}` }} key={index} className='Patch' >
                            <PatchCard patch={patch} />
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                  <Link
                    className="NavbarLinks rounded border-solid w-52 h-52 flex justify-center"
                    to="/patches">
                    <div className="flex items-center justify-center flex-column bg-gray-300 px-2 py-1 rounded shadow-lg w-20 text-gray-800 hover:scale-105 hover:bg-[#5DD3CB] self-center">
                      More <AiOutlineArrowRight />
                    </div>
                  </Link>
                </div>
              </div>
            )
          ) : (
            <div className="NotLoggedInContainer flex flex-col w-2/3 gap-10 m-auto mt-10">
              <div className="CallToLoginContainer bg-gray-300 flex flex-col items-center p-6 rounded-xl shadow-lg gap-4">
                <h1 className="CallToLoginHeader text-3xl text-[#45A29E]">
                  New here? Click the button below to create an account and login!
                </h1>
                <button
                  className="LoginButton bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] hover:scale-105"
                  onClick={() => {
                    nav('/login');
                  }}
                >
                  Login
                </button>
                <h2 className="CallToLoginHeader2 text-3xl text-[#45A29E]">
                  Why should I create an account?
                </h2>
                <p className="CallToLoginInfo text-[#222222]">
                  Good question! Creating an account allows you to set a default Attic to view when
                  you come back, create a wishlist of awesome items at your local Attic and unique
                  patches from around the world, allows you to order products and ship them to your local attic, and much much more! Still not convinced? Take a look
                  below at our mission!
                </p>
              </div>
              <div className="AboutContainer bg-gray-300 flex flex-col items-center p-6 rounded-xl shadow-lg gap-4">
                <h1 className="AboutHeader text-3xl text-[#45A29E]">Why Airmen's Warehouse?</h1>
                <p className="AboutContent text-[#222222]">
                  Our mission is to improve the efficiency and effectiveness of the Airman's Attic by
                  providing a user-friendly web application that simplifies the process of tracking
                  donations and costs. We believe that by addressing this crucial issue, we can have a
                  direct and positive impact on the lives of our fellow service members.
                </p>
                <h2 className="AboutHeader2 text-2xl text-[#45A29E]">Key Objectives</h2>
                <ul className="text-[#222222]">
                  <li className="p-2">
                    Centralized Donation Tracking: We strive to create a centralized platform that
                    enables seamless tracking of donations, making it easier to manage and distribute
                    resources efficiently.
                  </li>
                  <li className="p-2">
                    Cost Management: Our application will provide robust features to track the costs
                    associated with running the Airman's Attic, enabling better financial planning and
                    reducing wastage.
                  </li>
                  <li className="p-2">
                    Productivity and Morale Boost: By ensuring that service members have access to the
                    necessary resources when they move, we aim to enhance their productivity and
                    morale, contributing to their overall well-being.
                  </li>
                  <li className="p-2">
                    Financial Efficiency: Improving the efficiency of the Airman's Attic operations
                    will lead to reduced financial losses, ensuring optimal resource utilization and
                    positively impacting the overall budget and sustainability efforts of the Air
                    Force.
                  </li>
                  <li className="p-2">
                    Positive Image and Trust: Our application not only addresses a critical issue but
                    also showcases the organization's commitment to caring for its members and
                    effectively managing resources. By demonstrating effective resource management, we
                    aim to foster a sense of pride and trust among the members of the Air Force.
                  </li>
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>
    )
  );
};

export default Home;
