
(async function(){


/**
 * @author bks
 */
 
await afc.import('Framework/afc/layout/APagingItem.js');

//-----------------------------------------------------------------------------------------
//  APagingBar class
//-----------------------------------------------------------------------------------------

APagingBar = class APagingBar extends AView
{
	constructor()
	{
		super();
		
		this.childComp = null;
	}
}


APagingBar.CONTEXT = 
{
	
    tag:'<div data-base="APagingBar" data-class="APagingBar" data-button-width="18" class="APagingBar-Style"></div>',
    defStyle: {},
    events: []
};


//이 함수가 실행된 이후에 init 함수가 실행된다.
APagingBar.prototype.createElement = function(context)
{
	AView.prototype.createElement.call(this, context);
	
	//개발 시점에 Drag & Drop 을 통해 최초 컴포넌트를 추가하는 경우, layout 을 동적으로 로드하여 태그를 추가한다.
	//이후에 초기화 하는 경우는 이미 하위 태그가 파일에 저장되어져 있다.
	if(this.$ele.children().length==0) 
	{
		var item = $('<div style="width:100%; height:100%;"></div>')[0];
		afc.loadHtmlSync(item, 'Framework/afc/layout/APagingItem.html');
		this.$ele.append(item);
	}
};


APagingBar.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	this.childComp = this.element.children[0].children[0].acomp;
};

//앏은 복사
APagingBar.prototype.clone = function(obj)
{
    if(obj instanceof Object)
	{
        var copy = obj.constructor();
        for (var attr in obj)
		{
            if(obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    }
};


//setter start ------------------------------------------
APagingBar.prototype.isNumber = function(s)
{
	var nc = /^[0-9]*$/;
	return nc.test(s);
};
	
APagingBar.prototype.setReadOnly = function(isReadOnly)
{
    if(isReadOnly) this.$ele.attr('readonly', isReadOnly);
    else this.$ele.removeAttr('readonly');
	
	this.childComp.buttonReadonly = this.$ele.attr('readonly');
};

APagingBar.prototype.setDisabled = function(isDisabled)
{
    if(isDisabled) this.$ele.attr('disabled', isDisabled);
    else this.$ele.removeAttr('disabled');
	
	this.childComp.buttonDisabled = this.$ele.attr('disabled');
};



//총 카운트 수
//페이징뷰를 새로고침을 같이 진행케 한다.
APagingBar.prototype.setTotalCount = function(cnt)
{
	if(!this.isNumber(cnt)) cnt = 0;
	this.childComp.totalCount = cnt;
	
	this.setPageView();
};
//현재 페이지 수
APagingBar.prototype.setPageIndex = function(idx)
{
	this.childComp.pageIdx = idx;
};
//페이지당 레코드 수
APagingBar.prototype.setPerPage = function(per)
{
	this.childComp.perPage = per;
};
//총 카운트 수
APagingBar.prototype.setBlock = function(blk)
{
	this.childComp.block = blk;
};
//기본 setter setting
APagingBar.prototype.setPage = function(cnt, idx, per, blk)
{
	this.childComp.totalCount = cnt;
	this.childComp.pageIdx = idx;
	this.childComp.perPage = per;
	this.childComp.block = blk;
};
//가운데 유무(default: true)
APagingBar.prototype.setIsCenter = function(bln)
{
	this.childComp.isCenter = bln;
};
//전달할 정보 key/value setting
APagingBar.prototype.setParam = function(data)
{
	this.childComp.param = data;
};
APagingBar.prototype.addParam = function(data)
{
	var params = this.clone(data);
	for(var key in params) this.childComp.param[key] = params[key];
};
//setter end --------------------------------------------

//getter start ------------------------------------------
//총 카운트 수
APagingBar.prototype.getTotalCount = function()
{
	return this.childComp.totalCount;
};
//전체 페이지 수
APagingBar.prototype.getTotalPage = function()
{
	return this.childComp.totalPage;
};
//현재 페이지 수
APagingBar.prototype.getPageIndex = function()
{
	return this.childComp.pageIdx;
};
//페이지당 레코드 수
APagingBar.prototype.getPerPage = function()
{
	return this.childComp.perPage;
};
//총 카운트 수
APagingBar.prototype.getBlock = function()
{
	return this.childComp.block;
};
//기본 getter setting
APagingBar.prototype.getPage = function()
{
	return {
			totalCount: this.childComp.totalCount,
			totalPage: this.childComp.totalPage,
			pageIndex: this.childComp.pageIdx,
			perPage: this.childComp.perPage,
			block: this.childComp.block,
			param: this.childComp.param
		};
};
//getter end --------------------------------------------


//그리드, 리스트뷰 객체 
//-------------------------------------------------------
APagingBar.prototype.setComponent = function(acomp)
{
	this.childComp.component = acomp;
	this.childComp.$ele.html("");
};

//this 위임
//-------------------------------------------------------
//  delegate functions
//  function pagingBindData(acomp, data);
//-------------------------------------------------------
APagingBar.prototype.setDelegator = function(delegator)
{
	this.childComp.delegator = delegator;
};


APagingBar.prototype.setPageView = function()
{
	this.childComp.setPageView();
};

// 컴포넌트 내부에 드랍 가능여부 리턴
APagingBar.prototype.getDroppable = function()
{
	return false;
};



})();