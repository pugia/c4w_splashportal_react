var babelHelpers = require('./babel-helpers.js');
/**
 * MUI React button module
 * @module react/button
 */

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = babelHelpers.interopRequireDefault(_react);

var _jqLite = require('../js/lib/jqLite');

var jqLite = babelHelpers.interopRequireWildcard(_jqLite);

var _util = require('../js/lib/util');

var util = babelHelpers.interopRequireWildcard(_util);


var PropTypes = _react2.default.PropTypes,
    btnClass = 'mui-btn',
    btnAttrs = { color: 1, variant: 1, size: 1 };

/**
 * Button element
 * @class
 */

var Button = function (_React$Component) {
  babelHelpers.inherits(Button, _React$Component);

  function Button(props) {
    babelHelpers.classCallCheck(this, Button);

    var _this = babelHelpers.possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this, props));

    _this.state = {
      ripple: null
    };


    var cb = util.callback;
    _this.onMouseDownCB = cb(_this, 'onMouseDown');
    _this.onMouseUpCB = cb(_this, 'onMouseUp');
    _this.onMouseLeaveCB = cb(_this, 'onMouseLeave');
    _this.onTouchStartCB = cb(_this, 'onTouchStart');
    _this.onTouchEndCB = cb(_this, 'onTouchEnd');
    return _this;
  }

  babelHelpers.createClass(Button, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      // disable MUI js
      var el = this.refs.buttonEl;
      el._muiDropdown = true;
      el._muiRipple = true;
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(ev) {
      this.showRipple(ev);

      // execute callback
      var fn = this.props.onMouseDown;
      fn && fn(ev);
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(ev) {
      this.hideRipple(ev);

      // execute callback
      var fn = this.props.onMouseUp;
      fn && fn(ev);
    }
  }, {
    key: 'onMouseLeave',
    value: function onMouseLeave(ev) {
      this.hideRipple(ev);

      // execute callback
      var fn = this.props.onMouseLeave;
      fn && fn(ev);
    }
  }, {
    key: 'onTouchStart',
    value: function onTouchStart(ev) {
      this.showRipple(ev);

      // execute callback
      var fn = this.props.onTouchStart;
      fn && fn(ev);
    }
  }, {
    key: 'onTouchEnd',
    value: function onTouchEnd(ev) {
      this.hideRipple(ev);

      // execute callback
      var fn = this.props.onTouchEnd;
      fn && fn(ev);
    }
  }, {
    key: 'showRipple',
    value: function showRipple(ev) {
      var buttonEl = this.refs.buttonEl;

      // de-dupe touch events
      if ('ontouchstart' in buttonEl && ev.type === 'mousedown') return;

      // get (x, y) position of click
      var offset = jqLite.offset(this.refs.buttonEl),
          clickEv = void 0;

      if (ev.type === 'touchstart' && ev.touches) clickEv = ev.touches[0];else clickEv = ev;

      // choose diameter
      var diameter = Math.sqrt(offset.width * offset.width + offset.height * offset.height) * 2;

      // add ripple to state
      this.setState({
        ripple: {
          xPos: Math.round(clickEv.pageX - offset.left),
          yPos: Math.round(clickEv.pageY - offset.top),
          diameter: diameter
        }
      });
    }
  }, {
    key: 'hideRipple',
    value: function hideRipple(ev) {
      this.setState({
        ripple: null
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      var _this2 = this;

      var ripple = this.state.ripple;

      // trigger ripple animation
      if (ripple && !prevState.ripple) {
        util.requestAnimationFrame(function () {
          ripple.isAnimating = true;
          _this2.setState({ ripple: ripple });
        });
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var cls = btnClass,
          rippleCls = 'mui-ripple',
          rippleStyle = void 0,
          k = void 0,
          v = void 0;

      var ripple = this.state.ripple;
      var _props = this.props,
          color = _props.color,
          size = _props.size,
          variant = _props.variant,
          reactProps = babelHelpers.objectWithoutProperties(_props, ['color', 'size', 'variant']);

      // button attributes

      for (k in btnAttrs) {
        v = this.props[k];
        if (v !== 'default') cls += ' ' + btnClass + '--' + v;
      }

      // ripple attributes
      if (ripple) {
        rippleCls += ' mui--is-visible';

        // css transform
        var tCss = 'translate(-50%, -50%) translate(' + ripple.xPos + 'px,' + ripple.yPos + 'px)';

        // handle animation
        if (ripple.isAnimating) rippleCls += ' mui--is-animating';else tCss = tCss + ' scale(0.0001, 0.0001)';

        // style attrs
        rippleStyle = {
          width: ripple.diameter,
          height: ripple.diameter,
          transform: tCss
        };
      }

      return _react2.default.createElement(
        'button',
        babelHelpers.extends({}, reactProps, {
          ref: 'buttonEl',
          className: cls + ' ' + this.props.className,
          onMouseUp: this.onMouseUpCB,
          onMouseDown: this.onMouseDownCB,
          onMouseLeave: this.onMouseLeaveCB,
          onTouchStart: this.onTouchStartCB,
          onTouchEnd: this.onTouchEndCB
        }),
        this.props.children,
        _react2.default.createElement(
          'span',
          { className: 'mui-btn__ripple-container' },
          _react2.default.createElement('span', { ref: 'rippleEl', className: rippleCls, style: rippleStyle })
        )
      );
    }
  }]);
  return Button;
}(_react2.default.Component);

/** Define module API */


Button.propTypes = {
  color: PropTypes.oneOf(['default', 'primary', 'danger', 'dark', 'accent']),
  size: PropTypes.oneOf(['default', 'small', 'large']),
  variant: PropTypes.oneOf(['default', 'flat', 'raised', 'fab'])
};
Button.defaultProps = {
  className: '',
  color: 'default',
  size: 'default',
  variant: 'default'
};
exports.default = Button;
module.exports = exports['default'];