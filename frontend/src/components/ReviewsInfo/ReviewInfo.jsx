


const ReviewInfo = () => {


    return(
         {/* 
          <div>
            <h3 className="spot-rating">
              <FaStar />
              {avgStarRating ? Math.round(avgStarRating * 100) / 100 : "New"}{" "}
              {numReviews ? "・" + numReviews : ""}{" "}
              {numReviews === 0 ? "" : numReviews > 1 ? "reviews" : "review"}
            </h3>
            <div className="reviews-header">
              {sessionUser ? (
                sessionUser.id !== ownerId && noReviews ? (
                  <OpenModalButton
                    itemText="Be the first to post a review!"
                    onButtonClick={closeMenu}
                    modalComponent={<ReviewFormModal spotId={spotId} />}
                  />
                ) : sessionUser &&
                  sessionUser.id !== ownerId &&
                  userReviews.length === 0 ? (
                  userReviews.map((review) => {
                    review.spotId !== spotId
                  })
                  <OpenModalButton
                    itemText="Post Your Review"
                    onButtonClick={closeMenu}
                    modalComponent={<ReviewFormModal spotId={spotId} />}
                  />
                ) : (
                  <></>
                )
              ) : (
                <></>
              )}
   
              <div className="reviews">
              {reviews.map((review) => (
                <ReviewDetails key={review.id} review={review} />
              ))}
              </div>
            </div>
          </div> */}
    )
}

export default ReviewInfo
