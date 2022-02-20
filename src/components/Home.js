import React, {Fragment} from 'react';
import {Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';

const Home = () => (
    // For the main page
    <Fragment>
        <Helmet><title>S2V - Quiz App</title></Helmet>
        <div id="home">
            <section>
                {/* <div style={{ textAlign: 'center' }}> 
                    <p>LOGO HERE</p>
                </div> */}
                <h1>S2V Quiz App</h1>
                <div className = "play-button-container">
                    <ul>
                        <Link className="play-button" to="/play/instructions">Play</Link>
                    </ul>
                </div>
                <div className = "auth-container">
                    <Link to="/login" className="auth-buttons" id="login-button">Login</Link>
                    <Link to="/register" className="auth-buttons" id="signup-button">Sign Up</Link>
                </div>
            </section>
        </div>
    </Fragment>
    
    );

export default Home