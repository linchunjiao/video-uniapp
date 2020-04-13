<template>
	<view class="page">
		<!-- 视频播放start -->
		<view class="player">
			<video
				id="myTrailer"
				:src="trailerInfo.trailer"
				:poster="trailerInfo.poster"
				class="movie"
				controls></video>
		</view>
		<!-- 视频播放end -->
		<!-- 影片基本信息start -->
		<view class="movie-info">
			<navigator :url="'../cover/cover?cover=' + trailerInfo.cover">
				<image :src="trailerInfo.cover" class="cover" mode="aspectFill"></image>
			</navigator>
			<view class="movie-desc">
				<view class="title">{{trailerInfo.name}}</view>
				<view class="basic-info">{{trailerInfo.basicInfo}}</view>
				<view class="basic-info">{{trailerInfo.originalName}}</view>
				<view class="basic-info">{{trailerInfo.totalTime}}</view>
				<view class="basic-info">{{trailerInfo.releaseDate}}</view>
				<view class="score-block">
					<view class="big-score">
						<view class="score-words">综合评分：</view>
						<view class="movie-score">{{trailerInfo.score}}</view>
					</view>
					<view class="score-stars">
						<block v-if="trailerInfo.score >= 0">
							<trailer-stars :innerScore="trailerInfo.score" showNum="0"></trailer-stars>
						</block>
						<view class="prise-counts">
							{{trailerInfo.prisedCounts}}人点赞
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 影片基本信息end -->
		<!-- 剧情介绍start -->
		<view class="plots-block">
			<view class="plots-title">剧情介绍</view>
			<view class="plots-desc">{{trailerInfo.plotDesc}}</view>
		</view>
		<!-- 剧情介绍end -->
		<!-- 演职人员start -->
		<view class="scroll-block">
			<view class="plots-title">演职人员</view>
			<scroll-view scroll-x class="scroll-list">
				<view class="actor-wapper" v-for="(director, staffIndex) in directorArray">
					<image 
						:src="director.photo"
						class="single-actor"
						mode="aspectFill"
						@click="lookStaffs"
						:data-staffIndex="staffIndex"
					></image>
					<view class="actor-name">{{director.name}}</view>
					<view class="actor-role">{{director.actName}}</view>
				</view>
				<view class="actor-wapper" v-for="(actor, actorIndex) in actorArray">
					<image 
						:src="actor.photo"
						class="single-actor"
						mode="aspectFill"
						@click="lookStaffs"
						:data-staffIndex="actorIndex + directorArray.length"
					></image>
					<view class="actor-name">{{actor.name}}</view>
					<view class="actor-role">{{actor.actName}}</view>
				</view>
			</scroll-view>
		</view>
		<!-- 演职人员end -->
		<!-- 剧照start -->
		<view class="scroll-block">
			<view class="plots-title">剧照</view>
			<scroll-view scroll-x class="scroll-list">
				<image 
					v-for="(img, imgIndex) in plotPicsArray"
					:src="img"
					class="plot-image"
					mode="aspectFill"
					@click="lookMe"
					:data-imgIndex="imgIndex"
				></image>
			</scroll-view>
		</view>
		<!-- 剧照end -->
	</view>
</template>

<script>
	import trailerStars from 'components/index/trailerStars.vue'
	import {getMovieDetail, getMovieActor} from 'common/network/movie.js'
	export default{
		data(){
			return {
				trailerInfo: {},
				plotPicsArray: [], //剧照
				directorArray: [], //导演列表
				actorArray: [] //演员列表
			}
		},
		components: {
			trailerStars
		},
		onReady() {
			// 页面初次渲染完成，获取视频上下文对象
			this.videoContext = uni.createVideoContext('myTrailer')
		},
		onHide() {
			// 视频被隐藏时暂停播放
			this.videoContext.pause()
		},
		onShow() {
			// 视频被显示时接着播放
			// if(this.videoContext) {
			// 	this.videoContext.play()
			// }
		},
		onLoad(params) {
			// 通过api修改导航栏属性
			// uni.setNavigationBarColor({
			// 	frontColor: "#FFFFFF",
			// 	backgroundColor: "#000000"
			// })
			
			//params获取上一级页面参数
			var trailerId = params.trailerId;
			// 获取视频图片介绍
			getMovieDetail(trailerId).then(data => {
				var [error, res] = data;
				this.trailerInfo = res.data.data;
				
				// 把剧照数据的字符串转换为json array
				var plotPicsArray = JSON.parse(this.trailerInfo.plotPics);
				this.plotPicsArray = plotPicsArray;
			});
			// 获取导演
			getMovieActor(trailerId, 1).then(data => {
				var [error, res] = data;
				this.directorArray = res.data.data;
			})
			// 获取演员
			getMovieActor(trailerId, 2).then(data => {
				var [error, res] = data;
				this.actorArray = res.data.data;
			})
		},
		
		//#ifdef MP-WEIXIN
		// 小程序分享(此函数仅支持小程序端的分享，分享到微信群或者微信好友)
		onShareAppMessage(res){
			return {
				title: this.trailerInfo.name,
				path: '/pages/movie/movie?trailerId=' + this.trailerInfo.id
			}
		},
		// 监听导航栏按钮
		onNavigationBarButtonTap(e){
			var index = e.index;
			var trailerInfo = this.trailerInfo;
			var trailerId = trailerInfo.id;
			var trailerName = trailerInfo.name;
			var cover = trailerInfo.cover;
			var poster = trailerInfo.poster;
			// index值为0；则分享
			if(index == 0){
				uni.share({
					provider: "weixin",
					scene: "WXSceneSession",
					type: 0,
					href: "http://www.imovietrailer.com/#/pages/movie/movie?trailerId=" + trailerId,
					title: "新影预告:《" + trailerName + "》",
					summary: "新影预告:《" + trailerName + "》",
					imageUrl: cover,
					success: function (res) {
							console.log("success:" + JSON.stringify(res));
					},
					fail: function (err) {
							console.log("fail:" + JSON.stringify(err));
					}
				})
			}
		},
		// #endif
		methods: {
			lookMe(e){
				var imgIndex = e.currentTarget.dataset.imgindex;
				uni.previewImage({
					current: this.plotPicsArray[imgIndex],
					urls: this.plotPicsArray
				})
			},
			lookStaffs(e){
				var staffIndex = e.currentTarget.dataset.staffindex;
				// 拼接导演和演员的数组，成为一个新数组
				var newStaffArray = [];
				newStaffArray = newStaffArray.concat(this.directorArray).concat(this.actorArray);
				var urls = [];
				for (var i = 0; i < newStaffArray.length; i ++){
					var tempPhoto = newStaffArray[i].photo;
					urls.push(tempPhoto);
					uni.previewImage({
						current: urls[staffIndex],
						urls: urls
					})
				}
			}
		}
	}
</script>

<style>
	@import url("movie.css");
</style>
