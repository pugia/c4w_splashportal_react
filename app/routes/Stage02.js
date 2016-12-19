var React = global.React;
var General = require('./components/General');
var TopNav = require('./components/TopNav');
var MainContent = require('./components/MainContent');
var BottomNav = require('./components/BottomNav');
var Accordion = require('./components/Accordion');
var Cookies = require('js-cookie');

var moment = require('moment');

var accordion1Check = function(self, focus = false) {

	var config = self.state.config;

	var toFocus = null;
	var r = true;
	config.Login.account.access.map((c,i) => {
		var ref = c.name;

		if (c.required && c.validation && c.registration == true) {
			if (!self.refs[ref].isValid()) { 
				r = false; 
				if (!toFocus) { toFocus = ref; }
			}
		}

		if (c.registration == true && c.type != 'hidden') {

			var fields = self.state.fields;
			fields[ref] = self.refs[ref].getValue()
			self.setState({
				fields: fields
			})

		}

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

	var config = self.state.config;

	var toFocus = null;
	var r = true;
	config.Login.account.custom.map((c,i) => {
		var ref = c.name;
		if (c.required && c.validation) {
			if (!self.refs[ref].isValid()) { 
				r = false; 
				if (!toFocus) { toFocus = ref; }
			}
		}

		if (c.type != 'hidden') {
			var fields = self.state.fields;
			fields[ref] = self.refs[ref].getValue()
			self.setState({
				fields: fields
			})
		}

	})

  self.refs.personal_data.setState({
  	status: r ? 'success' : 'error'
  })

  if (!r && focus) { self.refs[toFocus].focus() }

	loadingBarStatus(self);
	return r;

}

var loadingBarStatus = function(self) {

	var config = self.state.config;

	var toCheck = 1;
	var completed = 0
	config.Login.account.access.map( (c,i) => {
		if (c.required && c.validation && c.registration == true) { toCheck++ }	
	})
	config.Login.account.custom.map( (c,i) => { 
		if (c.required && c.validation && c.tyle) { toCheck++ }	
	})

	var step = 100 / toCheck;

	config.Login.account.access.map( (c,i) => { 
		var ref = c.name;
		if (c.required && c.validation && c.registration == true && self.refs[ref].isValid()) { completed += step }
	})

	config.Login.account.custom.map( (d,j) => { 
		var ref = d.name;
		if (d.required && d.validation && self.refs[ref].isValid()) { completed += step }
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

		Cookies.set('fields', this.state.fields);		

		var toSend = this.state.fields;
		toSend['ap_redirect'] = this.state.location.href;
		toSend['session'] = Cookies.getJSON('session');

		console.log(toSend);

    $.ajax({
      url: endpoint_register,
      type:'POST',
      cache: false,
      data: JSON.stringify(toSend),
      async:true,
      success: function(response) {

      	console.log(response);

        // General.LoadingOverlay.close();
        // setTimeout(() => {
        //   document.getElementById('main').style.opacity = 1;
        // }, 500);

      },
      error: function(e) {

        console.log('url: '+endpoint_register);
        console.log('data: ' + JSON.stringify(toSend) );
        console.log('error: ' + JSON.stringify(e) );

        $('#error').addClass('open');

        console.log('error', e);
      }
    });

		// $('#main').data('stored_data', JSON.stringify(this.state));
		// sessionStorage.setItem('stored_data', JSON.stringify(this.state));
		// sessionStorage.setItem('login_time', moment().format());
		// window.location.href = '/stage/#/03';
	}

	return false;
}


var Stage02 = React.createClass({

	getInitialState() {

		var st = {
      location: Cookies.getJSON('location'),
      config: Cookies.getJSON('config_stage'),
			fields: Cookies.getJSON('fields') || {},
			completed: 0,
			terms_privacy_flag: false,
			marketing_flag: false
		}

		return st;

	},

	componentDidMount: function() {
		Cookies.remove('login_time');
		loadingBarStatus(this);

		console.log(this.state.config.Login.account);

		if (this.state.config) {
      General.LoadingOverlay.close();
      document.getElementById('main').style.opacity = 1;
		} else {
			window.location.href = '/stage/#/01'
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
		if (accordion == 'access') { accordion1Check(this); }
		if (accordion == 'custom') { accordion3Check(this); }
	},	

  render() {

  	var self = this;

    var config = this.state.config;
    document.getElementById('main').style.backgroundImage = "url("+ config.Content.background +")";

		// generate fields
		var generateField = function(conf, accordion) {
			var r = null,
					ref = conf.name;

			var props = {
				key :ref, 
    		label: conf.label || '',
				ref: ref,
				validation: conf.validation,
				required: conf.required || false,
    		handleChange: self.checkField.bind(self,ref,accordion),
			}

			if (conf.registration == undefined || conf.registration == true) {

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

					case 'hidden': 
						self.state.fields[ref] = conf.value
						break;

					default: 
						if (self.state.fields[ref]) { props.value = self.state.fields[ref];	}
						r = <General.FieldInput {...props} />
				
				// end switch
				}

			}

			return r;

		}

    if (Cookies.get('registration_error')) {
      notify = <Notify text={Cookies.get('registration_error')} />;
      Cookies.remove('registration_error');
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

	      <MainContent>

	      	<Accordion.Main>
	      		<Accordion.Section ref="access_data" open={true} title="Access data" iconLeft="fa fa-unlock-alt">
			      	
	      			{config.Login.account.access.map( (c) => generateField(c,'access') )}

	      		</Accordion.Section>

	      		<Accordion.Section ref="personal_data" open={true} title="Personal Data" iconLeft="fa fa-user-o">

	      			{config.Login.account.custom.map( (c) => generateField(c,'custom') )}

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

		      <BottomNav.Bar>
		      	<button className="main-button main-button-height" onClick={accordionCheckBoth.bind(this)}>NEXT</button>
		      </BottomNav.Bar>

	      </MainContent>

      </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Stage02;