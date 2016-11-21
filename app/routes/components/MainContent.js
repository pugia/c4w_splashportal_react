'use strict';
exports.__esModule = true;

var React = global.React;

var MainContent = React.createClass({

  componentDidMount() {
    var self = this;
    window.addEventListener("resize", this.updateDimensions);
    document.body.style.overflow = 'auto';    
    setTimeout(this.updateDimensions, 100);
  },

  componentWillUnmount: function() {
    window.removeEventListener("resize", this.updateDimensions);
  },

  componentDidUpdate(prevProps, prevState) {
    this.updateDimensions();
  },

  getFullHeight: function() {
    var w = window,
        d = document,
        e = d.documentElement,
        g = d.getElementsByTagName('body')[0],
        h = w.innerHeight|| e.clientHeight|| g.clientHeight,
        c = document.getElementById("real-container").childNodes;
    for (var x in c) { h -= (c[x].nodeType == '1' && c[x].id != 'main-content') ? c[x].offsetHeight : 0; }
    return h;
  },

  updateDimensions: function() {

    if (this.props.full) {
      this.refs.mainContent.style.height = this.getFullHeight()+'px';
      this.refs.contentBackground.style.minHeight = this.getFullHeight()+'px';
    }
  },

	render() {
		return (
      <div className="main-content" id="main-content" ref="mainContent">
        <div className="content-background" ref="contentBackground" style={this.props.contentBackgroundStyle || null}>
					{this.props.children}
				</div>
			</div>
		)
	}

});

exports.MainContent = MainContent;
module.exports = MainContent;