App({

    globalData: {
        g_isPlayingMusic: false,
        g_currentPostId: null,
        // 豆瓣API
        g_doubanApiBase: 'https://api.douban.com/v2',
        g_movieTop250Url: '/movie/top250',
        g_movieInTheatersUrl: '/movie/in_theaters',
        g_movieComingSoonUrl: '/movie/coming_soon',
        g_movieSearchUrl: '/movie/search',
        g_movieOneUrl: '/movie/subject/',

        // 缓存key
        g_movieListStorageKey: 'movieListData',
        g_movieTop250StorageKey: 'movieTop250',
        g_movieInTheatersStorageKey: 'movieInTheaters',
        g_movieComingSoonStorageKey: 'movieComingSoon',

    },


})