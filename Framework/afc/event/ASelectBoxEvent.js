
/**
 * @author asoocool
 */

class ASelectBoxEvent extends AEvent
{
	constructor(acomp)
	{
		super(acomp);
	}
}
window.ASelectBoxEvent = ASelectBoxEvent;


ASelectBoxEvent.prototype.defaultAction = function()
{
	const thisObj = this;
	//상위로 이벤트를 전달할 필요가 없다.
    this.acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
    {
		AComponent.setFocusComp(thisObj.acomp);
    	e.stopPropagation();
    });
};


//---------------------------------------------------------------------------------------------------
//	Component Event Functions


ASelectBoxEvent.prototype.change = function()
{
	this._change();
};

//---------------------------------------------------------------------------------------------------



ASelectBoxEvent.prototype._change = function()
{
	var aselectbox = this.acomp;
	
	//aselectbox.$ele.bind('change', function(e) 
	AEvent.bindEvent(aselectbox.element, 'change', function(e) 
	{
		//aselectbox.reportEvent('change', aselectbox.$ele.val());
		aselectbox.reportEvent('change', this.value);
	});
		
};

