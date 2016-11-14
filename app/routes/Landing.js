var React = global.React;
var General = require('./components/General');
var TopNav = require('./elements/TopNav');
var MainContent = require('./components/MainContent');

var config = require('../config');

var Landing = React.createClass({

	componentDidMount() {
		localStorage.removeItem('stored_data');
    this.refs.sliderContainer.style.height = ( this.refs.content.getFullHeight() - getAbsoluteHeight(this.refs.goOnlineBtn) ) + 'px';
    document.getElementById('main').style.opacity = 1;
	},

  render() {

  	var self = this;

		var style = {
			contentBackground: {
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'top center',
				backgroundSize: 'cover',
        backgroundImage: "url("+ config.Content.background +")"
			},
      sliderContainer: {
        position: 'absolute',
        width: '100%'
      }
		}

    return (
      <div id="real-container">

      	<TopNav config={config.TopNav} />

	      <MainContent ref="content" full contentBackgroundStyle={style.contentBackground}>

          <div ref="sliderContainer" className="sliderContainer" style={style.sliderContainer}>
            <div className="slide">
              <div className="image"></div>
              <div className="details">
                <h3 className="headline">Welcome to our new Portal</h3>
                <p className="description"></p>
                <p className="action"></p>
              </div>
            </div>
          </div>

        	<a href="/#/stage01" ref="goOnlineBtn" className="go-online-button main-button-background">
        		<span>CONNECT TO OUR WIFI</span>
        		<i className="fa fa-angle-right"></i>
        	</a>

	      </MainContent>

      </div>
    )
  }

});

function getAbsoluteHeight(el) {
  // Get the DOM Node if you pass in a string
  el = (typeof el === 'string') ? document.querySelector(el) : el; 

  var styles = window.getComputedStyle(el);
  var margin = parseFloat(styles['marginTop']) +
               parseFloat(styles['marginBottom']);

  return Math.ceil(el.offsetHeight + margin);
}

/* Module.exports instead of normal dom mounting */
module.exports = Landing;