var postData = require("../../data/posts-data.js");
var app = getApp();
var ag = app.globalData;

Page({
    data: {
        isPlayingMusic: false,
        postId: null,
        postOne: {},
        collected: false,
    },
    onLoad: function (option) {
        // 获取相应的文章数据
        var postId = option.id;
        var postOne = postData.postList[postId];
        this.setData({
            postId: postId,
            postOne: postOne
        });

        // 收藏按钮显示
        // 先查看是否有数据缓存
        var postCollectedList = wx.getStorageSync("postCollectedList");
        // 有缓存数据
        if (postCollectedList) {
            var collected = postCollectedList[postId];
            // 之前未看过则为null，更新缓存
            if (collected == null) {
                postCollectedList[postId] = false;
                wx.setStorageSync('postCollectedList', postCollectedList);
                collected = false;
            }
            this.setData({
                collected: collected
            })
            // 没有缓存，先初始化
        } else {
            postCollectedList = {};
            postCollectedList[postId] = false;
            wx.setStorageSync('postCollectedList', postCollectedList);
        }
        if (ag.g_isPlayingMusic && ag.g_currentPostId == postId) {
            this.setData({
                isPlayingMusic: true
            })
        }
        this.onMusicMonitor();
    },

    // 音乐控制监听
    onMusicMonitor: function () {
        var that = this;
        // 播放时
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isPlayingMusic: true
            });
            ag.g_isPlayingMusic = true;
            ag.g_currentPostId = that.data.postId;
        });
        // 暂定时
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isPlayingMusic: false
            });
            ag.g_isPlayingMusic = false;
            ag.g_currentPostId = null;
        });
        // 停止或播放完
        wx.onBackgroundAudioStop(function () {
            that.setData({
                isPlayingMusic: false
            });
            ag.g_isPlayingMusic = false;
            ag.g_currentPostId = null;
        })
    },



    // 收藏事件
    onCollectionTap: function (event) {
        // this.getPostCollectedSync();
        this.getPostCollectedAsc();
    },

    // 同步处理收藏
    getPostCollectedSync: function () {
        var that = this;
        // 获取缓存数据
        var postCollectedList = wx.getStorageSync('postCollectedList');
        var postCollected = postCollectedList[that.data.postId];
        // 取反后
        postCollected = !postCollected;
        // 在交互反馈中 绑定数据更新状态+缓存
        // that.showModal(postCollectedList,postCollected);        
        that.showToast(postCollectedList, postCollected);
    },

    // 异步处理收藏
    getPostCollectedAsc: function () {
        var that = this;
        wx.getStorage({
            key: "postCollectedList",
            success: function (res) {
                // res.data
                // 获取缓存数据
                var postCollectedList = res.data;
                var postCollected = postCollectedList[that.data.postId];
                // 取反后
                postCollected = !postCollected;
                // 在交互反馈中 绑定数据更新状态+缓存
                // that.showModal(postCollectedList,postCollected);        
                that.showToast(postCollectedList, postCollected);
            }
        })
    },


    // 确认框
    showModal: function (postCollectedList, postCollected) {
        var that = this;
        wx.showModal({
            title: "收藏",
            content: postCollected ? "收藏此文章？" : "确定要取消收藏？",
            showCancel: true,
            cancelText: postCollected ? "点错了" : "俺点错了",
            cancelColor: "#666",
            confirmText: postCollected ? "收了" : "嗯！",
            success: function (res) {
                if (res.confirm) {
                    // 绑定数据更新状态
                    that.setData({
                        collected: postCollected
                    })
                    // 更新缓存
                    postCollectedList[that.data.postId] = postCollected;
                    wx.setStorageSync('postCollectedList', postCollectedList);
                }
            }

        })
    },

    // 提示框
    showToast: function (postCollectedList, postCollected) {
        // 绑定数据更新状态
        this.setData({
            collected: postCollected
        })
        // 更新缓存
        postCollectedList[this.data.postId] = postCollected;
        wx.setStorageSync('postCollectedList', postCollectedList);
        // 提示
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消收藏",
            icon: "success",
            duration: 1000
        });
    },





    // 分享按钮
    onShareTap: function (event) {
        var itemList = [
            "分享给QQ好友",
            "分享给微信好友",
            "分享到微博",
            "分享到慕课"
        ];
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "blue",
            success: function (res) {
                // res.tapIndex
                wx.showModal({
                    title: "分享",
                    content: itemList[res.tapIndex]
                })
            }
        })
    },

    // 音乐开关
    onMusicTap: function () {
        var isPlaying = this.data.isPlayingMusic;
        var postId = this.data.postId;
        var musicOne = postData.postList[postId].music;
        if (isPlaying) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic: false
            });
        } else {
            wx.playBackgroundAudio({
                dataUrl: musicOne.url,
                title: musicOne.title,
                coverImgUrl: musicOne.coverImg
            });
            this.setData({
                isPlayingMusic: true
            });
        }
    }
})