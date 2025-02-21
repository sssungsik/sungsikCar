
/**
 * @author asoocool
 */

class ACheckBoxEvent extends AEvent
{
	constructor(acomp)
	{
		super(acomp);
	}
}
window.ACheckBoxEvent = ACheckBoxEvent;

ACheckBoxEvent.prototype.actionDownState = function()
{
	AComponent.setFocusComp(this.acomp);
};

ACheckBoxEvent.prototype.actionClickState = function()
{
	this.acomp.setCheck(!this.acomp.getCheck());
};

ACheckBoxEvent.prototype.defaultAction = function()
{
	this._click();
	this._keyup();
};

ACheckBoxEvent.prototype.keyup = null;
ACheckBoxEvent.prototype.change = null;

ACheckBoxEvent.prototype.onKeyUp = function(e)
{	
	if(this.acomp!==AComponent.getFocusComp()) return;
	
	//if(!this.acomp.keyPropagation) e.stopPropagation();
		
	if(e.keyCode == 13 || e.keyCode == 32)
	{
		this.actionClickState();
		this.acomp.reportEvent('click', null, e);
	}
	
	this.acomp.reportEvent('keyup', null, e);
	
	return (this.acomp.keyPropagation == false);
};


//---------------------------------------------------------------------------------------------------
//	Component Event Functions





//---------------------------------------------------------------------------------------------------
                    
