<template>
	<view class="body">
		<form @submit="formSubmit">
			<view class="face-wapper">
				<image src="../../static/icos/default-face.png" class="face"></image>
			</view>
			<view class="info-wapper">
				<label class="words-lbl">账号</label>
				<input name="username" type="text" value="" class="input" placeholder="请输入用户名" placeholder-class="graywords" maxlength="10"/>
			</view>
			<view class="info-wapper" style="margin-top: 40upx;">
				<label class="words-lbl">密码</label>
				<input name="password" type="text" value="" password="true" class="input" placeholder="请输入密码" placeholder-class="graywords" maxlength="6"/>
			</view>
			<button type="primary" form-type="submit" style="margin-top: 60upx; width: 90%;">注册/登录</button>
		</form>
		<!-- 第三方登录H5不支持，所以隐藏掉 -->
		<!-- #ifndef H5 -->
			<view class="third-wapper">
				<view class="third-line">
					<view class="single-line">
						<view class="line"></view>
					</view>
					<view class="third-words">第三方账号登录</view>
					<view class="single-line">
						<view class="line"></view>
					</view>
				</view>
				<view class="third-icos-wapper">
					<!-- 5+app 用qq/微信/微博 登录 小程序用微信小程序登录 h5不支持 -->
					<!-- #ifdef APP-PLUS -->
						<image src="../../static/icos/weixin.png" data-logintype="weixin" @click="appOAuthLogin" class="third-ico"></image>
						<image src="../../static/icos/QQ.png" data-logintype="qq" @click="appOAuthLogin" class="third-ico" style="margin-left: 80upx;"></image>
						<image src="../../static/icos/weibo.png" data-logintype="sinaweibo" @click="appOAuthLogin" class="third-ico" style="margin-left: 80upx;"></image>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
						<button open-type='getUserInfo' @getuserinfo="wxLogin" class="third-btn-ico">
						</button>
					<!-- #endif -->
				</view>
			</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import common from 'common/common.js'
	import {getRegistLogin} from "common/network/registLogin.js"
	export default {
		methods: {
			// app第三方登录
			appOAuthLogin(e) {
				var me = this;
				// 获取用户的登录类型
				var logintype = e.currentTarget.dataset.logintype;
				// 授权登录
				uni.login({
					provider: logintype,
					success(loginRes) {
						// 授权登录成功以后，获取用户的信息
						uni.getUserInfo({
							provider: logintype,
							success(info) {
								// console.log(JSON.stringify(info));
								var userInfo = info.userInfo;
								var face = "";
								var nickname = "";
								var openIdOrUid = "";
								if (logintype == "weixin") {
									face = userInfo.avatarUrl;
									nickname = userInfo.nickName;
									openIdOrUid = userInfo.openId;
								} else if (logintype == "qq") {
									openIdOrUid = userInfo.openId;
									nickname = userInfo.nickname;
									face = userInfo.figureurl_qq_2;
								} else if (logintype == "sinaweibo") {
									openIdOrUid = userInfo.id;
									nickname = userInfo.nickname;
									face = userInfo.avatar_large;
								}
								// 调用开发者后台，执行一键注册或登录
								uni.request({
									url: me.serverUrl + "/appUnionLogin/" + logintype,
									data: {
										"openIdOrUid": openIdOrUid,
										"nickname": nickname,
										"face": face
									},
									method: "POST",
									success(result) {
										if (result.data.status == 200) {
											var userInfo = result.data.data;
											// 保存用户信息到全局的缓存中
											uni.setStorageSync("globalUser", userInfo);
											// 切换页面跳转，使用tab切换的api
											uni.switchTab({
												url: "../me/me"
											});
										}
									}
								})
							}
						})
					}
				});
			},
			// 实现在微信小程序端的微信登录
			wxLogin(e) {
				console.log(e)
				// 通过微信开发能力，获取微信用户基本信息
				var userInfo = e.detail.userInfo;
				// 实现微信登录
				uni.login({
					provider: "weixin",
					success(loginResult) {
						console.log(loginResult);
						// 获取微信登录的code;授权码
						var code = loginResult.code;
						// 设置微信登录对应的小程序
						var loginToWhichMP = 1;
						// uni.request({
						// 	url: common.serverUrl + "/appUnionLogin/" + code,
						// 	method: "POST",
						// 	data: {
						// 		"face": userInfo.avatarUrl,
						// 		"nickname": userInfo.nickName,
						// 		"openIdOrUid": loginToWhichMP,
						// 		qq: '38833964',
						// 	},
						// 	success(userResult) {
						// 		var userInfo = userResult.data.data;
						// 		// 保存用户信息到全局的缓存中
						// 		uni.setStorageSync("globalUser", userInfo);
						// 		// 切换页面跳转，使用tab切换的api
						// 		uni.switchTab({
						// 			url: "../me/me"
						// 		})
						// 	}
						// })
						
						// 接口不可用，数据写死
						var wxuserInfo = e.detail.userInfo;
						var userInfo = {
							id: "2640358521",
							nickname: wxuserInfo.nickName,
							username: wxuserInfo.nickName,
							faceImage: wxuserInfo.avatarUrl,
							sex: null,
							birthday: "2000-09-01",
							isCertified: 0,
							registTime: "2019-08-28T07:01:20.030+0000",
						};
						uni.setStorageSync("globalUser", userInfo);
						uni.switchTab({
							url: "../me/me"
						})
					}
				})
			},
			
			formSubmit (e) {
				var username = e.detail.value.username;
				var password = e.detail.value.password;
				getRegistLogin(username, password).then(data => {
					var [error, res] = data;
					if(res.data.status == 200) {
						var userInfo = res.data.data;
						console.log(userInfo)
						// 保存用户信息到全局的缓存中
						uni.setStorageSync("globalUser", userInfo);
						// 切换页面跳转，使用tab切换的api
						uni.switchTab({
							url: "../me/me"
						})
					}else if (res.data.status == 500) {
						uni.showToast({
							title: res.data.msg,
							duration: 2000,
							image: "../../static/icos/error.png"
						})
					}else{
						// 接口不可用，数据写死
						var userInfo = {
							id: "2640358521",
							nickname: username,
							username: "xiaoLin",
							faceImage: "http://122.152.205.72:88/group1/M00/00/05/CpoxxFw_8_qAIlFXAAAcIhVPdSg994.png",
							sex: null,
							birthday: "2000-09-01",
							isCertified: 0,
							registTime: "2019-08-28T07:01:20.030+0000",
						};
						uni.setStorageSync("globalUser", userInfo);
						uni.showToast({
							title: '登录成功',
							mask: false,
							duration: 1000
						})
						uni.switchTab({
							url: "../me/me"
						})
					}
					
				})
			}
		}
	}
</script>

<style>
	@import url("registLogin.css");
</style>
