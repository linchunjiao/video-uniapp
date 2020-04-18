import common from 'common/common.js'
let serverUrl = common.serverUrl;
export function getMovieList (keywords="", page="", pageSize=""){
	return uni.request({
		url: serverUrl + '/search/list?keywords=' + keywords + '&page='+ page + '&pageSize='+ pageSize,
		method: "POST",
		data: {
			qq: '503766166'
		},
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
	});
}