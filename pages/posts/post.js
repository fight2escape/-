// require必须使用相对路径
var postsData = require("../../data/posts-data.js");
var postsSwiper = require("../../data/posts-swiper-data.js");

Page({
    data: {
    },
    onLoad: function (options) {
        // 生命周期函数--监听页面加载

        this.setData({
            post_key: postsData.postList,
            post_swiper_key: postsSwiper.postSwiperList
        });
    },

    // 文章列表点击跳转
    onPostListTap: function (event) {
        var postId = event.currentTarget.dataset.postid;
        wx.navigateTo({
            url: "/pages/posts/post-detail?id=" + postId
        })
    },

    // 轮播图点击跳转
    onSwiperTap: function (event) {
        console.log("onSwiperTap");
        var targetId = event.target.dataset.postid;
        wx.navigateTo({
            url: "/pages/posts/post-detail?id=" + targetId
        })
    },


})