


class APivotGridEvent extends AViewEvent
{
	constructor(acomp)
	{
		super(acomp);
	}
}
window.APivotGridEvent = APivotGridEvent;


//---------------------------------------------------------------------------------------------------
//	Component Event Functions
//
//	[ 'select', 'dblclick', 'scroll', 'scrolltop', 'scrollbottom' ]

APivotGridEvent.prototype.select = function()
{
	this.selectBind = true;
};

APivotGridEvent.prototype.scroll = function()
{
	this.scrollBind = true;
};

APivotGridEvent.prototype.scrolltop = function()
{
	this.scrolltopBind = true;
};

APivotGridEvent.prototype.scrollbottom = function()
{
	this.scrollbottomBind = true;
};

APivotGridEvent.prototype.dblclick = function()
{
	this.dblclickBind = true;
};


//-------------------------------------------------------------------------

