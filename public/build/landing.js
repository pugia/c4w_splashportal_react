(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

exports.__esModule = true;

var config = {

	TopNav: {
		menu: {
			myProfile: true,
			internetProfile: false,
			apps: true,
			logout: false
		},
		lang: {
			list: ['eng', 'ita'],
			current: 'eng'
		},
		logo: {
			type: 'img',
			value: '/img/volare_xp_white@2x.png',
			height: 30
		},
		height: 47,
		background: '#1E1E1E'
	},

	Content: {
		background: '/img/bkg@2x.jpg',
		slides: [{
			headline: 'Welcome to our new Portal'
		}],
		go_online_button: {
			background: '#00AB4A'
		}
	},

	Login: {
		order: ['social', 'account'],
		social: {
			list: ['facebook', 'twitter', 'google-plus']
		},
		account: {
			access: [{
				type: 'email',
				label: 'E-mail address',
				validation: function validation(v) {
					var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
					return re.test(v);
				}
			}, {
				type: 'password',
				label: 'Password',
				validation: function validation(v) {
					return v.length >= 5;
				}
			}],
			custom: [{
				type: 'text',
				label: 'First name',
				validation: function validation(v) {
					return v.length > 0;
				}
			}, {
				type: 'text',
				label: 'Last name',
				validation: function validation(v) {
					return v.length > 0;
				}
			}, {
				type: 'date',
				label: 'Birthday',
				validation: function validation(v) {
					var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
					return re.test(v);
				}
			}, {
				type: 'select',
				label: 'Gender',
				options: [{
					value: 'M',
					text: 'Male'
				}, {
					value: 'F',
					text: 'Female'
				}]
			}]
		}
	},

	Apps: {
		weather: {
			icon: '/img/apps/weather@2x.png',
			title: 'Weather',
			subtitle: 'Check the weather around of you'
		},
		info: {
			icon: '/img/apps/info@2x.png',
			title: 'Info',
			subtitle: 'Information about us'
		},
		nearby: {
			icon: '/img/apps/nearby@2x.png',
			title: 'Nearby',
			subtitle: 'Check the POI around of you'
		},
		shop: {
			icon: '/img/apps/shop@2x.png',
			title: 'Shop',
			subtitle: 'Check the shops around of you'
		}
	}

};

exports.config = config;
module.exports = config;

},{}],2:[function(require,module,exports){
'use strict';

var Landing = require('./routes/Landing');

ReactDOM.render(React.createElement(Landing, null), document.getElementById('main'));

},{"./routes/Landing":3}],3:[function(require,module,exports){
(function (global){
'use strict';

var React = global.React;
var General = require('./components/General');
var TopNav = require('./elements/TopNav');
var MainContent = require('./components/MainContent');

var config = require('../config');

var Landing = React.createClass({
  displayName: 'Landing',
  componentDidMount: function componentDidMount() {
    localStorage.removeItem('stored_data');
    this.refs.sliderContainer.style.height = this.refs.content.getFullHeight() - getAbsoluteHeight(this.refs.goOnlineBtn) + 'px';
    document.getElementById('main').style.opacity = 1;
  },
  render: function render() {

    var self = this;

    var style = {
      contentBackground: {
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top center',
        backgroundSize: 'cover',
        backgroundImage: "url(" + config.Content.background + ")"
      },
      sliderContainer: {
        position: 'absolute',
        width: '100%'
      }
    };

    return React.createElement(
      'div',
      { id: 'real-container' },
      React.createElement(TopNav, { config: config.TopNav }),
      React.createElement(
        MainContent,
        { ref: 'content', full: true, contentBackgroundStyle: style.contentBackground },
        React.createElement(
          'div',
          { ref: 'sliderContainer', className: 'sliderContainer', style: style.sliderContainer },
          React.createElement(
            'div',
            { className: 'slide' },
            React.createElement('div', { className: 'image' }),
            React.createElement(
              'div',
              { className: 'details' },
              React.createElement(
                'h3',
                { className: 'headline' },
                'Welcome to our new Portal'
              ),
              React.createElement('p', { className: 'description' }),
              React.createElement('p', { className: 'action' })
            )
          )
        ),
        React.createElement(
          'a',
          { href: '/#/stage01', ref: 'goOnlineBtn', className: 'go-online-button main-button-background' },
          React.createElement(
            'span',
            null,
            'CONNECT TO OUR WIFI'
          ),
          React.createElement('i', { className: 'fa fa-angle-right' })
        )
      )
    );
  }
});

function getAbsoluteHeight(el) {
  // Get the DOM Node if you pass in a string
  el = typeof el === 'string' ? document.querySelector(el) : el;

  var styles = window.getComputedStyle(el);
  var margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);

  return Math.ceil(el.offsetHeight + margin);
}

/* Module.exports instead of normal dom mounting */
module.exports = Landing;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../config":1,"./components/General":4,"./components/MainContent":5,"./elements/TopNav":7}],4:[function(require,module,exports){
(function (global){
'use strict';

var _React$createClass;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.__esModule = true;

var React = global.React;

var Paragraph = React.createClass({
	displayName: 'Paragraph',
	render: function render() {

		var className = '';
		if (this.props.align) {
			className += 'mui--text-' + this.props.align;
		}
		if (this.props.customClass) {
			className += ' ' + this.props.customClass;
		}

		return React.createElement(
			'p',
			{ className: className, style: this.props.style || null },
			this.props.text || this.props.children
		);
	}
});

var centerVerticalElement = function centerVerticalElement(el) {
	var cont = document.getElementById('main-content');
	setTimeout(function () {
		var elBox = el.getBoundingClientRect();
		var contBox = cont.getBoundingClientRect();
		var top = elBox.top + elBox.height - contBox.height / 2 + cont.scrollTop;
		cont.scrollTop = top;
	}, 50);
};

var FieldInput = React.createClass({
	displayName: 'FieldInput',


	refInput: Math.random().toString(36).substring(7),

	getInitialState: function getInitialState() {
		var st = this.props.msg || {
			status: 'info',
			info: '',
			error: '',
			success: ''
		};
		return st;
	},
	getValue: function getValue() {
		return this.refs[this.refInput].value;
	},
	setValue: function setValue(v) {
		if (v) {
			this.refs[this.refInput].value = v;
		}
	},
	focus: function focus() {
		this.refs[this.refInput].focus();
		centerVerticalElement(this.refs[this.refInput]);
	},
	isValid: function isValid() {
		if (typeof this.props.validation == 'function') {
			return this.props.validation(this.getValue());
		} else {
			return true;
		}
	},
	componentDidMount: function componentDidMount() {
		if (this.props.value) {
			this.setValue(this.props.value);
		}
	},
	render: function render() {

		var inputProps = this.props.input || { type: 'text' };
		var style = {};

		if (this.props.msg != false) {
			style.paddingBottom = '15px';
		}

		return React.createElement(
			'div',
			{ className: 'mui-textfield mui-textfield--float-label ' + this.state.status, style: style },
			React.createElement('input', _extends({ ref: this.refInput }, inputProps, { onChange: this.props.handleChange || null })),
			React.createElement(
				'label',
				null,
				this.props.label || 'Field'
			),
			React.createElement(
				'span',
				{ className: 'info' },
				this.state.info
			),
			React.createElement(
				'span',
				{ className: 'error' },
				this.state.error
			),
			React.createElement(
				'span',
				{ className: 'success' },
				this.state.success
			)
		);
	}
});

var FieldPassword = React.createClass({
	displayName: 'FieldPassword',


	refInput: Math.random().toString(36).substring(7),

	getInitialState: function getInitialState() {
		var st = this.props.msg || {
			status: 'info',
			hide: true,
			info: '',
			error: '',
			success: ''
		};
		return st;
	},
	getValue: function getValue() {
		return this.refs[this.refInput].value;
	},
	setValue: function setValue(v) {
		this.refs[this.refInput].value = v;
		this.refs['ghost'].value = v;
	},
	focus: function focus() {
		this.refs[this.refInput].focus();
		centerVerticalElement(this.refs[this.refInput]);
	},
	handleChange: function handleChange(e) {
		var dest_ref = this.state.hide ? this.refInput : 'ghost';
		this.refs[dest_ref].value = e.target.value;
		if (this.props.handleChange) {
			this.props.handleChange();
		}
	},
	isValid: function isValid() {
		if (typeof this.props.validation == 'function') {
			return this.props.validation(this.getValue());
		} else {
			return true;
		}
	},
	toggleChange: function toggleChange() {
		var self = this;
		self.setState({
			hide: !self.state.hide
		});
		setTimeout(function () {
			var dest_ref = !self.state.hide ? self.refInput : 'ghost';
			self.refs[dest_ref].focus();
		}, 100);
	},
	componentDidMount: function componentDidMount() {
		if (this.props.value) {
			this.setValue(this.props.value);
		}
	},
	render: function render() {

		var inputProps = this.props.input || { type: 'text' };
		var style = {};

		if (this.props.msg != false) {
			style.paddingBottom = '15px';
		}

		var classname = 'mui-textfield password mui-textfield--float-label ' + this.state.status;
		if (!this.state.hide) {
			classname += ' showPassword';
		}
		var iClass = !this.state.hide ? 'fa fa-eye' : 'fa fa-eye-slash';

		return React.createElement(
			'div',
			{ className: classname, style: style },
			React.createElement('input', { className: 'ghost', type: 'password', ref: 'ghost', onKeyUp: this.handleChange, onKeyDown: this.handleChange }),
			React.createElement('i', { className: iClass, onClick: this.toggleChange }),
			React.createElement('input', { className: 'real', id: 'inputReal', ref: this.refInput, type: 'text', onKeyUp: this.handleChange, onKeyDown: this.handleChange }),
			React.createElement(
				'label',
				null,
				this.props.label
			),
			React.createElement(
				'span',
				{ className: 'info' },
				this.state.info
			),
			React.createElement(
				'span',
				{ className: 'error' },
				this.state.error
			),
			React.createElement(
				'span',
				{ className: 'success' },
				this.state.success
			)
		);
	}
});

var CheckboxInput = React.createClass((_React$createClass = {
	displayName: 'CheckboxInput',


	refInput: Math.random().toString(36).substring(7),

	getInitialState: function getInitialState() {
		return {
			checked: this.props.checked || false
		};
	},
	componentDidMount: function componentDidMount() {
		this.refInput = Math.random().toString(36).substring(7);
	},


	toggleChange: function toggleChange() {
		this.setState({
			checked: !this.state.checked
		}, function () {
			if (typeof this.props.handleChange == 'function') {
				this.props.handleChange(this.state.checked);
			}
		}.bind(this));
	},

	getValue: function getValue() {
		return this.state.checked;
	},
	setValue: function setValue(v) {
		if (v) {
			this.setState({
				checked: !!v
			});
		}
	}
}, _defineProperty(_React$createClass, 'componentDidMount', function componentDidMount() {
	if (this.props.value) {
		this.setValue(this.props.value);
	}
}), _defineProperty(_React$createClass, 'render', function render() {

	return React.createElement(
		'div',
		{ className: 'mui-checkbox' },
		React.createElement('input', { id: "id_" + this.refInput, ref: this.refInput, type: 'checkbox', value: '1', checked: this.state.checked }),
		React.createElement(
			'label',
			{ htmlFor: "id_" + this.refInput, onClick: this.toggleChange },
			React.createElement(
				'svg',
				{ width: '18px', height: '18px', viewBox: '0 0 18 18' },
				React.createElement(
					'g',
					{ stroke: 'none', strokeWidth: '1', fill: 'none', fillRule: 'evenodd' },
					React.createElement('rect', { className: 'rect', stroke: '#000', x: '1', y: '1', width: '16', height: '16', rx: '3' }),
					React.createElement('path', { className: 'check', fill: '#000', d: 'M13.2174912,5.16790677 C13.0797465,5.02576416 12.912278,4.95473958 12.7154482,4.95473958 C12.5185277,4.95473958 12.3510593,5.02576416 12.2133146,5.16790677 L7.36995945,10.17028 L5.19930334,7.92412768 C5.06146808,7.78198507 4.89409023,7.71096049 4.69726039,7.71096049 C4.50033993,7.71096049 4.33296207,7.78198507 4.19512682,7.92412768 L3.19104091,8.95959127 C3.05320565,9.10173388 2.98433333,9.2743423 2.98433333,9.47741652 C2.98433333,9.68039729 3.05320565,9.85309916 3.19104091,9.99514831 L5.86373997,12.7513692 L6.8679165,13.7868328 C7.00566114,13.9289754 7.17303899,14 7.36995945,14 C7.56678929,14 7.73416715,13.928882 7.8720024,13.7868328 L8.87617893,12.7513692 L14.2215771,7.23892741 C14.3593217,7.0967848 14.4282846,6.92417638 14.4282846,6.72110216 C14.4283753,6.51812139 14.3593217,6.34551297 14.2215771,6.20337036 L13.2174912,5.16790677 Z' })
				)
			),
			React.createElement(
				'span',
				null,
				this.props.label
			)
		),
		React.createElement(
			'span',
			{ className: 'error' },
			'You must accept these terms'
		)
	);
}), _React$createClass));

var FieldSelect = React.createClass({
	displayName: 'FieldSelect',


	refInput: Math.random().toString(36).substring(7),

	getInitialState: function getInitialState() {
		var st = this.props.msg || {
			status: 'info',
			info: '',
			error: '',
			success: ''
		};
		return st;
	},
	getValue: function getValue() {
		return this.refs[this.refInput].value;
	},
	setValue: function setValue(v) {
		if (v) {
			this.refs[this.refInput].value = v;
		}
	},
	focus: function focus() {
		this.refs[this.refInput].focus();
		centerVerticalElement(this.refs[this.refInput]);
	},
	isValid: function isValid() {
		if (typeof this.props.validation == 'function') {
			return this.props.validation(this.getValue());
		} else {
			return true;
		}
	},
	componentDidMount: function componentDidMount() {
		if (this.props.value) {
			this.setValue(this.props.value);
		}
	},
	render: function render() {

		var style = {};

		if (this.props.msg != false) {
			style.paddingBottom = '15px';
		}

		var generateOption = function generateOption(data, index) {
			var opts = {
				key: Math.random().toString(36).substring(7)
			};

			if (data.value) {
				opts.value = data.value;
			}

			return React.createElement(
				'option',
				opts,
				data.text
			);
		};

		return React.createElement(
			'div',
			{ className: 'mui-select ' + this.state.status, style: style },
			React.createElement(
				'label',
				null,
				this.props.label || 'Field'
			),
			React.createElement(
				'select',
				{ ref: this.refInput, onChange: this.props.handleChange || null },
				this.props.options.map(function (op, i) {
					return generateOption(op, i);
				})
			),
			React.createElement(
				'span',
				{ className: 'info' },
				this.state.info
			),
			React.createElement(
				'span',
				{ className: 'error' },
				this.state.error
			),
			React.createElement(
				'span',
				{ className: 'success' },
				this.state.success
			)
		);
	}
});

var Divider = React.createClass({
	displayName: 'Divider',


	render: function render() {

		var cls = this.props.text ? 'divider with-text' : 'divider';

		return React.createElement(
			'div',
			{ className: cls },
			this.props.text
		);
	}

});

var ListButton = React.createClass({
	displayName: 'ListButton',
	render: function render() {

		var icon = null;
		if (this.props.icon) {
			icon = React.createElement(
				'span',
				{ className: 'icon' },
				React.createElement('i', { className: "fa " + this.props.icon })
			);
		}

		var className = 'listButton';
		if (this.props.addClass) {
			className += ' ' + this.props.addClass;
		}

		return React.createElement(
			'button',
			{ className: className, onClick: this.props.onClick || null, value: this.props.value || null },
			React.createElement(
				'span',
				{ className: 'content' },
				icon,
				this.props.children
			),
			React.createElement('i', { className: 'fa fa-angle-right' })
		);
	}
});

exports.FieldInput = FieldInput;
exports.FieldPassword = FieldPassword;
exports.FieldSelect = FieldSelect;
exports.CheckboxInput = CheckboxInput;
exports.Paragraph = Paragraph;
exports.Divider = Divider;
exports.ListButton = ListButton;

module.exports = {
	FieldInput: FieldInput,
	FieldPassword: FieldPassword,
	FieldSelect: FieldSelect,
	CheckboxInput: CheckboxInput,
	Paragraph: Paragraph,
	Divider: Divider,
	ListButton: ListButton
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var React = global.React;

var MainContent = React.createClass({
  displayName: 'MainContent',
  componentDidMount: function componentDidMount() {
    var self = this;
    window.addEventListener("resize", this.updateDimensions);
    document.body.style.overflow = 'auto';
    setTimeout(this.updateDimensions, 100);
  },


  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    this.updateDimensions();
  },


  getFullHeight: function getFullHeight() {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        h = w.innerHeight || e.clientHeight || g.clientHeight,
        c = document.getElementById("real-container").childNodes;
    for (var x in c) {
      h -= c[x].nodeType == '1' && c[x].id != 'main-content' ? c[x].offsetHeight : 0;
    }
    return h;
  },

  updateDimensions: function updateDimensions() {

    if (this.props.full) {
      this.refs.contentBackground.style.minHeight = this.getFullHeight() + 'px';
    }
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'main-content', id: 'main-content', ref: 'mainContent' },
      React.createElement(
        'div',
        { className: 'content-background', ref: 'contentBackground', style: this.props.contentBackgroundStyle || null },
        this.props.children
      )
    );
  }
});

exports.MainContent = MainContent;
module.exports = MainContent;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],6:[function(require,module,exports){
(function (global){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.__esModule = true;

var React = global.React;

var TopNav = React.createClass({
	displayName: 'TopNav',
	getInitialState: function getInitialState() {
		return {
			menuOpen: false
		};
	},
	menuToggle: function menuToggle(status) {
		this.setState({
			menuOpen: Boolean(status)
		});
	},
	render: function render() {

		var height = null;
		var sty = {};
		if (this.props.height) {
			height = this.props.height + 'px';sty.height = height;
		}
		if (this.props.background) {
			sty.background = this.props.background;
		}

		var main = this.props.mainMenu ? React.createElement(MainMenu, { height: height, list: this.props.mainMenu, onMenuToggle: this.menuToggle }) : null;
		var lang = this.props.langMenu ? React.createElement(LangMenu, { height: height, list: this.props.langMenu.list, current: this.props.langMenu.current, onMenuToggle: this.menuToggle }) : null;
		var className = this.props.fixed ? 'fixed' : '';
		var divClassname = "navigation-background topbar";
		if (this.state.menuOpen) {
			divClassname += ' menu-opened';
		}

		return React.createElement(
			'nav',
			{ id: 'mainNav', className: className },
			React.createElement(
				'div',
				{ className: divClassname, style: sty },
				this.props.children
			),
			main,
			lang
		);
	}
});

var TopNavTitle = React.createClass({
	displayName: 'TopNavTitle',
	render: function render() {

		if (this.props.height) {
			var sty = {
				lineHeight: this.props.height + 'px'
			};
		}

		return React.createElement(
			'h2',
			{ className: 'mui--text-center', style: sty || null },
			this.props.children || this.props.text
		);
	}
});

var TopNavLogo = React.createClass({
	displayName: 'TopNavLogo',
	render: function render() {

		var className = 'logo';
		if (this.props.align) {
			className += ' ' + this.props.align;
		}

		if (this.props.height) {
			var sty = {
				height: this.props.height + 'px',
				marginTop: '-' + parseInt(this.props.height / 2) + 'px'
			};
		}

		return React.createElement('img', { className: className, src: this.props.img, style: sty || null });
	}
});

var TopNavButton = React.createClass({
	displayName: 'TopNavButton',
	render: function render() {

		var pr = {
			style: {}
		};

		var className = 'appbar-action mui--appbar-height mui--appbar-line-height';
		if (this.props.side && this.props.side == 'left') {
			pr.style.left = 0;
		}
		if (this.props.side && this.props.side == 'right') {
			pr.style.right = 0;
		}

		if (this.props.onClick) {
			pr.onClick = this.props.onClick;
		}

		return React.createElement(
			'a',
			_extends({ className: className }, pr),
			this.props.children
		);
	}
});

var LoadingBar = React.createClass({
	displayName: 'LoadingBar',


	getInitialState: function getInitialState() {
		return { completed: this.props.completed || 0 };
	},

	/*changes state*/
	handleCompleted: function handleCompleted(value) {

		var completed = value;
		if (completed === NaN || completed < 0) {
			completed = 0;
		};
		if (completed > 100) {
			completed = 100;
		};

		this.setState({ completed: completed });
	},

	updateBar: function updateBar() {
		this.refs.bar.style.width = this.state.completed + '%';
	},

	/*lifecycle methods*/
	componentDidMount: function componentDidMount() {
		this.updateBar();
	},
	componentDidUpdate: function componentDidUpdate() {
		this.updateBar();
	},

	render: function render() {

		var style = {
			transition: "width 200ms"
		};

		return React.createElement(
			'div',
			{ className: 'loading-bar with-appbar-top' },
			React.createElement('span', { className: 'bar', ref: 'bar', style: style })
		);
	}

});

var MainMenu = React.createClass({
	displayName: 'MainMenu',
	getInitialState: function getInitialState() {
		return {
			open: false
		};
	},
	componentDidMount: function componentDidMount() {

		var w = window,
		    d = document,
		    e = d.documentElement,
		    g = d.getElementsByTagName('body')[0],
		    h = w.innerHeight || e.clientHeight || g.clientHeight,
		    c = h - d.getElementsByTagName('nav')[0].offsetHeight;
		this.refs.menu.style.height = h + 'px';

		this.refs.ul.style.height = this.refs.ul.offsetHeight + 'px';
		if (!this.state.open) {
			this.refs.menu.className = this.refs.menu.className + ' close hide';
		}
	},
	handleOpenClose: function handleOpenClose() {

		this.setState({
			open: !this.state.open
		});

		this.refs.menu.className = !this.state.open ? this.refs.menu.className.replace(new RegExp('(?:^|\\s)' + 'close' + '(?:\\s|$)'), ' ') : this.refs.menu.className + ' close';

		if (!this.state.open) {
			this.refs.menu.className = this.refs.menu.className.replace(new RegExp('(?:^|\\s)' + 'hide' + '(?:\\s|$)'), ' ');
			document.body.style.overflow = 'hidden';
		} else {
			var self = this;
			setTimeout(function () {
				self.refs.menu.className += ' hide';
				document.body.style.overflow = 'auto';
			}, 1000);
		}

		if (this.props.onMenuToggle) {
			this.props.onMenuToggle(!this.state.open);
		}
	},
	renderElement: function renderElement(key, value) {

		// TODO TRANSLATE
		var labels = {
			myProfile: 'My Profile',
			internetProfile: 'Internt Profile',
			apps: 'Apps',
			logout: 'Logout'
		};

		var element;
		switch (key) {
			case 'logout':
				element = React.createElement(
					'li',
					{ key: key, onClick: function onClick() {
							return window.location.href = '/landing';
						} },
					labels[key]
				);
				break;
			default:
				if (value) {
					element = React.createElement(
						'li',
						{ key: key },
						labels[key]
					);
				}
		}

		return element;
	},
	render: function render() {
		var _this = this;

		var btnClass = "hamburger hamburger--slider ";
		if (this.state.open) {
			btnClass += 'is-active';
		}

		var sty = {
			div: {},
			button: {}
		};

		if (this.props.height) {
			var h = this.props.height;
			sty.div.height = h;
			sty.div.top = '-' + h;
			sty.button.height = h;
			sty.button.lineHeight = h;
		}

		return React.createElement(
			'div',
			{ ref: 'menu', className: 'main-menu' },
			React.createElement(
				'div',
				{ className: 'button', style: sty.div, onClick: this.handleOpenClose },
				React.createElement(
					'button',
					{ ref: 'openClose', style: sty.button, className: btnClass },
					React.createElement(
						'span',
						{ className: 'hamburger-box' },
						React.createElement('span', { className: 'hamburger-inner' })
					)
				)
			),
			React.createElement(
				'ul',
				{ ref: 'ul' },
				mapObject(this.props.list, function (k, v) {
					return _this.renderElement(k, v);
				})
			),
			React.createElement('span', { className: 'overlay', onClick: this.handleOpenClose })
		);
	}
});

var LangMenu = React.createClass({
	displayName: 'LangMenu',
	getInitialState: function getInitialState() {
		return {
			open: false
		};
	},
	componentDidMount: function componentDidMount() {

		var w = window,
		    d = document,
		    e = d.documentElement,
		    g = d.getElementsByTagName('body')[0],
		    h = w.innerHeight || e.clientHeight || g.clientHeight,
		    c = h - d.getElementsByTagName('nav')[0].offsetHeight;
		this.refs.menu.style.height = h + 'px';

		this.refs.ul.style.height = this.refs.ul.offsetHeight + 'px';
		if (!this.state.open) {
			this.refs.menu.className = this.refs.menu.className + ' close hide';
		}
	},
	handleOpenClose: function handleOpenClose(e) {

		this.setState({
			open: !this.state.open
		});

		e.target.blur();

		this.refs.menu.className = !this.state.open ? this.refs.menu.className.replace(new RegExp('(?:^|\\s)' + 'close' + '(?:\\s|$)'), ' ') : this.refs.menu.className + ' close';

		if (!this.state.open) {
			this.refs.menu.className = this.refs.menu.className.replace(new RegExp('(?:^|\\s)' + 'hide' + '(?:\\s|$)'), ' ');
			document.body.style.overflow = 'hidden';
		} else {
			var self = this;
			setTimeout(function () {
				self.refs.menu.className += ' hide';
				document.body.style.overflow = 'auto';
			}, 1000);
		}

		if (this.props.onMenuToggle) {
			this.props.onMenuToggle(!this.state.open);
		}
	},
	handleChangeLanguage: function handleChangeLanguage(e) {
		if (this.props.handleChangeLanguage) {
			this.props.handleChangeLanguage(e.target.lang);
		}
	},
	render: function render() {

		var self = this;
		var sty = {
			div: {},
			button: {}
		};

		if (this.props.height) {
			var h = this.props.height;
			sty.div.height = h;
			sty.div.top = '-' + h;
			sty.button.height = h;
			sty.button.lineHeight = h;
		}

		return React.createElement(
			'div',
			{ ref: 'menu', className: 'lang-menu' },
			React.createElement(
				'div',
				{ className: 'button', style: sty.div, onClick: this.handleOpenClose },
				React.createElement(
					'button',
					{ ref: 'openClose', style: sty.button },
					React.createElement('i', { className: 'fa fa-globe' }),
					React.createElement(
						'span',
						{ ref: 'selected' },
						this.props.current
					)
				)
			),
			React.createElement(
				'ul',
				{ ref: 'ul' },
				this.props.list.map(function (lang) {
					return React.createElement(
						'li',
						{ key: lang, lang: lang, onClick: self.handleChangeLanguage },
						lang
					);
				})
			),
			React.createElement('span', { className: 'overlay', onClick: this.handleOpenClose })
		);
	}
});

function mapObject(object, callback) {
	return Object.keys(object).map(function (key) {
		return callback(key, object[key]);
	});
}

exports.Bar = TopNav;
exports.Title = TopNavTitle;
exports.Logo = TopNavLogo;
exports.Button = TopNavButton;
exports.Loading = LoadingBar;

module.exports = {
	Bar: TopNav,
	Title: TopNavTitle,
	Logo: TopNavLogo,
	Button: TopNavButton,
	Loading: LoadingBar
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],7:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;
var TopNavComponent = require('../components/TopNav');

var React = global.React;

var TopNav = React.createClass({
	displayName: 'TopNav',
	render: function render() {

		var config = this.props.config;

		var logo = null;
		if (config.logo) {
			if (config.logo.type == 'img') {
				logo = React.createElement(TopNavComponent.Logo, { align: 'center', img: config.logo.value, height: config.logo.height || null });
			} else {
				logo = React.createElement(TopNavComponent.Title, { text: config.logo.value, height: config.logo.height || config.height || null });
			}
		}

		return React.createElement(
			TopNavComponent.Bar,
			{ mainMenu: config.menu, langMenu: config.lang, height: config.height || null, background: config.background || null },
			logo
		);
	}
});

exports.TopNav = TopNav;
module.exports = TopNav;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../components/TopNav":6}]},{},[2])


//# sourceMappingURL=landing.js.map
