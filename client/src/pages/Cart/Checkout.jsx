import { useState, useEffect } from 'react';

const Checkout = ({ matchingPatches, matchingItems }) => {

    const [cardNumber, setCardNumber] = useState(0);
    const [cardString, setCardString] = useState(cardNumber.toString());
    const [cardName, setCardName] = useState("");
    const [expiration, setExpiration] = useState("");
    const [cvc, setCvc] = useState(0);


    const cardTypeProcessing = () => {
        //American Express
        if((cardString.split(0, 1) === (34 || 37)) && (cardString.length === 15)){

        //Visa
        } else if ((cardString.split(0) === 4) && (cardString.length === (13 || 16))) {

        //Discover
        } else if (((cardString.split(0, 3) === 6011) && (cardString.length === 16)) || ((cardString.split(0) === 5) && (cardString.length === 15))){

        //Pressumably no card is entered yet
        } else {

        }
    }

    console.log(cardNumber);
    console.log(cardString);
    console.log(cardName);
    console.log(expiration);
    console.log(cvc);

    return (
        <div className='CheckoutContainer'>
            <div className='ItemizedList w-full md:w-1/3 bg-gray-300 shadow-lg rounded-lg p-4'>
                <div className='Patches mb-4'>
                    {
                        matchingPatches.map((patch, index) => {
                            return (
                                <div key={index} className='flex justify-between border-b py-2'>
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
                                <div key={index} className='flex justify-between border-b py-2'>
                                    <span className=''>{item.name}</span>
                                    <span className=''>{item.price}</span>
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            <div className='CardInfo'>
                {/* Secure Checkout "Banner" (cardTypeProcessing()) goes here with card company logos given different color hues*/}
                <form className='CardInformation bg-gray-300 flex flex-col justify-center p-4 rounded shadow-inner w-96'>
                    <h1 className='CardInformationHeader text-[#45A29E] text-3xl font-semibold mb-10 text-center'>Card Information</h1>
                    <label className='CardNumber text-[#222222]'>Card Number</label>
                    <input name='cardNumber' className='CardNumber w-full p-2 mb-4 bg-white rounded-md shadow mt-1' onChange={(e) => setCardNumber(e)}/>
                    <label className='CardName text-[#222222]'>Full Name</label>
                    <input name='cardName' className='CardNumber w-full p-2 mb-4 bg-white rounded-md shadow mt-1' onChange={(e) => setCardName(e)}/>
                    <label className='ExpirationDate text-[#222222]'>Expiration</label>
                    <input name='expirationDate' className='CardNumber w-full p-2 mb-4 bg-white rounded-md shadow mt-1' maxlength={5} onChange={(e) => setExpiration(e)}/>
                    <label className='CardCVC text-[#222222]'>CVC</label>
                    <input name='cardCVC' className='CardNumber w-full p-2 mb-4 bg-white rounded-md shadow mt-1' maxlength={4} onChange={(e) => setCvc(e)}/>
                </form>
            </div>
        </div>
    );
};

export default Checkout;

/*
    . Needs to list out itemized view
    . Needs a card information component
    . Needs to clear the cart from the localStorage
    . Needs a confirmation modal
    . Needs some sort of success indication prior to redirect
    .
*/