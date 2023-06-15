import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoggedInContext } from '../../App';
import { PatchCard, ItemCard, StarRating } from '../../components/index.js';

const Home = () => {
  const [items, setItems] = useState([]);
  const [patches, setPatches] = useState([]);
  const { loggedIn } = useContext(LoggedInContext);
  const nav = useNavigate();

  return (
    <div className="HomeContainer">
      {loggedIn.isLoggedIn ? (
        loggedIn.BOP ? (
          <div className="LoggedInBOPContainer flex flex-col">
            <div className="LoggedInBOPItems">
              <h1 className="LoggedInBOPItemsHeader">Personalized Products</h1>
              <ItemCard item={items} />
            </div>
            <div className="LoggedInBOPPatches">
              <h1 className="LoggedInBOPPatchesHeader">Personalized Patches</h1>
              <PatchCard patch={patches} />
            </div>
          </div>
        ) : (
          <div className="LoggedInContainer">
            <div className="LoggedInItems">
              <h1 className="LoggedInItemsHeader">Personalized Products</h1>
              <ItemCard item={items} />
            </div>
            <div className="LoggedInPatches">
              <h1 className="LoggedInPatchesHeader">Personalized Patches</h1>
              <PatchCard patch={patches} />
            </div>
          </div>
        )
      ) : (
        <div className="NotLoggedInContainer flex flex-col gap-10 m-4 mt-10">
          <div className="CallToLoginContainer bg-gray-300 flex flex-col items-center p-2 rounded gap-4">
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
          <div className="AboutContainer bg-gray-300 flex flex-col items-center p-2 rounded gap-4">
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
  );
};

export default Home;
