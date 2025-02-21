(async function() {

afc.import("Framework/afc/component/AButton.js")
await afc.import("Framework/afc/component/ADialog.js")

/**
Constructor
Do not call Function in Constructor.
*/
AMessageBox = class AMessageBox extends ADialog
{
	constructor(containerId)
	{
		super(containerId)
	
		this.message = '';
		this.type = 0;
	}

	//-1 이면 아무 버튼도 생기지 않는다.
    openBox(parent, title, message, type, callback)
    {
        this.message = message;
        
        if(type) this.type = type;
        
        this.setResultCallback(callback);

        return super.openDialog('Framework/afc/layout/messagebox-view.html', parent, title)
        
        //ADialog.prototype.open.call(this, 'Framework/afc/layout/messagebox-view.html', parent);
    }

	

}

//window.AMessageBox = AMessageBox


AMessageBox.EMPTY = -1;
AMessageBox.OK = 0;
AMessageBox.OK_CANCEL = 1;
AMessageBox.YES_NO = 2;
AMessageBox.YES_NO_CANCEL = 3;

//옵션을 변경한다던가 타이틀을 만드는 등의 태그 생성 작업
AMessageBox.prototype.init = function(context)
{
	//not overwrite 이 true 이기때문에 
	//부모의 옵션보다 우선 하려면 init 위에 두어야 한다.
	this.setOption(
	{
		isResizable: false
		
	}, true);
	//----------------------------------------------

	ADialog.prototype.init.call(this, context);

};

AMessageBox.prototype.onCreate = function()
{
	ADialog.prototype.onCreate.call(this);
	
	var lbl = this.view.findCompById('MSG_LABEL');
	lbl.setHtml(this.message);
	lbl.$ele.css('word-break', 'break-all');
	
	this.btnLayout = this.view.findCompById('BTN_LAYOUT');
	
	this.setTitleText('Message');
	
	this._addTypeButton();
};

AMessageBox.prototype.setMessage = function(msg)
{
	this.message = msg;

	var lbl = this.view.findCompById('MSG_LABEL');
	lbl.setHtml(this.message);
};

AMessageBox.prototype.setWidth = function(w)
{
	ADialog.prototype.setWidth.call(this, w);
	
	this.view.setWidth(w-20);
};

AMessageBox.prototype._addTypeButton = function()
{
	switch(this.type)
	{
		case AMessageBox.OK:
			this._makeButton('OK', 0);
		break;
		
		case AMessageBox.OK_CANCEL:
			this._makeButton('OK', 0);
			this._makeButton('Cancel', 1);
		break;
		
		case AMessageBox.YES_NO:
			this._makeButton('Yes', 0);
			this._makeButton('No', 1);
		break;
		
		case AMessageBox.YES_NO_CANCEL:
			this._makeButton('Yes', 0);
			this._makeButton('No', 1);
			this._makeButton('Cancel', 2);
		break;
	}
	
	this.view.updatePosition();
};

AMessageBox.prototype.addCustomButton = function(text, value)
{
	const btn = this._makeButton(text, value);
	
	this.view.updatePosition();

	return btn
};

AMessageBox.prototype._makeButton = function(text, value)
{
	var btn = new AButton();
	btn.init();
	btn.setText(text);
	btn._value_ = value;
	btn.addEventListener('click', this, 'onBtnClick');
	
	btn.setDefStyle('popup_btn_normal');
	btn.setBtnStyle(AButton.DOWN, 'popup_btn_touch');
	
	btn.$ele.css({ width:'auto', height:'25px', 'margin-right':'5px', 'min-width':'50px' });
	btn.defaultBtnState();
	
	this.view.addComponent(btn);
	this.btnLayout.layComponent(btn);
	
	return btn;
};


AMessageBox.prototype.onBtnClick = function(comp, info)
{
	this.close(comp._value_);
};

AMessageBox.prototype.onCancel = function()
{
	switch(this.type)
	{
		case AMessageBox.OK:
			this.close(0);
		break;
		case AMessageBox.OK_CANCEL:
		case AMessageBox.YES_NO:
			this.close(1);
		break;
		case AMessageBox.YES_NO_CANCEL:
			this.close(2);
		break;
		default:
			this.close(1);
		break;
	}
	
	return false;
};

})();