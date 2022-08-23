import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import PokemonItems from './PokemonItems';
import EditSpotForm from './EditSpotForm';
// import ItemForm from './ItemForm';
import { getSpotById } from '../../store/spots';

const SpotDetails = () => {
  const { spotId } = useParams();
  const spot = useSelector(state => state.Spots[spotId]);
  // const [showEditPokeForm, setShowEditPokeForm] = useState(false);
  // const [editItemId, setEditItemId] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // setShowEditPokeForm(false);
    // setEditItemId(null);
    dispatch(getSpotById(spotId))
  }, [dispatch, spotId]);

  if (!spot) {
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
    <main id="spot-main">
      <div className={`pokemon-detail-image-background`}>
        <div
          className="pokemon-detail-image"
          style={{ backgroundImage: `url('${pokemon.imageUrl}')` }}
        ></div>
        <div>
          <h1 className="bigger">{pokemon.name}</h1>
          {(!showEditPokeForm && pokemon.captured) && (
            <button onClick={() => setShowEditPokeForm(true)}>Edit</button>
          )}
        </div>

      </div>
      {content}
    </main>
  );
};

export default SpotDetails;
