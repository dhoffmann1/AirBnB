import React, { useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import './CurrentUserSpots.css';
import { getAllSpots, deleteSpotThunk } from '../../store/spots';


function CurrentUserSpots() {
  const allSpotsObj = useSelector(state => state.spots);
  const allSpots = Object.values(allSpotsObj)
  const user = useSelector(state => state.session.user)
  const userSpots = allSpots.filter(spot => spot.ownerId === user?.id)
  // console.log('userSpots from CurrentUserSpots component', userSpots)

  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getAllSpots());
    }, 100);
    return () => clearTimeout(timer);
  }, [dispatch])

  const deleteSpotFunc = (spotId) => {
    dispatch(deleteSpotThunk(spotId))
  }

  const editSpotFunc = (spotId) => {
    history.push(`/spots/${spotId}/edit`)
  }

  useEffect(() => {
    if (!user) {
      alert('Please log in to host a spot! :)')
      history.push('/')
    }
  }, [user, history])

  if (!allSpots) return null;

  return (
    <main id='splash-container-current-user'>

      {userSpots.length === 0 &&
        (
          <div id='title-banner-current-user-container'>
            <div id='welcome-user-title-banner'>Welcome {user?.firstName} To Your Spots Page</div>
            <NavLink id='create-spot-button' to={'/spots/create'}>
              <div>Create Your First Spot</div>
            </NavLink>
          </div>
        )
      }
      {userSpots.length > 0 && (
        <>
          <div id='title-banner-current-user-container'>
            <div id='welcome-user-title-banner'>Welcome {user?.firstName} To Your Spots Page</div>
            <NavLink id='create-spot-button' to={'/spots/create'}>
              <div>Create Another Spot</div>
            </NavLink>
          </div>
          <div id='splash-area-current-user'>
            {userSpots.map(spot => {
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
                    <div id='update-delete-spots-buttons-container'>
                      <div id='update-spot-button' onClick={() => editSpotFunc(spot.id)}>Edit Spot</div>
                      <div id='delete-spot-button' onClick={() => deleteSpotFunc(spot.id)}>Delete Spot</div>
                    </div>
                    </div>
                )
              })}
          </div>
        </>
      )}
    </main>
  );
}

export default CurrentUserSpots;
