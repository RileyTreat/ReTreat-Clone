import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as reviewActions from '../../store/reviews';
import { useModal } from '../../context/Modal';
import { FaStar } from "react-icons/fa";
import "./ReviewFormModal.css";
import * as spotActions from '../../store/spots';


function ReviewFormModal ({spotId}){
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [review, setReview] = useState("");
    const [stars, setStars] = useState(0);
    const [hover, setHover] = useState(0);
    const [errors, setErrors] = useState({});
    const starsArr = [1, 2, 3, 4, 5];

    

    const sessionUser = useSelector((state) => state.session.user)
    const spotReviews= Object.values(useSelector((state) => state.reviews))

    useEffect(() =>{
        const errors ={}
        const reviewExists = spotReviews.find(
            (review) => review.userId === sessionUser.id
        )
        
        if(review.length < 10) errors.review = 'Must be atleast 10 characters'

        if(!stars) errors.stars = 'Must select star rating'

        if(reviewExists) errors.review = "review already exists for this spot"

        setErrors(errors);
    }, [review, stars, sessionUser.id, spotReviews])

    const handleSubmit= async (e) => {
        e.preventDefault()
        setErrors({})

        const payload= {
            review,
            stars
        }

        //console.log("PAYLOD", payload, spotId)

        await dispatch(reviewActions.createReviewsThunk(spotId, payload))
            
        await dispatch(spotActions.readSpotThunk(spotId))
        
        closeModal()
    }

    const isDisabled = Object.values(errors).length >= 1

    return(
        <div className="review-modal">
            <h1>How was your stay?</h1>
            <form onSubmit={handleSubmit} className="review-form">
            <div className="review-text-container">
                 <textarea
                    className="text-area"
                    type='text'
                    value={review}
                    placeholder="Leave your review here..."
                    onChange={(e) => setReview(e.target.value)}
                    required
                />
                {errors.review && <p>{errors.review}</p>}
            </div>
            <div className='star-container'>
                {starsArr.map((index) => {
                    //const currStars = index + 1

                    return(
                        <label key={index}>
                            <input
                                name="rating"
                                type="radio"
                                value={index}
                                onChange={() =>setStars(index)}
                            />
                            <span
                                className="star"
                                style={{
                                color:
                                    index <= (hover || stars) ? "#000000" : "#A9D9D0",
                                }}
                                onMouseEnter={() => setHover(index)}
                                onMouseLeave={() => setHover(null)}
                             >
                            <FaStar />
                            </span>
                        </label>
                    )
                })}
                <span>Stars</span>
            </div>
            {errors.stars && <p>{errors.stars}</p>}
                <button disabled={isDisabled} type="submit" className="review-submit-button">
                    Submit Your Review
                </button>
            </form>
        </div>
    )
}

export default ReviewFormModal
