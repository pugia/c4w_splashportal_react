var React = global.React;
var General = require('./components/General');
var TopNav = require('./components/TopNav');
var MainContent = require('./components/MainContent');
var BottomNav = require('./components/BottomNav');
var Accordion = require('./components/Accordion');

var moment = require('moment');
var config = require('../config');

var accordion1Check = function(self, focus = false) {

	var toFocus = null;
	var r = true;
	config.Login.account.access.map((c,i) => {
		var ref = 'access_'+c.type+'_'+i;
		if (c.validation) {
			if (!self.refs[ref].isValid()) { 
				r = false; 
				if (!toFocus) { toFocus = ref; }
			}
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

  if (!r && focus) { self.refs[toFocus].focus() }

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

var accordion3Check = function(self, focus = false) {

	var toFocus = null;
	var r = true;
	config.Login.account.custom.map((c,i) => {
		var ref = 'custom_'+c.type+'_'+i;
		if (c.validation) {
			if (!self.refs[ref].isValid()) { 
				r = false; 
				if (!toFocus) { toFocus = ref; }
			}
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

  if (!r && focus) { self.refs[toFocus].focus() }

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
		var ref = 'access_'+c.type+'_'+i;
		if (c.validation && self.refs[ref].isValid()) { completed += step }
	})

	config.Login.account.custom.map( (d,j) => { 
		var ref = 'custom_'+d.type+'_'+j;
		if (d.validation && self.refs[ref].isValid()) { completed += step }
	})

	if (self.refs.terms_privacy_flag.getValue()) { completed += step; }

	self.refs.loadingBar.handleCompleted(completed);
	self.setState({ completed: completed })

}

var accordionCheckBoth = function() {

	var r = true;
	if (r && !accordion1Check(this)) { r = false; }
	if (r && !accordion3Check(this)) { r = false; }
	if (r && !accordion2Check(this)) { r = false; }

	if (r) {
		$('#main').data('stored_data', JSON.stringify(this.state));
		localStorage.setItem('stored_data', JSON.stringify(this.state));
		localStorage.setItem('login_time', moment().format());
		window.location.href = '/stage/#/03';
	}

	return false;
}


var Stage02 = React.createClass({

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
		localStorage.removeItem('login_time');
		loadingBarStatus(this);
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
		if (accordion == 'access') { accordion1Check(this); }
		if (accordion == 'custom') { accordion3Check(this); }
	},	

  render() {

  	var self = this;

		// generate fields
		var generateField = function(conf, index, accordion) {
			var r = null,
					ref = accordion+'_'+conf.type+'_'+index;

			var props = {
				key :ref, 
    		label: conf.label || '',
    		validation: conf.validation,
				ref: ref,
    		handleChange: self.checkField.bind(self,ref,accordion),
			}

			switch (conf.type) {
			// start switch
				// email
				case 'email':
					if (self.state.fields[ref]) { props.value = self.state.fields[ref];	}
					r = <General.FieldInput {...props} />
					break;

				// password
				case 'password':
					if (self.state.fields[ref]) { props.value = self.state.fields[ref];	}
					r = <General.FieldPassword {...props} />
					break;

				case 'select':
					props.options = conf.options;
					if (self.state.fields[ref]) { props.value = self.state.fields[ref];	}
					r = <General.FieldSelect {...props} />
					break;

				default: 
					if (self.state.fields[ref]) { props.value = self.state.fields[ref];	}
					r = <General.FieldInput {...props} />
			
			// end switch
			}

			return r;

		}


    return (
      <div id="real-container">

      	<TopNav.Bar fixed={true}>
      		<TopNav.Button side="left" onClick={ () => window.location.href = '/stage/#/01' } >
      			<img src="/img/arrow-back.svg" />
      		</TopNav.Button>
      		<TopNav.Title align="center" text="Registration" />
      	</TopNav.Bar>
    		<TopNav.Loading ref="loadingBar" />

	      <MainContent contentBackgroundStyle={{ paddingBottom: '60px' }}>

	      	<Accordion.Main>
	      		<Accordion.Section ref="access_data" open={true} title="Access data" iconLeft="fa fa-unlock-alt">
			      	
	      			{config.Login.account.access.map( (c,i) => generateField(c,i,'access') )}

	      		</Accordion.Section>

	      		<Accordion.Section ref="personal_data" open={true} title="Personal Data" iconLeft="fa fa-user-o">

	      			{config.Login.account.custom.map( (c,i) => generateField(c,i,'custom') )}

	      		</Accordion.Section>

	      		<Accordion.Section ref="terms_privacy_marketing" open={true} title="Terms and condition" iconLeft="fa fa-globe">
      				
	      			<General.CheckboxInput
	      				ref="terms_privacy_flag" 
	      				handleChange={accordion2Check.bind(this,this)}
	      				label={<span>Accept the <a href="#">Terms of service</a> and <a href="#">Privacy policy</a></span>}
	      				value={self.state.terms_privacy_flag}
	      			/>

	      			<General.CheckboxInput
	      				ref="marketing_flag"
	      				handleChange={accordion2Check.bind(this,this)}
	      				label={<span>Accept the <a href="#">Marketing policies</a> <span className="label label-black">optional</span></span>}
	      				value={self.state.marketing_flag}
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