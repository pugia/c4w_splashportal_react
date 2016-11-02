'use strict';
exports.__esModule = true;

var React = global.React;

var BottomNav = React.createClass({

	render() {
		return (
			<div className="bottombar">
				{this.props.children}
			</div>
		)
	}

});


var BottomNavButton = React.createClass({

  render: function () {

    var iconRight = null,
        className = "mui-btn mui-btn-primary mui-btn--"+ this.props.background +" mui-btn--large"
    
    if (this.props.double) {
      className += ' mui-btn--double';
    }

    if (this.props.iconRight) {
      iconRight = (this.props.iconRightType && this.props.iconRightType == 'fa') ? <i className={'fa ' + this.props.iconRight +' mui--pull-right'}></i> : <img src={this.props.iconRight} />
    }

    return (
      <button className={className} onClick={this.props.onClick.bind(this)}>
        {iconRight}
        <span>{this.props.text || this.props.children}</span>
      </button>
	  )
  }

});

exports.Bar = BottomNav;
exports.Button = BottomNavButton;

module.exports = {
  Bar: BottomNav,
  Button: BottomNavButton,
};