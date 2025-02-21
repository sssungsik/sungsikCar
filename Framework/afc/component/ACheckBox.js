
class ACheckBox extends AComponent
{
	constructor()
	{
		super()
	
		this.defCheckClass = ACheckBox.checkClass;
		this.checkClass = ACheckBox.checkClass;
		this.isChecked = false;
		this.isSafeClick = false; 
		this.isTabable = true;

		this._checkValue = 1;
		this._uncheckValue = '';
	}

}

window.ACheckBox = ACheckBox

ACheckBox.CONTEXT = 
{
    tag:'<span data-base="ACheckBox" data-class="ACheckBox" class="ACheckBox-Style">CheckBox</span>',
    
    defStyle: 
    {
        width:'auto', height:'auto' 
    },

    events: ['click', 'change']
};

//add ukmani100
ACheckBox.NAME = "ACheckBox";
ACheckBox.checkClass = 'checkbox_check';

ACheckBox.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

	//span태그는 기본적으로 포커스가 되지않지만
	//tabindex를 지정하면 포커스가 가능해진다. 기본값인 0을 지정한다.
	if(!this.getAttr('tabindex')) this.setAttr('tabindex', 0);
	
	//this.value = this.$ele.attr('data-check-value');
	this.setCheckValue(this.getAttr('data-check-value'));
	this.setUncheckValue(this.getAttr('data-uncheck-value'));
	this.setCheck(this.getAttr('data-is-check'), true);

	this.setCheckStyle(this.getAttr('data-check-class'));
};

ACheckBox.prototype.setCheckStyle = function(checkClass)
{
	// 기존 체크 스타일 제거
	if(this.isChecked) this.removeClass(this.checkClass);
	
	this.checkClass = checkClass || this.defCheckClass;
	
	this.setCheck(this.isChecked, true);
};

ACheckBox.prototype.setCheck = function(check, noReport)
{
	this.isChecked = check;
	
	if(this.isChecked)
	{
		this.addClass(this.checkClass);
	}
	else
	{
		this.removeClass(this.checkClass);
	}
	
	if(!noReport)
	{
		this.reportEvent('change', this.isChecked);
	}
};

ACheckBox.prototype.getCheck = function()
{
	return this.isChecked;
};

ACheckBox.prototype.setText = function(text)
{
	this.$ele.text(text);
};

ACheckBox.prototype.getText = function()
{
	return this.$ele.text();
};

//deprecated, use setCheckValue, setUncheckValue
ACheckBox.prototype.setValue = function(value)
{
	this.setCheckValue(value);
};

//deprecated, use getCheckValue, getUncheckValue
ACheckBox.prototype.getValue = function()
{
	return this.getCheckValue();
};

ACheckBox.prototype.setCheckValue = function(value)
{
	this._checkValue = value==undefined?1:value;
};

ACheckBox.prototype.getCheckValue = function()
{
	return this._checkValue;
};

ACheckBox.prototype.setUncheckValue = function(value)
{
	this._uncheckValue = value==undefined?'':value;
};

ACheckBox.prototype.getUncheckValue = function()
{
	return this._uncheckValue;
};

ACheckBox.prototype.setCheckAlign = function(align)
{
	this.$ele.css({		
		'padding-left' : align == 'left' ? '20px' : '0px',
		'padding-right' :align == 'right' ? '20px' : '0px',
		'background-position' : align + ' center'
	});
	
};

ACheckBox.prototype.getCheckAlign = function()
{		
	var pos = this.element.style['background-position'];
	
	return pos.split(' ')[0];
};

ACheckBox.prototype.setData = function(data)
{
	//this.setCheck(data);
	
	var value = this.getCheckValue();
	if(value == undefined) this.setCheck(data);
	else this.setCheck(value == data);
	
};

ACheckBox.prototype.getData = function()
{
	//return this.getCheck();
	
	return this.getCheck()?this.getCheckValue():this.getUncheckValue();
	
};

ACheckBox.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length==0) return;
	
	dataArr[0][keyArr[0]] = this.getData();
};

ACheckBox.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	this.setData(dataArr[0][keyArr[0]]);
};

ACheckBox.prototype._getDataStyleObj = function()
{
	var ret = AComponent.prototype._getDataStyleObj.call(this);
		
	var val = this.getAttr('data-check-class');

	//attr value 에 null 이나 undefined 가 들어가지 않도록
	ret['data-check-class'] = val ? val : '';
	
	return ret;
};

ACheckBox.prototype._setDataStyleObj = function(styleObj)
{
	for(var p in styleObj)
	{
		if(p==afc.ATTR_STYLE) this._set_class_helper(this.$ele, null, styleObj, p);	//바로 화면에 적용
		else 
		{
			if(p=='data-check-class') this.setCheckStyle(styleObj[p]);
			
			//attr 값만 셋팅
			this.setAttr(p, styleObj[p]);
		}
	}
};
