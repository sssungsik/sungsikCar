
/**
 * 
 */

class AVideoEvent extends AEvent
{
	constructor(acomp)
	{
		super(acomp);
	}
}
window.AVideoEvent = AVideoEvent;


//---------------------------------------------------------------------------------------------------
//	Component Event Functions
//	events: ['load']

AVideoEvent.prototype.load = function()
{
	this._load();
};


