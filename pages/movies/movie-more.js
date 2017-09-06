// pages/movies/movie-grid/movie-grid.js
var app = getApp();
var ag = app.globalData;
var util = require("../../utils/util.js");

Page({
  data: {
    moviesData: {},
    apiUrl: '',
    page: 0,
    moviesDataKey: ''

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var apiUrl = options.apiUrl;
    this.data.apiUrl = apiUrl;
    this.getStorageKey();
    // 获取缓存数据,有则加载，无则请求
    var moviesData = wx.getStorageSync(this.data.moviesDataKey) || false;
    if (moviesData) {
      // 绑定数据，设置标题
      this.setData({
        moviesData: moviesData,
        page: moviesData.page
      });
      wx.setNavigationBarTitle({
        title: moviesData.title
      });
    } else {
      this.getMoviesData();
    }
  },

  // 本栏缓存key
  getStorageKey: function () {
    var moviesDataKey = '';
    switch (this.data.apiUrl) {
      // 不同的URL对应不同的key
      case ag.g_movieTop250Url:
        moviesDataKey = ag.g_movieTop250StorageKey;
        break;
      case ag.g_movieInTheatersUrl:
        moviesDataKey = ag.g_movieInTheatersStorageKey;
        break;
      case ag.g_movieComingSoonUrl:
        moviesDataKey = ag.g_movieComingSoonStorageKey;
        break;
    }
    this.data.moviesDataKey = moviesDataKey;
  },

  // 访问对应API获取数据
  getMoviesData: function () {
    // 显示Loading后发送请求
    this.showLoading();
    var that = this;
    var dataUrl = ag.g_doubanApiBase + this.data.apiUrl;
    wx.request({
      url: dataUrl,
      data: {
        'start': this.data.page * 30,
        'count': 30
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/xml'
      }, // 设置请求的 header
      success: function (res) {
        // success
        that.processData(res.data);
      }
    });
  },

  // 对收到的数据进行处理
  processData: function (data) {
    console.log(data);
    // 获取缓存数据
    var moviesData = wx.getStorageSync(this.data.moviesDataKey);
    // 如果是首次访问，设置标题并初始化，之后的上划刷新不必再浪费资源重复设置
    if (!moviesData) {
      var moviesData = {};
      moviesData['title'] = data.title;
      moviesData['subjects'] = {};
      wx.setNavigationBarTitle({
        title: data.title,
      });
    }
    // 停止请求的标志，已超过总量则停止，防止API被过分调用阻塞网络
    if ((data.start + data.count) >= data.total) {
      moviesData['stopGet'] = 1;
    }
    // 记录api请求的页码，否则返回后再次进入后，则是从第1页开始请求
    moviesData['page'] = this.data.page;
    // 开始处理电影标题和星星
    var movies = data.subjects;
    // 获取缓存中已有的电影数量做索引
    var lengthOfData = Object.keys(moviesData.subjects);
    lengthOfData = lengthOfData.length;
    // 逐条进行处理
    for (var idx in movies) {
      var movie = movies[idx];
      var title = movie.title;
      if (title.length >= 8) {
        title = title.substring(0, 6) + "...";
      }
      movie['title_less'] = title;
      var stars = util.convertToStarsArray(movie.rating.stars);
      movie['rating']['stars_array'] = stars;
      // 逐条添加数据进缓存
      moviesData['subjects'][lengthOfData++] = movie;
    }
    // 更新数据和缓存
    this.setData({
      moviesData: moviesData
    });
    wx.setStorageSync(this.data.moviesDataKey, moviesData);
    wx.hideToast();
    // }

  },

  // 显示加载中
  showLoading: function () {
    wx.showToast({
      title: "加载中……",
      icon: "loading",
      duration: 10000
    });
  },

  // 上划加载更多
  onReachBottom: function () {
    console.log("onReachBottom");
    if (this.data.moviesData.stopGet) {
      wx.showToast({
        title: "没有更多资讯了",
        duration: 1500
      })
    } else {
      this.data.page += 1;
      this.getMoviesData();
    }
  },

  //下拉刷新
  onPullDownRefresh: function () {
    console.log("onPUllDownRefresh");
    // 异步删除缓存
    wx.removeStorage({ key: this.data.moviesDataKey });
    // 重新设置数据页码从第一页开始
    this.data.page = 0;
    this.getMoviesData();
    wx.stopPullDownRefresh();
  },

  // 跳转到详情页
  showMovieDetail: function(event){
      // console.log(event);
        var id = event.currentTarget.dataset.id;
        var detailUrl = '/pages/movies/movie-detail?id=' + id;
        wx.navigateTo({
          url: detailUrl
        })
  }

})