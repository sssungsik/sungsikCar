
/**
 * @author asoocool
 */

class ATabViewEvent extends AEvent
{
	constructor(acomp)
	{
		super(acomp);
	}
}
window.ATabViewEvent = ATabViewEvent;



//---------------------------------------------------------------------------------------------------
//	Component Event Functions
ATabViewEvent.prototype.swipe = function()
{
	this._swipe();
};


//---------------------------------------------------------------------------------------------------

