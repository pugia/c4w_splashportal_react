'use strict';
exports.__esModule = true;

var React = global.React;

var AppMenu = React.createClass({

  getInitialState() {
    return {
      open: false
    }
  },

  openClose() {

    var self = this;

    this.setState({
      open: !this.state.open
    })

    if (this.state.open) {
      this.refs.appMenu.className = this.refs.appMenu.className + ' pre_close';
      setTimeout(function() {
        self.refs.appMenu.className = self.refs.appMenu.className.replace(new RegExp('(?:^|\\s)'+ 'pre_close' + '(?:\\s|$)'), '');
        self.refs.appMenu.className = self.refs.appMenu.className.replace(new RegExp('(?:^|\\s)'+ 'open' + '(?:\\s|$)'), '');
      }, 500);
    } else {
      this.refs.appMenu.className = this.refs.appMenu.className + ' pre_open';
      setTimeout(function() {
        self.refs.appMenu.className = self.refs.appMenu.className.replace(new RegExp('(?:^|\\s)'+ 'pre_open' + '(?:\\s|$)'), '');
        self.refs.appMenu.className = self.refs.appMenu.className + ' open';
      }, 500);
    }

  },

  render: function () {

    var clName = 'app-menu';
    var openCloseLabel = (this.state.open) ? 'Less' : 'More';

    return (
      <div className={clName} ref="appMenu">

        <span className="icon-open-close" onClick={this.openClose}>
          <i className="fa fa-ellipsis-h" aria-hidden="true"></i>
          <label>{openCloseLabel}</label>
        </span>

        <div className="list">

          <h3>APPS</h3>

          <ul ref="appList">

            {mapObject(this.props.list, (k,a) => {
              return (
                <li key={a.icon}>
                  <span className="icon">
                    <img src={a.icon} />
                  </span>
                  <h4>{a.title}</h4>
                  <p>{a.subtitle}</p>
                </li>
              )
            })}

          </ul>
        </div>

      </div>
    )
  }

});

function mapObject(object, callback) {
  return Object.keys(object).map(function (key) {
    return callback(key, object[key]);
  });
}

/* Module.exports instead of normal dom mounting */
exports.AppMenu = AppMenu;
module.exports = AppMenu;
