import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { addPreviewImage, createSpot } from '../../store/spots'
import './CreateSpotForm.css'

function CreateSpotForm() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user)
  const history = useHistory()
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  // const [lat, setLat] = useState(0);
  // const [lng, setLng] = useState(0);
  const lat = 0;
  const lng = 0;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState();
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    let spot = { address, city, state, country, lat, lng, name, description, price };
    let newSpot = dispatch(createSpot(spot))
      .then(spot => dispatch(addPreviewImage(spot.id, imageUrl)))
      .catch(
        async (res) => {
          const data = await res.json();
          if (data && data.errors) setErrors(data.errors);
        }
    )
    return history.push('/spots/current');
  };

  return (
    <form id='create-spot-form' onSubmit={handleSubmit}>
      <ul>
        {errors.map((error, idx) => (
          <li key={idx}>{error}</li>
        ))}
      </ul>
      <div id='welcome-title-create-spot'>Create a Spot</div>
      {/* <div style={{paddingLeft: '10px', paddingTop: '5px'}}>Login</div> */}
      <br />
      <div id='form-input-fields-div-login'>
        <label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Address"
            className="label-input-fields-login"
          />
        </label>
        <label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            placeholder="City"
            className="label-input-fields-login"
          />
        </label>
        <label>
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
            placeholder="State"
            className="label-input-fields-login"
          />
        </label>
        <label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            placeholder="Country"
            className="label-input-fields-login"
          />
        </label>
        <label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Property Name"
            className="label-input-fields-login"
          />
        </label>
        <label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Property Description"
            className="label-input-fields-login"
          />
        </label>
        <label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            placeholder="Price Per Night"
            className="label-input-fields-login"
          />
        </label>
        <label>
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            required
            placeholder="Preview Image Url"
            className="label-input-fields-login"
          />
        </label>
      </div>
      <br />
      <div id='login-buttons-div'>
        <button className="login-submit-buttons" type="submit">Create Spot</button>
        <br />
        <span>or</span>
        <br />
        <button className="login-submit-buttons" onClick={(e) => {
          e.preventDefault();
          setAddress('1600 Pennsylvania Ave');
          setCity('Washington');
          setState('DC');
          setCountry('USA');
          setName('Casa Blanca');
          setDescription('Historical site with a nice garden.');
          setPrice(20000);
          setImageUrl('https://www.whitehouse.gov/wp-content/uploads/2021/01/about_the_white_house.jpg')
        }}>Create Demo Spot</button>
      </div>
    </form>
  );
}

export default CreateSpotForm;
