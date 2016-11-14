'use strict';
exports.__esModule = true;

var React = global.React;

var Paragraph = React.createClass({

	render() {

		var className = '';
		if (this.props.align) { className += 'mui--text-' + this.props.align; }
		if (this.props.customClass) { className += ' '+this.props.customClass; }

		return (
			<p className={className} style={this.props.style || null}>{this.props.text || this.props.children}</p>
		)

	}

})

var centerVerticalElement = function(el) {
	var cont = document.getElementById('main-content');
	setTimeout(function() {
		var elBox = el.getBoundingClientRect();
		var contBox = cont.getBoundingClientRect();
		var top = elBox.top + elBox.height - (contBox.height / 2) + cont.scrollTop;
		cont.scrollTop = top;		
	}, 50);
}

var FieldInput = React.createClass({

	refInput: Math.random().toString(36).substring(7),

	getInitialState() {
		var st = this.props.msg || {
			status: 'info',
			info: '',
			error: '',
			success: ''
		}
		return st;
	},

	getValue() {
		return this.refs[this.refInput].value;
	},

	setValue(v) {
		if (v) { this.refs[this.refInput].value = v; }
	},

	focus() {
		this.refs[this.refInput].focus();
		centerVerticalElement(this.refs[this.refInput]);
	},

	isValid() {
		if (typeof this.props.validation == 'function') {
			return this.props.validation(this.getValue());
		} else {
			return true;
		}
	},

	render() {

		var inputProps = this.props.input || { type: 'text' }
		var style = {};

		if (this.props.msg != false) {
			style.paddingBottom = '15px'
		}

		return(

      <div className={'mui-textfield mui-textfield--float-label ' + this.state.status} style={style}>
        <input ref={this.refInput} {...inputProps} onChange={this.props.handleChange || null} />
        <label>{this.props.label || 'Field'}</label>
        <span className="info">{this.state.info}</span>
        <span className="error">{this.state.error}</span>
        <span className="success">{this.state.success}</span>
      </div>

		)
	}

})

var FieldPassword = React.createClass({

	refInput: Math.random().toString(36).substring(7),

	getInitialState() {
		var st = this.props.msg || {
			status: 'info',
			hide: true,
			info: '',
			error: '',
			success: ''
		}
		return st;
	},

	getValue() {
		return this.refs[this.refInput].value;
	},

	setValue(v) {
		this.refs[this.refInput].value = v;
	},

	focus() {
		this.refs[this.refInput].focus();
		centerVerticalElement(this.refs[this.refInput]);
	},

	handleChange(e) {
		var dest_ref = (this.state.hide) ? this.refInput : 'ghost';
		this.refs[dest_ref].value = e.target.value;
		if (this.props.handleChange) { this.props.handleChange() }
	},

	isValid() {
		if (typeof this.props.validation == 'function') {
			return this.props.validation(this.getValue());
		} else {
			return true;
		}
	},

	toggleChange() {
		var self = this;
		self.setState({
			hide: !self.state.hide
		});
		setTimeout(function() {
			var dest_ref = (!self.state.hide) ? self.refInput : 'ghost';
			self.refs[dest_ref].focus();
		},100);
	},

	render() {

		var inputProps = this.props.input || { type: 'text' }
		var style = {};

		if (this.props.msg != false) {
			style.paddingBottom = '15px'
		}

		var classname = 'mui-textfield password mui-textfield--float-label ' + this.state.status;
		if (!this.state.hide) { classname += ' showPassword' }
		var iClass = (!this.state.hide) ? 'fa fa-eye' : 'fa fa-eye-slash';

		return(

      <div className={classname} style={style}>
        <input className="ghost" type="password" ref="ghost" onKeyUp={this.handleChange} onKeyDown={this.handleChange} />
      	<i className={iClass} onClick={this.toggleChange} />
        <input className="real" id="inputReal" ref={this.refInput} type="text" onKeyUp={this.handleChange} onKeyDown={this.handleChange} />
        <label>{this.props.label}</label>
        <span className="info">{this.state.info}</span>
        <span className="error">{this.state.error}</span>
        <span className="success">{this.state.success}</span>
      </div>

		)
	}

})

var CheckboxInput = React.createClass({

	refInput: Math.random().toString(36).substring(7),

	getInitialState() {
		return {
			checked: this.props.checked || false
		}
	},

	componentDidMount() {
		this.refInput = Math.random().toString(36).substring(7);
	},

  toggleChange: function() {
    this.setState({
      checked: !this.state.checked
    }, function() {
    	if (typeof this.props.handleChange == 'function') {
    		this.props.handleChange(this.state.checked);
    	}
    }.bind(this));
  },

  getValue() {
  	return this.state.checked
  },

	render() {

		return (

      <div className="mui-checkbox">
        <input id={"id_"+this.refInput} ref={this.refInput} type="checkbox" value="1" checked={this.state.checked} />
        <label htmlFor={"id_"+this.refInput} onClick={this.toggleChange}>

          <svg width="18px" height="18px" viewBox="0 0 18 18">
            <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <rect className="rect" stroke="#000" x="1" y="1" width="16" height="16" rx="3"></rect>
              <path className="check" fill="#000" d="M13.2174912,5.16790677 C13.0797465,5.02576416 12.912278,4.95473958 12.7154482,4.95473958 C12.5185277,4.95473958 12.3510593,5.02576416 12.2133146,5.16790677 L7.36995945,10.17028 L5.19930334,7.92412768 C5.06146808,7.78198507 4.89409023,7.71096049 4.69726039,7.71096049 C4.50033993,7.71096049 4.33296207,7.78198507 4.19512682,7.92412768 L3.19104091,8.95959127 C3.05320565,9.10173388 2.98433333,9.2743423 2.98433333,9.47741652 C2.98433333,9.68039729 3.05320565,9.85309916 3.19104091,9.99514831 L5.86373997,12.7513692 L6.8679165,13.7868328 C7.00566114,13.9289754 7.17303899,14 7.36995945,14 C7.56678929,14 7.73416715,13.928882 7.8720024,13.7868328 L8.87617893,12.7513692 L14.2215771,7.23892741 C14.3593217,7.0967848 14.4282846,6.92417638 14.4282846,6.72110216 C14.4283753,6.51812139 14.3593217,6.34551297 14.2215771,6.20337036 L13.2174912,5.16790677 Z"></path>
            </g>
          </svg>

          <span>{this.props.label}</span>
        </label>
        <span className="error">You must accept these terms</span>
      </div>

		)

	}

})

var FieldSelect = React.createClass({

	refInput: Math.random().toString(36).substring(7),

	getInitialState() {
		var st = this.props.msg || {
			status: 'info',
			info: '',
			error: '',
			success: ''
		}
		return st;
	},

	getValue() {
		return this.refs[this.refInput].value;
	},

	setValue(v) {
		if (v) { this.refs[this.refInput].value = v; }
	},

	focus() {
		this.refs[this.refInput].focus();
		centerVerticalElement(this.refs[this.refInput]);
	},

	isValid() {
		if (typeof this.props.validation == 'function') {
			return this.props.validation(this.getValue());
		} else {
			return true;
		}
	},

	render() {

		var style = {};

		if (this.props.msg != false) {
			style.paddingBottom = '15px'
		}

		var generateOption = function(data,index) {
			var opts = {
				key: Math.random().toString(36).substring(7)
			};

			if (data.value) { opts.value = data.value }

			return <option {...opts}>{data.text}</option>
		}

		return(

      <div className={'mui-select ' + this.state.status} style={style}>
        <label>{this.props.label || 'Field'}</label>
        <select ref={this.refInput} onChange={this.props.handleChange || null}>
        	{this.props.options.map( (op,i) => generateOption(op,i) )}
        </select>
        <span className="info">{this.state.info}</span>
        <span className="error">{this.state.error}</span>
        <span className="success">{this.state.success}</span>
      </div>

		)
	}

})

var Divider = React.createClass({

  render: function () {

  	var cls = (this.props.text) ? 'divider with-text' : 'divider';

    return (
				<div className={cls}>{this.props.text}</div>
	  )
  }
  
});


var ListButton = React.createClass({

	render() {

		var icon = null;
		if (this.props.icon) {
			icon = <span className="icon"><i className={"fa "+this.props.icon}></i></span>;
		}

		var className = 'listButton';
		if (this.props.addClass) { className += ' '+this.props.addClass; }

		return (

			<button className={className} onClick={this.props.onClick || null} value={this.props.value || null}>
				<span className="content">
					{icon}
					{this.props.children}
				</span>
				<i className="fa fa-angle-right"></i>
			</button>

		)
	}

})


exports.FieldInput = FieldInput;
exports.FieldPassword = FieldPassword;
exports.FieldSelect = FieldSelect;
exports.CheckboxInput = CheckboxInput;
exports.Paragraph = Paragraph;
exports.Divider = Divider;
exports.ListButton = ListButton;

module.exports = {
	FieldInput: FieldInput,
	FieldPassword: FieldPassword,
	FieldSelect: FieldSelect,
	CheckboxInput: CheckboxInput,
	Paragraph: Paragraph,
	Divider: Divider,
	ListButton: ListButton
};