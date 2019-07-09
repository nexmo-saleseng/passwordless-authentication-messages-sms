import React, { Component } from 'react';
import queryString from 'query-string';
import { OTSession, OTPublisher, OTStreams, OTSubscriber } from 'opentok-react';

class VideoCall extends Component {
    constructor() {
        super();
        this.apiKey = '';
        this.sessionId = '';
        this.token = '';
        this.state = { startVideoCall: false }
    }

    componentDidMount () {
        const values = queryString.parse( this.props.location.search );
        this.apiKey = values.apiKey;
        this.sessionId = values.sessionId;
        this.token = values.token;
        this.setState( { startVideoCall: true } )
    }

    render () {
        const { startVideoCall } = this.state;
        if ( startVideoCall ) {
            return (
                <div className="videocall-container">
                <div className="videocall-header">
                    <h3 style={{color: '#fff'}}>Videocall</h3>
                </div>
                <div className="webcam-container">
                    <OTSession apiKey={this.apiKey} sessionId={this.sessionId} token={this.token}>
                        <OTPublisher />
                        <OTStreams>
                            <OTSubscriber />
                        </OTStreams>
                    </OTSession>
                </div>
                </div>
            );
        }
        return null;
    }
}

export default VideoCall;