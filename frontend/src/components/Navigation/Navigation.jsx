// frontend/src/components/Navigation/Navigation.jsx

import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import '/src/index.css'
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  return (

<nav className='nav-bar'>


  <div className='nav-logo'>
        <NavLink to="/" >
          <img src="/logo.png" className="logo" />
        </NavLink>
  </div>
  <div className='nav-buttons'>

      {sessionUser &&(

        <NavLink to="/spots/new"><button className='spot-button'>Create a New Spot</button></NavLink>

      )}

      {isLoaded && (
        <ProfileButton  user={sessionUser} />
      )}
  </div>
</nav>
  );
}

export default Navigation;
