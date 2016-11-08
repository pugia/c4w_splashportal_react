var React = global.React;
var General = require('./components/General');
var TopNav = require('./components/TopNav');
var MainContent = require('./components/MainContent');
var BottomNav = require('./components/BottomNav');
var Accordion = require('./components/Accordion');

var moment = require('moment');

var checkValidEmail = function(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

var accordion1Check = function(self) {

	var email_field = self.refs.email_address;
	self.state.email = email_field.getValue();
  var r = checkValidEmail(email_field.getValue())

  self.refs.access_data.setState({
  	status: r ? 'success' : 'error'
  })

	loadingBarStatus(self);
	return r;

}

var accordion2Check = function(self) {
	var r = false;

	self.state.terms_privacy_flag = self.refs.terms_privacy_flag.getValue();
	self.state.marketing_flag = self.refs.marketing_flag.getValue();

	if (self.state.terms_privacy_flag) { r = true; }

  self.refs.terms_privacy_marketing.setState({
  	status: r ? 'success' : 'error'
  })

	loadingBarStatus(self);

	return r;

}

var loadingBarStatus = function(self) {

	var email_field = self.refs.email_address;
	self.state.email = email_field.getValue();
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	self.state.completed = (re.test(email_field.getValue())) ? 50 : 0;

	if (self.refs.terms_privacy_flag.getValue()) {
		self.state.completed += 50;
	}

	self.refs.loadingBar.handleCompleted(self.state.completed);

}

var accordionCheckBoth = function() {

	var r = true;
	if (!accordion1Check(this)) { r = false; }
	if (!accordion2Check(this)) { r = false; }

	if (r) {
		$('#main').data('stored_data', JSON.stringify(this.state));
		localStorage.setItem('stored_date', JSON.stringify(this.state));
		localStorage.setItem('login_time', moment().format());
		window.location.href = '/#/stage03';
	}

	return false;
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

  	if (localStorage.getItem('stored_data')) {
  		this.state = JSON.parse(localStorage.getItem('stored_data'));
  	} else {
			this.state = ($('#main').data('stored_data')) ? $.extend(true, this.state, JSON.parse($('#main').data('stored_data'))) : this.state;
		}

		this.refs.email_address.setValue(this.state.email);
		this.refs.terms_privacy_flag.setState({checked: this.state.terms_privacy_flag});
		this.refs.marketing_flag.setState({checked: this.state.marketing_flag});

		accordion1Check(this);
		// accordion2Check(this);

	},

  render() {

  	var self = this;

    return (
      <div id="real-container">

      	<TopNav.Bar fixed={true}>
      		<TopNav.Button side="left" onClick={ () => window.location.href = '/#/stage01' } >
      			<img src="/img/arrow-back.svg" />
      		</TopNav.Button>
      		<TopNav.Logo img="/img/fs@2x.png" />
      	</TopNav.Bar>
    		<TopNav.Loading ref="loadingBar" />

	      <MainContent>

	      	<Accordion.Main>
	      		<Accordion.Section ref="access_data" open={true} title="Access data">
      				
	      			<General.FieldInput
	      				ref="email_address"
	      				type="email" 
	      				label="Email address"
		          	input={{

									onBlur: function(e) {

										if (checkValidEmail(e.target.value)) {
											self.refs.email_address.setState({
												status: "success"
											})
										} else {
											self.refs.email_address.setState({
												status: "error"
											})					
										}

										accordion1Check(self);

									}
						
								}}
	      			/>

	      		</Accordion.Section>

	      		<Accordion.Section ref="terms_privacy_marketing" open={true} title="Terms and condition">
      				
	      			<General.CheckboxInput
	      				ref="terms_privacy_flag" 
	      				handleChange={accordion2Check.bind(this,this)}
	      				label={<span>Accept the <a href="#">Terms of service</a> and <a href="#">Privacy policy</a></span>}
	      			/>

	      			<General.CheckboxInput
	      				ref="marketing_flag"
	      				handleChange={accordion2Check.bind(this,this)}
	      				label={<span>Accept the <a href="#">Marketing policies</a> <span className="label label-black">optional</span></span>}
	      			/>

	      		</Accordion.Section>
	      	</Accordion.Main>

	      </MainContent>

	      <BottomNav.Bar>
	      	<BottomNav.Button background="0075aa" iconRight="fa-chevron-right" iconRightType="fa" text="NEXT" onClick={accordionCheckBoth.bind(this)} />
	      </BottomNav.Bar>


      </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Stage02;