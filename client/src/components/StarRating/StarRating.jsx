import { useState, useEffect, useContext } from 'react';
import { FaStar, FaStarHalf } from 'react-icons/fa';
import { RatingContext } from '../RatingForm/RatingForm'

const StarRating = ({ onRate }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const {rating, setRating} = useContext(RatingContext);

  const onMouseEnter = (ratingValue) => {
    setHoverRating(ratingValue);
};

const onMouseLeave = () => {
    setHoverRating(0);
};

const onClick = (ratingValue) => {
    setRating(ratingValue);
    if (onRate) {
        onRate(ratingValue);
    }
};

return (
    <div className="flex justify-center bg-gray-400 p-1 rounded-xl shadow-lg">
        {[...Array(5)].map((_, i=1) => (
            <div
                key={i}
                className={ "cursor-pointer " + ((rating || hoverRating) > i ? 'text-yellow-300' : 'text-white') }
                onMouseEnter={() => onMouseEnter(i + 1)}
                onMouseLeave={onMouseLeave}
                onClick={() => onClick(i + 1)}
            >
                <FaStar  className='transform -scale-x-100 mr-1 hover:scale-105 transition duration-200 ease-in-out' size={35} />
            </div>
        ))}
    </div>
);
};
export default StarRating
