import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ReviewFormModal from "./ReviewFormModal";
import OpenModalButton from '../OpenModalButton'
//import { useModal } from '../../context/Modal';
import ReviewDetails from "./ReviewDetails";



const ReviewInfo = ({ spotDetails , currUser, spotId }) => {
    const {   
        Owner, ownerId, SpotImages,
        avgStarRating, city, country, description,
        name, numReviews, price,
        state} = spotDetails //
    
      // const { closeModal } = useModal();
    const [noReviews, setNoReviews] = useState(false);
    const reviews = Object.values(useSelector((state) => state.reviews))
    // const spotReviews = Object.values(useSelector((state) => state.reviews)).filter(
    //     (review) => review.spotId === spotId
    // );
    const userReviews = reviews.filter(
        (reviews) => reviews.userId === currUser?.id
      );  
    
      const sortedSpotReviews = reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
     
    //   console.log("rREEEE", reviews)
    //   console.log('USERERRR', userReviews)


      // const closeMenu = (e) => {
      //   if (!ulRef.current.contains(e.target)) {
      //     setShowMenu(false);
      //   }
      // };

    //   useEffect(()=> {
    //     if (reviews.length){
    //         setNoReviews(false)
    //     }else{
    //         setNoReviews(true)
    //     }
    //   },[reviews])

    useEffect(() => {
        if (sortedSpotReviews.length === 0) {
            setNoReviews(true);
        } else {
            setNoReviews(false);
        }
    }, [sortedSpotReviews]);

    return(
        <div>
        <h3 className="spot-rating">
          <FaStar />
          {avgStarRating ? avgStarRating.toFixed(1) : "New"}{" "}
          {numReviews ? "・" + numReviews : ""}{" "}
          {numReviews === 0 ? "" : numReviews > 1 ? "reviews" : "review"}
        </h3>
        <div className="reviews-header">

          {currUser ? (
            
            currUser.id !== ownerId && noReviews ? (
            <div>
              <OpenModalButton
                buttonText="Post Your Review"
                //onButtonClick={closeMenu}
                itemText="Post your review"
                modalComponent={<ReviewFormModal spotId={spotId} />}
              />
              <p>Be the first to post a review!</p>
           </div>
             
            ) : currUser &&
              currUser.id !== ownerId &&
              userReviews.length === 0 ? (
              <>
                {
                    <OpenModalButton
                      buttonText="Post Your Review!"
                      //onButtonClick={closeMenu}
                      modalComponent={<ReviewFormModal spotId={spotId} />}
                    />
                }
              </>
            ) : (
              <></>
            )
          ) : (
            <></> 
          )}
      
          <div className="reviews">
            {sortedSpotReviews.map((review) => (
              <ReviewDetails key={review.id} currUser={currUser} review={review} spotId={spotId}/>
            ))} 
          </div>
        </div>
      </div> 
    )
}

export default ReviewInfo
