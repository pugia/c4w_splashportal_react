var React = global.React;
var General = require('./components/General');
var TopNav = require('./components/TopNav');
var MainContent = require('./components/MainContent');
var BottomNav = require('./components/BottomNav');
var Login = require('./components/Login');
var Modal = require('./components/Modal');

var config = require('../config');

var nextStage = function() {

	var self = this;

	if (checkValidEmail(self.refs.login_clickThrough.getEmail())) {
  	$('#main').data('stored_data', JSON.stringify({
  		email: self.refs.login_clickThrough.getEmail()
  	}));
  	window.location.href = '/stage/#/02'
	} else {
		self.refs.login_clickThrough.setState({
			status: 'error'
		});
		self.refs.login_clickThrough.focus();
	}

	return false;

}

var Stage01 = React.createClass({

	componentDidMount() {
    document.getElementById('main').scrollTop = 0;
		localStorage.removeItem('stored_data');
	},

	handleSocial(s) {
		console.log('handle', s);
	},

  accountDoLogin() {
    console.log(this.refs.login_account.getValues());
  },

  render() {

  	var self = this;

		var style = {
			title: {
				fontFamily: 'Roboto',
				fontSize: '35px',
				color: '#63747F',
				marginBottom: '0'
			},
			subTitle: {
				fontFamily: 'Roboto',
				fontSize: '16px',
				color: '#0075AA',
				textTransform: 'uppercase',
				marginBottom: '20px'
			}
		}

    return (
      <div id="real-container">

      	<TopNav.Bar fixed={true}>
      		<TopNav.Button side="left" onClick={ () => window.location.href = '/' } >
      			<img src="/img/arrow-back.svg" />
      		</TopNav.Button>
      		<TopNav.Title align="center" text="Wifi access" />
      	</TopNav.Bar>

	      <MainContent>

          <Login.Social
          	title="use your social account" 
          	socials={config.Login.social.list}
          	handleSocial={this.handleSocial}
          />

          <General.Divider text="or" />

          <Login.Account
          	ref="login_account"
          	title="LOGIN WITH OUR ACCOUNT"
            config={config.Login.account.access}
            doLogin={this.accountDoLogin}
            doRegister={() => window.location.href = '/stage/#/02' }
          />

	      </MainContent>

      </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Stage01;