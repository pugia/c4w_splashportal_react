var React = global.React;
var MainNav = React.createFactory(require('./MainNav'));
var Divider = React.createFactory(require('./Divider'));
var MainMenu = React.createFactory(require('./MainMenu'));

var resetMenu = function() {
	var im = Array.prototype.slice.call(document.querySelectorAll('.main-menu input.menu'));
	im.forEach(function(a) { a.checked = false;	})
}

var Stage06 = React.createClass({

	componentDidMount: function () {

    let m = document.getElementById("main");
    let c = document.getElementById("real-container").childNodes;
    var h = m.offsetHeight;
    for (var x in c) { h -= (c[x].nodeType == '1' && c[x].id != 'main-content') ? c[x].offsetHeight : 0; }
    document.getElementById("main-content").style.height = h+'px';

	},

  render: function () {

		var style = {
			contentBackground: {
				background: '#54A5C3'
			},
			panel: {
				position: 'absolute',
				width: '90%',
				height: '90%',
				margin: '5%'
			}
		}

    return (
      <div id="real-container">

	      <nav className="main-nav">
	        <div className="topbar mui--appbar-height">
	          <label className="appbar-action mui--appbar-height mui--appbar-line-height mui--pull-left" htmlFor="main-menu-check" onClick={resetMenu.bind(this)}>
	            <i className="fa fa-bars"></i>
	          </label>
	          <h2 className="mui--appbar-height mui--appbar-line-height mui--text-left">Logo</h2>
	        </div>

	      </nav>

	      <div className="main-content" id="main-content" style={style.contentBackground}>
	        <div className="content-background">

	        	<MainMenu resetMenu={resetMenu.bind(this)} />

	        	<div className="mui-panel" style={style.panel}>
						  
						</div>

	        </div>
	      </div>

      </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Stage06;