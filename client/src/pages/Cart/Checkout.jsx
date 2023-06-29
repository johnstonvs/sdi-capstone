
//  _____ _____ _____ _____ __    _____ _____ _____
// |     |     |   | |     |  |  |     |_   _|  |  |
// | | | |  |  | | | |  |  |  |__|-   -| | | |     |
// |_|_|_|_____|_|___|_____|_____|_____| |_| |__|__|

import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import amex from "../../assets/amex.png";
import discover from "../../assets/discover.png";
import visa from "../../assets/visa.png";
import "./Checkout.css"
import { ShipTo, ConfirmationModal } from '../../components/index'
import { HomeIcon, CurrencyDollarIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Stepper, Step, Button } from "@material-tailwind/react";
import { LoggedInContext } from "../../App.js";
import emailjs from '@emailjs/browser';

const Checkout = () => {

    const { loggedIn } = useContext(LoggedInContext);

    //Card information states
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiration, setExpiration] = useState("");
    const [cvc, setCvc] = useState("");
    const [street, setStreet] = useState("");
    const [apartment, setApartment] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [zip, setZip] = useState("");
    const [shippingLocation, setShippingLocation] = useState();

    //Conditional states
    const [hiddenState, setHiddenState] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formNotCompleted, setFormNotCompleted] = useState(true);
    const [receipt, setReceipt] = useState(true);
    const nav = useNavigate();

    //Stepper States
    const [activeStep, setActiveStep] = useState(0);
    const [isLastStep, setIsLastStep] = useState(false);
    const [isFirstStep, setIsFirstStep] = useState(false);

    //Stepper functions
    const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
    const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

    //Patch state variables
    const [patchCartItems, setPatchCartItems] = useState(JSON.parse(localStorage.getItem('patchCart')) || []);
    const [allPatches, setAllPatches] = useState([]);
    const [matchingPatches, setMatchingPatches] = useState([]);

    //Item state variables
    const [itemCartItems, setItemCartItems] = useState(JSON.parse(localStorage.getItem('itemCart')) || []);
    const [allItems, setAllItems] = useState([]);
    const [matchingItems, setMatchingItems] = useState([]);

    const serviceId = process.env.REACT_APP_SERVICE_ID;
    const templateId = process.env.REACT_APP_TEMPLATE_ID;
    const emailKey = process.env.REACT_APP_EMAIL_JS_KEY;

    useEffect(() => {
        fetch(`http://localhost:8080/patches`)
            .then(res => res.json())
            .then(data => setAllPatches(data))
            .catch(err => console.log(err))
        const savedCart = JSON.parse(localStorage.getItem('patchCart'));
        setPatchCartItems(savedCart);
    }, []);

    useEffect(() => {
        fetch(`http://localhost:8080/items`)
            .then(res => res.json())
            .then(data => setAllItems(data))
            .catch(err => console.log(err))
        const savedCart = JSON.parse(localStorage.getItem('itemCart'));
        setItemCartItems(savedCart);
    }, []);

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
    }, [allPatches, patchCartItems]);

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
    }, [allItems, itemCartItems]);

    const displayTotals = () => {
        let patchTotal = 0;
        matchingPatches.map(patch => {
            return patchTotal += +patch.price;
        });
        let itemTotal = 0;
        matchingItems.map(item => {
            return itemTotal += +item.price;
        });

        let allTotal = (Math.round((itemTotal) * 100) / 100) + (Math.round(patchTotal * 100) / 100)
        return (
            <div className='TotalDisplay flex pt-4 justify-left grid grid-rows-3'>
                <p className='mb-2'>Patch Total: {Math.round(patchTotal * 100) / 100}</p>
                <p className='mb-2'>Item Total: {Math.round(itemTotal * 100) / 100}</p>
                <p className='mb-2'>Overall Total: {allTotal}</p>
            </div>
        );
    };

    const setLocation = (location) => {
        setShippingLocation(location)
    };

    const cardTypeProcessing = () => {
        //American Express
        if (cardNumber.slice(0, 2) === '34' || cardNumber.slice(0, 2) === '37') {
            return (
                <div className='CardContainer w-16 flex flex-col md:flex-row gap-3'>
                    <img
                        className="AmexImage aspect-auto"
                        src={amex}
                        alt="American Express Logo"
                    />
                    <img
                        className="DiscoverImage grayscale aspect-auto"
                        src={discover}
                        alt="Discover Logo"
                    />
                    <img
                        className="VisaImage grayscale aspect-auto"
                        src={visa}
                        alt="Visa Logo"
                    />
                </div>
            )
            //Visa
        } else if (cardNumber.slice(0, 1) === '4') {
            return (
                <div className='CardContainer w-16 flex flex-col md:flex-row gap-3'>
                    <img
                        className="AmexImage grayscale aspect-auto"
                        src={amex}
                        alt="American Express Logo"
                    />
                    <img
                        className="DiscoverImage grayscale aspect-auto"
                        src={discover}
                        alt="Discover Logo"
                    />
                    <img
                        className="VisaImage aspect-auto"
                        src={visa}
                        alt="Visa Logo"
                    />
                </div>
            )
            //Discover
        } else if (cardNumber.slice(0, 4) === '6011' || cardNumber.slice(0, 1) === '5') {
            return (
                <div className='CardContainer w-16 flex flex-col md:flex-row gap-3'>
                    <img
                        className="AmexImage grayscale aspect-auto"
                        src={amex}
                        alt="American Express Logo"
                    />
                    <img
                        className="DiscoverImage aspect-auto"
                        src={discover}
                        alt="Discover Logo"
                    />
                    <img
                        className="VisaImage grayscale aspect-auto"
                        src={visa}
                        alt="Visa Logo"
                    />
                </div>
            )
            //Pressumably no card is entered yet
        } else {
            return (
                <div className='CardContainer w-16 flex flex-col md:flex-row gap-3'>
                    <img
                        className="AmexImag aspect-auto"
                        src={amex}
                        alt="American Express Logo"
                    />
                    <img
                        className="DiscoverImage aspect-auto"
                        src={discover}
                        alt="Discover Logo"
                    />
                    <img
                        className="VisaImage aspect-auto"
                        src={visa}
                        alt="Visa Logo"
                    />
                </div>
            )
        }
    };

    const handleExpiration = (e) => {
        let { value } = e.target;
        value = value.replace(/\D/g, "");
        const isValidInput = /^\d*$/.test(value);

        if (value.length > 2) {
            value = value.slice(0, 2) + '/' + value.slice(2)
        }

        if (isValidInput) {
            setExpiration(value)
        }
    };

    const handleCountry = (e) => {
        setCountry(e.target.value)
        //United States, Canada, and Puerto Rico
        if (e.target.value === 'US' || e.target.value === 'CA' || e.target.value === 'PR') {
            setHiddenState(false);
        } else {
            setHiddenState(true);
        }
    };

    const clearTheCart = () => {
        localStorage.removeItem("patchCart");
        localStorage.removeItem("itemCart");
        localStorage.setItem('patchCart', JSON.stringify([]));
        localStorage.setItem('itemCart', JSON.stringify([]));
        nav('/')
    };

    const generateOrder = () => {

        let patchTotal = 0;
        matchingPatches.map(patch => {
            return patchTotal += +patch.price;
        });
        let itemTotal = 0;
        matchingItems.map(item => {
            return itemTotal += +item.price;
        });

        let total = patchTotal + itemTotal;

        if (receipt) {
            let itemsOrdered = itemCartItems.map((item) => `${item.name} (${item.price})`).join('\n')
            let patchesOrdered = patchCartItems.map((patch) => `${patch.name} (${patch.price})`).join('\n')

            let receiptMessage = `Order Details:
            Name: ${loggedIn.name}
            Ship location: ${shippingLocation}
            Order placed on: ${new Date().toDateString()}
            Items ordered:
            ${itemsOrdered}
            Patches ordered:
            ${patchesOrdered}
            Order total: ${total}`;

            const formInfo = {
                type: 'Receipt',
                name: loggedIn.name,
                email: loggedIn.email,
                body: receiptMessage,
            }

            emailjs.send(serviceId, templateId, formInfo, emailKey)
                .then((res) => {
                    console.log('res:', res);
                }, (error) => {
                    console.log('error:', error);
                });
        };

        fetch('http://localhost:8080/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: loggedIn.id,
                item_id: localStorage.getItem('itemCart'),
                patch_id: localStorage.getItem('patchCart'),
                location: shippingLocation,
                total: total
            })
        })
            .then(setShowModal(true))
    }

    const summary = () => {

        return (
            <div className='SummaryContainer w-full bg-gray-300 p-6'>
                <div className='PatchSummary pb-3 mt-3 grid grid-cols-2 gap-3 border-b border-[#222222]'>
                    {matchingPatches.map(patch => {
                        return (
                            <>
                                <p>Patch: {patch.name}</p>
                                <p>Price: {patch.price}</p>
                            </>
                        );
                    })}
                </div>
                <div className='ItemSummary pb-3 mt-3 grid grid-cols-2 gap-3 border-b border-[#222222]'>
                    {matchingItems.map(item => {
                        return (
                            <>
                                <p>Item: {item.name}</p>
                                <p>Price: {item.price}</p>
                            </>
                        );
                    })}
                </div>
                {displayTotals()}
            </div>
        );
    };

    const displayCheckout = () => {
        switch (activeStep) {
            case 0:
                return (
                    <form className="BillingAddress w-full bg-gray-300 rounded-md shadow p-7" onSubmit={(e) => { e.preventDefault(); setFormNotCompleted(false) }}>
                        <h1 className='CardInformationHeader text-[#45A29E] text-3xl font-semibold mb-10 text-center'>Billing/Shipping Information</h1>
                        <label className='StreetAddress text-[#222222]'>Street Address*</label>
                        <input name='StreetAddress' className='StreetAddress w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={street} required onChange={(e) => setStreet(e.target.value)} />
                        <label className='Apartment text-[#222222]'>Apartment #</label>
                        <input name='Apartment' className='Apartment w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={apartment} onChange={(e) => setApartment(e.target.value)} />
                        <label className='City text-[#222222]'>City*</label>
                        <input name='City' className='City w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={city} required onChange={(e) => setCity(e.target.value)} />
                        <label className='Country text-[#222222]'>Country*</label>
                        <select name="Country" className='Country w-full p-2 mb-4 bg-white rounded-md shadow mt-1' required onChange={(e) => handleCountry(e)}>
                            <option></option>
                            <option value="AF">Afghanistan</option>
                            <option value="AX">Åland Islands</option>
                            <option value="AL">Albania</option>
                            <option value="DZ">Algeria</option>
                            <option value="AS">American Samoa</option>
                            <option value="AD">Andorra</option>
                            <option value="AO">Angola</option>
                            <option value="AI">Anguilla</option>
                            <option value="AQ">Antarctica</option>
                            <option value="AG">Antigua &amp; Barbuda</option>
                            <option value="AR">Argentina</option>
                            <option value="AM">Armenia</option>
                            <option value="AW">Aruba</option>
                            <option value="AC">Ascension Island</option>
                            <option value="AU">Australia</option>
                            <option value="AT">Austria</option>
                            <option value="AZ">Azerbaijan</option>
                            <option value="BS">Bahamas</option>
                            <option value="BH">Bahrain</option>
                            <option value="BD">Bangladesh</option>
                            <option value="BB">Barbados</option>
                            <option value="BY">Belarus</option>
                            <option value="BE">Belgium</option>
                            <option value="BZ">Belize</option>
                            <option value="BJ">Benin</option>
                            <option value="BM">Bermuda</option>
                            <option value="BT">Bhutan</option>
                            <option value="BO">Bolivia</option>
                            <option value="BA">Bosnia &amp; Herzegovina</option>
                            <option value="BW">Botswana</option>
                            <option value="BV">Bouvet Island</option>
                            <option value="BR">Brazil</option>
                            <option value="IO">British Indian Ocean Territory</option>
                            <option value="VG">British Virgin Islands</option>
                            <option value="BN">Brunei</option>
                            <option value="BG">Bulgaria</option>
                            <option value="BF">Burkina Faso</option>
                            <option value="BI">Burundi</option>
                            <option value="KH">Cambodia</option>
                            <option value="CM">Cameroon</option>
                            <option value="CA">Canada</option>
                            <option value="CV">Cape Verde</option>
                            <option value="BQ">Caribbean Netherlands</option>
                            <option value="KY">Cayman Islands</option>
                            <option value="CF">Central African Republic</option>
                            <option value="TD">Chad</option>
                            <option value="CL">Chile</option>
                            <option value="CN">China</option>
                            <option value="CX">Christmas Island</option>
                            <option value="CC">Cocos (Keeling) Islands</option>
                            <option value="CO">Colombia</option>
                            <option value="KM">Comoros</option>
                            <option value="CG">Congo - Brazzaville</option>
                            <option value="CD">Congo - Kinshasa</option>
                            <option value="CK">Cook Islands</option>
                            <option value="CR">Costa Rica</option>
                            <option value="CI">Côte d’Ivoire</option>
                            <option value="HR">Croatia</option>
                            <option value="CW">Curaçao</option>
                            <option value="CY">Cyprus</option>
                            <option value="CZ">Czechia</option>
                            <option value="DK">Denmark</option>
                            <option value="DJ">Djibouti</option>
                            <option value="DM">Dominica</option>
                            <option value="DO">Dominican Republic</option>
                            <option value="EC">Ecuador</option>
                            <option value="EG">Egypt</option>
                            <option value="SV">El Salvador</option>
                            <option value="GQ">Equatorial Guinea</option>
                            <option value="ER">Eritrea</option>
                            <option value="EE">Estonia</option>
                            <option value="SZ">Eswatini</option>
                            <option value="ET">Ethiopia</option>
                            <option value="FK">Falkland Islands (Islas Malvinas)</option>
                            <option value="FO">Faroe Islands</option>
                            <option value="FJ">Fiji</option>
                            <option value="FI">Finland</option>
                            <option value="FR">France</option>
                            <option value="GF">French Guiana</option>
                            <option value="PF">French Polynesia</option>
                            <option value="TF">French Southern Territories</option>
                            <option value="GA">Gabon</option>
                            <option value="GM">Gambia</option>
                            <option value="GE">Georgia</option>
                            <option value="DE">Germany</option>
                            <option value="GH">Ghana</option>
                            <option value="GI">Gibraltar</option>
                            <option value="GR">Greece</option>
                            <option value="GL">Greenland</option>
                            <option value="GD">Grenada</option>
                            <option value="GP">Guadeloupe</option>
                            <option value="GU">Guam</option>
                            <option value="GT">Guatemala</option>
                            <option value="GG">Guernsey</option>
                            <option value="GN">Guinea</option>
                            <option value="GW">Guinea-Bissau</option>
                            <option value="GY">Guyana</option>
                            <option value="HT">Haiti</option>
                            <option value="HM">Heard &amp; McDonald Islands</option>
                            <option value="HN">Honduras</option>
                            <option value="HK">Hong Kong</option>
                            <option value="HU">Hungary</option>
                            <option value="IS">Iceland</option>
                            <option value="IN">India</option>
                            <option value="ID">Indonesia</option>
                            <option value="IR">Iran</option>
                            <option value="IQ">Iraq</option>
                            <option value="IE">Ireland</option>
                            <option value="IM">Isle of Man</option>
                            <option value="IL">Israel</option>
                            <option value="IT">Italy</option>
                            <option value="JM">Jamaica</option>
                            <option value="JP">Japan</option>
                            <option value="JE">Jersey</option>
                            <option value="JO">Jordan</option>
                            <option value="KZ">Kazakhstan</option>
                            <option value="KE">Kenya</option>
                            <option value="KI">Kiribati</option>
                            <option value="XK">Kosovo</option>
                            <option value="KW">Kuwait</option>
                            <option value="KG">Kyrgyzstan</option>
                            <option value="LA">Laos</option>
                            <option value="LV">Latvia</option>
                            <option value="LB">Lebanon</option>
                            <option value="LS">Lesotho</option>
                            <option value="LR">Liberia</option>
                            <option value="LY">Libya</option>
                            <option value="LI">Liechtenstein</option>
                            <option value="LT">Lithuania</option>
                            <option value="LU">Luxembourg</option>
                            <option value="MO">Macao</option>
                            <option value="MG">Madagascar</option>
                            <option value="MW">Malawi</option>
                            <option value="MY">Malaysia</option>
                            <option value="MV">Maldives</option>
                            <option value="ML">Mali</option>
                            <option value="MT">Malta</option>
                            <option value="MH">Marshall Islands</option>
                            <option value="MQ">Martinique</option>
                            <option value="MR">Mauritania</option>
                            <option value="MU">Mauritius</option>
                            <option value="YT">Mayotte</option>
                            <option value="MX">Mexico</option>
                            <option value="FM">Micronesia</option>
                            <option value="MD">Moldova</option>
                            <option value="MC">Monaco</option>
                            <option value="MN">Mongolia</option>
                            <option value="ME">Montenegro</option>
                            <option value="MS">Montserrat</option>
                            <option value="MA">Morocco</option>
                            <option value="MZ">Mozambique</option>
                            <option value="MM">Myanmar (Burma)</option>
                            <option value="NA">Namibia</option>
                            <option value="NR">Nauru</option>
                            <option value="NP">Nepal</option>
                            <option value="NL">Netherlands</option>
                            <option value="NC">New Caledonia</option>
                            <option value="NZ">New Zealand</option>
                            <option value="NI">Nicaragua</option>
                            <option value="NE">Niger</option>
                            <option value="NG">Nigeria</option>
                            <option value="NU">Niue</option>
                            <option value="NF">Norfolk Island</option>
                            <option value="KP">North Korea</option>
                            <option value="MK">North Macedonia</option>
                            <option value="MP">Northern Mariana Islands</option>
                            <option value="NO">Norway</option>
                            <option value="OM">Oman</option>
                            <option value="PK">Pakistan</option>
                            <option value="PW">Palau</option>
                            <option value="PS">Palestine</option>
                            <option value="PA">Panama</option>
                            <option value="PG">Papua New Guinea</option>
                            <option value="PY">Paraguay</option>
                            <option value="PE">Peru</option>
                            <option value="PH">Philippines</option>
                            <option value="PN">Pitcairn Islands</option>
                            <option value="PL">Poland</option>
                            <option value="PT">Portugal</option>
                            <option value="PR">Puerto Rico</option>
                            <option value="QA">Qatar</option>
                            <option value="RE">Réunion</option>
                            <option value="RO">Romania</option>
                            <option value="RU">Russia</option>
                            <option value="RW">Rwanda</option>
                            <option value="WS">Samoa</option>
                            <option value="SM">San Marino</option>
                            <option value="ST">São Tomé &amp; Príncipe</option>
                            <option value="SA">Saudi Arabia</option>
                            <option value="SN">Senegal</option>
                            <option value="RS">Serbia</option>
                            <option value="SC">Seychelles</option>
                            <option value="SL">Sierra Leone</option>
                            <option value="SG">Singapore</option>
                            <option value="SX">Sint Maarten</option>
                            <option value="SK">Slovakia</option>
                            <option value="SI">Slovenia</option>
                            <option value="SB">Solomon Islands</option>
                            <option value="SO">Somalia</option>
                            <option value="ZA">South Africa</option>
                            <option value="GS">South Georgia &amp; South Sandwich Islands</option>
                            <option value="KR">South Korea</option>
                            <option value="SS">South Sudan</option>
                            <option value="ES">Spain</option>
                            <option value="LK">Sri Lanka</option>
                            <option value="BL">St Barthélemy</option>
                            <option value="SH">St Helena</option>
                            <option value="KN">St Kitts &amp; Nevis</option>
                            <option value="LC">St Lucia</option>
                            <option value="MF">St Martin</option>
                            <option value="PM">St Pierre &amp; Miquelon</option>
                            <option value="VC">St Vincent &amp; Grenadines</option>
                            <option value="SR">Suriname</option>
                            <option value="SJ">Svalbard &amp; Jan Mayen</option>
                            <option value="SE">Sweden</option>
                            <option value="CH">Switzerland</option>
                            <option value="TW">Taiwan</option>
                            <option value="TJ">Tajikistan</option>
                            <option value="TZ">Tanzania</option>
                            <option value="TH">Thailand</option>
                            <option value="TL">Timor-Leste</option>
                            <option value="TG">Togo</option>
                            <option value="TK">Tokelau</option>
                            <option value="TO">Tonga</option>
                            <option value="TT">Trinidad &amp; Tobago</option>
                            <option value="TA">Tristan da Cunha</option>
                            <option value="TN">Tunisia</option>
                            <option value="TR">Turkey</option>
                            <option value="TM">Turkmenistan</option>
                            <option value="TC">Turks &amp; Caicos Islands</option>
                            <option value="TV">Tuvalu</option>
                            <option value="UG">Uganda</option>
                            <option value="UA">Ukraine</option>
                            <option value="AE">United Arab Emirates</option>
                            <option value="GB">United Kingdom</option>
                            <option value="US">United States</option>
                            <option value="UY">Uruguay</option>
                            <option value="UM">US Outlying Islands</option>
                            <option value="VI">US Virgin Islands</option>
                            <option value="UZ">Uzbekistan</option>
                            <option value="VU">Vanuatu</option>
                            <option value="VA">Vatican City</option>
                            <option value="VE">Venezuela</option>
                            <option value="VN">Vietnam</option>
                            <option value="WF">Wallis &amp; Futuna</option>
                            <option value="EH">Western Sahara</option>
                            <option value="YE">Yemen</option>
                            <option value="ZM">Zambia</option>
                            <option value="ZW">Zimbabwe</option>
                        </select>
                        {
                            hiddenState ?
                                <>
                                    <label className='ZipCode text-[#222222]'>Zip or Postcode*</label>
                                    <input name='ZipCode' className='ZipCode w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={zip} required onChange={(e) => setZip(e.target.value)} />
                                </>
                                :
                                <>
                                    <label className='State text-[#222222]'>State or Province*</label>
                                    <input name='State' className='State w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={state} required onChange={(e) => setState(e.target.value)} />
                                    <label className='ZipCode text-[#222222]'>Zip or Postcode*</label>
                                    <input name='ZipCode' className='ZipCode w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={zip} required onChange={(e) => setZip(e.target.value)} />
                                </>
                        }
                        <ShipTo setLocation={setLocation} />
                        <div className="mt-16 flex justify-between">
                            <Button className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105' onClick={handlePrev} disabled={isFirstStep}>
                                Prev
                            </Button>
                            <Link to='../cart'>
                                <Button className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105'>Return to Cart</Button>
                            </Link>
                            <Button type='submit' className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105'>Confirm</Button>
                            <Button className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105' onClick={() => { setFormNotCompleted(true); handleNext() }} disabled={formNotCompleted || isLastStep}>
                                Next
                            </Button>
                        </div>
                    </form>
                );
            case 1:
                return (
                    <form className="CardInformation w-1/2 m-auto bg-gray-300 rounded-md shadow p-7" onSubmit={(e) => { e.preventDefault(); setFormNotCompleted(false) }}>
                        <h1 className='CardInformationHeader text-[#45A29E] text-3xl font-semibold mb-10 text-center'>Card Information</h1>
                        <h1 className='AcceptedCards text-[#45A29E] text-1x1 font-semibold mb-10 text-left'>Accepted Card Types</h1>
                        {cardTypeProcessing()}
                        <label className='CardNumber text-[#222222]'>Card Number*</label>
                        <input name='cardNumber' className='CardNumber w-full p-2 mb-4 bg-white rounded-md shadow mt-1' type='number' value={cardNumber} required onChange={(e) => setCardNumber(e.target.value)} />
                        <label className='CardName text-[#222222]'>Full Name*</label>
                        <input name='cardName' className='CardName w-full p-2 mb-4 bg-white rounded-md shadow mt-1' value={cardName} required onChange={(e) => setCardName(e.target.value)} />
                        <label className='ExpirationDate text-[#222222]'>Expiration*</label>
                        <input name='cardExpiration' className='CardExpiration w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder="MM/YY" value={expiration} maxLength={5} required onChange={(e) => handleExpiration(e)} />
                        <label className='CardCVC text-[#222222]'>CVC*</label>
                        <input name='cardCVC' className='CardCVC w-full p-2 mb-4 bg-white rounded-md shadow mt-1' placeholder="CVC" value={cvc} maxLength="4" required onChange={(e) => {
                            let { value } = e.target;
                            value = value.replace(/\D/g, "");
                            setCvc(value);
                        }} />
                        <div className="mt-16 flex justify-between">
                            <Button className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105' onClick={handlePrev} disabled={isFirstStep}>
                                Prev
                            </Button>
                            <Link to='../cart'>
                                <Button className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105'>Return to Cart</Button>
                            </Link>
                            <Button type='submit' className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105'>Confirm</Button>
                            <Button className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105' onClick={() => { handleNext(); setFormNotCompleted(true) }} disabled={isLastStep || formNotCompleted}>
                                Next
                            </Button>
                        </div>
                    </form>
                );
            case 2:
                return (
                    <div className='FinalizePayment w-1/2 m-auto bg-gray-300 rounded-md shadow p-7'>
                        <div className='SummaryContainer'>
                            <p className='px-6 py-2'>{loggedIn.name}</p>
                            <p className='px-6'>Order Location: {shippingLocation}</p>
                            {summary()}
                        </div>
                        <div className="mt-16 flex justify-between">
                            <Button className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105' onClick={handlePrev} disabled={isFirstStep}>
                                Prev
                            </Button>
                            <Link to='../cart'>
                                <Button className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105' >Return to Cart</Button>
                            </Link>
                            <form onSubmit={(e)=>{e.preventDefault(); generateOrder()}}>
                                <Button type='submit' className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105'>Place Order</Button>
                                <label className='mx-1'>Receipt?</label>
                                <input type='checkbox' className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105' defaultChecked onClick={() => {setReceipt(!receipt)}} />
                            </form>
                            <Button className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105' onClick={handleNext} disabled={isLastStep}>
                                Next
                            </Button>
                        </div>
                    </div>
                );
            default:
                console.log('Whoopsie, something is definitely not working right');
        };
    };

    return (
        <>
            <div className="mt-20 mb-20 flex justify-between mx-4 md:mx-8 lg:mx-16 my-4 gap-3">
                <Stepper
                    activeStep={activeStep}
                    isLastStep={(value) => setIsLastStep(value)}
                    isFirstStep={(value) => setIsFirstStep(value)}
                    lineClassName="bg-gray-500"
                    activeLineClassName="bg-[#68D391]"
                >
                    <Step className='bg-gray-500' activeClassName="bg-[#68D391]" completedClassName="bg-[#68D391]">
                        <HomeIcon className="h-5 w-5" />
                    </Step>
                    <Step className='bg-gray-500' activeClassName="bg-[#68D391]" completedClassName="bg-[#68D391]">
                        <CurrencyDollarIcon className="h-5 w-5" />
                    </Step>
                    <Step className='bg-gray-500' activeClassName="bg-[#68D391]" completedClassName="bg-[#68D391]">
                        <CheckIcon className="h-5 w-5" />
                    </Step>
                </Stepper>
            </div>
            <div className='CheckoutContainer mt-14 mb-20 justify-between mx-4 md:mx-8 lg:mx-16 my-4 gap-3'>
                <div className='CheckoutInformation flex flex-col md:flex-row justify-between mx-4 md:mx-8 lg:mx-16 gap-5'>
                    {displayCheckout()}
                    <ConfirmationModal message={`Order Successful!`} show={showModal} handleClose={clearTheCart} />
                </div >
            </div>
        </>
    );
};

export default Checkout;
