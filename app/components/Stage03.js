var React = global.React;
var MainNav = React.createFactory(require('./MainNav'));
var Divider = React.createFactory(require('./Divider'));
var BottomBarButton = React.createFactory(require('./BottomBarButton'));
var moment = require('moment');

const minutes = 5;
var timer = null;

var goBack = function() {
	clearInterval(timer);
	window.location.href = '/#/stage02';
}

var goNext = function() {
	clearInterval(timer);
	sessionStorage.setItem('email', this.state.email);
	window.location.href = '/#/stage04';
}

var popolateLoadbar = function(self) {
	var start = moment(sessionStorage.getItem('login_time'));
 	var perc = 100 / minutes / 60;
 	var seconds = moment().diff(start, 'seconds');
 	var w = seconds * perc
 	self.refs.lbarBar.style.width = w + '%';

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
  	if (sessionStorage.getItem('stored_data')) {
  		loaded_st = JSON.parse(sessionStorage.getItem('stored_data'));
  	} else {
			loaded_st = ($('#main').data('stored_data')) ? $.extend(true, st, JSON.parse($('#main').data('stored_data'))) : st;
		}

		return (loaded_st) ? $.extend(true, st, loaded_st) : st;

	},

	componentDidMount: function() {

		var self = this;
		timer = setInterval(function() {
			if (!popolateLoadbar(self)) {
				clearInterval(timer);
			}
		}, 1000);

	},

  render: function () {

		var style = {
			contentBackground: {
				background: 'url(/img/cloud@2x.png) repeat-x top left / 391px 97px',
				paddingTop: '100px'
			}
		}

    return (
      <div id="real-container">

	      <nav className="main-nav">
	        <div className="topbar mui--appbar-height">
	          <h2 className="mui--appbar-height mui--appbar-line-height mui--text-center">Wifi account</h2>
	        </div>
					<div className="loading-bar with-appbar-top">
						<span className="bar" ref="lbarBar"></span>
					</div>
	      </nav>

	      <div className="main-content" id="main-content">
	        <div className="content-background" style={style.contentBackground}>


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


	        </div>
	      </div>

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

      </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Stage03;
