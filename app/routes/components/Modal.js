'use strict';
exports.__esModule = true;
var TopNav = require('./TopNav');

var React = global.React;

var Modal = React.createClass({

	getInitialState() {
		return {
			open: this.props.open || false
		}
	},

	open() {
		this.setState({
			open: true
		})
	},

	close() {
		this.setState({
			open: false,
			content: null
		})
	},

	setContent(data) {
		this.setState({
			content: data
		})
	},

	removeContent() {
		this.setState({
			content: null
		})
	},

	componentDidUpdate(prevProps, prevState) {
		this.refs.content.scrollTop = 0;
		if (this.state.open) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'auto';
		}
	},

	render() {

		var className = (this.state.open) ? 'modal open' : 'modal';

		var title = (this.props.title) ? <TopNav.Title text={this.props.title} /> : null;

		return (

			<div ref="modal" className={className}>

      	<TopNav.Bar>
      		<TopNav.Button side="left" onClick={this.close}>
      			<i className="fa fa-times"></i>
      		</TopNav.Button>
      		{title}
      	</TopNav.Bar>

      	<div ref="content" className="modal-content">
      		{this.state.content || this.props.children}
      	</div>

			</div>

		)

	}

})

exports.Modal = Modal;
module.exports = Modal;
