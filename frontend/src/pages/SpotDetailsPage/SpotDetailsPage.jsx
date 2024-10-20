import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { readSpotThunk } from "../../store/spots"
import { readReviewsThunk } from "../../store/reviews"
import SpotInfo from "../../components/SpotInfo/SpotInfo"
import ReviewInfo from "../../components/ReviewsInfo/ReviewInfo"


const SpotDetailsPage = () =>{
    const dispatch = useDispatch()
    const {spotId} = useParams()
    const [isLoaded, setIsLoaded] = useState(false)
    const spotDetails = useSelector(state => state.spots);
    const currUser = useSelector((state) => state.session.user);
    // const reviews = Object.values(useSelector((state) => state.reviews));
    // const review = reviews.filter(
    //     (review) => review.userId === currUser?.id
    //   );

      useEffect(() => {
        dispatch(readSpotThunk(spotId))
          .then(() => {
            return dispatch(readReviewsThunk(spotId));
          })
          .then(() => {
            setIsLoaded(true);
          });
      }, [dispatch, spotId]);

//console.log("SPOTDETA", spotDetails)


    return isLoaded ? (
        <div className="page">
            <SpotInfo spotDetails={spotDetails[spotId]}/>
            <ReviewInfo spotDetails={spotDetails[spotId]} currUser={currUser} spotId={spotId}/>
        </div>
          
 
      ) : (
        <h3>Loading...</h3>
      );


}


export default SpotDetailsPage
