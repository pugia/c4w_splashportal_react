var React = global.React;
var MainNav = React.createFactory(require('./MainNav'));
var Divider = React.createFactory(require('./Divider'));
var BottomBarButton = React.createFactory(require('./BottomBarButton'));

var checkMailBlur = function() {

	var r = false;
	var email_field = this.refs.email_field;
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  
  if (email_field.value != '') {

	  if (!re.test(email_field.value)) {
	  	email_field.parentNode.classList.add('error');
	  	email_field.parentNode.classList.remove('success');
	  } else {
	  	email_field.parentNode.classList.add('success');
	  	email_field.parentNode.classList.remove('error');
	  	r = true;
	  }
	
	} else {
	  	email_field.parentNode.classList.remove('success');
	  	email_field.parentNode.classList.remove('error');
	}

	email_field.parentNode.classList.toggle('mui--is-not-empty', email_field.value != '');
	email_field.parentNode.classList.toggle('mui--is-empty', email_field.value == '');

	return r;

}

var inputClassChange = function(field) {

	var field = $('input[name="'+field+'"]');
	field.parent('.mui-textfield').toggleClass('mui--is-not-empty', field.val() != '');
	field.parent('.mui-textfield').toggleClass('mui--is-empty', field.val() == '');

}

var nextStage = function() {

	var r = false;
	var email_field = this.refs.email_field;
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email_field.value != '' && re.test(email_field.value)) {
  	$('#main').data('stored_data', JSON.stringify({
  		email: email_field.value
  	}));
  	window.location.href = '/#/stage02'
	} else {
		this.refs.email_field.parentNode.className += ' error';
		this.refs.email_field.focus();
	}

	return false;

}

var socialClick = function(social) {

  	window.location.href = '/#/stage02'

}

var Stage01 = React.createClass({

	componentDidMount() {

		localStorage.removeItem('stored_date');
		localStorage.removeItem('login_time');

  },

  render: function () {

		var style = {
			contentBackground: {
				background: 'url(/img/cloud@2x.png) repeat-x top left / 391px 97px',
				paddingTop: '100px'
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
			social: {
				marginTop: '30px'
			},
			form: {
				paddingBottom: '60px'
			}
		}

    return (
      <div id="real-container">

	      <nav className="main-nav">
	        <div className="topbar mui--appbar-height">
	          <a href="/#" className="appbar-action mui--appbar-height mui--appbar-line-height mui--pull-left">
	            <img src="/img/arrow-back.svg" />
	          </a>
	          <h2 className="mui--appbar-height mui--appbar-line-height mui--text-center">Wifi account</h2>
	        </div>
	      </nav>

	      <div className="main-content" id="main-content">
	        <div className="content-background" style={style.contentBackground}>

	          <div className="mui-container">
	            <p className="mui--text-center" style={style.title}>Welcome on board!</p>
	            <p className="mui--text-center" style={style.subTitle}>get your free wifi</p>
	          </div>

	          <div className="social" style={style.social}>
	            <p className="mui--text-center" style={style.socialTitle}>use your social account</p>

	            <div className="social-login">
	              <button className="mui-btn social-facebook" onClick={socialClick.bind(this)}><i className="fa fa-facebook"></i></button>
	              <button className="mui-btn social-twitter" onClick={socialClick.bind(this)}><i className="fa fa-twitter"></i></button>
	              <button className="mui-btn social-linkedin" onClick={socialClick.bind(this)}><i className="fa fa-linkedin"></i></button>
	            </div>
	          </div>

						<Divider text="or" />

	          <form className="mui-container" style={style.form} onSubmit={nextStage.bind(this)}>
		          <p className="mui--text-center" style={style.socialTitle}>go online with your email</p>
	            <div className="mui-textfield mui-textfield--float-label">
	              <input type="text" name="email_field" ref="email_field" onBlur={checkMailBlur.bind(this)} onKeyUp={inputClassChange.bind(this,'email_field')} onChange={inputClassChange.bind(this,'email_field')} />
	              <label>Email address</label>
	              <span className="info">We will use it to send you the confirmation email</span>
	              <span className="error">Incorrect format</span>
	              <span className="success">Well done! Tape on next to go online!</span>
	            </div>
	          </form>

	        </div>
	      </div>

				<div className="bottombar">

	        <BottomBarButton background="0075aa" iconRight="fa-chevron-right" iconRightType="fa" text="NEXT" onClick={nextStage.bind(this)}></BottomBarButton>

				</div>

      </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Stage01;