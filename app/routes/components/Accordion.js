'use strict';
exports.__esModule = true;

var React = global.React;

var Accordion = React.createClass({

	render() {

		return (

      <div className="accordion">
      	{this.props.children}
      </div>

		)
	}

})

var AccordionSection = React.createClass({

	getInitialState() {
		return {
			open: true,
			status: 'info'
		}
	},

	componentDidUpdate(prevProps, prevState) {
		this.refs.header.setState({
			open: this.state.open,
			status: this.state.status
		})
	},

	openCloseHandler() {
		this.setState({
			open: !this.state.open
		})
	},

	render() {

		var className = "section "+ (this.state.open ? 'open' : 'close');

		return (

        <div className={className}>
        	<AccordionHeader ref="header" title={this.props.title} open={this.state.open} status={this.state.status} openCloseHandler={this.openCloseHandler} iconLeft={this.props.iconLeft || null} />
        	<AccordionContent ref="content">
        		{this.props.children}
        	</AccordionContent>
        </div>

		)

	}

})

var AccordionHeader = React.createClass({

	getInitialState() {
		return {
			open: this.props.open,
			status: this.props.status
		}
	},

	render() {

		var iconClass = (this.state.open) ? "fa fa-minus" : "fa fa-plus";
		var iconLeft = (this.props.iconLeft) ? <i className={this.props.iconLeft} /> : null;

		return (

      <label className={"accordion-title " + this.state.status} onClick={this.props.openCloseHandler}>
        <span className="icon-left">{iconLeft}</span>
        <span className="icon-open-close"><i className={iconClass} aria-hidden="true"></i></span>
        <span className="title">{this.props.title}</span>
      </label>

		)
	}

})

var AccordionContent = React.createClass({

	componentDidMount() {
		this.refs.contentDiv.style.height = this.refs.contentDiv.clientHeight + 'px';
	},

	getHeight() {
		return this.refs.contentDiv.clientHeight
	},

	render() {

		return (

      <div ref="contentDiv" className="accordion-content">
      	{this.props.children}
      </div>

		)
	}

})


exports.Main = Accordion;
exports.Section = AccordionSection;

module.exports = {
	Main: Accordion,
	Section: AccordionSection
};