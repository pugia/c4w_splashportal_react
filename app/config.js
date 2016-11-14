'use strict';
exports.__esModule = true;

var config = {

	TopNav: {
		menu: {
			myProfile: true,
			internetProfile: false,
			apps: true,
			logout: false
		},
		lang: {
			list: ['eng', 'ita'],
			current: 'eng'
		},
		logo: {
			type: 'img',
			value: '/img/volare_xp_white@2x.png',
			height: 30
		},
		height: 47,
		background: '#1E1E1E'
	},

	Content: {
		background: '/img/bkg@2x.jpg',
		slides: [
			{
				headline: 'Welcome to our new Portal'
			}
		],
		go_online_button: {
			background: '#00AB4A'
		}
	},

	Login: {
		order: ['social','account'],
		social: {
			list: ['facebook','twitter','google-plus']
		},
		account: {
			access: [
				{
					type: 'email',
					label: 'E-mail address',
					validation: (v) => {
					  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      			return re.test(v);
      		}
				},
				{
					type: 'password',
					label: 'Password',
					validation: (v) => {
						return v.length >= 5;
					}
				}
			],
			custom: [
				{
					type: 'text',
					label: 'First name',
					validation: (v) => {
						return v.length > 0;
					}
				},
				{
					type: 'text',
					label: 'Last name',
					validation: (v) => {
						return v.length > 0;
					}
				},
				{
					type: 'date',
					label: 'Birthday',
      		validation: (v) => {
      			var re = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
      			return re.test(v)
      		}			
				},
				{
					type: 'select',
					label: 'Gender',
					options: [
						{
							value: 'M',
							text: 'Male'
						},
						{
							value: 'F',
							text: 'Female'
						}
					]
				}
			]
		}
	}

};

exports.config = config;
module.exports = config;