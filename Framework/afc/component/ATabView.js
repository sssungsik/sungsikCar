         
/**
 * @author asoocool
 */

class ATabView extends AComponent
{
	constructor()
	{
		super()
	
		this.delegator = null;

		this.tabArea = null;
		this.tabContents = null;
		this.tabBtnTpl = null;

		this.isRefresh = false;

		//this.isAnimation = false;
		//this.slideDir = 'left';	//changeAnimation 이 slide 일 경우 사용된다.

		//this.tabHeight = '22px';	//asoocool_20180426
		//this.paddingX = '40px';
		//this.paddingY = '20px';
		this.selectedTab = null;
		//바로 이전에 선택되었던 탭
		this.oldTab = null;
		this.lastSelectedTabId = null;

		this.isTabChanging = false;	//탭이 변경되고 있는 중인지

		this.btnStyles = ['',''];
	}

    _includeView(view, inx)
    {
        this.addTab(view.getName(), view, view.getComponentId())
    }

}

window.ATabView = ATabView


ATabView.CONTEXT = 
{
    tag: '<div data-base="ATabView" data-class="ATabView" class="ATabView-Style" data-state="0" >'+
	        '<div class="tab_area">'+
	            '<span class="ATabView_select">tab1</span>'+
	            '<span class="ATabView_deselect">tab2</span>'+
	            '<span class="ATabView_deselect">tab3</span>'+
			'</div>'+
    		'<div class="tab_contents"></div>'+
	      '</div>',

    defStyle: 
    {
        width:'380px', height:'240px'
    },

    events: ['swipe']
};



ATabView.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

	this.tabArea = this.$ele.find('.tab_area');
	this.tabContents = this.$ele.find('.tab_contents');
	this.tabBtnTpl = this.tabArea.children().eq(1).clone(); 

	//기본 옵션
	this.setOption(
    {
        contentReload: false,    //탭이 변경될 경우 컨텐츠를 다시 로드할 지
		enableAnimation: false,
        changeAnimation: 'slide',    //fade, slide
		slideDir: 'left',
		sameTabCheck: true,
		deactiveGone: true			//탭이 비활성화 될 경우 gone 시킬 지(돔 트리에서 제거), false 는 돔트리에는 남겨 놓고 hidden 만 시킨다.
									//false 는 탭전환이 좀 더 빠르지만 탭이 많아질 경우 element 가 지속적으로 쌓여 element 의 추가/제거가 느려지는 등의 성능저하가 온다.
									//true 는 탭이 많아져도 성능의 저하는 없지만 활성/비활성화 되는 탭 내의 element 가 많을 경우 탭전환이 느려진다.
		
    }, true);

	//this.tabHeight = this.tabArea.css('height');	//asoocool_20180426

	var styles = [this.getAttr('data-style-tabselect'), this.getAttr('data-style-tabnormal')];
	this.setBtnStyle(styles);
	//if(attrArr) this.setBtnStyle(attrArr.split('|'));
	
	//히스토리 사용여부 또는 웹히스토리 강제사용여부 값으로 히스토리 활성화처리
	if(this.getAttr('data-tab-history') ||
		(theApp.webHistoryMgr && WebHistoryManager.isForceTabViewHistory)) this.enableHistory(true);
	
	

	//개발 모드가 아니면
	if(!this.isDev())
	{
		this.tabArea.children().remove();
		
		var tabInfos = this.getMultiAttrInfo('data-tabinfo-'), infoArr, tmp, index=0, arr = {};
		
		if(tabInfos)
		{
			for(var key in tabInfos)
			{
				tmp = tabInfos[key].split(',')[3];
				if(tmp) arr[tmp] = tabInfos[key];
				else arr[index++] = tabInfos[key];
			}

			for(var i in arr)
			{
				infoArr = arr[i].split(',');
				this.addTab(infoArr[1], infoArr[2], infoArr[0]);
			}

			var thisObj = this;

			AUtil.safeDelay(this, function()
			{
				var selTabId = thisObj.$ele.attr('data-tab-select');
				if(selTabId) thisObj.selectTabById(selTabId);
				
			}, 0);

			
		}
	}

//	if(this.tabArea.css('visibility')=='hidden') this.hideTabArea();
};

ATabView.prototype.setOption = function(option, noOverwrite)
{
	AComponent.prototype.setOption.call(this, option, noOverwrite);

	if(option['deactiveGone']==true)
	{
		this.getAllTabs().each(function()
    	{
        	$(this.content).css(
			{
				display: 'none',
				visibility: '', 
				height: '100%'
			});
    	});
	}
	else if(option['deactiveGone']==false)
	{
		this.getAllTabs().each(function()
    	{
			$(this.content).css(
			{
				display: '',
				visibility: 'hidden', 
				height: '0px'
			});
    	});
	}
	
};

//----------------------------------------------------------
//	* delegate functions *
//	function beforeTabChanging(oldView, newView, isFirst, tabview);
//	function tabChanging(oldView, newView, isFirst, tabview);
//	function afterTabChanged(oldView, newView, isFirst, tabview);
//----------------------------------------------------------

ATabView.prototype.setDelegator = function(delegator)
{
	this.delegator = delegator;
};


ATabView.prototype.setSlideDir = function(dir)
{
	//this.slideDir = dir;
	
	this.option.slideDir = dir;
};

//use setOption({enableAnimation: true});
ATabView.prototype.enableAnimation = function(enable)
{
	//this.isAnimation = enable;
	
	this.option.enableAnimation = enable;
};

//deprecated, use setOption
ATabView.prototype.setTabOption = function(option)
{
    for(var p in option)
    { 
        if(option[p]!=undefined)
            this.option[p] = option[p];
    }
};

//asoocool_20180426
ATabView.prototype.showTabArea = function()
{
	var tabHeight = this.tabArea.height();
	
    this.tabArea.show();
	this.tabContents.css('height', 'calc(100% - '+ tabHeight +'px)');
};

ATabView.prototype.hideTabArea = function()
{
	this.tabArea.hide();
	this.tabContents.css('height', '100%');
};

/*
ATabView.prototype.getTabAreaHeight = function()
{
	if(!this.tabArea.is(":visible")) return 0;
    else return this.tabArea.height();
};
*/

ATabView.prototype.addTabEx = function(tabInfo)
{
	return this.addTab(tabInfo.name, tabInfo.url, tabInfo.tabId, tabInfo.data, tabInfo.oneshot);//, tabInfo.isActive);//, tabInfo.asyncCallback);
};

ATabView.prototype.addTabWithLoad = async function(name, url, tabId, data, oneshot, isActive)
{
	var tabEle = this.addTab(name, url, tabId, data, oneshot);
	
	await this._loadTabContent(tabEle, isActive);
	
	return tabEle;
};

//탭컨트롤 내부에 탭버튼을 추가한다. url 은 탭버튼 클릭시 보여줄 컨텐츠이다. 
//asyncCallback 은 boolean or function 이 값이 참이면 비동기로 로드한다.
ATabView.prototype.addTab = function(name, url, tabId, data, oneshot)//, isActive)//, asyncCallback)
{
    //탭버튼 템플릿을 복사하여 추가한다.
   	var tabObj = this.tabBtnTpl.clone();
   	tabObj.text(name);
   	
    this.tabArea.append(tabObj);
	
	var tabEle = tabObj[0];

    var content = $('<div></div>');
    content.css(
    {
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
    });
	
	if(this.option.deactiveGone) content.css('display', 'none');
	else content.css({'visibility': 'hidden', 'height': '0px'});
	
	if(typeof(url)=='string') 
    {
        //tabObj.attr('data-page', url);
        tabEle.url = url;
    }
	
	//url is aview
	else 
	{
		AView.setViewInItem(url, content[0], this);
		//tabEle.view = url;
        //tabEle.url = tabEle.view.url;

		//url is aview object
		content[0].view = url
		tabEle.url = url.url;
	}
    
    //box-sizing 적용됨. padding-top 만큼이 tabarea 뒤에 숨는다. 
    //this.tabContents.css('padding-top', this.getTabAreaHeight()+'px');
    this.tabContents.append(content);
    
    //탭과 매칭되는 컨텐츠 영역을 저장해 둔다.
    tabEle.content = content[0];
    tabEle.name = name;
    tabEle.tabId = tabId;
    tabEle.data = data;
	
	if(oneshot==undefined || oneshot==null) oneshot = this.option.contentReload;
	
	tabEle.oneshot = oneshot;
	
	//자신과 연결되어 있는 탭 객체를 저장해 둔다.
	content[0].tab = tabEle;
    
    //content 내부의 중복 클래스 접근을 위해 고유 아이디를 부여한다.
    if(tabEle.tabId) content.attr('id', this.element.id+'-'+tabEle.tabId);
    
    var thisObj = this;
    AEvent.bindEvent(tabEle, 'click', function(e)
    {
		thisObj.selectTab(this);
    }); 
    
	/*
	if(isLoad) 
	{
		await this._loadTabContent(tabEle, isActive);
	}
	*/
    
    return tabEle;
};

ATabView.prototype.removeTab = function(tab)
{
	if(tab.content && tab.content.view)
		tab.content.view.removeFromView();
	
    $(tab.content).remove();
    $(tab).remove();
    
    //box-sizing 적용됨. padding-top 만큼이 tabarea 뒤에 숨는다. 
    //this.tabContents.css('padding-top',this.getTabAreaHeight()+'px');
};

/*
ATabView.prototype.setTabPadding = function(paddingX, paddingY)
{
    this.paddingX = paddingX;
    this.paddingY = paddingY;
};
*/

ATabView.prototype.setTabName = function(tab, name)
{
	tab.name = name;
	$(tab).text(name);
};

ATabView.prototype.selectTab = async function(tab, data, isNoHistory)
{
	this.lastSelectedTabId = tab.tabId;
	
	if(data!=undefined) tab.data = data;
	
	tab.isNoHistory = isNoHistory;
	
	var ret = await this._tabChangeManage(tab);
	
	//탭이 선택된 히스토리 정보를 저장한다.
	if(this.historyInfo && !isNoHistory && ret)
	{
		this.historyInfo.pushInfo(tab);
		
		if(theApp.webHistoryMgr) theApp.webHistoryMgr.pushHistory({target:this.whmKey, id:tab.tabId});
	}
};

ATabView.prototype.clearSelectTab = function()
{
	this.selectedTab = null;
    this.oldTab = null;
	this.lastSelectedTabId = null;
};

ATabView.prototype.removeAllTab = function()
{
	this.clearSelectTab();
	var allTabs = this.getAllTabs();
	for(var i = 0; i<allTabs.length; i++)
	{
		this.removeTab(allTabs[i]);
	}
};

//탭을 순서 번호로 찾아 활성화 한다.
ATabView.prototype.selectTabByIndex = async function(index, data)
{
    var selTab = this.getTabByInx(index);
    
    if(selTab) await this.selectTab(selTab, data);
	
    return selTab;
};

//탭을 고유 아이디로 찾아 활성화한다. 활성화된 탭을 리턴한다. 찾지 못하면 null
ATabView.prototype.selectTabById = async function(tabId, data)
{
    var selTab = this.getTabById(tabId);
    if(selTab) await this.selectTab(selTab, data);
	
    return selTab;
};

ATabView.prototype.awaitTabById = function(tabId)
{
    let tab = this.getTabById(tabId);
    if(tab) return tab.tabProm;
};

ATabView.prototype.awaitTabByIndex = function(index)
{
    let tab = this.getTabByInx(index);
    if(tab) return tab.tabProm;
};

ATabView.prototype.awaitSelectedTab = function()
{
    let tab = this.getSelectedTab();
    if(tab) return tab.tabProm;
};

//탭 아이디로 탭 객체 얻어오기
ATabView.prototype.getLastSelectedTabId = function()
{
    if(this.lastSelectedTabId) return this.lastSelectedTabId;
	else return this.getTabByInx(0).tabId;
};

//탭 아이디로 탭 객체 얻어오기
ATabView.prototype.getTabById = function(tabId)
{
    let retTab = null;
    
    this.tabArea.children().each(function()
    {
        if(this.tabId==tabId) 
        {
            retTab = this;
            return false;   //each callback 리턴
        }
    });
    
    return retTab;
};

ATabView.prototype.getTabByUrl = function(url)
{
    let retTab = null;
    
    this.tabArea.children().each(function()
    {
        if(this.url==url) 
        {
            retTab = this;
            return false;   //each callback 리턴
        }
    });
    
    return retTab;
};

//탭 인덱스로 탭 객체 얻어오기
ATabView.prototype.getTabByInx = function(index)
{
    var retTab = null;
    if(index<0) retTab = this.tabArea.children().last()[0];
    else retTab = this.tabArea.children().eq(index)[0];
    
    return retTab;
};

ATabView.prototype.getAllTabs = function()
{
    return this.tabArea.children();
};

ATabView.prototype.getSelectedTab = function()
{
    return this.selectedTab;
};

ATabView.prototype._callSubActiveEvent = function(funcName, isFirst)
{
	var selView = this.getSelectedView();
	if(selView) selView[funcName](isFirst);
};


ATabView.prototype.getSelectedView = function()
{
	if(this.selectedTab) return this.selectedTab.content.view;
    else return null;
};

ATabView.prototype._tabChangeManage = async function(tabEle)
{
	if(this.isTabChanging) return false;
	
	if(this.selectedTab === tabEle)
	{
		if(this.option.sameTabCheck) return false;
		else 
		{
			this.activeTab(this.selectedTab, this.selectedTab, false);
			//this.activeTab(null, this.selectedTab, false);
			return true;
		}
	}

	this.oldTab = this.selectedTab;

	//이전 버튼 비활성
	if(this.oldTab) 
	{
		/*
		$(this.oldTab).css(
		{
			'color': this.txtColors[1],
			'background-color': this.bgColors[1],
			'background-image': this.bgImages[1]	
		});
		*/
		
		if(this.btnStyles[0]) $(this.oldTab).removeClass(this.btnStyles[0]);
		$(this.oldTab).removeClass('ATabView_select');
		
		if(this.btnStyles[1]) $(this.oldTab).addClass(this.btnStyles[1]);
		$(this.oldTab).addClass('ATabView_deselect');
	}

	this.selectedTab = tabEle;
	
	/*
	//현재 버튼 활성화
	$(this.selectedTab).css(
	{
		'color': this.txtColors[0],
		'background-color': this.bgColors[0],
		'background-image': this.bgImages[0]	
	});
	*/
	
	if(this.btnStyles[1]) $(this.selectedTab).removeClass(this.btnStyles[1]);
	$(this.selectedTab).removeClass('ATabView_deselect');
	if(this.btnStyles[0]) $(this.selectedTab).addClass(this.btnStyles[0]);
	$(this.selectedTab).addClass('ATabView_select');

	//아직 뷰가 로드되지 않은 상태이거나 매번 릴로드 하는 옵션이면
	//if(!tabEle.content.view || this.option.contentReload) 
	
	if(!tabEle.content.view) //addtab 시점의 oneshot 으로 옮겨짐.
	{
		await this._loadTabContent(tabEle, true);
	}
	else this.activeTab(this.oldTab, this.selectedTab, false);
	
	return true;
};

//view 로 tabElement 를 얻으려면 view._item.tab
ATabView.prototype._loadTabContent = async function(tabEle, isActive)//, asyncCallback) 
{
	//var tabUrl = $(tabEle).attr('data-page'), aview = null;
    let tabUrl = tabEle.url;
	
	//item, url, owner, eventListener, skipUpdatePos, skipActiveDone
	//aview = await AView.createView(tabEle.content, tabUrl, this, null, null, !isActive);

    tabEle.tabProm = AView.createView(tabEle.content, tabUrl, this, null, null, !isActive);

	//tabEle.view = await tabEle.tabProm;
	tabEle.content.view = await tabEle.tabProm;
	
	//console.log('loaded : ' + tabEle.tabId);
	
	if(isActive)
	{
		this.activeTab(this.oldTab, this.selectedTab, true);
	}
};

ATabView.prototype.setMaxLoadedCount = function(max) 
{
	this.maxLoadedCnt = max;
};

ATabView.prototype.checkMaxLoadedTabs = function() 
{
	if(!this.maxLoadedCnt) return;

	let loadedCnt = 0, minVal = Date.now(), remTab = null;
	
	this.getAllTabs().each(function()
	{
		if(this.content.view) 
		{
			loadedCnt++;
			
			if(this._activeTime < minVal)
			{
				minVal = this._activeTime;
				remTab = this;
			}
		}
	});
	
	if(this.maxLoadedCnt<loadedCnt)
	{
		//console.log('remove : ' + remTab.tabId);
		this.clearTabContent(remTab);
	}
	
};

//탭활성화 관련 처리, reload : 컨텐츠를 새롭게 다시 로드했는지
ATabView.prototype.activeTab = function(oldTab, newTab, reload) 
{
	this.isTabChanging = true;
	
	var thisObj = this, oldView = null, newView = null;

	if(oldTab) oldView = oldTab.content.view;
	newView = newTab.content.view;
	
	newTab._activeTime = Date.now();	//오래된 탭 제거를 위해 활성화된 시간을 저장해 둔다.

	//IOS UIWebOverflowContentView BugFix
	//스크롤 버그로 인해 제거, wkWebView 에서는 할 필요 없음.
	//if(afc.isIos && window.AppManager) AppManager.enableApp(false);
	
	//---------------------------------------------------------------------------
	//	나중에 액티브될 경우 이벤트가 전달되지 않도록 사라질 때 disable 상태로 만든다.
	
	if(!afc.isIos && oldView && oldView.isActiveActionDelay) oldView.enable(false);
	
	this.beforeTabChanging(oldView, newView, reload);

	//최초 액티브될 경우 이벤트가 전달되지 않도록 disable 시켜둔다.
	if(!afc.isIos && reload && newView.isActiveActionDelay) newView.enable(false);
	//-----------------------------------------------------------------------------
	
	//if(this.isAnimation)
	if(this.option.enableAnimation)
	{
		switch(this.option.changeAnimation) 
		{
			case 'slide':
			{
				if(oldTab) 
					$(oldTab.content).addClass('slide-out-'+this.option.slideDir);
				
				let newContent = $(newTab.content);
	           	//newContent.show();
				if(this.option.deactiveGone) newContent.show();
				else newContent.css({'visibility': 'visible', 'height':'100%'});
				
				newContent.addClass('slide-in-'+this.option.slideDir);
	           	 
	           	newContent.one('webkitAnimationEnd', function()
	           	{
	        		if(oldTab) 
	        		{
	        			$(oldTab.content).removeClass('slide-out-'+thisObj.option.slideDir);
	        			//$(oldTab.content).hide();
						if(thisObj.option.deactiveGone) $(oldTab.content).hide();
						else $(oldTab.content).css({'visibility': 'hidden', 'height': '0px'});
	        		}
	        		
	            	newContent.removeClass('slide-in-'+thisObj.option.slideDir);
	            	
	            	_effectCallback();
	           	});
			}
			break;

			case 'fade':
			{
				$(newTab.content).fadeIn('fast', _effectCallback);
				
				if(oldTab) $(oldTab.content).hide();
			}
			break;

			default:
			{
				$(newTab.content).show('fast', _effectCallback);
			
				if(oldTab) $(oldTab.content).hide();
			}
			break;
		}
		
		//자체적으로 호출하므로 effectCallback 을 호출하지 않는다.
		_showCallback(false);
	}

	//에니메이션 효과가 없는 경우
	else
	{
		let newContent = $(newTab.content);
		//newContent.show();
		
		if(this.option.deactiveGone) newContent.show();
		else newContent.css({'visibility': 'visible', 'height':'100%'});
	
		if(oldTab) 
		{
			//$(oldTab.content).hide();
			
			if(this.option.deactiveGone) $(oldTab.content).hide();
			else $(oldTab.content).css({'visibility': 'hidden', 'height': '0px'});
		}
		
		_showCallback(true);
	}
	
	function _showCallback(isEffectCallback)
	{
		thisObj.tabChanging(oldView, newView, reload);
			
		if(isEffectCallback) setTimeout(_effectCallback, 0);
	}

	function _effectCallback() 
	{
		thisObj.afterTabChanged(oldView, newView, reload);
		
		//이전 탭에서 터치한 정보가 전달되지 안도록 
		//disable 상태에서 잠시 딜레이를 준 후 enable 시켜준다.
		
		if(!afc.isIos && newView.isActiveActionDelay)
		{
			setTimeout(function() 
			{ 
				if(newView.isValid()) newView.enable(true); 
				
			}, afc.DISABLE_TIME);
		}
		
		//IOS UIWebOverflowContentView BugFix
		//스크롤 버그로 인해 제거, wkWebView 에서는 할 필요 없음.
		//if(afc.isIos && window.AppManager) setTimeout(function() { AppManager.enableApp(true); }, AppManager.TOUCH_DELAY_TIME);

		
		if(oldTab && oldTab.oneshot) 
		{
			thisObj.clearTabContent(oldTab);
		}
		
		//오래된 탭 메모리 클리어
		thisObj.checkMaxLoadedTabs();
		
		
		thisObj.isTabChanging = false;
	}
};

ATabView.prototype.clearTabContent = function(tab)
{
	if(tab.content.view)
	{
		tab.content.view.removeFromView();
		tab.content.view = null;
	}
};

ATabView.prototype.updatePosition = function(pWidth, pHeight)
{
	AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	
	if(this.selectedTab)
	{
		var aview = this.selectedTab.content.view;
		
		if(aview) aview.updatePosition();
	}
};

/*
ATabView.prototype.setTextColor = function(colors)
{
	this.txtColors = colors;
};

ATabView.prototype.setBGColor = function(colors)
{
	this.bgColors = colors;
};

ATabView.prototype.setBGImage = function(images)
{
	this.bgImages = images;
};
*/
ATabView.prototype.setBtnStyle = function(styles)
{
	if(this.btnStyles)
	{
		this.removeClass(this.btnStyles[0]);
		this.removeClass(this.btnStyles[1]);
		//this.removeClass(this.btnStyles[2]);
	}
	
	this.btnStyles = styles;
};

ATabView.prototype.changeBtnState = function(oldState, newState)
{
	//this.setStyle('color', this.txtColors[newState]);
	//this.setStyle('background-color', this.bgColors[newState]);
	//this.setStyle('background-image', this.bgImages[newState]);
	
	/*
	if(this.txtColors[newState]) this.element.style.setProperty('color', this.txtColors[newState], 'important');
	if(this.bgColors[newState]) this.element.style.setProperty('background-color', this.bgColors[newState], 'important');
	
	if(this.bgImages[newState]) this.element.style.setProperty('background-image', this.bgImages[newState], 'important');
	else this.element.style.setProperty('background-image', '', 'important');
	*/
	
	//최초 초기화 하는 경우
	if(oldState<0)
	{
		if(this.btnStyles[newState]) this.addClass(this.btnStyles[newState]);
		this.addClass('AButton-'+afc.BTN_STATE[newState]);
	}
	else
	{
		if(this.isStyleOver)
		{
			if(newState>AButton.NORMAL && this.btnStyles[newState]) this.addClass(this.btnStyles[newState]);
			if(oldState>AButton.NORMAL && this.btnStyles[oldState]) this.removeClass(this.btnStyles[oldState]);
		}
		else
		{
			if(this.btnStyles[newState]) this.addClass(this.btnStyles[newState]);
			if(this.btnStyles[oldState]) this.removeClass(this.btnStyles[oldState]);
		}
		
		this.removeClass('AButton-'+afc.BTN_STATE[oldState]);
		this.addClass('AButton-'+afc.BTN_STATE[newState]);
	}
};


//--------------------------------------------------------------------------------------------------

ATabView.prototype.beforeTabChanging = function(oldView, newView, isFirst)
{
	if(this.delegator && this.delegator.beforeTabChanging) this.delegator.beforeTabChanging(oldView, newView, isFirst, this);
	
	if(newView) newView.onWillActive(isFirst);
	if(oldView) oldView.onWillDeactive();
};

ATabView.prototype.tabChanging = function(oldView, newView, isFirst) 
{
	if(this.delegator && this.delegator.tabChanging) this.delegator.tabChanging(oldView, newView, isFirst, this);
	
	if(newView) newView.onActive(isFirst);
	if(oldView) oldView.onDeactive();
};

ATabView.prototype.afterTabChanged = function(oldView, newView, isFirst)
{
	if(this.delegator && this.delegator.afterTabChanged) 
	{
		//if(newView.isInitDone) this.delegator.afterTabChanged(oldView, newView, isFirst, this);
		if(!isFirst) this.delegator.afterTabChanged(oldView, newView, isFirst, this);
	}
	
    if(newView) 
	{
		if(!isFirst) 
		{
			newView.updatePosition();	//최초인 경우는 onInitDone 전에 updatePosition 이 호출되어진다.
			newView.onActiveDone(isFirst);
		}
		
		//init 이 완전히 완료되었는지, 알메이트 컴포넌트 관련해서 체크해야 함
		//if(newView.isInitDone) newView.onActiveDone(isFirst);
	}
	
    if(oldView && oldView.isValid()) oldView.onDeactiveDone();
};


ATabView.prototype.removeFromView = function(onlyRelease)
{
	this.removeAllTab();
	
	AComponent.prototype.removeFromView.call(this, onlyRelease);
};

ATabView.prototype.enableHistory = function(enable)
{
	if(enable)
	{
		this.historyInfo = new AHistoryInfo();
		
		if(theApp.webHistoryMgr)
		{
			this.whmKey = '_' + Date.now();
			theApp.webHistoryMgr.setHistoryTarget(this.whmKey, this);
		}
	}
	else this.historyInfo = null;
};

ATabView.prototype.clearHistory = function(enable)
{
	if(this.historyInfo) this.historyInfo.clearHistory();
};

ATabView.prototype.goPrevSelect = function(data)
{
	if(this.historyInfo)
	{
		var tab = this.historyInfo.prevInfo();
		if(tab) this.selectTab(tab, data, true);
	}
};

ATabView.prototype.goNextSelect = function(data)
{
	if(this.historyInfo)
	{
		var tab = this.historyInfo.nextInfo();
		if(tab) this.selectTab(tab, data, true);
	}
};

ATabView.prototype.canGoPrev = function()
{
	if(this.historyInfo)
	{
		return this.historyInfo.canGoPrev();
	}
};

ATabView.prototype.canGoNext = function()
{
	if(this.historyInfo)
	{
		return this.historyInfo.canGoNext();
	}
};

ATabView.prototype._getDataStyleObj = function()
{
	var ret = AComponent.prototype._getDataStyleObj.call(this);
		
	var keyArr = ['data-style-tabnormal', 'data-style-tabselect'], val;
	
	for(var i=0; i<keyArr.length; i++)
	{
		val = this.getAttr(keyArr[i]);

		//attr value 에 null 이나 undefined 가 들어가지 않도록
		ret[keyArr[i]] = val ? val : '';
	}
	
	return ret;
};

// object 형식의 css class 값을 컴포넌트에 셋팅한다.
// default style 값만 셋팅한다.
ATabView.prototype._setDataStyleObj = function(styleObj)
{
	for(var p in styleObj)
	{
		if(p==afc.ATTR_STYLE) this._set_class_helper(this.$ele, null, styleObj, p);	//화면에 바로 적용
		else if(p=='data-style-tabnormal') this._set_class_helper(this.$ele, this.$ele.find('.ATabView_deselect'), styleObj, p);
		else if(p=='data-style-tabselect') this._set_class_helper(this.$ele, this.$ele.find('.ATabView_select'), styleObj, p);
	}
};
