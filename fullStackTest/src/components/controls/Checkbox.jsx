/**
 * Renders the Checkbox component matching Second Harvest Food Rescue styling.
 * @module components/controls/Checkbox
 */

import React, { Component } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

/**
 * Check if event is spacebar key
 * @param {Event} e - Keyboard event
 * @returns {boolean} True if spacebar was pressed
 */
const isSpacebar = (e) => e.key === ' ' || e.keyCode === 32;

/**
 * Checkbox component constructor.
 * @memberof module:components/controls/Checkbox
 */
class Checkbox extends Component {
  constructor() {
    super();
    this._handleOnKeyDown = this._handleOnKeyDown.bind(this);
  }

  _handleOnKeyDown(e) {
    const { disabled, name, checked } = this.props;
    if (isSpacebar(e) && !disabled) {
      e.preventDefault();
      this.props.onChange({ target: { name: name, checked: !checked } });
    }
  }

  _renderError(error, isValid) {
    if (!isValid) {
      return <span className="checkbox-error">{error}</span>;
    } else {
      return null;
    }
  }

  render() {
    const {
      className,
      label,
      onChange,
      disabled,
      checked,
      name,
      error,
      isValid
    } = this.props;
    
    const disabledAttribute = disabled ? 'disabled' : undefined;
    const classAttribute = classnames(
      'checkbox',
      className,
      checked ? 'checked' : null,
      disabledAttribute
    );

    return (
      <div className="checkbox-container">
        <label disabled={disabledAttribute} className={classAttribute}>
          <input
            type="checkbox"
            disabled={disabled}
            onChange={onChange}
            checked={checked}
            name={name}
          />
          <span
            role="checkbox"
            aria-checked={checked}
            className="styled-checkbox"
            tabIndex={0}
            onKeyDown={this._handleOnKeyDown}
            title={name}
          >
          </span>
          <span className="checkbox-label">{label}</span>
        </label>
        {this._renderError(error, isValid)}
      </div>
    );
  }
}

Checkbox.defaultProps = {
  disabled: false,
  isValid: true
};

/**
 * Checkbox component prop-types.
 * @memberof module:components/controls/Checkbox
 * @name Checkbox.propTypes
 * @type {Object}
 * @property {string} className - HTML class attribute for the checkbox container.
 * @property {function} onChange - Callback function for the checkbox change event.
 * @property {boolean} disabled=false - Disable the checkbox.
 * @property {string} name - Name attribute for the checkbox input.
 * @property {string} label - Label text for the checkbox.
 * @property {boolean} checked - Whether the checkbox is checked or not.
 * @property {string} error - Any error message to display.
 * @property {boolean} isValid=true - Specifies whether an error should be displayed.
 */
Checkbox.propTypes = {
  className: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  label: PropTypes.node,
  checked: PropTypes.bool,
  error: PropTypes.string,
  isValid: PropTypes.bool
};

export default Checkbox;
