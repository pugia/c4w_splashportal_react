var React = global.React;
var General = require('./components/General');
var TopNav = require('./components/TopNav');
var MainContent = require('./components/MainContent');
var BottomNav = require('./components/BottomNav');
var Accordion = require('./components/Accordion');

var moment = require('moment');
var config = require('../config');

var checkValidEmail = function(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

var accordion1Check = function(self) {

	var r = true;
	config.Login.account.access.map((c,i) => {
		var ref = c.type+'_'+i;
		if (c.validation) {
			if (!self.refs[ref].isValid()) { r = false; }
		}
		var fields = self.state.fields;
		fields[ref] = self.refs[ref].getValue()
		self.setState({
			fields: fields
		})
	})

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

var accordion3Check = function(self) {

	var r = true;
	config.Login.account.custom.map((c,i) => {
		var ref = c.type+'_'+i;
		if (c.validation) {
			if (!self.refs[ref].isValid()) { r = false; }
		}
		var fields = self.state.fields;
		fields[ref] = self.refs[ref].getValue()
		self.setState({
			fields: fields
		})
	})

  self.refs.personal_data.setState({
  	status: r ? 'success' : 'error'
  })

	loadingBarStatus(self);
	return r;

}

var loadingBarStatus = function(self) {

	var toCheck = 1;
	var completed = 0
	config.Login.account.access.map( (c,i) => { if (c.validation) { toCheck++ }	})
	config.Login.account.custom.map( (c,i) => { if (c.validation) { toCheck++ }	})

	var step = 100 / toCheck;

	config.Login.account.access.map( (c,i) => { 
		var ref = c.type+'_'+i;
		if (self.refs[ref].isValid()) { completed += step }
	})

	config.Login.account.custom.map( (d,j) => { 
		var ref = d.type+'_'+j;
		if (self.refs[ref].isValid()) { completed += step }
	})

	if (self.refs.terms_privacy_flag.getValue()) { completed += step; }

	self.refs.loadingBar.handleCompleted(completed);
	self.setState({ completed: completed })

}

var accordionCheckBoth = function() {

	var r = true;
	if (!accordion1Check(this)) { r = false; }
	if (!accordion2Check(this)) { r = false; }
	if (!accordion3Check(this)) { r = false; }

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
			fields: {},
			terms_privacy_flag: false,
			marketing_flag: false
		}

	},

	componentDidMount: function() {
		document.getElementById('main').scrollTop = 0;
		localStorage.removeItem('login_time');

  	if (localStorage.getItem('stored_data')) {
  		this.state = JSON.parse(localStorage.getItem('stored_data'));
  	} else {
			this.state = ($('#main').data('stored_data')) ? $.extend(true, this.state, JSON.parse($('#main').data('stored_data'))) : this.state;
		}

	},

	checkField(ref,accordion) {
		if (!this.refs[ref].isValid()) {
			this.refs[ref].setState({
				'status': 'error'
			})
		} else {
			this.refs[ref].setState({
				'status': 'success'
			})			
		}
		if (accordion == 1) { accordion1Check(this); }
		if (accordion == 3) { accordion3Check(this); }
	},	

  render() {

  	var self = this;

		// generate fields
		var generateField = function(conf, index, accordion) {
			var r = null,
					ref = conf.type+'_'+index;

			switch (conf.type) {
			// start switch
				// email
				case 'email':
					r = <General.FieldInput
						key={ref} 
	      		label={conf.label || ''}
	      		validation={conf.validation}
						ref={ref}
	      		handleChange={self.checkField.bind(self,ref,accordion)}
	      		/>
					break;

				// password
				case 'password':
					r = <General.FieldPassword
						key={ref} 
	      		label={conf.label || ''}
	      		validation={conf.validation}
						ref={ref}
	      		handleChange={self.checkField.bind(self,ref,accordion)}
	      		/>
					break;

				case 'select':
					r = <General.FieldSelect
						key={ref} 
	      		label={conf.label || ''}
	      		validation={conf.validation}
						ref={ref}
	      		handleChange={self.checkField.bind(self,ref,accordion)}
	      		options={conf.options}
	      		/>
					break;

				default: 
					r = <General.FieldInput 
						key={'text'+'_'+index} 
	      		label={conf.label || ''}
	      		validation={conf.validation}
						ref={ref}
	      		handleChange={self.checkField.bind(self,ref,accordion)}
						/>
			
			// end switch
			}

			return r;

		}


    return (
      <div id="real-container">

      	<TopNav.Bar fixed={true}>
      		<TopNav.Button side="left" onClick={ () => window.location.href = '/#/stage01' } >
      			<img src="/img/arrow-back.svg" />
      		</TopNav.Button>
      		<TopNav.Title align="center" text="Registration" />
      	</TopNav.Bar>
    		<TopNav.Loading ref="loadingBar" />

	      <MainContent contentBackgroundStyle={{ paddingBottom: '60px' }}>

	      	<Accordion.Main>
	      		<Accordion.Section ref="access_data" open={true} title="Access data" iconLeft="fa fa-unlock-alt">
			      	
	      			{config.Login.account.access.map( (c,i) => generateField(c,i,1) )}

	      		</Accordion.Section>

	      		<Accordion.Section ref="personal_data" open={true} title="Personal Data" iconLeft="fa fa-user-o">

	      			{config.Login.account.custom.map( (c,i) => generateField(c,i,3) )}

	      		</Accordion.Section>

	      		<Accordion.Section ref="terms_privacy_marketing" open={true} title="Terms and condition" iconLeft="fa fa-globe">
      				
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

	      <BottomNav.Bar fixed={true}>
	      	<button className="main-button main-button-height" onClick={accordionCheckBoth.bind(this)}>NEXT</button>
	      </BottomNav.Bar>


      </div>
    )
  }

});
// 	      	<BottomNav.Button background="0075aa" iconRight="fa-chevron-right" iconRightType="fa" text="NEXT" />

/* Module.exports instead of normal dom mounting */
module.exports = Stage02;