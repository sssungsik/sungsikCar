
/**
 * @author asoocool
 */

class AViewEvent extends AEvent
{
	constructor(acomp)
	{
		super(acomp);
		
		this.bScrollBind = false;
	}
}
window.AViewEvent = AViewEvent;



//['click', 'dblclick', 'swipe', 'longtab', 'scroll', 'scrollleft', 'scrollright', 'scrolltop', 'scrollbottom' ]

//---------------------------------------------------------------------------------------------------
//	Component Event Functions

AViewEvent.prototype.click = function()
{
	this._click();
};

AViewEvent.prototype.dblclick = function()
{
	this._dblclick();
};

AViewEvent.prototype.swipe = function()
{
	this._swipe();
};

AViewEvent.prototype.longtab = function()
{
	this._longtab();
};

AViewEvent.prototype.scroll = function()
{
	this._scroll();
};

AViewEvent.prototype.scrollleft = function()
{
	this._scroll();
};

AViewEvent.prototype.scrollright = function()
{
	this._scroll();
};

AViewEvent.prototype.scrolltop = function()
{
	this._scroll();
};

AViewEvent.prototype.scrollbottom = function()
{
	this._scroll();
};

//---------------------------------------------------------------------------------------------------

AViewEvent.prototype._scroll = function()
{
	if(this.bScrollBind) return;
	this.bScrollBind = true;
	
	var aview = this.acomp, lastTop = aview.element.scrollTop, lastLeft = aview.element.scrollLeft;
	
	aview.element.addEventListener('scroll', function(e)
	{
		//scrollTo 함수 호출과 같이 임의로 스크롤을 발생시킨 경우 이벤트가 발생되지 않게 하려면 셋팅
		if(aview.ignoreScrollEvent)
		{
			aview.ignoreScrollEvent = false;
			return;
		}
	
		//---------------------------------
		//	가로 세로 이벤트를 구분하기 위해
				
		//horizontal
		if(lastLeft!=this.scrollLeft)
		{
			//스크롤 방향
			this.vert = false;
			
			aview.reportEvent('scroll', this, e);
			
			var rightVal = this.scrollWidth - this.clientWidth - this.scrollLeft;
		
			if(rightVal < 1) 	//안드로이드인 경우 0.398472 와 같이 소수점이 나올 수 있다.
			{
				//ios 는 overscrolling 때문에 음수값이 여러번 발생한다.
				//이미 scroll bottom 이벤트가 발생했으므로 overscrolling 에 대해서는 무시한다.
				if(afc.isIos && (this.scrollWidth-this.clientWidth-lastLeft) < 1) return;
			
				if(aview._scrollRightManage())
					aview.reportEvent('scrollright', this, e);
			}
			else if(this.scrollLeft < 1)
			{
				if(afc.isIos && lastLeft < 1) return;
				
				if(aview._scrollLeftManage())
					aview.reportEvent('scrollleft', this, e);
			}
			
			lastLeft = this.scrollLeft;
		}
		
		//vertical
		if(lastTop!=this.scrollTop)
		{
			//스크롤 방향
			this.vert = true;
		
			aview.reportEvent('scroll', this, e);
			
			var bottomVal = this.scrollHeight - this.clientHeight - this.scrollTop;
		
			if(bottomVal < 1)	
	        {
				if(afc.isIos && (this.scrollHeight-this.clientHeight-lastTop) < 1) return;
				
	        	if(aview._scrollBottomManage())
					aview.reportEvent('scrollbottom', this, e);
	        }
	        else if(this.scrollTop < 1)
	        {
				if(afc.isIos && lastTop < 1) return;
				
	        	if(aview._scrollTopManage())
					aview.reportEvent('scrolltop', this, e);
	        }
			
			lastTop = this.scrollTop;
		}
	});
};
