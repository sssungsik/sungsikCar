
/**
 * @author asoocool
 */

class ACalendarPickerEvent extends AEvent
{
	constructor(acomp)
	{
		super(acomp);
		
		this.prevInsideFocus = false;
	}
}
window.ACalendarPickerEvent = ACalendarPickerEvent;


ACalendarPickerEvent.prototype.actionUpState = function()
{
	var $input = this.acomp.$ele.children('input');
    //if($input.attr('readonly') && this.acomp.isEnable)
    //if(this.acomp.isEnable)
	//{
		// this.acomp.openCalendar(true);
	//}
};

ACalendarPickerEvent.prototype.defaultAction = function()
{
	this._click();
	this._focus();
};

ACalendarPickerEvent.prototype._focus = function()
{
	var acomp = this.acomp, thisObj = this,
	$input = acomp.element.getElementsByTagName('input')[0];
	
	acomp.$ele.bind('focus', function(e) 
	{
		if(thisObj.prevInsideFocus) 
		{
			thisObj.prevInsideFocus = false;
			return;
		}
		$input.focus();
	});
	
	$input.addEventListener('keydown', function(e){
		if(e.keyCode == 9 || e.keyCode == 13)
		{
			thisObj.prevInsideFocus = true;
			acomp.$ele.focus();
			e.preventDefault();
		}
	});
};

//---------------------------------------------------------------------------------------------------
//	Component Event Functions
//	events: ['click', 'select', 'change']
