var Router = require('react-router').Router
var Route = require('react-router').Route
var browserHistory = require('react-router').browserHistory
var IndexRoute = require('react-router').IndexRoute

var Showcase = require('./components/Showcase');
var Stage01 = require('./components/Stage01');
var Stage02 = require('./components/Stage02');
var Stage03 = require('./components/Stage03');
var Stage04 = require('./components/Stage04');
var Stage06 = require('./components/Stage06');

const App = React.createClass({
  getInitialState() {
    return {
      route: window.location.hash.substr(1)
    }
  },

  componentDidMount() {
    window.addEventListener('hashchange', () => {
      this.setState({
        route: window.location.hash.substr(1)
      })
    })
  },

  render() {
    let Child
    switch (this.state.route) {
      case '/stage01': 	Child = Stage01; break;
      case '/stage02': 	Child = Stage02; break;
      case '/stage03': 	Child = Stage03; break;
      case '/stage04': 	Child = Stage04; break;
      case '/stage06': 	Child = Stage06; break;
      default:      		Child = Showcase;
    }

    return (
      <div>
        <Child />
      </div>
    )
  }
})

ReactDOM.render((
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="stage01" component={Stage01} />
      <Route path="stage02" component={Stage02} />
      <Route path="stage03" component={Stage03} />
      <Route path="stage04" component={Stage04} />
      <Route path="stage06" component={Stage06} />
    </Route>
  </Router>
), document.getElementById('main') )