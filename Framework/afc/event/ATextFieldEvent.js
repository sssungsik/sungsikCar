
/**
 * @author asoocool
 */

class ATextFieldEvent extends AEvent
{
	constructor(acomp)
	{
		super(acomp);
		
		this.chkInterval = null;
		this.oldText = '';
		this.isChangeBind = false;
	}
}
window.ATextFieldEvent = ATextFieldEvent;


ATextFieldEvent.prototype.defaultAction = function()
{
	var atextfield = this.acomp;
	
	//상위로 이벤트를 전달할 필요가 없다.
    this.acomp.bindEvent(AEvent.ACTION_DOWN, function(e)
    {
    	e.stopPropagation();
    });
	
	//PC 인 경우의 기본 액션
	if(afc.isPC)
	{
		this._keydown();
		this._keyup();
	}
	
	this._focus();
	this._blur();
	
	if(atextfield.getAttr('data-auto-tab')) {
		this._change();
	}
};

ATextFieldEvent.prototype.paste = function()
{
	this._paste();
};



//---------------------------------------------------------------------------------------------------
//	Component Event Functions
//	events: ['change', 'focus', 'blur']


ATextFieldEvent.prototype.change = function()
{
	this._change();
};


if(afc.isPC)
{ 
	//defaultAction 에서 호출했기 때문에
	ATextFieldEvent.prototype.keydown = null;
	ATextFieldEvent.prototype.keyup = null;
}





//---------------------------------------------------------------------------------------------------

ATextFieldEvent.prototype._focus = function()
{
	var thisObj = this;
	var atextfield = this.acomp;
	
	//atextfield.$ele.focus(function(e) 
	AEvent.bindEvent(atextfield.element, 'focus', function(e) 
	{
		//개발중일 때 블러처리하던 것 제거. Attribute에서 입력이 안됨.
		//Layout Unit Mode 시의 처리는 다르게 생각해봐야함. 레이아웃에서 바로 입력가능처리 부분과 같이 생각해봐야함.
// 		if(window.afc_) 
// 		{
// 			$(this).blur();
// 			return false;
// 		}

		if(atextfield.option.isFocusSelection) atextfield.setSelectionRange();
		
		AComponent.setFocusComp(atextfield);
		atextfield.changeBtnState(ATextField.FOCUS);
		
		//텍스트 수정시 포커스가 중간에 있으면 키패드로 삭제 안되는 버그 대응(안드로이드)
		/*
		//4.3 안드로이드 버그 대응
		if(afc.andVer < 4.4)
		{
			setTimeout(function(){ atextfield.setText(atextfield.getText()); }, 1);	
		}
		*/
		
		if(!afc.isPC) KeyboardManager.inputScrollToCenter(this);
		//if(PROJECT_OPTION.build.bridgeName!='none') KeyboardManager.inputScrollToCenter(this);
		
		
		//타이머로 change 이벤트 처리
		if(atextfield.isTimerChange)
		{
			if(thisObj.chkInterval) clearInterval(thisObj.chkInterval);
			
			thisObj.chkInterval = setInterval(function()
			{
				//화면이 소멸되어 더이상 ATextField 가 유효한 컴포넌트가 아닌 경우
				if(!atextfield.element)
				{
					clearInterval(thisObj.chkInterval);
					thisObj.chkInterval = null;
					return;
				}
				
				thisObj.changeProc(e);

			}, ATextField.DELAY_TIME);
		}
		
		// Mask를 적용한 경우 readonly 아닌 경우에만 마스크적용 전의 값을 세팅하기 위함
		if(!atextfield.getAttr('readonly') && atextfield.getAttr('type')!='file') atextfield.element.value = atextfield.getText();
		
		atextfield.setIme();
		//atextfield.$ele.select();
		atextfield.reportEvent('focus', null, e);
	});
};

ATextFieldEvent.prototype._blur = function()
{
	var thisObj = this;
	var atextfield = this.acomp;
	
	//atextfield.$ele.blur(function(e) 
	AEvent.bindEvent(atextfield.element, 'blur', function(e) 
	{
		if(thisObj.chkInterval) 
		{
			clearInterval(thisObj.chkInterval);
			thisObj.chkInterval = null;
		}
		
		atextfield.defaultTxfState();
		// Mask를 적용한 경우 readonly 아닌 경우에만 입력된 값을 마스크 적용하여 값을 세팅하기 위함
		if(!atextfield.getAttr('readonly') && atextfield.getAttr('type')!='file') atextfield.setText(atextfield.element.value);
		
		atextfield.reportEvent('blur', null, e);
	});
};

ATextFieldEvent.prototype._change = function()
{
	if(this.isChangeBind) return;
	else this.isChangeBind = true;

	var thisObj = this;
	
	this.acomp.$ele.on('keyup', function(e) 
	{
		thisObj.changeProc(e);
	});
	
	//this.acomp.$ele.on('change', function(e) 
	AEvent.bindEvent(this.acomp.element, 'change', function(e) 
	{
		thisObj.changeProc(e);
	});
};

ATextFieldEvent.prototype.changeProc = function(e)
{
	var atextfield = this.acomp;
	//var strText = atextfield.getText();
	var strText = atextfield.element.value;
	
	if(this.oldText != strText)
	{
		if(atextfield.element.dm) atextfield.element.dm.mask(strText);
		this.oldText = strText;
		atextfield.reportEvent('change', strText, e);
		
		if(atextfield.getAttr('data-auto-tab') && (strText.length == atextfield.getAttr('maxLength'))) {
			TabKeyController.nextFocus(atextfield, e);
		}
	}
};

ATextFieldEvent.prototype._keydown = function()
{
	var acomp = this.acomp;
	
	acomp.$ele.on('keydown', function(e) 
	{
        //개발 시점에 입력 안 되도록
        if(acomp.isDev())
        {
            e.preventDefault()
            return false
        }

		//이벤트가 더이상 상위로 전달되지 않아야할때 사용된다.
		//예외) 탭키 컨트롤러 -> rootView의 keydown 이벤트에 걸려있어서 이곳에서 이벤트 stop을 하면
		//탭키 이벤트가 발생하지 않는다. 이벤트가 발생하지 않더라도 탭이동은 되야하므로 여기서 직접 탭이동을 한다.
		if(!acomp.keyPropagation) 
		{
			e.stopPropagation();
			
			if(e.keyCode == 9)
			{
				var acont = acomp.getContainer();
				if(acont && acont.tabKey)
				{
					var nextComp = acont.tabKey.findNextTab(acomp, e.shiftKey);
					if(nextComp) 
					{
						nextComp.setFocus();
						e.preventDefault();
					}
				}
			}
		}

		acomp.reportEvent('keydown', null, e);
	});
};

ATextFieldEvent.prototype._keyup = function()
{
	var acomp = this.acomp;
	
	acomp.$ele.on('keyup', function(e) 
	{
		//이벤트가 더이상 상위로 전달되지 않아야할때 사용된다.
		if(!acomp.keyPropagation) e.stopPropagation();
		
		acomp.reportEvent('keyup', null, e);
	});
};

ATextFieldEvent.prototype._paste = function()
{
	var acomp = this.acomp;
	
	AEvent.bindEvent(acomp.element, 'paste', function(e) 
	{
		acomp.reportEvent('paste', null, e);
	});
};
