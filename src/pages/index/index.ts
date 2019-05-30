import Store from '@/utils/store';
import { delay } from '@/utils/util';

Page({
	data: {
		motto: '点击 “编译” 以构建',
		userInfo: {},
		hasUserInfo: false,
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},
	onTapAvatar() {
		wx.showToast({
			title: 'Hello World',
			icon: 'none'
		});
	},
	async onLoad() {
		console.log('begin');
		wx.showLoading({ title: '加载中' });
		Store.log();
		Store.log();
		Store.log();
		Store.log();
		Store.log();
		await delay();
		console.log('end');

		wx.hideLoading();
	}
});
