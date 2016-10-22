var React = global.React;
var MainNav = React.createFactory(require('./MainNav'));
var Divider = React.createFactory(require('./Divider'));
var BottomBarButton = React.createFactory(require('./BottomBarButton'));

var timer = null;

var goNext = function() {
	clearTimeout(timer);
	window.location.href = '/#/stage06';
}

var Stage04 = React.createClass({

	getInitialState() {

		var st = {
			email: localStorage.getItem('email')
		}

		return st;

	},

	componentDidMount: function() {

    let m = document.getElementById("main");
    let c = document.getElementById("real-container").childNodes;
    var h = m.offsetHeight;
    for (var x in c) { h -= (c[x].nodeType == '1' && c[x].id != 'main-content') ? c[x].offsetHeight : 0; }
    document.getElementById("main-content").style.height = h+'px';

		timer = setTimeout(function() {
			window.location.href = '/#/stage06';
		}, 3000);

	},

  render: function () {

		var style = {
			contentBackground: {
				background: 'url(/img/cloud@2x.png) repeat-x top left / 391px 97px',
				paddingTop: '100px'
			}
		}

    return (
      <div id="real-container">

	      <nav className="main-nav">
	        <div className="topbar mui--appbar-height">
	          <h2 className="mui--appbar-height mui--appbar-line-height mui--text-center">Wifi account</h2>
	        </div>
	      </nav>

	      <div className="main-content" id="main-content">
	        <div className="content-background" style={style.contentBackground}>


	          <div className="action-component">
	            <div className="validation-icon">
	              <i className="fa fa-check" aria-hidden="true"></i>
	            </div>

	            <div className="validation-detail">
	              <p>Thanks for confirming your email<br /><strong ref="email_value">{this.state.email}</strong></p>
	            </div>

	          </div>

	          <div className="suggestion">
	          	<p>You will be automatically redirect to our page in 3 seconds...<br />Enjoy our free Wi-Fi</p>
	          </div>


	        </div>
	      </div>

				<div className="bottombar">

	        <button className="mui-btn mui-btn--primary mui-btn--large mui-btn--0075aa mui-btn--double" onClick={goNext.bind(this)}>
	          <i className="fa fa-chevron-right mui--pull-right"></i>
	          <span><strong>I DON’T WANT TO WAIT FURTHER</strong><br />GO ONLINE</span>
	        </button>

				</div>

      </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Stage04;
