var React = global.React;

var BottomBarButton = React.createClass({

  render: function () {

    var iconRight = null,
        iconLeft  = null,
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
        <span>{this.props.text}</span>
      </button>
	  )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = BottomBarButton;
