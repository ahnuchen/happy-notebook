angular.module('starter.services', [])

// 文件夹内容和当前激活的文件架本地存储服务
    .factory('Folders', function () {
        return {
            all: function () {
                var foldString = window.localStorage['folders'];
                if (foldString) {
                    return angular.fromJson(foldString);
                }
                return [];
            },
            save: function (folders) {
                window.localStorage['folders'] = angular.toJson(folders);
            },
            newFolder: function (folderTitle) {
                // Add a new folder
                return {
                    title: folderTitle,
                    notes: []
                };
            },
            getLastActiveIndex: function () {
                return parseInt(window.localStorage['lastActiveFolder']) || 0;
            },
            setLastActiveIndex: function (index) {
                window.localStorage['lastActiveFolder'] = index;
            }
        }
    })
    // 收藏夹本地存储服务
    .factory('Favorites', function () {
        return {
            all: function () {
                var favoriteString = window.localStorage['favorites'];
                if (favoriteString) {
                    return angular.fromJson(favoriteString);
                }
                return [];
            },
            save: function (favorites) {
                window.localStorage['favorites'] = angular.toJson(favorites)
            }
        }
    })
    //主题本地存储&显示日记预览本地存储
    .factory('Theme',function () {
        return {
                getTheme:function () {
                    var themeString = window.localStorage.getItem('settedTheme');
                    if(themeString){
                        return themeString;
                    }
                    return "positive";
                },
                setTheme:function (e) {
                    window.localStorage.setItem('settedTheme',e);

                },
            getShowNotePreview:function () {
                    var showString = window.localStorage.getItem('settedShow');
                 if(showString){
                     return showString;
                 }
                    return 'isShow'
            },
            setShowNotePreview:function (e) {
                window.localStorage.setItem('settedShow',e)
            }
            }
    })
    //二级路由隐藏底部导航栏指令
    .directive('hideTabs',function ($rootScope) {
        return {
            restrict: 'AE',
            scope: false,
            link: function ($scope) {
              $rootScope.hideTabs = 'tabs-item-hide';
              $scope.$on('$destroy',function () {
                $rootScope.hideTabs = '';
              })
            }
        }
    });
