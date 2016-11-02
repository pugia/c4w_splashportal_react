'use strict';
exports.__esModule = true;

var React = global.React;

var MainContent = React.createClass({

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    setTimeout(this.updateDimensions, 100);
  },

  componentWillUnmount: function() {
    window.removeEventListener("resize", this.updateDimensions);
  },

  componentDidUpdate(prevProps, prevState) {
    this.updateDimensions();
  },

  updateDimensions: function() {
    if (this.refs.mainContent) {
      let m = document.getElementById("main");
      let c = document.getElementById("real-container").childNodes;
      var h = m.offsetHeight;
      for (var x in c) { h -= (c[x].nodeType == '1' && c[x].id != 'main-content') ? c[x].offsetHeight : 0; }
      this.refs.mainContent.style.height = h+'px';
    }
  },

	render() {
		return (
      <div className="main-content" id="main-content" ref="mainContent">
        <div className="content-background" ref="content-background" style={this.props.contentBackgroundStyle || null}>
					{this.props.children}
				</div>
			</div>
		)
	}

});

exports.MainContent = MainContent;
module.exports = MainContent;