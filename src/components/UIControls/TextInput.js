import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../../../static/TextInput.scss'

class TextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: props.safeBalance,
            errorMsg: ''
        };
    }

    render() {
        return (
            <div className="TextInput">
            <div className="Label">{this.props.label}</div>
            <div className = "Input">
            <input value={this.state.inputValue} onChange={evt => this.updateInputValue(evt, this.props.validRegex)} />
            </div>
            <span className="Error">{this.state.errorMsg}</span>
            </div>
        );
    }

    updateInputValue(evt, check) {
        if(evt.target.value.length < 1)
        { this.setState({
            inputValue: '',
            errorMsg: 'Please enter an amount.'
        });
            return;
        }
        if (evt.target.value.length < 6 && check.test(evt.target.value)) {
            this.setState({
                inputValue: evt.target.value,
                errorMsg: ''
                
            });
            this.props.onChange(evt.target.value);
        }
        else {
            this.setState({errorMsg: 'Please enter a suitable amount.'});
        }
    }
}

TextInput.defaultProps = {
    validRegex: /^[\s\S]*$/ //match anything if not specified
}
// Enforce the type of props to send to this component
TextInput.propTypes = {
    validRegex: PropTypes.object,
    label: PropTypes.string
}


export default TextInput;