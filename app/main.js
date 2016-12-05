var Router = require('react-router').Router
var Route = require('react-router').Route
var browserHistory = require('react-router').browserHistory
var IndexRoute = require('react-router').IndexRoute

var Landing = require('./routes/Landing');
var Stage01 = require('./routes/Stage01');
var Stage02 = require('./routes/Stage02');
var Stage03 = require('./routes/Stage03');
var Stage04 = require('./routes/Stage04');
var Success = require('./routes/Success');

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

    setTimeout(() => {
      document.getElementById('main').style.opacity = 1;
    }, 500);
    
  },

  render() {
    let Child
    switch (this.state.route) {
      case '/01': Child = Stage01; break;
      case '/02': Child = Stage02; break;
      case '/03': Child = Stage03; break;
      case '/04': Child = Stage04; break;
      case '/success': 	Child = Success; break;
      default: Child = Landing;
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
    <Route path="/stage/" component={App}>
      <Route path="01" component={Stage01} />
      <Route path="02" component={Stage02} />
      <Route path="03" component={Stage03} />
      <Route path="04" component={Stage04} />
      <Route path="success" component={Success} />
    </Route>
  </Router>
), document.getElementById('main') )