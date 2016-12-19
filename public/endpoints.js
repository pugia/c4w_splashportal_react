const production = true;
var hostName;
if (production) {
	hostName = '//apitest01.cloud4wi.com';
} else {
	hostName = '//api.local.cloud4wi.com:8080';
}
const endpoint_landing = hostName + '/api-splash/cfg/landing';
const endpoint_stage = hostName + '/api-splash/cfg/stage';
const endpoint_login = hostName + '/api-splash/action/login';
const endpoint_isLogged = hostName + '/api-splash/action/postLogged';
const endpoint_register = hostName + '/api-splash/action/registration';