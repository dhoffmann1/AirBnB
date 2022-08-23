import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import PokemonItems from './PokemonItems';
// import EditSpotForm from './EditSpotForm';
// import ItemForm from './ItemForm';
import { getSpotById } from '../../store/spots';
import './SpotDetails.css'

const SpotDetails = () => {
  const { spotId } = useParams();
  const spot = useSelector(state => state.spots[spotId]);
  console.log('spot from SpotDetails component', spot);
  const spotsImagesArray = spot.Images;
  console.log(spotsImagesArray);
  // const [showEditPokeForm, setShowEditPokeForm] = useState(false);
  // const [editItemId, setEditItemId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // setShowEditPokeForm(false);
    // setEditItemId(null);
    dispatch(getSpotById(spotId))
  }, [dispatch, spotId]);

  if (!spot || !spot.Images) {
    return null;
  }

  // let content = null;

  // if (editItemId) {
  //   content = (
  //     <ItemForm
  //       itemId={editItemId}
  //       hideForm={() => setEditItemId(null)}
  //     />
  //   );
  // } else if (showEditPokeForm && pokemon.captured) {
  //   content = (
  //     <EditPokemonForm
  //       pokemon={pokemon}
  //       hideForm={() => setShowEditPokeForm(false)}
  //     />
  //   );
  // } else {
  //   content = (
  //     <div className="pokemon-detail-lists">
  //       <div>
  //         <h2>Information</h2>
  //         <ul>
  //           <li>
  //             <b>Number</b> {pokemon.number}
  //           </li>
  //           <li>
  //             <b>Type</b> {pokemon.type}
  //           </li>
  //           <li>
  //             <b>Attack</b> {pokemon.attack}
  //           </li>
  //           <li>
  //             <b>Defense</b> {pokemon.defense}
  //           </li>
  //           <li>
  //             <b>Moves</b>
  //             <ul>
  //               {pokemon.moves && pokemon.moves.map((move, i) => (
  //                 <li key={move+i}>{move}</li>
  //               ))}
  //             </ul>
  //           </li>
  //         </ul>
  //       </div>
  //       <div>
  //         <h2>
  //           Items
  //           <button> + </button>
  //         </h2>
  //         <table>
  //           <thead>
  //             <tr>
  //               <th></th>
  //               <th>Name</th>
  //               <th>Happiness</th>
  //               <th>Price</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             <PokemonItems pokemon={pokemon} setEditItemId={setEditItemId} />
  //           </tbody>
  //         </table>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <main id='spot-main-container'>
      <div id='spot-main-area'>
        <div id='header-details-container'>
          <div id='spot-name'>{spot.name}</div>
          <div id='spot-sub-details'>
            <div id='average-rating'><i class="fa-solid fa-star" /> {spot.avgStarRating}</div>
            <div id='count-reviews'>{spot.numReviews} reviews</div>
            <div id='city-state-info'>{spot.city}, {spot.state}, {spot.country}</div>
          </div>
        </div>
        <div id='images-container'>
          {spotsImagesArray.map(image => {
            return (
              <div id={`image${image.id}`}>
                <img src={image.url} alt='images'/>
              </div>
            )
          })}
        </div>
        <div id='host-container'>
          <div id='host-name'>Spot hosted by {spot.Owner.firstName}</div>
          <div id='host-image'></div>
        </div>
        <div id='description-container'>
          <div id='description-info'>{spot.description}</div>
        </div>
        <div id='reviews-container'>
          <div id='avg-ratings-and-reviews-container'>
            <div id='average-rating2'><i class="fa-solid fa-star" /> {spot.avgStarRating}</div>
            <div id='count-reviews2'>{spot.numReviews} reviews</div>
          </div>
          <div id='reviews-component'>
            
          </div>
        </div>
      </div>
    </main>
  );
};

export default SpotDetails;
