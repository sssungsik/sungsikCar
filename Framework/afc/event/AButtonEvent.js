               
/**
 * @author asoocool
 */

class AButtonEvent extends AEvent
{
	constructor(acomp)
	{
		super(acomp);
		
		this.keyDownVal = false;
	}
}
window.AButtonEvent = AButtonEvent;


//	overloading functions

AButtonEvent.prototype.actionDownState = function()
{
	AComponent.setFocusComp(this.acomp);

	this.acomp.changeBtnState(AButton.DOWN);
};

/*
AButtonEvent.prototype.actionMoveState = function()
{
	this.acomp.defaultBtnState();
};
*/

AButtonEvent.prototype.actionUpState = function()
{
	if(this.acomp.option.isCheckBtn)
	{
		//모바일인 경우 long press 를 하게 되면 click 이벤트가 발생하지 않으므로 
		//버튼 모양도 원상태로 리셋한다.
		if(afc.isMobile && Date.now()-AEvent.TOUCHTIME > AEvent.LONGPRESS_TIME) this.acomp.setCheck(this.acomp.getCheck());
	}
	else
	{
		if(afc.isPC) this.acomp.changeBtnState(AButton.OVER);
		else this.acomp.defaultBtnState();
	}
};

AButtonEvent.prototype.actionCancelState = function()
{
	if(this.acomp.option.isCheckBtn && this.acomp.getCheck()) return;
	
	this.acomp.defaultBtnState();
};

AButtonEvent.prototype.actionEnterState = function()
{
	if(this.acomp.option.isCheckBtn && this.acomp.getCheck()) return;
	
	this.acomp.changeBtnState(AButton.OVER);
};

AButtonEvent.prototype.actionLeaveState = function()
{
	if(this.acomp.option.isCheckBtn && this.acomp.getCheck()) return;
	
	this.acomp.defaultBtnState();
};

AButtonEvent.prototype.actionClickState = function()
{
	if(this.acomp.option.isCheckBtn)
	{
		this.acomp.setCheck(!this.acomp.getCheck());
	}
};

AButtonEvent.prototype.defaultAction = function()
{
	this._click();
	this._keydown();
	this._keyup();

	if(afc.isPC)
	{
		this._actionenter();
		this._actionleave();
	}
};

//---------------------------------------------------------------------------------------------------
//	Component Event Functions


//defaultAction 에서 호출했기 때문에 
//이벤트가 등록되어 있어도 호출되지 않도록 인터페이스를 닫는다.
AButtonEvent.prototype.actionenter = null;
AButtonEvent.prototype.actionleave = null;
AButtonEvent.prototype.keydown = null;
AButtonEvent.prototype.keyup = null;
//AButtonEvent.prototype.click = null;	//클릭은 기본 이벤트가 아니므로 안 해줘도 됨.

//default _keydown 이벤트에서 커스텀 _keydown 이벤트로 변경
AButtonEvent.prototype.onKeyDown = function(e)
{	
	//if(this.acomp!==AComponent.getFocusComp()) return;
	
	if(!this.acomp.keyPropagation)
	{
		e.stopPropagation();
		
		if(e.keyCode == 9)
		{
			var acont = this.acomp.getContainer();
			if(acont && acont.tabKey)
			{
				var nextComp = acont.tabKey.findNextTab(this.acomp, e.shiftKey);
				if(nextComp) 
				{
					nextComp.setFocus();
					e.preventDefault();
				}
			}
		}
	}
		
	if(e.keyCode == 13 || e.keyCode == 32)	//enter and space
	{	
		if(!this.keyDownVal)
		{
			this.keyDownVal = true;
			this.actionDownState();
		}
	}
	
	this.acomp.reportEvent('keydown', null, e);
	
	//return (this.acomp.keyPropagation == false);
};

//default _keyup 이벤트에서 커스텀 _keyup 이벤트로 변경
AButtonEvent.prototype.onKeyUp = function(e)
{	
	//if(this.acomp!==AComponent.getFocusComp()) return;
	
	if(!this.acomp.keyPropagation) e.stopPropagation();
		
	if(e.keyCode == 13 || e.keyCode == 32)	//enter and space
	{
		this.keyDownVal = false;
		this.actionUpState();
		this.acomp.defaultBtnState();
		//this.acomp.reportEvent('click', null, e);
	}
	
	this.acomp.reportEvent('keyup', null, e);
	
	//return (this.acomp.keyPropagation == false);
};

AButtonEvent.prototype.longtab = function()
{
	this._longtab();
};

//---------------------------------------------------------------------------------------------------

AButtonEvent.prototype._keydown = function()
{
	var thisObj = this;
	
	this.acomp.$ele.on('keydown', function(e) 
	{
		//console.log(e.keyCode + '----> keydown');
		thisObj.onKeyDown(e);
	});
};

AButtonEvent.prototype._keyup = function()
{
	var thisObj = this;
	
	this.acomp.$ele.on('keyup', function(e) 
	{
		//console.log(e.keyCode + '----> keyup');
		thisObj.onKeyUp(e);
	});
};
