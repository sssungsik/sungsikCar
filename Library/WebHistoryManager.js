
/**
Constructor
Do not call Function in Constructor.
*/
WebHistoryManager = class WebHistoryManager
{
    constructor()
    {
        
		this.targets = null;
		this.inc_uid = 0;
		this.cur_uid = 0;
		this.curTarget = null;
	

    }
}

//탭뷰의 히스토리 강제사용여부
WebHistoryManager.isForceTabViewHistory = true;

WebHistoryManager.prototype.init = function()
{
	var thisObj = this;
	
	this.targets = {};
	
	this.urlMark = '?pid=';
	
	window.addEventListener('popstate', function(e){thisObj.onPopState(e);});	

};

WebHistoryManager.prototype.setUrlMark = function(urlMark)
{
	this.urlMark = urlMark;
};

WebHistoryManager.prototype.setDelegator = function(delegator)
{
	this.delegator = delegator;
};

WebHistoryManager.prototype.onPopState = function(e)
{
	var data = e.state;
	
//console.log(data);

	if(!data) return;
	
	var target = this.targets[this.curTarget],
		isPrev = data.uid < this.cur_uid;
		
	this.cur_uid = data.uid;
	this.curTarget = data.target;
	
	if(this.delegator && this.delegator.onPopState) 
	{
		//onPopState 함수에서 false 가 리턴되면 아래코드를 실행하지 않는다.
		if(this.delegator.onPopState(target, isPrev, e)==false) return;
	}
	
	if(target instanceof ATabView)
	{
		if(isPrev) target.goPrevSelect();
		else target.goNextSelect();
	}
	else if(target instanceof ANavigator)
	{
		if(isPrev) target.goPrevPage();
		else target.goNextPage();
	}
	else if(target instanceof AWindow)
	{
		//웹히스토리 매니저에서 pop되지 않도록
		if(target.isValid()) target.close(-909);
	}
};

WebHistoryManager.prototype.setHistoryTarget = function(key, target)
{
	this.targets[key] = target;
};

WebHistoryManager.prototype.pushHistory = function(data, title)
{
	data.uid = ++this.inc_uid;
	
	this.cur_uid = data.uid;
	this.curTarget = data.target;
	
//console.log(data);

	window.history.pushState(data, title, this.urlMark + data.id);
};

WebHistoryManager.prototype.popHistory = function()
{
	window.history.back();
};

