(async function() {
                    
await afc.import("Framework/afc/component/AFrameWnd.js")


/**
Constructor
Do not call Function in Constructor.
*/
ADialog = class ADialog extends AFrameWnd
{
	constructor(containerId)
	{
		super(containerId)
	
	}

	openDialog(viewUrl, parent, title, width, height)
    {
	    return super.open(viewUrl, parent, title, 0, 0, width, height)
    }

}

//window.ADialog = ADialog

//옵션을 변경한다던가 타이틀을 만드는 등의 태그 생성 작업
ADialog.prototype.init = function(context)
{
	//not overwrite 이 true 이기때문에 
	//부모의 옵션보다 우선 하려면 init 위에 두어야 한다.
	this.setOption(
	{
		isModal: true,
		isCenter: true,
		isResizable: false,
		focusOnInit: true
		
	}, true);
	//---------------------------------------------

	AFrameWnd.prototype.init.call(this, context);
};


ADialog.prototype.onCreateDone = function()
{
	theApp.addKeyEventListener('keydown', this);
	
	var view = this.getView();
	if(view) 
	{
		var inputs = view.findCompByBase('ATextField');
		var areas = view.findCompByBase('ATextArea');
		
		for(var i=0; i<inputs.length; i++)
			inputs[i].enableKeyPropagation(true);	
		
		for(i=0; i<areas.length; i++)
			areas[i].enableKeyPropagation(true);	
	}
};

ADialog.prototype.close = function(result, data)
{
	theApp.removeKeyEventListener('keydown', this);
	
	AFrameWnd.prototype.close.call(this, result, data);
};

ADialog.prototype.onOK = function()
{
	var view = this.getView();
	
	if(view && view.onCloseFrame && !view.onCloseFrame()) return;
	if(view && view.onDialogOk && !view.onDialogOk()) return;
	
	this.close(0);
};

ADialog.prototype.onCancel = function()
{
	var view = this.getView();
	
	if(view && view.onCloseFrame && !view.onCloseFrame()) return;
	if(view && view.onDialogCancel && !view.onDialogCancel()) return;
	
	this.close(1);
};

ADialog.prototype._onCloseBtnClick = function(acomp, info)
{
	var thisObj = this;
	
	setTimeout(function()
	{
		thisObj.onCancel();
	}, 0);
};

ADialog.prototype._makeTitle = async function()
{
	await AFrameWnd.prototype._makeTitle.call(this);

	var comps = this.title.view.getChildren();
	comps = comps[0].getAllLayoutComps();
	
	comps[2].hide();
	comps[3].hide();
};

ADialog.prototype.onKeyDown = function(e)
{
	var thisObj = this;
	
	if(e.which==afc.KEY_ENTER)
	{
		setTimeout(function()
		{
			thisObj.onOK();
			
		}, 0);
	}
	else if(e.which==afc.KEY_ESC)
	{
		setTimeout(function()
		{
			thisObj.onCancel();
		}, 0);
	}
	
	else return false;	//다른 키는 뒤로 전달 되도록
	
	e.stopPropagation();
	return true;
	
};
                    

})();     