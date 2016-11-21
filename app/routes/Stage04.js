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
	window.location.href = '/stage/#/success';
}


var Stage03 = React.createClass({

	getInitialState() {

		var st = {
			completed: 0,
			fields: {},
			terms_privacy_flag: false,
			marketing_flag: false
		}

  	if (localStorage.getItem('stored_data')) {
  		st = JSON.parse(localStorage.getItem('stored_data'));
  	} else {
			st = ($('#main').data('stored_data')) ? $.extend(true, st, JSON.parse($('#main').data('stored_data'))) : st;
		}

		return st;

	},

	componentDidMount: function() {

		var self = this;
		// timer = setTimeout(function() {
		// 	window.location.href = '/stage/#/success';
		// }, 3000);

		setTimeout(function() { self.centerVertically('verticalCentered')	}, 200);
		

	},

	centerVertically(ref) {

		var el = this.refs[ref];
		var hCont = parseInt(ReactDOM.findDOMNode(el).parentNode.style.minHeight || ReactDOM.findDOMNode(el).parentNode.clientHeight);
		var h = ReactDOM.findDOMNode(el).clientHeight;

		if (h < hCont) {
			var mTop = parseInt((hCont - h) / 2);
			el.style.marginTop = mTop + 'px';
		}

	},


  render: function () {

  	var access_field_ref = 'access_email_0';  	

    return (

      <div id="real-container">

      	<TopNav.Bar fixed>
      		<TopNav.Title align="center" text="Email confirmed" />
      	</TopNav.Bar>

	      <MainContent full>

	      	<div className="verticalCentered" ref="verticalCentered">

	          <div className="action-component">
	            <div className="validation-icon">
	              <i className="fa fa-check" aria-hidden="true"></i>
	            </div>

	            <div className="validation-detail">
	              <p>Thanks for confirming your email<br /><strong ref="email_value">{this.state.fields[access_field_ref]}</strong></p>
	            </div>

	          </div>

          </div>

	      </MainContent>

	      <BottomNav.Bar fixed={true}>
	      	<button className="mui-btn mui-btn--large main-button main-button-height" onClick={goNext.bind(this)}>
	          <span><strong>GO ONLINE</strong></span>
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