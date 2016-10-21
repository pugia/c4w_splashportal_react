var React = global.React;
var BottomBarButton = require('./BottomBarButton');

var BottomBar = React.createClass({

  testClick: function(index) {
    console.log('pippo');
  },

  render: function () {

    return (
			<div className="bottombar">

        <BottomBarButton background="68c6f0" iconRight="fa-chevron-right" iconRightType="fa" double="true" onClick={this.testClick}>
          <span><strong>I DID NOT RECEIVE THE EMAIL</strong><br />SEND AGAIN</span>
        </BottomBarButton>
        <BottomBarButton background="50a1c6" iconRight="fa-chevron-right" iconRightType="fa" double="true" onClick={this.testClick}>
          <span><strong>MY EMAIL ADDRESS IS WRONG</strong><br />CHANGE IT</span>
        </BottomBarButton>
        <BottomBarButton background="0075aa" iconRight="fa-chevron-right" iconRightType="fa" double="true" onClick={this.testClick}>
          <span><strong>I’M WAITING FOR THE EMAIL</strong><br />BROWSE AROUND</span>
        </BottomBarButton>

			</div>
	  )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = BottomBar;
