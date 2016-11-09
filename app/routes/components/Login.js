'use strict';
exports.__esModule = true;

var React = global.React;
var General = require('./General');
var Modal = require('./Modal');
var BottomNav = require('./BottomNav');

var LoginSocial = React.createClass({

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

		return (

      <div className="login login-social">
        <p className="title mui--text-center">{this.props.title}</p>

        <div className="buttons">
        	{this.props.socials.map(createButton)}
        	<button className="social show-more" onClick={this.showMore}><i className="fa fa-plus"></i></button>
        </div>
	      <Modal ref="modal" title="CHOOSE A SOCIAL ACCOUNT">
	      	{this.props.socials.map(createButtonModal)}
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

	checkAccount() {
		if (!this.refs.account.isValid()) {
			this.refs.account.setState({
				'status': 'error'
			})
		} else {
			this.refs.account.setState({
				'status': 'success'
			})			
		}
	},

	checkPassword() {
		if (!this.refs.password.isValid()) {
			this.refs.password.setState({
				'status': 'error'
			})
		} else {
			this.refs.password.setState({
				'status': 'success'
			})			
		}
	},

	doLogin() {

		var r = true
		if (!this.refs.account.isValid()) { r = false; }
		if (!this.refs.password.isValid()) { r = false; }

		if (r) {
			window.location.href = '/#/stage06';
		} else {
			this.refs.account.focus();
		}

	},

	render() {

		var self = this;
		var style = {
			bottomBar: {
				marginLeft: '-15px',
				marginRight: '-15px',
				width: 'auto'
			},
			pararaph: {
				marginBottom: '50px'
			}
		}

		return(

      <div className="login login-account mui-container">
      	<General.Paragraph customClass="title" align="center" text={this.props.title} />
      	<General.FieldInput 
      		input={{
      			type: 'tel'
      		}} 
      		ref="account" 
      		handleChange={this.checkAccount}
      		label="Mobile"
      		validation={(v) => {
      			var re = /^\d+$/;
      			return re.test(v) && v.length > 6;
      		}}
      		msg={{
      			error: 'Format not valid'
      		}} />
      	
      	<General.FieldPassword 
      		ref="password" 
      		label="Password"
      		validation={(v) => {
      			return v.length >= 5;
      		}}
      		handleChange={this.checkPassword}
      		msg={{
      			error: 'Password must be at least 5 characters'
      		}} />

      	<General.Paragraph style={style.pararaph}>
      		<a className="mui--pull-right">Forgot password?</a>
      		<label htmlFor="remember_me"><input id="remember_me" type="checkbox" value="1" /> Remember me</label>
      	</General.Paragraph>

	      <BottomNav.Bar style={style.bottomBar}>
	      	<BottomNav.Button background="006c68" text="LOGIN" onClick={this.doLogin} />
	      	<BottomNav.Button background="db0015" iconRight="fa-chevron-right" iconRightType="fa" text="NEW USER? REGISTER" onClick={() => window.location.href = '/#/stage02'} />
	      </BottomNav.Bar>      		

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

module.exports = {
	Social: LoginSocial,
	ClickThrough: LoginClickThrough,
	Partner: LoginPartner,
	Account: LoginAccount
};