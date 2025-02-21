         
/**
 * @author asoocool
 */

class AScrollBar extends AComponent
{
	constructor()
	{
		super()
	
		//this.scrlAreaHeight = 0;
		this.scrollGap = 0;			//하나의 데이터를 표현할 영역의 넓이... 보통 그리드에서 로우
		this.scrollPadding = 0;		//스크롤 영역에서 제외할 상단 영역.. 보통 그리드에서 헤더

		this.countPerArea = 0;		//한 영역에 보여질 데이터 개수
		this.dataCount = 0;			//스크롤바가 표현하고 있는 데이터의 개수
		this.$cntLo = null;			//컨텐츠의 가상영역 1
		this.$cntHi = null;			//컨텐츠의 가상영역 2, 브라우저에 따라 1개로 데이터 개수를 모두 표현하지 못하므로 사용

		this.isScrollVert = true;

        this.option = 
        {
            countAreaAdd: 0,        //countPerArea 계산 값에 추가적으로 더할 count
            isBorderCount: false,   //countPerArea 계산 시, 스크롤 갭마다 보더를 카운트할 지
            isCountAreaCeil: false  //countPerArea 계산 시 Math.ceil 을 사용할 지, false 이면 floor
        }
	}

}

window.AScrollBar = AScrollBar


AScrollBar.CONTEXT = 
{
	//tag:'<div data-base="AScrollBar" data-class="AScrollBar" class="AScrollBar-Style"><pre> </pre><pre> </pre></div>',
	
	//동적으로 추가되도록 변경
	tag:'<div data-base="AScrollBar" data-class="AScrollBar" class="AScrollBar-Style"></div>',

    defStyle: 
    {
    	width: afc.scrlWidth+'px', height:'200px' 
    },
   
    events: ['scroll']
};

AScrollBar.NAME = "AScrollBar";

AScrollBar.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	//동적으로 추가되도록 변경
	this.$ele.html('<span>.</span><span>.</span>');
	this.$ele.css(
	{
		'z-index': 0,	//scrollTop 으로 이동할 경우는 부모 레이어에 z-index 를 주어 가속 시킨다.
	});
	var $child = this.$ele.children();
	
	this.$cntLo = $child.eq(0);
	this.$cntHi = $child.eq(1);

	//.AScrollBar-Style > span 에 추가되어져 있음
	//for debugging
	//this.$cntLo.css({'background':'cyan'});
	//this.$cntHi.css({'background':'magenta'});


	var scrollType = this.getAttr('data-scroll-type');
	
	if(!scrollType) scrollType = 'vert';
	
	this.setScrollType(scrollType);
	
	if(afc.isScrollIndicator) this.enableScrollIndicator();
};

AScrollBar.prototype.setScrollType = function(type)
{
	this.isScrollVert = (type=='vert');
	
	//세로 스크롤바인 경우 
	if(this.isScrollVert)
	{
		this.setStyle('overflow-x', 'hidden');
		this.setStyle('overflow-y', 'scroll');
		//세로 스크롤바는 밑으로 줄바꿈 되도록 추가하지 않는다.
		//this.setStyle('white-space', 'nowrap'); 
		
		this.$cntLo.width('100%');
		this.$cntHi.width('100%');
		
		this.$cntLo.height(0);
		this.$cntHi.height(0);
		
		//IE는 완전히 덮히면 스크롤 작동이 제대로 안됨. + firefox도 마찬가지
		//if((afc.isIE && afc.strIEVer!="edge") || afc.isFirefox) this.setWidth(afc.scrlWidth+1);
		//else this.setWidth(afc.scrlWidth);
		
		this.setWidth(afc.scrlWidth+1);
	}
	else 
	{
		this.setStyle('overflow-x', 'scroll');
		this.setStyle('overflow-y', 'hidden');
		//가로 스크롤바가 생기도록
		this.setStyle('white-space', 'nowrap');
		
		this.$cntLo.height('100%');
		this.$cntHi.height('100%');
		
		this.$cntLo.width(0);
		this.$cntHi.width(0);
		
		//IE는 완전히 덮히면 스크롤 작동이 제대로 안됨. + firefox도 마찬가지
		//if((afc.isIE && afc.strIEVer!="edge") || afc.isFirefox)  this.setHeight(afc.scrlWidth+1);
		//else this.setHeight(afc.scrlWidth);
		
		this.setHeight(afc.scrlWidth+1);
	}

};

AScrollBar.prototype.enableScrollIndicator = function()
{
	this.scrlIndicator = new ScrollIndicator();
	
	if(this.isScrollVert) 
	{
		this.scrlIndicator.init('vertical', this.element);
	}
	else 
	{
		this.scrlIndicator.init('horizontal', this.element);
	}
};

//------------------------------

//scrollGap : 하나의 데이터를 표현할 영역의 넓이... 보통 그리드에서 로우
//scrollPadding : 스크롤 영역에서 제외할 상단 영역.. 보통 그리드에서 헤더
AScrollBar.prototype.setScrollArea = function(scrlAreaHeight, scrollPadding, scrollGap)
{
	//this.scrlAreaHeight = scrlAreaHeight;
	this.scrollPadding = scrollPadding;
	this.scrollGap = scrollGap;
	
	let borderCnt = 0;
	
	if(this.option.isBorderCount) borderCnt = (scrlAreaHeight-scrollPadding)/scrollGap;

    this.countPerArea = (scrlAreaHeight-scrollPadding-borderCnt)/scrollGap;

    if(this.option.isCountAreaCeil) this.countPerArea = Math.ceil(this.countPerArea);
    else this.countPerArea = Math.floor(this.countPerArea);
};

AScrollBar.prototype.getCountPerArea = function()
{
	return this.countPerArea + this.option.countAreaAdd;
};


AScrollBar.prototype.setDataCount = function(dataCount)
{
	var cntHeight = this.scrollGap*dataCount + this.scrollPadding;
	var half = parseInt(cntHeight/2), mod = cntHeight%2;
	
	if(this.isScrollVert)
	{
		this.$cntLo.css('height', half + 'px');
		this.$cntHi.css('height', (half+mod) + 'px');
		
		//static 에 inline-block 을 사용했기 때문에 x,y 값을 지정하지 않아도 된다.
		//this.$cntHi.css('top', half + 'px');
	}
	else 
	{
		this.$cntLo.css('width', half + 'px');
		this.$cntHi.css('width', (half+mod) + 'px');
	}
	
	this.dataCount = dataCount;
};

AScrollBar.prototype.addDataCount = function(count)
{
	this.setDataCount(this.dataCount+count);
};

//휠 이벤트 발생시 스크롤 바를 이동 시킬 영역을 셋팅한다.
//AScrollBar.prototype.setWheelArea = function(wheelArea)
AScrollBar.prototype.addWheelArea = function(wheelArea)
{
	var thisObj = this;
	
	wheelArea.addEventListener("wheel", function(e)
	{
		//지정한 방향으로 wheel 한 경우에만 처리
        if(!(thisObj.isScrollVert ^ e.shiftKey)) return;

		//e.preventDefault();
		//e.stopPropagation();
		
   		var delta = 0;
		
		//console.log(e);
		//console.log(e.wheelDelta + ', ' + e.deltaY);
		
        //가로 스크롤
        if(e.shiftKey)
        {
            delta = e.deltaY;
        }
        //세로 스크롤
        else
        {
            //chrome, edge
            if(afc.isFirefox) delta = e.deltaY/3;
            else delta = e.deltaY/100;
        }

        
		
		//console.log(delta);
		
		//if(delta > 0) thisObj.onWheelUp();
		//else if(delta < 0) thisObj.onWheelDown();
        
        let isEndOfScroll;
        if(delta > 0)
        {
            if(thisObj.isScrollVert) isEndOfScroll = thisObj.isScrollBottom();
            else isEndOfScroll = thisObj.isScrollRight();
        }
        else
        {
            if(thisObj.isScrollVert) isEndOfScroll = thisObj.isScrollTop();
            else isEndOfScroll = thisObj.isScrollLeft();
        }

        // 끝까지 스크롤한 경우가 아니면 기본스크롤을 막아서 상위영역의 스크롤이 안되게 한다.
        if(!isEndOfScroll) e.preventDefault();
		
		thisObj._onWheelEvent(delta);
        
		
   	}, false);
};

AScrollBar.prototype._onWheelEvent = function(delta)
{
	this.offsetBarPos(this.scrollGap*delta);
};

/*
AScrollBar.prototype.onWheelUp = function(cnt)
{
	this.offsetBarPos(-this.scrollGap*cnt);
};

AScrollBar.prototype.onWheelDown = function(cnt)
{
	this.offsetBarPos(this.scrollGap*cnt);
};
*/

AScrollBar.prototype.scrollToTop = function()
{
	this.setBarPos(0)
};

AScrollBar.prototype.scrollToBottom = function()
{
    this.setBarPos(this.element.scrollHeight)

    return this.element.scrollTop
}

AScrollBar.prototype.offsetBarPos = function(move)
{
	if(this.isScrollVert) this.element.scrollTop += move;
	else this.element.scrollLeft += move;
	
};

AScrollBar.prototype.setBarPos = function(pos)
{
	if(this.isScrollVert) this.element.scrollTop = pos;
	else this.element.scrollLeft = pos;
	
};

AScrollBar.prototype.getBarPos = function()
{
	if(this.isScrollVert) return this.element.scrollTop;
	else return this.element.scrollLeft;
};

AScrollBar.prototype.isScrollTop = function()
{
	return (this.element.scrollTop==0);
};

AScrollBar.prototype.isScrollBottom = function()
{
	return (this.element.scrollHeight-this.element.clientHeight-this.element.scrollTop <= 1);
};

AScrollBar.prototype.isScrollLeft = function()
{
	return (this.element.scrollLeft==0);
};

AScrollBar.prototype.isScrollRight = function()
{
	return (this.element.scrollWidth-this.element.clientWidth-this.element.scrollLeft <= 1);
};



