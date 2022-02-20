import React, { Component, Fragment } from 'react';
import { Helmet} from 'react-helmet';
import {Link} from 'react-router-dom';

class QuizSummary extends Component{
    constructor(props) {
        super(props);
        this.state = {
            score: 0,
            numberOfQuestions: 0,
            correctAnswers: 0,
            wrongAnswers: 0
        }
    }

    componentDidMount() {
        const { state } = this.props.location;
        if (state){
            this.setState({
                score: state.score / state.numberOfQuestions * 100,
                numberOfQuestions: state.numberOfQuestions,
                numberOfAnsweredQuestion: state.numberOfAnsweredQuestion,
                correctAnswers: state.correctAnswers,
                wrongAnswers: state.wrongAnswers
            });
        }
    }

    render() {
        const { state, score } = this.props.location;
        let stats, remark;
        const userScore = this.state.score;
        // Defining user score
        if (userScore <= 50) {
            remark = 'Better luck next time!'
        } else if (userScore > 50 && userScore <= 70) {
            remark = 'Barely passed!'
        } else if (userScore > 70 && userScore <= 90) {
            remark = 'Awesome Stuff!'
        } else if (userScore > 90 && userScore <= 100) {
            remark = 'Genius at work!'
        }
        if (state != undefined){
            stats = (
                <Fragment>
                <div className="summary-container">
                    <div className=".quiz-summary">
                            <h4>{remark}</h4>
                            <h2>Your Score: {this.state.score.toFixed(0)}&#37;</h2>
                            <span className="stats">Total number of questions: </span>
                            <span className="stats">{this.state.numberOfQuestions}</span><br />

                            <span className="stats">Number of attempted questions: </span>
                            <span className="stats">{this.state.numberOfAnsweredQuestion}</span><br />

                            <span className="stats">Number of Correct Answers: </span>
                            <span className="stats">{this.state.correctAnswers}</span> <br />

                            <span className="stats">Number of Wrong Answers: </span>
                            <span className="stats">{this.state.wrongAnswers}</span><br />
                        </div>
                    <section>
                        <ul>
                            <Link to ="/" className="options">Return</Link>
                            <Link to ="/play/quiz" className="options">Play Again</Link>
                        </ul>
                    </section>
                </div>
            </Fragment>
            );
        } else {
            stats = (
                <section>
                    <div className=".quiz-summary">
                        <h1 className="no-stats">No stats available yet</h1>
                        <ul>
                            <Link to ="/" className="options">Return</Link>
                            <Link to ="/play/quiz" className="options">Take a Quiz!</Link>
                        </ul>
                    </div>
                </section>
            );
        }
        return(
            <Fragment>
                <Helmet><title>SV2 - Summary</title></Helmet>
                {stats}
            </Fragment>
        );
    }
}

export default QuizSummary;