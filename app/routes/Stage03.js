var React = global.React;
var General = require('./components/General');
var TopNav = require('./components/TopNav');
var MainContent = require('./components/MainContent');
var BottomNav = require('./components/BottomNav');
var moment = require('moment');

const minutes = 5;
var timer = null;

var goBack = function() {
	clearInterval(timer);
	window.location.href = '/#/stage02';
}

var goNext = function() {
	clearInterval(timer);
	localStorage.setItem('email', this.state.email);
	window.location.href = '/#/stage04';
}

var popolateLoadbar = function(self) {
	var start = moment(localStorage.getItem('login_time'));
 	var perc = 100 / minutes / 60;
 	var seconds = moment().diff(start, 'seconds');
 	var w = seconds * perc;
 	self.refs.loadingBar.handleCompleted(w);
 	return (w < 100);

}

var Stage03 = React.createClass({

	getInitialState() {

		var st = {
			completed: 0,
			email: null,
			terms_privacy_flag: false,
			marketing_flag: false,
			confirmed: false
		}

		var loaded_st = false;
  	if (localStorage.getItem('stored_data')) {
  		loaded_st = JSON.parse(localStorage.getItem('stored_data'));
  	} else {
			loaded_st = ($('#main').data('stored_data')) ? $.extend(true, st, JSON.parse($('#main').data('stored_data'))) : st;
		}

		return (loaded_st) ? $.extend(true, st, loaded_st) : st;

	},

	componentDidMount: function() {

		document.getElementById('main').scrollTop = 0;

		var self = this;
		timer = setInterval(function() {
			if (!popolateLoadbar(self)) {
				clearInterval(timer);
			}
		}, 1000);

	},

  render: function () {

    return (

      <div id="real-container">

      	<TopNav.Bar fixed={true}>
      		<TopNav.Button side="left" onClick={ () => window.location.href = '/#/stage02' } >
      			<img src="/img/arrow-back.svg" />
      		</TopNav.Button>
      		<TopNav.Title align="center" text="Registration" />
      	</TopNav.Bar>
    		<TopNav.Loading ref="loadingBar" />

	      <MainContent full>

          <div className="action-component">
            <div className="validation-icon">
              <i className="fa fa-envelope-o" aria-hidden="true"></i>
            </div>

            <div className="validation-detail">
              <p>We have sent an email to<br /><strong ref="email_value">{this.state.email}</strong></p>
            </div>

          </div>

          <div className="suggestion">
            <p>Confirm your account<br />otherwise you will be disconnected in {minutes} minutes</p>
          </div>

	      </MainContent>

	      <BottomNav.Bar fixed={true}>
	      	<button className="mui-btn mui-btn--danger mui-btn--large main-button-height mui-btn--double">
	          <i className="fa fa-chevron-right mui--pull-right"></i>
	          <span><strong>I DID NOT RECEIVE THE EMAIL</strong><br />SEND AGAIN</span>
	      	</button>
	      	<button className="mui-btn mui-btn--large main-button main-button-height mui-btn--double">
	          <i className="fa fa-chevron-right mui--pull-right"></i>
	          <span><strong>I’M WAITING FOR THE EMAIL</strong><br />BROWSE AROUND</span>
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