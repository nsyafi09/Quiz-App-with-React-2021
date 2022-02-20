import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const QuizInstructions = () => (
    <Fragment>
        <Helmet><title>SV2 - Quiz Instruction</title></Helmet>
        <div className="instructions-container">
            <h1>How to play the game</h1>
            <p>Guide for newbies</p>
            <ul className="browser-default" id="main-list">
                <li>The game has a duration of 2 minutes and ends as soon as time expired</li>
                <li>Each game consist of 15 questions</li>
                <li>
                    Every question have 4 options
                </li>
                <li>
                    Select the option which best answers the question by selecting it
                </li>
                <li>
                    Each game has 2 lifelines namely:
                    <ul id="sublist">
                        <li>Two 50-50 chances</li>
                        <li>Five hints</li>
                    </ul>
                </li>
                <li>
                    Selecting a 50-50 lifeline by clicking the instructions
                    will remove 2 wrong answers, leaving the one correct answer and one wrong answer
                </li>
                <li>
                    Using a hint by clicking the icon
                    will remove one wrong answer leaving two wrong answers and one correct answer. You can use as many...
                </li>
                <li>
                    Feel free to quit or give up anytime
                </li>
            </ul>
            <div className="confirm-button">
                <span className="left"><Link to="/" className="confirm-buttons" id="back">No take me back</Link></span>
                <br></br>
                <span className="right"><Link to="/play/quiz" className="confirm-buttons" id="proceed">LET'S GO</Link></span>
            </div>
        </div>
    </Fragment>
);

export default QuizInstructions;