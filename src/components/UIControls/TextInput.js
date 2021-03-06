import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../../../static/TextInput.scss'

class TextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: props.value,
            errorMsg: ''
        };
    }

    render() {
        return (
            <div className="TextInput">
                <div className="Label">{this.props.label}</div>
                <div className="Input">
                    <input value={this.state.inputValue} onChange={evt => this.updateInputValue(evt, this.props.validRegex)} />
                </div>
                <span className="Error">{this.state.errorMsg}</span>
            </div>
        );
    }

    updateInputValue(evt, pat) {
        let check = new RegExp('^.*$'); //match anything
        if (pat) {
            check = new RegExp(pat, 'i');
        }
        if (evt.target.value.length < 1) {
            this.setState({
                inputValue: '',
                errorMsg: 'Please enter a value.'
            });
            return;
        }

        if ((!maxLength || evt.target.value.length < this.props.maxLength + 1) && (!pat || check.test(evt.target.value))) {
            this.setState({
                inputValue: evt.target.value,
                errorMsg: ''

            });
            this.props.onChange(evt.target.value);
        }
        else {
            this.setState({ errorMsg: 'Please enter a suitable value.' });
        }
    }
}

TextInput.defaultProps = {
    validRegex: '^[\s\S]*$' //match anything if not specified
}
// Enforce the type of props to send to this component
TextInput.propTypes = {
    validRegex: PropTypes.string,
    label: PropTypes.string,
    maxLength: PropTypes.number
}

export default TextInput;