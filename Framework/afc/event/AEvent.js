
/**
 * @author asoocool
 */

//-----------------------------------------------------------------------------------------
//  AEvent class
//-----------------------------------------------------------------------------------------

class AEvent
{
	constructor(acomp)
	{
		this.acomp = acomp;
		this.isTouchValid = false;
	}
}
window.AEvent = AEvent;

//--------------------------------------------------------------
// static area

AEvent.defEvents = ['actiondown', 'actionmove', 'actionup', 'actioncancel', 'actionenter', 'actionleave', 'keydown', 'keyup'];

//AEvent.TOUCHTIME = 0;
AEvent.LONGPRESS_TIME = 700;

AEvent.TOUCHLEAVE = 20;
if(afc.isIos) AEvent.TOUCHLEAVE = 40;


AEvent.actMap = null;

if(afc.isPC)
{
	AEvent.ACTION_DOWN = 'mousedown';
	AEvent.ACTION_MOVE = 'mousemove';
	AEvent.ACTION_UP = 'mouseup';
	
	//pc 에서는 발생하지 않는 이벤트지만 변수를 맞추기 위해 넣어 놓음, 
	//실제로 pc 버전에서는 아무작동도 하지 않아야 함.
	AEvent.ACTION_CANCEL = 'touchcancel';
	
	AEvent.actMap = 
	{
		touchstart: 'mousedown',
		touchmove: 'mousemove',
		touchend: 'mouseup'
	};
}
else
{
	AEvent.ACTION_DOWN = 'touchstart';
	AEvent.ACTION_MOVE = 'touchmove';
	AEvent.ACTION_UP = 'touchend';
	AEvent.ACTION_CANCEL = 'touchcancel';
	
	AEvent.actMap = 
	{
		mousedown: 'touchstart',
		mousemove: 'touchmove',
		mouseup: 'touchend'
	};
}

//pc 환경에서 touch 관련 이벤트 이름을 mouse 로 바꿔줌...또는 그 반대로
AEvent.actName = function(name)
{
	var ret = AEvent.actMap[name];
	return ret ? ret : name;
};


//The mouseout(over) event triggers when the mouse pointer leaves any child elements as well the selected element.
//The mouseleave(enter) event is only triggered when the mouse pointer leaves the selected element.

AEvent.ACTION_OVER = 'mouseover';
AEvent.ACTION_OUT = 'mouseout';
AEvent.ACTION_ENTER = 'mouseenter';
AEvent.ACTION_LEAVE = 'mouseleave';

AEvent.bindCallback = null;
AEvent.isFreezing = false;

AEvent.bindEvent = function(element, eventName, callback, options)
{
	var returnCallback = null;
	
	if(afc.isPC)
	{
		returnCallback = function(e)
		{
			if(!e.isTrigger && AEvent.isFreezing) 
			{
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
		
			if(e.clientX != undefined)
			{
				e.targetTouches = e.touches = e.changedTouches = [ e ];
			}

			if(AEvent.bindCallback) AEvent.bindCallback(element, eventName, e);

			callback.call(this, e);
		};
	}
	else
	{
		returnCallback = function(e)
		{
			//트리거가 아니고 프리징 된 경우, 즉 실제로 발생된 이벤트인 경우만 프리징 체크를 한다.
			//임의로 발생시킨 트리거는 프리징변수에 영향을 받지 않는다.
			if(!e.isTrigger && AEvent.isFreezing) 
			{
				e.preventDefault();
				e.stopPropagation();
				return false;
			}
			
			if(AEvent.bindCallback) AEvent.bindCallback(element, eventName, e);

			callback.call(this, e);
		};
	}
		
	element.addEventListener(eventName, returnCallback, options);
	
	return returnCallback;
};

AEvent.unbindEvent = function(element, eventName, callback, options)
{
	element.removeEventListener(eventName, callback, options);
};

AEvent.triggerEvent = function(element, eventName, info)
{
	var evt = null;
	
	if(window.Event) 
	{
		evt = new Event(eventName, { bubbles: true, cancelable: true });
	}
	else
	{
		evt = document.createEvent('Event');
		evt.initEvent(eventName, true, true);
	}
	
	if(info)
	{
		evt.clientX = info.clientX;
		evt.clientY = info.clientY;
		evt.pageX = info.pageX;
		evt.pageY = info.pageY;
		
		evt.changedTouches = info.changedTouches;
		evt.targetTouches = info.targetTouches;
		evt.touches = info.touches;
	
		if(info.userData) evt.userData = info.userData;
	}
	
	evt.isTrigger = true;
	
   	element.dispatchEvent(evt);
};

AEvent.keyTrigger = function(element, eventName, which, ctrlKey)
{
	var e = jQuery.Event(eventName);
	e.which = which;
	e.ctrlKey = ctrlKey;
	$(element).trigger(e);
	
	return e;
};



//모든 클릭 이벤트들이 중복해서 발생되지 않도록 체크함.
AEvent.clickComp = null;

//-------------------------------------------------------------




//	overloading functions

//각 터치 상태에 따라 컴포넌트 상태를 상속받아 구현한다.
AEvent.prototype.actionDownState = function(){};
AEvent.prototype.actionMoveState = function(){};
AEvent.prototype.actionUpState = function(){};
AEvent.prototype.actionCancelState = function(){};
AEvent.prototype.actionEnterState = function(){};
AEvent.prototype.actionLeaveState = function(){};
AEvent.prototype.actionClickState = function(){};

//defaultAction 을 제외한 나머지 이벤트 함수들은 이벤트 함수 등록시만 호출된다.
AEvent.prototype.defaultAction = function(){};
//------------------------------------------------------



//---------------------------------------------------------------------------------------------------
//	Component Event Functions

AEvent.prototype.actiondown = function()
{
	this._actiondown();
};

AEvent.prototype.actionmove = function()
{
	this._actionmove();
};

AEvent.prototype.actionup = function()
{
	this._actionup();
};

AEvent.prototype.actioncancel = function()
{
	this._actioncancel();
};

AEvent.prototype.keydown = function()
{
	this._keydown();
};

AEvent.prototype.keyup = function()
{
	this._keyup();
};

AEvent.prototype.actionenter = function()
{
	this._actionenter();
};

AEvent.prototype.actionleave = function()
{
	this._actionleave();
};




//---------------------------------------------------------------------------------------------------


//공통으로 사용되어질 수 있는 이벤트 액션 구현
//상속받아 이벤트 함수를 선언하고 그 함수 안에서 다음 함수들 중 필요한 함수를 호출하면 됨.

AEvent.prototype._actiondown = function()
{
	var thisObj = this;
	this.acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		thisObj.actionDownState();
		thisObj.acomp.reportEvent('actiondown', null, e);
	});
};

AEvent.prototype._actionmove = function()
{
	var thisObj = this;
	
	this.acomp.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		thisObj.actionMoveState();
		thisObj.acomp.reportEvent('actionmove', null, e);
	});
};

AEvent.prototype._actionup = function()
{
	var thisObj = this;
	
	this.acomp.bindEvent(AEvent.ACTION_UP, function(e)
	{
		thisObj.actionUpState();
		thisObj.acomp.reportEvent('actionup', null, e);
	});
};

AEvent.prototype._actioncancel = function()
{
	var thisObj = this;
	
	this.acomp.bindEvent(AEvent.ACTION_CANCEL, function(e)
	{
		thisObj.actionCancelState();
		thisObj.acomp.reportEvent('actioncancel', null, e);
	});
};

AEvent.prototype._dblclick = function()
{
	var thisObj = this;
	
	this.acomp.element.addEventListener('dblclick', function(e)
	{
		thisObj.acomp.reportEvent('dblclick', null, e);
	});
};

AEvent.prototype._click = function(evtName)
{
	var thisObj = this, acomp = this.acomp;
	var startX = 0, startY = 0;
	
	if(!evtName) evtName = 'click';
	
	acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		//좌클릭만 허용
		if(e.which==3) return;
		 
		//afc.log('AEvent.ACTION_DOWN');
		if(!acomp.isEnable || e.touches.length > 1) return;
		if(acomp.ddManager && acomp.ddManager.isDraggable) return;
		
		//AEvent.TOUCHTIME = Date.now();
		
		if(acomp.eventStop) e.stopPropagation();
		
		/*
		if(AEvent.clickComp) return;
		AEvent.clickComp = acomp;
		*/

		thisObj.isTouchValid = true

		var oe = e.changedTouches[0];
		startX = oe.clientX;
		startY = oe.clientY;
		
		thisObj.actionDownState();
		
	});
	
	//모바일인 경우 자신의 영역에 touchstart 를 하지 않으면 touchmove 가 발생하지 않는다.
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다. 
	acomp.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		
		if(!thisObj.isTouchValid || !acomp.isEnable || e.touches.length > 1) return;
		if(acomp.ddManager && acomp.ddManager.isDraggable) return;
		
		if(acomp.eventStop) e.stopPropagation();
		
		//PC 버전의 AButton 은 AButtonEvent 의 action leave 에서 처리
		if(afc.isPC && window.AButton && acomp instanceof AButton) return;
		
		var oe = e.changedTouches[0];
		if(Math.abs(oe.clientX - startX) > AEvent.TOUCHLEAVE || Math.abs(oe.clientY - startY) > AEvent.TOUCHLEAVE) 
		{
			thisObj.isTouchValid = false;
			thisObj.actionCancelState();
		}
	});
	
	acomp.bindEvent(AEvent.ACTION_UP, function(e) 
	{
		if(!thisObj.isTouchValid || !acomp.isEnable || e.touches.length > 1) return;
		if(acomp.ddManager && acomp.ddManager.isDraggable) return;

	   	//상위 뷰가 터치 이벤트를 받지 않도록, ex)리스트뷰의 셀렉트 이벤트 발생 방지
	    if(acomp.eventStop) e.stopPropagation();
	
		thisObj.actionUpState();
		
		//acomp.reportEvent(evtName, null, e);
		
	});
	
	acomp.bindEvent(AEvent.ACTION_CANCEL, function(e) 
	{
		thisObj.isTouchValid = false;
		
		thisObj.actionCancelState();
		
	});
	
	//웹접근성 관련 처리, 스크린리더기가 작동되면 input 계열의 태그인 경우 위 세가지 이벤트가 발생되지 않음(label 등은 발생함)
	//그래서 위 세 이벤트는 각 상태를 변경하는 용도로만 사용하고 실제 이벤트는 웹의 실제 클릭 이벤트를 사용하도록
	//구조가 변경됨. 이 경우 isSafeClick 은 작동하지 않을 수 있음. 차후에 테스트 해보기
	//acomp.$ele.on('click', function(e)
	acomp.bindEvent('click', function(e)
	{
		if(!acomp.isEnable || !thisObj.isTouchValid) return;
		
	   	//상위 뷰가 터치 이벤트를 받지 않도록, ex)리스트뷰의 셀렉트 이벤트 발생 방지
	    if(acomp.eventStop) e.stopPropagation();
	
		//click 이벤트에는 changedTouches 이벤트가 없기 때문에 셋팅
		//이전 버전에서 사용하고 있기때문에 오류를 막기 위해 셋팅, 향후 제거하기
		e.targetTouches = e.touches = e.changedTouches = [ e ];
		
		//특정한 경우에 click이벤트만 동작하고 actionup이 발생되지 않아 setCheck하는 로직을
		//actionUpState에서 actionClickState로 이동
		//1. 모바일기기(안드로이드 ios)에서 두손가락으로 버튼 클릭시
		//2. ios 13 이상에서 버튼의 바깥영역이지만 아주 가까운 부분 클릭시 클릭이벤트만 발생된다.
		thisObj.actionClickState();
		
		acomp.reportEvent(evtName, null, e);
	});
	
};

AEvent.prototype._longtab = function()
{
	var thisObj = this, acomp = this.acomp, timeout = null, startX = 0, startY = 0;
	
	acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		if(!acomp.isEnable || e.touches.length > 1) return;
		
		//if((new Date().getTime() - AEvent.TOUCHTIME) < afc.CLICK_DELAY) return; 
		
		thisObj.actionDownState();

		var oe = e.changedTouches[0];
		startX = oe.clientX;
		startY = oe.clientY;
		
		if(timeout) 
		{
			clearTimeout(timeout);
			timeout = null;
		}
        
        timeout = setTimeout(function()
        {
			//롱탭 이벤트 시에는 버튼의 클릭이벤트가 발생되지 않도록 하기 위해
			thisObj.isTouchValid = false;
			
        	timeout = null;
            acomp.reportEvent('longtab', null, e);
            
        }, AEvent.LONGPRESS_TIME);
	});

	acomp.bindEvent(AEvent.ACTION_MOVE, function(e) 
	{
		var oe = e.changedTouches[0];
		if(Math.abs(oe.clientX - startX) > AEvent.TOUCHLEAVE || Math.abs(oe.clientY - startY) > AEvent.TOUCHLEAVE)
		{
			if(timeout) 
			{
				clearTimeout(timeout);
				timeout = null;
			}
			thisObj.actionCancelState();
		}
	});

	acomp.bindEvent(AEvent.ACTION_UP, function(e) 
	{
        if(timeout) 
        {
        	clearTimeout(timeout);
        	timeout = null;
        }
		
		thisObj.actionUpState();
		
		//if((new Date().getTime() - AEvent.TOUCHTIME) > afc.CLICK_DELAY) AEvent.TOUCHTIME = new Date().getTime();	
		
	});
	
	acomp.bindEvent(AEvent.ACTION_CANCEL, function(e) 
	{
		thisObj.isTouchValid = false;
		
		if(timeout) 
		{
			clearTimeout(timeout);
			timeout = null;
		}
		thisObj.actionCancelState();
	});
};

AEvent.prototype._swipe = function()
{
	var scrlManager = new ScrollManager();
	//scrlManager.setOption({moveDelay:200});
	//스와이프 이벤트 감도, 값이 작을 수록 작은 스와이프에도 이벤트가 발생한다.
	scrlManager.setOption({moveDelay:100});
	
	var isDown = false, acomp = this.acomp;
	
	acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		
		if(acomp.eventStop) e.stopPropagation();
		
		//asoocool
		//이 부분을 추가하면 다른 스크롤이 발생하지 않음.
		//e.preventDefault();

		scrlManager.initScroll(e.changedTouches[0].clientX);
	});
	
	//move
	acomp.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		if(acomp.eventStop) e.stopPropagation();
		
		scrlManager.updateScroll(e.changedTouches[0].clientX, function(move)
		{
		});
	});
	
	acomp.bindEvent(AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		if(acomp.eventStop) e.stopPropagation();
		
		scrlManager.scrollCheck(e.changedTouches[0].clientX, function(move)
		{
			var evtObj = 
			{
				direction: 'left',//next
				distance: this.totDis
			};
			
			if(this.totDis<0) 
				evtObj.direction = 'right';
		
			acomp.reportEvent('swipe', evtObj, e);
			return false;
		});
	});
};


AEvent.prototype._actionenter = function()
{
	var thisObj = this;
	this.acomp.$ele.on('mouseenter', function(e)
	{
		thisObj.actionEnterState();
		thisObj.acomp.reportEvent('actionenter', null, e);
	});
};

AEvent.prototype._actionleave = function()
{
	var thisObj = this;
	this.acomp.$ele.on('mouseleave', function(e)
	{
		thisObj.actionLeaveState();
		thisObj.acomp.reportEvent('actionleave', null, e);
	});
};

AEvent.prototype._keydown = function()
{
	this.bindKeyDown = true;
	if(!this.acomp.isDev()) theApp.addKeyEventListener('keydown', this);
};

AEvent.prototype._keyup = function()
{
	this.bindKeyUp = true;
	if(!this.acomp.isDev()) theApp.addKeyEventListener('keyup', this);
};


AEvent.prototype._load = function()
{
	var thisObj = this;
	
	this.acomp.element.addEventListener('load', function(e)
	{
		thisObj.acomp.reportEvent('load', this.src, e);	
	});
};

AEvent.prototype.onKeyDown = function(e)
{
	let focusComp = AComponent.getFocusComp()
	if(focusComp && this.acomp.element.contains(focusComp.element))
	{
		this.acomp.reportEvent('keydown', null, e)
	}

	//if(this.acomp===AComponent.getFocusComp())
	//	this.acomp.reportEvent('keydown', null, e);
};

AEvent.prototype.onKeyUp = function(e)
{
	let focusComp = AComponent.getFocusComp()
	if(focusComp && this.acomp.element.contains(focusComp.element))
	{
		this.acomp.reportEvent('keyup', null, e)
	}

	//if(this.acomp===AComponent.getFocusComp())
	//	this.acomp.reportEvent('keyup', null, e);
};

