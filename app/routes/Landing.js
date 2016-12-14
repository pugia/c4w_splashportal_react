var React = global.React;
var General = require('./components/General');
var TopNav = require('./elements/TopNav');
var MainContent = require('./components/MainContent');
var Cookies = require('js-cookie');

var Landing = React.createClass({

  getInitialState() {

    return {
      lang: Cookies.get('lang') || 'eng',
      config: null
    }

  },

  componentWillMount() {

    var params = parseQueryString();
    if (params.res == 'notyet') { Cookies.remove('location') }
    Cookies.remove('logout');
    Cookies.remove('config_stage');
    Cookies.remove('preLogin');    

  },

  loadConfig() {

    console.log('loadConfig')

    var self = this;

    var location = Cookies.getJSON('location');

    if (!location) { 
      location = JSON.parse(JSON.stringify(window.location));
      Cookies.set('location', location);
    } else {
      if (window.location.search != '' && window.location.search != location.search) { 
        location = JSON.parse(JSON.stringify(window.location));
        Cookies.set('location', location); 
      }
    }

    var toSend = {
      ap_redirect: location.href
    };

    $.ajax({
      url: endpoint_landing,
      type:'POST',
      cache: false,
      data: JSON.stringify(toSend),
      async:true,
      success: function(response) {

        General.LoadingOverlay.close();
        Cookies.set('session', response.session);
        self.setState({ config: JSON.parse(JSON.stringify(response.config)) })
        setTimeout(() => {
          document.getElementById('main').style.opacity = 1;
        }, 200);

      },
      error: function(e) {

        console.log('url: '+endpoint_landing);
        console.log('data: ' + JSON.stringify(toSend) );
        console.log('error: ' + JSON.stringify(e) );

        $('#error').addClass('open');
        console.log('error', e);
      }
    });

  },

  updateSliderContainerHeight() {

    if (this.refs.sliderContainer != undefined) {
      this.refs.sliderContainer.style.height = ( this.refs.content.getFullHeight() - getAbsoluteHeight(this.refs.goOnlineBtn) ) + 'px';
    }

  },

	componentDidMount() {

    this.loadConfig();
    window.addEventListener("resize", this.updateSliderContainerHeight);
    setTimeout(this.updateSliderContainerHeight, 100);

  },

  componentWillUnmount: function() {

    window.removeEventListener("resize", this.updateSliderContainerHeight);

  },

  componentDidUpdate(prevProps, prevState) {

    this.updateSliderContainerHeight();

  },

  next() {

    General.LoadingOverlay.open();
    setTimeout( () => window.location.href = '/stage/#/01', 300);

  },

  render() {

    console.log('render landing');    

  	var self = this,
        content = null;

    if (self.state.config) {

      const config = self.state.config;

  		var style = {
        sliderContainer: {
          position: 'absolute',
          width: '100%'
        },
        contentBackgroundStyle: {
          height: '100%',
          background: 'transparent'
        }
  		}

      document.getElementById('main').style.backgroundImage = "url("+ config.Content.background +")";

      content = ( <div id="real-container">

          <TopNav config={config.TopNav} />

          <MainContent ref="content" full contentBackgroundStyle={style.contentBackgroundStyle}>

            <div ref="sliderContainer" className="sliderContainer" style={style.sliderContainer}>
              {config.Content.slides.map( (s) => {
                return <Slide {...s} />
              } )}
            </div>

            <button onClick={self.next} ref="goOnlineBtn" className="go-online-button main-button" style={config.Content.go_online_button.style}>
              <span>{config.Content.go_online_button.labels.title}</span>
              <i className="fa fa-angle-right"></i>
            </button>

          </MainContent>

        </div> );

    }

    return content

  }

});

var Slide = React.createClass({

  render() {
    return (

      <div className="slide">
        <div className="image"></div>
        <div className="details">
          <h3 className="headline">{this.props.headline}</h3>
          <p className="description"></p>
          <p className="action"></p>
        </div>
      </div>

    )
  }

})


function getAbsoluteHeight(el) {

  console.log('getAbsoluteHeight');

  // Get the DOM Node if you pass in a string
  el = (typeof el === 'string') ? document.querySelector(el) : el; 

  var styles = window.getComputedStyle(el);
  var margin = parseFloat(styles['marginTop']) +
               parseFloat(styles['marginBottom']);

  return Math.ceil(el.offsetHeight + margin);

}

var parseQueryString = function() {

    var str = window.location.search;
    var objURL = {};

    str.replace(
        new RegExp( "([^?=&]+)(=([^&]*))?", "g" ),
        function( $0, $1, $2, $3 ){
            objURL[ $1 ] = $3;
        }
    );
    return objURL;
};

/* Module.exports instead of normal dom mounting */
module.exports = Landing;