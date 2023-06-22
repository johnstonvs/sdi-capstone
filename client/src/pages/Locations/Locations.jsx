import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom'
import { RatingForm, LocationFeed, LocationReviews } from '../../components/index'
import { LoggedInContext } from '../../App'
import { FaStar, FaStarHalf } from 'react-icons/fa';

const Locations = () => {
  const [attics, setAttics] = useState([])
  const [selectedAttic, setSelectedAttic] = useState()
  const [filteredAttics, setFilteredAttics] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [searchTyped, setSearchTyped] = useState(false)
  const [reviews, setReviews] = useState()
  const [filteredReviews, setFilteredReviews] = useState()
  const [starAverage, setStarAverage] = useState()
  const { loggedIn } = useContext(LoggedInContext)
  const [view, setView] = useState('feed');

  let location = useLocation()

  const toggleView = () => {
    if (view === 'reviews') {
        setView('feed');
    } else {
        setView('reviews');
    }
  };

  const fetchAttics = () => {
    fetch('http://localhost:8080/attics')
    .then(res => res.json())
    .then(data => setAttics(data))
    .catch(err => console.log(err))
  }

  const searchBarChange = (e) => {
    setSearchTerm(e.target.value)

    if (e.target.value !== '') {
      setSearchTyped(true)
    } else {
      setSearchTyped(false)
    }
  }

  const selectChange = async (e) => {
    const selectedAtticLocation = e.target.value;
    const selectedAttic = attics.find(attic => attic.location === selectedAtticLocation);
    setSelectedAttic(selectedAttic)
  }

  const fetchAtticReviews = () => {
    fetch(`http://localhost:8080/attic_reviews`)
      .then(res => res.json())
      .then(data => setReviews(data))
      .catch(err => console.log(err))
  }

  useEffect(() => {
    fetchAttics()
    fetchAtticReviews()
  },[])

  useEffect(() => {
    if (reviews && selectedAttic) {
      const newFilteredReviews = reviews.filter(review => review.attic_id === selectedAttic.id);
      setFilteredReviews(newFilteredReviews);
    }
  }, [selectedAttic, reviews]);

  useEffect(() => {
    if (filteredReviews) {
      const totalStars = filteredReviews.reduce((total, review) => total + review.stars, 0);
      setStarAverage(totalStars / filteredReviews.length);
    }
  }, [filteredReviews]);

  useEffect(() => {
    setSelectedAttic('')
    setSearchTerm('')
    setSearchTyped(false)
  },[location])

  useEffect(() => {
    setFilteredAttics(
      attics.filter((attic) =>
        attic.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm, attics])

  return (
    <div className='LocationsContainer gap-8 p-4 mt-4 rounded shadow-inner flex flex-col justify-center items-center'>
      {selectedAttic ? (
        <>
        <div className='LocationAbout flex flex-col p-4 mb-10 w-1/3 bg-gray-300 rounded-md shadow'>
          <h1 className='LocationHeader text-[#45A29E] text-3xl font-semibold mb-10 text-center'>{selectedAttic.location}</h1>
          <div className='LocationContactContainer text-[#222222] text-left mb-5'>
            <div className="flex justify-center p-1 rounded mb-10">
                        {[...Array(5)].map((_, i=1) => (
                            <div
                                key={i}
                                className={ "cursor-pointer " + ((starAverage) > i ? 'text-yellow-300' : 'text-white') }
                            >
                                <FaStar  className='transform -scale-x-100 mr-1 hover:scale-105' size={25} />
                            </div>
                        ))}
                        <p className='ml-2'>{filteredReviews ? `(${filteredReviews.length})` : null}</p>
            </div>
            <img className='w-96 h-96 mb-10 m-auto' src={selectedAttic.picture_url} alt='AtticImage'/>
            <h2 className='LocationHeader text-[#222222] mb-2'><span className='font-semibold'>Hours of operation: </span>{selectedAttic.hours}</h2>
            <p className='LocationPhone mb-2'><span className='font-semibold'>Phone #: </span>{selectedAttic.phone}</p>
            <p className='LocationEmail mb-2'><span className='font-semibold'>Email: </span>{selectedAttic.email}</p>
            <p className='LocationAddress mb-4'><span className='font-semibold'>Address: </span>{selectedAttic.address}</p>
          </div>
          <p className='LocationContent font-semibold'>About:</p>
          <p className='LocationContent mb-10'>{selectedAttic.about}</p>
          <button className='BackButton bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] w-1/4 text-center hover:scale-105' onClick={()=> {
            setSelectedAttic('');
            setSearchTerm('');
            setSearchTyped(false);
          }}>Back</button>
        </div>

        <div className="relative inline-block w-10 ml-2 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" name="toggle" id="toggle" onChange={toggleView} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer transition-all"/>
          <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
        </div>
        <div className="ml-3 text-[#45A29E] text-3xl font-semibold">
          {view === 'reviews' ? 'Reviews' : 'Feed'}
        </div>

          {view === 'reviews' && <LocationReviews selectedAttic={selectedAttic} />}
          {view === 'feed' && <LocationFeed selectedAttic={selectedAttic} />}
          {loggedIn.isLoggedIn ? <RatingForm selectedAttic={selectedAttic} /> : null}

        </>
      ) : (
      <div className='LocationsSearchContainer bg-gray-300 flex flex-col items-center justify-center m-4 p-4 rounded-md'>
        <h1 className='text-[#45A29E] text-3xl font-semibold bg-gray-300 rounded-md text-center p-4 ml-4 mb-10'>Search for a location!</h1>
        <h1 className='text-[#45A29E] text-2xl font-semibold bg-gray-300 rounded-md text-center p-4 ml-4'>Just looking around?</h1>
        <div className='LocationsDropDownContainer mb-4'>
          {attics ? (
             <select className='LocationsDropDown w-full p-2 mb-4 bg-white rounded-md shadow mt-1' onChange={selectChange}>
                <option className='AtticOption'></option>
                {attics.map((attic) => {
                  return (
                  <option className='AtticOption' value={attic.location}>{attic.location}</option>
                  )
                })}
             </select>
             ) : (
             <p className='text-[#222222]'>There are no avalible attics to view... Try again later...</p>
             )}
        </div>
        <div className='border-b-2 border-gray-400 w-full m-5'></div>
        <h1 className='text-[#45A29E] text-2xl font-semibold bg-gray-300 rounded-md text-center p-4 ml-4'>Know what you're looking for?</h1>
        <div className='LocationsSearchBarContainer'>
        <input className='LocationsSearchBar w-full p-2 mb-4 bg-white rounded-md shadow mt-1'
                 placeholder='Enter a base...'
                 value={searchTerm}
                 onChange={searchBarChange} />
          {searchTyped ? (
            filteredAttics.map((attic) => {
            return <p className='SearchResult bg-white cursor-pointer p-2 shadow' onClick={() => {setSelectedAttic(attic); fetchAtticReviews()}}>{attic.location}</p>
          })
          ) : null}
        </div>
      </div>)}
    </div>
)

}

export default Locations;