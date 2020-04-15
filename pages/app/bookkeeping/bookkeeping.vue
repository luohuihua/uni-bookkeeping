<template>
	<view>
		<scroll-view scroll-x class="bg-yellow nav text-center">
			<view class="cu-item" :class="0==tabCur?'text-white cur':''" @tap="tabSelect" data-id="0">
				<text class="cuIcon-triangleupfill"></text> 支出
			</view>
			<view class="cu-item" :class="1==tabCur?'text-white cur':''" @tap="tabSelect" data-id="1">
				<text class="cuIcon-triangledownfill"></text> 收入
			</view>
		</scroll-view>


		<view v-if="tabCur==0">
			<view class="cu-bar solid-bottom">
				<view class="action">
					<image :src="expenditureListIconList[activeIndex].url1" class="image" />
					<text style="color:#1296db;" class="icon-item-text">{{ expenditureListIconList[activeIndex].text }}</text>
					<view class="solid-bottom padding" style="position: absolute;right: 0;">
						<text class="text-price">{{money}}</text>
					</view>
				</view>
			</view>
			<uni-grid :column="5" :show-border="false" :square="true">
				<uni-grid-item v-for="(item,index) in expenditureListIconList" :key="index">
					<view class="grid-item-box" @click="switchActive(index)">
						<!-- <uni-icons :type="item.name" :color="activeIndex === index?'#007aff':'#8f8f94'" size="25" /> -->
						<image :src="activeIndex === index?item.url1:item.url" class="image" />
						<text :style="{color:activeIndex === index?'#1296db':'#707070'}" class="icon-item-text">{{ item.text }}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>

		<view v-if="tabCur==1">
			<view class="cu-bar solid-bottom">
				<view class="action">
					<image :src="incomeIconList[incomeActiveIndex].url1" class="image" />
					<text style="color:#1296db;" class="icon-item-text">{{ incomeIconList[incomeActiveIndex].text }}</text>
					<view class="solid-bottom padding" style="position: absolute;right: 0;">
						<text class="text-price">{{incomeMoney}}</text>
					</view>
				</view>
			</view>
			<uni-grid :column="5" :show-border="false" :square="true">
				<uni-grid-item v-for="(item,index) in incomeIconList" :key="index">
					<view class="grid-item-box" @click="switchActive(index)">
						<!-- <uni-icons :type="item.name" :color="activeIndex === index?'#007aff':'#8f8f94'" size="25" /> -->
						<image :src="incomeActiveIndex === index?item.url1:item.url" class="image" />
						<text :style="{color:incomeActiveIndex === index?'#1296db':'#707070'}" class="icon-item-text">{{ item.text }}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>


		<view class="keyboardbox">
			<view class="numkeyboard" v-if="type===1">
				<view class="num-area">
					<view class="row" v-for="(item,index) in numKeybordList" :key="index">
						<view :class="['item',ite===0?'z':'',(disableDot && ite==='.')?'disabled':'']" v-for="(ite,idx) in item"
						 hover-class="active" :hover-start-time="0" :hover-stay-time="5" :key="idx" @tap="input(ite)">{{ite}}</view>
					</view>
				</view>
				<view class="btn-area">
					<view :class="['item','del']" hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="deleteVal">
						删除
					</view>
					<view class="confirem item" hover-class="active" :hover-start-time="0" :hover-stay-time="5" @tap="confirm">
						完成
					</view>
				</view>
			</view>
		</view>
		<view class="safe-area" v-if="safeAreaInsetBottom"></view>

	</view>


</template>

<script>
	import {
		callCloudFunction,
		getUserInfo
	} from '@/common/public_util.js';

	let _self;
	export default {
		components: {

		},
		props: {
			type: {
				type: Number, // 1-数字键盘 2-身份证号  -车牌号
				default: 1
			},
			safeAreaInsetBottom: { //是否设置安全区
				type: Boolean,
				default: false
			},
			disableDot: { //数字键盘是否禁止点击.仅type为number生效
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				option: {}, //参数
				id: null,
				incomeMoney: '0.00', //收入金额
				money: '0.00', //支出金额
				numKeybordList: [
					[1, 2, 3],
					[4, 5, 6],
					[7, 8, 9],
					[0, '.']
				],
				active: 1,
				tabCur: 0,
				incomeActiveIndex: 0,
				activeIndex: 0,
				incomeIconList: [{
					url: '/static/bookeepingIcon/工资.png',
					url1: '/static/bookeepingIcon/工资 (1).png',
					text: '工资'
				}, {
					url: '/static/bookeepingIcon/兼职.png',
					url1: '/static/bookeepingIcon/兼职 (1).png',
					text: '炒更'
				}, {
					url: '/static/bookeepingIcon/奖金.png',
					url1: '/static/bookeepingIcon/奖金 (1).png',
					text: '奖金'
				}, {
					url: '/static/bookeepingIcon/投资.png',
					url1: '/static/bookeepingIcon/投资 (1).png',
					text: '投资'
				}],
				expenditureListIconList: [{
						url: '/static/bookeepingIcon/吃喝.png',
						url1: '/static/bookeepingIcon/吃喝 (1).png',
						text: '食嘢'
					},
					{
						url: '/static/bookeepingIcon/玩乐.png',
						url1: '/static/bookeepingIcon/玩乐 (1).png',
						text: '聚会'
					},
					{
						url: '/static/bookeepingIcon/衣服.png',
						url1: '/static/bookeepingIcon/衣服 (1).png',
						text: '装身'
					},
					{
						url: '/static/bookeepingIcon/米.png',
						url1: '/static/bookeepingIcon/米 (1).png',
						text: '琳审'
					},
					{
						url: '/static/bookeepingIcon/孩子.png',
						url1: '/static/bookeepingIcon/孩子 (1).png',
						text: '仔囡'
					},
					{
						url: '/static/bookeepingIcon/化妆品.png',
						url1: '/static/bookeepingIcon/化妆品 (1).png',
						text: '扮靓'
					},
					{
						url: '/static/bookeepingIcon/网购.png',
						url1: '/static/bookeepingIcon/网购 (1).png',
						text: '网购'
					},
					{
						url: '/static/bookeepingIcon/红包.png',
						url1: '/static/bookeepingIcon/红包 (1).png',
						text: '利是'
					},
					{
						url: '/static/bookeepingIcon/医疗.png',
						url1: '/static/bookeepingIcon/医疗 (1).png',
						text: '睇病'
					},
					{
						url: '/static/bookeepingIcon/水电图.png',
						url1: '/static/bookeepingIcon/水电图 (1).png',
						text: '水电'
					},
					{
						url: '/static/bookeepingIcon/贷款.png',
						url1: '/static/bookeepingIcon/贷款 (1).png',
						text: '贵利'
					},
					{
						url: '/static/bookeepingIcon/养车.png',
						url1: '/static/bookeepingIcon/养车 (1).png',
						text: '养车'
					},
				],
			}
		},
		methods: {
			/**
			 * 完成
			 */
			confirm() {
				let money = _self.money; //支出
				if (_self.tabCur == 1) {
					money = _self.incomeMoney; //收入
				}
				let moneyNumber = new Number(money);
				if (moneyNumber <= 0) {
					uni.showToast({
						icon: "none",
						title: '请输入大于0的金额'
					});
					return;
				}
				let expenditureListIcon = null;
				if (_self.tabCur == 0) {
					expenditureListIcon = _self.expenditureListIconList[_self.activeIndex];
				} else if (_self.tabCur == 1) {
					expenditureListIcon = _self.incomeIconList[_self.incomeActiveIndex];
				}
				let userInfo = getUserInfo();
				callCloudFunction('money_add', {
					id: _self.id == null ? '' : _self.id,
					openid: userInfo.openid,
					nickName: userInfo.nickName,
					money: moneyNumber,
					type: expenditureListIcon.text,
					url: expenditureListIcon.url,
					url1: expenditureListIcon.url1,
					mark: _self.tabCur == 1 ? 'income' : 'expenditure'
				}, (res) => {
					if (_self.id == null || _self.id == '') {
						uni.showToast({
							icon: "none",
							title: '记录成功',
							duration: 2000
						});
					} else {
						uni.showToast({
							icon: "none",
							title: '修改成功',
							duration: 2000
						});
						_self.id = null;
					}
					if (_self.tabCur == 0) { //支出
						_self.money = '0.00';
					} else if (_self.tabCur == 1) { //收入
						_self.incomeMoney = '0.00';
					}

				}, (fail) => {
					uni.showToast({
						icon: "none",
						title: '记录失败:' + JSON.stringify(fail),
						duration: 4000
					});
				});
			},
			/**
			 * 删除
			 */
			deleteVal() {
				let money = _self.money; //支出
				if (_self.tabCur == 1) {
					money = _self.incomeMoney; //收入
				}
				if (money != '0.00' && money.length > 0)
					money = money.substring(0, money.length - 1)
				if (money.length <= 0)
					money = '0.00';
				//支出
				if (_self.tabCur == 0) {
					_self.money = money;
				} else if (_self.tabCur == 1) { //收入
					_self.incomeMoney = money;
				}
			},
			/**
			 * 按键
			 * @param {Object}
			 */
			input(val) {
				let money = _self.money; //支出
				if (_self.tabCur == 1) {
					money = _self.incomeMoney; //收入
				}
				if (money == '0.00' && val != null) {
					money = val.toString();
				} else {
					let arr = money.split('.');
					if (val == '.' && arr.length > 1) {

					} else if (arr.length <= 1 || (arr.length > 1 && arr[1].length <= 1)) {
						if (money == '0' && val != '.') {
							money = val.toString();
						} else if (money != '0' || val != '0')
							money += val;
					}
				}
				//支出
				if (_self.tabCur == 0) {
					_self.money = money;
				} else if (_self.tabCur == 1) { //收入
					_self.incomeMoney = money;
				}

			},
			/**
			 * tab切换
			 * @param {Object} e
			 */
			tabSelect(e) {
				_self.tabCur = e.currentTarget.dataset.id;
				_self.scrollLeft = (e.currentTarget.dataset.id - 1) * 60
			},
			/**
			 * 图片点击
			 * @param {Object} index
			 */
			switchActive(index) {
				if (_self.tabCur == 1) {
					_self.incomeActiveIndex = index;
				} else if (_self.tabCur == 0) {
					_self.activeIndex = index;
				}
			},
		},
		onLoad(option) {
			_self = this;
			_self.option = option;

			let userInfo = uni.getStorageSync('userInfo');
			if (userInfo == null || userInfo == '' || userInfo.openid == null) {
				//没登录情况
				uni.navigateTo({
					url: '/pages/user/login'
				});
				return;
			}
		},
		onShow() {
			let modifyDetailed = uni.getStorageSync('modifyDetailed');
			if (modifyDetailed != null && modifyDetailed._id != null) {
				_self.id = modifyDetailed._id;
				if (modifyDetailed.mark != null && modifyDetailed.mark == 'income') {
					_self.tabCur = 1;
				} else {
					_self.tabCur = 0;
				}
				if (_self.tabCur == 0) { //支出
					_self.money = modifyDetailed.money.toString();
				} else if (_self.tabCur == 1) { //收入
					_self.incomeMoney = modifyDetailed.money.toString();
				}
				let type = modifyDetailed.type;
				let activeIndex = 0;
				let list = _self.expenditureListIconList;
				if (_self.tabCur == 1) {
					list = _self.incomeIconList;
				}
				list.forEach((item, index) => {
					if (type == item.text)
						activeIndex = index;
				});
				if (_self.tabCur == 0) { //支出
					_self.activeIndex = activeIndex;
				} else if (_self.tabCur == 1) { //收入
					_self.incomeActiveIndex = activeIndex;
				}
			} else {
				_self.id = null;
				_self.money = '0.00';
			}

			uni.setStorageSync('modifyDetailed', null);
		}

	}
</script>

<style>
	.image {
		width: 50rpx;
		height: 50rpx;
	}

	.text {
		font-size: 26rpx;
		margin-top: 10rpx;
	}

	.grid-item-box {
		flex: 1;
		/* position: relative;
	*/
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 15px 0;
	}
</style>

<style lang="scss" scoped>
	.keyboardbox {
		width: 100%;
		position: absolute;
		left: 0;
		bottom: 0;
		background-color: #FFFFFF;

		.numkeyboard {
			height: 432rpx;
			display: flex;
			background-color: #ebedf0;

			.btn-area {
				width: 180rpx;
				height: 100%;
				display: flex;
				flex-direction: column;

				.item {
					width: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
					flex-grow: 1;
				}

				.del {
					background-color: #ebedf0;
					color: #333;

					&.active {
						background-color: #f1f3f5;
					}
				}

				.confirem {
					background-color: #1989fa;
					color: #FFFFFF;

					&.active {
						background-color: #0570db;
					}
				}
			}

			.num-area {
				flex-grow: 1;
				display: flex;
				flex-wrap: wrap;

				.row {
					width: 100%;
					height: 25%;
					display: flex;
					margin-top: 1px;

					.item {
						flex-grow: 1;
						height: 100%;
						display: flex;
						justify-content: center;
						align-items: center;
						background-color: #FFFFFF;
						border-right: 1px solid #ebedf0;
						width: 33.33%;

						&.active {
							background-color: #ebedf0;
						}

						&.z {
							flex-grow: 2;
							width: 66.66%;
						}

						&.disabled {
							background: #FFFFFF;
							color: #B9B9B9;
						}
					}
				}

			}
		}
	}

	.safe-area {
		padding-bottom: 0rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.platenumber {
		background-color: #f5f5f5;

		.header {
			height: 76rpx;
			background-color: #FFFFFF;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 28rpx;
			border-top: 1px solid #f5f5f5;

			&>view {
				padding: 0 45rpx;
				color: #00a7ea;
				height: 100%;
				display: flex;
				align-items: center;

				&.active {
					background-color: #ebedf0;
				}
			}
		}

		.main {
			height: 435rpx;

			.row {
				margin: 13rpx 0;
				display: flex;
				justify-content: center;
				align-items: center;

				.item {
					width: 56rpx;
					height: 94rpx;
					display: flex;
					justify-content: center;
					align-items: center;
					background-color: #FFFFFF;
					border-radius: 6rpx;
					margin: 0 7rpx;
					font-size: 24rpx;

					&.active {
						background-color: #ebedf0;
					}

					&.img {
						background-color: #c2cacc;
						width: 94rpx;

						&.active {
							background-color: #ddd;
						}

						&>image {
							width: 49rpx;
							height: 48rpx;
						}
					}
				}
			}

		}
	}
</style>
