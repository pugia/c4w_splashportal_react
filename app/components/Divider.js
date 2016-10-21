var React = global.React;

var Divider = React.createClass({

  render: function () {

  	var cls = (this.props.text) ? 'divider with-text' : 'divider';

    return (
				<div className={cls}>{this.props.text}</div>
	  )
  }
  
});

module.exports = Divider;


