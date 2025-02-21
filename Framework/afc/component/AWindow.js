/**
 *	@author asoocool
 * 
 */

class AWindow extends AContainer
{
	constructor(containerId)
	{
		super(containerId)
	
		this.modalBg = null;	//모달용 배경 div

		this.isOpenActionDelay = true;


		//show 함수 호출시 delay 를 주었는지
		this.isDelayShow = false; 
		//사라지면서 터치한 정보가 하위 컨테이너에게 전달되는 것을 시간 지연을 통해서 막음.
		this.isDisableTime = true;

		//init 함수에서 초기화 함
		//AContainer 로 옮겨짐
		//this.option = {};

		/*
		if(afc.andVer<4.4) 
		{
			//4.3 이하에서만 작동
			this.option.isPreventTouch = true;
		}
		*/

		//this.resultListener = null;
	}

	

}

window.AWindow = AWindow


//--------------------------------------------------------------------------------
//	static area
//--------------------------------------------------------------------------------

AWindow.BASE_ZINDEX = 1000;

//팝업된 AWindow 객체들을 모아 둔다.
AWindow.wndList = [];

//top window has the max z-index 
AWindow.topWindow = null;

//AWindow.wndList 에 윈도우를 추가한다.
//윈도우 오픈 시 내부적으로 자동 호출해 준다.
AWindow.addWindow = function(awnd)
{
	var length = AWindow.wndList.length;

	//이미 존재하는지 체크
	for(var i=0; i<length; i++)
	{
		if(AWindow.wndList[i]===awnd) return false;
	}
	
	AWindow.wndList.push(awnd);
	return true;
};

//AWindow.wndList 에서 윈도우를 제거한다.
//윈도우 close 시 내부적으로 자동 호출해 준다.
AWindow.removeWindow = function(awnd)
{
	var length = AWindow.wndList.length;

	for(var i=0; i<length; i++)
	{
		if(AWindow.wndList[i]===awnd)
		{
			AWindow.wndList.splice(i,1);
			break;
		}
	}
};

// @deprecated, use AContainer.findOpenContainer
AWindow.findWindow = function(cntrId)
{
	var length = AWindow.wndList.length, retWnd = null;

	for(var i=0; i<length; i++)
	{
		retWnd = AWindow.wndList[i];
		
		if(retWnd.getContainerId()==cntrId) return retWnd;
	}
	
	return null;
};


//보여지고 있는 윈도우 중에서 최상단 윈도우에게 backKey 이벤트를 전달한다.
//디바이스에서 backKey 가 눌려지면 자동으로 호출된다. 
AWindow.reportBackKeyEvent = function()
{
	var topWnd = AWindow.getTopWindow();

	if(topWnd) return topWnd.onBackKey();

	return false;
};

//오픈된 윈도우들에게 resize 이벤트를 전달한다.
//네이티브 WebView 의 사이즈가 변경되면 자동으로 호출된다.
/*
AWindow.reportResizeEvent = function()
{
	var length = AWindow.wndList.length;

	for(var i=0; i<length; i++)
		AWindow.wndList[i].onResize();
};
*/

AWindow.reportMoveCenter = function()
{
	var length = AWindow.wndList.length;
	var wnd;
	for(var i=0; i<length; i++)
	{
		wnd = AWindow.wndList[i];
		if(wnd.option.isCenter) wnd.moveToCenter();
	}
};

AWindow.getTopWindow = function()
{
	return AWindow.topWindow;
};

//close 나 hide 가 호출되면 z-index 를 0 으로 셋팅한 후 updateTopWindow 가 호출된다.
AWindow.updateTopWindow = function()
{
	var toTopWnd = null, length = AWindow.wndList.length, max = 0, tmp;

	//hide 된 윈도우까지 값을 비교해도 됨.
	for(var i=0; i<length; i++)
	{
		//asoocool test
		//if(AWindow.wndList[i].option.isAbsolute) continue;
	
		tmp = Number(AWindow.wndList[i].$ele.css('z-index'));
		
		//console.log( '(' + max + ', ' + tmp +')' );

		if(max<tmp)
		{
			toTopWnd = AWindow.wndList[i];
			max = tmp;
		}
	}
	
	//마지막 윈도우가 닫히면서 호출될 경우, 더이상의 윈도우가 없으면 toTopWnd 는 null 이 될 수 있다.
	AWindow.makeTopWindow(toTopWnd);
};

//---------------------------------------------------------------------------------------------
//modalBg 및 윈도우의 z-index 변경 로직과 container 의 active, deactive 이벤트를 발생시켜준다.
//toTopWnd 		: 최상위로 활성화 될 윈도우, null 이 될 수도 있으며 deactive 이벤트만 발생
//isFirst 		: 최초 오픈 시점인지
AWindow.makeTopWindow = function(toTopWnd, isFirst)
{
	//새로운 toTopWnd 가 활성화 되면서 현재 AWindow.topWindow 는 비활성화 된다.
	//최초 윈도우가 띄워지는 경우 deactWnd 는 null 이 된다.
	
	var deactWnd = AWindow.topWindow, zIndex = AWindow.BASE_ZINDEX;
	
	if(deactWnd===toTopWnd) return;
	
	//활성, 비활성 이벤트를 발생시켜줄 지 여부
	//활성 또는 비활성되는 창이 참인 경우만 호출...
	var isActive = 	 Boolean(toTopWnd);
	var isDeactive = Boolean(deactWnd);
	
	//1) 비활성화 창이 null 일 수 있으므로 비교하고, 2) 비활성창의 부모가 활성화 되는 경우, 3) 비활성창이 inParent 옵션으로 열렸으면
	//부모가 활성화되어도 비활성창이 그 앞에 그대로 보여지므로 결국 변화가 없는 것이므로 이벤트를 발생시키지 않는다.
	isActive &= !(deactWnd && deactWnd.getParent()===toTopWnd && deactWnd.option.inParent);
	//위와 같은 이유로... 
	isDeactive &= !(toTopWnd && toTopWnd.getParent()===deactWnd && toTopWnd.option.inParent);
	
	if(isActive) toTopWnd.onWillActive(isFirst, deactWnd);
	if(isDeactive) deactWnd.onWillDeactive(toTopWnd);
	
	//최초 윈도우가 띄워지는 경우 AWindow.topWindow 가 null 이 될 수 있다.
	if(isDeactive) 
	{
		zIndex = Number(deactWnd.$ele.css('z-index')) + 2;	//비활성 윈도우보다 2단계 높게, modalBg 자리를 비워둠
	
		//topWindow 에서 close 가 호출되면 z-index 를 0 으로 셋팅한 후 updateTopWindow 가 호출된다.
		//즉, deactWnd의 zIndex 가 0이면 곧 닫힐 윈도우이다.
		//그런 경우는 z-index 를 deactWnd의 의 값을 기준으로 셋팅해선 안되고 현재 자신의 값을 유지하면 된다.
		
		if(zIndex==2 && toTopWnd) zIndex = toTopWnd.$ele.css('z-index');
	}
	
	//활성화되는 창이 부모 element 안에 있는 경우는 부모의 z-index 를 변경해야 한다.
	if(isActive) 
	{
		var tmp = toTopWnd;
		
		//비활성화되는 창의 z-index 값보다 높은값을 추가하는 것이므로 isDeactive 가 참인 경우만
		while(isDeactive && tmp)
		{
			//부모 엘리먼트가 같을 때까지 검색
			if(tmp.option.inParent && tmp.element.parentNode!==deactWnd.element.parentNode)
			{
				tmp = tmp.getParent();
				
				//SubFolder 프로퍼티 세팅되어 다른 웹 프로젝트에 서브로 세팅되어 동작되는 경우
				//tmp의 부모컴포넌트가 존재하지 않을 수 있으므로 예외처리한다.
				if(!tmp)
				{
					tmp = toTopWnd;
					break;
				}
			}
			else break;
		}

		//APage 등, 즉 AWindow 가 아닌 컨테이너는 z-index 값이 셋팅되지 않도록
		if(tmp && tmp instanceof AWindow) tmp.$ele.css('z-index', zIndex);

        toTopWnd.$ele.css('z-index', zIndex);
	}
	
	//if(isActive) toTopWnd.$ele.css('z-index', zIndex);
	
	AWindow.topWindow = toTopWnd;
	
	//모달 다이얼로그인 경우 modalBg 의 z-index 도 변경시켜준다.	
	if(isActive && toTopWnd.option.isModal) 
	{
		if(toTopWnd.modalBg) toTopWnd.modalBg.css('z-index', zIndex-1);
		else toTopWnd.modalManage(zIndex-1);
	}
	
	if(isActive) toTopWnd.onActive(isFirst, deactWnd);
	if(isDeactive) deactWnd.onDeactive(toTopWnd);
	
	//topWindow 가 close 되는 경우는 setTimeout 을 주면 안됨. 
	//윈도우가 먼저 클로즈 된 후 onDeactiveDone 이 호출되어 $ele 가 null 인데도 _callSubActiveEvent 함수를 호출한다.
	
	if(zIndex>2) setTimeout(_active_done_helper, 0);
	else _active_done_helper();
	
	function _active_done_helper()
	{
		if(isActive && toTopWnd.isValid() ) toTopWnd.onActiveDone(isFirst, deactWnd);
		if(isDeactive && deactWnd.isValid() ) deactWnd.onDeactiveDone(toTopWnd);
	}
	
};

//개발중에 AWindow open 할 경우 z-index가 공유되지 않아 윈도우가 뒤로 뜨는 버그 수정
if(window.afc_)
{
	AWindow.addWindow = AWindow_.addWindow;
	AWindow.removeWindow = AWindow_.removeWindow;
	AWindow.getTopWindow = AWindow_.getTopWindow;
	AWindow.updateTopWindow = AWindow_.updateTopWindow;
	AWindow.makeTopWindow = AWindow_.makeTopWindow;
}

//---------------------------------------------------------------------------------------------

AWindow.prototype.init = function(context)
{
	//-------------------------------------------------------------------------------
	//	isModal 은 모바일인 경우만 (ios 브라우저 등에서) 
	//	윈도우 밑(뒤)에 있는 화면에 터치 액션이 전달되는 버그가 있으므로 기본값을 true 로 한다.
	//	isModal 이 true 이면 windowTouchBugFix 에서 부모를 disable 시켜 오류를 방지한다.
	//	모달리스로 셋팅을 하게 되면 ios 에서는 터치 액션이 배경에 전달됨. --> 차후 이 경우도 처리 필요.
	
	this.setOption(
	{
		//isModal: afc.isMobile,		//모바일이면 기본을 modal 로 셋팅, 위에 설명 참조.
		isModal: false,				//윈도우 모달/모달리스 여부, 위에 설명 참조.
		isCenter: false,			//자동 중앙정렬 할지
		isFocusLostClose: false,	//모달인 경우 포커스를 잃을 때 창을 닫을지
		isFocusLostHide: false,		//모달인 경우 포커스를 잃을 때 창을 숨길지
		modalBgOption: afc.isMobile ? 'dark' : 'none',		//none, light, dark 모달인 경우 배경을 어둡기 정도
		overflow: 'hidden',			//hidden, auto, visible, scroll
		dragHandle: null,			//드래가 핸들이 될 클래스명이나 아이디, .windowHandle or #windowHandle
		isResizable: false,			//윈도우 창을 리사이즈 가능하게 할지
		isDraggable: false,			//윈도우 창을 드래그로 움직이게 할지
		inParent: true,				//부모 컨테이너 안에 창을 띄울 경우, 모달리스(isModal:false)이고 부모를 클릭해도 항상 부모보다 위에 보이게 하려면 이 값을 true 로 셋팅해야 한다.
		focusOnInit: true,			//init될때 자동으로 윈도우의 첫번째 컴포넌트(tabIndex기준)에 포커스
		//activePropagation: true		//윈도우가 활성화 될 때 컨테이너의 active 호출여부(onWillActive, onActive, onActiveDone)
		
	}, true);

	//	no overwrite 가 true 이기 때문에 init 위에 두어야 한다.
	//------------------------------------------------------------

	AContainer.prototype.init.call(this, context);
	
	
	//타이틀을 만든다던가....등등의 태그 생성 작업
	
	//afc.log('AWindow init');
	
	
	if(theApp.webHistoryMgr) theApp.webHistoryMgr.setHistoryTarget(this.getContainerId(), this);
	
};

AWindow.prototype.onCreate = function()
{
	AContainer.prototype.onCreate.call(this);

	if(this.option.isCenter) this.moveToCenter();
	
    if(this.option.isDraggable) this.enableDrag();
	if(this.option.isResizable) this.enableResize();

	this.windowTouchManage();
	
	this.$ele.css( { 'overflow':this.option.overflow });
	
};

AWindow.prototype.setDragOption = function(key, value)
{
	if(this.option.isDraggable) 
	{
		this.$ele.draggable('option', key, value);
	}
};

AWindow.prototype.setResizeOption = function(key, value)
{
	if(this.option.isResizable) 
	{
		this.$ele.resizable('option', key, value);
	}
};

AWindow.prototype.onDragStart = function(event, ui)
{

};

AWindow.prototype.onDragStop = function(event, ui)
{
    //상단은 외부로 나가지 않도록
    if(ui.position.top<25) this.moveY(25);
};

AWindow.prototype.onResize = function()
{
	//if(this.option.isCenter) this.moveToCenter();

	AContainer.prototype.onResize.call(this);
};


AWindow.prototype.enableDrag = function()
{
    //윈도우를 오픈한 이후에 옵션을 켤 수도 있으므로 변수값을 셋팅한다.
    this.option.isDraggable = true;
    
    var dragOpt = 
    {
        scroll: false,
        //containment: 'window'
    };
    
    if(this.option.dragHandle) dragOpt.handle = this.option.dragHandle;

    this.$ele.draggable(dragOpt);
    
    var thisObj = this;
    
    //drag start
    this.setDragOption('start', function(event, ui)
    {
        thisObj.onDragStart(event, ui);
    });
    
    this.setDragOption('stop', function(event, ui)
    {
        thisObj.onDragStop(event, ui);
    });
};

AWindow.prototype.enableResize = function()
{
    //윈도우를 오픈한 이후에 옵션을 켤 수도 있으므로 변수값을 셋팅한다.
    this.option.isResizable = true;

    var thisObj = this;
    this.$ele.resizable(
    {
        handles: 'all',
        resize: function(event, ui)
        {
            //ui.size.height = Math.round( ui.size.height / 30 ) * 30;
            thisObj.onResize();
        },
        stop: function(event, ui)
        {
			//상단은 외부로 나가지 않도록
			let top = 0;
            if(ui.position.top < top) thisObj.moveY(top);
        }
    });
    
    //resizable 을 호출하면 position 값이 바뀌므로 다시 셋팅해 준다.
    this.$ele.css('position', 'absolute');

};

AWindow.prototype.setResultListener = function(resultListener)
{
	this.resultListener = resultListener;
};

AWindow.prototype.setResultCallback = function(callback)
{
	this.callback = callback;
};

AWindow.prototype.moveToCenter = function()
{
    var w = this.getWidth()/2;
    var h = this.getHeight()/2;

    var cenX = 'calc(50% - ' + w +'px)';
    var cenY = 'calc(50% - ' + h +'px)';
    
    this.move(cenX, cenY);
};

//This is deprecated, use setOption
AWindow.prototype.setWindowOption = function(option, noOverwrite)
{
	for(var p in option)
    {
		if(!option.hasOwnProperty(p)) continue;
		
		if(!noOverwrite || this.option[p]==undefined)
		{
			this.option[p] = option[p];
		}
    }
};

AWindow.prototype.setModalBgOption = function(option)
{
	this.option.modalBgOption = option;

	if(this.option.modalBgOption=='light') this.modalBg.css('background-color', 'rgba(0, 0, 0, 0.3)');
	else if(this.option.modalBgOption=='dark') this.modalBg.css('background-color', 'rgba(0, 0, 0, 0.5)');
	else this.modalBg.css('background-color', '');
};


//window buf fix
/*
AWindow.prototype.windowTouchBugFix = function(isOpen)
{
	if(!afc.isMobile || afc.isIos) return;
	
	if(isOpen)
	{
		//IOS UIWebOverflowContentView BugFix
		if(afc.isIos && window.AppManager) AppManager.touchDelay();
		
		this.isDisableTime = true;
		
		var isActionDelay = (!afc.isIos && this.isOpenActionDelay);
		
		//이전 윈도우가 사라지면서 자신을 띄웠을 때, 이전 윈도우가 터치한 정보가 자신에게 전달되는 것을 막음.
		//아이폰에서는 this.actionDelay('input'); 이 작동하지 않는다.
		//actionDelay 호출 때문에...ios 웹브라우저에서는 윈도우 자체 스크롤이 안되고 배경이 스크롤되는 버그가 발생한다.
		//그럴 경우 actionDelay 가 호출되지 않도록 한다.
		if(isActionDelay) this.actionDelay();
		
		//자신을 띄운 하위 컨테이너에게 터치 정보가 전달되는 것을 막음. 
		if(this.option.isModal)
		{
			if(++this.parent.disableCount==1)
			{
				this.parent.enable(false);
			}
			
			//actionDelay 가 호출된 경우는 delay 후에 풀어 주므로 
			if(!isActionDelay)
			{
				//자식인 자신도 disable 되므로 자신은 풀어준다.
				this.enable(true);
			}
			
			this.modalBg.css('pointer-events', 'auto');
		}
	}
	
	//close
	else
	{
		var thisObj = this;

		//IOS UIWebOverflowContentView BugFix
		if(afc.isIos && window.AppManager) AppManager.touchDelay();
		
		if(this.option.isModal)
		{
			//사라지면서 터치한 정보가 하위 컨테이너에게 전달되는 것을 시간 지연을 통해서 막음.
 			if(this.isDisableTime) setTimeout(_closeHelper, afc.DISABLE_TIME);
			//Disable delay가 없는 경우
 			else _closeHelper();
 			
		}
		else
		{
			//모달리스인 경우는 띄울 때 배경을 disable 시키지 않으므로 
			//닫을 때 터치 정보가 배경으로 전달된다. 그렇기 때문에 닫힐 경우 무조건 disable 시킨 후
			//활성화 시켜준다.
			if(++this.parent.disableCount==1) this.parent.enable(false);
			setTimeout(_closeHelper, afc.DISABLE_TIME);
		}
		
		
		function _closeHelper()
		{
			if(!thisObj.parent.isOpen()) return;

			if(--thisObj.parent.disableCount==0)
			{
				//var $ele = thisObj.parent.get$ele();
				//$ele.find('input').css('pointer-events', 'auto');
				//$ele.css('pointer-events', 'auto');

				thisObj.parent.enable(true);
			}
		}
		
	}
};
*/

AWindow.prototype.windowTouchManage = function()
{
	var thisObj = this;
	
    AEvent.bindEvent(this.element, AEvent.ACTION_DOWN, function(e)
    {
		e.stopPropagation();
		
		if(thisObj.isValid()) AWindow.makeTopWindow(thisObj);
    });
};

//android 4.3 이하, BugFix
//배경으로 터치 전달되어 스크롤되는 버그
AWindow.prototype.preventTouch = function()
{
/*
	if(afc.andVer>4.3) return;
	
    AEvent.bindEvent(this.element, AEvent.ACTION_DOWN, function(e)
    {
		e.preventDefault();
		e.stopPropagation();
    });
	*/
};

//윈도우가 모달 모드인 경우의 처리
AWindow.prototype.modalManage = function(zIndex)
{
	this.modalBg = $('<div class="_modal_bg_"></div>');
	this.modalBg.css({
		'width':'100%', 'height':'100%',
		'position':'absolute',
		'top':'0px', 'left':'0px',
		'z-index':zIndex, 
		//아래 값이 inherit 되어 none 값이 세팅되면 모달 뒷부분에 포인터 이벤트가 전달되므로 auto로 지정한다.
		'pointer-events': 'auto'
	});
	
	if(this.option.isModal)
	{
		if(this.option.modalBgOption=='light') this.modalBg.css('background-color', 'rgba(0, 0, 0, 0.3)');
		else if(this.option.modalBgOption=='dark') this.modalBg.css('background-color', 'rgba(0, 0, 0, 0.5)');
	}

	//현재 활성화된 브라우저의 body 에 Element 를 추가하기 위해
	var fApp = AApplication.getFocusedApp();

	if(this.option.inParent) this.parent.$ele.append(this.modalBg);
	else fApp.rootContainer.$ele.append(this.modalBg);

	//modalBg의 enable 로는 바로 닫히는 경우는 해결가능하지만 기존에 떠있는 윈도우가 있는 경우
	//enable 되기전에 클릭시 기존 윈도우의 z-index가 높게 설정되어 Top으로 위치하게 되는 버그가 있어 이벤트를 나중에 바인드하게 수정(setTimeout)
	//위의 로직은 윈도우A, B, C 가 있는 경우 A가 B를 띄우면서 B가 Top Window가 되지만 A에서 빠르게 두번 버튼을 클릭하게 되면
	//A가 Top Window가 되고 C를 띄우게 되면 B와 C의 z-index가 동일해져 C가 안보이게 되는 현상이 있어 이벤트는 바로 바인드하고 시간으로 막는다.
	var thisObj = this;
	var appendTime = Date.now();
	AEvent.bindEvent(thisObj.modalBg[0], AEvent.ACTION_DOWN, function(e) {
	
		e.preventDefault();
		e.stopPropagation();

		//오픈
		if(appendTime + afc.DISABLE_TIME > Date.now()) return;

		if(thisObj.option.isFocusLostClose) 
		{
			thisObj.isDisableTime = false;

			//close가 호출되어 modalBg afc.DISABLE_TIME 이후에 제거되는데
			//그전에 ACTION_DOWN이 호출되면 close가 또 발생되므로 isValid로 체크한다.
			//unbindEvent 를 하는 방법도 생각해 볼 것.
			if(thisObj.isValid()) thisObj.close();
		}
		else if(thisObj.option.isFocusLostHide) 
		{
			thisObj.isDisableTime = false;
			thisObj.hide();
		}
	});

/*
	//화면에서 클릭시 닫는 로직이 있는 경우 이벤트가 전달되어 바로 닫히는 현상이 있어 enable로 처리
	this.enable(false);
	setTimeout(()=> { if(this.isValid()) this.enable(true); }, afc.DISABLE_TIME);
	*/
};

//다이얼로그와 같은 속성으로 윈도우를 오픈한다.
AWindow.prototype.openAsDialog = function(viewUrl, parent, width, height)
{
	//var bgOpt = '';
	
	//if(afc.isPC) bgOpt = 'none';
	//else bgOpt = 'light';
	
	this.setOption(
	{
		isModal: true,
		isCenter: true,
		//modalBgOption: bgOpt
	});
	
	return this.open(viewUrl, parent, 0, 0, width, height);
};

//팝업메뉴와 같은 속성으로 윈도우를 오픈한다.
AWindow.prototype.openAsMenu = function(viewUrl, parent, width, height)
{
	this.setOption(
	{
		isModal: true,
		isCenter: true,
		isFocusLostClose: true,
	});
	
	return this.open(viewUrl, parent, 0, 0, width, height);
};

AWindow.prototype.openCenter = function(viewUrl, parent, width, height)
{
	this.setOption(
    {
		isCenter: true
    });
	
	return this.open(viewUrl, parent, 0, 0, width, height);
};


AWindow.prototype.openFull = function(viewUrl, parent)
{
	return this.open(viewUrl, parent, 0, 0, '100%', '100%');
};



//	윈도우 창을 연다.
//
AWindow.prototype.open = async function(viewUrl, parent, left, top, width, height)
{
	await AContainer.prototype.open.call(this, viewUrl, parent, left, top, width, height);
	
	//부모 wndList 에 추가. 닫힐 때 같이 닫아주기 위함
	if(this.option.inParent) this.parent.addWindow(this);
	
    //전역 wndList 에 추가
	AWindow.addWindow(this);
	
	AWindow.makeTopWindow(this, true);
	
	//modalBg 가 생성된 후 호출되어야 하므로 makeTopWindow 이후에 호출
	//this.windowTouchBugFix(true);

	if(theApp.webHistoryMgr) theApp.webHistoryMgr.pushHistory({target:this.getContainerId(), id:this.getContainerId()});
};

/*
AWindow.prototype.setView = function(view, isFull)
{
	AContainer.prototype.setView.call(this, view, isFull);
	
	//윈도우에 한해서 뷰터치시 포커스를 준다.
	this.view.actionToFocusComp();
};
*/

//윈도우 창을 닫는다.
//----------------------------------------------------------
//	result function
//	function onWindowResult(result, awindow);
//----------------------------------------------------------

AWindow.prototype.close = function(result, data)
{
	var thisObj = this;
	//현재는 최상위 z-index 이지만 
	//곧 닫힐 윈도우이기 때문에 정렬에서 맨 하위가 되도록 0을 셋팅한다.
	this.$ele.css('z-index', 0);
	
	AWindow.updateTopWindow(this);
	
	//--------------------------------

	AContainer.prototype.close.call(this, result, data);
	
	//this.windowTouchBugFix(false);
	
	if(this.option.isModal) 
	{
		this.modalBg.remove();
	 	this.modalBg = null;
	}
	
	//부모 wndList 에서 제거
	if(this.option.inParent) this.parent.removeWindow(this);
	
	//전역 wndList 에서 제거
	AWindow.removeWindow(this);
	
	if(this.resultListener) 
	{
		setTimeout(function()
		{
			thisObj.resultListener.onWindowResult(result, data, thisObj);
		}, 10);
	}
	
	if(this.callback)
	{
		setTimeout(function()
		{
			thisObj.callback(result, data);
		}, 10);
	}
	
	//result -909 is from WebHistoryManager
	if(theApp.webHistoryMgr && result!=-909) theApp.webHistoryMgr.popHistory();
};

AWindow.prototype.show = function(delay)
{	
	//this.windowTouchBugFix(true);
	
	AWindow.makeTopWindow(this);	
	
	if(this.option.isModal) this.modalBg.show();
	
    if(delay==undefined) this.$ele.show();
	else
    {
      	var thisObj = this;
       	thisObj.isDelayShow = true;

       	setTimeout(function() 
       	{
       		if(thisObj.isDelayShow) 
       			thisObj.$ele.show();
       	}, delay);
    }

};

AWindow.prototype.hide = function()
{
	this.isDelayShow = false;
	
	//this.windowTouchBugFix(false);
	
	this.$ele.css('z-index', 0);
	
	AWindow.updateTopWindow(this);
	
    this.$ele.hide();
	
	if(this.option.isModal) this.modalBg.hide();
};

/*
AWindow.prototype.restore = function()
{

};

AWindow.prototype.minimize = function()
{

};

AWindow.prototype.maximize = function()
{

};
*/

AWindow.prototype.move = function(x, y)
{
	if(!isNaN(x)) x += 'px';
	if(!isNaN(y)) y += 'px';
	
	this.$ele.css( { 'left':x, 'top':y });
};

AWindow.prototype.moveX = function(x)
{
	if(!isNaN(x)) x += 'px';
	this.$ele.css('left', x);
};

AWindow.prototype.moveY = function(y)
{
	if(!isNaN(y)) y += 'px';
	this.$ele.css('top', y);
};

AWindow.prototype.offset = function(x, y)
{
	var pos = this.getPos();
	this.$ele.css( { 'left':(pos.left+x)+'px', 'top':(pos.top+y)+'px' });
};

AWindow.prototype.onBackKey = function()
{
	this.close();
	return true;
};



