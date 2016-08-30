angular.module('starter.controllers', [])

.controller('TodoCtrl', ["$scope","$timeout","$cordovaToast","$cordovaSocialSharing","$ionicModal",
    "$state","$ionicSideMenuDelegate","$ionicActionSheet","$filter","$rootScope",
    "$ionicListDelegate","$ionicPopup","$ionicLoading","Folders","Favorites","Theme",
    function ($scope, $timeout,$cordovaToast, $cordovaSocialSharing,$ionicModal,
                                  $state,$ionicSideMenuDelegate,$ionicActionSheet,$filter,$rootScope,
                                  $ionicListDelegate,$ionicPopup,$ionicLoading, Folders, Favorites,Theme)
{

        //可调用的函数，使用用户输入的标题创建新的文件夹
        var createFolder = function (folderTitle) {
            var newFolder = Folders.newFolder(folderTitle);
            $scope.folders.push(newFolder);
            Folders.save($scope.folders);
            $scope.selectFolder(newFolder, $scope.folders.length - 1);
        };
        // 加载或初始化文件夹
        $scope.folders = Folders.all();
        // 加载或初始化收藏夹
        $scope.favorites = Favorites.all();
        //添加收藏
        $scope.addFavorites = function (note) {
            var exists = false;
            angular.forEach($scope.favorites, function (value, key) {
                if (note.title === value.title && note.content === value.content && note.createTime === value.createTime) {
                    exists = true;
                }
            });
            if (exists) {
                var showAlert = $ionicPopup.alert({
                        title:'<i class="ion-android-warning assertive"></i>',
                        template:'亲，你已经收藏过这篇日记，不需要重复收藏！',
                        okType:'button-'+$scope.currentTheme
                    });
                $timeout(function () {
                    showAlert.close();
                },2000);
                $ionicListDelegate.closeOptionButtons();
            } else {
                $scope.favorites.push(note);
                Favorites.save($scope.favorites);
   /*             var showAddAlert = $ionicPopup.alert({
                    title:'<i class="ion-android-done balanced"></i>',
                    template:'成功添加到收藏夹！！',
                    okType:'button-'+$scope.currentTheme
                });
                $timeout(function () {
                    showAddAlert.close();
                },1500);*/
              var message = "已经加入收藏夹";
              $cordovaToast.show(message,'short','bottom');
                $ionicListDelegate.closeOptionButtons();
            }
        };
        // 标记当前激活的文件夹
        $scope.activeFolder = $scope.folders[Folders.getLastActiveIndex()];
        // 创建新的文件夹
        $scope.newFolder = function () {
            $ionicPopup.show({
                template: '<input type="text" ng-model="isShownData.foldName" max="15" placeholder="文件夹名不能超过15字" autofocus>',
                title: '创建新的文件夹',
                scope: $scope,
                buttons: [
                    { text: '取消' },
                    {
                        text: '<b>保存</b>',
                        type: 'button-'+$scope.currentTheme,
                        onTap: function(e) {
                            if(!$scope.isShownData.foldName){
                                e.preventDefault()
                            }else{
                                createFolder($scope.isShownData.foldName)
                            }
                        }
                    }
                ]
            }).then(function() {
                $scope.isShownData.foldName="";
            });
        };
        // 选择文件夹
        $scope.selectFolder = function (folder, index) {
            $scope.activeFolder = folder;
            Folders.setLastActiveIndex(index);
            $ionicSideMenuDelegate.toggleLeft(false);
        };
        // 下拉刷新日记列表
        $scope.doRefresh = function () {
            console.log($scope.isShownData.theme);
            $scope.$broadcast('scroll.refreshComplete');
        };
        //点击日记进入预览
        $scope.toPreviewNote = function (note,index) {
            $scope.currentNote = note;
            $scope.currentNoteIndex = index;
            $state.go('eventmenu.previewNote');
        };
        //上拉菜单
        $scope.showActionSheet = function (note) {
            var hideSheet = $ionicActionSheet.show({
                buttons:[
                    {text:'<i class="ion-ios-star-outline"></i>添加到收藏夹'},
                    {text:'<i class="ion-edit"></i>编辑'}
                ],
                destructiveText:'<i class="ion-ios-trash-outline"></i><b>删除</b>',
                titleText:'<b>'+note.title+'</b>',
                cancelText:'取消',
                destructiveButtonClicked:function () {
                    hideSheet();
                    $ionicPopup.confirm({
                        title:note.title,
                        template:'<b>你确定要删除这篇日记吗？</b>',
                        cancelText:'取消',
                        okText:'确定',
                        cancelType:'button-'+$scope.currentTheme,
                        okType:'button-defalut'

                    }).then(function (res) {
                        if(res){
                            $state.go('eventmenu.home'),
                            $scope.activeFolder.notes.splice($scope.activeFolder.notes.indexOf(note), 1);
                            Folders.save($scope.folders);
                        }
                    })
                },
                buttonClicked:function (index) {
                    switch(index){
                        case 0:
                            $scope.addFavorites(note);
                            hideSheet();
                            break;
                        case 1:
                            $scope.editNote();
                            hideSheet();
                            break;
                    }
                }
            });
            $timeout(function () {
                hideSheet();
            },3000)
        };
        //点击进入收藏预览
        $scope.toPreviewFavorite = function (favorite,index) {
            $scope.currentFavoriteIndex = index;
            $state.go('eventmenu.previewFavorite');
            $scope.currentFavorite = favorite;
        };
        $scope.showFavoriteActionSheet = function (note) {
            var hideSheet = $ionicActionSheet.show({
                buttons:[
                    {text:'<b>编辑</b>'}
                ],
                titleText:'<b>'+note.title+'</b>',
                cancelText:'取消',
                destructiveButtonClicked:function (note) {

                },
                buttonClicked:function (index) {
                    switch(index){
                        case 0:
                            hideSheet();
                            $scope.editFavorite();
                            break;
                    }
                }
            });
            $timeout(function () {
                hideSheet();
            },3000)
        };
        //启动收藏编辑模型
        $scope.editFavorite = function (){
            $ionicModal.fromTemplateUrl('edit-favorite.html', {
                scope: $scope,
                hardwareBackButtonClose:true,
                animation: 'slide-in-up',
                focusFirstInput:true
            }).then(function(modal) {
                $scope.editFavoriteModal = modal;
                $scope.editFavoriteModal.show();
            });
            $scope.nowTime = $filter("date")(new Date(), 'y/M/d HH:mm');
        };
        //保存收藏，关闭编辑模型，更新视图
        $scope.saveEditFavorite = function () {
            Favorites.save($scope.favorites);
            $scope.editFavoriteModal.remove();
        };
        //取消编辑收藏,撤销数据
        $scope.closeEditFavorite = function () {
            $scope.favorites = Favorites.all();
            $scope.currentFavorite= $scope.favorites[$scope.currentFavoriteIndex];
            $scope.editFavoriteModal.remove();
        };
        // 创建模型，用来输入日记标题内容
        $ionicModal.fromTemplateUrl('new-note.html', {
            scope: $scope,
            hardwareBackButtonClose:true,
            animation: 'slide-in-up',
            focusFirstInput:true
        }).then(function(modal) {
            $scope.noteModal = modal;
        });
        //保存在模型中输入的日记内容
        $scope.createNote = function (note) {
            if (!$scope.activeFolder || !note) {
                return;
            }
            if (note.title) {
                $scope.activeFolder.notes.push({
                    title: note.title,
                    content: note.content,
                    createTime: $scope.nowTime
                });
                $scope.noteModal.hide();
                Folders.save($scope.folders);
                note.title = "";
                note.content = "";
            } else {
                return false;
            }
        };
        //启动模型
        $scope.newNote = function (){
            $scope.noteModal.show();
            $scope.nowTime = $filter("date")(new Date(), 'y/M/d HH:mm');
        };
        //关闭模型
        $scope.closeNewNote = function () {
            $scope.noteModal.hide();
        };
        //启动日记编辑模型
        $scope.editNote = function (){
            $ionicModal.fromTemplateUrl('edit-note.html', {
                scope: $scope,
                hardwareBackButtonClose:true,
                animation: 'slide-in-up',
                focusFirstInput:true
            }).then(function(modal) {
                $scope.editNoteModal = modal;
                $scope.editNoteModal.show();
            });
            $scope.nowTime = $filter("date")(new Date(), 'y/M/d HH:mm');
        };
        //保存日记，关闭编辑模型，更新视图
        $scope.saveEditNote = function () {
            Folders.save($scope.folders);
            $scope.editNoteModal.remove();
        };
        //取消编辑,撤销数据
        $scope.closeEditNote = function () {
            $scope.folders = Folders.all();
            $scope.currentNote = $scope.folders[Folders.getLastActiveIndex()].notes[$scope.currentNoteIndex];
            $scope.activeFolder = $scope.folders[Folders.getLastActiveIndex()];
            $scope.editNoteModal.remove();
        };
        //全局数据
        $scope.isShownData = {
            showDelete: false,
            showSearchOne: false,
            showSearchTwo: false,
            foldName:""
        };
        //获取存储的显示或隐藏日记预览句柄
        $scope.showNotePreview = {
        };
        $scope.showNotePreview.showPre=Theme.getShowNotePreview();
        // 切换显示/隐藏日记预览
        $scope.toggleShowNotePre = function () {
            Theme.setShowNotePreview($scope.showNotePreview.showPre);
        };
        // 获取存储的主题
        $scope.currentTheme = Theme.getTheme();
        // 主题列表
        $scope.themeList = [
            {theme:"positive",text:"默认主题"},
            {theme:"calm",text:"胖次蓝"},
            {theme:"assertive",text:"姨妈红"},
            {theme:"balanced",text:"茶表绿"},
            {theme:"dark",text:"科技黑"},
            {theme:"royal",text:"基佬紫"},
            {theme:"energized",text:"鹅蛋黄"}
        ];
        // 更改主题
        $scope.changeTheme = function (theme) {
                $scope.currentTheme = theme.theme;
                Theme.setTheme(theme.theme);
            $ionicLoading.show({
                template: '<ion-spinner icon="ios"></ion-spinner>',
                noBackdrop:false
            });
            location.reload();
        };
  // 社交分享
  $scope.shareNoteBook = function  () {
    var message = '我正在使用开心云笔记，好用又漂亮，你也来试一下吧！';
    $cordovaSocialSharing
      .share(message, '开心云日记', 'http://img.c-c.com/Timg/2014/12/29/14/gzxyyyxgs1423330776.jpg','http://ccyblog-sources.stor.sinaapp.com/ionicNoteBook.apk') // Share via native share sheet
      .then(function(result) {
        // Success!
      }, function(err) {
        // An error occured. Show a message to the user
      });
  };
        //日记列表页面搜索框的显示/隐藏
        $scope.toggleSearchOne = function () {
            $scope.isShownData.showSearchOne = !$scope.isShownData.showSearchOne;

        };
        //收藏夹页面搜索框的显示/隐藏
        $scope.toggleSearchTwo = function () {
            $scope.isShownData.showSearchTwo = !$scope.isShownData.showSearchTwo;

        };
        // 删除文件夹
        $scope.onFolderDelete = function (folder) {
            if(folder.notes.length===0){
                $scope.folders.splice($scope.folders.indexOf(folder), 1);
                Folders.save($scope.folders);
            }else{
                $ionicPopup.confirm({
                    title:'<b>'+folder.title+'<b/>',
                    template:'此文件夹不为空！<br>你确定要删除这个文件夹以及其中的<b> '+folder.notes.length+' </b>篇日记吗？',
                    cancelText:'算了',
                    okText:'确定',
                    okType:'button-defalut',
                    cancelType:'button-'+$scope.currentTheme
                }).then(function (res) {
                    if(res){
                        $scope.folders.splice($scope.folders.indexOf(folder), 1);
                        Folders.save($scope.folders);
                    }
                })
            }
        };
        //删除文件夹中的日记
        $scope.onNoteDelete = function (note) {
            $scope.activeFolder.notes.splice($scope.activeFolder.notes.indexOf(note), 1);
            Folders.save($scope.folders);
        };
        //删除收藏夹中的日记
        $scope.onFavoriteDelete = function (favorite) {
            $scope.favorites.splice($scope.favorites.indexOf(favorite), 1);
            Favorites.save($scope.favorites);
        };
        //如果没有文件夹，提示用户创建一个文件夹
        $timeout(function () {
            if ($scope.folders.length == 0) {
                    $ionicPopup.show({
                        template: '<input type="text" ng-model="isShownData.foldName" max="15" placeholder="文件夹名不能超过15字" autofocus>',
                        title: '创建你的第一个的文件夹',
                        scope: $scope,
                        buttons: [
                            { text: '取消'},
                            {
                                text: '<b>保存</b>',
                                type: 'button-'+$scope.currentTheme,
                                onTap: function(e) {
                                    if(!$scope.isShownData.foldName){
                                        e.preventDefault();
                                    }else{
                                        createFolder($scope.isShownData.foldName)
                                    }
                                }
                            }
                        ]
                    }).then(function() {
                        $scope.isShownData.foldName="";
                    });
                }
        },1000);

    }])
