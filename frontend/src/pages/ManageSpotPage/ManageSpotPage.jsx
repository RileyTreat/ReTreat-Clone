import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import ManageSpotCard from "../../components/ManageSpotCard/ManageSpotCard";

const ManageSpotsPage = ()=>{
    const navigate = useNavigate()
    const currUserId = useSelector((state) => state.session.user.id)
    const {userId} = useParams()
    const spots = useSelector((state) => state.spots);
    const mySpots = Object.values(spots).filter((spot) => spot.ownerId === currUserId);
  

    const handleNavigate = () => {
        navigate(`/spots/new`);
    };

    return(
        <div>
            <div>
                <h1>Manage Spots</h1>
                <button onClick={handleNavigate}>
                    Create a New Spot
                </button>
            </div>
            <div className="spot-list">
                {mySpots.map((spot) => (    
                    <ManageSpotCard key={spot.id} spot={spot} />
                ))}
            </div> 
        </div>
     
    )
}

export default ManageSpotsPage;
