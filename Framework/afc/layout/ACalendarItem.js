

class ACalendarItem extends AView
{
    constructor()
    {
        super()

        this.holiday = [[1],[8,9,10],[31],[1],[5],[],[],[],[],[],[],[25]];
        this.topView = null;
        this.yearData = {from:1900, to:2099};
        
        this.date = 
        {
            year : "",
            month : "",
            day : ""
        };
        
        //Component
        this.calGrid = null;
        this.dateBtn = null;
    }
	

}

window.ACalendarItem = ACalendarItem

ACalendarItem.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	this.opCal = this.getContainer().getData()[0];
	
	this.calGrid = this.findCompById("ListGrid");
	this.calGrid.isCheckScrl = false;
	this.dateBtn = this.findCompById("MonthBtn");
	
	this.getContainer().$ele.css('visibility','hidden');
	
	//asoocool
	this.setStyle('font-size', this.opCal.textfield.getStyle('font-size'));
	
	
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


ACalendarItem.prototype.onInitDone = function()
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
	
	//스타일초기화1
	this.doCalendarStyleInit1();
	
	//그리드를 그린다.
	this.setYearData(this.opCal.fromDbxData);
	this.setDate(this.opCal.date);

	//스타일초기화2
	this.doCalendarStyleInit2();

	//캘린더 가로길이 재설정한다.
	this.setWidth(this.CalendarView.$ele.outerWidth());
	this.getContainer().setWidth(this.$ele.outerWidth());

	//캘린더 세로길이를 재설정한다.
	this.setHeight(this.CalendarView.$ele.outerHeight());
	this.getContainer().setHeight(this.$ele.outerHeight()+2);

	//가운데 정렬
	//if(afc.isMobile) this.getContainer().moveToCenter();
	
	this.getContainer().$ele.css('visibility','visible');
};

ACalendarItem.prototype.doCalendarStyleInit1 = function()
{
	//HeadView 높이 재설정
	$(".HeadView-Style").css({
		"height": $(".MonthBtn-Style").outerHeight() + "px"
	});

	//CalendarView Style
	if(this.opCal.calendarViewStyleObj) this.CalendarView.$ele.css(this.opCal.calendarViewStyleObj);

	//HeadView Style
	if(this.opCal.headViewStyleObj) this.HeadView.$ele.css(this.opCal.headViewStyleObj);

	//YearMonthBtn Style
	if(this.opCal.yearMonthBtnStyleObj) this.MonthBtn.$ele.css(this.opCal.yearMonthBtnStyleObj);

	//LeftLeftArrowBtn Style
	if(this.opCal.lleftArrowBtnStyle) this.HeadView.$ele.find('.Left_Arrow2').css(this.opCal.lleftArrowBtnStyle);

	//LeftArrowBtn Style
	if(this.opCal.leftArrowBtnStyle) this.HeadView.$ele.find('.Left_Arrow').css(this.opCal.leftArrowBtnStyle);

	//RightArrowBtn Style
	if(this.opCal.rightArrowBtnStyle) this.HeadView.$ele.find('.Right_Arrow').css(this.opCal.rightArrowBtnStyle);

	//RightRightArrowBtn Style
	if(this.opCal.rrightArrowBtnStyle) this.HeadView.$ele.find('.Right_Arrow2').css(this.opCal.rrightArrowBtnStyle);

	//HeadGrid Style
	if(this.opCal.headGridStyleObj) this.HeadGrid.$ele.css(this.opCal.headGridStyleObj);

	//ListGrid Style
	if(this.opCal.listGridStyleObj) this.ListGrid.$ele.css(this.opCal.listGridStyleObj);

	//headGrid td Style
	if(this.opCal.headGridTdStyleObj) this.HeadGrid.$ele.find('td').css(this.opCal.headGridTdStyleObj);
	
	//headGrid td FirstChild-Sunday Style
	if(this.opCal.headGridTdFirstStyleObj) this.HeadGrid.$ele.find('td:first-child').css(this.opCal.headGridTdFirstStyleObj);

	//headGrid td LastChild-Saturday Style
	if(this.opCal.headGridTdLastStyleObj) this.HeadGrid.$ele.find('td:last-child').css(this.opCal.headGridTdLastStyleObj);
};
ACalendarItem.prototype.doCalendarStyleInit2 = function()
{
	//grid td Style
	if(this.opCal.listGridTdStyleObj) this.ListGrid.$ele.find('td').css(this.opCal.listGridTdStyleObj);
	if(this.opCal.listGridColStyleObj) this.ListGrid.$ele.find('col').css(this.opCal.listGridColStyleObj);
	
	//listGrid td FirstChild-Sunday Style
	if(this.opCal.listGridTdFirstStyleObj) this.ListGrid.$ele.find('td:first-child').css(this.opCal.listGridTdFirstStyleObj);

	//listGrid td LastChild-Saturday Style
	if(this.opCal.listGridTdLastStyleObj) this.ListGrid.$ele.find('td:last-child').css(this.opCal.listGridTdLastStyleObj);
	
	if(this.opCal.listGridTdSelectedStyleObj) this.ListGrid.$ele.find('td.agrid_select').css(this.opCal.listGridTdSelectedStyleObj);
};


ACalendarItem.prototype.doReloadPosition = function()
{
	if(!afc.isPhone)
	{
		var opCalPos = this.opCal.$ele.offset(),
			opCalWidth = this.opCal.$ele.outerWidth(),
			winWidth = $(window).width(),
			w = this.CalendarView.$ele.outerWidth(),
			h = this.CalendarView.$ele.outerHeight(),
			wPos = this.getContainer().$ele.offset();

		//좌표 재정의
		if(wPos.top < opCalPos.top)
		{
			wPos.top += ((opCalPos.top) - (wPos.top+h));
		}
		//팝업이 윈도우 높이를 넘어서 표현되는 경우 캘린더피커 위로 표시한다.
        else if(wPos.top + h > $(window).height())
        {
            wPos.top = opCalPos.top - h;
        }
		if((wPos.left+w) > (winWidth+10))
		{
			if(w>opCalWidth) wPos.left -= (w-opCalWidth);
		}

		this.getContainer().$ele.offset(wPos);
	}
	else this.getContainer().moveToCenter();
};


ACalendarItem.prototype.setYearData = function(yearData)
{
	this.yearData.from = yearData.from;
	this.yearData.to = yearData.to;
};

ACalendarItem.prototype.setDate = function(date)
{
	this.date.year = date.year;
	this.date.month = date.month;
	this.date.day = date.day;
	
	this.makeCalendar(date.year, date.month, date.day);
};
	
ACalendarItem.prototype.onSelectYearSbx = function(comp, info)
{
    this.makeCalendar(info, this.date.month);
};

ACalendarItem.prototype.onSelectMonthSbx = function(comp, info)
{
    this.makeCalendar(this.date.year, info);
};

ACalendarItem.prototype.onClickMoveBtn = function(comp, info)
{
    switch (comp.getComponentId())
    {
        case 'PrevYearBtn':
			this.prevYear();
            break;
        case 'PrevMonthBtn':
			this.prevMonth();
            break;
        case 'NextMonthBtn':
			this.nextMonth();
            break;
        case 'NextYearBtn':
			this.nextYear();
            break;
    }
};

ACalendarItem.prototype.makeCalendar = function(year, month, day)
{
    this.makeCalendarGrid(year, month, day);
	
	this.doCalendarStyleInit2();
	
	//캘린더 세로길이를 재설정한다.
	this.setHeight(this.CalendarView.$ele.outerHeight());
	this.getContainer().setHeight(this.$ele.outerHeight()+2);
	
	var m = parseInt(this.date.month.toString());
	this.dateBtn.setText([this.date.year.toString(), ((m<10)?'0'+m:m)].join('.'));
	
	this.doReloadPosition();	
};

ACalendarItem.prototype.makeCalendarGrid = function(year, month, day)
{   
    var tempDate = new Date();
	year = Number ( year );
	month = Number ( month );
	
    if(!isNaN(year) && !isNaN(month))
    {
        if (month < 1)
        {
            year -= 1;
            month = 12;
        }
        else if(month > 12)
        {
            month = 1;
            year += 1;
        }
    }
    else
    {
        month = tempDate.getMonth()+1; //January is 0!
        year = tempDate.getFullYear();
    }
    
    if(!day)
    {
        if(this.date.day)
        {
            day = this.date.day;
        }
        else
        {
            day = tempDate.getDate();
        }
    }

	var recent = {}, recentToday = -1;
    recent.year = tempDate.getFullYear();
    recent.month = tempDate.getMonth()+1;
    recent.day = tempDate.getDate();
	
    this.date.year = year;
    this.date.month = month;
    this.date.day = day;
    
    var holidayList = this.holiday[month-1];
    var holidayIdx = 0;
    var holiday = new Array();
    var today = -1;
        
    this.calGrid.removeAll();
    var date = (year+(year-year%4)/4-(year-year%100)/100+(year-year%400)/400+month*2+(month*5-month*5%9)/9-(month<3?year%4||year%100==0&&year%400?2:3:4))%7;
    var lastDate = date+(month*9-month*9%8)/8%2+(month==2?year%4||year%100==0&&year%400?28:29:30);
    
    var preMonth = (month-1)<=0?12:month-1;
    var preYear = preMonth==12?year-1:year;
    var preDate = (preYear+(preYear-preYear%4)/4-(preYear-preYear%100)/100+(preYear-preYear%400)/400+preMonth*2+(preMonth*5-preMonth*5%9)/9-(preMonth<3?preYear%4||preYear%100==0&&preYear%400?2:3:4))%7;
    var lastPreDate = preDate+(preMonth*9-preMonth*9%8)/8%2+(preMonth==2?preYear%4||preYear%100==0&&preYear%400?28:29:30);
    
    var nextMonth = (month+1)>12?1:month+1;
    var nextYear = nextMonth==1?year+1:year;
    var nextDate = (nextYear+(nextYear-nextYear%4)/4-(nextYear-nextYear%100)/100+(nextYear-nextYear%400)/400+nextMonth*2+(nextMonth*5-nextMonth*5%9)/9-(nextMonth<3?nextYear%4||nextYear%100==0&&nextYear%400?2:3:4))%7;
    
    var isTomonth = false;
    // if(year == tempDate.getFullYear() && month == (tempDate.getMonth()+1))
    if(year == this.date.year && month == this.date.month)
    {
        isTomonth = true;
    }
	
    var recentTomonth = false;
    if(year == recent.year && month == recent.month)
    {
        recentTomonth = true;
    }    
	
    var j=35, k=nextDate;
    if(lastPreDate <= 35)
        j=28;
    
    if(nextDate>6) k=7-nextDate;
    
    var week, cellItem;
    for (i = 0; i < 42; i++)
    {
        if (i%7==0) week = new Array();
        // if (i%7==0) week = $('<tr></tr>');
                
        //1일 전에 이전달 뒷부분 삽입
        if (i < date)
        {
			week.push('<span>&nbsp;');
            //week.push('<span class="preDate" style="color:#afafaf;">' + (1+j-preDate));
            // week.push('<td class="preDate SD25" style="">' + (1+j-preDate));
            j++;
        }
        //마지막날 이 후에 다음달 앞부분 삽입
        else if(i >= lastDate)
        {
			if(week.length>0) week.push('<span>&nbsp;');
            //week.push('<span class="nextDate" style="color:#afafaf;">' + (1+k-nextDate));
            k++;
        }
        else
        {
            week.push('<span>' + (1+i-date));
        }
            
        if(holidayList[holidayIdx] == (1+i-date))
        {
            holiday.push(i%7);
            holidayIdx++;
        }
        
        if(isTomonth && (this.date.day == (1+i-date))) today = i%7;
        if(recentTomonth && (recent.day == (1+i-date))) recentToday = i%7;        

        if(i%7==6/* && (!$(week[0]).hasClass('nextDate') || !$(week[6]).hasClass('nextDate'))*/)
        {
			if(week.length==0) continue;
			
            this.calGrid.addRow(week);
            
            if($(week[0]).hasClass('preDate'))
            {
                for(var l=0; 7>l; l++)
                {
                    if($(week[l]).hasClass('preDate'))
                    {
                        //this.calendarGrid.cellAddClass(i%6, l, 'BG_M10');
                    }
                }
            }
            else if($(week[6]).hasClass('nextDate'))
            {
                for(var l=0; 7>l; l++)
                {
                    if($(week[l]).hasClass('nextDate'))
                    {
                        //this.calendarGrid.cellAddClass(i%6, l, 'BG_M10');
                    }
                }
            }
            
            if(holiday.length > 0)
            {
                for(var l in holiday)
                {
                    //this.calendarGrid.cellAddClass(i%6, holiday[l], 'H');
                }
                holiday = new Array();
            }

            if(recentTomonth && (recentToday > -1))
            {
                //당일선택
				cellItem = this.calGrid.getCell(i%6, recentToday);
				$(cellItem).addClass("agrid_recent");
                recentTomonth = false;
            }
			
            if(isTomonth && (today > -1))
            {
                //오늘찾기
				var $cellItem = $(this.calGrid.getCell(i%6, today));
				
				$cellItem.removeClass("agrid_recent");
                this.calGrid.selectCell($cellItem);
                // this.cellAddClass(i%6, today, 'agrid_select');
                isTomonth = false;
            }
        }
        
        /*
        var day = this.year + '/' + ((this.month<10)?'0'+this.month:this.month) + '/' + (1+i-date);
        if(this.scheduleObj[day])
            this.calendarListView.addItem('ScheduleListItem.lay', this.scheduleObj[day]);
        */
    }
};

ACalendarItem.prototype.prevYear = function()
{
    this.makeCalendar(this.date.year-1, this.date.month);
};

ACalendarItem.prototype.prevMonth= function()
{
    this.makeCalendar(this.date.year, this.date.month-1);
};

ACalendarItem.prototype.nextMonth = function()
{
    this.makeCalendar(this.date.year, this.date.month+1);
};

ACalendarItem.prototype.nextYear = function()
{
    this.makeCalendar(this.date.year+1, this.date.month);
};

ACalendarItem.prototype.onSelectGrid = function(comp, info, e)
{
    e.preventDefault();

	if(comp.rowIndexOfCell(info) == -1) return;
	if(!$.trim(info.text()))
	{
		comp.deselectCell(info);
		return;
	}
	
	this.date.day = info.text();
	this.getContainer().close(this.date);
};

ACalendarItem.prototype.getDate = function(comp, info)
{
	return this.date;
};

ACalendarItem.prototype.setSelectCalEvent = function(listener, funcName)
{
	this.calGrid.removeEventListener('select', this);
    this.calGrid.addEventListener('select', listener, funcName);
};