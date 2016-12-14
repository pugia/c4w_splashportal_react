var Landing = require('./routes/Landing');
var Success = require('./routes/Success');
var Cookies = require('js-cookie');


const App = React.createClass({
  getInitialState() {
    return {
      loading: true,
      logged: false
    }
  },

  componentDidMount() {

    var self = this;

    if (Cookies.get('doLogin')) {

      var location = JSON.parse(JSON.stringify(window.location));
      Cookies.set('location', location);

      var toSend = Cookies.getJSON('doLogin'); Cookies.remove('doLogin')
      toSend['ap_redirect'] = location.href;

      $.ajax({
        url: endpoint_login,
        type:'POST',
        cache: false,
        data: JSON.stringify(toSend),
        async:true,
        success: function(response) {

          Cookies.set('preLogin', response.session.preLogin );
          Cookies.set('logout', response.logout );

          setTimeout(() => {
            window.location.href = response.login.url;
          }, 200);

        },
        error: function(e) {

          console.log('url: '+endpoint_login);
          console.log('data: ' + JSON.stringify(toSend) );
          console.log('error: ' + JSON.stringify(e) );

          $('#error').addClass('open');
          console.log('error', e);

        }
      });

    } else {

      if (Cookies.get('preLogin') || Cookies.get('logout')) {

        $.ajax({
          url: endpoint_isLogged,
          type:'POST',
          cache: false,
          data: JSON.stringify(Cookies.getJSON('preLogin')),
          async:true,
          success: function(response) {

            if (response.loginStatus.isLogged === true && response.postAuth.msg == 'SUCCESS') {

              self.setState({
                loading: false,
                logged: true
              })

            } else {

              Cookies.set('login_error', response.postAuth.msg);
              Cookies.remove('preLogin');
              Cookies.remove('logout');

              setTimeout(() => {
                window.location.href = '/stage/#/01';            
              }, 200);

            }
            
          },
          error: function(e) {

            // Cookies.remove('preLogin');
            // Cookies.remove('logout');
            self.setState({
              loading: false,
              logged: false
            })

            $('#error').addClass('open');        
            console.log('error', e);
          }
        });

        
      } else {

        Cookies.remove('preLogin');
        Cookies.remove('logout');
        self.setState({
          loading: false,
          logged: false
        })

      }

    }

  },

  render() {
    let Child = null

    if (!this.state.loading) {
      Child = (this.state.logged) ? <Success /> : <Landing />;
    }

    return (
      <div>
        {Child}
      </div>
    )
  }
})



ReactDOM.render((
  <App />
), document.getElementById('main'));