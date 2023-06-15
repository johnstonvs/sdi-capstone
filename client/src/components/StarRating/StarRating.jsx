import { useState, useEffect } from 'react';
import { FaStar, FaStarHalf } from 'react-icons/fa';

const StarRating = ({ onRate }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(0);

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
    <div className="flex justify-center">
        {[...Array(5)].map((_, i=1) => (
            <div
                key={i}
                className={ "cursor-pointer " + ((rating || hoverRating) > i ? 'text-yellow-500' : 'text-gray-300') }
                onMouseEnter={() => onMouseEnter(i + 1)}
                onMouseLeave={onMouseLeave}
                onClick={() => onClick(i + 1)}
            >
                <FaStar  className='transform -scale-x-100 mr-1 hover:scale-105' size={35} />
            </div>
        ))}
    </div>
);
};
export default StarRating
