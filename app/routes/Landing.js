var React = global.React;
var General = require('./components/General');
var TopNav = require('./components/TopNav');
var MainContent = require('./components/MainContent');
var Showcase = require('./components/Showcase');


var Landing = React.createClass({

	componentDidMount() {
		localStorage.removeItem('stored_data');
	},

	scrollDown() {

		ReactDOM.findDOMNode(this.refs.asdf).scrollIntoView({ behavior: 'smooth' });

	},

  render() {

  	var self = this;

		var style = {
			contentBackground: {
				background: 'url(/img/bkg@2x.png) no-repeat top center / cover',
			},
			showcase: {
				main: {
					go_online_button: {
						display: 'block',
						background: '#006d68',
						fontFamily: '"Roboto", sans-serif',
						width: '90%',
						height: '47px',
						lineHeight: '47px',
						textAlign: 'center',
						color: '#fff'
					}
				},
				other: {
					padding: '60px 30px 80px 30px',
					textAlign: 'center'
				}
			}
		}

    return (
      <div id="real-container">

      	<TopNav.Bar mainMenu={true} langMenu={true}>

      		<TopNav.Logo img="/img/fs@2x.png" />

      	</TopNav.Bar>

	      <MainContent contentBackgroundStyle={style.contentBackground}>

	      	<Showcase.Main scrollDown={this.scrollDown}>

	          <General.Paragraph align="center" text="Welcome on board!" />
	          <General.Paragraph align="center" text="custom html" />

	          <General.Paragraph align="center">
	          	<a href="/#/stage01" style={style.showcase.main.go_online_button}>
	          		<span>CONNECT TO OUR WIFI</span>
	          		<i className="fa fa-angle-right"></i>
	          	</a>
	          </General.Paragraph>

          </Showcase.Main>

          <Showcase.Other ref="asdf">

	          <General.Paragraph style={style.showcase.other} align="center">
	          	<img src="/img/FSNWES.png" />
	          </General.Paragraph>

          </Showcase.Other>

	      </MainContent>

      </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Landing;