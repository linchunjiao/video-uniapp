<template>
	<view class="block">
		<image
			:src="cover"
			class="cover"
			mode="widthFix"
			@click="operator"
		></image>
	</view>
</template>

<script>
	export default {
		data(){
			return {
				cover: ""
			}
		},
		onLoad(params){
			var cover = params.cover;
			this.cover = cover;
			// 通过api修改导航栏属性
		},
		methods: {
			operator(){
				uni.showActionSheet({
					itemList: ["下载保存图片", "分享图片"],
					success: function(res){
						// 下标为零则是第一项‘下载保存图片’
						if(res.tapIndex == 0){
							// 提示框
							uni.showLoading({
								title:"图片保存中"
							})
							// 下载图片
							uni.downloadFile({
								url: this.cover,
								success: function(result){
									var tempFilePath = result.tempFilePath;
									// 保存图片到系统相册
									uni.saveImageToPhotosAlbum({
										filePath: tempFilePath,
										success: function(){
											uni.showToast({
												title:"保存成功",
												duration: 2000
											})
										},
										complete: function(){
											uni.hideLoading()
										}
									})
								}
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
	@import url("cover.css");
</style>
