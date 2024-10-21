import {useState} from "react";
import { useNavigate } from 'react-router-dom';
//import { useModal } from '../../context/Modal';
import OpenModalButton from '../OpenModalButton'
import ManageSpotDeleteModal from "./ManagSpotDeleteModal";
import './ManageSpotCard.css'

const ManageSpotCard = ({spot}) => { //{spot} needs to be spots with ownerId
    const navigate = useNavigate();
    const [showTooltip, setShowTooltip] = useState(false);
    
        const handleClick = () => {
          navigate(`/spots/${spot.id}`);
        };
        const handleUpdateClick = (e) => {
            e.stopPropagation(); // Prevent card click behavior
            navigate(`/spots/${spot.id}/edit`);
          };
  
          const handleModalClick = (e) => {
            e.stopPropagation(); // Prevent card click behavior when opening modal
        };

        // const closeMenu = (e) => {
        //     if (!ulRef.current.contains(e.target)) {
        //       setShowMenu(false);
        //     }
        //   };
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
            <div className="buttons">
                <div>
                    <button onClick={handleUpdateClick}>
                        Update
                    </button>
                </div>
                <div onClick={handleModalClick}>            
                    <OpenModalButton
                      buttonText="Delete"
                    //   onClick={handleModalClick}
                    //   onButtonClick={closeMenu}
                      modalComponent={<ManageSpotDeleteModal spotId={spot.id} />}
                    />           
                </div>
            </div>
          </div>
        )
}
export default ManageSpotCard;
