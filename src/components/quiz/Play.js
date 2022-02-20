// This is where the quiz is taking place
import React, { Component, Fragment } from 'react';
import { Helmet } from 'react-helmet';

import M from 'materialize-css';

import questions from '../../questions.json';
import isEmpty from '../../utils/is-empty'
import correctNotification from '../../assets/audio/correct-answer.mp3';
import wrongNotification from '../../assets/audio/wrong-answer.mp3';
import buttonSound from '../../assets/audio/button-sound.mp3';
import classNames from 'classnames';

class Play extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions,
            currentQuestion: {},
            nextQuestion: {},
            previousQuestion: {},
            answer: '',
            numberOfQuestions: 0,
            numberOfAnsweredQuestion: 0,
            currentQuestionIndex:0,
            score: 0,
            correctAnswers: 0,
            wrongAnswers: 0,
            hints: 5,
            fiftyFifty: 2,
            usedFiftyFifty:false,
            time:{},
            previousRandomNumbers: [],

            nextButtonDisabled: false,
            previousButtonDisabled: true
        };
    };

    componentDidMount() {
        const { questions, currentQuestion, nextQuestion, previousQuestion } = this.state;
        this.displayQuestions(questions, currentQuestion, nextQuestion, previousQuestion );
        this.startTimer();
    }

    componentWillMount(){
        clearInterval(this.interval);
    }

    // For displaying the questions
    displayQuestions = (questions = this.state.questions, currentQuestion, nextQuestion, previousQuestion) => {
        let { currentQuestionIndex } = this.state;
        if (!isEmpty(this.state.questions)) {
            questions = this.state.questions;
            currentQuestion = questions[currentQuestionIndex];
            nextQuestion = questions[currentQuestionIndex + 1];
            previousQuestion = questions[currentQuestionIndex - 1];
            const answer = currentQuestion.answer;
            this.setState({
                currentQuestion,
                nextQuestion,
                previousQuestion,
                numberOfQuestions: questions.length,
                answer,
                previousRandomNumbers: []
            }, () => { // And also displaying the options and button handler
                this.showOptions();
                this.handleDisableButton();
            });
        }
    };

    // Function handler for when an option is chosen, to decide whether it is correct or wrong
    handleOptionClick = (e) => {
        if (e.target.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
            setTimeout(() => {
                document.getElementById('correct-sound').play();
            }, 500);
            this.correctAnswers();
        } else {
            setTimeout(() => {
                document.getElementById('wrong-sound').play();
            }, 500);
            this.wrongAnswers();
        }
    }

    // Funtion handler for the next button
    handleNextButtonClick = () => {
        this.playButtonSound();
        if (this.state.nextQuestion != undefined){
            this.setState(prevState=> ({
                currentQuestionIndex: prevState.currentQuestionIndex + 1
            }), ()=>{
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            });
        }
    };

    // Funtion handler for the previous button
    handlePreviousButtonClick = () => {
        this.playButtonSound();
        if (this.state.nextQuestion != undefined){
            this.setState(prevState=> ({
                currentQuestionIndex: prevState.currentQuestionIndex - 1
            }), ()=>{
                this.displayQuestions(this.state.state, this.state.currentQuestion, this.state.nextQuestion, this.state.previousQuestion);
            });
        }
    };

    // Funtion handler for the quit button
    handleQuitButton = () => {
        this.playButtonSound();
        // window.confirm('Are you sure you want to quit?')
        if(window.confirm('Are you sure you want to quit?')) {
            this.props.history.push('/');
        }
    };

    // For next, previous, and quit button
    handleButtonClick = (e) => {
        switch(e.target.id){
            case 'next-button':
                this.handleNextButtonClick();
                break;
            case 'previous-button':
                this.handlePreviousButtonClick();
                break;
            case 'quit-button':
                this.handleQuitButton();
                break;
            default:
                break;
        }
    };

    // Function to play the sound when choosing option
    playButtonSound = () => {
        document.getElementById('button-sound').play();
    };

    // Function to show something in the html player if they chose the correct answer
    correctAnswers = () => {
        M.toast({
            html: 'Correct Answer!',
            classes: 'toast-valid',
            displayLength: 1000
        });
        this.setState(prevState => ({
            score: prevState.score + 1,
            correctAnswers:prevState.correctAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnsweredQuestion: prevState.numberOfAnsweredQuestion + 1
        }), () => {
            if (this.state.nextQuestion === undefined){
                this.endGame();
            } else{
                this.displayQuestions(this.state.questions,
                    this.state.currentQuestion, this.state.nextQuestion,
                    this.state.previousQuestion);
            }
        });
    }

    // Function to show something in the html player if they chose the wrong answer 
    wrongAnswers = () => {
        navigator.vibrate(1000);
        M.toast({
            html: 'Wrong Answer!',
            classes: 'toast-invalid',
            displayLength: 1000
        });
        this.setState(prevState => ({
            wrongAnswers: prevState.wrongAnswers + 1,
            currentQuestionIndex: prevState.currentQuestionIndex + 1,
            numberOfAnsweredQuestion: prevState.numberOfAnsweredQuestion + 1,
        }), () => {
            if (this.state.nextQuestion === undefined){
                this.endGame();
            } else{
                this.displayQuestions(this.state.questions,
                    this.state.currentQuestion, this.state.nextQuestion,
                    this.state.previousQuestion);
            }
        });
    }

    // Show option from the JSON file
    showOptions = () => {
        const options = Array.from(document.querySelectorAll('option'));

        options.forEach(option => {
            option.style.visibility = ' visible';
        });
        this.setState({
            usedFiftyFifty: false
        });
    }

    // Function for removing one option (Bugged, not working as intended)
    handleHints = () => {
        if (this.state.hints > 0) {
            const options = Array.from(document.querySelectorAll('.option'));
            let indexOfAnswer;
    
            options.forEach((option, index) => {
                if(option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });
    
            while(true) {
                const randomNumber = Math.round(Math.random() * 3);
                if (randomNumber !== indexOfAnswer && !this.state.previousRandomNumbers.includes(randomNumber)) {
                    options.forEach((option, index) => {
                        if(index === randomNumber) {
                            option.style.visibility = 'hidden';
                            this.setState((prevState) => ({
                                hints: prevState.hints - 1,
                                previousRandomNumbers: prevState.previousRandomNumbers.concat(randomNumber)
                            }));
                        }
                    });
                    break;
                }
                if (this.state.previousRandomNumbers.length >= 3) break;
            }
        }
    }

    // Function for fifty-fifty hint
    handleFiftyFifty = () => {
        if (this.state.fiftyFifty > 0 && this.state.usedFiftyFifty === false) {
            const options = document.querySelectorAll('.option');
            const randomNumbers = [];
            let indexOfAnswer;

            options.forEach((option, index) => {
                if (option.innerHTML.toLowerCase() === this.state.answer.toLowerCase()) {
                    indexOfAnswer = index;
                }
            });

            let count = 0;
            do {
                const randomNumber = Math.round(Math.random() * 3);
                if (randomNumber !== indexOfAnswer) {
                    if (randomNumbers.length < 2 && !randomNumbers.includes(randomNumber) && !randomNumbers.includes(indexOfAnswer)) {
                            randomNumbers.push(randomNumber);
                            count ++;
                    } else {
                        while (true) {
                            const newRandomNumber = Math.round(Math.random() * 3);
                            if (!randomNumbers.includes(newRandomNumber) && newRandomNumber !== indexOfAnswer) {
                                randomNumbers.push(newRandomNumber);
                                count ++;
                                break;
                            }
                        }
                    }
                }
            } while (count < 2);

            options.forEach((option, index) => {
                if (randomNumbers.includes(index)) {
                    option.style.visibility = 'hidden';
                }
            }); // Return to previous state after using the hint (bugged, not properly working)
            this.setState(prevState => ({
                fiftyFifty: prevState.fiftyFifty - 1,
                usedFiftyFifty: true
            }));
        }
    }

    // Function for timer
    startTimer = () => {
        const countDownTime = Date.now() + 120000;
        this.interval = setInterval(() =>{
            const now = new Date();
            const distance = countDownTime - now;

            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60 )) / 1000);

            if(distance < 0){
                clearInterval(this.interval);
                this.setState({
                    time: {
                        minutes: 0,
                        seconds: 0
                    }
                }, () => {
                    alert('Time has expired!'); 
                    this.endGame(); // If time is 0 the game will end
                });
            } else {
                this.setState({
                    time: {
                        minutes,
                        seconds
                    }
                });
            }
        }, 1000);
    }

    // For disabling next and previous button if they go out of index
    handleDisableButton = () => {
        if (this.state.previousQuestion === undefined || 
            this.state.currentQuestionIndex === 0) {
                this.setState({
                    previousButtonDisabled: true
                });
        } else {
            this.setState({
                previousButtonDisabled: false
            });
        }

        if (this.state.nextQuestion === undefined || 
            this.state.currentQuestionIndex + 1 === this.state.numberOfQuestions) {
                this.setState({
                   nextButtonDisabled: true
                });
        } else {
            this.setState({
                nextButtonDisabled: false
            });
        }
    }

    // Function to end the game
    endGame = () => {
        alert('Quiz Finished!');
        const { state } = this;
        const playerStats = {
            score: state.score,
            numberOfQuestions: state.numberOfQuestions,
            numberOfAnsweredQuestion: state.numberOfAnsweredQuestion,
            correctAnswers: state.correctAnswers,
            wrongAnswers: state.wrongAnswers,

        };
        console.log(playerStats);
        setTimeout(() => {
            this.props.history.push('/play/quizSummary', playerStats)
        }, 1000);
    }

    render() {
        const { 
            currentQuestion, 
            currentQuestionIndex, 
            numberOfQuestions,
            hints,
            fiftyFifty,
            time 
        } = this.state;
        
        // Return statement to show the quiz play webpage
        return (
            <Fragment>
                <Helmet><title>S2V - Quiz Page</title></Helmet>
                <Fragment>
                    <audio id="correct-sound" src={correctNotification}></audio>
                    <audio id="wrong-sound" src={wrongNotification}></audio>
                    <audio id="button-sound" src={buttonSound}></audio>
                </Fragment>
                <div className="questions">
                    <h2>Quiz Time!</h2>
                    <div className='lifeline-container'> 
                        <p>
                            <span onClick={this.handleFiftyFifty} className="lifeline">Fifty-fifty: {fiftyFifty}</span>
                        </p>
                        <p>
                            <span onClick={this.handleHints} className="lifeline">Remove Option: {hints}</span>
                        </p>
                    </div>
                    <div className="timer-container">
                        <p className="timer-number">
                            <span>{time.minutes}:{time.seconds}</span>
                            <br></br>
                            <span className="left">{currentQuestionIndex+1} out of {numberOfQuestions}</span>
                            
                        </p>
                    </div>
                    <h5>{currentQuestion.question}</h5>
                    <div className="options-container">
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionA}</p>
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionB}</p>
                    </div>
                    <div className="options-container">
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionC}</p>
                        <p onClick={this.handleOptionClick} className="option">{currentQuestion.optionD}</p>
                    </div>
                    <div className="button-container">
                        <button className={classNames('', {'disable': this.state.previousButtonDisabled})} id="previous-button" onClick={this.handleButtonClick}>Previous</button>
                        <button className={classNames('', {'disable': this.state.nextButtonDisabled})} id="next-button" onClick={this.handleButtonClick}>Next</button>
                        <button id="quit-button" onClick={this.handleButtonClick}>Quit</button>

                    </div>
                </div>

            </Fragment>
        );
    }
}

export default Play;