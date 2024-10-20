
import { useDispatch, useSelector } from "react-redux";
import { useModal } from '../../context/Modal';
import * as reviewActions from '../../store/reviews';
import * as spotActions from '../../store/spots';

const ManageSpotDeleteModal =() => {
    const dispatch = useDispatch()
    const { closeModal } = useModal();
    const currSpotId = useSelector((state) => state.spots.id)

    const handleClickDelete = async (e) => {
        e.preventDefault();
    
        await dispatch(reviewActions.deleteSpotThunk(currSpotId))
        // await dispatch(spotActions.readSpotThunk(spotId)).then(closeModal())
      };

    return(
        <div className="review-modal-container">
            <h1 >Confirm Delete</h1>
            <div>Are you sure you want to remove this spot from the listings?</div>
            <button 
                onClick={handleClickDelete} 
                className="delete-review-button"
                style={{ backgroundColor: 'red' }}
                >
                Yes (Delete Spot)
            </button>
            <button 
                onClick={closeModal} 
                className="keep-review-button"
                style={{ backgroundColor: '#333333' }}
                >
                No (Keep Spot)
            </button>
        </div>
    )
}

export default ManageSpotDeleteModal
