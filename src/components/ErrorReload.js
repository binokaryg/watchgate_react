import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from './UIControls/Button';
import '../../static/ErrorReload.scss';
class ErrorReload extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        return (
            <div className='popup'>
                <div className='popup_inner'>
                    <span className="close" onClick={this.props.closePopup}>{String.fromCodePoint(0xd7)}</span>                    
                    <h1>{this.props.text}</h1>
                    <hr className="divider"/>
                    <div className="Message">The data could not be fetched at the moment. Please try again by clicking the Reload button below. If error persists try again after some time.</div>
                    <div className='Settings'>
                        <div className="ok">
                            <Button onClick={this.props.reload} label={"Reload"}></Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ErrorReload.propTypes = {
    text: PropTypes.string,
    reload: PropTypes.func,
    closePopup: PropTypes.func
}

export default ErrorReload;