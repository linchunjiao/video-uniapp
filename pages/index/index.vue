<template>
	<view class="page">
		<!-- 轮播图start -->
		<swiper :indicator-dots="true" :autoplay="true" class="carousel">
			<swiper-item v-for="carousel in carouselList">
				<image :src="carousel.image" class="carousel"></image>
			</swiper-item>
		</swiper>
		<!-- 轮播图end -->

		<!-- 热门推荐start -->
		<view>
			<view class="page-block super-hot">
				<view class="hot-title-wapper">
					<image src="../../static/icos/hot.png" class="hot-ico"></image>
					<view class="hot-title">
						推荐预告
					</view>
				</view>
			</view>
			<scroll-view scroll-x="true" class="page-block hot">
				<view class="single-poster" v-for="superhero in hotSuperheroList">
					<view class="poster-wapper" @click="showTrailer" :data-trailerId="superhero.id">
						<image :src="superhero.cover" class="poster"></image>
						<view class="movie-name">
							{{superhero.name}}
						</view>
						<trailer-stars :innerScore = 'superhero.score' showNum="1"></trailer-stars>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 热门推荐end -->
		
		<!-- 热门预告start -->
		<view>
			<view class="page-block super-hot">
				<view class="hot-title-wapper">
					<image src="../../static/icos/interest.png" class="hot-ico"></image>
					<view class="hot-title">
						热门预告
					</view>
				</view>
			</view>
			<view class="hot-movies page-block">
				<video 
					:id="trailer.id"
					:data-playingindex="trailer.id"
					@play="meIsPlaying"
					v-for="trailer in hotTrailerList" 
					:src="trailer.trailer" 
					:poster="trailer.poster" 
					class="hot-movie-single"
					controls></video>
			</view>
		</view>
		<!-- 热门预告end -->
		
		<!-- 猜你喜欢start -->
		<view class="page-block">
			<view class="page-block super-hot">
				<view class="hot-title-wapper">
					<image src="../../static/icos/guess-u-like.png" class="hot-ico"></image>
					<view class="hot-title">
						猜你喜欢
					</view>
				</view>
			</view>
			
			<view class="guess-u-like" v-for="(guess, gIndex) in guessULikeList">
				<image :src="guess.cover" @click="showTrailer" :data-trailerId="guess.id" class="like-movie"></image>
				<view class="movie-desc">
					<view class="movie-title">
						{{guess.name}}
					</view>
					<trailer-stars :innerScore="9.1" showNum="0"></trailer-stars>
					<view class="movie-info">
						{{guess.basicInfo}}
					</view>
					<view class="movie-info">
						{{guess.releaseDate}}
					</view>
				</view>
				<view class="movie-oper" :data-gIndex="gIndex" @click="praiseMe">
					<image  src="../../static/icos/praise.png" class="praise-ico"></image>
					<view class="praise-me">
						点赞
					</view>
					<view :animation="animationDataArr[gIndex]" class="praise-me animation-opacity">
						+1
					</view>
				</view>
			</view>
		</view>
		
		<!-- 猜你喜欢end -->
	</view>
</template>

<script>
	import trailerStars from 'components/index/trailerStars.vue'
	import {
		getHomeSwiper, 
		getHomeRecommon, 
		getHomeHot,
		getLikeList
	} from 'common/network/index.js'
	export default {
		components: {
			trailerStars,
		},
		data() {
			return {
				title: 'Hello',
				carouselList: [],//接收轮播图数据
				hotSuperheroList: [],//接收热门推荐数据
				hotTrailerList: [],//接收热门预告数据
				guessULikeList: [],//接收猜你喜欢数据
				
				animationData: {},//接收点赞动画数据
				animationDataArr: [
					{}, {}, {}, {}, {}
				]
			}
		},
		onUnload() {
			// 页面卸载的时候，清除动画数据
			this.animationData = {};
			this.animationDataArr= [
				{}, {}, {}, {}, {}
			]
		},
		onPullDownRefresh() {
			this.refresh();
		},
		onHide() {
			if(this.videoContext) {
				this.videoContext.pause()
			}
		},
		onLoad() {
			// 在页面创建的时候，创建一个临时动画对象
			this.animation = uni.createAnimation();
			// 请求轮播图数据
			getHomeSwiper().then(data => {
				var [error, res] = data //data为一个数组，数组第一项为错误信息，第二项为返回数据
				// console.log(res.data)
				this.carouselList = res.data.data
			})
			// 请求热门推荐数据
			getHomeRecommon().then(data => {
				var [error, res] = data
				this.hotSuperheroList = res.data.data
			})
			
			// 请求热门预告数据
			getHomeHot().then(data => {
				var [error, res] = data
				this.hotTrailerList = res.data.data
			})
			
			// 请求猜你喜欢数据
			getLikeList().then(data => {
				var [error, res] = data
				this.guessULikeList = res.data.data
			})
			
		},
		methods: {
			showTrailer(e) {
				var trailerId = e.currentTarget.dataset.trailerid;//"trailerid"获取时需要用小写
				// 页面跳转接口api
				uni.navigateTo({
					url: "../movie/movie?trailerId=" + trailerId
				})
			},
			// 播放一个视频时，需要暂停其他视频
			meIsPlaying(e) {
				var trailerId = "";
				if(e) {
					trailerId = e.currentTarget.dataset.playingindex;
				}
				var hotTrailerList = this.hotSuperheroList;
				for(var i = 0; i < hotTrailerList.length; i ++) {
					var tempId = hotTrailerList[i].id;
					if(tempId != trailerId) {
						uni.createVideoContext(tempId).pause();
					}
				}
			},
			refresh() {
				getLikeList().then(data => {
					var [error, res] = data
					this.guessULikeList = res.data.data
				})
				uni.stopPullDownRefresh()
				
			},
			// 实现点赞动画效果
			praiseMe(e) {
				// 获取下标
				var gIndex = e.currentTarget.dataset.gindex;
				// console.log(gIndex)
				// 构建动画数据，并且通过step来表示这组动画的完成
				this.animation.translateY(-60).opacity(1).step({
					duration: 400
				});
				// 导出动画数据到view组件，实现组件的动画效果
				this.animationData = this.animation;
				this.animationDataArr[gIndex] = this.animationData.export();
				
				// 还原动画
				setTimeout(function() {
					this.animation.translateY(0).opacity(0).step({
						duration: 0
					})
					this.animationData = this.animation;
					this.animationDataArr[gIndex] = this.animationData.export();
				}.bind(this),500)
			}
		}
	}
</script>

<style>
	@import url("index.css");
</style>
