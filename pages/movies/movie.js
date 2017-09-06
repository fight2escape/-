var app = getApp();
var ag = app.globalData;
var util = require('../../utils/util.js');

Page({
    data: {
        movieTop250: {},
        movieInTheaters: {},
        movieComingSoon: {},

        movieContainerShow: true,
        searchPanelShow: false,

        keyInputValue: '',
        movieSearchData: {}
    },
    // 页面加载…………
    onLoad: function () {
        this.loadMoviesData();
    },
    // 点击搜索框
    onSearchFocus: function () {
        this.setData({
            movieContainerShow: false,
            searchPanelShow: true
        });
    },
    // 在搜索框输入时
    onInputChange: function (e) {
        this.setData({
            keyInputValue: e.detail.value
        });
    },
    // 搜索框确认
    onInputConfirm: function () {
        this.setData({
            movieSearchData: {}
        })
        wx.showNavigationBarLoading();
        this.getMovieSearchData();
    },
    // 关闭搜索面板
    onCloseTap: function () {
        this.setData({
            movieContainerShow: true,
            searchPanelShow: false,
            keyInputValue: ''   // 关闭后清空输入框
        });
    },

    // 搜索请求
    getMovieSearchData: function () {
        var that = this;
        wx.request({
            url: ag.g_doubanApiBase + ag.g_movieSearchUrl,
            data: {
                q: this.data.keyInputValue
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'Content-Type': 'application/xml'
            }, // 设置请求的 header
            success: function (res) {
                // success
                console.log(res);
                // grid模板中接收的是data对象
                that.processMovieSearchData(res.data, 'movieSearchData');
                wx.hideNavigationBarLoading();
            }
        });
    },

    // 对搜索的数据做处理
    processMovieSearchData: function (movies, movieStorageKey, url = 'apiUrl') {
        // movies['apiUrl'] = url;    // “更多”的api请求地址
        if (!movies.subjects.length) {
            wx.showToast({
                title: '没有找到'
            });
        } else {
            for (var idx in movies.subjects) {
                var subject = movies.subjects[idx];
                // 超长的标题
                var title = subject.title;
                if (title.length >= 8) {
                    title = title.substring(0, 6) + "...";
                }
                subject['title_less'] = title;
                // 评分星星
                var stars = util.convertToStarsArray(subject.rating.stars);
                subject['rating']['stars_array'] = stars;
            }
            var currentData = {};
            currentData[movieStorageKey] = movies;
            this.setData(currentData);
        }
        // 设置缓存
        // var movieListData = wx.getStorageSync(ag.g_movieListStorageKey) || {};
        // movieListData[movieStorageKey] = movies;
        // wx.setStorageSync(ag.g_movieListStorageKey, movieListData);
    },



    // 加载电影数据
    loadMoviesData: function () {
        wx.showNavigationBarLoading();
        // 获取缓存数据，有则加载，无则请求
        var movieListData = wx.getStorageSync(ag.g_movieListStorageKey);
        if (movieListData[ag.g_movieTop250StorageKey] && movieListData[ag.g_movieInTheatersStorageKey] && movieListData[ag.g_movieComingSoonStorageKey]) {
            this.setData({
                movieTop250: movieListData[ag.g_movieTop250StorageKey],
                movieInTheaters: movieListData[ag.g_movieInTheatersStorageKey],
                movieComingSoon: movieListData[ag.g_movieComingSoonStorageKey]
            });
            wx.hideNavigationBarLoading();
        } else {
            this.getMovieData(ag.g_movieTop250Url, ag.g_movieTop250StorageKey);
            this.getMovieData(ag.g_movieInTheatersUrl, ag.g_movieInTheatersStorageKey);
            this.getMovieData(ag.g_movieComingSoonUrl, ag.g_movieComingSoonStorageKey, true);
        }
    },

    // 获取电影数据
    getMovieData: function (url, movieStorageKey, stopFlag = false) {
        var that = this;
        var dataUrl = ag.g_doubanApiBase + url;
        wx.request({
            url: dataUrl,
            data: {
                'start': 0,
                'count': 3
            },
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: {
                'Content-Type': 'application/xml'
            }, // 设置请求的 header
            success: function (res) {
                // success
                console.log(res);
                that.processMovieData(res.data, movieStorageKey, url);
                if (stopFlag) {
                    wx.hideNavigationBarLoading();
                    wx.stopPullDownRefresh();
                }
            }
        })
    },

    // 对电影数据做处理
    processMovieData: function (movies, movieStorageKey, url = 'apiUrl') {
        movies['apiUrl'] = url;    // “更多”的api请求地址
        for (var idx in movies.subjects) {
            var subject = movies.subjects[idx];
            // 超长的标题
            var title = subject.title;
            if (title.length >= 8) {
                title = title.substring(0, 6) + "...";
            }
            subject['title_less'] = title;
            // 评分星星
            var stars = util.convertToStarsArray(subject.rating.stars);
            subject['rating']['stars_array'] = stars;
        }
        var currentData = {};
        currentData[movieStorageKey] = movies;
        this.setData(currentData);
        // 设置缓存
        var movieListData = wx.getStorageSync(ag.g_movieListStorageKey) || {};
        movieListData[movieStorageKey] = movies;
        wx.setStorageSync(ag.g_movieListStorageKey, movieListData);
    },


    // “更多”跳转
    onMoreMovieTap: function (event) {
        var apiUrl = event.currentTarget.dataset.apiurl;
        var moreUrl = '/pages/movies/movie-more?apiUrl=' + apiUrl;
        wx.navigateTo({
            url: moreUrl
        });
    },

    // 下拉刷新
    onPullDownRefresh: function () {
        // 清空数据重新请求
        wx.removeStorage({ key: ag.g_movieListStorageKey });
        this.loadMoviesData();
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