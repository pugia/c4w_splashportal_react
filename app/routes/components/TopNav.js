'use strict';
exports.__esModule = true;

var React = global.React;

var TopNav = React.createClass({

	render() {

		var main = (this.props.mainMenu) ? <MainMenu /> : null;
		var lang = (this.props.langMenu) ? <LangMenu /> : null;
		var className = (this.props.fixed) ? 'fixed' : '';

		return (
			<nav className={className}>
				<div className="topbar">
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
		return (
			<h2 className="mui--text-center">{this.props.children || this.props.text}</h2>
		)
	}

});

var TopNavLogo = React.createClass({

	render() {

		var className = 'logo';
		if (this.props.align) {
			className += ' '+this.props.align;
		}

		return (
			<img className={className} src={this.props.img} />
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

	},

	render() {

		var btnClass = "hamburger hamburger--slider ";
		if (this.state.open) {
			btnClass += 'is-active';
		}

		return (

			<div ref="menu" className="main-menu">
				<div className="button" onClick={this.handleOpenClose}>
					<button ref="openClose" className={btnClass}>
					  <span className="hamburger-box">
					    <span className="hamburger-inner"></span>
					  </span>
					</button>
				</div>

				<ul ref="ul">
					<li>My Profile</li>
					<li>Internet Plans</li>
					<li>Logout</li>
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

	},

	render() {

		return (

			<div ref="menu" className="lang-menu">
				<div className="button" onClick={this.handleOpenClose}>
					<button ref="openClose">
						<i className="fa fa-globe"></i>
					  <span ref="selected">ENG</span>
					</button>
				</div>

				<ul ref="ul">
					<li>ENG</li>
					<li>ITA</li>
				</ul>
				<span className="overlay" onClick={this.handleOpenClose}></span>
			</div>
		)
	}

})

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