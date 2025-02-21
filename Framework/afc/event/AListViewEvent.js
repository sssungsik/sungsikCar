/**
 * @author asoocool
 * 
 */

class AListViewEvent extends AEvent
{
	constructor(acomp)
	{
		super(acomp);
		
		this.bScrollBind = false;
		this.isTouchLeave = true;
	}
}
window.AListViewEvent = AListViewEvent;


//---------------------------------------------------------------------------------------------------
//	Component Event Functions

AListViewEvent.prototype.scroll = function()
{
	this._scroll();
};

AListViewEvent.prototype.scrolltop = function()
{
	this._scroll();
};

AListViewEvent.prototype.scrollbottom = function()
{
	this._scroll();
};

AListViewEvent.prototype.refresh = function()
{
	this._refresh();
};

AListViewEvent.prototype.select = function() 
{
	this._select();
};

//---------------------------------------------------------------------------------------------------



AListViewEvent.prototype._refresh = function()
{
	var thisObj = this, alistview = this.acomp;
	
	var ri = new RefreshIndicator();
	alistview.refreshIndicator = ri;
	ri.init(alistview, alistview.scrollArea[0]);
	ri.setRefreshFunc(function(){ alistview.reportEvent('refresh'); });
};

AListViewEvent.prototype._scroll = function()
{
	if(this.bScrollBind) return;
	this.bScrollBind = true;
	
	var alistview = this.acomp, oldScrollTop = alistview.scrollArea[0].scrollTop;
	
	alistview.scrollArea[0].addEventListener('scroll', function(e)
	{
		//scrollTo 함수 호출과 같이 임의로 스크롤을 발생시킨 경우 이벤트가 발생되지 않게 하려면 셋팅
		if(alistview.ignoreScrollEvent)
		{
			alistview.ignoreScrollEvent = false;
			return;
		}
	
		alistview.reportEvent('scroll', this, e);
		
		var bottomVal = this.scrollHeight - this.clientHeight - this.scrollTop;
	
		if(bottomVal < 1)	//안드로이드인 경우 0.398472 와 같이 소수점이 나올 수 있다.
		{
			//ios 는 overscrolling 때문에 음수값이 여러번 발생한다.
			//아래와 같이 비교할 경우 바운스 되는 상황에 따라 0 이 되는 경우가 여러번 발생할 수 있다.
			//if(afc.isIos && bottomVal!=0) return;
			
			//이미 scroll bottom 이벤트가 발생했으므로 overscrolling 에 대해서는 무시한다.
			if(afc.isIos && (this.scrollHeight-this.clientHeight-oldScrollTop) < 1) return;
			
			if(alistview.scrollBottomManage())
				alistview.reportEvent('scrollbottom', this, e);
		}
		
		else if(this.scrollTop < 1)	//0.398472 와 같이 소수점이 나올 수 있다.
		{
			if(afc.isIos && oldScrollTop < 1) return;
			
			if(alistview.scrollTopManage())
				alistview.reportEvent('scrolltop', this, e);
		}
				
		oldScrollTop = this.scrollTop;
	});
};

//listview item 이벤트 처리
AListViewEvent.prototype._select = function()
{
	var thisObj = this,
		alistview = this.acomp,
		ele = alistview.element;	//터치 체크 영역;
	
	var startX = 0, startY = 0, timeout = null, selItem = null;

	AEvent.bindEvent(ele, AEvent.ACTION_DOWN, function(e)
	{
		if(!alistview.option.isSelectable) return;

		thisObj.isTouchLeave = false;
		
		selItem = null;

		var oe = e.changedTouches[0];
		startX = oe.clientX;
		startY = oe.clientY;

		//배경을 터치한 경우
		if(e.target===alistview.scrollArea[0]) 
		{
			thisObj.isTouchLeave = true;
			return;
		}

		if(e.target.rootView) selItem = e.target.rootView._item;
		else
		{
			thisObj.isTouchLeave = true;
			return;
		}

		timeout = AUtil.safeDelay(alistview, function() 
		{
			timeout = null;
			if(!thisObj.isTouchLeave) alistview.setSelectItem(selItem);

		}, 300);

	});

	AEvent.bindEvent(ele, AEvent.ACTION_MOVE, function(e)
	{
		if(thisObj.isTouchLeave || !alistview.option.isSelectable) return;

		var oe = e.changedTouches[0];

		if(Math.abs(oe.clientX - startX) > AEvent.TOUCHLEAVE || Math.abs(oe.clientY - startY) > AEvent.TOUCHLEAVE)
		{
			thisObj.isTouchLeave = true;

			if(timeout) 
			{
				clearTimeout(timeout);
				timeout = null;
			}

			if(alistview.selectItem===selItem) alistview.setSelectItem(null);
		}
	});

	AEvent.bindEvent(ele, AEvent.ACTION_UP, function(e)
	{
		if(thisObj.isTouchLeave || !alistview.option.isSelectable) return;

		thisObj.isTouchLeave = true;

		if(timeout) 
		{
			clearTimeout(timeout);
			timeout = null;
		}

		alistview.setSelectItem(selItem);
		alistview.reportEventDelay('select', selItem, 100);
	});

	AEvent.bindEvent(ele, AEvent.ACTION_CANCEL, function(e)
	{
		thisObj.isTouchLeave = true;

		if(timeout) 
		{
			clearTimeout(timeout);
			timeout = null;
		}

		alistview.setSelectItem(null);
	});		
		
};

