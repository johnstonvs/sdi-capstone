import { useState, useEffect, useContext, createContext } from 'react';
import { StarRating, ConfirmationModal } from '../index'
import { LoggedInContext } from '../../App'

export const RatingContext = createContext()

const RatingForm = ({ selectedAttic }) => {
  const [rating, setRating] = useState()
  const { loggedIn } = useContext(LoggedInContext)
  const [reviewContent, setReviewContent] = useState()
  const [showModal, setShowModal] = useState(false);
  const [review, setReview] = useState({
    "body": "",
    "stars": 0,
    "user_id": 0,
    "attic_id": 0
  })

  const onRate = (ratingValue) => {
    setReview({ ...review, stars: ratingValue})
  }

  const handleInputChange = (e) => {
    setReview({ ...review, body: e.target.value})
    setReviewContent(e.target.value)
  };

  const postRating = (e) => {
    e.preventDefault()
    fetch('http://localhost:8080/attic_reviews', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({body: review.body,
        stars: review.stars,
        user_id: loggedIn.id,
        attic_id: selectedAttic.id})
    })
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
    setReviewContent('')
    setRating(0)
    setShowModal(true);
  }

  return (
    <div>
      <form className='RatingForm w-96 bg-gray-300 flex flex-col items-center justify-center p-4 rounded shadow-inner' onSubmit={postRating}>
        <h1 className='RatingFormHeader text-[#45A29E] text-3xl font-semibold mb-10'>Write a Review</h1>
        <RatingContext.Provider value={ { rating, setRating } } >
        <StarRating onRate={onRate}/>
        </ RatingContext.Provider>
        <textarea className='RatingInput w-full p-2 mt-12 mb-10 h-32 bg-white rounded-md shadow' placeholder='Tell us about your experience with this store...' onChange={handleInputChange} value={reviewContent}/>
        <button
                className="LoginButton bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] hover:scale-105"
                type='submit'
              >
                Submit
              </button>
      </form>
      <ConfirmationModal
          message="You have successfully submitted a review!"
          show={showModal}
          handleClose={() => {
            window.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
            setShowModal(false)
          }}
        />
    </div>
  )
}

export default RatingForm;