

class ACalendarMonthItem extends AView
{
    constructor()
    {
        super()

        this.yearData = {from:1900, to:2099};
        
        this.date = 
        {
            year : "",
            month : "",
            day : ""
        };
        
        this.yearBtn	= null;
    }
}

window.ACalendarMonthItem = ACalendarMonthItem


ACalendarMonthItem.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.opCal = this.getContainer().getData()[0];

	this.calGrid = this.findCompById("ListGrid");
	var monthList = $(this.calGrid.tBody.find("td"));
	for(var i=0; i<monthList.length; i++) $(monthList[i]).attr("month", i+1);
	
	this.yearBtn = this.findCompById("YearBtn");
	
	this.getContainer().$ele.css('visibility','hidden');

	var thisObj = this;
	this.getContainer().close = function(result)
	{
		if(this.isClosed) return;
		var cntrWin = this;
		this.isClosed = true;

		if(theApp && theApp.doWinClose)
			theApp.doWinClose(cntrWin, result);

		AWindow.prototype.close.call(cntrWin, result);		
	};
};


ACalendarMonthItem.prototype.onInitDone = function()
{
	AView.prototype.onInitDone.call(this);
	
	if(!this.yearData.from) this.yearData.from = 1900;
	if(!this.yearData.to) this.yearData.to = 2099;
    
	/*
	var thisObj = this;
	setTimeout(function(){
		thisObj.getContainer().setWindowOption({
			isFocusLostClose: true
		});
	},500);
	*/
	
	//스타일초기화
	this.doCalendarStyleInit1();

	//그리드를 그린다.
	this.setYearData(this.opCal.fromDbxData);
	this.setDate(this.opCal.date);
	
	this.doCalendarStyleInit2();

	//캘린더 가로길이 재설정한다.
	this.setWidth(this.CalendarView.$ele.outerWidth());
	this.getContainer().setWidth(this.$ele.outerWidth());

	//캘린더 세로길이를 재설정한다.
	this.setHeight(this.CalendarView.$ele.outerHeight());
	this.getContainer().setHeight(this.$ele.outerHeight()+2);

	//if(afc.isMobile) this.getContainer().moveToCenter();
	
	this.getContainer().$ele.css('visibility','visible');
};


ACalendarMonthItem.prototype.doCalendarStyleInit1 = function()
{
	//HeadView 높이 재설정
	$(".HeadView-Style").css({
		"height": $(".YearBtn-Style").outerHeight() + "px"
	});

	//CalendarView Style
	if(this.opCal.calendarViewStyleObj) this.CalendarView.$ele.css(this.opCal.calendarViewStyleObj);

	//HeadView Style
	if(this.opCal.headViewStyleObj) this.HeadView.$ele.css(this.opCal.headViewStyleObj);

	//YearMonthBtn Style
	if(this.opCal.yearMonthBtnStyleObj) this.YearBtn.$ele.css(this.opCal.yearMonthBtnStyleObj);

	//LeftLeftArrowBtn Style
	if(this.opCal.lleftArrowBtnStyle) this.HeadView.$ele.find('.Left_Arrow2').css(this.opCal.lleftArrowBtnStyle);

	//LeftArrowBtn Style
	if(this.opCal.leftArrowBtnStyle) this.HeadView.$ele.find('.Left_Arrow').css(this.opCal.leftArrowBtnStyle);

	//RightArrowBtn Style
	if(this.opCal.rightArrowBtnStyle) this.HeadView.$ele.find('.Right_Arrow').css(this.opCal.rightArrowBtnStyle);

	//RightRightArrowBtn Style
	if(this.opCal.rrightArrowBtnStyle) this.HeadView.$ele.find('.Right_Arrow2').css(this.opCal.rrightArrowBtnStyle);

	//ListGrid Style
	if(this.opCal.listGridStyleObj) this.ListGrid.$ele.css(this.opCal.listGridStyleObj);
};


ACalendarMonthItem.prototype.doCalendarStyleInit2 = function()
{
	//grid td Style
	if(this.opCal.listGridTdStyleObj) this.ListGrid.$ele.find('td').css(this.opCal.listGridTdStyleObj);
	if(this.opCal.listGridColStyleObj) this.ListGrid.$ele.find('col').css(this.opCal.listGridColStyleObj);
	if(this.opCal.listGridTdSelectedStyleObj) this.ListGrid.$ele.find('td.agrid_select').css(this.opCal.listGridTdSelectedStyleObj);
};


ACalendarMonthItem.prototype.onClickMoveBtn = function(comp, info)
{
    switch (comp.getComponentId())
    {
        case 'PrevYearBtn':
			this.prevYear();
            break;
        case 'NextYearBtn':
			this.nextYear();
            break;
    }
};

ACalendarMonthItem.prototype.prevYear = function()
{
	this.date.year-=1;
	this.setYearLabel();
};

ACalendarMonthItem.prototype.nextYear = function()
{
	this.date.year+=1;
	this.setYearLabel();
};


ACalendarMonthItem.prototype.onChangeSelectBox = function(comp, info)
{
    this.date.year = info;
};

ACalendarMonthItem.prototype.setYearData = function(yearData)
{
	this.yearData.from = yearData.from;
	this.yearData.to = yearData.to;
};

ACalendarMonthItem.prototype.setDate = function(date)
{
	var monthList = $(this.calGrid.tBody.find("td"));
	
	this.date.year = date.year*1;
	this.date.month = date.month*1;
	this.date.day = date.day*1;
	
	$(monthList[(this.date.month-1)]).addClass("agrid_select"); //선택버튼 스타일처리
	
	this.setYearLabel();
};

ACalendarMonthItem.prototype.setYearLabel = function()
{
	this.yearBtn.setText(this.date.year.toString());
};


ACalendarMonthItem.prototype.onSelectGrid = function(comp, info, e)
{
	e.preventDefault();
	this.date.month = $(info).attr("month");
	this.getContainer().close(this.date);
};


ACalendarMonthItem.prototype.setSelectCalEvent = function(listener, funcName)
{
	this.calGrid.removeEventListener('select', this);
    this.calGrid.addEventListener('select', listener, funcName);
};