var React = global.React;

var ActionBlock = React.createClass({

  render: function () {

		var message = this.props.message;
    if (message === NaN || typeof message == 'undefined') { message = <p>We have sent an email to<br /><strong>ciccio.benzina@camionista.it</strong></p>; };

    return (
      <div className="action-component">
        <div className="validation-icon">
          <i className="fa fa-envelope-o" aria-hidden="true"></i>
        </div>

        <div className="validation-detail">
          {message}
        </div>

      </div>
	  )
  }
  
});

/* Module.exports instead of normal dom mounting */
module.exports = ActionBlock;