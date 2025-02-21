(async function() {



afc.import('Framework/afc/layout/ACalendarItem.js')
afc.import('Framework/afc/layout/ACalendarMonthItem.js')

await afc.import('Framework/afc/layout/ACalendarPickerItem.js')


ACalendarPicker = class ACalendarPicker extends AView
{
    constructor()
    {
        super()

        this.childComp		= null;
        this.partnerCal		= null;
        this.isFromToMode	= false;
        
        this.isTabable = true;
    }
	
	
}


ACalendarPicker.CONTEXT = 
{
    
    tag: '<div data-base="ACalendarPicker" data-class="ACalendarPicker" class="ACalendarPicker-Style"></div>',
    
    defStyle: { width:'120px', height:'26px' },
    
    events: ['change']
};


ACalendarPicker.prototype.createElement = function(context)
{
	AView.prototype.createElement.call(this, context);
	
	
	//개발 시점에 Drag & Drop 을 통해 최초 컴포넌트를 추가하는 경우, layout 을 동적으로 로드하여 태그를 추가한다.
	//이후에 초기화 하는 경우는 이미 하위 태그가 파일에 저장되어져 있다.
	if(this.$ele.children().length==0) 
	{
		var item = $('<div style="width:100%; height:100%"></div>')[0];
		afc.loadHtmlSync(item, 'Framework/afc/layout/ACalendarPickerItem.html');
		this.$ele.append(item);
	}
};

ACalendarPicker.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.childComp = this.element.children[0].children[0].acomp;

    this.setOption(
	{
		isFocusSelection : this.getAttr('data-option-focus-selection'),
	}, true);
};

ACalendarPicker.prototype.getDate = function()
{
	return this.childComp.getDate();
};

ACalendarPicker.prototype.getDateString = function()
{
	return this.childComp.getDateString();
};

ACalendarPicker.prototype.getDiffDate = function(gap)
{
	return this.childComp.getDiffDate(gap);
};

ACalendarPicker.prototype.setDate = function(date)
{
	this.childComp.setDate(date);
};

//defailt Calendar Icon - Left
ACalendarPicker.prototype.setCalendarIconLeft = function()
{
	this.childComp.calBtn.$ele.css({
		"left": "0px",
		"right": "unset"
	});
	this.childComp.textfield.$ele.css({
		"left": "30px"
	});
};

//defailt Calendar Icon - Right
ACalendarPicker.prototype.setCalendarIconRight = function()
{
	this.childComp.calBtn.$ele.css({
		"left": "unset",
		"right": "0px"
	});
	this.childComp.textfield.$ele.css({
		"left": "0px",
		"padding-left": "10px"
	});
};

ACalendarPicker.prototype.setCalendarIconImage = function(img)
{
	this.childComp.calBtn.$ele.css({
		"background-image": "url("+img+")"
	});
};
ACalendarPicker.prototype.setCalendarPickerStyle = function(obj)
{
	this.childComp.calendarPickerObj = obj;
	this.childComp.$ele.css(obj);
};
ACalendarPicker.prototype.setCalendarPickerSelectedStyle = function(obj)
{
	this.childComp.calendarPickerSelectedObj = obj;
};
ACalendarPicker.prototype.setCalendarIconStyle = function(obj)
{
	this.childComp.calBtn.$ele.css(obj);
};
ACalendarPicker.prototype.setCalendarInputStyle = function(obj)
{
	this.childComp.textfield.$ele.css(obj);
};

ACalendarPicker.prototype.openPopup = function()
{
	this.childComp.openPopup();
};

ACalendarPicker.prototype.setPartner = function(type, cal)
{
	this.partnerCal	= cal;
	this.isFromToMode = true;
	
	this.childComp.fromToType = type;
	this.childComp.setPartner(cal);
};


ACalendarPicker.prototype.setReadOnly = function(isReadOnly)
{
    if(isReadOnly) this.$ele.attr('readonly', isReadOnly);
    else this.$ele.removeAttr('readonly');
	
	var childItem = this.childComp.getChildren();
	for(var i=0; i<childItem.length; i++)
	{
		if(isReadOnly) childItem[i].$ele.attr('readonly', isReadOnly);
		else childItem[i].$ele.removeAttr('readonly');
	}
};

ACalendarPicker.prototype.setDisabled = function(isDisabled)
{
    if(isDisabled) this.$ele.attr('disabled', isDisabled);
    else this.$ele.removeAttr('disabled');
	
	var childItem = this.childComp.getChildren();
	for(var i=0; i<childItem.length; i++)
	{
		if(isDisabled) childItem[i].$ele.attr('disabled', isDisabled);
		else childItem[i].$ele.removeAttr('disabled');
	}
};


ACalendarPicker.prototype.getPartner = function()
{
	return this.partnerCal;
};

ACalendarPicker.prototype.getMode = function()
{
	return this.childComp.getMode();
};

ACalendarPicker.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	var data = dataArr[0];
	if(data[keyArr[0]] == undefined) return;
	this.setDate(data[keyArr[0]]);
};

ACalendarPicker.prototype.setData = function(data)
{
	this.setDate(data);
};

ACalendarPicker.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length==0) return;
	
	var data = dataArr[0];
	data[keyArr[0]] = this.getDateString();
};

ACalendarPicker.prototype.updatePosition = function(pWidth, pHeight)
{
	AView.prototype.updatePosition.call(this, pWidth, pHeight);
	
	this.childComp.calendarClose();
};

// 매핑가능한 개수를 리턴한다.
ACalendarPicker.prototype.getMappingCount = function()
{
	return 1;
};

// 컴포넌트 내부에 드랍 가능여부 리턴
ACalendarPicker.prototype.getDroppable = function()
{
	return false;
};


/************************************************************************/

//CalendarView Style
ACalendarPicker.prototype.setCalendarViewStyle = function(obj)
{
	this.childComp.calendarViewStyleObj = obj;
};

//HeadView Style
ACalendarPicker.prototype.setHeadViewStyle = function(obj)
{
	this.childComp.headViewStyleObj = obj;
};


//YearMonthBtn Style
ACalendarPicker.prototype.setYearMonthBtnStyle = function(obj)
{
	this.childComp.yearMonthBtnStyleObj = obj;
};

//LeftLeftArrowBtn Style
ACalendarPicker.prototype.setLLeftArrowBtnStyle = function(obj)
{
	this.childComp.lleftArrowBtnStyle = obj;
};

//LeftArrowBtn Style
ACalendarPicker.prototype.setLeftArrowBtnStyle = function(obj)
{
	this.childComp.leftArrowBtnStyle = obj;
};

//RightRightArrowBtn Style
ACalendarPicker.prototype.setRRightArrowBtnStyle = function(obj)
{
	this.childComp.rrightArrowBtnStyle = obj;
};

//RightArrowBtn Style
ACalendarPicker.prototype.setRightArrowBtnStyle = function(obj)
{
	this.childComp.rightArrowBtnStyle = obj;
};

//HeadGrid Style
ACalendarPicker.prototype.setHeadGridStyle = function(obj)
{
	this.childComp.headGridStyleObj = obj;
};

//ListGrid Style
ACalendarPicker.prototype.setListGridStyle = function(obj)
{
	this.childComp.listGridStyleObj = obj;
};

//HeadGrid Td Style
ACalendarPicker.prototype.setHeadGridTdStyle = function(obj)
{
	this.childComp.headGridTdStyleObj = obj;
};

//HeadGrid Td(firstChild - Sunday) Style
ACalendarPicker.prototype.setHeadGridTdFirstStyle = function(obj)
{
	this.childComp.headGridTdFirstStyleObj = obj;
};

//HeadGrid Td(lastChild - Saturday) Style
ACalendarPicker.prototype.setHeadGridTdLastStyle = function(obj)
{
	this.childComp.headGridTdLastStyleObj = obj;
};

//ListGrid Td Style
ACalendarPicker.prototype.setListGridTdStyle = function(obj)
{
	this.childComp.listGridTdStyleObj = obj;
	this.childComp.listGridColStyleObj = obj;	
};

//ListGrid Td(firstChild - Sunday) Style
ACalendarPicker.prototype.setListGridTdFirstStyle = function(obj)
{
	this.childComp.listGridTdFirstStyleObj = obj;
};

//ListGrid Td(lastChild - Saturday) Style
ACalendarPicker.prototype.setListGridTdLastStyle = function(obj)
{
	this.childComp.listGridTdLastStyleObj = obj;
};

//ListGrid Td selected Style
ACalendarPicker.prototype.setListGridTdSelectedStyle = function(obj)
{
	this.childComp.listGridTdSelectedStyleObj = obj;
};
/************************************************************************/

//window.ACalendarPicker = ACalendarPicker;

})();