                

/**
 * @author asoocool
 */

class ALabelEvent extends AEvent
{
	constructor(acomp)
	{
		super(acomp);
	}
}
window.ALabelEvent = ALabelEvent;




//---------------------------------------------------------------------------------------------------
//	Component Event Functions

ALabelEvent.prototype.click = function()
{
	this._click();
};

ALabelEvent.prototype.longtab = function()
{
	this._longtab();
};


//---------------------------------------------------------------------------------------------------
