
/**
 * @author asoocool
 */

class ASliderEvent extends AEvent
{
	constructor(acomp)
	{
		super(acomp);
	}
}
window.ASliderEvent = ASliderEvent;




//---------------------------------------------------------------------------------------------------
//	Component Event Functions


ASliderEvent.prototype.change = function()
{
	this._change();
};



//---------------------------------------------------------------------------------------------------


ASliderEvent.prototype._change = function()
{
	var aslider = this.acomp;
	
	aslider.$ele.bind('change', function(e) 
	{
		aslider.reportEvent('change', e);
	});
};
