import { useState, useEffect } from 'react';
import { StarRating } from '../index'

const RatingForm = () => {
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
  };

  return (
      <form className='RatingForm w-96 bg-gray-300 flex flex-col items-center justify-center p-4 rounded shadow-inner'>
        <h1 className='RatingFormHeader text-[#45A29E] text-3xl font-semibold mb-10'>Write a Review</h1>
        <StarRating onRate={onRate}/>
        <textarea className='RatingInput w-full p-2 mt-12 mb-10 h-32 bg-white rounded-md shadow' placeholder='Tell us about your experience with this store...'/>
        <button
                className="LoginButton bg-[#2ACA90] text-white p-2 rounded hover:bg-[#5DD3CB] hover:scale-105"
                type='submit'
              >
                Submit
              </button>
      </form>
  )
}

export default RatingForm;