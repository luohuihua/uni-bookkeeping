<template>
	<view>
		<view class="cu-bar bg-white solid-bottom">
			<view class='action'>
				<text class='cuIcon-title text-blue'></text>明细清单,左滑删除
			</view>
		</view>
		<!-- 按组使用 -->
		<uni-swipe-action>
			<uni-swipe-action-item :options="options" @click="onClick(item)" @change="change" v-for="(item,index) in datas" :key="index">
				<view class="cu-bar solid-bottom action">
					<!-- <uni-icons :type="item.name" :color="activeIndex === index?'#007aff':'#8f8f94'" size="25" /> -->
					<image :src="item.url1" class="image" />
					<text style="color:#1296db;" class="icon-item-text">{{ item.type }}</text>
					<view class="solid-bottom padding">
						<text class="text-price">{{item.money}}</text>
					</view>
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
	</view>
</template>

<script>
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'

	import {
		callCloudFunction,
		getUserOpenid
	} from '@/common/public_util.js';

	let _self;
	export default {
		components: {
			uniSwipeAction,
			uniSwipeActionItem
		},
		onLoad() {
			_self = this;
		},
		onShow() {
			callCloudFunction('money_query', {
				openid: getUserOpenid(),
			}, (res) => {
				_self.datas = res.data;
			});
		},
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#dd524d'
					}
				}],
				datas: []
			}
		},
		methods: {
			onClick(item, e) {
				callCloudFunction('money_del', item, (res) => {
					uni.showToast({
						icon: "none",
						title: '操作成功',
						duration: 2000
					});
					callCloudFunction('money_query', {
						openid: getUserOpenid(),
					}, (res) => {
						_self.datas = res.data;
					});
				});
			},
			change(open) {
				console.log('当前开启状态：' + open)
			}
		}
	}
</script>

<style>
	.image {
		width: 50rpx;
		height: 50rpx;
	}
</style>
