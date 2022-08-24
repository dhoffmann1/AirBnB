import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './AllSpots.css';
import { getAllSpots } from '../../store/spots';


function AllSpots() {
  const allSpotsObj = useSelector(state => state.spots);
  // console.log('allSpotsObj from AllSpots component', allSpotsObj)
  const allSpots = Object.values(allSpotsObj);
  // console.log('allSpots array from AllSpots component', allSpots)


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch])

  if (!allSpots) return null;

  return (
    <main id='splash-container'>
      <div id='splash-area'>
        {allSpots.map(spot => {
          return (
            <div className='navlink-containers' key={spot.id}>
              <NavLink className='allspots-navLinks' to={`/spots/${spot.id}`}>
                {/* <div>Spot Id #{spot.id}</div> */}
                <div className='allspots-images-containers'>
                  <img className='allspots-images' src={spot.previewImage} alt='preview'></img>
                </div>
                <div className='allspots-city-state-ratings'>
                  <div style={{fontWeight: '600'}}>{spot.city}, {spot.state}</div>
                  <div><i class="fa-solid fa-star" />{Number.parseFloat(spot.avgRating).toFixed(2)}</div>
                </div>
                <div className='allspots-name'>{spot.name}</div>
                <div>$<span style={{'fontWeight':'600'}}>{spot.price} </span>night</div>
              </NavLink>
            </div>
          )
        })}
      </div>
    </main>
  );
}

export default AllSpots;
