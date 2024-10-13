import React, { useEffect, useState } from "react"; //useState,useContext
import { useDispatch, useSelector } from "react-redux";
import { loadAllSpots } from "../../store/spots";
import SpotCard from "../../components/SpotCard";

const LandingPage = () => {
const dispatch = useDispatch();
const spots = Object.values(useSelector((state)=> state.spots))
const [isLoaded, setIsLoaded] = useState(false);

// useEffect(() => {
//     if(Object.keys(spots).length === 0)
//         console.log('dispatch')
//         dispatch(loadAllSpots())
    
// },[dispatch])


useEffect(() => {
    if (!isLoaded) {
      //console.log("Dispatching loadAllSpots");
      dispatch(loadAllSpots()) 
        setIsLoaded(true); 
    }
  }, [dispatch]);


    return(
        <>
            <div className="spot-list">
                {spots &&
                 spots.map((spot) =>(
                    <SpotCard key={spot.id} spot={spot} />
                ))}
            </div>
        </>
        
    );
};

export default LandingPage
