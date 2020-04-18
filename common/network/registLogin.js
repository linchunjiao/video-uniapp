import common from 'common/common.js'
let serverUrl = common.serverUrl;
export function getRegistLogin (username, password){
	return uni.request({
		url: serverUrl + '/user/registOrLogin',
		method: "POST",
		data: {
			qq: '503766166',
			"username": username,
			"password": password
		},
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
	});
}