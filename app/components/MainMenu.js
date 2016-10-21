var React = global.React;
var LoadingBar = require('./LoadingBar')

var closeMenu = function() {
	document.getElementById('main-menu-check').checked = false;
	document.getElementById("main-content").className = document.getElementById("main-content").className.replace(new RegExp('(?:^|\\s)'+ 'overlay' + '(?:\\s|$)'), ' ');
}

var showHideOverlay = function() {
	var show = document.getElementById('main-menu-check').checked;
	var mc = document.getElementById("main-content");
	mc.className = (show) ? mc.className + ' overlay' : mc.className.replace(new RegExp('(?:^|\\s)'+ 'overlay' + '(?:\\s|$)'), ' ');
}

var MainMenu = React.createClass({

  render: function () {

    return (
      <div className="main-menu">
        <input type="checkbox" id="main-menu-check" onChange={showHideOverlay.bind(this)} />
        <div className="menu">

          <ul>
            <li>
              <div>
                <label>About</label>
              </div>
            </li>
            <li>
              <div>
                <input className="menu" type="checkbox" id="i_lang" />
                <label htmlFor="i_lang">Languages<span className="icon-open-close"><i className="fa fa-chevron-down" aria-hidden="true"></i></span></label>
                <ul>
                  <li className="selected"><label>English</label></li>
                  <li><label>Italiano</label></li>
                </ul>
              </div>
            </li>
            <li>
              <div>
                <input className="menu" type="checkbox" id="i_app" />
                <label htmlFor="i_app">Apps<span className="icon-open-close"><i className="fa fa-chevron-down" aria-hidden="true"></i></span></label>
                <ul>
                  <li><label>Prima</label></li>
                  <li><label>Seconda</label></li>
                  <li><label>Terza</label></li>
                  <li><label>Quarta</label></li>
                  <li><label>Quinta</label></li>
                  <li><label>Sesta</label></li>
                </ul>
              </div>
            </li>
          </ul>

          <label htmlFor="main-menu-check" className="close" onClick={this.props.resetMenu.bind(this)}>
           <i className="fa fa-chevron-up" aria-hidden="true"></i>
          </label>

        </div>
        <div className="overlay" onClick={closeMenu.bind(this)}></div>
      </div>	  
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = MainMenu;






