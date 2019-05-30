import Store from '@/utils/store';
import { delay } from '@/utils/util';
import dayjs from 'dayjs';

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
		dayjs().format('YYYY-MM-DD HH:hh:ss');
		console.log(`这一刻 ${dayjs().format('YYYY-MM-DD HH:hh:ss')}`);
		wx.showLoading({ title: '加载中' });
		Store.log('track');
		Store.log('track');
		Store.log('track');
		Store.log('track');
		Store.log('track');
		await delay();
		wx.hideLoading();
		console.log(`这一刻 ${dayjs().format('YYYY-MM-DD HH:hh:ss')}`);
	}
});
