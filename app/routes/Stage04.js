var React = global.React;
var General = require('./components/General');
var TopNav = require('./components/TopNav');
var MainContent = require('./components/MainContent');
var BottomNav = require('./components/BottomNav');
var moment = require('moment');

const minutes = 5;
var timer = null;

var goNext = function() {
	clearTimeout(timer);
	window.location.href = '/#/stage06';
}


var Stage03 = React.createClass({

	componentDidMount: function() {

		timer = setTimeout(function() {
			window.location.href = '/#/stage06';
		}, 3000);

	},

  render: function () {

    return (

      <div id="real-container">

      	<TopNav.Bar fixed>
      		<TopNav.Title align="center" text="Email confirmed" />
      	</TopNav.Bar>

	      <MainContent full>

          <div className="action-component">
            <div className="validation-icon">
              <i className="fa fa-check" aria-hidden="true"></i>
            </div>

            <div className="validation-detail">
              <p>Thanks for confirming your email<br /><strong ref="email_value"></strong></p>
            </div>

          </div>

          <div className="suggestion">
          	<p>You will be automatically redirect to our page in 3 seconds...<br />Enjoy our free Wi-Fi</p>
          </div>

	      </MainContent>

	      <BottomNav.Bar fixed={true}>
	      	<button className="mui-btn mui-btn--large main-button main-button-height mui-btn--double" onClick={goNext.bind(this)}>
	          <i className="fa fa-chevron-right mui--pull-right"></i>
	          <span><strong>I DON’T WANT TO WAIT FURTHER</strong><br />GO ONLINE</span>
	      	</button>
	      </BottomNav.Bar>

      </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Stage03;

/*
				<div className="bottombar">

	        <button className="mui-btn mui-btn--primary mui-btn--large mui-btn--68c6f0 mui-btn--double">
	          <i className="fa fa-chevron-right mui--pull-right"></i>
	          <span><strong>I DID NOT RECEIVE THE EMAIL</strong><br />SEND AGAIN</span>
	        </button>
	        <button onClick={goBack.bind(this)} className="mui-btn mui-btn--primary mui-btn--large mui-btn--50a1c6 mui-btn--double">
	          <i className="fa fa-chevron-right mui--pull-right"></i>
	          <span><strong>MY EMAIL ADDRESS IS WRONG</strong><br />CHANGE IT</span>
	        </button>
	        <button onClick={goNext.bind(this)} className="mui-btn mui-btn--primary mui-btn--large mui-btn--0075aa mui-btn--double">
	          <i className="fa fa-chevron-right mui--pull-right"></i>
	          <span><strong>I’M WAITING FOR THE EMAIL</strong><br />BROWSE AROUND</span>
	        </button>

				</div>
*/