import dayjs from 'dayjs';
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
		console.log(dayjs().unix());
		wx.showLoading({ title: '加载中' });
		await delay();
		console.log('end');

		wx.hideLoading();
	},

	getUserInfo(e: any) {}
});
