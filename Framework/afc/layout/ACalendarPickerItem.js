

class ACalendarPickerItem extends AView
{
    constructor()
    {
        super()

        this.useCalendar = true;
        this.calPopup = null;
        
        this.DAYMODE   = 0;
        this.MONTHMODE = 1;
        
        this.mode      	= this.DAYMODE;
        this.format		= 'yyyy-MM-dd'
        this.isDelete		= false;
        
        this.fromDbxData = {from:1900, to:2099};
    // 	this.toDbxData = {from:1900, to:2099};

        this.date = 
        {
            year : "",
            month : "",
            day : ""
        };
        
        this.partnerCal		= null;
        this.fromToType	= null;
        
        //Component
        this.textfield	= null;
        this.calBtn    	= null;
        this.noBlurEvent= false;
    }
	
	
}

window.ACalendarPickerItem = ACalendarPickerItem

ACalendarPickerItem.DAYMODE	= 0;
ACalendarPickerItem.MONTHMODE	= 1;

ACalendarPickerItem.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.mode = this.getAttr('data-day-mode');
	this.format = this.getAttr('data-format');
	if(!this.format) this.format = 'yyyy-MM-dd';
	
	//시작연도와 끝연도 초기화
	var fromDate = Number(this.getAttr('data-from-year'));
	var toDate = Number(this.getAttr('data-to-year'));
	this.fromDbxData = {from: fromDate?fromDate:1900, to: toDate?toDate:2099};
				   
	this.textfield	= this.getChildren()[0];
	this.calBtn    	= this.getChildren()[1];
	this.calBtn.setBtnStyle(AButton.OVER, "Calendar_Button_Over");
	this.calBtn.setBtnStyle(AButton.DOWN, "Calendar_Button_Down");
	this.calBtn.setBtnStyle(AButton.DISABLE, "Calendar_Button_Disable");
	this.calBtn.setDefStyle("Calendar_Button_Down");
	this.calBtn.changeBtnState(1);

    //날짜 세팅
	this.doOpenBorderCss(false);
    this.initDate();

	//탭이벤트 관련 세팅
	this.textfield.removeAttr('tabindex');
	this.calBtn.setAttr('tabindex', '-1');
};

ACalendarPickerItem.prototype.initDate = function()
{
	var tempDate = new Date();
	this.date.year = tempDate.getFullYear();
	this.date.month = tempDate.getMonth()+1;
	this.date.day = tempDate.getDate();

    this.setEditText(this.date);
};


ACalendarPickerItem.prototype.setMode = function(md)
{
	this.mode = md;
};

ACalendarPickerItem.prototype.setFormat = function(fm)
{
	this.format = fm;
};


ACalendarPickerItem.prototype.setToday = function()
{
    var tempDate = new Date();
    
    this.date = 
    {
        year : tempDate.getFullYear(),
        month : tempDate.getMonth()+1,
        day: tempDate.getDate()
    };
    
    this.setEditText(this.date);
};


ACalendarPickerItem.prototype.onChange = function(comp, info)
{
	var text = comp.getText();
	text = text.replace(/[^0-9]/g, '');
	
	if(this.mode==1) text = text.substr(0,6) + this.date.day.zf(2);

	if(this.format.match(/yyyy/g))
	{
		if(text.length >= 8)
		{
			this.noBlurEvent = true;
			this.setEditText(text);
			this.owner.aevent.prevInsideFocus = true;
			this.owner.$ele.focus();
		}
	}
	else if(this.format.match(/yy/g))
	{
		if(text.length >= 6)
		{
			this.noBlurEvent = true;
			this.setEditText(text);
			this.owner.aevent.prevInsideFocus = true;
			this.owner.$ele.focus();
		}
	}
};

ACalendarPickerItem.prototype.onBlur = function(comp, info)
{
	if(this.noBlurEvent)
	{
		this.noBlurEvent = false;
		return;
	}
	var ffText = this.firstFocusText;
	this.firstFocusText = null;
	
	//if(ffText==this.getEditText().replace(/[^0-9]/g, '')) return;
	
	this.setEditText(this.date);
};

ACalendarPickerItem.prototype.onFocus = function(comp, info)
{
	var text = comp.getText();
	text = text.replace(/[^0-9]/g, '');
	this.firstFocusText = text;
	comp.setText(text);
    
    if(this.owner.option.isFocusSelection) comp.setSelectionRange();
};

ACalendarPickerItem.prototype.updatePosition = function(pWidth, pHeight)
{
	AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
};

ACalendarPickerItem.prototype.setWidth = function(w)
{
	AComponent.prototype.setWidth.call(this, w);	
};

ACalendarPickerItem.prototype.setUseCalendar = function(useCalendar)
{
	this.useCalendar = useCalendar;
};

ACalendarPickerItem.prototype.setReadOnly = function(isReadOnly)
{
    this.textfield.setReadOnly(isReadOnly);
};

ACalendarPickerItem.prototype.getEditText = function()
{
    return this.textfield.getText();
};

ACalendarPickerItem.prototype.setEditText = function(date, noEvent)
{
	var dateStr, yearCnt = 4;
	if(this.format.match(/yyyy/g))
	{
		yearCnt = 4;
	}
	else if (this.format.match(/yy/g))
	{
		yearCnt = 2;
	}

    if(typeof date == "object")
    {
        if(this.mode == this.DAYMODE) dateStr = this.getFormatDate(((yearCnt ==2 )?(''+date.year).slice(2, 4):date.year) + date.month.zf(2) + date.day.zf(2));
        else dateStr = this.getFormatDate(((yearCnt ==2 )?(''+date.year).slice(2, 4):date.year) + date.month.zf(2));

		this.textfield.setText(dateStr);
    }
    else
    {
		date = date.replace(/[^0-9]/g, '');
		
        if(this.mode == this.MONTHMODE)
		{
			date = (''+date).slice(0, yearCnt+2);
		}
        this.textfield.setText(this.getFormatDate(date));
    }
	
	if(!noEvent && this.owner)
	{
		this.owner.reportEvent('change', this.date);
	}
};

ACalendarPickerItem.prototype.setTextAlign = function(align)
{
    this.textfield.setTextAlign(align);
};

ACalendarPickerItem.prototype.setStyle = function(key, value)
{
    this.element.style[key] = value;
};

ACalendarPickerItem.prototype.setTextFieldStyle = function(key, value)
{
    this.textfield.element.style[key] = value;
};

ACalendarPickerItem.prototype.getTextAlign = function()
{
    return this.textfield.getTextAlign();
};

ACalendarPickerItem.prototype.onClickCal = function(comp, info)
{
	var compReadonly = comp.$ele.attr("readonly"),
		compDisabled = comp.$ele.attr("disabled");
	if(compReadonly || compDisabled) return;
	
	if(!this.fromToType) this.openPopup();
};

ACalendarPickerItem.prototype.openPopup = function()
{
	if(this.mode == this.DAYMODE) this.openCalendar();
	else this.openMonthSelector();
};

ACalendarPickerItem.prototype.doOpenBorderCss = function(bn)
{
	if(bn)
	{
		if(this.calendarPickerSelectedObj) this.$ele.css(this.calendarPickerSelectedObj);
		else this.$ele.css("border","1px solid rgb(59, 88, 132)");
	}
	else
	{
		if(this.calendarPickerObj) this.$ele.css(this.calendarPickerObj);
		else this.$ele.css("border","1px solid rgb(187, 187, 187)");
	}
};

	
ACalendarPickerItem.prototype.openCalendar = function(left, top)
{
	if(this.calPopup || !this.useCalendar || this.isDev()) return;
	
	var thisObj = this,
		pos = this.$ele.offset();
	pos.top += this.$ele.outerHeight() + 2;
	
	this.calPopup = new AWindow("ACalendarItemWin");
	this.calPopup.setData([this]);
	this.calPopup.setOption({
		isModal: true,
		isFocusLostClose: true,
		inParent: false,
		modalBgOption: 'none'});

	//var parents = this.getParent();
	//if(parents && !(parents instanceof AContainer)) parents = null;
	
	//모바일일 경우...
	if(afc.isPhone) this.calPopup.openCenter('Framework/afc/layout/ACalendarItem.html', null);
	else this.calPopup.open('Framework/afc/layout/ACalendarItem.html', null, pos.left, pos.top, 'auto', 'auto');
	
	this.doOpenBorderCss(true);
	this.calPopup.setResultCallback(function(result)
	{
		//result is date
		if(result)
		{
			thisObj.date = result;
			thisObj.setEditText(result);
		}
		thisObj.calPopup = null;
		thisObj.doOpenBorderCss(false);
	});
};


ACalendarPickerItem.prototype.openMonthSelector = function()
{
	if(!this.useCalendar || this.isDev()) return;
	var thisObj = this,
		pos = this.$ele.offset();
	pos.top += this.$ele.outerHeight() + 2;
	
	this.calPopup = new AWindow("ACalendarMonthItemWin");
	this.calPopup.setData([this]);	
	this.calPopup.setOption({
		isModal: true,
		isFocusLostClose: true,
		inParent: false,
		modalBgOption: 'none'});
		
	//var parents = this.getParent();
	//if(parents && !(parents instanceof AContainer)) parents = null;

	//모바일일 경우...
	if(afc.isPhone) this.calPopup.openCenter('Framework/afc/layout/ACalendarMonthItem.html', null);
	else this.calPopup.open('Framework/afc/layout/ACalendarMonthItem.html', null, pos.left, pos.top, 'auto', 'auto');	//, 220, 176
	this.doOpenBorderCss(true);	
	this.calPopup.setResultCallback(function(result)
	{
		//result is date
		if(result)
		{
			thisObj.date = result;
			thisObj.setEditText(result);
		}
		thisObj.calPopup = null;
		thisObj.doOpenBorderCss(false);		
	});
};

ACalendarPickerItem.prototype.onChangeFromSbx= function(comp, info)
{
    this.calPopup.date.year = comp.getSelectedItemData();
    this.initDate(); 
};

ACalendarPickerItem.prototype.calendarClose = function()
{
	if(this.calPopup) this.calPopup.close();
};


ACalendarPickerItem.prototype.getText = function()
{
};

ACalendarPickerItem.prototype.setText = function(val)
{
};

ACalendarPickerItem.prototype.changeMode = function(mode)
{
    this.mode = mode;
    this.initDate();
};

ACalendarPickerItem.prototype.setPartner = function(cal)
{
	this.partnerCal = cal;
};

ACalendarPickerItem.prototype.getPartner = function()
{
	return this.partnerCal;
};

ACalendarPickerItem.prototype.closePopup = function()
{
	this.calPopup.close();
};

ACalendarPickerItem.prototype.getMode = function()
{
	return this.mode;
};

ACalendarPickerItem.prototype.getFormatDate = function(text)
{
	if(!text) text = this.getEditText();
    if(!text || text == "") return "";
	
	var thisObj = this;
	
	var f = this.format;
	var y4 = false; //yyyy인 경우 true
	
	//Month일 경우...
	if(this.mode==1)
	{
		f = f.replace(/d/gi, "");
		lstr = f.charAt(f.length-1);
		if(lstr!="M") f = f.slice(0, -1);
	}
	else if(f!=this.format) f=this.format;
	
    return f.replace(/(yyyy|yy|MM|dd)/gi, function($1) 
    {
        switch ($1) 
        {
            case "yyyy":
			{
				y4 = true;
				var result = text.slice(0,4);
				
                var fromYear = thisObj.fromDbxData.from;
				var toYear = thisObj.fromDbxData.to;
				
                if(parseInt(result) < fromYear)
                    result = fromYear;
                else if(parseInt(result) > toYear)
                    result = toYear;
				
				thisObj.date.year = result;
				return result;
			}
            case "yy":
			{
				var subYear = text.substr(0, 2),
					result = text.slice(0,2);

				thisObj.date.year = subYear+result;
				return result;
			}
            case "MM": 
			{
				var result = y4?text.slice(4,6):text.slice(2,4);
				
                if(result > 12)
                    result = '12';
                else if(result <= 0)
                    result = '01';
				
				thisObj.date.month = result;
				
				return result.zf(2);
			}
            case "dd":
			{
				if(thisObj.mode == thisObj.MONTHMODE)
					return '';
					
				var year = thisObj.date.year;
				var month = thisObj.date.month;
				var day = thisObj.date.day;
				
				var date = (year+(year-year%4)/4-(year-year%100)/100+(year-year%400)/400+month*2+(month*5-month*5%9)/9-(month<3?year%4||year%100==0&&year%400?2:3:4))%7;
				var lastDate = date+(month*9-month*9%8)/8%2+(month==2?year%4||year%100==0&&year%400?28:29:30);
				
				var result = y4?text.slice(6,8):text.slice(4,6);
				 if(result > lastDate - date)
				 	result = lastDate - date;
				else if( result <= 0)
					result = 1;
				
				thisObj.date.day = result;
				return result.zf(2);
			}
            default: return $1;
        }
    });
};

ACalendarPickerItem.prototype.onKeyup = function(comp, info, e)
{
	if(e.which == 8 || e.which == 46)//Back Space || Delete
		this.isDelete = true;
};

ACalendarPickerItem.prototype.setDate = function(text)
{
	this.setEditText(text, true);
};

ACalendarPickerItem.prototype.getDate = function()
{
	this.date.year = parseInt(this.date.year);
	this.date.month = parseInt(this.date.month);
	this.date.day  = parseInt(this.date.day);
	
	if(this.mode==1){
		return {
			"year": this.date.year,
			"month": this.date.month
		};
	}
	else return this.date;
};

ACalendarPickerItem.prototype.getDateString = function()
{
	var d = this.getDate();
	return [
		d.year,
		(d.month>9?d.month:'0'+d.month),
		(d.day?(d.day>9?d.day:'0'+d.day):"")
	].join('');
};

ACalendarPickerItem.prototype.getDiffDate = function(gap)
{
	var rDate;

	if(this.date) rDate = new Date(parseInt(this.date.year), parseInt(this.date.month)-1, parseInt(this.date.day));
	else rDate = new Date();

	rDate.setDate(rDate.getDate()+(gap||0));

	return {
		year: rDate.getFullYear(),
		month: rDate.getMonth()+1,
		day: rDate.getDate()
	};
};

// 컴포넌트 내부에 드랍 가능여부 리턴
ACalendarPickerItem.prototype.getDroppable = function()
{
	return false;
};


