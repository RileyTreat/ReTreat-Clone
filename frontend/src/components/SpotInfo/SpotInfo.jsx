//import React from "react"
import { FaStar } from "react-icons/fa";

const SpotInfo= ({ spotDetails  }) => {
const {   
    Owner, SpotImages,
    avgStarRating, city, country, description,
    name, numReviews, price,
    state} = spotDetails // ownerId,


    const handleClick = () => {
        alert('Feature Coming Soon...')
    }

    return (
   <div className="page">
        <h2 className="spot-title">{name}</h2>
        <p className="spot-location">
           {city}, {state}, {country} 
        </p>
        <div className="spot-images">
          {SpotImages
          .sort((a, b) => b.preview - a.preview)
          .map((image) => (
            <img
              key={image.id}
              src={image.url}
               className={`preview-${image.preview}`}
            />
          ))}
        </div>
        <div className="details-container">
          <div className="details-text">
            <h2 className="spot-host">
                Hosted by {Owner.firstName} {Owner.lastName} 
            </h2>
           <p className="spot-description">{description}</p>
          </div>
        </div>
        <div className="callout-container">
              <div className="callout-text">
                <span className="callout-price"><span className="price">${price}</span> night</span>
                <p className="callout-rating">
                  <FaStar />
                  {avgStarRating
                    ? avgStarRating.toFixed(1) // ? Math.round(avgStarRating * 100) / 100
                    : "New"}{" "}
                  {numReviews ? "・" + numReviews : ""}{" "}
                  {numReviews === 0 ? "" : numReviews > 1 ? "reviews" : "review"}
                </p>
              </div>
              <div className="button-container">
                <button className="button" onClick={handleClick}>
                  Reserve
                </button>
              </div>
            </div>
 
        </div>
    )
}

export default SpotInfo;
