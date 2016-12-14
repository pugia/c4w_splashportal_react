'use strict';
exports.__esModule = true;

var React = global.React;
var General = require('./General');
var Modal = require('./Modal');
var BottomNav = require('./BottomNav');

var LoginSocial = React.createClass({

	allowed: [
		'facebook',
		'twitter',
		'linkedin',
		'google-plus',
		'google',
		'vk',
		'instagram',
		'foursquare',
		'pinterest',
		'weibo',
		'baidu',
		'qq',
		'renren'
	],

  handleSocial(e) {
  	if (this.props.handleSocial) {
  		this.props.handleSocial(e.target.value);
  	}
  },

  showMore() {
  	this.refs.modal.open();
  },

	render() {
		var self = this;
		var createButton = function(social, x) {

			switch (social) {
				case 'baidu': var iconClass = 'fa fa-paw'; break;
				default: var iconClass = 'fa fa-'+ social;
			}

			if (x < 4) {
				return (
					<button key={'social_'+social} className={'social social-'+ social } value={social} onClick={self.handleSocial}><i className={iconClass}></i></button>
				)
			}
		}

		var createButtonModal = function(social, x) {

			switch (social) {
				case 'baidu': var iconClass = 'fa-paw'; break;
				default: var iconClass = 'fa-'+ social;
			}

			if (x >= 4) {
				return (
					<General.ListButton key={'social_'+social} value={social} addClass={'social-'+social} onClick={self.handleSocial} icon={iconClass}>{social}</General.ListButton>
				)
			}
		}

		var socials = [];
		this.props.config.list.map((s) => {
			if (self.allowed.indexOf(s) != -1) { socials.push(s); }
			else { console.warn('social not valid: '+s) }
		})

		var showmore = null;
		if (socials.length > 4) {
			showmore = <button className="social show-more" onClick={this.showMore}><i className="fa fa-plus"></i></button>
		}

		return (

      <div className="login login-social">
        <p className="title mui--text-center">{this.props.config.labels.title}</p>

        <div className="buttons">
        	{socials.map(createButton)}
        	{showmore}
        </div>
	      <Modal ref="modal" title={this.props.config.labels.modal}>
	      	{this.props.config.list.map(createButtonModal)}
	      </Modal>
      </div>

		)
	}

});

var LoginClickThrough = React.createClass({

	getInitialState() {
		var st = this.props.msg || {
			status: "info",
			info: "We will use it to send you the confirmation email",
			error: "Incorrect format",
			success: "Well done! Tape on next to go online!"
		}
		return st;
	},

	componentDidUpdate(prevProps, prevState) {
		this.refs.input.setState(this.state);
	},

	getEmail() {
		return this.refs.input.getValue()
	},

	focus() {
		this.refs.input.focus();
	},

	render() {

		var inputProps = this.props.input || {};
		inputProps.type = 'email';

		return (

      <div className="login login-click-through mui-container" style={{ marginBottom: '20px' }}>
        <General.Paragraph customClass="title" align="center" text={this.props.title} />
        <General.FieldInput input={inputProps} ref="input" type="email" label="Email address" msg={this.state} />
      </div>

		)
	}

});

var LoginPartner = React.createClass({

  handlePartner(e) {
  	if (this.props.handlePartner) {
  		this.props.handlePartner(e.target.value);
  	}
  },

  openModal() {
  	this.refs.modal.open()
  },

	render() {
		var self = this;
		var createButtonModal = function(code, name) {

			return (
				<General.ListButton key={'partner_'+code} addClass="partner" value={code} onClick={self.handlePartner}>{name}</General.ListButton>
			)

		}

		return (

      <div className="login login-partner mui-container">
        <General.Paragraph align="center">
        	Login with a <a onClick={this.openModal}>Partner</a>
        </General.Paragraph>
	      <Modal ref="modal" title="CHOOSE A PARTNER">
	      	{mapObject(this.props.partners, createButtonModal)}
	      </Modal>
	     </div>

		)
	}

});

var LoginAccount = React.createClass({

	doLogin() {

		var r = true
		var toFocus = null;
		for (var k in this.props.config) {
			if (r) {
				var c = this.props.config[k];
				toFocus = c.type + '_' + k;
				if (!this.refs[toFocus].isValid()) { r = false; }
			}
		}

		if (!r) {
			this.refs[toFocus].focus();
		} else {
			if (this.props.doLogin) {
				this.props.doLogin()
			}
		}

	},

	doRegister() {
		if (this.props.doRegister) {
			this.props.doRegister();
		}
	},

	getValues() {

		var values = {};
		for (var k in this.props.config.access) {
			var c = this.props.config.access[k];
			var r = c.type + '_' + k;
			values[c.name] = this.refs[r].getValue();
		}
		return values;

	},

	checkField(ref) {
		if (!this.refs[ref].isValid()) {
			this.refs[ref].setState({
				'status': 'error'
			})
		} else {
			this.refs[ref].setState({
				'status': 'success'
			})			
		}
	},

	render() {

		var self = this;
		var style = {
			bottomBar: {

			},
			pararaph: {
				marginBottom: '50px'
			}
		}

		// generate fields
		var generateField = function(conf, index) {
			var r = null,
					ref = conf.type+'_'+index;

			switch (conf.type) {
			// start switch
				// email
				case ('email'):
					r = <General.FieldInput
						key={ref} 
	      		label={conf.label || ''}
	      		validation={conf.validation}
						ref={ref}
	      		handleChange={self.checkField.bind(self,ref)}
	      		/>
					break;

				// password
				case ('password'):
					r = <General.FieldPassword
						key={ref} 
	      		label={conf.label || ''}
	      		validation={conf.validation}
						ref={ref}
	      		handleChange={self.checkField.bind(self,ref)}
	      		/>
					break;

				default: 
					r = <General.FieldInput
						key={ref} 
	      		label={conf.label || ''}
	      		validation={conf.validation}
						ref={ref}
	      		handleChange={self.checkField.bind(self,ref)}
	      		/>

			// end switch
			}

			return r;

		}

		return(

      <div className="login login-account mui-container">
      	<General.Paragraph customClass="title" align="center" text={this.props.config.labels.title} />
      	{this.props.config.access.map( (c,i) => generateField(c,i) )}

      	<General.Paragraph style={style.pararaph}>
      		<a className="mui--pull-right">{this.props.config.labels.recover}</a>
      		<label htmlFor="remember_me"><input id="remember_me" type="checkbox" value="1" /> {this.props.config.labels.remember}</label>
      	</General.Paragraph>

	      <div className="buttonBar">
	      	<button className="main-button-background main-button-height" onClick={this.doLogin}>{this.props.config.labels.login}</button>
	      	<button className="navigation-background main-button-height" onClick={this.doRegister}>{this.props.config.labels.register}</button>
	      </div>      		

      </div>

		)
	}

})

var LoginPassThrough =  React.createClass({

	goOnline() {

		General.LoadingOverlay.open();
		window.location.href = this.props.config.url

	},

	render() {

		return (

      <div className="login login-passThrough mui-container">
      	<General.Paragraph customClass="title" align="center" text={this.props.config.labels.title} />

	      <div className="buttonBar">
	      	<button className="main-button-background main-button-height" style={this.props.config.style} onClick={this.goOnline}>{this.props.config.labels.button}</button>
	      </div>      		

      </div>

		)

	}

})


function mapObject(object, callback) {
  return Object.keys(object).map(function (key) {
    return callback(key, object[key]);
  });
}

exports.Social = LoginSocial;
exports.ClickThrough = LoginClickThrough;
exports.Partner = LoginPartner;
exports.Account = LoginAccount;
exports.PassThrough = LoginPassThrough;

module.exports = {
	Social: LoginSocial,
	ClickThrough: LoginClickThrough,
	Partner: LoginPartner,
	Account: LoginAccount,
	PassThrough: LoginPassThrough
};