import { useState, useEffect, useContext } from 'react';
import { useLocation } from 'react-router-dom'
import { RatingForm, LocationFeed, LocationReviews, Loader } from '../../components/index'
import { LoggedInContext, LoadingContext } from '../../App'
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
  const [reviewAdded, setReviewAdded] = useState(false);
  const { loading, setLoading } = useContext(LoadingContext);

  let location = useLocation()

  const toggleView = (newView) => {
    setView(newView);
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
      .then(data => {
        setLoading(false)
        setReviews(data)
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    setLoading(true)
    fetchAttics()
    fetchAtticReviews()
  }, [])

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
  }, [location])

  useEffect(() => {
    setFilteredAttics(
      attics.filter((attic) =>
        attic.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  }, [searchTerm, attics])

  useEffect(() => {
    fetchAtticReviews()
  }, [reviewAdded])

  return (
    loading ? (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    ) : (
      <div className='LocationsContainer gap-8 p-6 mt-28 mb-20 flex flex-col justify-center items-center'>
        {selectedAttic ? (
          <>
            <div className='LocationAbout flex flex-col p-6 mb-10 w-1/3 bg-gray-300 rounded-xl shadow-lg'>
              <h1 className='LocationHeader text-[#45A29E] text-3xl font-semibold mb-6 text-center'>{selectedAttic.location}</h1>
              <div className='LocationContactContainer text-[#222222] text-left mb-2'>
                <div className='flex flex-row justify-center mb-10'>
                  <div className="flex justify-center bg-gray-400 p-1 rounded-xl shadow-lg">
                    {[...Array(5)].map((_, i = 1) => (
                      <div
                        key={i}
                        className={((starAverage) > i ? 'text-yellow-300' : 'text-white')}
                      >
                        <FaStar size={25} />
                      </div>
                    ))}
                  </div>
                  <p className='ml-2'>{filteredReviews ? `${filteredReviews.length} review(s)` : null}</p>
                </div>
                <img className='w-82 h-82 mb-10 m-auto rounded-lg object-cover rounded-lg shadow-lg' src={selectedAttic.picture_url} alt='AtticImage' />
                <h2 className='LocationHeader text-[#222222] mb-2'><span className='font-semibold'>Hours of operation: </span>{selectedAttic.hours}</h2>
                <p className='LocationPhone mb-2'><span className='font-semibold'>Phone #: </span>{selectedAttic.phone}</p>
                <p className='LocationEmail mb-2'><span className='font-semibold'>Email: </span>{selectedAttic.email}</p>
                <p className='LocationAddress mb-4'><span className='font-semibold'>Address: </span>{selectedAttic.address}</p>
              </div>
              <p className='LocationContent font-semibold'>About:</p>
              <p className='LocationContent mb-10'>{selectedAttic.about}</p>
              <button className='BackButton bg-[#FF3300] text-white p-2 rounded-lg hover:bg-[#FF9980] w-1/4 text-center hover:scale-105 transition duration-200 ease-in-out' onClick={() => {
                setSelectedAttic('');
                setSearchTerm('');
                setSearchTyped(false);
              }}>Back</button>
            </div>

            <div className="relative inline-block w-10 ml-2 align-middle select-none transition duration-200 ease-in">
            </div>
            <div className="flex flex-row space-x-12">
              <button className={`WishlistButton bg-${view === 'feed' ? '[#0088D0]' : 'gray-300'} p-2 rounded-lg font-semibold text-2xl ${view !== 'feed' ? 'hover:bg-[#90E0EF]' : null} h-fit w-64`} onClick={() => toggleView('feed')}>Feed</button>
              <button className={`WishlistButton bg-${view === 'reviews' ? '[#FFD700]' : 'gray-300'} p-2 rounded-lg font-semibold text-2xl ${view !== 'reviews' ? 'hover:bg-[#F5DEB3]' : null} h-fit w-64`} onClick={() => toggleView('reviews')}>Reviews</button>
            </div>

            {view === 'reviews' && <LocationReviews reviewAdded={reviewAdded} selectedAttic={selectedAttic} />}
            {view === 'feed' && <LocationFeed selectedAttic={selectedAttic} />}
            {loggedIn.isLoggedIn ? <RatingForm setReviewAdded={setReviewAdded} selectedAttic={selectedAttic} /> : null}
          </>
        ) : (
          <div className='LocationsSearchContainer bg-gray-300 flex flex-col items-center justify-center m-6 p-6 rounded-xl shadow-lg'>
            <h1 className='text-[#45A29E] text-3xl font-semibold bg-gray-300 rounded-md text-center p-4 ml-4 mb-10'>Search for a location!</h1>
            <h1 className='text-[#222222] text-xl font-semibold bg-gray-300 rounded-md text-center p-4 ml-4'>Just looking around?</h1>
            <div className='LocationsDropDownContainer mb-4'>
              {attics ? (
                <select className='LocationsDropDown w-full p-2 mb-4 bg-white rounded-md shadow mt-1 text-[#222222]' onChange={selectChange}>
                  <option className='AtticOption'></option>
                  {attics.map((attic, index) => {
                    return (
                      <option
                        key={index}
                        className='AtticOption text-[#222222] hover:text-[#5DD3CB] transition-colors duration-200'
                        value={attic.location}
                      >
                        {attic.location}
                      </option>
                    )
                  })}
                </select>

              ) : (
                <p className='text-[#222222]'>There are no avalible attics to view... Try again later...</p>
              )}
            </div>
            <div className='border-b-2 border-gray-400 w-full m-5'></div>
            <h1 className='text-[#222222] text-xl font-semibold bg-gray-300 rounded-md text-center p-4 ml-4'>Know what you're looking for?</h1>
            <div className='LocationsSearchBarContainer'>
              <input className='LocationsSearchBar w-full p-2 bg-white rounded-md shadow mt-1'
                placeholder='Enter a base...'
                value={searchTerm}
                onChange={searchBarChange} />
                {searchTyped ? (
                  <div className='overflow-x-scroll max-h-52 bg-gray-300'>
                  {filteredAttics.map((attic, index) => {
                    return <p key={index} className='SearchResult bg-white cursor-pointer p-2 shadow hover:bg-gray-200 transition duration-200 ease-in-out' onClick={() => { setSelectedAttic(attic); fetchAtticReviews() }}>{attic.location}</p>
                  })}
                  </div>
                ) : null}
            </div>
          </div>)}
      </div>
    )

  )

}

export default Locations;