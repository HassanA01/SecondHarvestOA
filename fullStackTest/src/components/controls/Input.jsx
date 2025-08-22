/**
 * Renders the Input component matching Second Harvest Food Rescue styling.
 * @module components/controls/Input
 */

import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * Input component constructor.
 * @memberof module:components/controls/Input
 */
class Input extends Component {
  _getLabelRenderer() {
    return (text, props) => <label {...props}>{text}</label>;
  }

  _getInputRenderer(Tag) {
    return props => <Tag {...props} />;
  }

  _getErrorRenderer() {
    return text => <span className="error-message">{text}</span>;
  }

  render() {
    const {
      className,
      labelText,
      labelProps,
      inputTag: Tag,
      inputProps,
      isValid,
      error,
      renderLabel,
      renderInput,
      renderError
    } = this.props;

    const classAttribute = classnames(
      'input-container',
      { 'input-error': !isValid },
      className
    );

    const { id } = inputProps;
    const labelRenderer = renderLabel || this._getLabelRenderer();
    const inputRenderer = renderInput || this._getInputRenderer(Tag);
    const errorRenderer = renderError || this._getErrorRenderer();

    return (
      <div className={classAttribute}>
        {labelRenderer(labelText, { htmlFor: id, ...labelProps })}
        <div className="input-accessory-container">
          {inputRenderer(inputProps)}
        </div>
        {!isValid && errorRenderer(error)}
      </div>
    );
  }
}

Input.defaultProps = {
  labelText: '',
  labelProps: {},
  inputTag: 'input',
  inputProps: {},
  isValid: true,
  error: ''
};

/**
 * Input component prop-types.
 * @memberof module:components/controls/Input
 * @name Input.propTypes
 * @type {Object}
 * @property {string} className - HTML class attribute for the input container.
 * @property {string} labelText - The label text.
 * @property {object} labelProps - Props to apply to the label element.
 * @property {string} inputTag - Element tag for the input. Valid values are 'input' and 'textarea'.
 * @property {object} inputProps - Props to apply to the input/textarea element.
 * @property {object} inputProps.id - The id attribute for the input, required to associate with label.
 * @property {object} inputProps.name - The name attribute for the input (required).
 * @property {object} inputProps.value - The value attribute for the input (required).
 * @property {string} inputProps.placeholder - placeholder text
 * @property {boolean} isValid=true - Specifies whether an error should be displayed.
 * @property {string} error - The error message to display if the isValid prop is false.
 * @property {function} renderLabel - Optional render function for custom label component.
 * @property {function} renderInput - Optional render function for custom input component.
 * @property {function} renderError - Optional render function for custom error component.
 */
Input.propTypes = {
  className: PropTypes.string,
  labelText: PropTypes.string,
  labelProps: PropTypes.object,
  inputTag: PropTypes.oneOf(['input', 'textarea']),
  inputProps: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    placeholder: PropTypes.string
  }),
  isValid: PropTypes.bool,
  error: PropTypes.string,
  renderLabel: PropTypes.func,
  renderInput: PropTypes.func,
  renderError: PropTypes.func
};

export default Input;
