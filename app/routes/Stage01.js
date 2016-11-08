var React = global.React;
var General = require('./components/General');
var TopNav = require('./components/TopNav');
var MainContent = require('./components/MainContent');
var BottomNav = require('./components/BottomNav');
var Login = require('./components/Login');
var Modal = require('./components/Modal');

var nextStage = function() {

	var self = this;

	if (checkValidEmail(self.refs.login_clickThrough.getEmail())) {
  	$('#main').data('stored_data', JSON.stringify({
  		email: self.refs.login_clickThrough.getEmail()
  	}));
  	window.location.href = '/#/stage02'
	} else {
		self.refs.login_clickThrough.setState({
			status: 'error'
		});
		self.refs.login_clickThrough.focus();
	}

	return false;

}

var checkValidEmail = function(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

var Stage01 = React.createClass({

	componentDidMount() {
		localStorage.removeItem('stored_data');
	},

	handleSocial(s) {
		console.log('handle', s);
	},

	handlePartner(s) {
		console.log('handle', s);
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
      		<TopNav.Button side="left" onClick={ () => window.location.href = '/#/' } >
      			<img src="/img/arrow-back.svg" />
      		</TopNav.Button>
      		<TopNav.Logo img="/img/fs@2x.png" />
      	</TopNav.Bar>

	      <MainContent>

          <Login.Social 
          	title="use your social account" 
          	socials={['facebook','twitter','linkedin','google-plus','google','vk','instagram','foursquare','pinterest','weibo','baidu','qq','renren']}
          	handleSocial={this.handleSocial}
          />

          <General.Divider text="or" />

          <Login.Partner 
          	partners={{
          		'frecciarossa': 'Frecciarossa',
          		'cartafreccia': 'Cartafreccia',
          		'unipi': 'University of Pisa',
          		'freeitaliawifi': 'Free Italia Wi-fi'
          	}}
          	handlePartner={this.handlePartner}
          />

          <General.Divider text="or" />

          <Login.Account
          	ref="login_account"
          	title="LOGIN WITH OUR ACCOUNT"
          />

	      </MainContent>

      </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Stage01;