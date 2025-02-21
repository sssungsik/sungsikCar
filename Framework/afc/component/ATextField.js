
/**
 * @author asoocool
 */

class ATextField extends AComponent
{
	constructor()
	{
		super()
	
		this.txfStyles = ['', ''];
		this.isTimerChange = false;
		//탭키컨트롤러 방식 변경으로 주식처리
		//this.keyPropagation = false;
		this.isTabable = true;
	}

	
}

window.ATextField = ATextField

ATextField.CONTEXT = 
{
    tag: '<input data-base="ATextField" data-class="ATextField" type="text" value="" class="ATextField-Style"/>',
        
    defStyle: 
    {
        width:'100px', height:'22px'  
    },

    events: ['change', 'focus', 'blur', 'paste']
	
	// focusin, focusout : input 요소에 focusin 되면 부모 div에도 그 이벤트가 전달된다.
	// focus, blur : 부모 div 에 그 이벤트를 전달하지 않는다.
};

ATextField.FOCUS = 0;
ATextField.DISABLE = 1;

ATextField.STATE = ['focus', 'disable'];

ATextField.DELAY_TIME = 200;
//if(afc.andVer<4.1) ATextField.DELAY_TIME = 500;


ATextField.prototype.beforeInit = function()
{
	//AComponent init 시점 disabled 처리 순서 : element 세팅 > beforeInit 호출 > enable 처리
	//beforeInit에서 baseState를 세팅하지 않으면 disabled(enable false) 체크시 에러남
	this.saveBaseState();
	
	for(var i=0; i<ATextField.STATE.length; i++)
		this.txfStyles[i] = this.getAttr('data-style-' + ATextField.STATE[i]);
};

ATextField.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	//if(this.$ele.attr('disabled')) this.enable(false);

	//asoocool 자동완성으로 인한 버그 수정
	this.$ele.attr('autocomplete', 'off');
	
	
	this.setOption(
	{
		//isEnableKM : this.getAttr('data-enable-km', true),	//키보드 매니저 작동 여부
		isEnableKM : true,	//키보드 매니저 작동 여부
		isFocusSelection : this.getAttr('data-option-focus-selection'),
		
	}, true);
	
	//타이머 체인지가 설정된 경우 시작하자 마자 change 이벤트가 발생하는 버그 수정
	this.aevent.oldText = this.element.value;

	//this.setPatternByType();
	
	//if(!this.element.preventEvent) ATextFieldEvent.implement(this);
	
	this.setImeOnIE();
	this.enableTimerChange(this.getAttr('data-timer-change'));
};

ATextField.prototype.enableTimerChange = function(enable)
{
	this.isTimerChange = enable;
};

ATextField.prototype.setDataType = function(dataType)
{
	this.setAttr('type', dataType);
};

ATextField.prototype.getDataType = function()
{
	return this.getAttr('type');
};

ATextField.prototype.setPadOption = function(padOption)
{
	this.padOption = padOption;
};


ATextField.prototype.setPlaceholder = function(placeholder)
{
	this.setAttr('placeholder', placeholder);
};

ATextField.prototype.getPlaceholder = function()
{
	return this.getAttr('placeholder');
};

ATextField.prototype.setText = function(text)
{
	if(!this.isValid()) return;

	if(this.element.dm) text = this.element.dm.mask(text);
	
	this.element.value = text;
	this.element.setAttribute('value', text);
	
	this.aevent.oldText = text;
};

//deprecated
ATextField.prototype.setAttrValue = function(text)
{
	this.setText(text);
	
	this.setAttr('value', this.element.value);
};

ATextField.prototype.getAttrValue = function()
{
	return this.getText();
};

ATextField.prototype.getText = function()
{
	if(!this.isValid()) return '';
	
	if(this.element.dm) return this.element.dm.unmask();
	
	return this.element.value;
};

ATextField.prototype.setTextAlign = function(align)
{
	this.setStyle('textAlign', align);
};

ATextField.prototype.setReadOnly = function(isReadOnly)
{
    if(isReadOnly) this.$ele.attr('readonly', isReadOnly);
    else this.$ele.removeAttr('readonly');
};

ATextField.prototype.getTextAlign = function()
{
	return this.getStyle('textAlign');
};

ATextField.prototype.setPadding = function(padding)
{
	this.setStyle('padding', parseInt(padding, 10)+'px');
};


ATextField.prototype.getPadding = function()
{
	return this.getStyle('padding');
};


ATextField.prototype.defaultTxfState = function()
{
	if(!this.isEnable) return;

	this.clearStateClass();
	this.applyBaseState();
};

ATextField.prototype.clearStateClass = function()
{
	if(!this.isEnable) return;
	
	for(var i=0; i<ATextField.STATE.length; i++)
	{
		if(this.txfStyles[i])
			this.removeClass(this.txfStyles[i]);
	}
	
	if(this.defStyle) this.removeClass(this.defStyle);
};

ATextField.prototype.changeBtnState = function(newState)
{
	if(!this.isEnable) return;
	
	this.clearStateClass();
	
	if(this.txfStyles[newState]) 
	{
		this.addClass(this.txfStyles[newState]);
	}
	
	else 
	{
		this.applyBaseState();
		//this[ATextField.STATE[newState]+'State']();
	}
};

ATextField.prototype.enable = function(isEnable)
{
	if(isEnable) this.removeAttr('disabled');
	else this.setAttr('disabled', 'true');

	if(isEnable)
	{
		var thisObj = this;
		setTimeout(function() {
			AComponent.prototype.enable.call(thisObj, isEnable);
			thisObj.defaultTxfState();
		}, afc.DISABLE_TIME-100);
	}
	else
	{
		this.changeBtnState(ATextField.DISABLE);
		AComponent.prototype.enable.call(this, isEnable);
	}
};

ATextField.prototype.applyBaseState = function()
{
	//this.$ele.css(this.baseState);
	
	if(this.defStyle) this.addClass(this.defStyle);

	//this.element.style['background-color'] = this.baseState['background-color'];
};

ATextField.prototype.saveBaseState = function()
{
	this.defStyle = this.getAttr('data-style');
	
	/*
	this.baseState = 
	{
		'background-color': this.element.style['background-color'],
	};
	*/
};

ATextField.prototype.setData = function(data)
{
	this.setText(data);
};

ATextField.prototype.getData = function()
{
	return this.getText();
};

ATextField.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length==0) return;
	
	//생성되어져 있는 객체에 셋팅하는 구조
	var data = dataArr[0];
	data[keyArr[0]] = this.getText();
	
	/*
	//객체를 생성해 추가하는 구조
	var obj = {};
	obj[keyArr[0]] = this.getText();
	dataArr.push(obj);
	*/
};

ATextField.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	var value = dataArr[0][keyArr[0]];
	
	if(value == undefined) return;
	
	this.setText(value);
};

ATextField.prototype._getDataStyleObj = function()
{
	var ret = AComponent.prototype._getDataStyleObj.call(this);
		
	var keyArr = ['data-style-focus', 'data-style-disable'], val;
	
	for(var i=0; i<keyArr.length; i++)
	{
		val = this.getAttr(keyArr[i]);

		//attr value 에 null 이나 undefined 가 들어가지 않도록
		ret[keyArr[i]] = val ? val : '';
	}
	
	return ret;
};

// object 형식의 css class 값을 컴포넌트에 셋팅한다.
// default style 값만 셋팅한다.
ATextField.prototype._setDataStyleObj = function(styleObj)
{
	for(var p in styleObj)
	{
		if(p==afc.ATTR_STYLE) this._set_class_helper(this.$ele, null, styleObj, afc.ATTR_STYLE);	//바로 화면에 적용
		
		//attr 값만 셋팅
		else this.setAttr(p, styleObj[p]);											
	}
};

//IME IE에서 설정 css로
ATextField.prototype.setImeOnIE = function()
{
	var value = this.getAttr('ime-mode');
	if(value) this.setStyle('ime-mode', value);
};

//IME IE제외 설정
ATextField.prototype.setIme = function()
{
	if(!afc.isIE)
	{
		if(afc.isMapis)
		{
			var value = this.getAttr('ime-mode');
			if(value == 'active') SetMapsData('IME', 0);
			else if(value == 'inactive') SetMapsData('IME', 1);
		}
		//브라우저가 크롬일때 처리 -> 일단 안하기로함
	}
};

ATextField.prototype.reset = function()
{
	this.setText('');
};

ATextField.prototype.setSelectionRange = function(start, end, dir)
{
	if(this.getDataType() != 'number') this.element.setSelectionRange(start||0, end||-1, dir);
};

ATextField.prototype.setMaskValue = ATextField.prototype.setAttrValue;

ATextField.prototype.setDataMask = function(func, param, ele)
{
	AComponent.prototype.setDataMask.call(this, func, param, ele);
	
	this.aevent.change();
};
