var React = global.React;
var General = require('./components/General');
var TopNav = require('./components/TopNav');
var MainContent = require('./components/MainContent');
var BottomNav = require('./components/BottomNav');
var Login = require('./components/Login');

var handleSocial = function(s) {
	console.log('handle', s);
}

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

  render() {

  	var self = this;

		var style = {
			contentBackground: {
				background: 'url(/img/cloud@2x.png) repeat-x top left / 391px 97px',
				paddingTop: '100px',
				paddingBottom: '60px'
			},
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

      	<TopNav.Bar>
      		<TopNav.Button side="left" onClick={ () => window.location.href = '/#/' } >
      			<img src="/img/arrow-back.svg" />
      		</TopNav.Button>
      		<TopNav.Logo img="/img/fs@2x.png" />
      	</TopNav.Bar>

	      <MainContent contentBackgroundStyle={style.contentBackground}>

          <General.Paragraph align="center" style={style.title} text="Welcome on board!" />
          <General.Paragraph align="center" style={style.subTitle} text="get your free wifi" />

          <Login.Social 
          	title="use your social account" 
          	socials={['facebook','twitter','linkedin','google-plus','google','vk','instagram','foursquare','pinterest','weibo','baidu','qq','renren']}
          	handleSocial={handleSocial}
          />

          <General.Divider text="or" />

          <Login.ClickThrough
          	ref="login_clickThrough"
          	title="go online with your email"
          	input={{
							onBlur: function(e) {

								if (checkValidEmail(e.target.value)) {
									self.refs.login_clickThrough.setState({
										status: "success"
									})
								} else {
									self.refs.login_clickThrough.setState({
										status: "error"
									})					
								}
							}
				
						}}
          />

	      </MainContent>

	      <BottomNav.Bar>
	      	<BottomNav.Button background="0075aa" iconRight="fa-chevron-right" iconRightType="fa" text="NEXT" onClick={nextStage.bind(this)} />
	      </BottomNav.Bar>


      </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Stage01;