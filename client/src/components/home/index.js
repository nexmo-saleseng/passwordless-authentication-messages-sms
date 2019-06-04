import React, { Component } from 'react';
import axios from 'axios';

class Home extends Component {

    constructor() {
        super();
        this.state = { recipient: '', smsSent: false }
        this.handleChange = this.handleChange.bind( this );
        this.sendSMS = this.sendSMS.bind( this );
    }

    handleChange ( event ) {
        this.setState( { recipient: event.target.value } );
    }

    sendSMS () {
        const { recipient,smsSent } = this.state;
        if ( recipient && !smsSent) {
            axios.post( 'https://3etfelg62j.execute-api.eu-west-2.amazonaws.com/dev/auth/create', { recipient } ).then( () => {
                this.setState( { smsSent: true } );
            } );
        }

    }

    render () {
        const { recipient, smsSent } = this.state;
        return (
            <div className="Vlt-grid Vlt-margin--top4" style={{ justifyContent: 'center' }}>
                <div className="Vlt-col Vlt-col--1of2">
                    <div className="Vlt-card">
                        <div className="Vlt-card__header">
                            <h2>Type your phone number to login:</h2>
                        </div>
                        <div className="Vlt-form__element">
                            <label className="Vlt-label" htmlFor="phone-number-input">Insert your phone number. </label>
                            <div className="Vlt-input">
                                <input value={recipient} style={{ width: 250 }} type="number" id="phone-number-input" onChange={this.handleChange} />
                            </div>
                            <button className="Vlt-btn Vlt-btn--secondary Vlt-btn--app" onClick={this.sendSMS}>Send</button>
                        </div>
                        {
                            smsSent && <div className="Vlt-callout Vlt-callout--good">
                                <i></i>
                                <div className="Vlt-callout__content">
                                    You will get an SMS shortly with a link to use for logging in
                            </div>
                            </div>
                        }

                    </div>
                </div>
            </div>
        );
    }
}

export default Home;
