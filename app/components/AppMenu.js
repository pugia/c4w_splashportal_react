var React = global.React;
var LoadingBar = require('./LoadingBar')

var openCloseAppMenu = function() {
  var show = this.refs.appMenu.className.indexOf('close') != -1;
  this.refs.appMenu.className = (show) ? this.refs.appMenu.className.replace(new RegExp('(?:^|\\s)'+ 'close' + '(?:\\s|$)'), ' ') : this.refs.appMenu.className + ' close';

  // document.getElementById('main-menu-check').checked = false;
	// document.getElementById("main-content").className = document.getElementById("main-content").className.replace(new RegExp('(?:^|\\s)'+ 'overlay' + '(?:\\s|$)'), ' ');
}

// var showHideOverlay = function() {
// 	var show = document.getElementById('main-menu-check').checked;
// 	var mc = document.getElementById("main-content");
// 	mc.className = (show) ? mc.className + ' overlay' : mc.className.replace(new RegExp('(?:^|\\s)'+ 'overlay' + '(?:\\s|$)'), ' ');
// }

var AppMenu = React.createClass({

  getInitialState() {
    return {
      apps: [
        {
          icon: 'wifi',
          title: 'Wifi Plans',
          desc: 'Choose your favourite Wi-Fi plan'
        },
        {
          icon: 'info',
          title: 'Info',
          desc: 'More info about us'
        },
        {
          icon: 'nearby',
          title: 'Nearby',
          desc: 'Find the store around you'
        },
        {
          icon: 'weather',
          title: 'The Weather',
          desc: 'Let\'s check the weather in all the world'
        }
      ]
    }

  },  

  render: function () {

    return (
          <div className="app-menu close" ref="appMenu">

            <span className="icon-open-close" onClick={openCloseAppMenu.bind(this)}>
              <i className="fa fa-chevron-up" aria-hidden="true"></i>
            </span>

            <div className="list">
  
              <h3>APPS</h3>
  
              <ul>

                {this.state.apps.map(function(a) {
                  var st = {
                    backgroundImage: 'url(/img/apps/'+ a.icon +'@2x.png'
                  }
                  return (
                    <li key={a.icon}>
                      <span className="icon" style={st}></span>
                      <h4>{a.title}</h4>
                      <p>{a.desc}</p>
                    </li>
                  )
                })}

              </ul>
            </div>

          </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = AppMenu;






