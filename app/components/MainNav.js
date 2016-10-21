var React = global.React;
var LoadingBar = require('./LoadingBar')

var MainNav = React.createClass({

  render: function () {

		// loading bar
		var loadingBarEvent;
		if (this.props.loadingBar) {
			loadingBarEvent = <LoadingBar ref="loadingBar"></LoadingBar>;
		}

  	// title
		var title = this.props.title || 'Welcome';

		// left button
		var leftButtonIconType = this.props.leftButtonIconType;
		var leftButtonIcon = this.props.leftButtonIcon;

		var leftButton;
		if (leftButtonIconType == 'fa') {
			var iconClass = 'fa '+leftButtonIcon;
			leftButton = <button className="appbar-action mui--appbar-height mui--appbar-line-height mui--pull-left">
				<i className={iconClass}></i>
			</button>;	
		}

		if (leftButtonIconType == 'img') {
			leftButton = <button className="appbar-action mui--appbar-height mui--appbar-line-height mui--pull-left">
				<img src={leftButtonIcon}/>
			</button>;
		}

    return (
	    <nav className="main-nav">
	    	<div className="topbar mui--appbar-height">
					{leftButton}
					<h2 className="mui--appbar-height mui--appbar-line-height">{title}</h2>
				</div>

				{loadingBarEvent}

	    </nav>
	  )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = MainNav;
