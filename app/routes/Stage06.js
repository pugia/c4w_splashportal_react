var React = global.React;
var General = require('./components/General');
var TopNav = require('./components/TopNav');
var MainContent = require('./components/MainContent');
var BottomNav = require('./components/BottomNav');

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

        <TopNav.Bar fixed={true} mainMenu={true} langMenu={true}>

          <TopNav.Logo img="/img/fs@2x.png" />

        </TopNav.Bar>

	      <MainContent full contentBackgroundStyle={style.contentBackground}>

          <div className="mui-panel" style={style.panel} />

	      </MainContent>

      </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Stage06;