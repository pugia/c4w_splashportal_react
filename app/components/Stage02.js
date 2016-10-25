var React = global.React;
var MainNav = React.createFactory(require('./MainNav'));
var Divider = React.createFactory(require('./Divider'));
var BottomBarButton = React.createFactory(require('./BottomBarButton'));

var moment = require('moment');

var nextStage = function() {
	console.log('next');
}

var inputClassChange = function(field) {

	var field = $('input[name="'+field+'"]');
	field.parent('.mui-textfield').toggleClass('mui--is-not-empty', field.val() != '');
	field.parent('.mui-textfield').toggleClass('mui--is-empty', field.val() == '');

}

var checkBoxStatus = function(field) {
	this.state[field] = this.refs[field].checked
	accordion2Check(this, false);
}

var accordion1Check = function(self, first = true) {

	var email_field = self.refs.email_field_acc;
	self.state.email = email_field.value;
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	$('#access_data_section > label')
		.toggleClass('error', !re.test(email_field.value))
		.toggleClass('success', re.test(email_field.value))

	if (first) { self.refs.accordion1_a1.checked = !re.test(email_field.value); }

	inputClassChange('email_field_acc');

	loadingBarStatus(self);

	return re.test(email_field.value)

}

var accordion2Check = function(self, force = false) {
	var r = false;

	if (self.state.terms_privacy_flag) { r = true; }

	$('#terms_condition_section > label')
		.toggleClass('error', !r)
		.toggleClass('success', r);

	self.refs.terms_privacy_flag.parentNode.classList.toggle('error', (force && !self.state.terms_privacy_flag));
	if (force && !self.state.terms_privacy_flag) {
		self.refs.accordion1_a2.checked = true;
	}

	loadingBarStatus(self);

	return r;

}

var accordionCheckBoth = function() {

	var r = true;
	if (!accordion1Check(this,false)) { r = false; }
	if (!accordion2Check(this,true)) { r = false; }

	if (r) {
		$('#main').data('stored_data', JSON.stringify(this.state));
		localStorage.setItem('stored_date', JSON.stringify(this.state));
		localStorage.setItem('login_time', moment().format());
		window.location.href = '/#/stage03';
	}

	return false;
}

var loadingBarStatus = function(self) {

	var email_field = self.refs.email_field_acc;
	self.state.email = email_field.value;
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	self.state.completed = (re.test(email_field.value)) ? 50 : 0;

	if (self.refs.terms_privacy_flag.checked) {
		self.state.completed += 50;
	}

	self.refs.lbarBar.style.width = self.state.completed + '%';

}

var Stage02 = React.createClass({

	getInitialState() {
		return {
			completed: 0,
			email: null,
			terms_privacy_flag: false,
			marketing_flag: false
		}

	},

	componentDidMount: function() {

		localStorage.removeItem('login_time');

    let m = document.getElementById("main");
    let c = document.getElementById("real-container").childNodes;
    var h = m.offsetHeight;
    for (var x in c) { h -= (c[x].nodeType == '1' && c[x].id != 'main-content') ? c[x].offsetHeight : 0; }
    document.getElementById("main-content").style.height = h+'px';

  	if (localStorage.getItem('stored_date')) {
  		this.state = JSON.parse(localStorage.getItem('stored_date'));
  	} else {
			this.state = ($('#main').data('stored_data')) ? $.extend(true, this.state, JSON.parse($('#main').data('stored_data'))) : this.state;
		}

		this.refs.email_field_acc.value = this.state.email;
		this.refs.terms_privacy_flag.checked = this.state.terms_privacy_flag;
		this.refs.marketing_flag.checked = this.state.marketing_flag;

		this.refs.accordion1_a2.checked = true;

		accordion1Check(this, true);
		loadingBarStatus(this);

		// this.checkAccordionStatus();

	},

  render: function () {

		var style = {
			contentBackground: {
				background: 'url(/img/cloud@2x.png) repeat-x top left / 391px 97px',
				paddingTop: '100px'
			},
			mTop: {
				marginTop: '12px'
			},
			iconAccess: {
				backgroundImage: 'url(/img/access@2x.png)'
			},
			iconTerms: {
				backgroundImage: 'url(/img/terms@2x.png)'
			}
		}

    return (
      <div id="real-container">

	      <nav className="main-nav">
	        <div className="topbar mui--appbar-height">
	          <a href="/#/stage01" className="appbar-action mui--appbar-height mui--appbar-line-height mui--pull-left">
	            <img src="/img/arrow-back.svg" />
	          </a>
	          <h2 className="mui--appbar-height mui--appbar-line-height mui--text-center">Wifi account</h2>
	        </div>
					<div className="loading-bar with-appbar-top">
						<span className="bar" ref="lbarBar"></span>
					</div>
	      </nav>

	      <div className="main-content" id="main-content">
	        <div className="content-background">

	          <div className="accordion">

	            <div className="section" id="access_data_section">
	              <input type="checkbox" id="accordion1_a1" ref="accordion1_a1" />
	              <label className="accordion-title" htmlFor="accordion1_a1">
	                <span className="icon-left" style={style.iconAccess}></span>
	                <span className="icon-open-close"><i className="fa fa-chevron-down" aria-hidden="true"></i></span>
	                <span className="title">Access data</span>
	              </label>
	              <div className="accordion-content">
	              
	                <form style={style.mTop}>
	                  <div className="mui-textfield mui-textfield--float-label">
	                    <input type="text" name="email_field_acc" ref="email_field_acc" onBlur={accordion1Check.bind(this, this, false)} />
	                    <label>Email address</label>
	                    <span>We will use it to send you the confirmation email</span>
	                  </div>
	                </form>

	              </div>
	            </div>

	            <div className="section" id="terms_condition_section">
	              <input type="checkbox" id="accordion1_a2" ref="accordion1_a2" />
	              <label className="accordion-title" htmlFor="accordion1_a2">
	                <span className="icon-left" style={style.iconTerms}></span>
	                <span className="icon-open-close"><i className="fa fa-chevron-down" aria-hidden="true"></i></span>
	                <span className="title">Terms and condition</span>
	              </label>
	              <div className="accordion-content">
	              
	                <form onSubmit={accordionCheckBoth.bind(this)}>
	                  <div className="mui-checkbox">
	                    <input id="checkbox_1" ref="terms_privacy_flag" type="checkbox" value="1" onChange={checkBoxStatus.bind(this,'terms_privacy_flag')} />
	                    <label htmlFor="checkbox_1">

	                      <svg width="18px" height="18px" viewBox="0 0 18 18">
	                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
	                          <rect className="rect" stroke="#0075AA" x="1" y="1" width="16" height="16" rx="3"></rect>
	                          <path className="check" fill="#0075AA" d="M13.2174912,5.16790677 C13.0797465,5.02576416 12.912278,4.95473958 12.7154482,4.95473958 C12.5185277,4.95473958 12.3510593,5.02576416 12.2133146,5.16790677 L7.36995945,10.17028 L5.19930334,7.92412768 C5.06146808,7.78198507 4.89409023,7.71096049 4.69726039,7.71096049 C4.50033993,7.71096049 4.33296207,7.78198507 4.19512682,7.92412768 L3.19104091,8.95959127 C3.05320565,9.10173388 2.98433333,9.2743423 2.98433333,9.47741652 C2.98433333,9.68039729 3.05320565,9.85309916 3.19104091,9.99514831 L5.86373997,12.7513692 L6.8679165,13.7868328 C7.00566114,13.9289754 7.17303899,14 7.36995945,14 C7.56678929,14 7.73416715,13.928882 7.8720024,13.7868328 L8.87617893,12.7513692 L14.2215771,7.23892741 C14.3593217,7.0967848 14.4282846,6.92417638 14.4282846,6.72110216 C14.4283753,6.51812139 14.3593217,6.34551297 14.2215771,6.20337036 L13.2174912,5.16790677 Z"></path>
	                        </g>
	                      </svg>

	                      <span>Accept the <a href="#">Terms of service</a> and <a href="#">Privacy policy</a></span>
	                    </label>
	                    <span>You must accept these terms</span>
	                  </div>

	                  <div className="mui-checkbox">
	                    <input id="checkbox_2" ref="marketing_flag" type="checkbox" value="1" />
	                    <label htmlFor="checkbox_2">

	                      <svg width="18px" height="18px" viewBox="0 0 18 18">
	                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
	                          <rect className="rect" stroke="#0075AA" x="1" y="1" width="16" height="16" rx="3"></rect>
	                          <path className="check" fill="#0075AA" d="M13.2174912,5.16790677 C13.0797465,5.02576416 12.912278,4.95473958 12.7154482,4.95473958 C12.5185277,4.95473958 12.3510593,5.02576416 12.2133146,5.16790677 L7.36995945,10.17028 L5.19930334,7.92412768 C5.06146808,7.78198507 4.89409023,7.71096049 4.69726039,7.71096049 C4.50033993,7.71096049 4.33296207,7.78198507 4.19512682,7.92412768 L3.19104091,8.95959127 C3.05320565,9.10173388 2.98433333,9.2743423 2.98433333,9.47741652 C2.98433333,9.68039729 3.05320565,9.85309916 3.19104091,9.99514831 L5.86373997,12.7513692 L6.8679165,13.7868328 C7.00566114,13.9289754 7.17303899,14 7.36995945,14 C7.56678929,14 7.73416715,13.928882 7.8720024,13.7868328 L8.87617893,12.7513692 L14.2215771,7.23892741 C14.3593217,7.0967848 14.4282846,6.92417638 14.4282846,6.72110216 C14.4283753,6.51812139 14.3593217,6.34551297 14.2215771,6.20337036 L13.2174912,5.16790677 Z"></path>
	                        </g>
	                      </svg>

	                      <span>Accept the <a href="#">Marketing policies</a> <span className="label label-black">optional</span></span>
	                    </label>
	                  </div>

	                </form>         

	              </div>
	            </div>

	          </div>

	        </div>
	      </div>

				<div className="bottombar">

	        <BottomBarButton background="0075aa" iconRight="fa-chevron-right" iconRightType="fa" text="NEXT" onClick={accordionCheckBoth.bind(this)}></BottomBarButton>

				</div>

      </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Stage02;