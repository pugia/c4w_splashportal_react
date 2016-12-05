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
			list: ['facebook1','twitter','google-plus']
		},
		account: {
			access: [
				{
					type: 'email',
					label: 'E-mail address',
					validation: 'var re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/; return re.test(v)'
				},
				{
					type: 'password',
					label: 'Password',
					validation: 'return v.length >= 5'
				}
			],
			custom: [
				{
					type: 'text',
					label: 'First name',
					validation: 'return v.length > 0'
				},
				{
					type: 'text',
					label: 'Last name',
					validation: 'return v.length > 0'
				},
				{
					type: 'date',
					label: 'Birthday',
      		validation: 'var re = /^\\d{1,2}\\/\\d{1,2}\\/\\d{4}$/;	return re.test(v)'
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
	},

	Apps: {
		weather: {
			icon: '/img/apps/weather@2x.png',
			title: 'Weather',
			subtitle: 'Check the weather around of you'
		},
		info: {
			icon: '/img/apps/info@2x.png',
			title: 'Info',
			subtitle: 'Information about us'
		},
		nearby: {
			icon: '/img/apps/nearby@2x.png',
			title: 'Nearby',
			subtitle: 'Check the POI around of you'
		},
		shop: {
			icon: '/img/apps/shop@2x.png',
			title: 'Shop',
			subtitle: 'Check the shops around of you'
		},
	}

};

exports.config = config;
module.exports = config;