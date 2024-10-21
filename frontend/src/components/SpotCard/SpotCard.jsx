import {useState} from "react";
import { useNavigate } from 'react-router-dom';
import './SpotCard.css'

const SpotCard = ({ spot }) => {
const navigate = useNavigate();
const [showTooltip, setShowTooltip] = useState(false);

    const handleClick = () => {
      navigate(`/spots/${spot.id}`);
    };

    //console.log(`Spot ID: ${spot.id}, Avg Rating: ${spot.avgRating}`);

    return (
        <div
        className="spot-card"
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        style={{ cursor: 'pointer' }}
      >
        <div className="image-wrapper">
          <img
            src={spot.previewImage}
            alt={spot.name}
            className="spot-image"
          />
          {showTooltip && <div className="tooltip">{spot.name}</div>}
        </div>
  
        <div className="spot-details">
          <p>{spot.city}, {spot.state}</p>
          <p>${spot.price} / night</p>
          <p>{spot.avgRating ? `⭐${spot.avgRating.toFixed(1)}` : '⭐New'}</p>
        </div>
      </div>
    )
}

export default SpotCard
