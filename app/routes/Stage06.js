var React = global.React;
var General = require('./components/General');
var TopNav = require('./elements/TopNav');
var MainContent = require('./components/MainContent');
var AppMenu = require('./components/AppMenu');

var config = require('../config');

var Stage06 = React.createClass({

	componentDidMount() {
		localStorage.removeItem('stored_data');
	},

  render() {

  	var self = this;

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

    return (
      <div id="real-container">

        <TopNav config={config.TopNav} />

	      <MainContent full contentBackgroundStyle={style.contentBackground}>

          <AppMenu list={config.Apps} />

	      </MainContent>

      </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Stage06;