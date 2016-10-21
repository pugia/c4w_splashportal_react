var React = global.React;
var MainNav = React.createFactory(require('./MainNav'));
var BottomBar = React.createFactory(require('./BottomBar'));
var Divider = React.createFactory(require('./Divider'));
var ActionBlock = React.createFactory(require('./ActionBlock'));

var Main = React.createClass({

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
				background: 'url(/img/cloud@2x.png) repeat-x top left / 391px 97px',
				paddingTop: '100px'
			}
		}

    return (
      <div id="real-container">
        <MainNav title="Welcome" leftButtonIconType="fa" leftButtonIcon="fa-arrow-left"></MainNav>
				<div className="main-content" id="main-content">
					<div className="content-background" style={style.contentBackground}>

	          <div className="mui-container">
	            <p className="mui--text-center">Welcome on board!</p>
	            <p className="mui--text-center">get your free wifi</p>
	          </div>

	          <div className="social">
	            <p className="mui--text-center">use your social account</p>

	            <div className="social-login">
	              <button className="mui-btn social-facebook"><i className="fa fa-facebook"></i></button>
	              <button className="mui-btn social-twitter"><i className="fa fa-twitter"></i></button>
	              <button className="mui-btn social-linkedin"><i className="fa fa-linkedin"></i></button>
	            </div>
	          </div>

						<Divider text="or" />

	          <form className="mui-container">
	            <div className="mui-textfield mui-textfield--float-label">
	              <input type="text" />
	              <label>Email address</label>
	              <span>We will use it to send you the confirmation email</span>
	            </div>
	          </form>

	          <Divider />

	          <div className="accordion">

	            <div className="section">
	              <input type="checkbox" id="accordion1_a1" />
	              <label className="accordion-title" htmlFor="accordion1_a1">
	                <span className="icon-left"><i className="fa fa-unlock-alt" aria-hidden="true"></i></span>
	                <span className="icon-open-close"><i className="fa fa-chevron-down" aria-hidden="true"></i></span>
	                <span className="title">Access data</span>
	              </label>
	              <div className="accordion-content">
	              
	                <form>
	                  <div className="mui-textfield mui-textfield--float-label">
	                    <input type="text" />
	                    <label>Email address</label>
	                    <span>We will use it to send you the confirmation email</span>
	                  </div>
	                </form>

	              </div>
	            </div>
	            <div className="section">
	              <input type="checkbox" id="accordion1_a2" />
	              <label className="accordion-title error" htmlFor="accordion1_a2">
	                <span className="icon-left">
	                  <svg width="12px" height="12px" viewBox="0 0 16 16">
	                    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
	                      <g transform="translate(-21.000000, -176.000000)" fill="#4D8185">
	                        <g transform="translate(0.000000, 165.000000)">
	                          <path d="M36.2727273,13.1818182 L36.2727273,12.8181818 C36.2727273,11.8145455 35.4581818,11 34.4545455,11 C33.4509091,11 32.6363636,11.8145455 32.6363636,12.8181818 L32.6363636,13.1818182 C32.2363636,13.1818182 31.9090909,13.5090909 31.9090909,13.9090909 L31.9090909,16.8181818 C31.9090909,17.2181818 32.2363636,17.5454545 32.6363636,17.5454545 L36.2727273,17.5454545 C36.6727273,17.5454545 37,17.2181818 37,16.8181818 L37,13.9090909 C37,13.5090909 36.6727273,13.1818182 36.2727273,13.1818182 L36.2727273,13.1818182 Z M35.6909091,13.1818182 L33.2181818,13.1818182 L33.2181818,12.8181818 C33.2181818,12.1345455 33.7709091,11.5818182 34.4545455,11.5818182 C35.1381818,11.5818182 35.6909091,12.1345455 35.6909091,12.8181818 L35.6909091,13.1818182 L35.6909091,13.1818182 Z M34.0327273,19 C34.0618182,19.24 34.0909091,19.48 34.0909091,19.7272727 C34.0909091,21.24 33.5090909,22.6145455 32.5636364,23.6472727 C32.3745455,23.0581818 31.8363636,22.6363636 31.1818182,22.6363636 L30.4545455,22.6363636 L30.4545455,20.4545455 C30.4545455,20.0545455 30.1272727,19.7272727 29.7272727,19.7272727 L25.3636364,19.7272727 L25.3636364,18.2727273 L26.8181818,18.2727273 C27.2181818,18.2727273 27.5454545,17.9454545 27.5454545,17.5454545 L27.5454545,16.0909091 L29,16.0909091 C29.8,16.0909091 30.4545455,15.4363636 30.4545455,14.6363636 L30.4545455,12.7890909 C29.7636364,12.5709091 29.0363636,12.4545455 28.2727273,12.4545455 C24.2581818,12.4545455 21,15.7127273 21,19.7272727 C21,23.7418182 24.2581818,27 28.2727273,27 C32.2872727,27 35.5454545,23.7418182 35.5454545,19.7272727 C35.5454545,19.48 35.5309091,19.24 35.5090909,19 L34.0327273,19 L34.0327273,19 Z M27.5454545,25.4945455 C24.6727273,25.1381818 22.4545455,22.6945455 22.4545455,19.7272727 C22.4545455,19.2763636 22.5127273,18.8472727 22.6072727,18.4254545 L26.0909091,21.9090909 L26.0909091,22.6363636 C26.0909091,23.4363636 26.7454545,24.0909091 27.5454545,24.0909091 L27.5454545,25.4945455 L27.5454545,25.4945455 Z" id="Shape"></path>
	                        </g>
	                      </g>
	                    </g>
	                  </svg>                
	                </span>
	                <span className="icon-open-close"><i className="fa fa-chevron-down" aria-hidden="true"></i></span>
	                <span className="title">Terms and condition</span>
	              </label>
	              <div className="accordion-content">
	              
	                <form>
	                  <div className="mui-checkbox error">
	                    <input id="checkbox_1" type="checkbox" value="1" />
	                    <label htmlFor="checkbox_1">

	                      <svg width="18px" height="18px" viewBox="0 0 18 18">
	                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
	                          <rect className="rect" stroke="#0075AA" x="1" y="1" width="16" height="16" rx="3"></rect>
	                          <path className="check" fill="#0075AA" d="M13.2174912,5.16790677 C13.0797465,5.02576416 12.912278,4.95473958 12.7154482,4.95473958 C12.5185277,4.95473958 12.3510593,5.02576416 12.2133146,5.16790677 L7.36995945,10.17028 L5.19930334,7.92412768 C5.06146808,7.78198507 4.89409023,7.71096049 4.69726039,7.71096049 C4.50033993,7.71096049 4.33296207,7.78198507 4.19512682,7.92412768 L3.19104091,8.95959127 C3.05320565,9.10173388 2.98433333,9.2743423 2.98433333,9.47741652 C2.98433333,9.68039729 3.05320565,9.85309916 3.19104091,9.99514831 L5.86373997,12.7513692 L6.8679165,13.7868328 C7.00566114,13.9289754 7.17303899,14 7.36995945,14 C7.56678929,14 7.73416715,13.928882 7.8720024,13.7868328 L8.87617893,12.7513692 L14.2215771,7.23892741 C14.3593217,7.0967848 14.4282846,6.92417638 14.4282846,6.72110216 C14.4283753,6.51812139 14.3593217,6.34551297 14.2215771,6.20337036 L13.2174912,5.16790677 Z"></path>
	                        </g>
	                      </svg>

	                      <span>Accept the <a href="#">Terms of service</a> and <a href="#">Privacy policy</a></span>
	                    </label>
	                    <span>You must accept these terms</span>
	                  </div>

	                  <div className="mui-checkbox">
	                    <input id="checkbox_2" type="checkbox" value="1" />
	                    <label htmlFor="checkbox_2">

	                      <svg width="18px" height="18px" viewBox="0 0 18 18">
	                        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
	                          <rect className="rect" stroke="#0075AA" x="1" y="1" width="16" height="16" rx="3"></rect>
	                          <path className="check" fill="#0075AA" d="M13.2174912,5.16790677 C13.0797465,5.02576416 12.912278,4.95473958 12.7154482,4.95473958 C12.5185277,4.95473958 12.3510593,5.02576416 12.2133146,5.16790677 L7.36995945,10.17028 L5.19930334,7.92412768 C5.06146808,7.78198507 4.89409023,7.71096049 4.69726039,7.71096049 C4.50033993,7.71096049 4.33296207,7.78198507 4.19512682,7.92412768 L3.19104091,8.95959127 C3.05320565,9.10173388 2.98433333,9.2743423 2.98433333,9.47741652 C2.98433333,9.68039729 3.05320565,9.85309916 3.19104091,9.99514831 L5.86373997,12.7513692 L6.8679165,13.7868328 C7.00566114,13.9289754 7.17303899,14 7.36995945,14 C7.56678929,14 7.73416715,13.928882 7.8720024,13.7868328 L8.87617893,12.7513692 L14.2215771,7.23892741 C14.3593217,7.0967848 14.4282846,6.92417638 14.4282846,6.72110216 C14.4283753,6.51812139 14.3593217,6.34551297 14.2215771,6.20337036 L13.2174912,5.16790677 Z"></path>
	                        </g>
	                      </svg>

	                      <span>Accept the <a href="#">Marketing policies</a> <span className="label label-black">optional</span></span>
	                    </label>
	                  </div>

	                </form>         

	              </div>
	            </div>
	            <div className="section">
	              <input type="checkbox" id="accordion1_a3" />
	              <label className="accordion-title success" htmlFor="accordion1_a3">
	                <span className="icon-left"><i className="fa fa-unlock-alt" aria-hidden="true"></i></span>
	                <span className="icon-open-close"><i className="fa fa-chevron-down" aria-hidden="true"></i></span>
	                <span className="title">Error</span>
	              </label>
	              <div className="accordion-content">
	              content2
	              </div>
	            </div>
	          </div>	          

	          <Divider />

	          <ActionBlock />

					</div>
				</div>          
        <BottomBar></BottomBar>
      </div>
    )
  }

});

/* Module.exports instead of normal dom mounting */
module.exports = Main;