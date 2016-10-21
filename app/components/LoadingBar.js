var React = global.React;

var LoadingBar = React.createClass({

  getInitialState: function() {
    return { completed: 0 };
  },

  /*changes state*/
  handleCompleted: function (value) {

    var completed = value;
    if (completed === NaN || completed < 0) { completed = 0 };
    if (completed > 100) {completed = 100};

    this.setState({ completed: completed });

  },

  updateBar: function() {
    this.refs.lbarBar.style.width = this.state.completed + '%';
  },

  /*lifecycle methods*/
  componentDidMount: function () { 
    this.updateBar()
  },
  componentDidUpdate: function () { 
    this.updateBar()
  },

  render: function () {

    const style = {
      transition: "width 200ms"
		};

    return (
				<div className="loading-bar with-appbar-top">
					<span className="bar" ref="lbarBar" style={style}></span>
				</div>
	  )
  }
  
});

/* Module.exports instead of normal dom mounting */
module.exports = LoadingBar;
