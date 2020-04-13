import common from 'common/common.js'
let serverUrl = common.serverUrl;
export function getRegistLogin (globalUser){
	return uni.request({
		url: serverUrl + '/user/logout?userId=' + globalUser.id,
		method: "POST",
		data: {
			qq: '38833964',
		},
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
	});
}