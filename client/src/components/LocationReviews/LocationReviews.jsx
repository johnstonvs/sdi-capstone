import React, { useState, useContext, useEffect } from 'react'
import { LoggedInContext } from '../../App'
import { FaStar, FaStarHalf } from 'react-icons/fa';

const LocationReviews = ({ selectedAttic, reviewAdded }) => {
  const [reviews, setReviews] = useState([])
  const [sortOrder, setSortOrder] = useState("newest")
  const { loggedIn } = useContext(LoggedInContext)

  const postCommment = (reviewId, content) => {
    fetch('http://localhost:8080/comments', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({comment: content,
        user_id: loggedIn.id,
        review_id: reviewId})
    })
    .then(res => res.json())
    .then(() => fetchReviewsWithComments())
    .catch(err => console.log(err))
  }

  const parseDate = (date) => {
    const createdDate = new Date(date)
    const year = createdDate.getFullYear()
    const month = createdDate.getMonth() + 1
    const day = createdDate.getDate()

    const formattedDate = `${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}-${year}`

    return formattedDate
  }

  const fetchReviewsWithComments = () => {

    if (selectedAttic) {
      fetch(`http://localhost:8080/attic_reviews/${selectedAttic.id}`)
      .then(res => res.json())
      .then(async data => {
        const reviewsWithComments = await Promise.all(data.map(async review => {
          const res = await fetch(`http://localhost:8080/comments?review_id=${review.id}`);
          const comments = await res.json();
          return {...review, comments};
        }));

    if(sortOrder === "newest") {
      reviewsWithComments.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (sortOrder === "oldest") {
      reviewsWithComments.sort((a,b) => new Date(a.created_at) - new Date(b.created_at))
    } else if (sortOrder === "stars") {
      reviewsWithComments.sort((a,b) => b.stars - a.stars)
    }
        setReviews(reviewsWithComments);
      })
      .catch(err => console.log(err))
    }
  }

  useEffect(() => {
    fetchReviewsWithComments()
  }, [reviewAdded]);


  useEffect(() => {
    const sortedReviews = [...reviews]
    if(sortOrder === "newest") {
      sortedReviews.sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
    } else if (sortOrder === "oldest") {
      sortedReviews.sort((a,b) => new Date(a.created_at) - new Date(b.created_at))
    } else if (sortOrder === "stars") {
      sortedReviews.sort((a,b) => b.stars - a.stars)
    }
    setReviews(sortedReviews)
  }, [sortOrder])

  return (
    <>
    {reviews.length > 0 ? (
      <div className='FeedContainer gap-8 p-6 mt-4 justify-center items-center w-2/3'>
      <h1 className='FeedHeader text-[#2D2D2D] text-3xl font-semibold bg-[#FFD700] rounded-t-xl shadow-lg text-center p-4 w-1/5 ml-4'>Reviews:</h1>
      <div className='text-[#2D2D2D] font-semibold bg-[#FFD700] rounded-b-xl shadow-lg text-center p-2 w-1/5 ml-4'>
        <label>Sort By: </label>
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
        <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="stars">Highest Rating</option>
        </select>
      </div>
        {reviews.map(review => (
            <div key={review.id} className='PostContainer flex flex-col m-4 p-4 bg-[#F5DEB3] rounded-xl shadow-lg'>
                <p className='PostBody text-[#222222] mb-10 font-semibold'>{review.name}</p>
                <div className='flex flex-row space-x-10'>
                <div className="flex justify-center bg-neutral-400 p-1 h-9 rounded-xl shadow-lg">
                      {[...Array(5)].map((_, i=1) => (
                          <div
                              key={i}
                              className={ "cursor-pointer " + ((review.stars) > i ? 'text-yellow-300' : 'text-white') }
                          >
                              <FaStar size={25} />
                          </div>
                      ))}
                  </div>
                <p className='PostBody text-[#222222] mb-10 p-1'>{review.body}</p>
                </div>
                <h2 className='CommentsHeader text-[#2D2D2D] text-xl font-semibold mb-2'>Comments</h2>
                {review.comments && review.comments.map(comment => (
                  <div className='CommentCard bg-white shadow-xl rounded-xl mb-4 p-3'>
                    <p className='PostDate text-[#222222]'>{comment.name} on {parseDate(comment.created_at)}</p>
                    <p key={comment.id} className='Comments text-[#222222] mb-2'>{comment.comment}</p>
                  </div>
                ))}
                {loggedIn.isLoggedIn ? (
                  <div className='flex flex-row items-center gap-5'>
                    <input
                      type='text'
                      className='CommentInput w-1/5 p-2 mb-4 bg-white rounded-md shadow mt-4 transition-all focus:w-full focus:outline-none focus:ring-2 focus:ring-[#2D2D2D]'
                      placeholder='Add a comment...'
                      onKeyDown={event => {
                        if (event.key === 'Enter') {
                            postCommment(review.id, event.target.value);
                            event.target.value = '';
                        }
                    }}
                  />
                </div>) : null}
                <p className='PostDate text-[#222222] text-left'>Review Created: {parseDate(review.created_at)}</p>
            </div>
        ))}
    </div>
    ) : null}
    </>
);

}

export default LocationReviews