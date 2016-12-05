var React = global.React;
var General = require('./components/General');
var TopNav = require('./elements/TopNav');
var MainContent = require('./components/MainContent');
var AppMenu = require('./components/AppMenu');
var Cookies = require('js-cookie');

// var config = require('../config');

var Success = React.createClass({

  getInitialState() {
    return {
      config: Cookies.getJSON('config_stage'),
      logged: Cookies.getJSON('logged')
    }
  },

	componentDidMount() {

    setTimeout(() => {
      General.LoadingOverlay.close();
      document.getElementById('main').style.opacity = 1;
    }, 200);

	},

  render() {

  	var self = this,
        content = null

    var style = {
      contentBackground: {
        background: '#54A5C3'
      },
      panel: {
        position: 'absolute',
        width: '90%',
        height: 'calc(90% - 40px)',
        margin: '5%',
        top: '40px'
      }
    }

    if (self.state.config) {

      var config = this.state.config;

      content = (
        <div id="real-container">
          <TopNav config={config.TopNav} />

          <MainContent full contentBackgroundStyle={style.contentBackground}>

          </MainContent>

          <AppMenu list={config.Apps} />        
        </div>
      )
    }

    return content

  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Success;