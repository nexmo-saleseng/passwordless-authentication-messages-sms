import React, { Component } from 'react';
import {Link, withRouter} from 'react-router-dom';
import Countdown from 'react-countdown-now';
import queryString from 'query-string';
import axios from 'axios';
import ConfettiGenerator from "confetti-js";

class Login extends Component {
    constructor() {
        super();
        this.state = { auth: '', code: '' };
        this._confettiEffect = null;
        this.redirectTimeout = 5000;
    }
    componentDidMount () {
        const values = queryString.parse( this.props.location.search );
        const intervalId = setInterval( this.checkAuth.bind( this ), 1000, 1 );
        this.setState( {
            auth: values.auth,
            code: values.code,
            intervalId,
            authenticated: false,
            opentok: null
        } )
        this._confettiEffect = new ConfettiGenerator( { target: 'auth-completed-confetti' } );
    }

    componentWillUnmount () {
        clearInterval( this.state.intervalId );
    }

    checkAuth () {
        const { auth, intervalId } = this.state;
        const {history} = this.props;
        axios.post( 'https://auuubonz7g.execute-api.eu-west-2.amazonaws.com/dev/auth/check-auth-code', { authCode: auth } ).then( ( res ) => {
            console.log( '[checkAuth]', res );
            if ( res && res.data ) {
                const { authenticated, opentok } = res.data.authResult;
                // todo use token to redirect
                
                this.setState( {
                    authenticated,
                    opentok: JSON.stringify(opentok)
                } )
                if ( authenticated ) {
                    this._confettiEffect.render();
                    clearInterval( intervalId )
                    /* const {apiKey, sessionId, token} = opentok;
                    const redirectVideoCallUrl = `/videocall?token=${token}&apiKey=${apiKey}&sessionId=${sessionId}`;
                    setTimeout(() => {
                        history.push(redirectVideoCallUrl)
                    }, this.redirectTimeout) */
                }
            }
        } );
    }

    onCompleteCountdown() {
        const {history} = this.props;
        const {opentok} = this.state;
        const {apiKey, sessionId, token} = JSON.parse(opentok);
        history.push(`/videocall?token=${token}&apiKey=${apiKey}&sessionId=${sessionId}`);
    }
    
    rendererCountDown({ seconds }) {
      return <span>{seconds}</span>;
    };

    render () {
        const { code, authenticated } = this.state;
        return (
            <>

                <div className="login-card Vlt-margin--top4">
                    
                        <div className="Vlt-card" style={{minWidth: 360}}>
                            <div className="Vlt-card__header">
                                <h2>Authentication page</h2>
                            </div>
                            <h5 className="Vlt-center">
                                To authenticate, please send back the code below to the same number that sent you the SMS:
                            </h5>
                            <div className="login-code-text letter-spacing">
                                <span>{code}</span>
                            </div>
                            {
                                authenticated ? <div className="Vlt-center">
                                    <h3 className="Vlt-green">Authenticated</h3>
                                    <h4 className="Vlt-green"><span>You will now be redirected to the videocall in: </span>  
                                    <Countdown date={Date.now() + this.redirectTimeout} onComplete={this.onCompleteCountdown.bind(this)} renderer={this.rendererCountDown}></Countdown>
                                    </h4>
                                </div>
                                    :
                                    <div className="Vlt-center">
                                        <div className="Vlt-spinner "></div>
                                    </div>
                            }
                            <div className="Vlt-center">
                            <button className="Vlt-btn Vlt-btn--tertiary"><Link to="/">Go Back to login page</Link></button>
                            </div>
                        </div>

                    
                </div>
                <canvas id="auth-completed-confetti"></canvas>
            </>
        );
    }
}

export default withRouter(Login);
