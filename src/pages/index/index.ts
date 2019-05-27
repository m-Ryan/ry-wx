import _, { isArray } from 'lodash';
import Store from '@/utils/store';
async function delay() {
	return new Promise((resolve) => setTimeout(resolve, 2000));
}
Page({
	data: {
		motto: '点击 “编译” 以构建',
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},
	async getUserInfo() {
		wx.showLoading({ title: '获取用户信息' });
		await delay();

		console.log('end');
		wx.hideLoading();
	},
	async onLoad() {
		wx.showLoading({ title: '加载中' });
		Store.log();
		Store.log();
		Store.log();
		Store.log();
		Store.log();
		console.log(_.isBoolean('false'));
		console.log(isArray([]));
		await delay();
		console.log('end');

		wx.hideLoading();
	}
});
