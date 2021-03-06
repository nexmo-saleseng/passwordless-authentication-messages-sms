import React, { Component } from 'react';
import axios from 'axios';
import Header from '../header'
import treatmentIcon from './treatment-64.png'

import {cloudfrontDistribution} from '../../constants';

class Home extends Component {
    constructor() {
        super();
        this.state = { recipient: '', smsSent: false, apiKey: '', sessionId: '', token: '' }
        this.handleChange = this.handleChange.bind( this );
        this.sendSMS = this.sendSMS.bind( this );
    }

    handleChange ( event ) {
        this.setState( { recipient: event.target.value } );
    }

    sendSMS () {
        const { recipient,smsSent } = this.state;
        if ( recipient && !smsSent) {
            axios.post( 'https://auuubonz7g.execute-api.eu-west-2.amazonaws.com/dev/auth/create-auth-code', { recipient } ).then( (res) => {
                const {opentok} = res.data;
                this.setState( { smsSent: true, apiKey: opentok.apiKey, sessionId: opentok.sessionId,token: opentok.adminToken } );
            } );
        }

    }

    render () {
        const { recipient, smsSent, apiKey, sessionId, token } = this.state;
        const redirectVideoCallUrl = `${cloudfrontDistribution}/videocall?token=${token}&apiKey=${apiKey}&sessionId=${sessionId}`;
        return (
            <div>
                <Header></Header>
                <div className="Vlt-grid Vlt-margin--top4" style={{ justifyContent: 'center' }}>
                <div className="Vlt-col Vlt-col--1of2">
                    <div className="Vlt-card">
                        <div className="Vlt-card__header">
                            <h2>Send appointment reminder to your patient</h2>
                        </div>
                        <div className="Vlt-form__element">
                            <div>
                                <img src={treatmentIcon} alt="treatment-patient"></img>
                                <h4>Patient name</h4>
                            </div>
                            <div style={{margin: "15px 0"}}>
                                <label className="Vlt-label" htmlFor="phone-number-input">Insert user's phone number. </label>
                                <div className="Vlt-input">
                                    <input value={recipient} style={{ width: 250,margin: 0 }} type="number" id="phone-number-input" onChange={this.handleChange} />
                                </div>
                            </div>
                            <button className="Vlt-btn Vlt-btn--primary Vlt-btn--app" onClick={this.sendSMS}>Send</button>
                        </div>
                        {
                            smsSent && <><div className="Vlt-callout Vlt-callout--good">
                                <i></i>
                                <div className="Vlt-callout__content">
                                    Great! Now you can join the videocall
                                </div>
                            </div>
                            <div className="Vlt-center">
                                <a style={{margin: 0}} className="Vlt-btn Vlt-btn--secondary" target="_blank" href={redirectVideoCallUrl} rel="noopener noreferrer">Join videocall</a>
                            </div>
                            </>
                        }

                    </div>
                </div>
            </div>
            </div>
            
        );
    }
}

export default Home;
