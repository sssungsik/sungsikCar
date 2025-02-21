
/**
 * @author asoocool
 */

class AApplication
{
	constructor()
	{
		//this.navigator = null;

		this.rootContainer = null;		//응용프로그램이 시작되는 최상위 컨테이너, 화면을 표현하지는 않는다. mainContainer 의 부모 컨테이너 역할만 한다.
		this.mainContainer = null;		//루트 컨테이너 밑으로, 화면을 표현하는 시작 컨테이너 
		this.rootElement = null;

		//this.indicator = null;
		this.orientation = 'portrait';

		//this.appContainer = null;
		this.curPath = null;

		//this.resPool = null;
		this.mdiManager = null;

		this.keyDownListeners = null;
		this.keyUpListeners = null;

	}

}

window.AApplication = AApplication

//현재 활성화된 브라우저의 body 에 Element 를 추가하기 위해 필요한 변수
AApplication.focusedBrowser = window;

AApplication.getFocusedApp = function()
{
    return AApplication.focusedBrowser.theApp;
};

AApplication.prototype.unitTest = function(unitUrl)
{
//console.log('unitTest : ' + unitUrl);

	//if(this.mainContainer) this.mainContainer.close();

	//this.rootContainer.$ele.children().remove();
	
	//this.setMainContainer(new APage('unit'));
	//this.mainContainer.open(unitUrl);
	
	
	//this.rootContainer.$ele.children().hide();
	
	var cntr = new APage('unit');
	cntr.open(unitUrl);
};


AApplication.prototype.onReady = function()
{
	this.setCurrentPath();

	//라이브러리 추가시 동적으로 생성
	//
	if(window['ResPool']) this.resPool = new ResPool();
	//if(window['MDIManager']) this.mdiManager = new MDIManager();
	if(window['WebHistoryManager']) 
	{
		this.webHistoryMgr = new WebHistoryManager();
		this.webHistoryMgr.init();
	}
	//-------------------------

	this.rootContainer = new AContainer();

    
    if(!this.rootElement)
    {
        if(PROJECT_OPTION.build.subName) 
        {
            this.rootElement = document.querySelector('._global_style_')
        }

        if(!this.rootElement) this.rootElement = document.querySelector('body')
    }

    //onReady 이전에 직접 원하는 Element 를 셋팅할 수도 있음.
    else this.rootElement = $(this.rootElement)[0];
	
	this.rootContainer.init(this.rootElement, true);	//default is body
	
	//edge 소수점 전화번호 인식 버그 수정
	this.rootContainer.$ele.attr('x-ms-format-detection','none');
	
	/*
	if(afc.isPC)
	{
		//pc 버전용 글로벌 스크롤 스타일 추가
		this.rootContainer.$ele.addClass('_global_scroll_style_');
	}
	*/
	
	if(this.isLoadTheme) this.loadThemeInfo();

	//키보드 이벤트 초기화
	this.initKeyEvent();
	
	var windowHeight = $(window).height(),
		_originalSize = $(window).width() + windowHeight, isKeypadVisible = false,
		_originalViewport = document.querySelector("meta[name=viewport]").content;
		
	//console.log('--> ' + windowHeight + ',' + _originalSize);

    var thisObj = this;
    window.addEventListener('orientationchange', function()
    {
		//console.log("... orientationchange ...");
		
		//PC 로 로드된 뒤에 디버그창에서 Mobile로 변경시에는 
		//키보드매니저가 추가되지 않아 에러가 나므로 새로고침 해준다.
		if(!window.KeyboardManager)
		{
			console.log('We need to reload.');
			location.reload();
			return;
		}
		
		var _cntr = KeyboardManager.container;
		
		if(_cntr && _cntr.isValid() && KeyboardManager.resizeWebview) KeyboardManager.restoreHeight(_cntr);
		
      	switch (window.orientation) 
      	{
        	case 0: //portrait
        	case 180:
        		thisObj.orientation = 'portrait';
				windowHeight = $(window).width();	//반대값을 저장해야 실제 회전된 후의 값이 된다.
          	break;
          	
        	case 90: 
        	case -90: //landscape
        		thisObj.orientation = 'landscape';
				windowHeight = $(window).height();	//반대값을 저장해야 실제 회전된 후의 값이 된다.
          	break;
          	
        	default:
	            //viewport.setAttribute('content', 'width=' + vpwidth + ', initial-scale=0.25, maximum-scale=1.0;')
          	break;
      	}
		
    }, false);
	
    window.addEventListener('resize', function(e)
    {
		//키보드가 떠 있는 상태에서 오리지날 사이즈를 변경하게 되면 문제가 생길 수 있으므로 비교한다.
		if(!isKeypadVisible)
		{
			//마지막으로 originalSize가 저장된 viewport 정보와 다른 경우 originalSize를 갱신한다.
            var metaViewPort = document.querySelector("meta[name=viewport]");

            if(metaViewPort)
            {
                var curViewport = metaViewPort.content;
                if(_originalViewport != curViewport)
                {
                    windowHeight = $(window).height();
                    _originalSize = $(window).width() + windowHeight;
                    _originalViewport = curViewport;
                    
                    //originalSize를 변경했기 때문에 아래의 키보드 오픈은 되지 않는다.
                }
            }
		}
	
		var isResize = true;
		
		//#########################################################
		// 아이폰의 경우 키패드가 올라올 때, resize 가 발생하지 않는다.
		// 아이폰인 경우, 다음 키패드 로직을 타면 안됨
		
		//모든 모바일 브라우저, native 의 경우도 adjustResize 일 경우 발생한다.
		if(afc.isMobile && !afc.isIos)
		{
			var wh = $(window).height(), ww = $(window).width();
			
			//console.log('====> ' + ww + ',' + wh + ',' + _originalSize);
			
			//# 키패드가 올라 오는 경우
			//키패드 없이, 가로/세로 모드 전환 시 2픽셀 정도 차이가 날 수 있으므로 
			//if(ww+wh!=_originalSize) 이렇게 비교하면 안됨. 좀 더 차이가 날 경우 수치를 조정한다.
			if(Math.abs(ww+wh - _originalSize) > 2)
			{
				//console.log("keyboard show up");
				
				isResize = false;			//키패드에 의해 리사이즈 이벤트가 발생된 경우는 reportEvent 를 전송하지 않는다.
				isKeypadVisible = true;
				
				KeyboardManager.onKeyBoardShow(wh, windowHeight - wh);
			}
			
			//# 키패드가 사라지는 경우
			else if(isKeypadVisible)
			{
				//console.log("keyboard closed");
				
				isResize = false;			//키패드에 의해 리사이즈 이벤트가 발생된 경우는 reportEvent 를 전송하지 않는다.
				isKeypadVisible = false;

				KeyboardManager.onKeyBoardHide();
				
				AWindow.reportMoveCenter();
			}
			
			windowHeight = wh;
		}
		
		// resize를 해도 되는 경우에만 resize 처리한다.
		// 키패드에 의해 리사이즈 이벤트가 발생된 경우는 reportEvent 를 전송하지 않는다.
		if(isResize)
		{
			/*
			AWindow.reportResizeEvent();

			if(theApp.mainContainer)
				theApp.mainContainer.onResize();

			else ANavigator.reportResizeEvent();
			*/
			
			theApp.rootContainer.onResize();
		}

    });	

    if(afc.isSimulator) this.enableHotReload();

};

//현재 응용프로그램의 작업 디렉토리 셋팅
AApplication.prototype.setCurrentPath = function()
{
	var curPath = decodeURI(window.location.pathname);
	
    if(afc.isWindow) 
    {
    	curPath = AUtil.extractLoc(curPath.replace(/[/]/g, afc.DIV));
    	//this.curPath = curPath.slice(1, curPath.length);
		this.curPath = curPath.slice(1);
    }
    //mac, linux
    else 
    {
    	curPath = AUtil.extractLoc(curPath);
    	//this.curPath = curPath.slice(0, curPath.length);
		//this.curPath = curPath.slice(0);
		this.curPath = curPath;
    }
};

//다음 세 함수는 필요한 경우
//실제 응용 프로그램(~App.cls)에서 상황에 맞게 재구현한다.

//index.html location
AApplication.prototype.getCurrentPath = function()
{
	return this.curPath;
};

//user data path to write something
AApplication.prototype.getDataPath = function()
{
	return this.curPath;
};

//exe file path
AApplication.prototype.getProcessPath = function()
{
	return this.curPath;
};


//android 의 백키 터치시 기본적으로 처리해 줘야 할 것들. 
//true를 리턴하면 받는 곳에서 아무처리도 하지 않도록 한다.
AApplication.prototype.onBackKeyManage = function()
{
    if(AWindow.reportBackKeyEvent()) return true;
    
    /*
    if(this.navigator.canGoPrev())
    {
        this.navigator.goPrevPage(true);
        return true;
    }
    */
   
   /*
   //asoocool
   	var page = this.navigator.getActivePage();
   	if(page && page.onBackKey()) return true;
	*/
	
	return ANavigator.reportBackKeyEvent();
};

AApplication.prototype.getOrientation = function()
{
	return this.orientation;
};

/*
AApplication.prototype.getCurrentPage = function()
{
	//asoocool
	//return this.navigator.getActivePage();
	return null;
};
*/

AApplication.prototype.setMainContainer = function(container)
{
	this.mainContainer = container;
};

AApplication.prototype.getMainContainer = function()
{
	return this.mainContainer;
};

AApplication.prototype.getRootContainer = function()
{
	return this.rootContainer;
};


AApplication.prototype.getActiveContainer = function()
{
	if(this.mdiManager) return this.mdiManager.getActiveContainer();
	else return null;
};

AApplication.prototype.getActiveView = function()
{
    var childContainer = this.getActiveContainer();
    if(childContainer) return childContainer.getView();
    else return null;
};

AApplication.prototype.getActiveDocument = function()
{
    var childContainer = this.getActiveContainer();
    if(childContainer) return childContainer.getView().getDocument();
    else return null;
};

AApplication.prototype.changeActiveMdiManager = function(mdiManager)
{
	this.mdiManager = mdiManager;
	
};

/* 
//------------------------------------------------------------------
var docTmpl = 
{
	containerClass: 'MDIPage',
	documentClass: 'MDIDocument',
	viewUrl: 'views/MainPageView.lay',
	extNames: ['txt','js','cls'],
};
//------------------------------------------------------------------
*/

AApplication.prototype.openDocTmplFile = async function(filePath, noLoad, bSilent)
{
	if(!this.mdiManager) return null;
	
	return await this.mdiManager.openDocContainer(filePath, null, noLoad, bSilent);
};

AApplication.prototype.saveActiveDocTmplFile = function()
{
	if(!this.mdiManager) return false;
	
	var doc = this.getActiveDocument();
	if(doc) this.mdiManager.saveDocContainer(doc.uri);
};

AApplication.prototype.closeActiveDocTmplFile = function(callback, isForce, isSave)
{
	if(!this.mdiManager) return false;
	
	var doc = this.getActiveDocument();
	if(doc) this.mdiManager.closeDocContainer(doc.uri, callback, isForce, isSave);
	else if(callback) callback(-1);
};

AApplication.prototype.initKeyEvent = function()
{
	var keyDownListeners = this.keyDownListeners = [],
		keyUpListeners = this.keyUpListeners = [];

	$(document).keydown(function(e)
	{
		//리스너는 메인윈도우의 리스너를 바라보게
		if(theApp.isSharedIFrame) keyDownListeners = opener.window.theApp.keyDownListeners;
		
		if(afc.isMac) e.ctrlKey = e.metaKey;

		var listener = null;
		for(var i=keyDownListeners.length-1; i>-1; i--)
		{
			//이전 onKeyDown 에서 리스너가 삭제될 수도 있으므로 null 비교를 해야함.
			listener = keyDownListeners[i];
			
			//onKeyDown 함수에서 true 를 리턴하면 다른 리스너에게 더 이상 전달되지 않는다.
			//마지막에 추가된 리스너가 우선적으로 호출된다.
			if(listener && listener.onKeyDown(e)) break;
		}
	});

	$(document).keyup(function(e)
	{
		//리스너는 메인윈도우의 리스너를 바라보게
		if(theApp.isSharedIFrame) keyUpListeners = opener.window.theApp.keyUpListeners;
		
		if(afc.isMac) e.ctrlKey = e.metaKey;

		var listener = null;
		for(var i=keyUpListeners.length-1; i>-1; i--)
		{
			//이전 onKeyUp 에서 리스너가 삭제될 수도 있으므로 null 비교를 해야함.
			listener = keyUpListeners[i];
			
			//onKeyUp 함수에서 true 를 리턴하면 다른 리스너에게 더 이상 전달되지 않는다.
			//마지막에 추가된 리스너가 우선적으로 호출된다.
			if(listener && listener.onKeyUp(e)) break;
		}
	});
	
};

AApplication.prototype.addKeyEventListener = function(type, listener)
{
	//기존에 추가된 것이 있으면 제거
	this.removeKeyEventListener(type, listener);

	//마지막에 추가된 리스너가 우선적으로 호출 되도록 
	if(type=='keydown') this.keyDownListeners.push(listener);
	//keyup
	else this.keyUpListeners.push(listener);
};

AApplication.prototype.removeKeyEventListener = function(type, listener)
{
	var keyListeners = this.keyUpListeners;
	
	if(type=='keydown') keyListeners = this.keyDownListeners;

	if(!keyListeners) return;
	
   	for(var i=0; i<keyListeners.length; i++)
	{
		if(keyListeners[i]===listener)
		{
			keyListeners.splice(i,1);
			break;
		}
	}
};



AApplication.prototype.onClose = function()
{
	return true;
};



AApplication.prototype.onError = function(message, url, lineNumber, colNumber, error)
{
	if(window['AIndicator']) AIndicator.hide();
	
	var totMsg = message + ', Line - ' + lineNumber + ', ' + url + ' ====> ' + error.stack;
	
	//AfcMessageBox('error', totMsg);
    alert(totMsg);
	
	return totMsg;
};

AApplication.prototype.loadThemeInfo = function()
{
	var pre = '';
	if(PROJECT_OPTION.build.subName) pre = PROJECT_OPTION.build.subName + '/';
	
	theApp.themeInfo = {};
	
    $.ajax(
    {
        url: pre + 'Template/Theme/themeInfo.inf',
        dataType: 'text',
        success: function(jsonStr)
        {
			try
			{
				theApp.themeInfo = JSON.parse(jsonStr);
			}
			catch(e){}
			
			var theme = theApp.themeInfo.activeTheme;
			if(theme)
			{
				//기존에 값을 클리어 해주고 changeTheme 를 해야 제대로 작동
				//theApp.setTheme();
				theApp.changeTheme(theme);
			}
		},
        
        error: function() 
        {
        }
    });
};

AApplication.prototype.changeTheme = function(theme)
{
	var curTheme = this.getTheme();
	
	//asoocool
	//이 비교를 하는게 성능상 유리한데... 잘 작동하는지 kb 프로젝트에서 테스트 해보기
	
	//if(curTheme != theme)
	{
		var i, info;
		if(curTheme)
		{
			info = theApp.themeInfo[curTheme];
			for(i=0; i<info.length; i++)
			{
				afc.removeCss(info[i]);
			}
		}
		
		info = theApp.themeInfo[theme];
		for(i=0; i<info.length; i++)
		{
			afc.loadCss(info[i]);
		}
		
		this.setTheme(theme);

		this.reportThemeEvent(curTheme, theme);
	}
};

AApplication.prototype.getTheme = function()
{
	return this.themeInfo.activeTheme;
};

AApplication.prototype.setTheme = function(theme)
{
	this.themeInfo.activeTheme = theme;
};

AApplication.prototype.reportThemeEvent = function(preTheme, curTheme)
{
	var event = document.createEvent('CustomEvent');
	event.initCustomEvent('themechange', false, false, {preTheme: preTheme, curTheme: curTheme});
	//e.detail = {preTheme: preTheme, curTheme: curTheme}
	window.dispatchEvent(event);
};

AApplication.prototype.addThemeEventListener = function(callback)
{
	window.addEventListener('themechange', callback);
};

AApplication.prototype.removeThemeEventListener = function(callback)
{
	window.removeEventListener('themechange', callback);
};

///////////////////////////////////////////////////////////////
// hot reload 

AApplication.prototype.enableHotReload = function()
{
    this.hrfs = nodeRequire('fs');
    this.watchers = {};
};

AApplication.prototype.disableHotReload = function()
{
    this.hrfs = null;

    for(let info of this.watchers)
    {
        if(info.watcher) info.watcher.close()
    }

    this.watchers = undefined;
};

AApplication.prototype.isHotReload = function()
{
    return this.hrfs;
};

AApplication.prototype._watchHelper = function(aview, path, isJs)
{
    let timer, info = this.watchers[path];

    //변경 감시를 이미 하고 있으면 
    if(info)
    {
        //변경시 리로드할 뷰 추가, 하나의 lay 파일로 여러개의 뷰가 생성될 수 있으므로
        info.views.push(aview)

        //console.log('already - ' + path + ' : ' + info.views.length)
    }

    //새롭게 변경 감시를 시작하는 경우
    else
    {
	    var pre = '';
	    if(PROJECT_OPTION.build.subName) pre = PROJECT_OPTION.build.subName + '/';

        info = 
        {
            watcher: null,
            views: []
        }

        this.watchers[path] = info

        //변경시 리로드할 뷰 추가, 하나의 lay 파일로 여러개의 뷰가 생성될 수 있으므로
        info.views.push(aview)

        //console.log(path + ' : ' + info.views.length)
        
        //변경시 감지할 파일을 등록한다.
        info.watcher = this.hrfs.watch(__dirname+'/'+ pre + path, (event, fileName) =>
        {
            if(event=='change')
            {
                if(timer) clearTimeout(timer);

                //운영체제의 변경 감지 이벤트를 사용하므로
                //변경 감지 이벤트가 여러번 발생한다. 
                //타임아웃을 이용하여 0.7초 안에 다시 발생하는 변경 감지는 무시한다.
                timer = setTimeout(async function() 
                {
                    //console.log('change ---- ' + fileName)
                    timer = null

                    //뷰와 연결된 자바스크립트 파일이 변경되면
                    //js도 다시 로드하고 연관된 뷰도 다시 로드한다.
                    if(isJs) await afc._loadScriptWait(path, true);  //true, 무조건 강제 로드

                    let cntr, view;
                    //파일 변경과 연관된 모든 뷰들을 리로드한다.
                    //info.views.forEach((view)=>

                    for(let i=0; i<info.views.length; i++)
                    {
                        view = info.views[i]

                        //owner가 탭뷰인 경우 탭에 로드된 뷰만 다시 로드
                        if(window.ATabView && view.owner instanceof ATabView)
                        {
                            let tabView = view.owner,
                                tab = tabView.getTabByUrl(aview.url)
                            
                            if(tab)
                            {
                                tabView.clearTabContent(tab)
                                tabView._loadTabContent(tab)
                            }
                            else
                            {
                                console.log('parent loading... ' + aview.url)
                            }
                        }

                        //그 외 컨테이너(APage, AWindow, APanel...)의 뷰나 
                        //리스트뷰, 슬라이드뷰 등은 자신의 컨테이너를 다시 로드한다.
                        else
                        {
                            cntr = view.getContainer()
                            if(cntr && cntr.view) cntr.setView(cntr.view.url)
                        }

                        //위의 reload 과정에서 소멸되면 에서 삭제되면
                        //unWatchFile 함수에서 info.views 의 원소가 삭제된다.
                        if(!view.isValid()) 
                        {
                            //console.log('setView remove from view')
                            i--;
                        }
                    }

                }, 700);
            }
        });

    }
};

AApplication.prototype.watchReloadFile = function(aview)
{
    let url = aview.url,
        htmlPath = url.replace('.lay', '.html'),
        jsPath = url.substring(0, url.lastIndexOf(".")) + '.js';

    this._watchHelper(aview, htmlPath);
    this._watchHelper(aview, jsPath, true);
};

AApplication.prototype._unWatchHelper = function(aview, path)
{
    let info = this.watchers[path];

    //변경 감시 객체가 있으면 
    if(info)
    {
        for(let i=0; i<info.views.length; i++)
        {
            if(info.views[i]===aview)
            {
                info.views.splice(i, 1)
                break
            }
        }

        //console.log('unWatchFile : ' + path + ' : ' + info.views.length)

        //더이상 등록된 뷰가 없으면
        if(info.views.length==0)
        {
            if(info.watcher) info.watcher.close()
            delete this.watchers[path]
        }
    }
};

AApplication.prototype.unWatchFile = function(aview)
{
    let url = aview.url,
        htmlPath = url.replace('.lay', '.html'),
        jsPath = url.substring(0, url.lastIndexOf(".")) + '.js';

    this._unWatchHelper(aview, htmlPath);
    this._unWatchHelper(aview, jsPath);
};




//---------------------------------------------------------------------------------
//	called from native


function onCloseApp()
{
	setTimeout(function()
	{
		if(theApp.onClose()) 
		{
			if(afc.isExec) window.exec(null, null, 'AppPlugin', 'CloseApp', []);
			else if(afc.isNwjs) theApp.nwWin.close(true);
			else if(afc.isElectron)
			{
				var wnd = theApp.elecRemote.getCurrentWindow();
				theApp.forceClose = true;
				wnd.close();
			}
			else window.close();
		}
		
	}, 0);
}

//native open event
function onOpenDocument(filePath)
{
	
}

/*
async function AfcMessageBox(title, message, type, callback, modaless)
{
	if(!window['AMessageBox']) return null;
	
	var wnd = new AMessageBox();
	wnd.setOption({isModal: !modaless});
	await wnd.openBox(null, message, type, callback);
	wnd.setTitleText(title);
	
	return wnd;
}
*/



