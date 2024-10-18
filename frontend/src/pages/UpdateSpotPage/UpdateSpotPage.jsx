import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { readSpotThunk, updateSpotThunk } from "../../store/spots";
import { createSpotImageThunk } from "../../store/images";

const UpdateSpotForm = () => {
  const { id } = useParams(); // Get the spot ID from the URL params
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const spot = useSelector((state) => state.spots[id]); // Access the spot from the Redux store

  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [imageUrl1, setImageUrl1] = useState('');
  const [imageUrl2, setImageUrl2] = useState('');
  const [imageUrl3, setImageUrl3] = useState('');
  const [imageUrl4, setImageUrl4] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New loading state

  // Fetch the spot data if it isn't already in the store
  useEffect(() => {
    if (!spot) {
      dispatch(readSpotThunk(id)).then(() => setIsLoading(false)); // Wait for the spot to load
    } else {
      setIsLoading(false); // Spot is already loaded
      setFormFields(spot); // Populate the form with spot data
    }
  }, [dispatch, id, spot]);

  // Populate the form fields with the spot's data
  const setFormFields = (spot) => {
    setCountry(spot.country || '');
    setAddress(spot.address || '');
    setCity(spot.city || '');
    setState(spot.state || '');
    setDescription(spot.description || '');
    setName(spot.name || '');
    setPrice(spot.price || '');
  };

  useEffect(() => {
    const errors = {};
    if (hasSubmitted) {
      if (!country) errors.country = "Country is required";
      if (!address) errors.address = "Address is required";
      if (!city) errors.city = "City is required";
      if (!state) errors.state = "State is required";
      if (!description || description.length < 30) errors.description = "Description must be at least 30 characters";
      if (!name) errors.name = "Name is required";
      if (!price) errors.price = "Price is required";
      setFormErrors(errors);
    }
  }, [hasSubmitted, country, address, city, state, description, name, price]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    const updatedSpotData = {
      address,
      city,
      state,
      country,
      name,
      description,
      price,
    };

    const updatedSpot = await dispatch(updateSpotThunk(id, updatedSpotData));

    const imagePromises = [];
    if (previewImage) {
      imagePromises.push(dispatch(createSpotImageThunk(updatedSpot.id, { url: previewImage, preview: true })));
    }
    if (imageUrl1) {
      imagePromises.push(dispatch(createSpotImageThunk(updatedSpot.id, { url: imageUrl1, preview: false })));
    }
    if (imageUrl2) {
      imagePromises.push(dispatch(createSpotImageThunk(updatedSpot.id, { url: imageUrl2, preview: false })));
    }
    if (imageUrl3) {
      imagePromises.push(dispatch(createSpotImageThunk(updatedSpot.id, { url: imageUrl3, preview: false })));
    }
    if (imageUrl4) {
      imagePromises.push(dispatch(createSpotImageThunk(updatedSpot.id, { url: imageUrl4, preview: false })));
    }

    await Promise.all(imagePromises);

    navigate(`/spots/${updatedSpot.id}`);
  };



  return (
    <div className="update-spot-form-container">
      <h1>Update your Spot</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h2>Where&apos;s your place located?</h2>
          <div className="form-group">
            <label>Country</label>
            <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} />
            {formErrors.country && <p className="error">{formErrors.country}</p>}
          </div>
          <div className="form-group">
            <label>Street Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
            {formErrors.address && <p className="error">{formErrors.address}</p>}
          </div>
          <div className="form-group">
            <label>City</label>
            <input type="text" value={city} onChange={(e) => setCity(e.target.value)} />
            {formErrors.city && <p className="error">{formErrors.city}</p>}
          </div>
          <div className="form-group">
            <label>State</label>
            <input type="text" value={state} onChange={(e) => setState(e.target.value)} />
            {formErrors.state && <p className="error">{formErrors.state}</p>}
          </div>
        </div>

        <div className="form-section">
          <h2>Describe your place to guests</h2>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          {formErrors.description && <p className="error">{formErrors.description}</p>}
        </div>

        <div className="form-section">
          <h2>Create a title for your spot</h2>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
          {formErrors.name && <p className="error">{formErrors.name}</p>}
        </div>

        <div className="form-section">
          <h2>Set a base price for your spot</h2>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
          {formErrors.price && <p className="error">{formErrors.price}</p>}
        </div>

        <button type="submit">Update your Spot</button>
      </form>
    </div>
  );
};

export default UpdateSpotForm;
