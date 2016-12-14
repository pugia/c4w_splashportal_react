(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Landing = require('./routes/Landing');
var Success = require('./routes/Success');
var Cookies = require('js-cookie');

var App = React.createClass({
  displayName: 'App',
  getInitialState: function getInitialState() {
    return {
      loading: true,
      logged: false
    };
  },
  componentDidMount: function componentDidMount() {

    var self = this;

    if (Cookies.get('doLogin')) {

      var location = JSON.parse(JSON.stringify(window.location));
      Cookies.set('location', location);

      var toSend = Cookies.getJSON('doLogin');Cookies.remove('doLogin');
      toSend['ap_redirect'] = location.href;

      $.ajax({
        url: endpoint_login,
        type: 'POST',
        cache: false,
        data: JSON.stringify(toSend),
        async: true,
        success: function success(response) {

          Cookies.set('preLogin', response.session.preLogin);
          Cookies.set('logout', response.logout);

          setTimeout(function () {
            window.location.href = response.login.url;
          }, 200);
        },
        error: function error(e) {

          console.log('url: ' + endpoint_login);
          console.log('data: ' + JSON.stringify(toSend));
          console.log('error: ' + JSON.stringify(e));

          $('#error').addClass('open');
          console.log('error', e);
        }
      });
    } else {

      if (Cookies.get('preLogin') || Cookies.get('logout')) {

        $.ajax({
          url: endpoint_isLogged,
          type: 'POST',
          cache: false,
          data: JSON.stringify(Cookies.getJSON('preLogin')),
          async: true,
          success: function success(response) {

            if (response.loginStatus.isLogged === true && response.postAuth.msg == 'SUCCESS') {

              self.setState({
                loading: false,
                logged: true
              });
            } else {

              Cookies.set('login_error', response.postAuth.msg);
              Cookies.remove('preLogin');
              Cookies.remove('logout');

              setTimeout(function () {
                window.location.href = '/stage/#/01';
              }, 200);
            }
          },
          error: function error(e) {

            // Cookies.remove('preLogin');
            // Cookies.remove('logout');
            self.setState({
              loading: false,
              logged: false
            });

            $('#error').addClass('open');
            console.log('error', e);
          }
        });
      } else {

        Cookies.remove('preLogin');
        Cookies.remove('logout');
        self.setState({
          loading: false,
          logged: false
        });
      }
    }
  },
  render: function render() {
    var Child = null;

    if (!this.state.loading) {
      Child = this.state.logged ? React.createElement(Success, null) : React.createElement(Landing, null);
    }

    return React.createElement(
      'div',
      null,
      Child
    );
  }
});

ReactDOM.render(React.createElement(App, null), document.getElementById('main'));

},{"./routes/Landing":2,"./routes/Success":3,"js-cookie":9}],2:[function(require,module,exports){
(function (global){
'use strict';

var React = global.React;
var General = require('./components/General');
var TopNav = require('./elements/TopNav');
var MainContent = require('./components/MainContent');
var Cookies = require('js-cookie');

var Landing = React.createClass({
  displayName: 'Landing',
  getInitialState: function getInitialState() {

    return {
      lang: Cookies.get('lang') || 'eng',
      config: null
    };
  },
  componentWillMount: function componentWillMount() {

    var params = parseQueryString();
    if (params.res == 'notyet') {
      Cookies.remove('location');
    }
    Cookies.remove('logout');
    Cookies.remove('config_stage');
    Cookies.remove('preLogin');
  },
  loadConfig: function loadConfig() {

    console.log('loadConfig');

    var self = this;

    var location = Cookies.getJSON('location');

    if (!location) {
      location = JSON.parse(JSON.stringify(window.location));
      Cookies.set('location', location);
    } else {
      if (window.location.search != '' && window.location.search != location.search) {
        location = JSON.parse(JSON.stringify(window.location));
        Cookies.set('location', location);
      }
    }

    var toSend = {
      ap_redirect: location.href
    };

    $.ajax({
      url: endpoint_landing,
      type: 'POST',
      cache: false,
      data: JSON.stringify(toSend),
      async: true,
      success: function success(response) {

        General.LoadingOverlay.close();
        Cookies.set('session', response.session);
        self.setState({ config: JSON.parse(JSON.stringify(response.config)) });
        setTimeout(function () {
          document.getElementById('main').style.opacity = 1;
        }, 200);
      },
      error: function error(e) {

        console.log('url: ' + endpoint_landing);
        console.log('data: ' + JSON.stringify(toSend));
        console.log('error: ' + JSON.stringify(e));

        $('#error').addClass('open');
        console.log('error', e);
      }
    });
  },
  updateSliderContainerHeight: function updateSliderContainerHeight() {

    if (this.refs.sliderContainer != undefined) {
      this.refs.sliderContainer.style.height = this.refs.content.getFullHeight() - getAbsoluteHeight(this.refs.goOnlineBtn) + 'px';
    }
  },
  componentDidMount: function componentDidMount() {

    this.loadConfig();
    window.addEventListener("resize", this.updateSliderContainerHeight);
    setTimeout(this.updateSliderContainerHeight, 100);
  },


  componentWillUnmount: function componentWillUnmount() {

    window.removeEventListener("resize", this.updateSliderContainerHeight);
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {

    this.updateSliderContainerHeight();
  },
  next: function next() {

    General.LoadingOverlay.open();
    setTimeout(function () {
      return window.location.href = '/stage/#/01';
    }, 300);
  },
  render: function render() {

    console.log('render landing');

    var self = this,
        content = null;

    if (self.state.config) {

      var config = self.state.config;

      var style = {
        sliderContainer: {
          position: 'absolute',
          width: '100%'
        },
        contentBackgroundStyle: {
          height: '100%',
          background: 'transparent'
        }
      };

      document.getElementById('main').style.backgroundImage = "url(" + config.Content.background + ")";

      content = React.createElement(
        'div',
        { id: 'real-container' },
        React.createElement(TopNav, { config: config.TopNav }),
        React.createElement(
          MainContent,
          { ref: 'content', full: true, contentBackgroundStyle: style.contentBackgroundStyle },
          React.createElement(
            'div',
            { ref: 'sliderContainer', className: 'sliderContainer', style: style.sliderContainer },
            config.Content.slides.map(function (s) {
              return React.createElement(Slide, s);
            })
          ),
          React.createElement(
            'button',
            { onClick: self.next, ref: 'goOnlineBtn', className: 'go-online-button main-button', style: config.Content.go_online_button.style },
            React.createElement(
              'span',
              null,
              config.Content.go_online_button.labels.title
            ),
            React.createElement('i', { className: 'fa fa-angle-right' })
          )
        )
      );
    }

    return content;
  }
});

var Slide = React.createClass({
  displayName: 'Slide',
  render: function render() {
    return React.createElement(
      'div',
      { className: 'slide' },
      React.createElement('div', { className: 'image' }),
      React.createElement(
        'div',
        { className: 'details' },
        React.createElement(
          'h3',
          { className: 'headline' },
          this.props.headline
        ),
        React.createElement('p', { className: 'description' }),
        React.createElement('p', { className: 'action' })
      )
    );
  }
});

function getAbsoluteHeight(el) {

  console.log('getAbsoluteHeight');

  // Get the DOM Node if you pass in a string
  el = typeof el === 'string' ? document.querySelector(el) : el;

  var styles = window.getComputedStyle(el);
  var margin = parseFloat(styles['marginTop']) + parseFloat(styles['marginBottom']);

  return Math.ceil(el.offsetHeight + margin);
}

var parseQueryString = function parseQueryString() {

  var str = window.location.search;
  var objURL = {};

  str.replace(new RegExp("([^?=&]+)(=([^&]*))?", "g"), function ($0, $1, $2, $3) {
    objURL[$1] = $3;
  });
  return objURL;
};

/* Module.exports instead of normal dom mounting */
module.exports = Landing;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./components/General":5,"./components/MainContent":6,"./elements/TopNav":8,"js-cookie":9}],3:[function(require,module,exports){
(function (global){
'use strict';

var React = global.React;
var General = require('./components/General');
var TopNav = require('./elements/TopNav');
var MainContent = require('./components/MainContent');
var AppMenu = require('./components/AppMenu');
var Cookies = require('js-cookie');

// var config = require('../config');

var Success = React.createClass({
  displayName: 'Success',
  getInitialState: function getInitialState() {
    return {
      config: Cookies.getJSON('config_stage'),
      logged: Cookies.getJSON('logged')
    };
  },
  componentDidMount: function componentDidMount() {

    setTimeout(function () {
      General.LoadingOverlay.close();
      document.getElementById('main').style.opacity = 1;
    }, 200);
  },
  render: function render() {

    var self = this,
        content = null;

    var style = {
      contentBackground: {
        background: '#54A5C3'
      },
      panel: {
        position: 'absolute',
        width: '90%',
        height: 'calc(90% - 40px)',
        margin: '5%',
        top: '40px'
      }
    };

    if (self.state.config) {

      var config = this.state.config;

      content = React.createElement(
        'div',
        { id: 'real-container' },
        React.createElement(TopNav, { config: config.TopNav }),
        React.createElement(MainContent, { full: true, contentBackgroundStyle: style.contentBackground }),
        React.createElement(AppMenu, { list: config.Apps })
      );
    }

    return content;
  }
});

/* Module.exports instead of normal dom mounting */
module.exports = Success;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./components/AppMenu":4,"./components/General":5,"./components/MainContent":6,"./elements/TopNav":8,"js-cookie":9}],4:[function(require,module,exports){
(function (global){
'use strict';

exports.__esModule = true;

var React = global.React;

var AppMenu = React.createClass({
  displayName: 'AppMenu',
  getInitialState: function getInitialState() {
    return {
      open: false
    };
  },
  openClose: function openClose() {

    var self = this;

    this.setState({
      open: !this.state.open
    });

    if (this.state.open) {
      this.refs.appMenu.className = this.refs.appMenu.className + ' pre_close';
      setTimeout(function () {
        self.refs.appMenu.className = self.refs.appMenu.className.replace(new RegExp('(?:^|\\s)' + 'pre_close' + '(?:\\s|$)'), '');
        self.refs.appMenu.className = self.refs.appMenu.className.replace(new RegExp('(?:^|\\s)' + 'open' + '(?:\\s|$)'), '');
      }, 500);
    } else {
      this.refs.appMenu.className = this.refs.appMenu.className + ' pre_open';
      setTimeout(function () {
        self.refs.appMenu.className = self.refs.appMenu.className.replace(new RegExp('(?:^|\\s)' + 'pre_open' + '(?:\\s|$)'), '');
        self.refs.appMenu.className = self.refs.appMenu.className + ' open';
      }, 500);
    }
  },


  render: function render() {

    var clName = 'app-menu';
    var openCloseLabel = this.state.open ? 'Less' : 'More';

    return React.createElement(
      'div',
      { className: clName, ref: 'appMenu' },
      React.createElement(
        'span',
        { className: 'icon-open-close', onClick: this.openClose },
        React.createElement('i', { className: 'fa fa-ellipsis-h', 'aria-hidden': 'true' }),
        React.createElement(
          'label',
          null,
          openCloseLabel
        )
      ),
      React.createElement(
        'div',
        { className: 'list' },
        React.createElement(
          'h3',
          null,
          'APPS'
        ),
        React.createElement(
          'ul',
          { ref: 'appList' },
          mapObject(this.props.list, function (k, a) {
            return React.createElement(
              'li',
              { key: a.icon },
              React.createElement(
                'span',
                { className: 'icon' },
                React.createElement('img', { src: a.icon })
              ),
              React.createElement(
                'h4',
                null,
                a.title
              ),
              React.createElement(
                'p',
                null,
                a.subtitle
              )
            );
          })
        )
      ),
      React.createElement('div', { className: 'overflow', onClick: this.openClose })
    );
  }

});

function mapObject(object, callback) {
  return Object.keys(object).map(function (key) {
    return callback(key, object[key]);
  });
}

/* Module.exports instead of normal dom mounting */
exports.AppMenu = AppMenu;
module.exports = AppMenu;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],5:[function(require,module,exports){
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

		if (typeof this.props.validation == 'string') {

			return evalidation(this.props.validation, this.getValue());
		} else {

			if (typeof this.props.validation == 'function') {
				return this.props.validation(this.getValue());
			} else {
				return true;
			}
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

		var dest_ref = this.state.hide ? this.refInput : 'ghost';
		this.refs[dest_ref].focus();
		centerVerticalElement(this.refs[dest_ref]);
	},
	handleChange: function handleChange(e) {
		var dest_ref = this.state.hide ? this.refInput : 'ghost';
		this.refs[dest_ref].value = e.target.value;
		if (this.props.handleChange) {
			this.props.handleChange();
		}
	},
	isValid: function isValid() {

		if (typeof this.props.validation == 'string') {

			return evalidation(this.props.validation, this.getValue());
		} else {

			if (typeof this.props.validation == 'function') {
				return this.props.validation(this.getValue());
			} else {
				return true;
			}
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
			React.createElement('input', { className: 'real', tabIndex: '-1', id: 'inputReal', ref: this.refInput, type: 'text', onKeyUp: this.handleChange, onKeyDown: this.handleChange }),
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

function evalidation(myFunc, value) {
	var t = new Function('v', myFunc);
	return t(value);
}

var LoadingOverlay = {

	open: function open() {
		document.getElementById('main').style.opacity = 0;
		var e = document.getElementById('loading_overlay');
		e.className = 'animate';
		setTimeout(function () {
			e.className = 'animate show';
		}, 10);
	},

	close: function close() {
		document.getElementById('main').style.opacity = 1;
		var e = document.getElementById('loading_overlay');
		e.className = 'animate';
		setTimeout(function () {
			e.className = '';
		}, 500);
	}

};

exports.FieldInput = FieldInput;
exports.FieldPassword = FieldPassword;
exports.FieldSelect = FieldSelect;
exports.CheckboxInput = CheckboxInput;
exports.Paragraph = Paragraph;
exports.Divider = Divider;
exports.ListButton = ListButton;
exports.LoadingOverlay = LoadingOverlay;

module.exports = {
	FieldInput: FieldInput,
	FieldPassword: FieldPassword,
	FieldSelect: FieldSelect,
	CheckboxInput: CheckboxInput,
	Paragraph: Paragraph,
	Divider: Divider,
	ListButton: ListButton,
	LoadingOverlay: LoadingOverlay
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],6:[function(require,module,exports){
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
      this.refs.mainContent.style.height = this.getFullHeight() + 'px';
      this.refs;
      // this.refs.contentBackground.style.minHeight = this.getFullHeight()+'px';
    }
  },

  render: function render() {

    var cbClass = this.props.full ? 'content-background full' : 'content-background';

    return React.createElement(
      'div',
      { className: 'main-content', id: 'main-content', ref: 'mainContent' },
      React.createElement(
        'div',
        { className: cbClass, ref: 'contentBackground', style: this.props.contentBackgroundStyle || null },
        this.props.children
      )
    );
  }
});

exports.MainContent = MainContent;
module.exports = MainContent;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],7:[function(require,module,exports){
(function (global){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.__esModule = true;

var React = global.React;
var Cookies = require('js-cookie');
var General = require('./General');

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

		var self = this,
		    w = window,
		    d = document,
		    e = d.documentElement,
		    g = d.getElementsByTagName('body')[0],
		    h = w.innerHeight || e.clientHeight || g.clientHeight,
		    c = h - d.getElementsByTagName('nav')[0].offsetHeight;
		self.refs.menu.style.height = h + 'px';

		setTimeout(function () {
			self.refs.ul.style.height = self.refs.ul.offsetHeight + 'px';
			if (!self.state.open) {
				self.refs.menu.className = self.refs.menu.className + ' close hide';
			}
		}, 100);
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

		var self = this;

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
					{ key: key, onClick: self.doLogout },
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
	doLogout: function doLogout() {

		var logout = Cookies.getJSON('logout');
		if (logout) {

			General.LoadingOverlay.open();

			Cookies.remove('logout');
			Cookies.remove('config_stage');
			Cookies.remove('preLogin');

			setTimeout(function () {
				window.location.href = logout.url;
			}, 300);
		}
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

},{"./General":5,"js-cookie":9}],8:[function(require,module,exports){
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

},{"../components/TopNav":7}],9:[function(require,module,exports){
/*!
 * JavaScript Cookie v2.1.3
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader = false;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function init (converter) {
		function api (key, value, attributes) {
			var result;
			if (typeof document === 'undefined') {
				return;
			}

			// Write

			if (arguments.length > 1) {
				attributes = extend({
					path: '/'
				}, api.defaults, attributes);

				if (typeof attributes.expires === 'number') {
					var expires = new Date();
					expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 864e+5);
					attributes.expires = expires;
				}

				try {
					result = JSON.stringify(value);
					if (/^[\{\[]/.test(result)) {
						value = result;
					}
				} catch (e) {}

				if (!converter.write) {
					value = encodeURIComponent(String(value))
						.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				} else {
					value = converter.write(value, key);
				}

				key = encodeURIComponent(String(key));
				key = key.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				key = key.replace(/[\(\)]/g, escape);

				return (document.cookie = [
					key, '=', value,
					attributes.expires ? '; expires=' + attributes.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
					attributes.path ? '; path=' + attributes.path : '',
					attributes.domain ? '; domain=' + attributes.domain : '',
					attributes.secure ? '; secure' : ''
				].join(''));
			}

			// Read

			if (!key) {
				result = {};
			}

			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all. Also prevents odd result when
			// calling "get()"
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var rdecode = /(%[0-9A-Z]{2})+/g;
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = parts[0].replace(rdecode, decodeURIComponent);
					cookie = converter.read ?
						converter.read(cookie, name) : converter(cookie, name) ||
						cookie.replace(rdecode, decodeURIComponent);

					if (this.json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					if (key === name) {
						result = cookie;
						break;
					}

					if (!key) {
						result[name] = cookie;
					}
				} catch (e) {}
			}

			return result;
		}

		api.set = api;
		api.get = function (key) {
			return api.call(api, key);
		};
		api.getJSON = function () {
			return api.apply({
				json: true
			}, [].slice.call(arguments));
		};
		api.defaults = {};

		api.remove = function (key, attributes) {
			api(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

},{}]},{},[1])


//# sourceMappingURL=landing.js.map
