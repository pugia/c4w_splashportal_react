'use strict';
exports.__esModule = true;

var React = global.React;

var TopNav = React.createClass({

	render() {
		return (
			<nav>
				<div className="topbar mui--appbar-height">
					{this.props.children}
				</div>
			</nav>
		)
	}

});

var TopNavTitle = React.createClass({

	render() {
		return (
			<h2 className="mui--appbar-height mui--appbar-line-height mui--text-center">{this.props.children || this.props.text}</h2>
		)
	}

});

var TopNavButton = React.createClass({

	render() {

		var pr = {
			style: {

			}
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


exports.Bar = TopNav;
exports.Title = TopNavTitle;
exports.Button = TopNavButton;
exports.Loading = LoadingBar;

module.exports = {
	Bar: TopNav,
	Title: TopNavTitle,
	Button: TopNavButton,
	Loading: LoadingBar
};