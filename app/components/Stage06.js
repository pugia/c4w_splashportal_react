var React = global.React;
var MainNav = React.createFactory(require('./MainNav'));
var Divider = React.createFactory(require('./Divider'));
var MainMenu = React.createFactory(require('./MainMenu'));
var AppMenu = React.createFactory(require('./AppMenu'));

var resetMenu = function() {
	var im = Array.prototype.slice.call(document.querySelectorAll('.main-menu input.menu'));
	im.forEach(function(a) { a.checked = false;	})
}

var Stage06 = React.createClass({

  render: function () {

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

	        	<AppMenu />

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