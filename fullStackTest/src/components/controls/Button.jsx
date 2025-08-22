/**
 * Renders the Button component matching Second Harvest Food Rescue styling.
 * @module components/controls/Button
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 * Simple loading indicator for button
 */
const BeatLoader = ({ size = 10 }) => (
  <span style={{ 
    display: 'inline-block', 
    fontSize: `${size}px`,
    animation: 'pulse 1.5s ease-in-out infinite'
  }}>
    ●●●
  </span>
);

/**
 * Button component constructor.
 * @memberof module:components/controls/Button
 */
class Button extends Component {
  _renderContent(loading, children) {
    if (loading) {
      return <BeatLoader size={10} />;
    } else {
      return children;
    }
  }

  render() {
    const {
      className,
      type,
      onClick,
      disabled,
      children,
      loading,
      name
    } = this.props;
    
    const classAttribute = classnames('button', `button-${type}`, className);
    const onClickFunc = loading ? null : onClick;

    return (
      <button
        className={classAttribute}
        disabled={disabled || loading}
        onClick={onClickFunc}
        type={type === 'submit' ? 'submit' : 'button'}
        name={name}
      >
        {this._renderContent(loading, children)}
      </button>
    );
  }
}

Button.defaultProps = {
  type: 'default',
  disabled: false,
  loading: false
};

/**
 * Button component prop-types.
 * @memberof module:components/controls/Button
 * @name Button.propTypes
 * @type {Object}
 * @property {string} className - HTML class attribute for the button element.
 * @property {string} type=default - Type/style of the button ('default', 'secondary', 'submit').
 * @property {function} onClick - Callback function for the button click event.
 * @property {boolean} disabled=false - Disable the button.
 * @property {boolean} loading=false - Show loading state.
 * @property {string} name - Name attribute for the button.
 */
Button.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf([
    'default',
    'secondary',
    'submit'
  ]),
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  name: PropTypes.string,
  children: PropTypes.node
};

export default Button;
