import React from "react";

const SpotCard = ({ spot }) => {
    console.log('HELLO', spot)
    return (
        <div key={spot.id} className="spot-card">
            <img src={spot.previewImage} alt={spot.name} className="spot-image" />
            <div className="spot-details">
                <h3>{spot.name}</h3>
                <p>{spot.city}, {spot.state}</p>
                <p>Price: ${spot.price} / night</p>
                <p>Rating: ⭐{spot.avgRating}</p>
            </div>
        </div>
    )
}

export default SpotCard
