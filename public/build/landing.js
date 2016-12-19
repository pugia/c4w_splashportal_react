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
      toSend['session'] = Cookies.getJSON('session');

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

        var location = Cookies.getJSON('location');
        var toSend = Cookies.getJSON('preLogin');
        toSend['ap_redirect'] = location.href;
        toSend['session'] = Cookies.getJSON('session');

        $.ajax({
          url: endpoint_isLogged,
          type: 'POST',
          cache: false,
          data: JSON.stringify(toSend),
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
    Cookies.remove('session');
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

		if (this.getValue() == '' && this.props.required == false) {
			return true;
		} else {

			if (typeof this.props.validation == 'string') {

				return evalidation(this.props.validation, this.getValue());
			} else {

				if (typeof this.props.validation == 'function') {
					return this.props.validation(this.getValue());
				} else {
					return true;
				}
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

var FieldHidden = React.createClass({
	displayName: 'FieldHidden',


	refInput: Math.random().toString(36).substring(7),

	getValue: function getValue() {
		return this.refs[this.refInput].value;
	},
	setValue: function setValue(v) {
		if (v) {
			this.refs[this.refInput].value = v;
		}
	},
	isValid: function isValid() {

		if (this.getValue() == '' && this.props.required == false) {
			return true;
		} else {

			if (typeof this.props.validation == 'string') {

				return evalidation(this.props.validation, this.getValue());
			} else {

				if (typeof this.props.validation == 'function') {
					return this.props.validation(this.getValue());
				} else {
					return true;
				}
			}
		}
	},
	componentDidMount: function componentDidMount() {

		console.log(this.props);

		if (this.props.value) {
			this.setValue(this.props.value);
		}
	},
	render: function render() {

		return React.createElement('input', { ref: this.refInput, type: 'hidden', onChange: this.props.handleChange || null });
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

		if (this.getValue() == '' && this.props.required == false) {
			return true;
		} else {

			if (typeof this.props.validation == 'string') {

				return evalidation(this.props.validation, this.getValue());
			} else {

				if (typeof this.props.validation == 'function') {
					return this.props.validation(this.getValue());
				} else {
					return true;
				}
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

		if (this.props.required == false) {

			return true;
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
exports.FieldHidden = FieldHidden;
exports.FieldPassword = FieldPassword;
exports.FieldSelect = FieldSelect;
exports.CheckboxInput = CheckboxInput;
exports.Paragraph = Paragraph;
exports.Divider = Divider;
exports.ListButton = ListButton;
exports.LoadingOverlay = LoadingOverlay;

module.exports = {
	FieldInput: FieldInput,
	FieldHidden: FieldHidden,
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

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvbGFuZGluZy5qcyIsImFwcC9yb3V0ZXMvTGFuZGluZy5qcyIsImFwcC9yb3V0ZXMvU3VjY2Vzcy5qcyIsImFwcC9yb3V0ZXMvY29tcG9uZW50cy9BcHBNZW51LmpzIiwiYXBwL3JvdXRlcy9jb21wb25lbnRzL0dlbmVyYWwuanMiLCJhcHAvcm91dGVzL2NvbXBvbmVudHMvTWFpbkNvbnRlbnQuanMiLCJhcHAvcm91dGVzL2NvbXBvbmVudHMvVG9wTmF2LmpzIiwiYXBwL3JvdXRlcy9lbGVtZW50cy9Ub3BOYXYuanMiLCJub2RlX21vZHVsZXMvanMtY29va2llL3NyYy9qcy5jb29raWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0FBLElBQUksVUFBVSxRQUFRLGtCQUFSLENBQWQ7QUFDQSxJQUFJLFVBQVUsUUFBUSxrQkFBUixDQUFkO0FBQ0EsSUFBSSxVQUFVLFFBQVEsV0FBUixDQUFkOztBQUdBLElBQU0sTUFBTSxNQUFNLFdBQU4sQ0FBa0I7QUFBQTtBQUM1QixpQkFENEIsNkJBQ1Y7QUFDaEIsV0FBTztBQUNMLGVBQVMsSUFESjtBQUVMLGNBQVE7QUFGSCxLQUFQO0FBSUQsR0FOMkI7QUFRNUIsbUJBUjRCLCtCQVFSOztBQUVsQixRQUFJLE9BQU8sSUFBWDs7QUFFQSxRQUFJLFFBQVEsR0FBUixDQUFZLFNBQVosQ0FBSixFQUE0Qjs7QUFFMUIsVUFBSSxXQUFXLEtBQUssS0FBTCxDQUFXLEtBQUssU0FBTCxDQUFlLE9BQU8sUUFBdEIsQ0FBWCxDQUFmO0FBQ0EsY0FBUSxHQUFSLENBQVksVUFBWixFQUF3QixRQUF4Qjs7QUFFQSxVQUFJLFNBQVMsUUFBUSxPQUFSLENBQWdCLFNBQWhCLENBQWIsQ0FBeUMsUUFBUSxNQUFSLENBQWUsU0FBZjtBQUN6QyxhQUFPLGFBQVAsSUFBd0IsU0FBUyxJQUFqQztBQUNBLGFBQU8sU0FBUCxJQUFvQixRQUFRLE9B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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBMYW5kaW5nID0gcmVxdWlyZSgnLi9yb3V0ZXMvTGFuZGluZycpO1xudmFyIFN1Y2Nlc3MgPSByZXF1aXJlKCcuL3JvdXRlcy9TdWNjZXNzJyk7XG52YXIgQ29va2llcyA9IHJlcXVpcmUoJ2pzLWNvb2tpZScpO1xuXG5cbmNvbnN0IEFwcCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBsb2FkaW5nOiB0cnVlLFxuICAgICAgbG9nZ2VkOiBmYWxzZVxuICAgIH1cbiAgfSxcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcblxuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGlmIChDb29raWVzLmdldCgnZG9Mb2dpbicpKSB7XG5cbiAgICAgIHZhciBsb2NhdGlvbiA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkod2luZG93LmxvY2F0aW9uKSk7XG4gICAgICBDb29raWVzLnNldCgnbG9jYXRpb24nLCBsb2NhdGlvbik7XG5cbiAgICAgIHZhciB0b1NlbmQgPSBDb29raWVzLmdldEpTT04oJ2RvTG9naW4nKTsgQ29va2llcy5yZW1vdmUoJ2RvTG9naW4nKVxuICAgICAgdG9TZW5kWydhcF9yZWRpcmVjdCddID0gbG9jYXRpb24uaHJlZjtcbiAgICAgIHRvU2VuZFsnc2Vzc2lvbiddID0gQ29va2llcy5nZXRKU09OKCdzZXNzaW9uJyk7XG5cbiAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogZW5kcG9pbnRfbG9naW4sXG4gICAgICAgIHR5cGU6J1BPU1QnLFxuICAgICAgICBjYWNoZTogZmFsc2UsXG4gICAgICAgIGRhdGE6IEpTT04uc3RyaW5naWZ5KHRvU2VuZCksXG4gICAgICAgIGFzeW5jOnRydWUsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICBDb29raWVzLnNldCgncHJlTG9naW4nLCByZXNwb25zZS5zZXNzaW9uLnByZUxvZ2luICk7XG4gICAgICAgICAgQ29va2llcy5zZXQoJ2xvZ291dCcsIHJlc3BvbnNlLmxvZ291dCApO1xuXG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHJlc3BvbnNlLmxvZ2luLnVybDtcbiAgICAgICAgICB9LCAyMDApO1xuXG4gICAgICAgIH0sXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgICBjb25zb2xlLmxvZygndXJsOiAnK2VuZHBvaW50X2xvZ2luKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZGF0YTogJyArIEpTT04uc3RyaW5naWZ5KHRvU2VuZCkgKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3I6ICcgKyBKU09OLnN0cmluZ2lmeShlKSApO1xuXG4gICAgICAgICAgJCgnI2Vycm9yJykuYWRkQ2xhc3MoJ29wZW4nKTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InLCBlKTtcblxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgIGlmIChDb29raWVzLmdldCgncHJlTG9naW4nKSB8fCBDb29raWVzLmdldCgnbG9nb3V0JykpIHtcblxuICAgICAgICB2YXIgbG9jYXRpb24gPSBDb29raWVzLmdldEpTT04oJ2xvY2F0aW9uJyk7XG4gICAgICAgIHZhciB0b1NlbmQgPSBDb29raWVzLmdldEpTT04oJ3ByZUxvZ2luJyk7XG4gICAgICAgIHRvU2VuZFsnYXBfcmVkaXJlY3QnXSA9IGxvY2F0aW9uLmhyZWY7XG4gICAgICAgIHRvU2VuZFsnc2Vzc2lvbiddID0gQ29va2llcy5nZXRKU09OKCdzZXNzaW9uJyk7XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICB1cmw6IGVuZHBvaW50X2lzTG9nZ2VkLFxuICAgICAgICAgIHR5cGU6J1BPU1QnLFxuICAgICAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh0b1NlbmQpLFxuICAgICAgICAgIGFzeW5jOnRydWUsXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzcG9uc2UpIHtcblxuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmxvZ2luU3RhdHVzLmlzTG9nZ2VkID09PSB0cnVlICYmIHJlc3BvbnNlLnBvc3RBdXRoLm1zZyA9PSAnU1VDQ0VTUycpIHtcblxuICAgICAgICAgICAgICBzZWxmLnNldFN0YXRlKHtcbiAgICAgICAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBsb2dnZWQ6IHRydWVcbiAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICBDb29raWVzLnNldCgnbG9naW5fZXJyb3InLCByZXNwb25zZS5wb3N0QXV0aC5tc2cpO1xuICAgICAgICAgICAgICBDb29raWVzLnJlbW92ZSgncHJlTG9naW4nKTtcbiAgICAgICAgICAgICAgQ29va2llcy5yZW1vdmUoJ2xvZ291dCcpO1xuXG4gICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9zdGFnZS8jLzAxJzsgICAgICAgICAgICBcbiAgICAgICAgICAgICAgfSwgMjAwKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgfSxcbiAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICAvLyBDb29raWVzLnJlbW92ZSgncHJlTG9naW4nKTtcbiAgICAgICAgICAgIC8vIENvb2tpZXMucmVtb3ZlKCdsb2dvdXQnKTtcbiAgICAgICAgICAgIHNlbGYuc2V0U3RhdGUoe1xuICAgICAgICAgICAgICBsb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgICAgbG9nZ2VkOiBmYWxzZVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgJCgnI2Vycm9yJykuYWRkQ2xhc3MoJ29wZW4nKTsgICAgICAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yJywgZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBcbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgQ29va2llcy5yZW1vdmUoJ3ByZUxvZ2luJyk7XG4gICAgICAgIENvb2tpZXMucmVtb3ZlKCdsb2dvdXQnKTtcbiAgICAgICAgc2VsZi5zZXRTdGF0ZSh7XG4gICAgICAgICAgbG9hZGluZzogZmFsc2UsXG4gICAgICAgICAgbG9nZ2VkOiBmYWxzZVxuICAgICAgICB9KVxuXG4gICAgICB9XG5cbiAgICB9XG5cbiAgfSxcblxuICByZW5kZXIoKSB7XG4gICAgbGV0IENoaWxkID0gbnVsbFxuXG4gICAgaWYgKCF0aGlzLnN0YXRlLmxvYWRpbmcpIHtcbiAgICAgIENoaWxkID0gKHRoaXMuc3RhdGUubG9nZ2VkKSA/IDxTdWNjZXNzIC8+IDogPExhbmRpbmcgLz47XG4gICAgfVxuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIHtDaGlsZH1cbiAgICAgIDwvZGl2PlxuICAgIClcbiAgfVxufSlcblxuXG5cblJlYWN0RE9NLnJlbmRlcigoXG4gIDxBcHAgLz5cbiksIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJykpOyIsInZhciBSZWFjdCA9IGdsb2JhbC5SZWFjdDtcbnZhciBHZW5lcmFsID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL0dlbmVyYWwnKTtcbnZhciBUb3BOYXYgPSByZXF1aXJlKCcuL2VsZW1lbnRzL1RvcE5hdicpO1xudmFyIE1haW5Db250ZW50ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL01haW5Db250ZW50Jyk7XG52YXIgQ29va2llcyA9IHJlcXVpcmUoJ2pzLWNvb2tpZScpO1xuXG52YXIgTGFuZGluZyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuICBnZXRJbml0aWFsU3RhdGUoKSB7XG5cbiAgICByZXR1cm4ge1xuICAgICAgbGFuZzogQ29va2llcy5nZXQoJ2xhbmcnKSB8fCAnZW5nJyxcbiAgICAgIGNvbmZpZzogbnVsbFxuICAgIH1cblxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcblxuICAgIHZhciBwYXJhbXMgPSBwYXJzZVF1ZXJ5U3RyaW5nKCk7XG4gICAgaWYgKHBhcmFtcy5yZXMgPT0gJ25vdHlldCcpIHsgQ29va2llcy5yZW1vdmUoJ2xvY2F0aW9uJykgfVxuICAgIENvb2tpZXMucmVtb3ZlKCdsb2dvdXQnKTtcbiAgICBDb29raWVzLnJlbW92ZSgnY29uZmlnX3N0YWdlJyk7XG4gICAgQ29va2llcy5yZW1vdmUoJ3ByZUxvZ2luJyk7ICAgIFxuICAgIENvb2tpZXMucmVtb3ZlKCdzZXNzaW9uJyk7XG5cbiAgfSxcblxuICBsb2FkQ29uZmlnKCkge1xuXG4gICAgY29uc29sZS5sb2coJ2xvYWRDb25maWcnKVxuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdmFyIGxvY2F0aW9uID0gQ29va2llcy5nZXRKU09OKCdsb2NhdGlvbicpO1xuXG4gICAgaWYgKCFsb2NhdGlvbikgeyBcbiAgICAgIGxvY2F0aW9uID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh3aW5kb3cubG9jYXRpb24pKTtcbiAgICAgIENvb2tpZXMuc2V0KCdsb2NhdGlvbicsIGxvY2F0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHdpbmRvdy5sb2NhdGlvbi5zZWFyY2ggIT0gJycgJiYgd2luZG93LmxvY2F0aW9uLnNlYXJjaCAhPSBsb2NhdGlvbi5zZWFyY2gpIHsgXG4gICAgICAgIGxvY2F0aW9uID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh3aW5kb3cubG9jYXRpb24pKTtcbiAgICAgICAgQ29va2llcy5zZXQoJ2xvY2F0aW9uJywgbG9jYXRpb24pOyBcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgdG9TZW5kID0ge1xuICAgICAgYXBfcmVkaXJlY3Q6IGxvY2F0aW9uLmhyZWZcbiAgICB9O1xuXG4gICAgJC5hamF4KHtcbiAgICAgIHVybDogZW5kcG9pbnRfbGFuZGluZyxcbiAgICAgIHR5cGU6J1BPU1QnLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkodG9TZW5kKSxcbiAgICAgIGFzeW5jOnRydWUsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSkge1xuXG4gICAgICAgIEdlbmVyYWwuTG9hZGluZ092ZXJsYXkuY2xvc2UoKTtcbiAgICAgICAgQ29va2llcy5zZXQoJ3Nlc3Npb24nLCByZXNwb25zZS5zZXNzaW9uKTtcbiAgICAgICAgc2VsZi5zZXRTdGF0ZSh7IGNvbmZpZzogSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXNwb25zZS5jb25maWcpKSB9KVxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpLnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICB9LCAyMDApO1xuXG4gICAgICB9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBjb25zb2xlLmxvZygndXJsOiAnK2VuZHBvaW50X2xhbmRpbmcpO1xuICAgICAgICBjb25zb2xlLmxvZygnZGF0YTogJyArIEpTT04uc3RyaW5naWZ5KHRvU2VuZCkgKTtcbiAgICAgICAgY29uc29sZS5sb2coJ2Vycm9yOiAnICsgSlNPTi5zdHJpbmdpZnkoZSkgKTtcblxuICAgICAgICAkKCcjZXJyb3InKS5hZGRDbGFzcygnb3BlbicpO1xuICAgICAgICBjb25zb2xlLmxvZygnZXJyb3InLCBlKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9LFxuXG4gIHVwZGF0ZVNsaWRlckNvbnRhaW5lckhlaWdodCgpIHtcblxuICAgIGlmICh0aGlzLnJlZnMuc2xpZGVyQ29udGFpbmVyICE9IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5yZWZzLnNsaWRlckNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSAoIHRoaXMucmVmcy5jb250ZW50LmdldEZ1bGxIZWlnaHQoKSAtIGdldEFic29sdXRlSGVpZ2h0KHRoaXMucmVmcy5nb09ubGluZUJ0bikgKSArICdweCc7XG4gICAgfVxuXG4gIH0sXG5cblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XG5cbiAgICB0aGlzLmxvYWRDb25maWcoKTtcbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCB0aGlzLnVwZGF0ZVNsaWRlckNvbnRhaW5lckhlaWdodCk7XG4gICAgc2V0VGltZW91dCh0aGlzLnVwZGF0ZVNsaWRlckNvbnRhaW5lckhlaWdodCwgMTAwKTtcblxuICB9LFxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbigpIHtcblxuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsIHRoaXMudXBkYXRlU2xpZGVyQ29udGFpbmVySGVpZ2h0KTtcblxuICB9LFxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMsIHByZXZTdGF0ZSkge1xuXG4gICAgdGhpcy51cGRhdGVTbGlkZXJDb250YWluZXJIZWlnaHQoKTtcblxuICB9LFxuXG4gIG5leHQoKSB7XG5cbiAgICBHZW5lcmFsLkxvYWRpbmdPdmVybGF5Lm9wZW4oKTtcbiAgICBzZXRUaW1lb3V0KCAoKSA9PiB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvc3RhZ2UvIy8wMScsIDMwMCk7XG5cbiAgfSxcblxuICByZW5kZXIoKSB7XG5cbiAgICBjb25zb2xlLmxvZygncmVuZGVyIGxhbmRpbmcnKTsgICAgXG5cbiAgXHR2YXIgc2VsZiA9IHRoaXMsXG4gICAgICAgIGNvbnRlbnQgPSBudWxsO1xuXG4gICAgaWYgKHNlbGYuc3RhdGUuY29uZmlnKSB7XG5cbiAgICAgIGNvbnN0IGNvbmZpZyA9IHNlbGYuc3RhdGUuY29uZmlnO1xuXG4gIFx0XHR2YXIgc3R5bGUgPSB7XG4gICAgICAgIHNsaWRlckNvbnRhaW5lcjoge1xuICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgIHdpZHRoOiAnMTAwJSdcbiAgICAgICAgfSxcbiAgICAgICAgY29udGVudEJhY2tncm91bmRTdHlsZToge1xuICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgIGJhY2tncm91bmQ6ICd0cmFuc3BhcmVudCdcbiAgICAgICAgfVxuICBcdFx0fVxuXG4gICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpLnN0eWxlLmJhY2tncm91bmRJbWFnZSA9IFwidXJsKFwiKyBjb25maWcuQ29udGVudC5iYWNrZ3JvdW5kICtcIilcIjtcblxuICAgICAgY29udGVudCA9ICggPGRpdiBpZD1cInJlYWwtY29udGFpbmVyXCI+XG5cbiAgICAgICAgICA8VG9wTmF2IGNvbmZpZz17Y29uZmlnLlRvcE5hdn0gLz5cblxuICAgICAgICAgIDxNYWluQ29udGVudCByZWY9XCJjb250ZW50XCIgZnVsbCBjb250ZW50QmFja2dyb3VuZFN0eWxlPXtzdHlsZS5jb250ZW50QmFja2dyb3VuZFN0eWxlfT5cblxuICAgICAgICAgICAgPGRpdiByZWY9XCJzbGlkZXJDb250YWluZXJcIiBjbGFzc05hbWU9XCJzbGlkZXJDb250YWluZXJcIiBzdHlsZT17c3R5bGUuc2xpZGVyQ29udGFpbmVyfT5cbiAgICAgICAgICAgICAge2NvbmZpZy5Db250ZW50LnNsaWRlcy5tYXAoIChzKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDxTbGlkZSB7Li4uc30gLz5cbiAgICAgICAgICAgICAgfSApfVxuICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgIDxidXR0b24gb25DbGljaz17c2VsZi5uZXh0fSByZWY9XCJnb09ubGluZUJ0blwiIGNsYXNzTmFtZT1cImdvLW9ubGluZS1idXR0b24gbWFpbi1idXR0b25cIiBzdHlsZT17Y29uZmlnLkNvbnRlbnQuZ29fb25saW5lX2J1dHRvbi5zdHlsZX0+XG4gICAgICAgICAgICAgIDxzcGFuPntjb25maWcuQ29udGVudC5nb19vbmxpbmVfYnV0dG9uLmxhYmVscy50aXRsZX08L3NwYW4+XG4gICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWFuZ2xlLXJpZ2h0XCI+PC9pPlxuICAgICAgICAgICAgPC9idXR0b24+XG5cbiAgICAgICAgICA8L01haW5Db250ZW50PlxuXG4gICAgICAgIDwvZGl2PiApO1xuXG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRlbnRcblxuICB9XG5cbn0pO1xuXG52YXIgU2xpZGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2xpZGVcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbWFnZVwiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRldGFpbHNcIj5cbiAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiaGVhZGxpbmVcIj57dGhpcy5wcm9wcy5oZWFkbGluZX08L2gzPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImRlc2NyaXB0aW9uXCI+PC9wPlxuICAgICAgICAgIDxwIGNsYXNzTmFtZT1cImFjdGlvblwiPjwvcD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cblxuICAgIClcbiAgfVxuXG59KVxuXG5cbmZ1bmN0aW9uIGdldEFic29sdXRlSGVpZ2h0KGVsKSB7XG5cbiAgY29uc29sZS5sb2coJ2dldEFic29sdXRlSGVpZ2h0Jyk7XG5cbiAgLy8gR2V0IHRoZSBET00gTm9kZSBpZiB5b3UgcGFzcyBpbiBhIHN0cmluZ1xuICBlbCA9ICh0eXBlb2YgZWwgPT09ICdzdHJpbmcnKSA/IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWwpIDogZWw7IFxuXG4gIHZhciBzdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gIHZhciBtYXJnaW4gPSBwYXJzZUZsb2F0KHN0eWxlc1snbWFyZ2luVG9wJ10pICtcbiAgICAgICAgICAgICAgIHBhcnNlRmxvYXQoc3R5bGVzWydtYXJnaW5Cb3R0b20nXSk7XG5cbiAgcmV0dXJuIE1hdGguY2VpbChlbC5vZmZzZXRIZWlnaHQgKyBtYXJnaW4pO1xuXG59XG5cbnZhciBwYXJzZVF1ZXJ5U3RyaW5nID0gZnVuY3Rpb24oKSB7XG5cbiAgICB2YXIgc3RyID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaDtcbiAgICB2YXIgb2JqVVJMID0ge307XG5cbiAgICBzdHIucmVwbGFjZShcbiAgICAgICAgbmV3IFJlZ0V4cCggXCIoW14/PSZdKykoPShbXiZdKikpP1wiLCBcImdcIiApLFxuICAgICAgICBmdW5jdGlvbiggJDAsICQxLCAkMiwgJDMgKXtcbiAgICAgICAgICAgIG9ialVSTFsgJDEgXSA9ICQzO1xuICAgICAgICB9XG4gICAgKTtcbiAgICByZXR1cm4gb2JqVVJMO1xufTtcblxuLyogTW9kdWxlLmV4cG9ydHMgaW5zdGVhZCBvZiBub3JtYWwgZG9tIG1vdW50aW5nICovXG5tb2R1bGUuZXhwb3J0cyA9IExhbmRpbmc7IiwidmFyIFJlYWN0ID0gZ2xvYmFsLlJlYWN0O1xudmFyIEdlbmVyYWwgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvR2VuZXJhbCcpO1xudmFyIFRvcE5hdiA9IHJlcXVpcmUoJy4vZWxlbWVudHMvVG9wTmF2Jyk7XG52YXIgTWFpbkNvbnRlbnQgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvTWFpbkNvbnRlbnQnKTtcbnZhciBBcHBNZW51ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL0FwcE1lbnUnKTtcbnZhciBDb29raWVzID0gcmVxdWlyZSgnanMtY29va2llJyk7XG5cbi8vIHZhciBjb25maWcgPSByZXF1aXJlKCcuLi9jb25maWcnKTtcblxudmFyIFN1Y2Nlc3MgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cbiAgZ2V0SW5pdGlhbFN0YXRlKCkge1xuICAgIHJldHVybiB7XG4gICAgICBjb25maWc6IENvb2tpZXMuZ2V0SlNPTignY29uZmlnX3N0YWdlJyksXG4gICAgICBsb2dnZWQ6IENvb2tpZXMuZ2V0SlNPTignbG9nZ2VkJylcbiAgICB9XG4gIH0sXG5cblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XG5cbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIEdlbmVyYWwuTG9hZGluZ092ZXJsYXkuY2xvc2UoKTtcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluJykuc3R5bGUub3BhY2l0eSA9IDE7XG4gICAgfSwgMjAwKTtcblxuXHR9LFxuXG4gIHJlbmRlcigpIHtcblxuICBcdHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgY29udGVudCA9IG51bGxcblxuICAgIHZhciBzdHlsZSA9IHtcbiAgICAgIGNvbnRlbnRCYWNrZ3JvdW5kOiB7XG4gICAgICAgIGJhY2tncm91bmQ6ICcjNTRBNUMzJ1xuICAgICAgfSxcbiAgICAgIHBhbmVsOiB7XG4gICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICB3aWR0aDogJzkwJScsXG4gICAgICAgIGhlaWdodDogJ2NhbGMoOTAlIC0gNDBweCknLFxuICAgICAgICBtYXJnaW46ICc1JScsXG4gICAgICAgIHRvcDogJzQwcHgnXG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlbGYuc3RhdGUuY29uZmlnKSB7XG5cbiAgICAgIHZhciBjb25maWcgPSB0aGlzLnN0YXRlLmNvbmZpZztcblxuICAgICAgY29udGVudCA9IChcbiAgICAgICAgPGRpdiBpZD1cInJlYWwtY29udGFpbmVyXCI+XG4gICAgICAgICAgPFRvcE5hdiBjb25maWc9e2NvbmZpZy5Ub3BOYXZ9IC8+XG5cbiAgICAgICAgICA8TWFpbkNvbnRlbnQgZnVsbCBjb250ZW50QmFja2dyb3VuZFN0eWxlPXtzdHlsZS5jb250ZW50QmFja2dyb3VuZH0+XG5cbiAgICAgICAgICA8L01haW5Db250ZW50PlxuXG4gICAgICAgICAgPEFwcE1lbnUgbGlzdD17Y29uZmlnLkFwcHN9IC8+ICAgICAgICBcbiAgICAgICAgPC9kaXY+XG4gICAgICApXG4gICAgfVxuXG4gICAgcmV0dXJuIGNvbnRlbnRcblxuICB9XG5cbn0pO1xuXG4vKiBNb2R1bGUuZXhwb3J0cyBpbnN0ZWFkIG9mIG5vcm1hbCBkb20gbW91bnRpbmcgKi9cbm1vZHVsZS5leHBvcnRzID0gU3VjY2VzczsiLCIndXNlIHN0cmljdCc7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgUmVhY3QgPSBnbG9iYWwuUmVhY3Q7XG5cbnZhciBBcHBNZW51ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG4gIGdldEluaXRpYWxTdGF0ZSgpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3BlbjogZmFsc2VcbiAgICB9XG4gIH0sXG5cbiAgb3BlbkNsb3NlKCkge1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuXG4gICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAgICBvcGVuOiAhdGhpcy5zdGF0ZS5vcGVuXG4gICAgfSlcblxuICAgIGlmICh0aGlzLnN0YXRlLm9wZW4pIHtcbiAgICAgIHRoaXMucmVmcy5hcHBNZW51LmNsYXNzTmFtZSA9IHRoaXMucmVmcy5hcHBNZW51LmNsYXNzTmFtZSArICcgcHJlX2Nsb3NlJztcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYucmVmcy5hcHBNZW51LmNsYXNzTmFtZSA9IHNlbGYucmVmcy5hcHBNZW51LmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJyg/Ol58XFxcXHMpJysgJ3ByZV9jbG9zZScgKyAnKD86XFxcXHN8JCknKSwgJycpO1xuICAgICAgICBzZWxmLnJlZnMuYXBwTWVudS5jbGFzc05hbWUgPSBzZWxmLnJlZnMuYXBwTWVudS5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKCcoPzpefFxcXFxzKScrICdvcGVuJyArICcoPzpcXFxcc3wkKScpLCAnJyk7XG4gICAgICB9LCA1MDApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlZnMuYXBwTWVudS5jbGFzc05hbWUgPSB0aGlzLnJlZnMuYXBwTWVudS5jbGFzc05hbWUgKyAnIHByZV9vcGVuJztcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgIHNlbGYucmVmcy5hcHBNZW51LmNsYXNzTmFtZSA9IHNlbGYucmVmcy5hcHBNZW51LmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJyg/Ol58XFxcXHMpJysgJ3ByZV9vcGVuJyArICcoPzpcXFxcc3wkKScpLCAnJyk7XG4gICAgICAgIHNlbGYucmVmcy5hcHBNZW51LmNsYXNzTmFtZSA9IHNlbGYucmVmcy5hcHBNZW51LmNsYXNzTmFtZSArICcgb3Blbic7XG4gICAgICB9LCA1MDApO1xuICAgIH1cblxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXG4gICAgdmFyIGNsTmFtZSA9ICdhcHAtbWVudSc7XG4gICAgdmFyIG9wZW5DbG9zZUxhYmVsID0gKHRoaXMuc3RhdGUub3BlbikgPyAnTGVzcycgOiAnTW9yZSc7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9e2NsTmFtZX0gcmVmPVwiYXBwTWVudVwiPlxuXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24tb3Blbi1jbG9zZVwiIG9uQ2xpY2s9e3RoaXMub3BlbkNsb3NlfT5cbiAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1lbGxpcHNpcy1oXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPlxuICAgICAgICAgIDxsYWJlbD57b3BlbkNsb3NlTGFiZWx9PC9sYWJlbD5cbiAgICAgICAgPC9zcGFuPlxuXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibGlzdFwiPlxuXG4gICAgICAgICAgPGgzPkFQUFM8L2gzPlxuXG4gICAgICAgICAgPHVsIHJlZj1cImFwcExpc3RcIj5cblxuICAgICAgICAgICAge21hcE9iamVjdCh0aGlzLnByb3BzLmxpc3QsIChrLGEpID0+IHtcbiAgICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgICA8bGkga2V5PXthLmljb259PlxuICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvblwiPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIHNyYz17YS5pY29ufSAvPlxuICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgPGg0PnthLnRpdGxlfTwvaDQ+XG4gICAgICAgICAgICAgICAgICA8cD57YS5zdWJ0aXRsZX08L3A+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgfSl9XG5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICA8L2Rpdj5cblxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm92ZXJmbG93XCIgb25DbGljaz17dGhpcy5vcGVuQ2xvc2V9PjwvZGl2PlxuXG4gICAgICA8L2Rpdj5cbiAgICApXG4gIH1cblxufSk7XG5cbmZ1bmN0aW9uIG1hcE9iamVjdChvYmplY3QsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3QpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGNhbGxiYWNrKGtleSwgb2JqZWN0W2tleV0pO1xuICB9KTtcbn1cblxuLyogTW9kdWxlLmV4cG9ydHMgaW5zdGVhZCBvZiBub3JtYWwgZG9tIG1vdW50aW5nICovXG5leHBvcnRzLkFwcE1lbnUgPSBBcHBNZW51O1xubW9kdWxlLmV4cG9ydHMgPSBBcHBNZW51O1xuIiwiJ3VzZSBzdHJpY3QnO1xuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIFJlYWN0ID0gZ2xvYmFsLlJlYWN0O1xuXG52YXIgUGFyYWdyYXBoID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdHJlbmRlcigpIHtcblxuXHRcdHZhciBjbGFzc05hbWUgPSAnJztcblx0XHRpZiAodGhpcy5wcm9wcy5hbGlnbikgeyBjbGFzc05hbWUgKz0gJ211aS0tdGV4dC0nICsgdGhpcy5wcm9wcy5hbGlnbjsgfVxuXHRcdGlmICh0aGlzLnByb3BzLmN1c3RvbUNsYXNzKSB7IGNsYXNzTmFtZSArPSAnICcrdGhpcy5wcm9wcy5jdXN0b21DbGFzczsgfVxuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxwIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBzdHlsZT17dGhpcy5wcm9wcy5zdHlsZSB8fCBudWxsfT57dGhpcy5wcm9wcy50ZXh0IHx8IHRoaXMucHJvcHMuY2hpbGRyZW59PC9wPlxuXHRcdClcblxuXHR9XG5cbn0pXG5cbnZhciBjZW50ZXJWZXJ0aWNhbEVsZW1lbnQgPSBmdW5jdGlvbihlbCkge1xuXHR2YXIgY29udCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWluLWNvbnRlbnQnKTtcblx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHR2YXIgZWxCb3ggPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblx0XHR2YXIgY29udEJveCA9IGNvbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cdFx0dmFyIHRvcCA9IGVsQm94LnRvcCArIGVsQm94LmhlaWdodCAtIChjb250Qm94LmhlaWdodCAvIDIpICsgY29udC5zY3JvbGxUb3A7XG5cdFx0Y29udC5zY3JvbGxUb3AgPSB0b3A7XHRcdFxuXHR9LCA1MCk7XG59XG5cbnZhciBGaWVsZElucHV0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdHJlZklucHV0OiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoNyksXG5cblx0Z2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHZhciBzdCA9IHRoaXMucHJvcHMubXNnIHx8IHtcblx0XHRcdHN0YXR1czogJ2luZm8nLFxuXHRcdFx0aW5mbzogJycsXG5cdFx0XHRlcnJvcjogJycsXG5cdFx0XHRzdWNjZXNzOiAnJ1xuXHRcdH1cblx0XHRyZXR1cm4gc3Q7XG5cdH0sXG5cblx0Z2V0VmFsdWUoKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVmc1t0aGlzLnJlZklucHV0XS52YWx1ZTtcblx0fSxcblxuXHRzZXRWYWx1ZSh2KSB7XG5cdFx0aWYgKHYpIHsgdGhpcy5yZWZzW3RoaXMucmVmSW5wdXRdLnZhbHVlID0gdjsgfVxuXHR9LFxuXG5cdGZvY3VzKCkge1xuXHRcdHRoaXMucmVmc1t0aGlzLnJlZklucHV0XS5mb2N1cygpO1xuXHRcdGNlbnRlclZlcnRpY2FsRWxlbWVudCh0aGlzLnJlZnNbdGhpcy5yZWZJbnB1dF0pO1xuXHR9LFxuXG5cdGlzVmFsaWQoKSB7XG5cblx0XHRpZiAodGhpcy5nZXRWYWx1ZSgpID09ICcnICYmIHRoaXMucHJvcHMucmVxdWlyZWQgPT0gZmFsc2UpIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cblx0XHRcdGlmICh0eXBlb2YgdGhpcy5wcm9wcy52YWxpZGF0aW9uID09ICdzdHJpbmcnKSB7XG5cblx0XHRcdFx0cmV0dXJuIGV2YWxpZGF0aW9uKHRoaXMucHJvcHMudmFsaWRhdGlvbiwgdGhpcy5nZXRWYWx1ZSgpKTtcblxuXHRcdFx0fSBlbHNlIHtcblxuXHRcdFx0XHRpZiAodHlwZW9mIHRoaXMucHJvcHMudmFsaWRhdGlvbiA9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMucHJvcHMudmFsaWRhdGlvbih0aGlzLmdldFZhbHVlKCkpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0XHR9XG5cblx0XHRcdH1cblxuXHRcdH1cblxuXHR9LFxuXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdGlmICh0aGlzLnByb3BzLnZhbHVlKSB7XG5cdFx0XHR0aGlzLnNldFZhbHVlKHRoaXMucHJvcHMudmFsdWUpO1xuXHRcdH1cblx0fSxcblxuXHRyZW5kZXIoKSB7XG5cblx0XHR2YXIgaW5wdXRQcm9wcyA9IHRoaXMucHJvcHMuaW5wdXQgfHwgeyB0eXBlOiAndGV4dCcgfVxuXHRcdHZhciBzdHlsZSA9IHt9O1xuXG5cdFx0aWYgKHRoaXMucHJvcHMubXNnICE9IGZhbHNlKSB7XG5cdFx0XHRzdHlsZS5wYWRkaW5nQm90dG9tID0gJzE1cHgnXG5cdFx0fVxuXG5cdFx0cmV0dXJuKFxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT17J211aS10ZXh0ZmllbGQgbXVpLXRleHRmaWVsZC0tZmxvYXQtbGFiZWwgJyArIHRoaXMuc3RhdGUuc3RhdHVzfSBzdHlsZT17c3R5bGV9PlxuICAgICAgICA8aW5wdXQgcmVmPXt0aGlzLnJlZklucHV0fSB7Li4uaW5wdXRQcm9wc30gb25DaGFuZ2U9e3RoaXMucHJvcHMuaGFuZGxlQ2hhbmdlIHx8IG51bGx9IC8+XG4gICAgICAgIDxsYWJlbD57dGhpcy5wcm9wcy5sYWJlbCB8fCAnRmllbGQnfTwvbGFiZWw+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImluZm9cIj57dGhpcy5zdGF0ZS5pbmZvfTwvc3Bhbj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZXJyb3JcIj57dGhpcy5zdGF0ZS5lcnJvcn08L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInN1Y2Nlc3NcIj57dGhpcy5zdGF0ZS5zdWNjZXNzfTwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuXG5cdFx0KVxuXHR9XG5cbn0pXG5cbnZhciBGaWVsZEhpZGRlbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRyZWZJbnB1dDogTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDcpLFxuXG5cdGdldFZhbHVlKCkge1xuXHRcdHJldHVybiB0aGlzLnJlZnNbdGhpcy5yZWZJbnB1dF0udmFsdWU7XG5cdH0sXG5cblx0c2V0VmFsdWUodikge1xuXHRcdGlmICh2KSB7IHRoaXMucmVmc1t0aGlzLnJlZklucHV0XS52YWx1ZSA9IHY7IH1cblx0fSxcblxuXHRpc1ZhbGlkKCkge1xuXG5cdFx0aWYgKHRoaXMuZ2V0VmFsdWUoKSA9PSAnJyAmJiB0aGlzLnByb3BzLnJlcXVpcmVkID09IGZhbHNlKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRpZiAodHlwZW9mIHRoaXMucHJvcHMudmFsaWRhdGlvbiA9PSAnc3RyaW5nJykge1xuXG5cdFx0XHRcdHJldHVybiBldmFsaWRhdGlvbih0aGlzLnByb3BzLnZhbGlkYXRpb24sIHRoaXMuZ2V0VmFsdWUoKSk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLnByb3BzLnZhbGlkYXRpb24gPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLnByb3BzLnZhbGlkYXRpb24odGhpcy5nZXRWYWx1ZSgpKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fSxcblxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcblxuXHRcdGNvbnNvbGUubG9nKHRoaXMucHJvcHMpO1xuXG5cdFx0aWYgKHRoaXMucHJvcHMudmFsdWUpIHtcblx0XHRcdHRoaXMuc2V0VmFsdWUodGhpcy5wcm9wcy52YWx1ZSk7XG5cdFx0fVxuXHR9LFxuXG5cdHJlbmRlcigpIHtcblxuXHRcdHJldHVybihcblxuICAgICAgPGlucHV0IHJlZj17dGhpcy5yZWZJbnB1dH0gdHlwZT1cImhpZGRlblwiIG9uQ2hhbmdlPXt0aGlzLnByb3BzLmhhbmRsZUNoYW5nZSB8fCBudWxsfSAvPlxuXG5cdFx0KVxuXHR9XG5cbn0pXG5cbnZhciBGaWVsZFBhc3N3b3JkID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdHJlZklucHV0OiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoNyksXG5cblx0Z2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHZhciBzdCA9IHRoaXMucHJvcHMubXNnIHx8IHtcblx0XHRcdHN0YXR1czogJ2luZm8nLFxuXHRcdFx0aGlkZTogdHJ1ZSxcblx0XHRcdGluZm86ICcnLFxuXHRcdFx0ZXJyb3I6ICcnLFxuXHRcdFx0c3VjY2VzczogJydcblx0XHR9XG5cdFx0cmV0dXJuIHN0O1xuXHR9LFxuXG5cdGdldFZhbHVlKCkge1xuXHRcdHJldHVybiB0aGlzLnJlZnNbdGhpcy5yZWZJbnB1dF0udmFsdWU7XG5cdH0sXG5cblx0c2V0VmFsdWUodikge1xuXHRcdHRoaXMucmVmc1t0aGlzLnJlZklucHV0XS52YWx1ZSA9IHY7XG5cdFx0dGhpcy5yZWZzWydnaG9zdCddLnZhbHVlID0gdjtcblx0fSxcblxuXHRmb2N1cygpIHtcblxuXHRcdHZhciBkZXN0X3JlZiA9ICh0aGlzLnN0YXRlLmhpZGUpID8gdGhpcy5yZWZJbnB1dCA6ICdnaG9zdCc7XG5cdFx0dGhpcy5yZWZzW2Rlc3RfcmVmXS5mb2N1cygpO1xuXHRcdGNlbnRlclZlcnRpY2FsRWxlbWVudCh0aGlzLnJlZnNbZGVzdF9yZWZdKTtcblx0fSxcblxuXHRoYW5kbGVDaGFuZ2UoZSkge1xuXHRcdHZhciBkZXN0X3JlZiA9ICh0aGlzLnN0YXRlLmhpZGUpID8gdGhpcy5yZWZJbnB1dCA6ICdnaG9zdCc7XG5cdFx0dGhpcy5yZWZzW2Rlc3RfcmVmXS52YWx1ZSA9IGUudGFyZ2V0LnZhbHVlO1xuXHRcdGlmICh0aGlzLnByb3BzLmhhbmRsZUNoYW5nZSkgeyB0aGlzLnByb3BzLmhhbmRsZUNoYW5nZSgpIH1cblx0fSxcblxuXHRpc1ZhbGlkKCkge1xuXG5cdFx0aWYgKHRoaXMuZ2V0VmFsdWUoKSA9PSAnJyAmJiB0aGlzLnByb3BzLnJlcXVpcmVkID09IGZhbHNlKSB7XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9IGVsc2Uge1xuXG5cdFx0XHRpZiAodHlwZW9mIHRoaXMucHJvcHMudmFsaWRhdGlvbiA9PSAnc3RyaW5nJykge1xuXG5cdFx0XHRcdHJldHVybiBldmFsaWRhdGlvbih0aGlzLnByb3BzLnZhbGlkYXRpb24sIHRoaXMuZ2V0VmFsdWUoKSk7XG5cblx0XHRcdH0gZWxzZSB7XG5cblx0XHRcdFx0aWYgKHR5cGVvZiB0aGlzLnByb3BzLnZhbGlkYXRpb24gPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRcdHJldHVybiB0aGlzLnByb3BzLnZhbGlkYXRpb24odGhpcy5nZXRWYWx1ZSgpKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9XG5cblx0XHR9XG5cblx0fSxcblxuXHR0b2dnbGVDaGFuZ2UoKSB7XG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHNlbGYuc2V0U3RhdGUoe1xuXHRcdFx0aGlkZTogIXNlbGYuc3RhdGUuaGlkZVxuXHRcdH0pO1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgZGVzdF9yZWYgPSAoIXNlbGYuc3RhdGUuaGlkZSkgPyBzZWxmLnJlZklucHV0IDogJ2dob3N0Jztcblx0XHRcdHNlbGYucmVmc1tkZXN0X3JlZl0uZm9jdXMoKTtcblx0XHR9LDEwMCk7XG5cdH0sXG5cblx0Y29tcG9uZW50RGlkTW91bnQoKSB7XG5cdFx0aWYgKHRoaXMucHJvcHMudmFsdWUpIHtcblx0XHRcdHRoaXMuc2V0VmFsdWUodGhpcy5wcm9wcy52YWx1ZSk7XG5cdFx0fVxuXHR9LFx0XG5cblx0cmVuZGVyKCkge1xuXG5cdFx0dmFyIGlucHV0UHJvcHMgPSB0aGlzLnByb3BzLmlucHV0IHx8IHsgdHlwZTogJ3RleHQnIH1cblx0XHR2YXIgc3R5bGUgPSB7fTtcblxuXHRcdGlmICh0aGlzLnByb3BzLm1zZyAhPSBmYWxzZSkge1xuXHRcdFx0c3R5bGUucGFkZGluZ0JvdHRvbSA9ICcxNXB4J1xuXHRcdH1cblxuXHRcdHZhciBjbGFzc25hbWUgPSAnbXVpLXRleHRmaWVsZCBwYXNzd29yZCBtdWktdGV4dGZpZWxkLS1mbG9hdC1sYWJlbCAnICsgdGhpcy5zdGF0ZS5zdGF0dXM7XG5cdFx0aWYgKCF0aGlzLnN0YXRlLmhpZGUpIHsgY2xhc3NuYW1lICs9ICcgc2hvd1Bhc3N3b3JkJyB9XG5cdFx0dmFyIGlDbGFzcyA9ICghdGhpcy5zdGF0ZS5oaWRlKSA/ICdmYSBmYS1leWUnIDogJ2ZhIGZhLWV5ZS1zbGFzaCc7XG5cblx0XHRyZXR1cm4oXG5cbiAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc25hbWV9IHN0eWxlPXtzdHlsZX0+XG4gICAgICAgIDxpbnB1dCBjbGFzc05hbWU9XCJnaG9zdFwiIHR5cGU9XCJwYXNzd29yZFwiIHJlZj1cImdob3N0XCIgb25LZXlVcD17dGhpcy5oYW5kbGVDaGFuZ2V9IG9uS2V5RG93bj17dGhpcy5oYW5kbGVDaGFuZ2V9IC8+XG4gICAgICBcdDxpIGNsYXNzTmFtZT17aUNsYXNzfSBvbkNsaWNrPXt0aGlzLnRvZ2dsZUNoYW5nZX0gLz5cbiAgICAgICAgPGlucHV0IGNsYXNzTmFtZT1cInJlYWxcIiB0YWJJbmRleD1cIi0xXCIgaWQ9XCJpbnB1dFJlYWxcIiByZWY9e3RoaXMucmVmSW5wdXR9IHR5cGU9XCJ0ZXh0XCIgb25LZXlVcD17dGhpcy5oYW5kbGVDaGFuZ2V9IG9uS2V5RG93bj17dGhpcy5oYW5kbGVDaGFuZ2V9IC8+XG4gICAgICAgIDxsYWJlbD57dGhpcy5wcm9wcy5sYWJlbH08L2xhYmVsPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbmZvXCI+e3RoaXMuc3RhdGUuaW5mb308L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImVycm9yXCI+e3RoaXMuc3RhdGUuZXJyb3J9PC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzdWNjZXNzXCI+e3RoaXMuc3RhdGUuc3VjY2Vzc308L3NwYW4+XG4gICAgICA8L2Rpdj5cblxuXHRcdClcblx0fVxuXG59KVxuXG52YXIgQ2hlY2tib3hJbnB1dCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRyZWZJbnB1dDogTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDcpLFxuXG5cdGdldEluaXRpYWxTdGF0ZSgpIHtcblx0XHRyZXR1cm4ge1xuXHRcdFx0Y2hlY2tlZDogdGhpcy5wcm9wcy5jaGVja2VkIHx8IGZhbHNlXG5cdFx0fVxuXHR9LFxuXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdHRoaXMucmVmSW5wdXQgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoNyk7XG5cdH0sXG5cbiAgdG9nZ2xlQ2hhbmdlOiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLnNldFN0YXRlKHtcbiAgICAgIGNoZWNrZWQ6ICF0aGlzLnN0YXRlLmNoZWNrZWRcbiAgICB9LCBmdW5jdGlvbigpIHtcbiAgICBcdGlmICh0eXBlb2YgdGhpcy5wcm9wcy5oYW5kbGVDaGFuZ2UgPT0gJ2Z1bmN0aW9uJykge1xuICAgIFx0XHR0aGlzLnByb3BzLmhhbmRsZUNoYW5nZSh0aGlzLnN0YXRlLmNoZWNrZWQpO1xuICAgIFx0fVxuICAgIH0uYmluZCh0aGlzKSk7XG4gIH0sXG5cbiAgZ2V0VmFsdWUoKSB7XG4gIFx0cmV0dXJuIHRoaXMuc3RhdGUuY2hlY2tlZFxuICB9LFxuXG4gIHNldFZhbHVlKHYpIHtcbiAgXHRpZiAodikgeyBcbiAgXHRcdHRoaXMuc2V0U3RhdGUoe1xuICBcdFx0XHRjaGVja2VkOiAhIXZcbiAgXHRcdH0pIFxuICBcdH1cbiAgfSxcblxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHRpZiAodGhpcy5wcm9wcy52YWx1ZSkge1xuXHRcdFx0dGhpcy5zZXRWYWx1ZSh0aGlzLnByb3BzLnZhbHVlKTtcblx0XHR9XG5cdH0sXHRcblxuXHRyZW5kZXIoKSB7XG5cblx0XHRyZXR1cm4gKFxuXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cIm11aS1jaGVja2JveFwiPlxuICAgICAgICA8aW5wdXQgaWQ9e1wiaWRfXCIrdGhpcy5yZWZJbnB1dH0gcmVmPXt0aGlzLnJlZklucHV0fSB0eXBlPVwiY2hlY2tib3hcIiB2YWx1ZT1cIjFcIiBjaGVja2VkPXt0aGlzLnN0YXRlLmNoZWNrZWR9IC8+XG4gICAgICAgIDxsYWJlbCBodG1sRm9yPXtcImlkX1wiK3RoaXMucmVmSW5wdXR9IG9uQ2xpY2s9e3RoaXMudG9nZ2xlQ2hhbmdlfT5cblxuICAgICAgICAgIDxzdmcgd2lkdGg9XCIxOHB4XCIgaGVpZ2h0PVwiMThweFwiIHZpZXdCb3g9XCIwIDAgMTggMThcIj5cbiAgICAgICAgICAgIDxnIHN0cm9rZT1cIm5vbmVcIiBzdHJva2VXaWR0aD1cIjFcIiBmaWxsPVwibm9uZVwiIGZpbGxSdWxlPVwiZXZlbm9kZFwiPlxuICAgICAgICAgICAgICA8cmVjdCBjbGFzc05hbWU9XCJyZWN0XCIgc3Ryb2tlPVwiIzAwMFwiIHg9XCIxXCIgeT1cIjFcIiB3aWR0aD1cIjE2XCIgaGVpZ2h0PVwiMTZcIiByeD1cIjNcIj48L3JlY3Q+XG4gICAgICAgICAgICAgIDxwYXRoIGNsYXNzTmFtZT1cImNoZWNrXCIgZmlsbD1cIiMwMDBcIiBkPVwiTTEzLjIxNzQ5MTIsNS4xNjc5MDY3NyBDMTMuMDc5NzQ2NSw1LjAyNTc2NDE2IDEyLjkxMjI3OCw0Ljk1NDczOTU4IDEyLjcxNTQ0ODIsNC45NTQ3Mzk1OCBDMTIuNTE4NTI3Nyw0Ljk1NDczOTU4IDEyLjM1MTA1OTMsNS4wMjU3NjQxNiAxMi4yMTMzMTQ2LDUuMTY3OTA2NzcgTDcuMzY5OTU5NDUsMTAuMTcwMjggTDUuMTk5MzAzMzQsNy45MjQxMjc2OCBDNS4wNjE0NjgwOCw3Ljc4MTk4NTA3IDQuODk0MDkwMjMsNy43MTA5NjA0OSA0LjY5NzI2MDM5LDcuNzEwOTYwNDkgQzQuNTAwMzM5OTMsNy43MTA5NjA0OSA0LjMzMjk2MjA3LDcuNzgxOTg1MDcgNC4xOTUxMjY4Miw3LjkyNDEyNzY4IEwzLjE5MTA0MDkxLDguOTU5NTkxMjcgQzMuMDUzMjA1NjUsOS4xMDE3MzM4OCAyLjk4NDMzMzMzLDkuMjc0MzQyMyAyLjk4NDMzMzMzLDkuNDc3NDE2NTIgQzIuOTg0MzMzMzMsOS42ODAzOTcyOSAzLjA1MzIwNTY1LDkuODUzMDk5MTYgMy4xOTEwNDA5MSw5Ljk5NTE0ODMxIEw1Ljg2MzczOTk3LDEyLjc1MTM2OTIgTDYuODY3OTE2NSwxMy43ODY4MzI4IEM3LjAwNTY2MTE0LDEzLjkyODk3NTQgNy4xNzMwMzg5OSwxNCA3LjM2OTk1OTQ1LDE0IEM3LjU2Njc4OTI5LDE0IDcuNzM0MTY3MTUsMTMuOTI4ODgyIDcuODcyMDAyNCwxMy43ODY4MzI4IEw4Ljg3NjE3ODkzLDEyLjc1MTM2OTIgTDE0LjIyMTU3NzEsNy4yMzg5Mjc0MSBDMTQuMzU5MzIxNyw3LjA5Njc4NDggMTQuNDI4Mjg0Niw2LjkyNDE3NjM4IDE0LjQyODI4NDYsNi43MjExMDIxNiBDMTQuNDI4Mzc1Myw2LjUxODEyMTM5IDE0LjM1OTMyMTcsNi4zNDU1MTI5NyAxNC4yMjE1NzcxLDYuMjAzMzcwMzYgTDEzLjIxNzQ5MTIsNS4xNjc5MDY3NyBaXCI+PC9wYXRoPlxuICAgICAgICAgICAgPC9nPlxuICAgICAgICAgIDwvc3ZnPlxuXG4gICAgICAgICAgPHNwYW4+e3RoaXMucHJvcHMubGFiZWx9PC9zcGFuPlxuICAgICAgICA8L2xhYmVsPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJlcnJvclwiPllvdSBtdXN0IGFjY2VwdCB0aGVzZSB0ZXJtczwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuXG5cdFx0KVxuXG5cdH1cblxufSlcblxudmFyIEZpZWxkU2VsZWN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdHJlZklucHV0OiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHJpbmcoNyksXG5cblx0Z2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHZhciBzdCA9IHRoaXMucHJvcHMubXNnIHx8IHtcblx0XHRcdHN0YXR1czogJ2luZm8nLFxuXHRcdFx0aW5mbzogJycsXG5cdFx0XHRlcnJvcjogJycsXG5cdFx0XHRzdWNjZXNzOiAnJ1xuXHRcdH1cblx0XHRyZXR1cm4gc3Q7XG5cdH0sXG5cblx0Z2V0VmFsdWUoKSB7XG5cdFx0cmV0dXJuIHRoaXMucmVmc1t0aGlzLnJlZklucHV0XS52YWx1ZTtcblx0fSxcblxuXHRzZXRWYWx1ZSh2KSB7XG5cdFx0aWYgKHYpIHsgdGhpcy5yZWZzW3RoaXMucmVmSW5wdXRdLnZhbHVlID0gdjsgfVxuXHR9LFxuXG5cdGZvY3VzKCkge1xuXHRcdHRoaXMucmVmc1t0aGlzLnJlZklucHV0XS5mb2N1cygpO1xuXHRcdGNlbnRlclZlcnRpY2FsRWxlbWVudCh0aGlzLnJlZnNbdGhpcy5yZWZJbnB1dF0pO1xuXHR9LFxuXG5cdGlzVmFsaWQoKSB7XG5cblx0XHRpZiAodGhpcy5wcm9wcy5yZXF1aXJlZCA9PSBmYWxzZSkge1xuXHRcdFxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0XG5cdFx0fSBlbHNlIHtcblxuXHRcdFx0aWYgKHR5cGVvZiB0aGlzLnByb3BzLnZhbGlkYXRpb24gPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5wcm9wcy52YWxpZGF0aW9uKHRoaXMuZ2V0VmFsdWUoKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRcdH1cblxuXHRcdH1cblxuXHR9LFxuXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdGlmICh0aGlzLnByb3BzLnZhbHVlKSB7XG5cdFx0XHR0aGlzLnNldFZhbHVlKHRoaXMucHJvcHMudmFsdWUpO1xuXHRcdH1cblx0fSxcdFxuXG5cdHJlbmRlcigpIHtcblxuXHRcdHZhciBzdHlsZSA9IHt9O1xuXG5cdFx0aWYgKHRoaXMucHJvcHMubXNnICE9IGZhbHNlKSB7XG5cdFx0XHRzdHlsZS5wYWRkaW5nQm90dG9tID0gJzE1cHgnXG5cdFx0fVxuXG5cdFx0dmFyIGdlbmVyYXRlT3B0aW9uID0gZnVuY3Rpb24oZGF0YSxpbmRleCkge1xuXHRcdFx0dmFyIG9wdHMgPSB7XG5cdFx0XHRcdGtleTogTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyaW5nKDcpXG5cdFx0XHR9O1xuXG5cdFx0XHRpZiAoZGF0YS52YWx1ZSkgeyBvcHRzLnZhbHVlID0gZGF0YS52YWx1ZSB9XG5cblx0XHRcdHJldHVybiA8b3B0aW9uIHsuLi5vcHRzfT57ZGF0YS50ZXh0fTwvb3B0aW9uPlxuXHRcdH1cblxuXHRcdHJldHVybihcblxuICAgICAgPGRpdiBjbGFzc05hbWU9eydtdWktc2VsZWN0ICcgKyB0aGlzLnN0YXRlLnN0YXR1c30gc3R5bGU9e3N0eWxlfT5cbiAgICAgICAgPGxhYmVsPnt0aGlzLnByb3BzLmxhYmVsIHx8ICdGaWVsZCd9PC9sYWJlbD5cbiAgICAgICAgPHNlbGVjdCByZWY9e3RoaXMucmVmSW5wdXR9IG9uQ2hhbmdlPXt0aGlzLnByb3BzLmhhbmRsZUNoYW5nZSB8fCBudWxsfT5cbiAgICAgICAgXHR7dGhpcy5wcm9wcy5vcHRpb25zLm1hcCggKG9wLGkpID0+IGdlbmVyYXRlT3B0aW9uKG9wLGkpICl9XG4gICAgICAgIDwvc2VsZWN0PlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpbmZvXCI+e3RoaXMuc3RhdGUuaW5mb308L3NwYW4+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImVycm9yXCI+e3RoaXMuc3RhdGUuZXJyb3J9PC9zcGFuPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJzdWNjZXNzXCI+e3RoaXMuc3RhdGUuc3VjY2Vzc308L3NwYW4+XG4gICAgICA8L2Rpdj5cblxuXHRcdClcblx0fVxuXG59KVxuXG52YXIgRGl2aWRlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcblxuICBcdHZhciBjbHMgPSAodGhpcy5wcm9wcy50ZXh0KSA/ICdkaXZpZGVyIHdpdGgtdGV4dCcgOiAnZGl2aWRlcic7XG5cbiAgICByZXR1cm4gKFxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT17Y2xzfT57dGhpcy5wcm9wcy50ZXh0fTwvZGl2PlxuXHQgIClcbiAgfVxuICBcbn0pO1xuXG5cbnZhciBMaXN0QnV0dG9uID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdHJlbmRlcigpIHtcblxuXHRcdHZhciBpY29uID0gbnVsbDtcblx0XHRpZiAodGhpcy5wcm9wcy5pY29uKSB7XG5cdFx0XHRpY29uID0gPHNwYW4gY2xhc3NOYW1lPVwiaWNvblwiPjxpIGNsYXNzTmFtZT17XCJmYSBcIit0aGlzLnByb3BzLmljb259PjwvaT48L3NwYW4+O1xuXHRcdH1cblxuXHRcdHZhciBjbGFzc05hbWUgPSAnbGlzdEJ1dHRvbic7XG5cdFx0aWYgKHRoaXMucHJvcHMuYWRkQ2xhc3MpIHsgY2xhc3NOYW1lICs9ICcgJyt0aGlzLnByb3BzLmFkZENsYXNzOyB9XG5cblx0XHRyZXR1cm4gKFxuXG5cdFx0XHQ8YnV0dG9uIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBvbkNsaWNrPXt0aGlzLnByb3BzLm9uQ2xpY2sgfHwgbnVsbH0gdmFsdWU9e3RoaXMucHJvcHMudmFsdWUgfHwgbnVsbH0+XG5cdFx0XHRcdDxzcGFuIGNsYXNzTmFtZT1cImNvbnRlbnRcIj5cblx0XHRcdFx0XHR7aWNvbn1cblx0XHRcdFx0XHR7dGhpcy5wcm9wcy5jaGlsZHJlbn1cblx0XHRcdFx0PC9zcGFuPlxuXHRcdFx0XHQ8aSBjbGFzc05hbWU9XCJmYSBmYS1hbmdsZS1yaWdodFwiPjwvaT5cblx0XHRcdDwvYnV0dG9uPlxuXG5cdFx0KVxuXHR9XG5cbn0pXG5cbmZ1bmN0aW9uIGV2YWxpZGF0aW9uKG15RnVuYywgdmFsdWUpIHtcblx0dmFyIHQgPSBuZXcgRnVuY3Rpb24oJ3YnLCBteUZ1bmMpO1xuXHRyZXR1cm4gdCh2YWx1ZSk7XG59XG5cbnZhciBMb2FkaW5nT3ZlcmxheSA9IHtcblxuXHRvcGVuOiBmdW5jdGlvbigpIHtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbicpLnN0eWxlLm9wYWNpdHkgPSAwO1xuXHRcdGNvbnN0IGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9hZGluZ19vdmVybGF5Jyk7XG5cdFx0ZS5jbGFzc05hbWUgPSAnYW5pbWF0ZSc7XG5cdFx0c2V0VGltZW91dCgoKSA9PiB7IGUuY2xhc3NOYW1lID0gJ2FuaW1hdGUgc2hvdyc7IH0sIDEwKTtcblx0fSxcblxuXHRjbG9zZTogZnVuY3Rpb24oKSB7XG5cdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKS5zdHlsZS5vcGFjaXR5ID0gMTtcblx0XHRjb25zdCBlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvYWRpbmdfb3ZlcmxheScpO1xuXHRcdGUuY2xhc3NOYW1lID0gJ2FuaW1hdGUnO1xuXHRcdHNldFRpbWVvdXQoKCkgPT4geyBlLmNsYXNzTmFtZSA9ICcnOyB9LCA1MDApO1xuXHR9LFxuXG59XG5cbmV4cG9ydHMuRmllbGRJbnB1dCA9IEZpZWxkSW5wdXQ7XG5leHBvcnRzLkZpZWxkSGlkZGVuID0gRmllbGRIaWRkZW47XG5leHBvcnRzLkZpZWxkUGFzc3dvcmQgPSBGaWVsZFBhc3N3b3JkO1xuZXhwb3J0cy5GaWVsZFNlbGVjdCA9IEZpZWxkU2VsZWN0O1xuZXhwb3J0cy5DaGVja2JveElucHV0ID0gQ2hlY2tib3hJbnB1dDtcbmV4cG9ydHMuUGFyYWdyYXBoID0gUGFyYWdyYXBoO1xuZXhwb3J0cy5EaXZpZGVyID0gRGl2aWRlcjtcbmV4cG9ydHMuTGlzdEJ1dHRvbiA9IExpc3RCdXR0b247XG5leHBvcnRzLkxvYWRpbmdPdmVybGF5ID0gTG9hZGluZ092ZXJsYXk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRGaWVsZElucHV0OiBGaWVsZElucHV0LFxuXHRGaWVsZEhpZGRlbjogRmllbGRIaWRkZW4sXG5cdEZpZWxkUGFzc3dvcmQ6IEZpZWxkUGFzc3dvcmQsXG5cdEZpZWxkU2VsZWN0OiBGaWVsZFNlbGVjdCxcblx0Q2hlY2tib3hJbnB1dDogQ2hlY2tib3hJbnB1dCxcblx0UGFyYWdyYXBoOiBQYXJhZ3JhcGgsXG5cdERpdmlkZXI6IERpdmlkZXIsXG5cdExpc3RCdXR0b246IExpc3RCdXR0b24sXG5cdExvYWRpbmdPdmVybGF5OiBMb2FkaW5nT3ZlcmxheVxufTsiLCIndXNlIHN0cmljdCc7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgUmVhY3QgPSBnbG9iYWwuUmVhY3Q7XG5cbnZhciBNYWluQ29udGVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy51cGRhdGVEaW1lbnNpb25zKTtcbiAgICBkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nOyAgICBcbiAgICBzZXRUaW1lb3V0KHRoaXMudXBkYXRlRGltZW5zaW9ucywgMTAwKTtcbiAgfSxcblxuICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24oKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIiwgdGhpcy51cGRhdGVEaW1lbnNpb25zKTtcbiAgfSxcblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcbiAgICB0aGlzLnVwZGF0ZURpbWVuc2lvbnMoKTtcbiAgfSxcblxuICBnZXRGdWxsSGVpZ2h0OiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdyA9IHdpbmRvdyxcbiAgICAgICAgZCA9IGRvY3VtZW50LFxuICAgICAgICBlID0gZC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgIGcgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0sXG4gICAgICAgIGggPSB3LmlubmVySGVpZ2h0fHwgZS5jbGllbnRIZWlnaHR8fCBnLmNsaWVudEhlaWdodCxcbiAgICAgICAgYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicmVhbC1jb250YWluZXJcIikuY2hpbGROb2RlcztcbiAgICBmb3IgKHZhciB4IGluIGMpIHsgaCAtPSAoY1t4XS5ub2RlVHlwZSA9PSAnMScgJiYgY1t4XS5pZCAhPSAnbWFpbi1jb250ZW50JykgPyBjW3hdLm9mZnNldEhlaWdodCA6IDA7IH1cbiAgICByZXR1cm4gaDtcbiAgfSxcblxuICB1cGRhdGVEaW1lbnNpb25zOiBmdW5jdGlvbigpIHtcblxuICAgIGlmICh0aGlzLnByb3BzLmZ1bGwpIHtcbiAgICAgIHRoaXMucmVmcy5tYWluQ29udGVudC5zdHlsZS5oZWlnaHQgPSB0aGlzLmdldEZ1bGxIZWlnaHQoKSsncHgnO1xuICAgICAgdGhpcy5yZWZzXG4gICAgICAvLyB0aGlzLnJlZnMuY29udGVudEJhY2tncm91bmQuc3R5bGUubWluSGVpZ2h0ID0gdGhpcy5nZXRGdWxsSGVpZ2h0KCkrJ3B4JztcbiAgICB9XG4gIH0sXG5cblx0cmVuZGVyKCkge1xuXG4gICAgY29uc3QgY2JDbGFzcyA9ICh0aGlzLnByb3BzLmZ1bGwpID8gJ2NvbnRlbnQtYmFja2dyb3VuZCBmdWxsJyA6ICdjb250ZW50LWJhY2tncm91bmQnO1xuXG5cdFx0cmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwibWFpbi1jb250ZW50XCIgaWQ9XCJtYWluLWNvbnRlbnRcIiByZWY9XCJtYWluQ29udGVudFwiPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT17Y2JDbGFzc30gcmVmPVwiY29udGVudEJhY2tncm91bmRcIiBzdHlsZT17dGhpcy5wcm9wcy5jb250ZW50QmFja2dyb3VuZFN0eWxlIHx8IG51bGx9PlxuXHRcdFx0XHRcdHt0aGlzLnByb3BzLmNoaWxkcmVufVxuXHRcdFx0XHQ8L2Rpdj5cblx0XHRcdDwvZGl2PlxuXHRcdClcblx0fVxuXG59KTtcblxuZXhwb3J0cy5NYWluQ29udGVudCA9IE1haW5Db250ZW50O1xubW9kdWxlLmV4cG9ydHMgPSBNYWluQ29udGVudDsiLCIndXNlIHN0cmljdCc7XG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgUmVhY3QgPSBnbG9iYWwuUmVhY3Q7XG52YXIgQ29va2llcyA9IHJlcXVpcmUoJ2pzLWNvb2tpZScpO1xudmFyIEdlbmVyYWwgPSByZXF1aXJlKCcuL0dlbmVyYWwnKTtcblxudmFyIFRvcE5hdiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRJbml0aWFsU3RhdGUoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG1lbnVPcGVuOiBmYWxzZVxuXHRcdH1cblx0fSxcblxuXHRtZW51VG9nZ2xlKHN0YXR1cykge1xuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0bWVudU9wZW46IEJvb2xlYW4oc3RhdHVzKVxuXHRcdH0pXG5cdH0sXG5cblx0cmVuZGVyKCkge1xuXG5cdFx0dmFyIGhlaWdodCA9IG51bGw7XG5cdFx0dmFyIHN0eSA9IHt9O1xuXHRcdGlmICh0aGlzLnByb3BzLmhlaWdodCkgeyBoZWlnaHQgPSB0aGlzLnByb3BzLmhlaWdodCArJ3B4Jzsgc3R5LmhlaWdodCA9IGhlaWdodDsgfVxuXHRcdGlmICh0aGlzLnByb3BzLmJhY2tncm91bmQpIHsgc3R5LmJhY2tncm91bmQgPSB0aGlzLnByb3BzLmJhY2tncm91bmQ7IH1cblxuXHRcdHZhciBtYWluID0gKHRoaXMucHJvcHMubWFpbk1lbnUpID8gPE1haW5NZW51IGhlaWdodD17aGVpZ2h0fSBsaXN0PXt0aGlzLnByb3BzLm1haW5NZW51fSBvbk1lbnVUb2dnbGU9e3RoaXMubWVudVRvZ2dsZX0gLz4gOiBudWxsO1xuXHRcdHZhciBsYW5nID0gKHRoaXMucHJvcHMubGFuZ01lbnUpID8gPExhbmdNZW51IGhlaWdodD17aGVpZ2h0fSBsaXN0PXt0aGlzLnByb3BzLmxhbmdNZW51Lmxpc3R9IGN1cnJlbnQ9e3RoaXMucHJvcHMubGFuZ01lbnUuY3VycmVudH0gb25NZW51VG9nZ2xlPXt0aGlzLm1lbnVUb2dnbGV9IC8+IDogbnVsbDtcblx0XHR2YXIgY2xhc3NOYW1lID0gKHRoaXMucHJvcHMuZml4ZWQpID8gJ2ZpeGVkJyA6ICcnO1xuXHRcdHZhciBkaXZDbGFzc25hbWUgPSBcIm5hdmlnYXRpb24tYmFja2dyb3VuZCB0b3BiYXJcIjtcblx0XHRpZiAodGhpcy5zdGF0ZS5tZW51T3BlbikgeyBkaXZDbGFzc25hbWUgKz0gJyBtZW51LW9wZW5lZCcgfVxuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxuYXYgaWQ9XCJtYWluTmF2XCIgY2xhc3NOYW1lPXtjbGFzc05hbWV9PlxuXHRcdFx0XHQ8ZGl2IGNsYXNzTmFtZT17ZGl2Q2xhc3NuYW1lfSBzdHlsZT17c3R5fT5cblx0XHRcdFx0XHR7dGhpcy5wcm9wcy5jaGlsZHJlbn1cblx0XHRcdFx0PC9kaXY+XG5cdFx0XHRcdHttYWlufVxuXHRcdFx0XHR7bGFuZ31cblx0XHRcdDwvbmF2PlxuXHRcdClcblx0fVxuXG59KTtcblxudmFyIFRvcE5hdlRpdGxlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdHJlbmRlcigpIHtcblxuXHRcdGlmICh0aGlzLnByb3BzLmhlaWdodCkge1xuXHRcdFx0dmFyIHN0eSA9IHtcblx0XHRcdFx0bGluZUhlaWdodDogdGhpcy5wcm9wcy5oZWlnaHQrJ3B4J1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8aDIgY2xhc3NOYW1lPVwibXVpLS10ZXh0LWNlbnRlclwiIHN0eWxlPXtzdHkgfHwgbnVsbH0+e3RoaXMucHJvcHMuY2hpbGRyZW4gfHwgdGhpcy5wcm9wcy50ZXh0fTwvaDI+XG5cdFx0KVxuXHR9XG5cbn0pO1xuXG52YXIgVG9wTmF2TG9nbyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRyZW5kZXIoKSB7XG5cblx0XHR2YXIgY2xhc3NOYW1lID0gJ2xvZ28nO1xuXHRcdGlmICh0aGlzLnByb3BzLmFsaWduKSB7XG5cdFx0XHRjbGFzc05hbWUgKz0gJyAnK3RoaXMucHJvcHMuYWxpZ247XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMucHJvcHMuaGVpZ2h0KSB7XG5cdFx0XHR2YXIgc3R5ID0ge1xuXHRcdFx0XHRoZWlnaHQ6IHRoaXMucHJvcHMuaGVpZ2h0KydweCcsXG5cdFx0XHRcdG1hcmdpblRvcDogJy0nICsgcGFyc2VJbnQodGhpcy5wcm9wcy5oZWlnaHQvMikgKyAncHgnXG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChcblx0XHRcdDxpbWcgY2xhc3NOYW1lPXtjbGFzc05hbWV9IHNyYz17dGhpcy5wcm9wcy5pbWd9IHN0eWxlPXtzdHkgfHwgbnVsbH0gLz5cblx0XHQpXG5cdH1cblxufSlcblxudmFyIFRvcE5hdkJ1dHRvbiA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRyZW5kZXIoKSB7XG5cblx0XHR2YXIgcHIgPSB7XG5cdFx0XHRzdHlsZToge31cblx0XHR9O1xuXG5cdFx0dmFyIGNsYXNzTmFtZSA9ICdhcHBiYXItYWN0aW9uIG11aS0tYXBwYmFyLWhlaWdodCBtdWktLWFwcGJhci1saW5lLWhlaWdodCc7XG5cdFx0aWYgKHRoaXMucHJvcHMuc2lkZSAmJiB0aGlzLnByb3BzLnNpZGUgPT0gJ2xlZnQnKSB7IHByLnN0eWxlLmxlZnQgPSAwOyB9XG5cdFx0aWYgKHRoaXMucHJvcHMuc2lkZSAmJiB0aGlzLnByb3BzLnNpZGUgPT0gJ3JpZ2h0JykgeyBwci5zdHlsZS5yaWdodCA9IDAgfVxuXG5cdFx0aWYgKHRoaXMucHJvcHMub25DbGljaykgeyBwci5vbkNsaWNrID0gdGhpcy5wcm9wcy5vbkNsaWNrIH1cblxuXHRcdHJldHVybiAoXG5cdFx0XHQ8YSBjbGFzc05hbWU9e2NsYXNzTmFtZX0gey4uLnByfT5cblx0XHRcdFx0e3RoaXMucHJvcHMuY2hpbGRyZW59XG5cdFx0XHQ8L2E+XG5cdFx0KVxuXHR9XG5cbn0pO1xuXG52YXIgTG9hZGluZ0JhciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB7IGNvbXBsZXRlZDogdGhpcy5wcm9wcy5jb21wbGV0ZWQgfHwgMCB9XG4gIH0sXG5cbiAgLypjaGFuZ2VzIHN0YXRlKi9cbiAgaGFuZGxlQ29tcGxldGVkOiBmdW5jdGlvbiAodmFsdWUpIHtcblxuICAgIHZhciBjb21wbGV0ZWQgPSB2YWx1ZTtcbiAgICBpZiAoY29tcGxldGVkID09PSBOYU4gfHwgY29tcGxldGVkIDwgMCkgeyBjb21wbGV0ZWQgPSAwIH07XG4gICAgaWYgKGNvbXBsZXRlZCA+IDEwMCkge2NvbXBsZXRlZCA9IDEwMH07XG5cbiAgICB0aGlzLnNldFN0YXRlKHsgY29tcGxldGVkOiBjb21wbGV0ZWQgfSk7XG5cbiAgfSxcblxuICB1cGRhdGVCYXI6IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMucmVmcy5iYXIuc3R5bGUud2lkdGggPSB0aGlzLnN0YXRlLmNvbXBsZXRlZCArICclJztcbiAgfSxcblxuICAvKmxpZmVjeWNsZSBtZXRob2RzKi9cbiAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uICgpIHsgXG4gICAgdGhpcy51cGRhdGVCYXIoKVxuICB9LFxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uICgpIHsgXG4gICAgdGhpcy51cGRhdGVCYXIoKVxuICB9LFxuXG4gIHJlbmRlcjogZnVuY3Rpb24gKCkge1xuXG4gICAgY29uc3Qgc3R5bGUgPSB7XG4gICAgICB0cmFuc2l0aW9uOiBcIndpZHRoIDIwMG1zXCJcblx0XHR9O1xuXG4gICAgcmV0dXJuIChcblx0XHRcdFx0PGRpdiBjbGFzc05hbWU9XCJsb2FkaW5nLWJhciB3aXRoLWFwcGJhci10b3BcIj5cblx0XHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJiYXJcIiByZWY9XCJiYXJcIiBzdHlsZT17c3R5bGV9Pjwvc3Bhbj5cblx0XHRcdFx0PC9kaXY+XG5cdCAgKVxuICB9XG4gIFxufSk7XG5cbnZhciBNYWluTWVudSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblxuXHRnZXRJbml0aWFsU3RhdGUoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdG9wZW46IGZhbHNlXG5cdFx0fVxuXHR9LFxuXG5cdGNvbXBvbmVudERpZE1vdW50KCkge1xuXHRcdFxuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICBcdFx0dyA9IHdpbmRvdyxcbiAgICAgICAgZCA9IGRvY3VtZW50LFxuICAgICAgICBlID0gZC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgIGcgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0sXG4gICAgICAgIGggPSB3LmlubmVySGVpZ2h0fHwgZS5jbGllbnRIZWlnaHR8fCBnLmNsaWVudEhlaWdodCxcbiAgICAgICAgYyA9IGggLSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKCduYXYnKVswXS5vZmZzZXRIZWlnaHQ7XG4gICAgc2VsZi5yZWZzLm1lbnUuc3R5bGUuaGVpZ2h0ID0gaCsncHgnO1xuXG5cdFx0c2V0VGltZW91dCgoKSA9PiB7XG5cdFx0XHRzZWxmLnJlZnMudWwuc3R5bGUuaGVpZ2h0ID0gc2VsZi5yZWZzLnVsLm9mZnNldEhlaWdodCArICdweCc7XG5cdFx0XHRpZiAoIXNlbGYuc3RhdGUub3Blbikge1xuXHRcdFx0XHRzZWxmLnJlZnMubWVudS5jbGFzc05hbWUgPSBzZWxmLnJlZnMubWVudS5jbGFzc05hbWUgKyAnIGNsb3NlIGhpZGUnO1xuXHRcdFx0fVxuXHRcdH0sIDEwMClcblxuXHR9LFxuXG5cdGhhbmRsZU9wZW5DbG9zZSgpIHtcblxuXHRcdHRoaXMuc2V0U3RhdGUoe1xuXHRcdFx0b3BlbjogIXRoaXMuc3RhdGUub3BlblxuXHRcdH0pXG5cblx0XHR0aGlzLnJlZnMubWVudS5jbGFzc05hbWUgPSAoIXRoaXMuc3RhdGUub3BlbikgPyB0aGlzLnJlZnMubWVudS5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKCcoPzpefFxcXFxzKScrICdjbG9zZScgKyAnKD86XFxcXHN8JCknKSwgJyAnKSA6IHRoaXMucmVmcy5tZW51LmNsYXNzTmFtZSArICcgY2xvc2UnO1xuXG5cdFx0aWYgKCF0aGlzLnN0YXRlLm9wZW4pIHtcblx0XHRcdHRoaXMucmVmcy5tZW51LmNsYXNzTmFtZSA9IHRoaXMucmVmcy5tZW51LmNsYXNzTmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoJyg/Ol58XFxcXHMpJysgJ2hpZGUnICsgJyg/OlxcXFxzfCQpJyksICcgJylcblx0XHRcdGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnaGlkZGVuJztcdFx0XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0c2VsZi5yZWZzLm1lbnUuY2xhc3NOYW1lICs9ICcgaGlkZSc7XG5cdFx0XHRcdGRvY3VtZW50LmJvZHkuc3R5bGUub3ZlcmZsb3cgPSAnYXV0byc7XG5cdFx0XHR9LCAxMDAwKTtcblx0XHR9XG5cblx0XHRpZiAodGhpcy5wcm9wcy5vbk1lbnVUb2dnbGUpIHtcblx0XHRcdHRoaXMucHJvcHMub25NZW51VG9nZ2xlKCF0aGlzLnN0YXRlLm9wZW4pO1xuXHRcdH1cblxuXHR9LFxuXG5cdHJlbmRlckVsZW1lbnQoa2V5LCB2YWx1ZSkge1xuXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXG5cdFx0Ly8gVE9ETyBUUkFOU0xBVEVcblx0XHR2YXIgbGFiZWxzID0ge1xuXHRcdFx0bXlQcm9maWxlOiAnTXkgUHJvZmlsZScsXG5cdFx0XHRpbnRlcm5ldFByb2ZpbGU6ICdJbnRlcm50IFByb2ZpbGUnLFxuXHRcdFx0YXBwczogJ0FwcHMnLFxuXHRcdFx0bG9nb3V0OiAnTG9nb3V0J1xuXHRcdH1cblxuXHRcdHZhciBlbGVtZW50O1xuXHRcdHN3aXRjaChrZXkpIHtcblx0XHRcdGNhc2UgJ2xvZ291dCc6XG5cdFx0XHRcdGVsZW1lbnQgPSA8bGkga2V5PXtrZXl9IG9uQ2xpY2s9e3NlbGYuZG9Mb2dvdXR9PntsYWJlbHNba2V5XX08L2xpPiBcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRkZWZhdWx0OiBcblx0XHRcdFx0aWYgKHZhbHVlKSB7XG5cdFx0XHRcdFx0ZWxlbWVudCA9IDxsaSBrZXk9e2tleX0+e2xhYmVsc1trZXldfTwvbGk+XG5cdFx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gZWxlbWVudDtcblxuXHR9LFxuXG5cdGRvTG9nb3V0KCkge1xuXG5cdFx0dmFyIGxvZ291dCA9IENvb2tpZXMuZ2V0SlNPTignbG9nb3V0Jyk7XG5cdFx0aWYgKGxvZ291dCkge1xuXG5cdCAgICBHZW5lcmFsLkxvYWRpbmdPdmVybGF5Lm9wZW4oKTtcblxuXHRcdFx0Q29va2llcy5yZW1vdmUoJ2xvZ291dCcpO1xuXHRcdFx0Q29va2llcy5yZW1vdmUoJ2NvbmZpZ19zdGFnZScpO1xuXHRcdFx0Q29va2llcy5yZW1vdmUoJ3ByZUxvZ2luJyk7XG5cblx0XHRcdHNldFRpbWVvdXQoICgpID0+IHtcblx0XHRcdFx0d2luZG93LmxvY2F0aW9uLmhyZWYgPSBsb2dvdXQudXJsO1xuXHRcdFx0fSwgMzAwKTtcblx0XHRcdFxuXHRcdH1cblxuXHR9LFxuXG5cdHJlbmRlcigpIHtcblxuXHRcdHZhciBidG5DbGFzcyA9IFwiaGFtYnVyZ2VyIGhhbWJ1cmdlci0tc2xpZGVyIFwiO1xuXHRcdGlmICh0aGlzLnN0YXRlLm9wZW4pIHtcblx0XHRcdGJ0bkNsYXNzICs9ICdpcy1hY3RpdmUnO1xuXHRcdH1cblxuXHRcdHZhciBzdHkgPSB7XG5cdFx0XHRkaXY6IHt9LFxuXHRcdFx0YnV0dG9uOiB7fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnByb3BzLmhlaWdodCkge1xuXHRcdFx0dmFyIGggPSB0aGlzLnByb3BzLmhlaWdodFxuXHRcdFx0c3R5LmRpdi5oZWlnaHQgPSBoO1xuXHRcdFx0c3R5LmRpdi50b3AgPSAnLScraDtcblx0XHRcdHN0eS5idXR0b24uaGVpZ2h0ID0gaDtcblx0XHRcdHN0eS5idXR0b24ubGluZUhlaWdodCA9IGg7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChcblxuXHRcdFx0PGRpdiByZWY9XCJtZW51XCIgY2xhc3NOYW1lPVwibWFpbi1tZW51XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiYnV0dG9uXCIgc3R5bGU9e3N0eS5kaXZ9IG9uQ2xpY2s9e3RoaXMuaGFuZGxlT3BlbkNsb3NlfT5cblx0XHRcdFx0XHQ8YnV0dG9uIHJlZj1cIm9wZW5DbG9zZVwiIHN0eWxlPXtzdHkuYnV0dG9ufSBjbGFzc05hbWU9e2J0bkNsYXNzfT5cblx0XHRcdFx0XHQgIDxzcGFuIGNsYXNzTmFtZT1cImhhbWJ1cmdlci1ib3hcIj5cblx0XHRcdFx0XHQgICAgPHNwYW4gY2xhc3NOYW1lPVwiaGFtYnVyZ2VyLWlubmVyXCI+PC9zcGFuPlxuXHRcdFx0XHRcdCAgPC9zcGFuPlxuXHRcdFx0XHRcdDwvYnV0dG9uPlxuXHRcdFx0XHQ8L2Rpdj5cblxuXHRcdFx0XHQ8dWwgcmVmPVwidWxcIj5cblx0XHRcdFx0XHR7bWFwT2JqZWN0KHRoaXMucHJvcHMubGlzdCwgKGssdikgPT4ge1xuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMucmVuZGVyRWxlbWVudChrLHYpO1xuXHRcdFx0XHRcdH0pfVxuXHRcdFx0XHQ8L3VsPlxuXHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJvdmVybGF5XCIgb25DbGljaz17dGhpcy5oYW5kbGVPcGVuQ2xvc2V9Pjwvc3Bhbj5cblx0XHRcdDwvZGl2PlxuXHRcdClcblx0fVxuXG59KVxuXG52YXIgTGFuZ01lbnUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cblx0Z2V0SW5pdGlhbFN0YXRlKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRvcGVuOiBmYWxzZVxuXHRcdH1cblx0fSxcblxuXHRjb21wb25lbnREaWRNb3VudCgpIHtcblx0XHRcbiAgICB2YXIgdyA9IHdpbmRvdyxcbiAgICAgICAgZCA9IGRvY3VtZW50LFxuICAgICAgICBlID0gZC5kb2N1bWVudEVsZW1lbnQsXG4gICAgICAgIGcgPSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdib2R5JylbMF0sXG4gICAgICAgIGggPSB3LmlubmVySGVpZ2h0fHwgZS5jbGllbnRIZWlnaHR8fCBnLmNsaWVudEhlaWdodCxcbiAgICAgICAgYyA9IGggLSBkLmdldEVsZW1lbnRzQnlUYWdOYW1lKCduYXYnKVswXS5vZmZzZXRIZWlnaHQ7XG4gICAgdGhpcy5yZWZzLm1lbnUuc3R5bGUuaGVpZ2h0ID0gaCsncHgnO1xuXG5cdFx0dGhpcy5yZWZzLnVsLnN0eWxlLmhlaWdodCA9IHRoaXMucmVmcy51bC5vZmZzZXRIZWlnaHQgKyAncHgnO1xuXHRcdGlmICghdGhpcy5zdGF0ZS5vcGVuKSB7XG5cdFx0XHR0aGlzLnJlZnMubWVudS5jbGFzc05hbWUgPSB0aGlzLnJlZnMubWVudS5jbGFzc05hbWUgKyAnIGNsb3NlIGhpZGUnO1xuXHRcdH1cblxuXHR9LFxuXG5cdGhhbmRsZU9wZW5DbG9zZShlKSB7XG5cblx0XHR0aGlzLnNldFN0YXRlKHtcblx0XHRcdG9wZW46ICF0aGlzLnN0YXRlLm9wZW5cblx0XHR9KVxuXG5cdFx0ZS50YXJnZXQuYmx1cigpO1xuXG5cdFx0dGhpcy5yZWZzLm1lbnUuY2xhc3NOYW1lID0gKCF0aGlzLnN0YXRlLm9wZW4pID8gdGhpcy5yZWZzLm1lbnUuY2xhc3NOYW1lLnJlcGxhY2UobmV3IFJlZ0V4cCgnKD86XnxcXFxccyknKyAnY2xvc2UnICsgJyg/OlxcXFxzfCQpJyksICcgJykgOiB0aGlzLnJlZnMubWVudS5jbGFzc05hbWUgKyAnIGNsb3NlJztcblxuXHRcdGlmICghdGhpcy5zdGF0ZS5vcGVuKSB7XG5cdFx0XHR0aGlzLnJlZnMubWVudS5jbGFzc05hbWUgPSB0aGlzLnJlZnMubWVudS5jbGFzc05hbWUucmVwbGFjZShuZXcgUmVnRXhwKCcoPzpefFxcXFxzKScrICdoaWRlJyArICcoPzpcXFxcc3wkKScpLCAnICcpXG5cdFx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBzZWxmID0gdGhpcztcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHNlbGYucmVmcy5tZW51LmNsYXNzTmFtZSArPSAnIGhpZGUnO1xuXHRcdFx0XHRkb2N1bWVudC5ib2R5LnN0eWxlLm92ZXJmbG93ID0gJ2F1dG8nO1xuXHRcdFx0fSwgMTAwMCk7XG5cblx0XHR9XG5cblx0XHRpZiAodGhpcy5wcm9wcy5vbk1lbnVUb2dnbGUpIHtcblx0XHRcdHRoaXMucHJvcHMub25NZW51VG9nZ2xlKCF0aGlzLnN0YXRlLm9wZW4pO1xuXHRcdH1cblxuXHR9LFxuXG5cdGhhbmRsZUNoYW5nZUxhbmd1YWdlKGUpIHtcblx0XHRpZiAodGhpcy5wcm9wcy5oYW5kbGVDaGFuZ2VMYW5ndWFnZSkge1xuXHRcdFx0dGhpcy5wcm9wcy5oYW5kbGVDaGFuZ2VMYW5ndWFnZShlLnRhcmdldC5sYW5nKTtcblx0XHR9XG5cdH0sXG5cblx0cmVuZGVyKCkge1xuXG5cdFx0dmFyIHNlbGYgPSB0aGlzO1xuXHRcdHZhciBzdHkgPSB7XG5cdFx0XHRkaXY6IHt9LFxuXHRcdFx0YnV0dG9uOiB7fVxuXHRcdH1cblxuXHRcdGlmICh0aGlzLnByb3BzLmhlaWdodCkge1xuXHRcdFx0dmFyIGggPSB0aGlzLnByb3BzLmhlaWdodFxuXHRcdFx0c3R5LmRpdi5oZWlnaHQgPSBoO1xuXHRcdFx0c3R5LmRpdi50b3AgPSAnLScraDtcblx0XHRcdHN0eS5idXR0b24uaGVpZ2h0ID0gaDtcblx0XHRcdHN0eS5idXR0b24ubGluZUhlaWdodCA9IGg7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIChcblxuXHRcdFx0PGRpdiByZWY9XCJtZW51XCIgY2xhc3NOYW1lPVwibGFuZy1tZW51XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3NOYW1lPVwiYnV0dG9uXCIgc3R5bGU9e3N0eS5kaXZ9IG9uQ2xpY2s9e3RoaXMuaGFuZGxlT3BlbkNsb3NlfT5cblx0XHRcdFx0XHQ8YnV0dG9uIHJlZj1cIm9wZW5DbG9zZVwiIHN0eWxlPXtzdHkuYnV0dG9ufT5cblx0XHRcdFx0XHRcdDxpIGNsYXNzTmFtZT1cImZhIGZhLWdsb2JlXCI+PC9pPlxuXHRcdFx0XHRcdCAgPHNwYW4gcmVmPVwic2VsZWN0ZWRcIj57dGhpcy5wcm9wcy5jdXJyZW50fTwvc3Bhbj5cblx0XHRcdFx0XHQ8L2J1dHRvbj5cblx0XHRcdFx0PC9kaXY+XG5cblx0XHRcdFx0PHVsIHJlZj1cInVsXCI+XG5cdFx0XHRcdFx0e3RoaXMucHJvcHMubGlzdC5tYXAoKGxhbmcpID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiA8bGkga2V5PXtsYW5nfSBsYW5nPXtsYW5nfSBvbkNsaWNrPXtzZWxmLmhhbmRsZUNoYW5nZUxhbmd1YWdlfT57bGFuZ308L2xpPlxuXHRcdFx0XHRcdH0pfVxuXHRcdFx0XHQ8L3VsPlxuXHRcdFx0XHQ8c3BhbiBjbGFzc05hbWU9XCJvdmVybGF5XCIgb25DbGljaz17dGhpcy5oYW5kbGVPcGVuQ2xvc2V9Pjwvc3Bhbj5cblx0XHRcdDwvZGl2PlxuXHRcdClcblx0fVxuXG59KVxuXG5mdW5jdGlvbiBtYXBPYmplY3Qob2JqZWN0LCBjYWxsYmFjaykge1xuICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KS5tYXAoZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBjYWxsYmFjayhrZXksIG9iamVjdFtrZXldKTtcbiAgfSk7XG59XG5cbmV4cG9ydHMuQmFyID0gVG9wTmF2O1xuZXhwb3J0cy5UaXRsZSA9IFRvcE5hdlRpdGxlO1xuZXhwb3J0cy5Mb2dvID0gVG9wTmF2TG9nbztcbmV4cG9ydHMuQnV0dG9uID0gVG9wTmF2QnV0dG9uO1xuZXhwb3J0cy5Mb2FkaW5nID0gTG9hZGluZ0JhcjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdEJhcjogVG9wTmF2LFxuXHRUaXRsZTogVG9wTmF2VGl0bGUsXG5cdExvZ286IFRvcE5hdkxvZ28sXG5cdEJ1dHRvbjogVG9wTmF2QnV0dG9uLFxuXHRMb2FkaW5nOiBMb2FkaW5nQmFyXG59OyIsIid1c2Ugc3RyaWN0JztcbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG52YXIgVG9wTmF2Q29tcG9uZW50ID0gcmVxdWlyZSgnLi4vY29tcG9uZW50cy9Ub3BOYXYnKTtcblxudmFyIFJlYWN0ID0gZ2xvYmFsLlJlYWN0O1xuXG52YXIgVG9wTmF2ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXG5cdHJlbmRlcigpIHtcblxuXHRcdHZhciBjb25maWcgPSB0aGlzLnByb3BzLmNvbmZpZztcblxuXHRcdHZhciBsb2dvID0gbnVsbDtcblx0XHRpZiAoY29uZmlnLmxvZ28pIHtcblx0XHRcdGlmIChjb25maWcubG9nby50eXBlID09ICdpbWcnKSB7XG5cdFx0XHRcdGxvZ28gPSA8VG9wTmF2Q29tcG9uZW50LkxvZ28gYWxpZ249XCJjZW50ZXJcIiBpbWc9e2NvbmZpZy5sb2dvLnZhbHVlfSBoZWlnaHQ9e2NvbmZpZy5sb2dvLmhlaWdodCB8fCBudWxsfSAvPlxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bG9nbyA9IDxUb3BOYXZDb21wb25lbnQuVGl0bGUgdGV4dD17Y29uZmlnLmxvZ28udmFsdWV9IGhlaWdodD17Y29uZmlnLmxvZ28uaGVpZ2h0IHx8IGNvbmZpZy5oZWlnaHQgfHwgbnVsbH0gLz5cblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gKFxuXG4gICAgICBcdDxUb3BOYXZDb21wb25lbnQuQmFyIG1haW5NZW51PXtjb25maWcubWVudX0gbGFuZ01lbnU9e2NvbmZpZy5sYW5nfSBoZWlnaHQ9e2NvbmZpZy5oZWlnaHQgfHwgbnVsbH0gYmFja2dyb3VuZD17Y29uZmlnLmJhY2tncm91bmQgfHwgbnVsbH0+XG5cbiAgICAgIFx0XHR7bG9nb31cblxuICAgICAgXHQ8L1RvcE5hdkNvbXBvbmVudC5CYXI+XG5cblx0XHQpXG5cdH1cblxufSk7XG5cbmV4cG9ydHMuVG9wTmF2ID0gVG9wTmF2O1xubW9kdWxlLmV4cG9ydHMgPSBUb3BOYXY7IiwiLyohXG4gKiBKYXZhU2NyaXB0IENvb2tpZSB2Mi4xLjNcbiAqIGh0dHBzOi8vZ2l0aHViLmNvbS9qcy1jb29raWUvanMtY29va2llXG4gKlxuICogQ29weXJpZ2h0IDIwMDYsIDIwMTUgS2xhdXMgSGFydGwgJiBGYWduZXIgQnJhY2tcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICovXG47KGZ1bmN0aW9uIChmYWN0b3J5KSB7XG5cdHZhciByZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSBmYWxzZTtcblx0aWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpIHtcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0XHRyZWdpc3RlcmVkSW5Nb2R1bGVMb2FkZXIgPSB0cnVlO1xuXHR9XG5cdGlmICghcmVnaXN0ZXJlZEluTW9kdWxlTG9hZGVyKSB7XG5cdFx0dmFyIE9sZENvb2tpZXMgPSB3aW5kb3cuQ29va2llcztcblx0XHR2YXIgYXBpID0gd2luZG93LkNvb2tpZXMgPSBmYWN0b3J5KCk7XG5cdFx0YXBpLm5vQ29uZmxpY3QgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR3aW5kb3cuQ29va2llcyA9IE9sZENvb2tpZXM7XG5cdFx0XHRyZXR1cm4gYXBpO1xuXHRcdH07XG5cdH1cbn0oZnVuY3Rpb24gKCkge1xuXHRmdW5jdGlvbiBleHRlbmQgKCkge1xuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgcmVzdWx0ID0ge307XG5cdFx0Zm9yICg7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gYXJndW1lbnRzWyBpIF07XG5cdFx0XHRmb3IgKHZhciBrZXkgaW4gYXR0cmlidXRlcykge1xuXHRcdFx0XHRyZXN1bHRba2V5XSA9IGF0dHJpYnV0ZXNba2V5XTtcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHJlc3VsdDtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQgKGNvbnZlcnRlcikge1xuXHRcdGZ1bmN0aW9uIGFwaSAoa2V5LCB2YWx1ZSwgYXR0cmlidXRlcykge1xuXHRcdFx0dmFyIHJlc3VsdDtcblx0XHRcdGlmICh0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblxuXHRcdFx0Ly8gV3JpdGVcblxuXHRcdFx0aWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG5cdFx0XHRcdGF0dHJpYnV0ZXMgPSBleHRlbmQoe1xuXHRcdFx0XHRcdHBhdGg6ICcvJ1xuXHRcdFx0XHR9LCBhcGkuZGVmYXVsdHMsIGF0dHJpYnV0ZXMpO1xuXG5cdFx0XHRcdGlmICh0eXBlb2YgYXR0cmlidXRlcy5leHBpcmVzID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRcdHZhciBleHBpcmVzID0gbmV3IERhdGUoKTtcblx0XHRcdFx0XHRleHBpcmVzLnNldE1pbGxpc2Vjb25kcyhleHBpcmVzLmdldE1pbGxpc2Vjb25kcygpICsgYXR0cmlidXRlcy5leHBpcmVzICogODY0ZSs1KTtcblx0XHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPSBleHBpcmVzO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRyZXN1bHQgPSBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG5cdFx0XHRcdFx0aWYgKC9eW1xce1xcW10vLnRlc3QocmVzdWx0KSkge1xuXHRcdFx0XHRcdFx0dmFsdWUgPSByZXN1bHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXG5cdFx0XHRcdGlmICghY29udmVydGVyLndyaXRlKSB7XG5cdFx0XHRcdFx0dmFsdWUgPSBlbmNvZGVVUklDb21wb25lbnQoU3RyaW5nKHZhbHVlKSlcblx0XHRcdFx0XHRcdC5yZXBsYWNlKC8lKDIzfDI0fDI2fDJCfDNBfDNDfDNFfDNEfDJGfDNGfDQwfDVCfDVEfDVFfDYwfDdCfDdEfDdDKS9nLCBkZWNvZGVVUklDb21wb25lbnQpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhbHVlID0gY29udmVydGVyLndyaXRlKHZhbHVlLCBrZXkpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0a2V5ID0gZW5jb2RlVVJJQ29tcG9uZW50KFN0cmluZyhrZXkpKTtcblx0XHRcdFx0a2V5ID0ga2V5LnJlcGxhY2UoLyUoMjN8MjR8MjZ8MkJ8NUV8NjB8N0MpL2csIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cdFx0XHRcdGtleSA9IGtleS5yZXBsYWNlKC9bXFwoXFwpXS9nLCBlc2NhcGUpO1xuXG5cdFx0XHRcdHJldHVybiAoZG9jdW1lbnQuY29va2llID0gW1xuXHRcdFx0XHRcdGtleSwgJz0nLCB2YWx1ZSxcblx0XHRcdFx0XHRhdHRyaWJ1dGVzLmV4cGlyZXMgPyAnOyBleHBpcmVzPScgKyBhdHRyaWJ1dGVzLmV4cGlyZXMudG9VVENTdHJpbmcoKSA6ICcnLCAvLyB1c2UgZXhwaXJlcyBhdHRyaWJ1dGUsIG1heC1hZ2UgaXMgbm90IHN1cHBvcnRlZCBieSBJRVxuXHRcdFx0XHRcdGF0dHJpYnV0ZXMucGF0aCA/ICc7IHBhdGg9JyArIGF0dHJpYnV0ZXMucGF0aCA6ICcnLFxuXHRcdFx0XHRcdGF0dHJpYnV0ZXMuZG9tYWluID8gJzsgZG9tYWluPScgKyBhdHRyaWJ1dGVzLmRvbWFpbiA6ICcnLFxuXHRcdFx0XHRcdGF0dHJpYnV0ZXMuc2VjdXJlID8gJzsgc2VjdXJlJyA6ICcnXG5cdFx0XHRcdF0uam9pbignJykpO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBSZWFkXG5cblx0XHRcdGlmICgha2V5KSB7XG5cdFx0XHRcdHJlc3VsdCA9IHt9O1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBUbyBwcmV2ZW50IHRoZSBmb3IgbG9vcCBpbiB0aGUgZmlyc3QgcGxhY2UgYXNzaWduIGFuIGVtcHR5IGFycmF5XG5cdFx0XHQvLyBpbiBjYXNlIHRoZXJlIGFyZSBubyBjb29raWVzIGF0IGFsbC4gQWxzbyBwcmV2ZW50cyBvZGQgcmVzdWx0IHdoZW5cblx0XHRcdC8vIGNhbGxpbmcgXCJnZXQoKVwiXG5cdFx0XHR2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZSA/IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOyAnKSA6IFtdO1xuXHRcdFx0dmFyIHJkZWNvZGUgPSAvKCVbMC05QS1aXXsyfSkrL2c7XG5cdFx0XHR2YXIgaSA9IDA7XG5cblx0XHRcdGZvciAoOyBpIDwgY29va2llcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgcGFydHMgPSBjb29raWVzW2ldLnNwbGl0KCc9Jyk7XG5cdFx0XHRcdHZhciBjb29raWUgPSBwYXJ0cy5zbGljZSgxKS5qb2luKCc9Jyk7XG5cblx0XHRcdFx0aWYgKGNvb2tpZS5jaGFyQXQoMCkgPT09ICdcIicpIHtcblx0XHRcdFx0XHRjb29raWUgPSBjb29raWUuc2xpY2UoMSwgLTEpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHR2YXIgbmFtZSA9IHBhcnRzWzBdLnJlcGxhY2UocmRlY29kZSwgZGVjb2RlVVJJQ29tcG9uZW50KTtcblx0XHRcdFx0XHRjb29raWUgPSBjb252ZXJ0ZXIucmVhZCA/XG5cdFx0XHRcdFx0XHRjb252ZXJ0ZXIucmVhZChjb29raWUsIG5hbWUpIDogY29udmVydGVyKGNvb2tpZSwgbmFtZSkgfHxcblx0XHRcdFx0XHRcdGNvb2tpZS5yZXBsYWNlKHJkZWNvZGUsIGRlY29kZVVSSUNvbXBvbmVudCk7XG5cblx0XHRcdFx0XHRpZiAodGhpcy5qc29uKSB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRjb29raWUgPSBKU09OLnBhcnNlKGNvb2tpZSk7XG5cdFx0XHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmIChrZXkgPT09IG5hbWUpIHtcblx0XHRcdFx0XHRcdHJlc3VsdCA9IGNvb2tpZTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdGlmICgha2V5KSB7XG5cdFx0XHRcdFx0XHRyZXN1bHRbbmFtZV0gPSBjb29raWU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGNhdGNoIChlKSB7fVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xuXHRcdH1cblxuXHRcdGFwaS5zZXQgPSBhcGk7XG5cdFx0YXBpLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcblx0XHRcdHJldHVybiBhcGkuY2FsbChhcGksIGtleSk7XG5cdFx0fTtcblx0XHRhcGkuZ2V0SlNPTiA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBhcGkuYXBwbHkoe1xuXHRcdFx0XHRqc29uOiB0cnVlXG5cdFx0XHR9LCBbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuXHRcdH07XG5cdFx0YXBpLmRlZmF1bHRzID0ge307XG5cblx0XHRhcGkucmVtb3ZlID0gZnVuY3Rpb24gKGtleSwgYXR0cmlidXRlcykge1xuXHRcdFx0YXBpKGtleSwgJycsIGV4dGVuZChhdHRyaWJ1dGVzLCB7XG5cdFx0XHRcdGV4cGlyZXM6IC0xXG5cdFx0XHR9KSk7XG5cdFx0fTtcblxuXHRcdGFwaS53aXRoQ29udmVydGVyID0gaW5pdDtcblxuXHRcdHJldHVybiBhcGk7XG5cdH1cblxuXHRyZXR1cm4gaW5pdChmdW5jdGlvbiAoKSB7fSk7XG59KSk7XG4iXX0=