var React = global.React;
var General = require('./components/General');
var TopNav = require('./elements/TopNav');
var MainContent = require('./components/MainContent');

var config = require('../config');

var Landing = React.createClass({

  updateSliderContainerHeight() {
    this.refs.sliderContainer.style.height = ( this.refs.content.getFullHeight() - getAbsoluteHeight(this.refs.goOnlineBtn) ) + 'px';
  },

	componentDidMount() {
		localStorage.removeItem('stored_data');
    document.getElementById('main').style.opacity = 1;
    
    window.addEventListener("resize", this.updateSliderContainerHeight);
    setTimeout(this.updateSliderContainerHeight, 100);
  },

  componentWillUnmount: function() {
    window.removeEventListener("resize", this.updateSliderContainerHeight);
  },

  componentDidUpdate(prevProps, prevState) {
    this.updateSliderContainerHeight();
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

        	<button onClick={() => window.location.href = '/stage/#/01'} ref="goOnlineBtn" className="go-online-button main-button">
        		<span>CONNECT TO OUR WIFI</span>
        		<i className="fa fa-angle-right"></i>
        	</button>

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