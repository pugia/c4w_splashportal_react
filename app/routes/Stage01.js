var React = global.React;
var General = require('./components/General');
var TopNav = require('./components/TopNav');
var MainContent = require('./components/MainContent');
var BottomNav = require('./components/BottomNav');
var Login = require('./components/Login');
var Modal = require('./components/Modal');
var Cookies = require('js-cookie');

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

  getInitialState() {

    return {
      location: Cookies.getJSON('location'),
      config: null
    }

  },

  componentWillMount() {

    console.log('componentWillMount');
    Cookies.remove('fields');

    var self = this;

    var toSend = {
      ap_redirect: self.state.location.href,
      session: Cookies.getJSON('session')
    };

    $.ajax({
      url: endpoint_stage,
      type:'POST',
      cache: false,
      data: JSON.stringify(toSend),
      async:true,
      success: function(response) {

        self.setState({ config: JSON.parse(JSON.stringify(response.config)) })
        // self.setState({ config: require('../config') })
        $('#main').data('stored_data', JSON.stringify(self.state));
        Cookies.set('config_stage', self.state.config);
        Cookies.set('session', response.session);

        General.LoadingOverlay.close();
        setTimeout(() => {
          document.getElementById('main').style.opacity = 1;
        }, 500);

      },
      error: function(e) {

        console.log('url: '+endpoint_stage);
        console.log('data: ' + JSON.stringify(toSend) );
        console.log('error: ' + JSON.stringify(e) );

        $('#error').addClass('open');

        console.log('error', e);
      }
    });

  },  

	componentDidMount() {
    console.log('componentDidMount');
    document.getElementById('main').scrollTop = 0;
	},

	handleSocial(s) {
    this.refreshApRedirect();
		console.log('handle', s);
	},

  accountDoLogin() {

    var self = this;

    General.LoadingOverlay.open();

    var toSend = self.refs.login_account.getValues();
    toSend['session'] = Cookies.getJSON('session');
    Cookies.set('doLogin', toSend);

    window.location.href = this.state.config.ApRefresh.url;

  },

  render() {

    console.log('render Stage01');

  	var self = this,
        content = null,
        notify = null;

    if (self.state.config) {

      var config = this.state.config;
      document.getElementById('main').style.backgroundImage = "url("+ config.Content.background +")";

      var generateLoginBloc = function(type, index) {

        var key = type +'_'+ index;
        var rend;

        if (type == 'divider') {
          rend = (
            <General.Divider text="or" key={key} />
          )
        }

        if (type == 'social') {
          rend = (
            <Login.Social key={key}
              config={config.Login.social}
              handleSocial={self.handleSocial}
            />
          )
        }

        if (type == 'passThrough') {
          rend = (
            <Login.PassThrough key={key}
              config={config.Login.passThrough}
            />
          )
        }

        if (type == 'account') {
          rend = (
            <Login.Account key={key}
              ref="login_account"
              config={config.Login.account}
              doLogin={self.accountDoLogin}
              doRegister={() => window.location.href = '/stage/#/02' }
            />
          )
        }

        return rend

      }

      // add divider
      var order = [];
      for (var i = 0; i < config.Login.order.length; i++) {
        if (i>0) { order.push('divider'); }
        order.push(config.Login.order[i])
        
      }

      if (Cookies.get('login_error')) {
        notify = <Notify text={Cookies.get('login_error')} />;
        Cookies.remove('login_error');
      }

      content = (

        <MainContent>

          {order.map( generateLoginBloc )}

        </MainContent>

      )
    }

    return (
      <div id="real-container">
        {notify}
      	<TopNav.Bar fixed={true}>
      		<TopNav.Button side="left" onClick={ () => window.location.href = '/' } >
      			<img src="/img/arrow-back.svg" />
      		</TopNav.Button>
      		<TopNav.Title align="center" text="Wifi access" />
      	</TopNav.Bar>

        {content}

      </div>
    )
  }

});

var Notify = React.createClass({

  getInitialState() {
    return {
      open: true
    }
  },

  componentWillMount() {
    if (this.props.timer) {
      setTimeout(this.close, this.props.timer);
    }
  },

  componentDidMount() {

    var self = this;

    var h = '46px';
    this.refs.notify.style.top = '-'+h;
    setTimeout(function() {
      var h = '46px';
      self.refs.notify.style.top = 0;
      document.getElementById('main-content').style.marginTop = h;
      document.getElementById('mainNav').style.top = h;      
    },500);
  },

  close() {
    var t = getAbsoluteHeight(this.refs.notify) * -1;
    this.refs.notify.style.top = t+'px';
    document.getElementById('main-content').style.marginTop = 0;
    document.getElementById('mainNav').style.top = 0;    
  },

  toggleMore() {
    if (this.refs.more_content.className.indexOf('closed') != -1) {
      this.refs.more_content.className = 'notify_more_content';
    } else {
      this.refs.more_content.className = 'notify_more_content closed';
    }
  },

  render() {

    var icon = <span className="notify_icon" onClick={this.close}><i className="fa fa-close"></i></span>
    var more = null;
    let cname = 'notify';

    if (this.props.fixed) {
      icon = null; 
    }    

    if (this.props.children) {
      cname += ' more';
      var moreCname = 'notify_more';

      if (this.props.fixed) { 
        moreCname += ' closed'; 
        icon = <span className="notify_icon" onClick={this.toggleMore}><i className="fa fa-chevron-up"></i></span>        
      }
      
      more = (
        <div ref="more_content" className="notify_more_content closed">
          <div ref="more" className={moreCname}>
            {this.props.children}
          </div>
        </div>
      );
    }


    return (
      <div ref="notify" className={cname}>
        <div className="notify_panel">
          <p className="notify_text" title={this.props.text || ''}>{this.props.text || ''}</p>
          {more}
          {icon}
        </div>
      </div>
    )
  } 

});

function getAbsoluteHeight(el) {

  // console.log('getAbsoluteHeight');

  // Get the DOM Node if you pass in a string
  el = (typeof el === 'string') ? document.querySelector(el) : el; 

  var styles = window.getComputedStyle(el);
  var margin = parseFloat(styles['marginTop']) +
               parseFloat(styles['marginBottom']);

  return Math.ceil(el.offsetHeight + margin);

}



/* Module.exports instead of normal dom mounting */
module.exports = Stage01;