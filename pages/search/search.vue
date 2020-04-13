<template>
	<view class="page">
		<view class="search-block">
			<view class="search-ico-wapper">
				<image src="../../static/icos/search.png" class="search-ico"></image>
			</view>
			<input 
				placeholder="搜索预告片" 
				:value=keywords
				maxlength="22" 
				class="searth-text" 
				confirm-type="search"
				@confirm="searchMe"
				@input="inputText"
				confirm-hold=true
				hold-keyboard=true
			/>
			<view class="search-clear-wapper" @click="clearValue">
				<image src="../../static/icos/close.png"  class="search-clear" :animation="animationOpacity" ></image>
			</view>
		</view>
		<view class="movie-list page-block">
			<view class="movie-wapper" v-for="trailer in trailerList">
				<image 
					:src="trailer.cover" 
					:data-trailerId="trailer.id"
					@click="showTrailer"
					class="poster"></image>
			</view>
			<!-- <view class="movie-wapper">
				<image src="../../static/poster/justice.png" class="poster"></image>
			</view> -->
		</view>
	</view>
</template>

<script>
	import {getMovieList} from "common/network/search.js"
	export default {
		data() {
			return {
				trailerList: [],
				keywords: "" ,//搜索的关键词
				page: 1, //当前第几页
				totalPages: 1 ,//总页数
				animationOpacity: {}
			}
		},
		onLoad(){
			getMovieList().then(data => {
				var [error, res] = data
				this.trailerList = res.data.data.rows
			})
			complete: () => {
				uni.hideNavigationBarLoading();
				uni.hideLoading();
			}
			
			// 在页面创建的时候，创建一个临时动画对象
			this.animation = uni.createAnimation();
		},
		onReachBottom(){
			var page = this.page + 1; //查询下一个页面
			var keywords = this.keywords; //获得当前页面中的data的搜索值
			var totalPages = this.totalPages; //获取总页数
			this.pagedTrailerList(keywords, page, 14)
		},
		methods: {
			inputText(e) {
				var value = e.detail.value;
				this.keywords = value
				if(value.length == 0 || this.keywords.length == 0) {
					this.animation.opacity(0).step({
						duration: 300
					});
					this.animationOpacity = this.animation.export();
				}else {
					this.animation.opacity(1).step({
						duration: 200
					});
					this.animationOpacity = this.animation.export();					
				}
			},
			// 清除关键词
			clearValue(){
				this.keywords = "";
				this.animation.opacity(0).step({
					duration: 300
				});
				this.animationOpacity = this.animation.export();
				// if(this.keywords != "") {
				// 	this.keywords = ""
				// }
			},
			noKeywords(){
				// 关键词不存在
				var value = "";
				this.keywords = value;
				this.pagedTrailerList(value, 1, 14);
			},
			showTrailer(e){
				var trailerId = e.currentTarget.dataset.trailerid;//"trailerid"获取时需要用小写
				// 页面跳转接口api
				uni.navigateTo({
					url: "../movie/movie?trailerId=" + trailerId
				})
			},
			searchMe(e){
				var value = e.detail.value;
				this.keywords = value;
				this.trailerList = [];
				this.pagedTrailerList(value, 1, 14);
			},
			pagedTrailerList(keywords, page, pageSize){
				uni.showLoading({
					mask: true,
					title:"请稍候..."
				});
				uni.showNavigationBarLoading();
				
				getMovieList(keywords, page, pageSize).then(data => {
					var [error, res] = data;
					if(res.data.status == 200 && res.data.data.total != 0) {
						var tempList = res.data.data.rows;
						this.trailerList = this.trailerList.concat(tempList);
						this.totalPages = res.data.data.total;
						this.page = page;
					}else if(res.data.status == 200 && res.data.data.total == 0) {
						uni.showModal({
							title: '抱歉，目前还没有该预告片:《' + keywords + '》',
							content: '换一个预告片吧',
							showCancel: false,
							complete: () => {
								this.noKeywords();
								this.clearValue()
							}
						})
						
					}
					uni.hideNavigationBarLoading();
					uni.hideLoading();
				})
			},
			
		}
	}
</script>

<style>
	@import url("search.css");
</style>
