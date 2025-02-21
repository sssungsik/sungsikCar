               
/**
 * @author asoocool
 */

class AGridEvent extends AEvent
{
	constructor(acomp)
	{
		super(acomp);
	
		this.bScrollBind = false;
		//this.isTouchLeave = true;
	}
}
window.AGridEvent = AGridEvent;


AGridEvent.prototype.defaultAction = function()
{
	this._select();
};

//---------------------------------------------------------------------------------------------------
//	Component Event Functions

AGridEvent.prototype.scroll = function()
{
	this._scroll();
};

AGridEvent.prototype.scrolltop = function()
{
	this._scroll();
};

AGridEvent.prototype.scrollbottom = function()
{
	this._scroll();
};

AGridEvent.prototype.longtab = function()
{
	this._longtab();
};

AGridEvent.prototype.dblclick = function()
{
	this._dblclick();
};

AGridEvent.prototype.refresh = function()
{
	this._refresh();
};

//defaultAction 에서 호출하므로 제거
AGridEvent.prototype.select = null;


//---------------------------------------------------------------------------------------------------

AGridEvent.prototype._refresh = function()
{
	var thisObj = this, agrid = this.acomp;
	
	var ri = new RefreshIndicator();
	agrid.refreshIndicator = ri;
	ri.init(agrid, agrid.scrollArea[0]);
	ri.setRefreshFunc(function(){ agrid.reportEvent('refresh'); });
};

AGridEvent.prototype._scroll = function()
{
	//한번만 호출되도록
	if(this.bScrollBind) return;
	this.bScrollBind = true;
	
	var agrid = this.acomp, oldScrollTop = agrid.scrollArea[0].scrollTop;

	agrid.scrollArea[0].addEventListener('scroll', function(e)
	{
		//scrollTo 함수 호출과 같이 임의로 스크롤을 발생시킨 경우 이벤트가 발생되지 않게 하려면 셋팅
		if(agrid.ignoreScrollEvent)
		{
			agrid.ignoreScrollEvent = false;
			return;
		}
	
		agrid.reportEvent('scroll', this, e);
		
		var bottomVal = this.scrollHeight - this.clientHeight - this.scrollTop;
		
		//scroll bottom
		if(bottomVal < 1)	//안드로이드인 경우 0.398472 와 같이 소수점이 나올 수 있다.
		{
			//ios 는 overscrolling 때문에 음수값이 여러번 발생한다.
			
			//이미 scroll bottom 이벤트가 발생했으므로 overscrolling 에 대해서는 무시한다.
			if(afc.isIos && (this.scrollHeight-this.clientHeight-oldScrollTop) < 1) return;
		
			//데이터 없을 때 바텀이벤트 발생하는 문제 해결
			if(agrid.getRow(0) && agrid.scrollBottomManage())
				agrid.reportEvent('scrollbottom', this, e);	
		}
		
		//scroll top
		else if(this.scrollTop < 1)	//0.398472 와 같이 소수점이 나올 수 있다.
		{
			if(afc.isIos && oldScrollTop < 1) return;
			
			if(agrid.scrollTopManage())
				agrid.reportEvent('scrolltop', this,  e);
		}
		
		oldScrollTop = this.scrollTop;
	});
};

//---------------------------------------------------------------------
//	cell, row 이벤트 처리

AGridEvent.prototype._select = function()
{
	//selectable 인 경우, 기본 동작이므로 무조건 등록
	
	var thisObj = this,
		agrid = this.acomp, selItem = null,
		startX = 0, startY = 0, isTouchLeave = true,
		ele = agrid.element;	//터치 체크 영역
		
	AEvent.bindEvent(ele, AEvent.ACTION_DOWN, function(e)
	{
		if(!agrid.option.isSelectable) return;
	
		isTouchLeave = false;
		
		selItem = null;

		//자체적으로 스크롤을 구현하고 현재 스크롤이 진행중일 경우는 셀렉트 이벤트를 발생시키지 않는다. 
		if(agrid.scrlManager &&  agrid.scrlManager.scrlTimer)
		{
			isTouchLeave = true;
			return;
		}
		
		//셀 내부에 있는 button, input tag 를 터치한 경우는 셀렉트 되지 않도록
		if(e.target.tagName=='BUTTON' || e.target.tagName=='INPUT' || e.target.tagName=='SELECT') 
		{
			isTouchLeave = true;
			return;
		}
		
		var ePath = e.path || (e.composedPath && e.composedPath()), curItem;
		
		//터치한 element 중에서 셀 영역을 찾는다.
		for(var inx in ePath)
		{
			curItem = ePath[inx];
			
			//자신의 컴포넌트 영역이상으로 올라가지 않기위해
			if(curItem.acomp) break;
			
			if(curItem.tagName=='TD')
			{
				selItem = curItem;
				break;
			}
		}
		
		//셀이 아닌 영역을 터치한 경우
		if(!selItem) 
		{
			isTouchLeave = true;
			return;
		}
				
		var oe = e.changedTouches[0];
		startX = oe.clientX;
		startY = oe.clientY;

	});

	AEvent.bindEvent(ele, AEvent.ACTION_MOVE, function(e)
	{
		if(isTouchLeave || !agrid.option.isSelectable) return;

		var oe = e.changedTouches[0];
		
		if(Math.abs(oe.clientX - startX) > AEvent.TOUCHLEAVE || Math.abs(oe.clientY - startY) > AEvent.TOUCHLEAVE) 
		{
			isTouchLeave = true;
		}
	});

	AEvent.bindEvent(ele, AEvent.ACTION_UP, function(e)
	{
		if(isTouchLeave || !agrid.option.isSelectable) return;

		isTouchLeave = true;
		
		var evtEles = $(selItem);
		
		//fullrowselect 옵션이면 로우셋 전체를 얻어온다. 헤더가 아닌 경우
		if(agrid.option.isFullRowSelect && !agrid.isHeadCell(selItem) && !agrid.isFootCell(selItem))
		{
			var inx = agrid.rowIndexOfCell(selItem);
			//console.log(inx);
			
			evtEles = agrid.getRowSet(inx);
		}

		//우클릭인 경우 셀렉트 되지 않은 경우만 셀렉트한다. ( 다중선택 후 우클릭 시 다른 셀들이 디셀렉트 되는 문제 해결 )
		if(e.which == 3)
		{
			if(!$(evtEles).hasClass(agrid.selectStyleName)) agrid.selectCell(evtEles, e);
		}
		else
		{
			agrid.selectCell(evtEles, e);
		}
	
		if(agrid.option.isSortable && agrid.isHeadCell(evtEles[0]))
		{
			agrid.sortColumn(this);
		}
		
		agrid.reportEvent('select', evtEles, e);
	});
	
	AEvent.bindEvent(ele, AEvent.ACTION_CANCEL, function(e)
	{
		isTouchLeave = true;
			
	});
};

//	evtEles 는 이벤트 element 를 담고 있는 배열이거나 jQuery 집합 객체이다.
AGridEvent.prototype._longtab = function()
{
	//var thisObj = this;
	var thisObj = this, agrid = this.acomp, timeout = null, isTouchLeave = true,
		startX = 0, startY = 0, selItem = null,
		
		//터치 체크 영역
		ele = agrid.element;	
		
	
	AEvent.bindEvent(ele, AEvent.ACTION_DOWN, function(e)
	{
		if(e.touches.length > 1) return;

		if((new Date().getTime() - AEvent.TOUCHTIME) < afc.DISABLE_TIME) return; 
		
		isTouchLeave = false;
		
		//셀 내부에 있는 button, input tag 를 터치한 경우는 셀렉트 되지 않도록
		if(e.target.tagName=='BUTTON' || e.target.tagName=='INPUT') 
		{
			isTouchLeave = true;
			return;
		}
		
		var ePath = e.path || (e.composedPath && e.composedPath()), curItem;
		
		//터치한 element 중에서 셀 영역을 찾는다.
		for(var inx in ePath)
		{
			curItem = ePath[inx];
			
			//자신의 컴포넌트 영역이상으로 올라가지 않기위해
			if(curItem.acomp) break;
			
			if(curItem.tagName=='TD')
			{
				selItem = curItem;
				break;
			}
		}
		
		//셀이 아닌 영역을 터치한 경우
		if(!selItem) 
		{
			isTouchLeave = true;
			return;
		}

		thisObj.actionDownState();
			
		var oe = e.changedTouches[0];
		startX = oe.clientX;
		startY = oe.clientY;
		
		var evtEles = $(selItem);
		
		//fullrowselect 옵션이면 로우셋 전체를 얻어온다.
		if(agrid.option.isFullRowSelect && !agrid.isHeadCell(selItem) && !agrid.isFootCell(selItem))
			evtEles = agrid.getRowSet(agrid.rowIndexOfCell(selItem));

        timeout = setTimeout(function()
        {
			isTouchLeave = true;
        	timeout = null;
			
            agrid.reportEvent('longtab', evtEles, e);

        }, 700);
        
	});
		
	AEvent.bindEvent(ele, AEvent.ACTION_MOVE, function(e)
	{
		if(isTouchLeave) return;
		
		var oe = e.changedTouches[0];

		if(Math.abs(oe.clientX - startX) > AEvent.TOUCHLEAVE || Math.abs(oe.clientY - startY) > AEvent.TOUCHLEAVE)
		{
			isTouchLeave = true;
			
			if(timeout) 
			{
				clearTimeout(timeout);
				timeout = null;
			}

			thisObj.actionMoveState();
			if(!afc.isSimulator) AEvent.TOUCHTIME = new Date().getTime();
		}
	});

	AEvent.bindEvent(ele, AEvent.ACTION_UP, function(e)
	{
		//if(!agrid.option.isSelectable) return;
		if(isTouchLeave) return;
		
		isTouchLeave = true;

		if(timeout) 
		{
			clearTimeout(timeout);
			timeout = null;
		}

		thisObj.actionUpState();

		if((new Date().getTime() - AEvent.TOUCHTIME) > afc.DISABLE_TIME) AEvent.TOUCHTIME = new Date().getTime();

	});

	AEvent.bindEvent(ele, AEvent.ACTION_CANCEL, function(e)
	{
		isTouchLeave = true;
		
		if(timeout) 
		{
			clearTimeout(timeout);
			timeout = null;
		}
	});
	
};

//	evtEles 는 이벤트 element 를 담고 있는 배열이거나 jQuery 집합 객체이다.
AGridEvent.prototype._dblclick = function()
{
	var agrid = this.acomp,
		ele = agrid.element, selItem = null;
		
	ele.addEventListener('dblclick', function(e)
	{
		//셀 내부에 있는 button, input tag 를 터치한 경우는 셀렉트 되지 않도록
		if(e.target.tagName=='BUTTON' || e.target.tagName=='INPUT') 
		{
			return;
		}
		
		var ePath = e.path || (e.composedPath && e.composedPath()), curItem;
		
		//터치한 element 중에서 셀 영역을 찾는다.
		for(var inx in ePath)
		{
			curItem = ePath[inx];
			
			//자신의 컴포넌트 영역이상으로 올라가지 않기위해
			if(curItem.acomp) break;
			
			if(curItem.tagName=='TD')
			{
				selItem = curItem;
				break;
			}
		}
		
		//셀이 아닌 영역을 터치한 경우
		if(!selItem) 
		{
			return;
		}
	
		var evtEles = $(selItem);
		
		//fullrowselect 옵션이면 로우셋 전체를 얻어온다.
		if(agrid.option.isFullRowSelect && !agrid.isHeadCell(selItem) && !agrid.isFootCell(selItem))
			evtEles = agrid.getRowSet(agrid.rowIndexOfCell(selItem));
	
		agrid.reportEvent('dblclick', evtEles, e);
	});
	
};




