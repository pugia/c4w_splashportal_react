'use strict';
exports.__esModule = true;

var React = global.React;

var TopNav = React.createClass({

	getInitialState() {
		return {
			menuOpen: false
		}
	},

	menuToggle(status) {
		this.setState({
			menuOpen: Boolean(status)
		})
	},

	render() {

		var height = null;
		var sty = {};
		if (this.props.height) { height = this.props.height +'px'; sty.height = height; }
		if (this.props.background) { sty.background = this.props.background; }

		var main = (this.props.mainMenu) ? <MainMenu height={height} list={this.props.mainMenu} onMenuToggle={this.menuToggle} /> : null;
		var lang = (this.props.langMenu) ? <LangMenu height={height} list={this.props.langMenu.list} current={this.props.langMenu.current} onMenuToggle={this.menuToggle} /> : null;
		var className = (this.props.fixed) ? 'fixed' : '';
		var divClassname = "navigation-background topbar";
		if (this.state.menuOpen) { divClassname += ' menu-opened' }

		return (
			<nav id="mainNav" className={className}>
				<div className={divClassname} style={sty}>
					{this.props.children}
				</div>
				{main}
				{lang}
			</nav>
		)
	}

});

var TopNavTitle = React.createClass({

	render() {

		if (this.props.height) {
			var sty = {
				lineHeight: this.props.height+'px'
			}
		}

		return (
			<h2 className="mui--text-center" style={sty || null}>{this.props.children || this.props.text}</h2>
		)
	}

});

var TopNavLogo = React.createClass({

	render() {

		var className = 'logo';
		if (this.props.align) {
			className += ' '+this.props.align;
		}

		if (this.props.height) {
			var sty = {
				height: this.props.height+'px',
				marginTop: '-' + parseInt(this.props.height/2) + 'px'
			}
		}

		return (
			<img className={className} src={this.props.img} style={sty || null} />
		)
	}

})

var TopNavButton = React.createClass({

	render() {

		var pr = {
			style: {}
		};

		var className = 'appbar-action mui--appbar-height mui--appbar-line-height';
		if (this.props.side && this.props.side == 'left') { pr.style.left = 0; }
		if (this.props.side && this.props.side == 'right') { pr.style.right = 0 }

		if (this.props.onClick) { pr.onClick = this.props.onClick }

		return (
			<a className={className} {...pr}>
				{this.props.children}
			</a>
		)
	}

});

var LoadingBar = React.createClass({

  getInitialState: function() {
    return { completed: this.props.completed || 0 }
  },

  /*changes state*/
  handleCompleted: function (value) {

    var completed = value;
    if (completed === NaN || completed < 0) { completed = 0 };
    if (completed > 100) {completed = 100};

    this.setState({ completed: completed });

  },

  updateBar: function() {
    this.refs.bar.style.width = this.state.completed + '%';
  },

  /*lifecycle methods*/
  componentDidMount: function () { 
    this.updateBar()
  },
  componentDidUpdate: function () { 
    this.updateBar()
  },

  render: function () {

    const style = {
      transition: "width 200ms"
		};

    return (
				<div className="loading-bar with-appbar-top">
					<span className="bar" ref="bar" style={style}></span>
				</div>
	  )
  }
  
});

var MainMenu = React.createClass({

	getInitialState() {
		return {
			open: false
		}
	},

	componentDidMount() {
		
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        h = w.innerHeight|| e.clientHeight|| g.clientHeight,
        c = h - d.getElementsByTagName('nav')[0].offsetHeight;
    this.refs.menu.style.height = h+'px';

		this.refs.ul.style.height = this.refs.ul.offsetHeight + 'px';
		if (!this.state.open) {
			this.refs.menu.className = this.refs.menu.className + ' close hide';
		}

	},

	handleOpenClose() {

		this.setState({
			open: !this.state.open
		})

		this.refs.menu.className = (!this.state.open) ? this.refs.menu.className.replace(new RegExp('(?:^|\\s)'+ 'close' + '(?:\\s|$)'), ' ') : this.refs.menu.className + ' close';

		if (!this.state.open) {
			this.refs.menu.className = this.refs.menu.className.replace(new RegExp('(?:^|\\s)'+ 'hide' + '(?:\\s|$)'), ' ')
			document.body.style.overflow = 'hidden';			
		} else {
			var self = this;
			setTimeout(function() {
				self.refs.menu.className += ' hide';
				document.body.style.overflow = 'auto';
			}, 1000);
		}

		if (this.props.onMenuToggle) {
			this.props.onMenuToggle(!this.state.open);
		}

	},

	renderElement(key, value) {

		// TODO TRANSLATE
		var labels = {
			myProfile: 'My Profile',
			internetProfile: 'Internt Profile',
			apps: 'Apps',
			logout: 'Logout'
		}

		var element;
		switch(key) {
			case 'logout':
				element = <li key={key} onClick={() => window.location.href = '/#/'}>{labels[key]}</li> 
				break;
			default: 
				if (value) {
					element = <li key={key}>{labels[key]}</li>
				}
		}

		return element;

	},

	render() {

		var btnClass = "hamburger hamburger--slider ";
		if (this.state.open) {
			btnClass += 'is-active';
		}

		var sty = {
			div: {},
			button: {}
		}

		if (this.props.height) {
			var h = this.props.height
			sty.div.height = h;
			sty.div.top = '-'+h;
			sty.button.height = h;
			sty.button.lineHeight = h;
		}

		return (

			<div ref="menu" className="main-menu">
				<div className="button" style={sty.div} onClick={this.handleOpenClose}>
					<button ref="openClose" style={sty.button} className={btnClass}>
					  <span className="hamburger-box">
					    <span className="hamburger-inner"></span>
					  </span>
					</button>
				</div>

				<ul ref="ul">
					{mapObject(this.props.list, (k,v) => {
						return this.renderElement(k,v);
					})}
				</ul>
				<span className="overlay" onClick={this.handleOpenClose}></span>
			</div>
		)
	}

})

var LangMenu = React.createClass({

	getInitialState() {
		return {
			open: false
		}
	},

	componentDidMount() {
		
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        h = w.innerHeight|| e.clientHeight|| g.clientHeight,
        c = h - d.getElementsByTagName('nav')[0].offsetHeight;
    this.refs.menu.style.height = h+'px';

		this.refs.ul.style.height = this.refs.ul.offsetHeight + 'px';
		if (!this.state.open) {
			this.refs.menu.className = this.refs.menu.className + ' close hide';
		}

	},

	handleOpenClose(e) {

		this.setState({
			open: !this.state.open
		})

		e.target.blur();

		this.refs.menu.className = (!this.state.open) ? this.refs.menu.className.replace(new RegExp('(?:^|\\s)'+ 'close' + '(?:\\s|$)'), ' ') : this.refs.menu.className + ' close';

		if (!this.state.open) {
			this.refs.menu.className = this.refs.menu.className.replace(new RegExp('(?:^|\\s)'+ 'hide' + '(?:\\s|$)'), ' ')
			document.body.style.overflow = 'hidden';
		} else {
			var self = this;
			setTimeout(function() {
				self.refs.menu.className += ' hide';
				document.body.style.overflow = 'auto';
			}, 1000);

		}

		if (this.props.onMenuToggle) {
			this.props.onMenuToggle(!this.state.open);
		}

	},

	handleChangeLanguage(e) {
		if (this.props.handleChangeLanguage) {
			this.props.handleChangeLanguage(e.target.lang);
		}
	},

	render() {

		var self = this;
		var sty = {
			div: {},
			button: {}
		}

		if (this.props.height) {
			var h = this.props.height
			sty.div.height = h;
			sty.div.top = '-'+h;
			sty.button.height = h;
			sty.button.lineHeight = h;
		}

		return (

			<div ref="menu" className="lang-menu">
				<div className="button" style={sty.div} onClick={this.handleOpenClose}>
					<button ref="openClose" style={sty.button}>
						<i className="fa fa-globe"></i>
					  <span ref="selected">{this.props.current}</span>
					</button>
				</div>

				<ul ref="ul">
					{this.props.list.map((lang) => {
						return <li key={lang} lang={lang} onClick={self.handleChangeLanguage}>{lang}</li>
					})}
				</ul>
				<span className="overlay" onClick={this.handleOpenClose}></span>
			</div>
		)
	}

})

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