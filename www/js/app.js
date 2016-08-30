// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

  .run(function ($ionicPlatform, $rootScope, $location, $timeout, $ionicHistory, $ionicPopup, $cordovaToast) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
    $ionicPlatform.registerBackButtonAction(function (e) {
      //判断处于哪个页面时双击退出
      if ($location.path() == '/home') {
        if ($rootScope.backButtonPressedOnceToExit) {
          ionic.Platform.exitApp();
        } else {
          $rootScope.backButtonPressedOnceToExit = true;
          $cordovaToast.showShortTop('再按一次退出应用');
          $timeout(function () {
            $rootScope.backButtonPressedOnceToExit = false;
          }, 2000);
        }
      }
      else if ($ionicHistory.backView()) {
        $ionicHistory.goBack();

      } else   if ($rootScope.backButtonPressedOnceToExit) {
        ionic.Platform.exitApp();
      }else {
        $rootScope.backButtonPressedOnceToExit = true;
        $cordovaToast.showShortTop('再按一次退出应用');
        $timeout(function () {
          $rootScope.backButtonPressedOnceToExit = false;
        }, 2000);
      }
      e.preventDefault();
      return false;
    }, 101);
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    $ionicConfigProvider.platform.ios.tabs.style('standard');
    $ionicConfigProvider.platform.ios.tabs.position('bottom');
    $ionicConfigProvider.platform.android.tabs.style('standard');
    $ionicConfigProvider.platform.android.tabs.position('bottom');

    $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.navBar.alignTitle('center');

    $ionicConfigProvider.platform.ios.backButton.previousTitleText('').icon('ion-ios-arrow-thin-left');
    $ionicConfigProvider.platform.android.backButton.previousTitleText('').icon('ion-android-arrow-back');

    $ionicConfigProvider.platform.ios.views.transition('ios');
    $ionicConfigProvider.platform.android.views.transition('android');
    $stateProvider
      .state('eventmenu', {
        url: "/event",
        templateUrl: "event-menu.html",
        abstract: true,
        controller: "TodoCtrl"
      })
      //主页
      .state('eventmenu.home', {
        url: "/home",
        views: {
          "menuContent": {
            templateUrl: "home.html"
          }
        }
      })
      //收藏夹日记预览
      .state('eventmenu.previewFavorite', {
        url: "/favorite/previewFavorite",
        views: {
          "favoriteContent": {
            templateUrl: "previewFavorite.html",
            params: {'currentFavorite': {}}
          }
        }
      })
      //主页日记预览
      .state('eventmenu.previewNote', {
        url: "/home/previewNote",
        views: {
          "menuContent": {
            templateUrl: "previewNote.html",
            params: {'currentNote': {}}
          }
        }
      })
      //设置页面
      .state('eventmenu.contact', {
        url: "/contact",
        views: {
          'settingsContent': {
            templateUrl: "contact.html"
          }
        }
      })
      //帮助页面
      .state('eventmenu.help', {
        url: "/contact/help",
        views: {
          'settingsContent': {
            templateUrl: "help.html"
          }
        }
      })
      //收藏夹页面
      .state('eventmenu.about', {
        url: "/favorite",
        views: {
          'favoriteContent': {
            templateUrl: "favorite.html"
          }
        }
      })
      //登陆页面
      .state('eventmenu.details', {
        url: "/details",
        views: {
          'menuContent': {
            templateUrl: "details.html"
          }
        }
      });
    $urlRouterProvider.otherwise("/event/home");
  });
