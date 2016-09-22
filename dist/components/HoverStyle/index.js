var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * Component that supports changing styles while hovering
 *
 * 
 */
/* eslint-disable jsx-a11y/mouse-events-have-key-events */
import React from 'react';

var HoverStyle = function (_React$Component) {
  _inherits(HoverStyle, _React$Component);

  // eslint-disable-line

  function HoverStyle(props) {
    _classCallCheck(this, HoverStyle);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HoverStyle).call(this, props));

    _this.state = {
      hovering: false
    };

    var self = _this;
    self.setHovering = _this.setHovering.bind(_this);
    self.unsetHovering = _this.unsetHovering.bind(_this);
    return _this;
  }

  _createClass(HoverStyle, [{
    key: 'setHovering',
    value: function setHovering() {
      this.setState({ hovering: true });
    }
  }, {
    key: 'unsetHovering',
    value: function unsetHovering() {
      this.setState({ hovering: false });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        _extends({}, this.props, { style: this.state.hovering ? this.props.hoverStyle : this.props.style, onMouseOver: this.setHovering, onMouseOut: this.unsetHovering }),
        this.props.children
      );
    }
  }]);

  return HoverStyle;
}(React.Component);

export default HoverStyle;