import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '../../../static/TextInput.scss'

class TextArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputValue: props.value,
            errorMsg: ''
        };
    }

    render() {
        return (
            <div className="TextArea">
                <div className="Label">{this.props.label}</div>
                <div className="Input">
                    <textarea rows="4" cols="30" value={this.state.inputValue} onChange={evt => this.updateInputValue(evt, this.props.validRegex)} />
                </div>
                <span className="Error">{this.state.errorMsg}</span>
            </div>
        );
    }

    updateInputValue(evt, pat) {
        let check = new RegExp(pat, 'i');
        if (this.props.required && evt.target.value.length < 1) {
            this.setState({
                inputValue: '',
                errorMsg: 'Please enter a value.'
            });
            return;
        }
        if ((!this.props.maxLength || evt.target.value.length < this.props.maxLength + 1) && (check.test(evt.target.value))) {
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

TextArea.defaultProps = {
    validRegex: '^.*$' //match anything if not specified
}
// Enforce the type of props to send to this component
TextArea.propTypes = {
    validRegex: PropTypes.string,
    label: PropTypes.string,
    maxLength: PropTypes.number
}


export default TextArea;