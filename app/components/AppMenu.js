var React = global.React;

var AppMenu = React.createClass({

  render: function () {

    return (
      <div className="app-menu" ref="appMenu">

        <span className="icon-open-close">
          <i className="fa fa-chevron-up" aria-hidden="true"></i>
        </span>

        <div className="list">

          <h3>APPS</h3>

          <ul>

            {this.props.list.map(function(a) {
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






