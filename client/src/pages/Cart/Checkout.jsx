import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import amex from "../../assets/amex.png";
import discover from "../../assets/discover.png";
import visa from "../../assets/visa.png";
import "./Checkout.css"
import { ShipTo } from '../../components/index'
import { ConfirmationModal } from '../../components/index'

const Checkout = ({ matchingPatches, matchingItems, displayTotals }) => {

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
    const [hiddenState, setHiddenState] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const nav = useNavigate();

    const [shippingLocation, setShippingLocation] = useState()

    const setLocation = location => {
        setShippingLocation(location)
    }

    const cardTypeProcessing = () => {
        //American Express
        if ((cardNumber.slice(0, 2) === '34' || cardNumber.slice(0, 2) === '37') && (cardNumber.length === 15)) {
            return (
                <>
                    <img
                        className="AmexImage h-12"
                        src={amex}
                        alt="American Express Logo"
                    />
                    <img
                        className="DiscoverImage grayscale h-12"
                        src={discover}
                        alt="Discover Logo"
                    />
                    <img
                        className="VisaImage grayscale h-12"
                        src={visa}
                        alt="Visa Logo"
                    />
                </>
            )
            //Visa
        } else if ((cardNumber.slice(0, 1) === '4') && (cardNumber.length === 13 || cardNumber.length === 16)) {
            return (
                <>
                    <img
                        className="AmexImage grayscale h-12"
                        src={amex}
                        alt="American Express Logo"
                    />
                    <img
                        className="DiscoverImage grayscale h-12"
                        src={discover}
                        alt="Discover Logo"
                    />
                    <img
                        className="VisaImage h-12"
                        src={visa}
                        alt="Visa Logo"
                    />
                </>
            )
            //Discover
        } else if (((cardNumber.slice(0, 4) === '6011') && cardNumber.length === 16) || ((cardNumber.slice(0, 1) === '5') && cardNumber.length === 15)) {
            return (
                <>
                    <img
                        className="AmexImage grayscale h-12"
                        src={amex}
                        alt="American Express Logo"
                    />
                    <img
                        className="DiscoverImage h-12"
                        src={discover}
                        alt="Discover Logo"
                    />
                    <img
                        className="VisaImage grayscale h-12"
                        src={visa}
                        alt="Visa Logo"
                    />
                </>
            )
            //Pressumably no card is entered yet
        } else {
            return (
                <>
                    <img
                        className="AmexImage h-12"
                        src={amex}
                        alt="American Express Logo"
                    />
                    <img
                        className="DiscoverImage h-12"
                        src={discover}
                        alt="Discover Logo"
                    />
                    <img
                        className="VisaImage h-12"
                        src={visa}
                        alt="Visa Logo"
                    />
                </>
            )
        }
    }

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
    }

    const handleCountry = (e) => {
        setCountry(e.target.value)
        //United States, Canada, and Puerto Rico
        if(e.target.value === 'US' || e.target.value === 'CA' || e.target.value === 'PR'){
            setHiddenState(false);
        } else {
            setHiddenState(true);
        }
    }

    const clearTheCart = () => {
        localStorage.removeItem("patchCart");
        localStorage.removeItem("itemCart");
        nav('/')
      };

    return (
        <div className='CheckoutContainer mt-28 mb-20'>
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
                {displayTotals()}
            </div>
            <div className='CardInfo'>
                <form className='CheckoutInformation bg-gray-300 flex flex-col justify-center p-4 rounded shadow-inner w-96' onSubmit={(e) => {e.preventDefault(); setShowModal(true)}}>
                    {/* Display the billing information in middle next to itemized view */}
                    <div className="BillingAddress">
                        <h1 className='CardInformationHeader text-[#45A29E] text-3xl font-semibold mb-10 text-center'>Billing Information</h1>
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
                        {hiddenState ?
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
                        <ShipTo setLocation={ setLocation } />
                    </div>
                    {/* Display the Card information on the right next to billing information */}
                    <div className="CardInformation">
                        <h1 className='CardInformationHeader text-[#45A29E] text-3xl font-semibold mb-10 text-center'>Card Information</h1>
                        {cardTypeProcessing() /* Display these in a column side-by-side-view */}
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
                    </div>
                    <input type="submit" className='bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] text-center hover:scale-105'/>
                </form>
            </div>
            <ConfirmationModal message={`Your items will be shipped out to ${shippingLocation}`} show={showModal} handleClose={clearTheCart}/>
        </div>
    );
};

export default Checkout;