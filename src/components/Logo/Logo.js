import React from 'react';
import Tilt from 'react-tilt';
import detection from './detection.png';
import './Logo.css';


const Logo = () => {
    return (
        <div className='ma2 mt0'>
            <Tilt className="Tilt br3 shadow-4" options={{ max : 60 }} style={{ height: 120, width: 120 }} >
             <div className="Tilt-inner pa3">
              <img style={{paddingTop:'5px'}}   alt='logo' src={detection}/>
               </div>
            </Tilt>
        </div>
    );
}

export default Logo;