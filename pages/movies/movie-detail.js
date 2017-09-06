// pages/movies/movie-detail.js
var app = getApp();
var ag = app.globalData;
var util = require('../../utils/util.js');

Page({
  data:{
    movie:{}
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var id = options.id;
    var movieOneUrl = ag.g_doubanApiBase + ag.g_movieOneUrl + id;
    wx.request({
      url: movieOneUrl,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       header: {
          'Content-Type': 'application/xml'
       }, // 设置请求的 header
      success: function(res){
        console.log(res);
        that.processData(res.data);
       
      }
    })
  },
  // 进一步处理数据
  processData: function(subject){
      var stars = util.convertToStarsArray(subject.rating.stars);
      subject['rating']['stars_array'] = stars;
      console.log(subject);
      this.setData({
        movie : subject
      });
  },


})