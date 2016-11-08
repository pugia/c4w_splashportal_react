'use strict';
exports.__esModule = true;

var React = global.React;

var Main = React.createClass({

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    setTimeout(this.updateDimensions, 200);
  },

  componentWillUnmount: function() {
    window.removeEventListener("resize", this.updateDimensions);
  },

  componentDidUpdate(prevProps, prevState) {
    this.updateDimensions();
  },

  updateDimensions: function() {

    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        h = w.innerHeight|| e.clientHeight|| g.clientHeight,
        c = document.getElementById("real-container").childNodes;
    for (var x in c) { h -= (c[x].nodeType == '1' && c[x].id != 'main-content') ? c[x].offsetHeight : 0; }
    this.refs.main.style.height = h+'px';

  },

  scrollDown: function() {
  	if (this.props.scrollDown) { this.props.scrollDown(); }
  },

	render() {

		var style = {
			position: "relative"
		};

		return (
			<div style={style} ref="main" className="showcase_main">
				{this.props.children}

        <div className="bottom">

          <p><button onClick={this.scrollDown} className="mui-btn mui-btn--more"><i className="fa fa-chevron-down" aria-hidden="true"></i></button></p>

        </div>

			</div>
		)
	}

});

var Other = React.createClass({

	render() {
		return (
			<div className="showcase_other">
				{this.props.children}
			</div>
		)
	}

});

exports.Main = Main;
exports.Other = Other;

module.exports = {
	Main: Main,
	Other: Other
};