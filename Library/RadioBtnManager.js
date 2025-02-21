

RadioBtnManager = class RadioBtnManager
{
    constructor(view, isCheckStyle)
    {
        this.selectBtn = null;
        this.view = view;
        this.isCheckStyle = isCheckStyle;

    }
}

RadioBtnManager.prototype.selectButton = function(selBtn)
{
	if(typeof(selBtn)=="string") selBtn = this.view.findCompById(selBtn);
	
	if(!selBtn) return;
	
	if(this.isCheckStyle)
	{
		selBtn.setCheck(true);

		if(this.selectBtn) 
		{
			this.selectBtn.setCheck(false);
			
			//체크된 버튼을 한번더 누른 경우, 체크 해제
			if(this.selectBtn===selBtn) selBtn = null;
		}
	}
	else
	{
		if(this.selectBtn) this.selectBtn.enable(true);
		// ↑↓ 순서변경 - 체크스타일이 아닌 일반 스타일은 같은 버튼을 selectButton 하는 경우 enable true 되면 안되므로 
		selBtn.enable(false);
	}
	
    this.selectBtn = selBtn;
	
	return selBtn;
};

RadioBtnManager.prototype.getSelectButton = function()
{
    return this.selectBtn;
};

RadioBtnManager.prototype.reset = function(view)
{
	if(this.selectBtn) this.selectBtn.enable(true);
	this.selectBtn = null;
	
	if(view!=undefined) this.view = view;
};
