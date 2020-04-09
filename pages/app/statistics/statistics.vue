<template>
	<view class="qiun-columns">
		<view class="qiun-bg-white qiun-title-bar qiun-common-mt">
			<view class="qiun-title-dot-light">统计情况,总支出:{{expenditureSum}}元</view>
		</view>
		<view class="qiun-charts">
			<!--#ifdef MP-ALIPAY -->
			<canvas canvas-id="canvasPie" id="canvasPie" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio"
			 :style="{'width':cWidth+'px','height':cHeight+'px'}" @touchstart="touchPie"></canvas>
			<!--#endif-->
			<!--#ifndef MP-ALIPAY -->
			<canvas canvas-id="canvasPie" id="canvasPie" class="charts" @touchstart="touchPie"></canvas>
			<!--#endif-->
		</view>
		<!-- 	<view>
			<button class="cu-btn round bg-gradual-blue" @click="getServerData">刷新</button>
		</view> -->
		<br>
		<view class="cu-form-group">
			<view class="title">日期</view>
			<picker mode="date" :value="date" fields="month" @change="dateChange">
				<view class="picker">
					{{date}}
				</view>
			</picker>
		</view>

	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	import {
		isJSON
	} from '@/common/checker.js';

	import {
		callCloudFunction,
		getUserOpenid
	} from '@/common/public_util.js';

	var _self;
	var canvaPie = null;

	export default {
		data() {
			return {
				cWidth: '',
				cHeight: '',
				pixelRatio: 1,
				textarea: '',
				expenditureSum: 0, //总支出
				date: ''
			}
		},
		onShow() {
			_self.getServerData();
		},
		onLoad() {
			_self = this;
			var myDate = new Date();
			var year = myDate.getFullYear();
			var month = myDate.getMonth();
			var m = month + 1;
			if (m.toString().length == 1) {
				m = "0" + m;
			}
			_self.date = year + '-' + m;


			//#ifdef MP-ALIPAY
			uni.getSystemInfo({
				success: function(res) {
					if (res.pixelRatio > 1) {
						//正常这里给2就行，如果pixelRatio=3性能会降低一点
						//_self.pixelRatio =res.pixelRatio;
						_self.pixelRatio = 2;
					}
				}
			});
			//#endif
			this.cWidth = uni.upx2px(750);
			this.cHeight = uni.upx2px(500);
			this.getServerData();
		},
		methods: {
			getServerData() {
				let yms = _self.date.split('-');
				let startDay = 2; //本月第一日
				let endDay = new Date(yms[0], yms[1], 0).getDate(); // 本月最后一天
				callCloudFunction('money_query', {
					openid: getUserOpenid(),
					startDate: new Date(yms[0], new Number(yms[1]) - 1, startDay, 0, 0, 0),
					endDate: new Date(yms[0], new Number(yms[1]) - 1, endDay, 23, 59, 59)
				}, (res) => {
					let Pie = {
						series: []
					};
					let series = [];

					let sum = 0; //总数
					let typeMap = {};
					res.data.forEach((data) => {
						let type = data['type'];
						let money = new Number(data['money']);
						let moneySum = typeMap[type];
						if (moneySum == null || moneySum <= 0) {
							moneySum = money;
						} else {
							moneySum += money;
						}
						sum += money;
						typeMap[type] = moneySum;
					});
					for (let key in typeMap) {
						let serie = {
							name: key,
							data: typeMap[key]
						};
						series.push(serie);
					}
					_self.expenditureSum = sum.toFixed(2);

					Pie.series = series;
					_self.textarea = JSON.stringify({
						series: series
					});
					_self.showPie("canvasPie", Pie);
				});

				// uni.request({
				// 	url: 'https://www.ucharts.cn/data.json',
				// 	data: {},
				// 	success: function(res) {
				// 		let Pie = {
				// 			series: []
				// 		};
				// 		//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
				// 		console.log(res.data.data.Pie.series);
				// 		console.log(res.data.data.Pie);

				// 		Pie.series = res.data.data.Pie.series;
				// 		_self.textarea = JSON.stringify(res.data.data.Pie);
				// 		_self.showPie("canvasPie", Pie);
				// 	},
				// 	fail: () => {
				// 		_self.tips = "网络错误，小程序端请检查合法域名";
				// 	},
				// });
			},
			showPie(canvasId, chartData) {
				canvaPie = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'pie',
					fontSize: 11,
					padding: [15, 15, 0, 15],
					legend: {
						show: true,
						padding: 5,
						lineHeight: 11,
						margin: 0,
					},
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					dataLabel: true,
					extra: {
						pie: {
							border: true,
							borderColor: '#FFFFFF',
							borderWidth: 3
						}
					},
				});
			},
			touchPie(e) {
				canvaPie.showToolTip(e, {
					format: function(item) {
						return item.name + ':' + item.data
					}
				});
				canvaPie.touchLegend(e, {
					animation: true
				});
			},
			changeData() {
				if (isJSON(_self.textarea)) {
					let newdata = JSON.parse(_self.textarea);
					canvaPie.updateData({
						series: newdata.series,
						categories: newdata.categories
					});
				} else {
					uni.showToast({
						title: '数据格式错误',
						image: '../../../static/images/alert-warning.png'
					})
				}
			},
			/**
			 * 日期选择变更
			 */
			dateChange(event) {
				_self.date = event.detail.value;
				_self.getServerData();
			},

		}
	}
</script>

<style>
	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}

	.charts {
		width: 750upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
</style>
