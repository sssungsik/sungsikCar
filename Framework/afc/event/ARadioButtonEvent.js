
/**
 * @author asoocool
 */

class ARadioButtonEvent extends AEvent
{
	constructor(acomp)
	{
		super(acomp);
	}
}
window.ARadioButtonEvent = ARadioButtonEvent;



//	overloading functions

ARadioButtonEvent.prototype.actionClickState = function()
{
	//this.acomp.setSelect(!this.acomp.getSelect());
	if(this.acomp.getParent().className != 'ARadioGroup')
	{
		this.acomp.setSelect(true);
	}
};

ARadioButtonEvent.prototype.defaultAction = function()
{
	this._click();
	this._keyup();
};

ARadioButtonEvent.prototype.keyup = null;

ARadioButtonEvent.prototype.onKeyUp = function(e)
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
