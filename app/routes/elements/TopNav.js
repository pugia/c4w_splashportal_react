'use strict';
exports.__esModule = true;
var TopNavComponent = require('../components/TopNav');

var React = global.React;

var TopNav = React.createClass({

	render() {

		var config = this.props.config;

		var logo = null;
		if (config.logo) {
			if (config.logo.type == 'img') {
				logo = <TopNavComponent.Logo align="center" img={config.logo.value} height={config.logo.height || null} />
			} else {
				logo = <TopNavComponent.Title text={config.logo.value} height={config.logo.height || config.height || null} />
			}
		}

		return (

      	<TopNavComponent.Bar mainMenu={config.menu} langMenu={config.lang} height={config.height || null} background={config.background || null}>

      		{logo}

      	</TopNavComponent.Bar>

		)
	}

});

exports.TopNav = TopNav;
module.exports = TopNav;