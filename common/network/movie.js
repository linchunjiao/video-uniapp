import common from 'common/common.js'
let serverUrl = common.serverUrl;
export function getMovieDetail (trailerId){
	return uni.request({
		url: serverUrl + '/search/trailer/' + trailerId,
		method: "POST",
		data: {
			qq: '38833964'
		},
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
	});
}
export function getMovieActor (trailerId,num){
	return uni.request({
		url: serverUrl + '/search/staff/' + trailerId + "/" + num,
		method: "POST",
		data: {
			qq: '38833964'
		},
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
	});
}
