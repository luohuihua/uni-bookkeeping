<template>
	<view>
		<view class="cu-bar bg-white solid-bottom">
			<view class='action'>
				<text class='cuIcon-title text-blue'></text>明细清单,左滑更多操作
			</view>
		</view>
		<!-- 按组使用 -->
		<uni-swipe-action>
			<uni-swipe-action-item :options="options" @click="onClick($event,item)" @change="change" v-for="(item,index) in datas"
			 :key="index">
				<view class="cu-bar solid-bottom action" style="padding-left: 10px;">
					<!-- <uni-icons :type="item.name" :color="activeIndex === index?'#007aff':'#8f8f94'" size="25" /> -->
					<image :src="item.url1" class="image" />
					<text style="color:#1296db;" class="icon-item-text">{{ item.type }}</text>
					<text style="color:#1296db;padding-left: 10px;" class="icon-item-text">{{ item.formatDate }}</text>
					<view class="solid-bottom padding" style="padding-left: 10px;">
						<text class="text-price">{{item.money}}</text>
					</view>
				</view>
			</uni-swipe-action-item>
		</uni-swipe-action>
		<uni-load-more color="#8e8e8e" :status="loadMoreStatus" v-if="isShowLoadMore" iconType="auto" @clickLoadMore="clickLoadMore"
		 :content-text="contentText" />
	</view>
</template>

<script>
	import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue'

	import {
		callCloudFunction,
		getUserOpenid
	} from '@/common/public_util.js';

	let _self;
	export default {
		components: {
			uniSwipeAction,
			uniSwipeActionItem,
			uniLoadMore
		},
		data() {
			return {
				options: [{
						text: '修改',
						style: {
							backgroundColor: '#007dd5'
						}
					},
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					},
				],
				datas: [],
				isShowLoadMore: false, //是否显示上啦加载
				loadMoreStatus: 'more', //上啦加载状态，more加载前，loading加载中，noMore没有更多
				pageNumber: 1, //页码
				pageSize: 10, //加载数量
				contentText: {
					contentdown: '查看更多',
					contentrefresh: '加载中',
					contentnomore: '没有更多'
				},
			}
		},
		onLoad() {
			_self = this;
		},
		onShow() {
			_self.onQuery();
		},
		methods: {
			onClick(e, item) {
				switch (e.index) {
					case 0: //修改
						uni.setStorageSync('modifyDetailed',item);
						uni.switchTab({
							url: '/pages/app/bookkeeping/bookkeeping'
						});
						break;
					case 1: //删除
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
						break;
				}

			},
			change(open) {
				console.log('当前开启状态：' + open)
			},
			clickLoadMore: (e) => { //加载更多
				if (e.detail.status == 'more') {
					_self.pageNumber++;
					_self.onQuery(e);
				}
			},
			onQuery: (e) => {
				if (e == null || e.detail == null || e.detail.status != 'more') {
					_self.pageNumber = 1;
					_self.datas = [];
				}
				_self.isShowLoadMore = true;
				_self.loadMoreStatus = 'loading'; //loading加载中

				callCloudFunction('money_query', {
					openid: getUserOpenid(),
					pageNumber: _self.pageNumber,
					pageSize: _self.pageSize,
				}, (res) => {
					let total = res.total;
					_self.datas = _self.datas.concat(res.data);
					//全部
					if (_self.datas.length >= total) {
						_self.loadMoreStatus = 'noMore'; //noMore没有更多
					} else {
						_self.loadMoreStatus = 'more'; //more加载前
					}
				});
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
