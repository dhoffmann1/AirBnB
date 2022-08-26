import { NavLink } from 'react-router-dom';
import './Footer.css';

function Footer(){
  return (
    <footer id='footer-main'>
      <div id='footer-80px-padding'>
          <div id='footer-copyright'><i class="fa-solid fa-copyright"></i>2022 Airbnb-Prime, Inc</div>
          <a id='footer-github-link' href='https://github.com/Pepa90210/AirBnB' target={"_blank"}><i class="fa-brands fa-github"></i>Github</a>
          <a id='footer-google-sheet-link' href='https://docs.google.com/spreadsheets/d/1XIUaz5OaT1PRIY4zpx8zjr3gERrRbxx3GdcL_G9N9j0/edit#gid=1712141062' target={"_blank"}><i class="fa-brands fa-google-drive"></i>Google Drive</a>
          <a id='footer-linkedin-link' href='https://www.linkedin.com/in/danielhoffmann-1/' target={"_blank"}><i class="fa-brands fa-linkedin"></i>LinkedIn</a>
      </div>
    </footer>
  );
}

export default Footer;
