import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './AllSpots.css';
import { getAllSpots } from '../../store/spots';


function AllSpots() {
  const allSpotsObj = useSelector(state => state.spots);
  console.log('allSpotsObj from AllSpots component', allSpotsObj)
  const allSpots = Object.values(allSpotsObj)
  console.log('allSpots array from AllSpots component', allSpots)

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
            <div id='navlink-containers'>
              <NavLink className='spots-navLinks' key={spot.id} to={`/spots/${spot.id}`}>
                <div>Spot Id #{spot.id}</div>
                <img className='spot-images' src={spot.previewImage} alt='preview-Image'></img>
                <div>Spot City, State: {spot.city}, {spot.state}</div>
                <div>Spot Name: {spot.name}</div>
                <div>Spot Price: $<span style={{'fontWeight':'600'}}>{spot.price}</span>/night</div>
              </NavLink>
              <br />
            </div>
          )
        })}
      </div>
    </main>
  );
}

export default AllSpots;
