import common from 'common/common.js'
let serverUrl = common.serverUrl;
export function getHomeSwiper (){
	return uni.request({
		url: serverUrl + '/index/carousel/list', 
		method: "POST",
		data: {
			qq: '503766166'
		},
		header: {
			'content-type': 'application/x-www-form-urlencoded' //自定义请求头信息
		},
		
	});
}
export function getHomeRecommon (){
	return uni.request({
		url: serverUrl + '/index/movie/hot?type=trailer', 
		method: "POST",
		data: {
			qq: '503766166'
		},
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
		
	});
}
export function getHomeHot (){
	return uni.request({
		url: serverUrl + '/index/movie/hot?type=trailer', 
		method: "POST",
		data: {
			qq: '503766166'
		},
		header: {
			'content-type': 'application/x-www-form-urlencoded' 
		},
		
	});
}
export function getLikeList (){
	return uni.request({
		url: serverUrl + '/index/guessULike', 
		method: "POST",
		data: {
			qq: '503766166'
		},
		header: {
			'content-type': 'application/x-www-form-urlencoded'
		},
	});
}