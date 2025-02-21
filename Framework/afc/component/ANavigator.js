
/**
 * @author asoocool
 */

class ANavigator
{
	constructor(name, cntr)
	{
		if(!name) name = '_0_';

		this.name = name;

		this.pageHistory = [];

		this.curHisIndex = -1;

		this.flipType = 'normal';	//normal, slide, fade
		this.slideDir = 'left';		//left, right, up, down
		//this.isAsync = true;		//비동기 여부
		this.isOneshot = false;		//비활성화 시 페이지를 close 할 지.
		this.isDeactiveGone = true;	//페이지가 비활성화 될 경우 gone 시킬 지(돔 트리에서 제거), false 는 돔트리에는 남겨 놓고 hidden 만 시킨다.
									//false 는 페이지 전환이 좀 더 빠르지만 페이지가 많아질 경우 element 가 지속적으로 쌓여 element 의 추가/제거가 느려지는 등의 성능저하가 온다.
									//true 는 페이지가 많아져도 성능의 저하는 없지만 활성/비활성화 되는 페이지 내의 element 가 많을 경우 페이지 전환이 느려진다.

		this.pageInfoMap = {};
		this.activePage = null;

		ANavigator.objects[name] = this;

		if(!cntr) this.cntr = theApp.rootContainer;
		else this.cntr = cntr;

		//프레임 컨테이너에 자신을 셋팅
		this.cntr.childNavigator = this;

		//WebHistoryManager 를 활성화 한 경우 자동으로 등록
		if(theApp.webHistoryMgr) theApp.webHistoryMgr.setHistoryTarget(this.name, this);
	
	}

}

window.ANavigator = ANavigator

//-----------------------------------------------------------------------------
//	static area
ANavigator.objects = {};
//마지막으로 이동한 네비게이터
ANavigator.lastNavigator = null;

ANavigator.find = function(name)
{
	if(name) return ANavigator.objects[name];
	else return ANavigator.objects['_0_'];
};

ANavigator.getRootNavigator = function() { return theApp.rootContainer.childNavigator; };
ANavigator.getLastNavigator = function() { return ANavigator.lastNavigator; };

ANavigator.reportBackKeyEvent = function()
{
	var navi = ANavigator.getRootNavigator();
	
	if(navi)
	{
		var page = navi.getActivePage();
		if(page) return page.onBackKey();
	}
	
	return false;
};

//---------------------------------------------------------------------------------


//normal, slide, fade
ANavigator.prototype.setFlipType = function(flipType)
{
	this.flipType = flipType;	
};

ANavigator.prototype.getFlipType = function()
{
	return this.flipType;
};

//left, right, up, down
ANavigator.prototype.setSlideDir = function(slideDir)
{
    this.slideDir = slideDir;
};

ANavigator.prototype.getSlideDir = function()
{
    return this.slideDir;
};

/*
ANavigator.prototype.enableAsync = function(enable)
{
    this.isAsync = enable;
};
*/

ANavigator.prototype.enableOneshot = function(enable)
{
    this.isOneshot = enable;
};

ANavigator.prototype.enableDeactiveGone = function(enable)
{
    this.isDeactiveGone = enable;
};


//url 은 필수.
ANavigator.prototype.registerPage = function(url, pageId, pageClass, cond)//, isAsync)
{
	var infoArray = this.pageInfoMap[pageId];
	
	//cond is condition variable, 조건에 맞는 페이지를 리턴하기위해
	var newInfo = { url: url, pageId: pageId+'_0', cond: cond, pageClass: pageClass, pageObj: null }; //, isAsync: isAsync };	
		
	if(!infoArray) 
	{
		infoArray = new Array();
		this.pageInfoMap[pageId] = infoArray;
	}
	//같이 페이지 아이디로 페이지 정보가 존재하면 아이디 숫자를 하나 높여 추가한다.
	else 
	{
		newInfo.pageId = pageId+'_'+infoArray.length;
	}

	infoArray.push(newInfo);
	
	if(!pageClass) newInfo.pageClass = 'APage'; //afc.ClassName.PAGE;

    return newInfo;
};

ANavigator.prototype.registerPageEx = function(pageInfo)
{
	return this.registerPage(pageInfo.url, pageInfo.pageId, pageInfo.pageClass, pageInfo.cond);//, pageInfo.isAsync);
};

ANavigator.prototype.unRegisterPage = function(pageId)
{
	var infoArray = this.pageInfoMap[pageId];
	if(!infoArray) return;
	
	var obj = null, def = null;
	for(var i=0; i<infoArray.length; i++)
	{
		obj = infoArray[i];
		
		if(obj.pageObj)
		{
			obj.pageObj.close();
			obj.pageObj = null;
		}
	}
	
	delete this.pageInfoMap[pageId];
};

//cond 옵션을 비교하여 tabId 를 리턴한다.
ANavigator.prototype.getPageInfo = function(pageId)
{
	var infoArray = this.pageInfoMap[pageId];
	if(!infoArray) return null;
	
	var obj = null, def = null;
	for(var i=0; i<infoArray.length; i++)
	{
		obj = infoArray[i];
		
		//조건을 지정하지 않은 페이지가 기본 페이지이다.
		if(!obj.cond) def = obj;
		//조건을 만족하면 바로 리턴
		else if(obj.cond.call(this, obj)) return obj;
	}
	
	return def;
};

ANavigator.prototype.getPage = function(pageId)
{
	var pageInfo = this.getPageInfo(pageId);
	
	if(pageInfo) return pageInfo.pageObj;
	else return null;
};

ANavigator.prototype.pushHistory = function(page)
{
	this.curHisIndex++;
    this.pageHistory.length = this.curHisIndex;
    this.pageHistory.push(page);
};

ANavigator.prototype.flipPage = function(willActivePage, isFirst)
{
	var thisObj = this, willDeactivePage = this.activePage;
	
	this.isTabFlipping = true;
	
	ANavigator.lastNavigator = this;
	
	willActivePage.onWillActive(isFirst);
	if(willDeactivePage) willDeactivePage.onWillDeactive();
	
	if(this.flipType=='normal')
	{
		//willActivePage.show();
		
		if(this.isDeactiveGone) willActivePage.show();
		else willActivePage.$ele.css({'visibility': 'visible', 'height':'100%'});
		
		willActivePage.onActive(isFirst);

		if(willDeactivePage) 
		{
			//willDeactivePage.hide();
			if(this.isDeactiveGone) willDeactivePage.hide();
			else willDeactivePage.$ele.css({'visibility': 'hidden', 'height': '0px'});
			
			willDeactivePage.onDeactive();
		}
		
		setTimeout(function() 
		{
			_effectDone();
		}, 0);
	}
	
	else if(this.flipType=='slide')
	{
		//willActivePage.show();
		if(this.isDeactiveGone) willActivePage.show();
		else willActivePage.$ele.css({'visibility': 'visible', 'height':'100%'});
		
		willActivePage.$ele.addClass('slide-in-'+this.slideDir);
		willActivePage.onActive(isFirst);
		
		if(willDeactivePage)
		{
			willDeactivePage.$ele.addClass('slide-out-'+this.slideDir);
			willDeactivePage.onDeactive();
		}
		
		willActivePage.$ele.one('webkitAnimationEnd', function()
		{
			if(willDeactivePage) 
			{
				willDeactivePage.$ele.removeClass('slide-out-'+thisObj.slideDir);
				//willDeactivePage.$ele.hide();
				
				if(thisObj.isDeactiveGone) willDeactivePage.hide();
				else willDeactivePage.$ele.css({'visibility': 'hidden', 'height': '0px'});
				
			}

			willActivePage.$ele.removeClass('slide-in-'+thisObj.slideDir);

			_effectDone();
		});
	}
	
	this.activePage = willActivePage;
	

	function _effectDone() 
	{
		if(willActivePage.isValid())
		{
			willActivePage.onResize();
			willActivePage.onActiveDone(isFirst);
		}
		
		if(willDeactivePage && willDeactivePage.isValid()) 
		{
			willDeactivePage.onDeactiveDone();
			
			if(willDeactivePage.option.isOneshot) thisObj.closePage(willDeactivePage.getContainerId());
		}
		
		thisObj.isTabFlipping = false;
	}
};

ANavigator.prototype.goPage = async function(pageId, data, isNoHistory)
{
	var pageInfo = this.getPageInfo(pageId);
	
	//없는 페이지이면 리턴 
	if(!pageInfo) return null;
	
	var isFirst = false;
	if(!pageInfo.pageObj)
	{
		pageInfo.pageObj = new window[pageInfo.pageClass](pageId);
		pageInfo.pageObj.navigator = this;
		//pageInfo.pageObj.url = pageInfo.url;
		
		// 최초페이지인 경우 init 시점에 데이터를 세팅해준다.
		pageInfo.pageObj.setData(data);
		
		//pageInfo.pageObj.setOption({ isAsync: this.isAsync, isOneshot: this.isOneshot });
		
		//값을 셋팅하지 않은 경우는 AContainer 의 기본값이 작동되도록
		var optObj = { isOneshot: this.isOneshot };
		//if(pageInfo.isAsync!=undefined) optObj['isAsync'] = pageInfo.isAsync;
		
		pageInfo.pageObj.setOption(optObj); 
		await pageInfo.pageObj.open(pageInfo.url, this.cntr);
		if(!this.isDeactiveGone) pageInfo.pageObj.$ele.css('overflow', 'hidden');
		
		isFirst = true;
	}
	
	//현재 액티브된 페이지를 다시 호출한 경우는 제외
	if(pageInfo.pageObj!==this.activePage)
	{
		// 최초 페이지가 아닌 경우에만 active 시점에 데이터를 세팅해준다.
		if(!isFirst)
		{
			pageInfo.pageObj.pageData = data;	//deprecated
			pageInfo.pageObj.setData(data);
		}
		
		this.flipPage(pageInfo.pageObj, isFirst);

		if(!isNoHistory) 
		{
			this.pushHistory(pageInfo.pageObj);
			
			if(theApp.webHistoryMgr) theApp.webHistoryMgr.pushHistory({target:this.name, id:pageId});
		}
	}
	
	return pageInfo.pageObj;
};

ANavigator.prototype.goPrevPage = function(data)
{
	if(this.canGoPrev())
	{
		this.curHisIndex--;
		var page = this.pageHistory[this.curHisIndex];
		
		page.pageData = data;	//deprecated
		page.setData(data);
		
		if(page.isValid()) this.flipPage(page, false);
		else this.pageHistory[this.curHisIndex] = this.goPage(page.getContainerId(), data, true);
		
		return true;
	}
	
	return false;
};

ANavigator.prototype.goNextPage = function(data)
{
	if(this.canGoNext())
	{
		this.curHisIndex++;
		var page = this.pageHistory[this.curHisIndex];
		
		page.pageData = data;	//deprecated
		page.setData(data);
		
		if(page.isValid()) this.flipPage(page, false);
		else this.pageHistory[this.curHisIndex] = this.goPage(page.getContainerId(), data, true);
		
		return true;
	}
	
	return false;
};

ANavigator.prototype.getPrevPage = function()
{
	if(this.canGoPrev())
	{
		return this.pageHistory[this.curHisIndex-1];
	}
};

ANavigator.prototype.getNextPage = function()
{
	if(this.canGoNext())
	{
		return this.pageHistory[this.curHisIndex+1];
	}
};

ANavigator.prototype.getActivePage = function()
{
    return this.activePage;
};

ANavigator.prototype.canGoPrev = function()
{
	return (this.curHisIndex>0);
};

ANavigator.prototype.canGoNext = function()
{
	return (this.curHisIndex<this.pageHistory.length-1);
};

ANavigator.prototype.clearHistory = function()
{
	this.pageHistory.length = 0;
	this.curHisIndex = -1;
};

ANavigator.prototype.closePage = function(pageId)
{
	var pageInfo = this.getPageInfo(pageId);
	
	if(pageInfo && pageInfo.pageObj)
	{
		if(pageInfo.pageObj == this.activePage) this.activePage = null;
		pageInfo.pageObj.close();
		pageInfo.pageObj = null;
	}
};

ANavigator.prototype.closeAllPage = function()
{
	var pageInfo, pageId;
	
	for(pageId in this.pageInfoMap)
	{
		this.closePage(pageId);
	}
	this.activePage = null;
};

ANavigator.prototype.onResize = function()
{
	/*
	var pageInfo, pageId;
	
	for(pageId in this.pageInfoMap)
	{
		pageInfo = this.getPageInfo(pageId);
			
		if(pageInfo.pageObj) pageInfo.pageObj.onResize();
	}
	*/
	var page = this.getActivePage();
	
	if(page) page.onResize();
};
