var React = global.React;
var MainNav = React.createFactory(require('./MainNav'));
var Divider = React.createFactory(require('./Divider'));
var MainMenu = React.createFactory(require('./MainMenu'));

var resetMenu = function() {
	var im = Array.prototype.slice.call(document.querySelectorAll('.main-menu input.menu'));
	im.forEach(function(a) { a.checked = false;	})
}

var Showcase = React.createClass({

	componentDidMount: function () {

    let m = document.getElementById("main");
    let r = document.getElementById("real-container");
    let c = r.childNodes;
    var h = m.offsetHeight;

    for (var x in c) { h -= (c[x].nodeType == '1' && c[x].id != 'main-content') ? c[x].offsetHeight : 0; }

    document.getElementById("main-content").style.height = h+'px';

	},

  render: function () {

		var style = {
			contentBackground: {
				background: 'url(/img/Showcase@2x.png) no-repeat center center / cover'
			},
			title: {
				fontFamily: 'Roboto',
				fontSize: '35px',
				color: '#63747F',
				marginBottom: '0'
			},
			subTitle: {
				fontFamily: 'Roboto',
				fontSize: '16px',
				color: '#0075AA',
				textTransform: 'uppercase',
				marginBottom: '20px'
			},
			socialTitle: {
				fontFamily: 'Roboto',
				fontSize: '12px',
				color: 'rgba(0,0,0,0.87)',
				textTransform: 'uppercase',
				fontWeight: '500'
			},
			bottom: {
				p1: {
					marginBottom: '34px'
				},
				p2: {
					color: '#fff',
					fontSize: '11px',
					marginBottom: '12px'
				}
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

	          <div className="bottom">

	            <p style={style.bottom.p1}>
	            	<a className="mui-btn mui-btn--black" href="/#/stage01">GO ONLINE</a>
	            </p>
	            <p style={style.bottom.p2}>EXPLORE MORE</p>

	            <p><button className="mui-btn mui-btn--more"><i className="fa fa-chevron-down" aria-hidden="true"></i></button></p>

	          </div>

	        </div>
	      </div>

      </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Showcase;