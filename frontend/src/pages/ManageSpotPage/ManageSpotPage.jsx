import { useNavigate } from "react-router-dom"; //, useParams 
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ManageSpotCard from "../../components/ManageSpotCard/ManageSpotCard";
import { loadAllSpots } from "../../store/spots";

const ManageSpotsPage = ()=>{
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const currUserId = useSelector((state) => state.session.user.id)
    //const {userId} = useParams()
    const spots = useSelector((state) => state.spots);
    const mySpots = Object.values(spots).filter((spot) => spot.ownerId === currUserId);
    const [isLoaded, setIsLoaded] = useState(false);
  
    useEffect(()=>{
        if(!isLoaded){
            dispatch(loadAllSpots(mySpots))
            setIsLoaded(true)
        }
    }, [dispatch, setIsLoaded, isLoaded, mySpots])

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
