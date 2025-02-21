
/**
 * @author asoocool
 */

class AScrollBarEvent extends AEvent
{
	constructor(acomp)
	{
		super(acomp);
	}
}
window.AScrollBarEvent = AScrollBarEvent;




//---------------------------------------------------------------------------------------------------
//	Component Event Functions


AScrollBarEvent.prototype.scroll = function()
{
	this._scroll();
};



//---------------------------------------------------------------------------------------------------

AScrollBarEvent.prototype._scroll = function()
{
	var acomp = this.acomp, oldVal = 0;
	
	if(acomp.isScrollVert)
	{
		acomp.$ele.scroll(function(e)
		{
            e.scrollMove = this.scrollTop - oldVal;
			oldVal = this.scrollTop;

			acomp.reportEvent('scroll', this.scrollTop, e);
		});
	}
	else 
	{
		acomp.$ele.scroll(function(e)
		{
            e.scrollMove = this.scrollLeft - oldVal;
			oldVal = this.scrollLeft;

			acomp.reportEvent('scroll', this.scrollLeft, e);
		});
	}
};
