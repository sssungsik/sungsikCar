

class ARadioGroup extends AView
{
	constructor()
	{
		super()
	
		this.radioBtns = null;
		this.selectedBtn = null;
	}

	
}

window.ARadioGroup = ARadioGroup

ARadioGroup.CONTEXT = 
{
    tag: '<div data-base="ARadioGroup" data-class="ARadioGroup" class="ARadioGroup-Style"></div>',

    defStyle: 
    {
        width:'400px', height:'100px' 
    },

    events: ['change']
};

ARadioGroup.NAME = 'ARadioGroup';

ARadioGroup.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	//버튼 세팅
	this.radioBtns = this.findCompByBase('ARadioButton');
	
	//이벤트 세팅
	for(var i=0; i<this.radioBtns.length; i++)
	{
		this.radioBtns[i].addEventListener('click', this, 'btnClickEvent');
	}

	var selectId = this.$ele.attr('data-default-select');
	if(selectId) 
	{
		var selBtn = this.getRadioBtnById(selectId);
		if(selBtn)
		{
			this.setSelectBtn(selBtn);
		}
	}
};

ARadioGroup.prototype.btnClickEvent = function(radioBtn, info, e)
{
	if(this.selectedBtn===radioBtn) return;
	
	var oldBtn = this.selectedBtn;
	
	this.setSelectBtn(radioBtn);
	
	this.reportEvent('change', [oldBtn, radioBtn], e);
};

ARadioGroup.prototype.clearAll = function()
{
	//이벤트 세팅
	for(var i=0;i<this.radioBtns.length;i++)
	{
		this.radioBtns[i].setSelect(false);
	}
	
	this.selectedBtn = null;
};

ARadioGroup.prototype.selectBtnByValue = function(value)
{
	var radioBtn = this.getRadioBtnByValue(value);
	if(radioBtn) this.setSelectBtn(radioBtn);
};

ARadioGroup.prototype.setSelectBtn = function(radioBtn)
{
	if(this.selectedBtn===radioBtn) return;
	
	if(this.selectedBtn) this.selectedBtn.setSelect(false);
	
	this.selectedBtn = radioBtn;
	if(radioBtn) this.selectedBtn.setSelect(true);
};

ARadioGroup.prototype.getSelectBtn = function()
{
	return this.selectedBtn;	
};

ARadioGroup.prototype.getSelectIndex = function()
{
	for(var i=0; i<this.radioBtns.length; i++)
		if(this.radioBtns[i]===this.selectedBtn) return i;
	
	return -1;
};

ARadioGroup.prototype.getSelectValue = function()
{
	return this.selectedBtn?this.selectedBtn.getValue():null;
};

ARadioGroup.prototype.getRadioBtns = function()
{
	return this.radioBtns;
};

ARadioGroup.prototype.getRadioBtnById = function(id)
{
	for(var i=0; i<this.radioBtns.length; i++)
	{
		if(this.radioBtns[i].getComponentId()==id) return this.radioBtns[i];
	}
	
	return null;
};

ARadioGroup.prototype.getRadioBtnByValue = function(value)
{
	for(var i=0; i<this.radioBtns.length; i++)
	{
		if(this.radioBtns[i].getValue()==value) return this.radioBtns[i];
	}
	
	return null;
};

ARadioGroup.prototype.setData = function(data)
{
	this.clearAll();
	this.selectBtnByValue(data);
};

ARadioGroup.prototype.getData = function()
{
	var selBtn = this.getSelectBtn();
	if(selBtn) return selBtn.getData();
};

ARadioGroup.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length==0) return;
	
	var selBtn = this.getSelectBtn();
	if(selBtn) dataArr[0][keyArr[0]] = selBtn.getValue();
};

ARadioGroup.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	this.clearAll();
	
	this.selectBtnByValue(dataArr[0][keyArr[0]]);
};

// 매핑가능한 개수를 리턴한다.
ARadioGroup.prototype.getMappingCount = function()
{
	return 1;
};

