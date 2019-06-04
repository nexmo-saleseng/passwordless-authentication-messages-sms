import React, { Component } from 'react';
import queryString from 'query-string';
import axios from 'axios';
import ConfettiGenerator from "confetti-js";

class Login extends Component {
    constructor() {
        super();
        this.state = { auth: '', code: '' };
        this._confettiEffect = null;
    }
    componentDidMount () {
        const values = queryString.parse( this.props.location.search );
        const intervalId = setInterval( this.checkAuth.bind( this ), 2000, 1 );
        console.log( values.filter );
        console.log( values );
        this.setState( {
            auth: values.auth,
            code: values.code,
            intervalId,
            authenticated: false
        } )
        this._confettiEffect = new ConfettiGenerator( { target: 'auth-completed-confetti' } );
    }

    componentWillUnmount () {
        clearInterval( this.state.intervalId );
    }

    checkAuth () {
        const { auth, intervalId } = this.state;
        axios.post( 'https://3etfelg62j.execute-api.eu-west-2.amazonaws.com/dev/auth/check-auth', { authCode: auth } ).then( ( res ) => {
            console.log( '[checkAuth]', res );
            if ( res && res.data ) {
                const { authenticated } = res.data.authResult;
                this.setState( {
                    authenticated
                } )
                if ( authenticated ) {
                    this._confettiEffect.render();
                    clearInterval( intervalId )
                }
            }
        } );
    }

    // todo devo fare un timer che chiede se il codice e' stato mandato

    render () {
        const { code, authenticated } = this.state;
        return (
            <>

                <div className="login-card Vlt-margin--top4">
                    
                        <div className="Vlt-card" style={{minWidth: 360}}>
                            <div className="Vlt-card__header">
                                <h2>Login page</h2>
                            </div>
                            <h5 className="Vlt-center">
                                To authenticate, please send an SMS with the following code:
                        </h5>
                            <div className="login-code-text letter-spacing">
                                <span>{code}</span>
                            </div>
                            {
                                authenticated ? <div className="Vlt-center"><h3 className="Vlt-green">Authenticated</h3></div>
                                    :
                                    <div className="Vlt-center">
                                        <div className="Vlt-spinner "></div>
                                    </div>
                            }

                        </div>

                    
                </div>
                <canvas id="auth-completed-confetti"></canvas>
            </>
        );
    }
}

export default Login;
