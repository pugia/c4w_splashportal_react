'use strict';
exports.__esModule = true;

var React = global.React;
var General = require('./General');

var LoginSocial = React.createClass({

  handleSocial(e) {
  	if (this.props.handleSocial) {
  		this.props.handleSocial(e.target.value);
  	}
  },	

	render() {
		var self = this;
		var createButton = function(social) {

			switch (social) {
				case 'baidu': var iconClass = 'fa fa-paw'; break;
				default: var iconClass = 'fa fa-'+ social;
			}

			return (
				<button key={'social_'+social} className={'mui-btn social-'+ social } value={social} onClick={self.handleSocial}><i className={iconClass}></i></button>
			)
		}

		return (

      <div className="login login-social">
        <p className="title mui--text-center">{this.props.title}</p>

        <div className="buttons">
        	{this.props.socials.map(createButton)}
        </div>
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

      <div className="login login-click-through mui-container">
        <General.Paragraph customClass="title" align="center" text={this.props.title} />
        <General.FieldInput input={inputProps} ref="input" type="email" label="Email address" msg={this.state} />
      </div>

		)
	}

});


exports.Social = LoginSocial;
exports.ClickThrough = LoginClickThrough;

module.exports = {
	Social: LoginSocial,
	ClickThrough: LoginClickThrough
};