
/**
 * @author asoocool
 */

class ADataGridEvent extends AEvent
{
	constructor(acomp)
	{
		super(acomp)

        this.evtObj = {}
	}
}
window.ADataGridEvent = ADataGridEvent;

ADataGridEvent.prototype.applyEvent = function()
{
    let dataGrid = this.acomp

	if(dataGrid.pivotGrid) 
    {
        dataGrid.pivotGrid.addEventListener('select', this, '_onGridSelect')
        dataGrid.pivotGrid.addEventListener('longtab', this, '_onGridLongtab')
        dataGrid.pivotGrid.addEventListener('dblclick', this, '_onGridDblclick')
    }

	dataGrid.grid.addEventListener('select', this, '_onGridSelect')
    dataGrid.grid.addEventListener('longtab', this, '_onGridLongtab')
	dataGrid.grid.addEventListener('dblclick', this, '_onGridDblclick')
}

ADataGridEvent.prototype._onGridSelect = function(acomp, info, e)
{
    let curEvtObj = this.evtObj

	this.evtObj = this.acomp._gridClickManage(acomp, info, e)

    if(this.selectBind && this.evtObj)
    {
        if(this.acomp.option.isFullRowSelect)
        {
            if(this.evtObj.rowInx==curEvtObj.rowInx) return;
        }
        else 
        {
            if(this.evtObj.rowInx==curEvtObj.rowInx && this.evtObj.colInx==curEvtObj.colInx) return;
        }

        this.acomp.reportEvent('select', this.evtObj, e)
    }
}

ADataGridEvent.prototype._onGridDblclick = function(acomp, info, e)
{
    if(this.dblclickBind)
        this.acomp.reportEvent('dblclick', this.evtObj, e);
}

ADataGridEvent.prototype._onGridLongtab = function(acomp, info, e)
{
    if(this.longtabBind)
        this.acomp.reportEvent('longtab', this.evtObj, e)
}

//---------------------------------------------------------------------------------------------------
//	Component Event Functions

ADataGridEvent.prototype.select = function()
{
	this.selectBind = true
}

ADataGridEvent.prototype.scrolltop = function()
{
	this.scrolltopBind = true
}

ADataGridEvent.prototype.scrollbottom = function()
{
	this.scrollbottomBind = true
}

ADataGridEvent.prototype.longtab = function()
{
    this.longtabBind = true
}

ADataGridEvent.prototype.dblclick = function()
{
    this.dblclickBind = true
}




//---------------------------------------------------------------------------------------------------
