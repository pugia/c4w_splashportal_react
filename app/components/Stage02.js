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

	self.state.completed = (re.test(email_field.value)) ? 100 : 0;
	if (first) { self.refs.accordion1_a1.checked = !re.test(email_field.value); }
	self.refs.lbarBar.style.width = self.state.completed + '%';

	inputClassChange('email_field_acc');

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

	return r;

}

var accordionCheckBoth = function() {

	var r = true;

	if (!accordion1Check(this,false)) { r = false; }
	if (!accordion2Check(this,true)) { r = false; }

	if (r) {
		$('#main').data('stored_data', JSON.stringify(this.state));
		localStorage.setItem('login_time', moment().format());
		window.location.href = '/#/stage03';
	}
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

		this.state = ($('#main').data('stored_data')) ? $.extend(true, this.state, JSON.parse($('#main').data('stored_data'))) : this.state;

		this.refs.email_field_acc.value = this.state.email;
		this.refs.terms_privacy_flag.checked = this.state.terms_privacy_flag;
		this.refs.marketing_flag.checked = this.state.marketing_flag;

		this.refs.accordion1_a2.checked = true;

		accordion1Check(this, true);

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
			}
		}

    return (
      <div id="real-container">

	      <nav className="main-nav">
	        <div className="topbar mui--appbar-height">
	          <a href="/#/stage01" className="appbar-action mui--appbar-height mui--appbar-line-height mui--pull-left">
	            <i className="fa fa-arrow-left"></i>
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
	                <span className="icon-left"><i className="fa fa-unlock-alt" aria-hidden="true"></i></span>
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
	                <span className="icon-left">
	                  <svg width="12px" height="12px" viewBox="0 0 16 16">
	                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
	                      <g transform="translate(-21.000000, -176.000000)" fill="#4D8185">
	                        <g transform="translate(0.000000, 165.000000)">
	                          <path d="M36.2727273,13.1818182 L36.2727273,12.8181818 C36.2727273,11.8145455 35.4581818,11 34.4545455,11 C33.4509091,11 32.6363636,11.8145455 32.6363636,12.8181818 L32.6363636,13.1818182 C32.2363636,13.1818182 31.9090909,13.5090909 31.9090909,13.9090909 L31.9090909,16.8181818 C31.9090909,17.2181818 32.2363636,17.5454545 32.6363636,17.5454545 L36.2727273,17.5454545 C36.6727273,17.5454545 37,17.2181818 37,16.8181818 L37,13.9090909 C37,13.5090909 36.6727273,13.1818182 36.2727273,13.1818182 L36.2727273,13.1818182 Z M35.6909091,13.1818182 L33.2181818,13.1818182 L33.2181818,12.8181818 C33.2181818,12.1345455 33.7709091,11.5818182 34.4545455,11.5818182 C35.1381818,11.5818182 35.6909091,12.1345455 35.6909091,12.8181818 L35.6909091,13.1818182 L35.6909091,13.1818182 Z M34.0327273,19 C34.0618182,19.24 34.0909091,19.48 34.0909091,19.7272727 C34.0909091,21.24 33.5090909,22.6145455 32.5636364,23.6472727 C32.3745455,23.0581818 31.8363636,22.6363636 31.1818182,22.6363636 L30.4545455,22.6363636 L30.4545455,20.4545455 C30.4545455,20.0545455 30.1272727,19.7272727 29.7272727,19.7272727 L25.3636364,19.7272727 L25.3636364,18.2727273 L26.8181818,18.2727273 C27.2181818,18.2727273 27.5454545,17.9454545 27.5454545,17.5454545 L27.5454545,16.0909091 L29,16.0909091 C29.8,16.0909091 30.4545455,15.4363636 30.4545455,14.6363636 L30.4545455,12.7890909 C29.7636364,12.5709091 29.0363636,12.4545455 28.2727273,12.4545455 C24.2581818,12.4545455 21,15.7127273 21,19.7272727 C21,23.7418182 24.2581818,27 28.2727273,27 C32.2872727,27 35.5454545,23.7418182 35.5454545,19.7272727 C35.5454545,19.48 35.5309091,19.24 35.5090909,19 L34.0327273,19 L34.0327273,19 Z M27.5454545,25.4945455 C24.6727273,25.1381818 22.4545455,22.6945455 22.4545455,19.7272727 C22.4545455,19.2763636 22.5127273,18.8472727 22.6072727,18.4254545 L26.0909091,21.9090909 L26.0909091,22.6363636 C26.0909091,23.4363636 26.7454545,24.0909091 27.5454545,24.0909091 L27.5454545,25.4945455 L27.5454545,25.4945455 Z" id="Shape"></path>
	                        </g>
	                      </g>
	                    </g>
	                  </svg>                
	                </span>
	                <span className="icon-open-close"><i className="fa fa-chevron-down" aria-hidden="true"></i></span>
	                <span className="title">Terms and condition</span>
	              </label>
	              <div className="accordion-content">
	              
	                <form>
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