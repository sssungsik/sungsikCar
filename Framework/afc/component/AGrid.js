              
/**
* TODO:
*	addRows 와 createRow 의 성능 개선 시도
*	1) createRow 에서 tmpl clone 을 사용하지 말고 문자열로 만들어서 
*	완성된 문자열 전체를 테이블에 셋팅해 보기
*/

class AGrid extends AComponent
{
	constructor()
	{
		super()
	
		//선택된 셀,행 집합
		this.selectedCells = [];

		// shift로 선택한 셀 목록
		this.shiftSelectedCells = [];

		//스크롤 복원값
		this.savedScrollPos = -1;
		this.isScrollVisible = false;

		//그리드 터치시 상위로 이벤트 전달 여부
		this.isStoppagation = true;

		//그리드 선택시 addClass Name
		this.selectStyleName = null;

		this.columnCount = 0;		//컬럼 개수
		this.hRowTmplHeight = 0;	//헤더 로우들의 높이 합
		this.rowTmplHeight = 0;		//바디 템플릿 로우들의 높이 합
		//---------------------------------

		//자체적인 스크롤 구현
		this.scrlManager = null;

		//그리드 리얼 관련
		this.realMap = null;
		this.realField = null;

		this.scrollComp = null;

		//text size auto shrink info
		this.shrinkInfo = null;

		//바디 상단선 높이(isHideHeader?1:0)

		this.isCheckScrl = true;
		this.lastSelectedCell = true;

		this.rotateColArr = [];

		this.sortFunc = null;

		this.oriWhiteSpace = {};	
	}

	
	
	
}

window.AGrid = AGrid


AGrid.CONTEXT = 
{
    tag: '<div data-base="AGrid" data-class="AGrid" data-fullrow-select="true" data-selectable="true" data-clear-rowtmpl="true" data-ver="3301" class="AGrid-Style" data-hide-footer="true">\
			<div class="grid-scroll-area">\
				<table class="grid-header-table" align="center">\
					<colgroup><col><col><col></colgroup>\
					<thead align="center" class="head-prop">\
						<tr height="22px"><td>col1</td><td>col2</td><td>col3</td></tr>\
					</thead>\
				</table>\
				<table class="grid-body-table" align="center">\
					<colgroup><col><col><col></colgroup>\
					<thead align="center" class="head-prop">\
						<tr height="0px"><td></td><td></td><td></td></tr>\
					</thead>\
					<tbody align="center" class="body-prop">\
						<tr height="22px"><td>1,1</td><td>1,2</td><td>1,3</td></tr>\
					</tbody>\
				</table>\
				<table class="grid-footer-table" align="center">\
					<colgroup><col><col><col></colgroup>\
					<thead align="center" class="head-prop">\
						<tr height="0px"><td></td><td></td><td></td></tr>\
					</thead>\
					<tfoot align="center" class="foot-prop">\
						<tr height="22px"><td>col1</td><td>col2</td><td>col3</td></tr>\
					</tfoot>\
				</table>\
			</div>\
		</div>' ,
    
    defStyle: 
    {
        width:'400px', height:'300px'
    },
    
    events: [ 'select', 'dblclick', 'longtab', 'scroll', 'scrolltop', 'scrollbottom', 'refresh']
};



AGrid.prototype.initVariables = function()
{
	//--------------------------------------------------
	//	관리 변수 세팅
	//--------------------------------------------------

	this.headerTable = this.$ele.find('.grid-header-table');
	this.bodyTable = this.$ele.find('.grid-body-table');
	this.footerTable = this.$ele.find('.grid-footer-table');
	this.scrollArea = this.bodyTable.parent();
	
	//낮은 버전의 그리드의 구조를 새 버전으로 변경
	if(this.version<3301)
	{
		this.scrollArea.prepend(this.headerTable);
		
		//구조 변경으로 주석
		//this.bodyTable.find('thead').remove();
		
		this.element.setAttribute('data-ver', 3301);
	}

	if(this.footerTable.length <= 0)
	{
		this.footerTable = $('<table class="grid-footer-table" align="center"><tfoot align="center" class="foot-prop"></tfoot></table>');
		this.scrollArea.append(this.footerTable);
		this.footerTable.prepend(this.headerTable.find('colgroup').clone());
		this.footerTable.find('tfoot').append(this.headerTable.find('thead').children().clone());
		this.element.setAttribute('data-hide-footer', true);
	}

	if(this.bodyTable.find('thead').length <= 0)
	{
		const clone = this.headerTable.find('thead').clone();
		this.bodyTable.find('tbody').before(clone);
	}

	//width 동기화를 위해 footer에도 hideHead를 추가한다.
	if(this.footerTable.find('thead').length <= 0)
	{
		const clone = this.headerTable.find('thead').clone();
		clone.find('tr').height(0);
		clone.find('td').text('');
		this.footerTable.find('tfoot').before(clone);
	}

	if(!this.isDev())
	{
		//그리드 보다 위에 놓은 컴포넌트를 가릴 수 있으므로 추가하면 안됨. 
		//단, body row 의 cell 에 태그를 추가할 때... relative, absolute 로 추가하면 
		//추가된 태그가 헤더를 덮을 수도 있음. 헤더의 z-index 를 높이거나 static 으로 태그를 추가해야 함.
		//this.headerTable.css('z-index', 1);	
		
		this.scrollArea.css('z-index', 0);		//스크롤 가속을 위해 필요.
	}

	this.showThead = this.headerTable.find('thead');
	this.hideThead = this.bodyTable.find('thead');
	//this.hideThead = this.showThead;
	//this.hideThead.css('visibility', 'hidden');
	this.hideFhead = this.footerTable.find('thead');

	this.hideThead.find('tr').css('height', '0px');
	this.hideThead.find('td').text('');

	//tbody 태그는 자주 쓰이므로 변수로 저장해 둔다.
	this.tBody = this.bodyTable.find('tbody');
	this.tFoot = this.footerTable.find('tfoot');
	
	

	//-------------------------------------------------
	//	반복적으로 추가할 템플릿을 복제하여 생성
	//-------------------------------------------------
	
	//헤더 row(tr) 템플릿, 복제하지 않고 원본을 사용한다.
	this.$hRowTmpl = this.showThead.children();
	//바디 row(tr) 템플릿, 삭제되므로 복제해 둔다.
	this.$rowTmpl = this.tBody.children().clone();
	//풋
	this.$fRowTmpl = this.tFoot.children();
	
	//로우 템플릿을 얻은 후 삭제한다.
	this.tBody.children().remove();
	
	//컬럼 개수
    this.columnCount = this.$hRowTmpl.eq(0).children().length;
	
	var $row, $cells, rowHeight, cellHeight;
	
	this.$tmplTds = [];
	//바디 로우 템플릿의 높이를 구해둔다.
	for(var i=0; i<this.$rowTmpl.length; i++)
	{
		$row = this.$rowTmpl.eq(i);
		
		$cells = $row.children('td');
		this.$tmplTds.push($cells);
		
		//아래와 같이 하면 td 에 높이를 설정한 경우는 오차가 생긴다. 
		//this.rowTmplHeight += parseInt($row.attr('height'), 10);
		
		//Number() 로 파싱하면 22px 가 0 으로 나옴. parseInt 사용하기
		rowHeight = parseInt($row.attr('height'));
		cellHeight = parseInt($cells.eq(0).attr('height'));
		
		rowHeight = isNaN(rowHeight) ? 0 : rowHeight;
		cellHeight = isNaN(cellHeight) ? 0 : cellHeight;
		
		if(cellHeight>rowHeight) rowHeight = cellHeight;
		
		this.rowTmplHeight += rowHeight;
	}
	
	//헤더 로우 템플릿의 높이를 구해둔다.
	for(i=0; i<this.$hRowTmpl.length; i++)
	{
		//아래와 같이 하면 td 에 높이를 설정한 경우는 오차가 생긴다. 
		//this.hRowTmplHeight += parseInt(this.$hRowTmpl.eq(i).attr('height'), 10);
		
		$row = this.$hRowTmpl.eq(i);
		$cells = $row.children('td');
		
		//Number() 로 파싱하면 22px 가 0 으로 나옴. parseInt 사용하기
		rowHeight = parseInt($row.attr('height'));
		cellHeight = parseInt($cells.eq(0).attr('height'));
		
		rowHeight = isNaN(rowHeight) ? 0 : rowHeight;
		cellHeight = isNaN(cellHeight) ? 0 : cellHeight;
		
		if(cellHeight>rowHeight) rowHeight = cellHeight;
		
		this.hRowTmplHeight += rowHeight;
	}

};

AGrid.prototype.createElement = function(context)
{
	AComponent.prototype.createElement.call(this, context);
	
	this.initVariables();
	
};


//--------------------------------------------------------------------------------------------------------------
//	그리드 구현 기본 알고리즘
//	[헤더] 역할을 하는 <header table> 은 <tbody> 부분이 없으며 최상단으로 띄운다.
//	[바디] 역할을 하는 <table> 은 <thead> 부분을 invisible 시켜 [헤더 table] 밑으로 들어가게 한다.  

AGrid.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	var isMobileSimul = (afc.isSimulator && afc.isHybrid);//시뮬레이터로 모바일 환경인 경우
	this.isCheckScrl = !isMobileSimul && !afc.isMobile && !this.isDev();
	
	//----------------------------------------------------    
	//	그리드 옵션값 셋팅
	//----------------------------------------------------
	
	this.setOption(
	{
		isHideHeader : this.getAttr('data-hide-header'),			//헤더를 숨길지
		isSingleSelect : this.getAttr('data-single-select'),		//ctrl 키를 누르고 선택해도 하나만 선택된다. 
		isFullRowSelect : this.getAttr('data-fullrow-select'),		//특정 cell 을 클릭해도 그 row 전체가 선택된다.
		isRClickSelect : this.getAttr('data-rclick-select'),		//우클릭으로 선택 가능한지
		isSelectable : this.getAttr('data-selectable'),				//선택 [불]가능 옵션 플래그
		isSortable : this.getAttr('data-sortable'),					//헤더 선택시 정렬처리 여부
		isFlexibleRow : this.getAttr('data-flexible-row'),			//TR의 높이를 TABLE 높이에 풀로 맞춤
		isClearRowTmpl : this.getAttr('data-clear-rowtmpl'),		//그리드 초기화 후 Template 로우를 그대로 보존할 지
		isColumnResize : this.getAttr('data-column-resize'),		//컬럼 리사이즈 여부
		isHideFooter: this.getAttr('data-hide-footer'),				//푸터 숨김여부
		isWidthChangable: this.getAttr('data-width-changable')		//컬럼 리사이즈시 그리드 넓이 변경여부
		
	}, true);
	
	//개발인 경우는 작동되지 않도록
	if(this.isDev()) 
		this.option.isColumnResize = false;
	
	// sortFunc 초기화(기본값: alphabetic)
	this.sortFunc = function(x, y, isAsc){ return isAsc?(x > y):(x < y); };

	//개발 시점에 추가되는 그리드는 무조건 보여져야 하므로 옵션을 비교하지 않는다.
	//if(!this.isDev() && this.option.isClearRowTmpl) this.tBody.children().remove();
	//row tmpl 을 데이터로 사용하는 경우 fullRowSelect 를 해제한다.
	//else this.option.isFullRowSelect = false;

	//if(this.option.isFlexibleRow) this.setFlexibleRow();
	
	//-----------------
	//	select style
	
	//개발영역을 판단하는 기준을 afc_ 로 하였으나 Attribute에서는 동작을 해야하므로 수정
	if(!this.isDev())
	{
		this.selectStyleName = this.$ele.attr('data-select-class');
		if(!this.selectStyleName) this.selectStyleName = 'agrid_select';
	}
	
	//this.escapePreventTouch();
	
	var thisObj = this;

	if(this.option.isHideHeader) this.hideHeader();
	else
	{
		//this.scrollArea.css('border-top', '1px solid transparent');
		this.showHeader();
		
		this.showThead.children().each(function()
		{
			$(this).children().each(function()
			{
				this.isHeader = true;
			});
		});
		
		//column resize
		if(this.option.isColumnResize) this.columnResizable();
	}
	
	if(this.option.isHideFooter) this.hideFooter();
	else
	{
		//this.scrollArea.css('border-top', '1px solid transparent');
		this.showFooter();
		
		this.tFoot.children().each(function()
		{
			$(this).children().each(function()
			{
				this.isFooter = true;
			});
		});
		
		//column resize
		//if(this.option.isColumnResize) this.columnResizable();
	}

	this.loadGridDataMask();
	this.loadGridShrinkInfo();
	this.loadGridNameKeyInfo();

	this.actionToFocusComp();
	
	
	if(this.isDev() || !this.option.isClearRowTmpl) 
	{
		// 개발상태에서 reload Comp시에 로우셋이 또 추가되기 때문에 제거한다.
		this.removeAll();
		this.addRow([]);
	}
	/*	basicStyle.css 에 추가
	if(!context)
	{
		this.tBody.children().children('td').css('border', '1px solid #c2c2c2');
		this.showThead.children().children('td').css('border', '1px solid #c2c2c2');
		this.hideThead.children().children('td').css('border', '1px solid #c2c2c2');
	}
	*/
	if(this.option.isFlexibleRow)
		this.setFlexibleRow(this.option.isFlexibleRow);
	
	// IOS 바디부분 스크롤 될때 바디부분 내용이 헤더영역 위로 보이는 버그때문에
	// 헤더테이블의 순서를 바디부분 즉 스크롤영역 뒤에 위치하게 함.
	//this.$ele.append(this.headerTable);
	
	
	if(afc.isScrollIndicator) this.enableScrollIndicator();
};

AGrid.prototype.layComponent = function(acomp, row, col, width, height)
{
	this.getParent().addComponent(acomp);

	if(width==undefined) width = '100%';
	if(height==undefined) height = '100%';
	
	acomp.$ele.css(
	{
		'position': 'static',
		//'position': 'relative',
		//'left': '0px', 'top':'0px',
		'width': width, 'height': height
	});

	$(this.getCell(row, col)).append(acomp.$ele);
};

AGrid.prototype.layHeaderComponent = function(acomp, row, col, width, height)
{
	this.getParent().addComponent(acomp);

	if(width==undefined) width = '100%';
	if(height==undefined) height = '100%';
	
	acomp.$ele.css(
	{
		'position': 'static',
		//'position': 'relative',
		//'left': '0px', 'top':'0px',
		'width': width, 'height': height
	});

	$(this.getHeaderCell(row, col)).append(acomp.$ele);
};

//하나의 셀에 여러 컴포넌트가 들어갈 수 있으므로 배열을 리턴한다.
AGrid.prototype.getCellComps = function(row, col)
{
	var cell = this.getCell(row, col), retArr = [];
	
	$(cell).children().each(function()
	{
		retArr.push(this.acomp);
	});

	return retArr;
};


AGrid.prototype.getColumnComps = function(colInx)
{
	var retArr = [], cell;
	
	this.getRows().each(function()
	{
		cell = $(this).children().get(colInx);
		
		if(cell) 
		{
			$(cell).children().each(function()
			{
				retArr.push(this.acomp);
			});
		}
	});
	
	return retArr;
};

AGrid.prototype.getAllLaiedComps = function()
{
	var retArr = [],
		$td = this.tBody.children().children();
	
	$td.each(function()
	{
		$(this).children().each(function()
		{
			retArr.push(this.acomp);
		});
	});
	
	return retArr;
};

AGrid.prototype.getDataMask = function(rowIdx, colIdx, idx)
{
	if(rowIdx == undefined || colIdx == undefined) return;
	
    var $row = null;
    if(typeof(rowIdx)=="number")
	{
		if(rowIdx >= this.$rowTmpl.length) rowIdx %= this.$rowTmpl.length;
		$row = this.$rowTmpl.eq(rowIdx); //tbody tr
	}
    else $row = $(rowIdx);
	
    return AComponent.prototype.getDataMask(idx, $row.children().get(colIdx));
};

AGrid.prototype.loadGridDataMask = function()
{
	if(this.$rowTmpl)
	{
		var $cells, i, j;

		for(i=0; i<this.$rowTmpl.length; i++)
		{
			$cells = this.$rowTmpl.eq(i).children();

			for(j=0; j<$cells.length; j++)
			{
				this.loadDataMask($cells[j], this);
			}
		}
	}

	if(!this.option.isHideFooter)
	{
		const tFootChildren = this.tFoot.children();
		let $cells;
		
		for(let i = 0; i < tFootChildren.length; i++)
		{
			$cells = tFootChildren.eq(i).children();
			for(let i = 0; i < $cells.length; i++)
			{
				this.loadDataMask($cells[i]);
			}
		}
	}
};

AGrid.prototype.loadGridShrinkInfo = function()
{
	if(this.$rowTmpl)
	{
		var $cells, i, j;

		for(i=0; i<this.$rowTmpl.length; i++)
		{
			$cells = this.$rowTmpl.eq(i).children();

			for(j=0; j<$cells.length; j++)
			{
				if($cells[j].style.display != 'none')
				{
					this.loadShrinkInfo($cells[j]);
				}
			}
		}
	}
};

AGrid.prototype.loadGridNameKeyInfo = function(enable)
{
	if(this.$rowTmpl)
	{
		var nameArr = this.nameKeyArr = [];
		var name;
		
		var idx = 0;
		this.$rowTmpl.each(function(i)
		{
			$(this).children('td').each(function(j)
			{
				if(this.style.display != 'none')
				{
					name = $(this).attr('name');
					if(name) nameArr[idx++] = name;
				}
			});
		});
	}
};

AGrid.prototype.setFlexibleRow = function(enable)
{
	let tableParent = this.scrollArea;
	//APivotGridEx 관련해서 처리해보려고 넣어놓음
	if(!this.scrollArea[0].parentElement) tableParent = this.$ele;
		
	if(enable)
	{
		//bodyTable 의 높이를 100%로 하게되면 실제 높이가 tHead,tBody 합친 값보다 1px 더 크게 잡힌다.
		//그로인해 하단의 보더가 안보이고 스크롤도 생기므로 변경한다.
//  	this.bodyTable.css('height', 'calc(100% - 1px)');
		this.$rowTmpl.css('height', 'auto');
		this.tBody.find('tr').css('height', 'auto');
		this.scrollArea.css('overflow-y', 'hidden');
 		//this.scrollArea.css('overflow-x', '');
		
		this.bodyTable.css('flex-grow', 1);
		tableParent.css({
			display: 'flex',
			'flex-direction': 'column'
		});
	}
	else
	{
//		this.bodyTable.css('height', 'auto');
		this.$rowTmpl.css('height', '');	//this.$rowTmpl.height()+'px');
		this.tBody.find('tr').css('height', '');
		this.scrollArea.css('overflow-y', '');
 		//this.scrollArea.css('overflow-x', '');
		
		this.bodyTable.css('flex-grow', '');
		tableParent.css({
			display: '',
			'flex-direction': ''
		});
	}
	this.option.isFlexibleRow = enable;
};

/*
AGrid.prototype.transForPivot = function()
{
	this.$ele.append(this.bodyTable);
	this.scrollArea.remove();
	this.scrollArea = null;
};
*/

AGrid.prototype.setScrollAreaId = function(areaId)
{
	if(!areaId) areaId = this.getElementId() + '_scrl';
	
	this.scrollArea.attr('id', areaId);
};

AGrid.prototype.enableScrlManager = function(leftSyncArea, rightSyncArea)
{
	if(this.scrlManager) return this.scrlManager;
	
	var thisObj = this;
	
	this.scrlManager = new ScrollManager();
	
	//we must delete this option on this mode.
	this.scrollArea.css('-webkit-overflow-scrolling', '');	//ios overflow-scrolling delete
	
	this.scrollImplement(leftSyncArea, rightSyncArea);
	
	this.aevent._scroll();
	
	return this.scrlManager;
};


AGrid.prototype.applyBackupScroll = function()
{
	if(this.bkManager) return this.bkManager.applyBackupScroll();
};


AGrid.prototype.setScrollComp = function(acomp)
{
	this.scrollComp = acomp;
	
};

AGrid.prototype.setScrollArrow = function(headHeight)
{
	this.sa = new ScrollArrow();
	
	this.sa.setArrow('vertical');
	this.sa.apply(this.scrollArea[0]);
	
	if(!headHeight)
	{
		if(this.option.isHideHeader) headHeight = 5;
		else headHeight = this.hRowTmplHeight+5;
	}
	
	this.sa.arrow1.css('top', headHeight+'px');
};

AGrid.prototype.enableScrollIndicator = function()
{
	this.scrlIndicator = new ScrollIndicator();
	
	this.scrlIndicator.init('vertical', this.scrollArea[0]);
};

AGrid.prototype.scrollImplement = function(leftSyncArea, rightSyncArea) 
{
	var thisObj = this;
	
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var isDown = false;
	
	var scrlArea = this.scrollArea[0],
		transTop, scrlEle = null, leftEle = null, rightEle = null, compEle = null, 
		scrlFunc = _scrlHelper, initFunc = _initHelper;
		
	//--------------------------------------------------------
	//	scroll 그리드 
	
	//touch start
	AEvent.bindEvent(scrlArea, AEvent.ACTION_DOWN, function(e)
	{
		//다른 그리드로부터 touchstart 가 발생했음을 통보 받은 경우
		if(e.userData)
		{
			//thisObj.scrlManager.initScroll(0);
			thisObj.scrlManager.initScroll(e.changedTouches[0].clientY);
			
			return;
		}
	
		isDown = true;
		
		//e.preventDefault();
		
		//자신의 스크롤 매니저가 구동의 주체가 아닌 경우
		//다른 그리드에게 알려준다.
		if(!thisObj.scrlManager.scrlTimer)
		{
			e.userData = true;
			if(leftSyncArea) AEvent.triggerEvent(leftSyncArea, AEvent.ACTION_DOWN, e);
			if(rightSyncArea) AEvent.triggerEvent(rightSyncArea, AEvent.ACTION_DOWN, e);
		}
		
		thisObj.scrlManager.initScroll(e.changedTouches[0].clientY);
		
		//asoocool test
		initFunc();
	});
	
	//touch move
	AEvent.bindEvent(scrlArea, AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		e.preventDefault();
		
		thisObj.scrlManager.updateScroll(e.changedTouches[0].clientY, scrlFunc);
	});
	
	//touch end
	AEvent.bindEvent(scrlArea, AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		//e.preventDefault();
		
		thisObj.scrlManager.scrollCheck(e.changedTouches[0].clientY, scrlFunc);
	});
	
	function _initHelper()
	{
		if(thisObj.scrollComp)
			transTop = thisObj.scrollComp.getPos().top + scrlArea.scrollTop;
	}
	
	function _scrlHelper(move)
	{
		if(move==0) return true;
		
		var oldTop = scrlArea.scrollTop;

		//scrollComp 는 css 값을 셋팅하기 때문에 똑같이 맞춰주기 위해 소수점을 버림.
		if(thisObj.scrollComp) move = parseInt(move);
		
		scrlArea.scrollTop += move;

		if(leftSyncArea) leftSyncArea.scrollTop = scrlArea.scrollTop;
		if(rightSyncArea) rightSyncArea.scrollTop = scrlArea.scrollTop; 
		
		if(oldTop==scrlArea.scrollTop) return false;
		
		if(thisObj.scrollComp)
		{
			thisObj.scrollComp.setStyle('top', (transTop-scrlArea.scrollTop)+'px');
		}
		
		//asoocool test
		//
		//var ratio = scrlArea.scrollTop/(scrlArea.scrollHeight-scrlArea.clientHeight);
		//thisObj.sa.arrow1.css('top', scrlArea.clientHeight*ratio+'px');
		//
		
		return true;
	}
	
	/*
	function _moveHelper(ele)
	{
		ele.style.webkitTransition = 'all 0.1s linear';
		ele.style.webkitAnimationFillMode = 'forwards';
  		ele.style.webkitTransform = 'translateY(' + ele.transY + 'px)';
	}
	*/
	
};


AGrid.prototype.scrollTopManage = function()
{
	//트랜지션 기능을 사용하는 경우는 자체적으로 호출되므로 다시 해주면 안됨.
	if(this.scrlManager) this.scrlManager.stopScrollTimer();
	
//console.log('top rowCount : '+this.getRowCount());

	if(this.bkManager && this.bkManager.checkHeadBackup()) 
	{
		if(this.bkManager.isMoveReal()) this.scrollToTop();
		
		return false;
	}
	else return true;
};

AGrid.prototype.scrollBottomManage = function()
{
	//트랜지션 기능을 사용하는 경우는 자체적으로 호출되므로 다시 해주면 안됨.
	if(this.scrlManager) this.scrlManager.stopScrollTimer();

//console.log('bottom rowCount : '+this.getRowCount());

	if(this.bkManager && this.bkManager.checkTailBackup()) 
	{
		if(this.bkManager.isMoveReal()) this.scrollToBottom();
		
		return false;
	}
	else return true;
};

AGrid.prototype.getRowData = function(row)
{
	if(typeof(row)=="number") row = this.getRow(row);
	//jQuery객체
	else if(row.length) row = row[0];
	
	if(row) return row._data;
	else return null;
};

AGrid.prototype.setRowData = function(row, rowData)
{
	if(typeof(row)=="number") row = this.getRow(row);
	
	if(row) row._data = rowData;
};


//----------------------------------------------------------------
//   add/remove   
//----------------------------------------------------------------

//하나의 row 를 삽입한다. 
AGrid.prototype.moveRow = function(fromRow, toRow)
{
	if(typeof(fromRow)=="number") fromRow = $(this.getRow(fromRow));
	else fromRow = $(fromRow);

	if(typeof(toRow)=="number") toRow = $(this.getRow(toRow));
	else toRow = $(toRow);

   	toRow.before(fromRow);
};

//기존의 모든 로우는 사라지고 새롭게 덮어 쓴다.
AGrid.prototype.setRows = function(infoArr2, rowData2)
{
	var rowArr = [], row;
	for(var i=0; i<infoArr2.length; i++)
	{
		//row 는 rowSet 이므로 여러개의 tr 일 수도 있다.
		row = this.createRow(infoArr2[i]);
		
		if(rowData2) row[0]._data = rowData2[i];
		
		row.each(function()
		{
			rowArr.push(this);
		});
	}
	
	this.selectedCells.length = 0;
	
	this.tBody.html(rowArr);
	
	if(afc.isPC) this.checkScrollbar(true);
	
	return rowArr;
};

//데이터가 많은 경우 addRow 를 여러번 호출하는 것보다
//addRows 로 한번에 추가하는 것이 성능적으로 유리하다. 
AGrid.prototype.addRows = function(infoArr2, rowData2, isPrepend)
{
	var rowArr = [], row;
	for(var i=0; i<infoArr2.length; i++)
	{
		//row 는 rowSet 이므로 여러개의 tr 일 수도 있다.
		row = this.createRow(infoArr2[i]);
		
		if(rowData2) row[0]._data = rowData2[i];
		
		row.each(function()
		{
			rowArr.push(this);
		});
	}
	
	if(this.bkManager && this.bkManager.appendItemManage(rowArr) )
	{
		return rowArr;
	}
	
	if(isPrepend) this.tBody.prepend(rowArr);
	else this.tBody.append(rowArr);
	
	if(afc.isPC) this.checkScrollbar(true);
	
	return rowArr;
};

//infoArr : [1,2,3,'abc']
//하나의 row 를 추가한다.
AGrid.prototype.addRow = function(infoArr, rowData)
{
	//row 는 rowSet 이므로 여러개의 tr 일 수도 있다.
	var row = this.createRow(infoArr);
	
	//row 전체를 대표하는 메모리 데이터
	if(rowData) row[0]._data = rowData;
	
	if(this.bkManager && this.bkManager.appendItemManage(row) )
	{
		return row;
	}
	
	this.tBody.append(row);
	
	if(afc.isPC) this.checkScrollbar(true);
    
    return row;
};

//하나의 row를 상단에 추가한다.
AGrid.prototype.prependRow = function(infoArr, rowData)
{
	var row = this.createRow(infoArr);
	
	//row 전체를 대표하는 메모리 데이터
	//if(rowData) row._data = rowData;
	if(rowData) row[0]._data = rowData;
	
	if(this.bkManager && this.bkManager.prependItemManage(row) ) return row;
	
	this.tBody.prepend(row);
	
	if(afc.isPC) this.checkScrollbar(true);
	
    return row;
};

//하나의 row 를 삽입한다. 
AGrid.prototype.insertRow = function(nRow, infoArr, rowData)
{
	var row = this.createRow(infoArr);
	
	//row 전체를 대표하는 메모리 데이터
	//if(rowData) row._data = rowData;
	if(rowData) row[0]._data = rowData;
	
	if(typeof(nRow)=="number") 
		nRow = this.getRow(this.$rowTmpl.length * nRow);
	
   	$(nRow).before(row);
	
	if(afc.isPC) this.checkScrollbar(true);
    
    return row;
};

AGrid.prototype.removeRow = function(rowIdx)
{
	if(typeof(rowIdx)=="number") $(this.getRow(rowIdx)).remove();
	else $(rowIdx).remove();
	
    if(afc.isPC) this.checkScrollbar(false);
    
    /*	차후에 처리 필요
    if(this.bkManager)
    {
    	
    }
    */
};


AGrid.prototype.removeHeaderRow = function(rowIdx)
{
	if(typeof(rowIdx)=="number") 
	{
		this.showThead.children().eq(rowIdx).remove();
		this.hideThead.children().eq(rowIdx).remove();
		this.hideFhead.children().eq(rowIdx).remove();
	}
	else $(rowIdx).remove();
};

AGrid.prototype.removeFooterRow = function(rowIdx)
{
	if(typeof(rowIdx)=="number") 
	{
		this.tFoot.children().eq(rowIdx).remove();
	}
	else $(rowIdx).remove();
};

AGrid.prototype.removeFirst = function()
{
	this.tBody.children().first().remove();
	
    if(afc.isPC) this.checkScrollbar(false);
};

AGrid.prototype.removeLast = function()
{
	this.tBody.children().last().remove();
	
    if(afc.isPC) this.checkScrollbar(false);
};

//############################
//	deprecated, use addRow(infoArr, rowData)

AGrid.prototype.addRowWithData = function(rowData, data)
{
	var rows = this.addRow(rowData);
	if(data == null) data = rowData;
	var cellIdx = 0;
	
	if(this.option.isFullRowSelect)
	{
		//deprecated
		rows.get(0).oridata = data;
		
		//아래처럼 구현하는 단일함수로 만들기 
	}
	else
	{
		for(var i = 0; i < rows.length; i++)
		{
			var row = $(rows[i]);
			var children = row.children();
			for(var j = 0; j < children.length; j++)
			{
				//if(!children.eq(j).attr('data-span'))
				
				if(children[j].style.display != 'none')
					this.setCellData(row, j, data[cellIdx++]);
			}
		}
	}
	
	return rows;
};


AGrid.prototype.getDataByOption = function(rowInfo)
{
	if(this.option.isFullRowSelect)
	{
        //_data 로 변경되었으므로 추가
        if(rowInfo.get(0)._data) return rowInfo.get(0)._data;
		else if(rowInfo.get(0).oridata) return rowInfo.get(0).oridata;
		else
		{
			var retData = [];
			var tdArr = null;
			for(var i = 0; i<rowInfo.length; i++)
			{
				tdArr = rowInfo.eq(i).children();
				for(var j = 0; j<tdArr.length; j++)
					retData.push(tdArr.eq(j).text());	
			}
			return retData;
		}
	} 
	else return rowInfo[0].data;
};

/*
AGrid.prototype.getRowSetByIndex = function(idx)
{
	return this.$getRow(idx*this.$rowTmpl.length).get(0).rowset;
};
*/

AGrid.prototype.getRowSet = function(rowIdx)
{
	var rowSetLength = this.$rowTmpl.length,
		startIdx = rowSetLength*rowIdx;
	
	return $(this.getRows(startIdx, startIdx+rowSetLength));
};

//info값으로 로우 index가져오기
AGrid.prototype.getRowIndexByInfo = function(rowInfo)
{
	//return rowInfo.eq(0).index();
	
	return this.indexOfRow(rowInfo.eq(0));
};

//로우 또는 로우셋 데이터를 가져오기, 
//oridata 사용하는 것 없애기
//############################
//deprecated
AGrid.prototype.getRowDataByIndex = function(rowIdx)
{
	return this.tBody.children().get(rowIdx).oridata;
};

AGrid.prototype.removeRowSet = function(rowIdx)
{
	var rowSetLength = this.$rowTmpl.length,
		startIdx = rowSetLength*rowIdx;
	
	$(this.getRows(startIdx, startIdx+rowSetLength)).remove();
	
	if(afc.isPC) this.checkScrollbar(false);
};


AGrid.prototype.removeAll = function()
{
	this.tBody.children().remove();//tbody tr
	
	//선택되었었던 cellArr 제거
	this.selectedCells.length = 0;
	
	if(afc.isPC) this.checkScrollbar(false);
	
	if(this.bkManager) this.bkManager.clearAll();
	
	//4.3 안드로이드 로우셋 안지워지는 버그 대응
	if(afc.andVer<4.4 && this.scrollArea)
	{
		this.scrollArea.hide();
		var thisObj = this;
		setTimeout(function(){
			thisObj.scrollArea.show();
		},1);

	}
};

//	cellArr 은 selectCell 설명 참조.
//	$(cellArr) 이 코드는 cellArr 가 Array 나 jQuery 객체여도 동일하게 작동함
AGrid.prototype._addCell = function(cellArr)
{
    //새롭게 선택된 셀을 추가하고 배경 색을 바꾼다.
    this.selectedCells.push(cellArr);
	
	if(!this.isDev() && this.isHeadCell(cellArr)) return;
    
	if(this.option.isFullRowSelect)
	{
		//td 에 직접 추가해야 하므로
		$(cellArr).children().addClass(this.selectStyleName);
	}
	
	//cellArr 가 Array 나 jQuery 객체여도 동일하게 작동함
	else $(cellArr).addClass(this.selectStyleName);
};

//Array 의 slice 함수와 파라미터가 같다.
AGrid.prototype.selectRows = function(startIdx, endIdx)
{
	this.selectCell(this.getRows(startIdx, endIdx));
};

//----------------------------------------------------------------
//   select cell  
//----------------------------------------------------------------

//	isFullRowSelect 가 참이면 cellArr 은 tr element 의 array or jQuery 집합.
//	rowSet 이 여러개인 경우 인 경우 여러개의 row 객체들을 가지고 있다.

//	cellArr 는 element 를 담고 있는 배열이거나 jQuery 집합 객체이다.
//	그룹지어야 할 cell 이나 row 들을 배열이나 jQuery 집합으로 모아서 넘긴다.

//	※ 주의, cellArr 는 특정 cell 이나 row 를 그룹짓고 있는 배열이나 집합이므로 
//	동등 비교를 할 경우 this.selectedCells[i][0] === cellArr[0] 과 같이 해야 함.
//	그룹지어져 있는 경우 첫번째 원소의 주소만 비교하면 같은 그룹임
AGrid.prototype.selectCell = function(cellArr, e)
{
	if(!this.option.isSelectable) return;
	
	if(!e) e = {};
	
	//멀티셀렉트인 경우 모바일은 컨트롤키가 눌린것과 같이 동작한다.
	var isCtrlKey = e.ctrlKey||afc.isMobile, isShiftKey = e.shiftKey, i;
	
	if(this.option.isSingleSelect)
	{
		isCtrlKey = false;
		isShiftKey = false;
	}
	
	if(isCtrlKey)
	{
		//이미 선택된 셀이라면 디셀렉트 후 리턴
		if(this.selectedCells.length > 0 && this.deselectCell(cellArr))
		{
			this.lastSelectedCell = this.shiftCurrentCell = this.selectedCells[0];
			return;
		}
		
		this.lastSelectedCell = this.shiftCurrentCell = cellArr;
		this.shiftSelectedCells.length = 0;
		this._addCell(cellArr);
		
	}
	
	else if(isShiftKey)
	{
		if(this.option.isFullRowSelect)
		{
			// 전체 제거 후 다시 선택
			this.clearSelected();
			
			var firstIdx = this.indexOfRow(this.lastSelectedCell);
			var lastIdx = this.indexOfRow(cellArr);
			i = firstIdx - lastIdx;
			
			//첫 셀이 더 아래에 있음
			if(i > 0)
			{
				firstIdx += this.$rowTmpl.length-1;
				i += this.$rowTmpl.length-1;

				for(;i>=0;i--)
				{
					this._addCell($( this.getRow(firstIdx-i) ));
				}
			}
			//첫 셀이 더 위에 있음
			else
			{
				i -= this.$rowTmpl.length-1;

				for(;i<=0;i++)
				{
					this._addCell($( this.getRow(firstIdx-i) ));
				}
			}
		}
		else
		{
			var _indexOfCell = function(cell)
			{
				var $row = $(cell).parent();
				return [$row.parent().children().index($row), $row.children().index(cell)];
			}
			
			this.shiftCurrentCell = cellArr;
			
			var startRowIdx, endRowIdx, startColIdx, endColIdx, $cell, hRowIdx,
				hCellArr = [], bCellArr = [], fCellArr = [], func;
			
			// 기존에 shift로 선택한 셀들이 있으면 선택해제 처리한다.
			for(i=0; i<this.shiftSelectedCells.length; i++)
			{
				cell = this.shiftSelectedCells[i];
				if(cell) this.deselectCell(cell);
			}
			this.shiftSelectedCells.length = 0;

			if(this.isHeadCell(this.lastSelectedCell))
			{
				hCellArr.push(_indexOfCell(this.lastSelectedCell));
			}
			else if(this.isFootCell(this.lastSelectedCell))
			{
				fCellArr.push(_indexOfCell(this.lastSelectedCell));
			}
			else bCellArr.push(_indexOfCell(this.lastSelectedCell));

			if(this.isHeadCell(cellArr))
			{
				hCellArr.push(_indexOfCell(cellArr));
			}
			else if(this.isFootCell(cellArr))
			{
				fCellArr.push(_indexOfCell(cellArr));
			}
			else bCellArr.push(_indexOfCell(cellArr));

			if(hCellArr.length == 1 || bCellArr.length == 1 || fCellArr.length == 1)
			{
				const thisObj = this;
				var setCell = function(startRowIdx, endRowIdx, func)
				{
					for(var i=startRowIdx; i<=endRowIdx; i++)
					{
						for(var j=startColIdx; j<=endColIdx; j++)
						{
							cell = func.call(thisObj, i,j);
							if(thisObj.lastSelectedCell[0] === cell) continue;
							thisObj._addCell($(cell));
							thisObj.shiftSelectedCells.push($(cell));
						}
					}
				}

				let type = String(hCellArr.length) + String(bCellArr.length) + String(fCellArr.length);
				switch (type)
				{
					case '011':	//body foot
						startColIdx = Math.min(bCellArr[0][1], fCellArr[0][1]);
						endColIdx = Math.max(bCellArr[0][1], fCellArr[0][1]);
						setCell(bCellArr[0][0], this.getRowCount()-1, this.getCell);
						setCell(0, fCellArr[0][0], this.getFooterCell);
						break;
					case '101':	//head foot
						startColIdx = Math.min(hCellArr[0][1], fCellArr[0][1]);
						endColIdx = Math.max(hCellArr[0][1], fCellArr[0][1]);

						setCell(hCellArr[0][0], this.showThead.children('tr').length-1, this.getHeaderCell);
						setCell(0, this.getRowCount()-1, this.getCell);	//헤더 ~ 풋터면 바디는 전체로우
						setCell(0, fCellArr[0][0], this.getFooterCell);
						break;
					case '110':	//head body
						startColIdx = Math.min(hCellArr[0][1], bCellArr[0][1]);
						endColIdx = Math.max(hCellArr[0][1], bCellArr[0][1]);
						setCell(hCellArr[0][0], this.showThead.children('tr').length-1, this.getHeaderCell);
						setCell(0, bCellArr[0][0], this.getCell);
					break;
				}
			}
			else
			{
				if(hCellArr.length>0) func = this.getHeaderCell;
				else if(fCellArr.length>0){
					hCellArr = fCellArr;
					func = this.getFooterCell;
				}
				else
				{
					hCellArr = bCellArr;
					func = this.getCell;
				}

				startRowIdx = Math.min(hCellArr[0][0], hCellArr[1][0]);
				endRowIdx = Math.max(hCellArr[0][0], hCellArr[1][0]);

				startColIdx = Math.min(hCellArr[0][1], hCellArr[1][1]);
				endColIdx = Math.max(hCellArr[0][1], hCellArr[1][1]);
				
				for(i=startRowIdx; i<=endRowIdx; i++)
				{
					for(var j=startColIdx; j<=endColIdx; j++)
					{
						cell = func.call(this, i, j);
						if(this.lastSelectedCell[0] === cell) continue;
						this._addCell($(cell));
						this.shiftSelectedCells.push($(cell));
					}
				}
			}
		}
	}
	
	else
	{
		this.clearSelected();
		
		this._addCell(cellArr);
		this.lastSelectedCell = this.shiftCurrentCell = cellArr;
		this.shiftSelectedCells.length = 0;
	}
};

// isFullRowSelect 가 참이면 cell 은 <tr> 객체임 즉, row
AGrid.prototype.deselectCell = function(cellArr)
{
	if(this.option.isFullRowSelect)
	{
		$(cellArr).children().removeClass(this.selectStyleName);
	}
	else $(cellArr).removeClass(this.selectStyleName);
	
	//this.clearSelected();
	// 전체 클리어가 아니라 넘어온 셀만 제거
	for(var i=0; i<this.selectedCells.length; i++)
	{
		//cellArr 의 첫번째 원소의 주소가 같으면 같은 그룹이다.
		if(this.selectedCells[i][0] === cellArr[0])	
		{
			this.selectedCells.splice(i, 1);
			return true;
		}
	}
	
	return false;
};

//그리드안의 데이터 모두 지우기
AGrid.prototype.clearAll = function()
{
    this.tBody.find('td').each(function()
    {
        this.textContent = '';
		if(this.dm) this.dm.setOriginal('');
		this.style.background = '';
    });
};

AGrid.prototype.clearContents = function()
{
    this.tBody.find('td').each(function()
    {
        this.textContent = '';
		if(this.dm) this.dm.setOriginal('');
    });
};

//선택된 셀(행)을 모두 해제 시키는 함수
AGrid.prototype.clearSelected = function()
{
	var cell = null;

	//선택되어져 있던 셀들의 배경을 원상복귀 한다.
	
	if(this.option.isFullRowSelect)
	{
		var thisObj = this;
		
		for(let i=0; i<this.selectedCells.length; i++) 
		{
			$(this.selectedCells[i]).children().each(function()
			{
				$(this).removeClass(thisObj.selectStyleName);
			});
		}
	}
	else 
	{
		for(let i=0; i<this.selectedCells.length; i++) 
		{
			$(this.selectedCells[i]).removeClass(this.selectStyleName);
		}
	}
	
	
    //선택 목록에서 모두 제거
    this.selectedCells.length = 0;
};


//----------------------------------------------------------------
//   Util functions
//----------------------------------------------------------------

AGrid.prototype.showHeader = function()
{
	this.showThead.show();
	this.option.isHideHeader = false;
};

AGrid.prototype.hideHeader = function()
{
    this.showThead.hide();
	this.option.isHideHeader = true;
};

AGrid.prototype.showFooter = function()
{
	this.tFoot.show();
	this.option.isHideFooter = false;
	this.removeAttr('data-hide-footer');
};

AGrid.prototype.hideFooter = function()
{
    this.tFoot.hide();
	this.option.isHideFooter = true;
	this.setAttr('data-hide-footer', true);
};

AGrid.prototype.findRowByCellText = function(nCol, text)
{
	var retRow = null;
	var thisObj = this;
	
	this.tBody.children().each(function()
	{
		if(thisObj.getCellText(this, nCol)==text)
		{
			retRow = this;
			return false;
		}
	});
	
	return retRow;
};

AGrid.prototype.findRowByCellData = function(nCol, data)
{
	var retRow = null;
	var thisObj = this;
	
	this.tBody.children().each(function()
	{
		if(thisObj.getCellData(this, nCol)==data)
		{
			retRow = this;
			return false;
		}
	});
	
	return retRow;
};

AGrid.prototype.findRowByData = function(data)
{
	var retRow = null;
	
	this.tBody.children().each(function()
	{
		if(this._data==data)
		{
			retRow = this;
			return false;
		}
	});
	
	return retRow;
};


//-----------------------
//  get functions
//-----------------------

//row 의 개수를 리턴한다.
AGrid.prototype.getRowCount = function()
{
    return this.tBody.children().length;
};

AGrid.prototype.getHeaderRowCount = function()
{
    return this.showThead.children('tr').length;
};

AGrid.prototype.getFooterRowCount = function()
{
    return this.tFoot.children('tr').length;
};



AGrid.prototype.getRowSetCount = function()
{
	return this.getRowCount()/this.$rowTmpl.length;
};

AGrid.prototype.getColumnCount = function()
{
    return this.columnCount; 
};

//특정 idx 의 cell 을 얻어온다.
//rowIdx 값은 row 객체가 될 수 있다.
AGrid.prototype.getCell = function(rowIdx, colIdx)
{
    var row = null;
    if(typeof(rowIdx)=="number") row = this.tBody.children().eq(rowIdx); //tbody tr
    else row = $(rowIdx);
    
	return row.children().get(colIdx);
};

//특정 header idx 의 cell 을 얻어온다.
//rowIdx 값은 row 객체가 될 수 있다.
AGrid.prototype.getHeaderCell = function(rowIdx, colIdx)
{
    var row = null;
    if(typeof(rowIdx)=="number") row = this.showThead.children().eq(rowIdx); //tbody tr
    else row = $(rowIdx);
    
	return row.children().get(colIdx);
};

//특정 footer idx 의 cell 을 얻어온다.
//rowIdx 값은 row 객체가 될 수 있다.
AGrid.prototype.getFooterCell = function(rowIdx, colIdx)
{
    var row = null;
    if(typeof(rowIdx)=="number") row = this.tFoot.children().eq(rowIdx); //tbody tr
    else row = $(rowIdx);
    
	return row.children().get(colIdx);
};

//AGrid.prototype.getHideHeaderCell = AGrid.prototype.getHeaderCell;

AGrid.prototype.getHideHeaderCell = function(rowIdx, colIdx)
{
    var row = null;
    if(typeof(rowIdx)=="number") row = this.hideThead.children().eq(rowIdx); //tbody tr
    else row = $(rowIdx);
    
	return row.children().get(colIdx);
};

//특정 인덱스의 row 를 얻어온다.
AGrid.prototype.getRow = function(rowIdx)
{
	if(this.bkManager) 
		rowIdx -= this.bkManager.getHeadCount();

	//return this.tBody.children().get(rowIdx);
	return this.tBody[0].children[rowIdx];
};

AGrid.prototype.getLastRow = function()
{
	return this.tBody.children().last()[0];
};

AGrid.prototype.getFirstRow = function()
{
	return this.tBody.children().first()[0];
};


//특정 인덱스의 row 를 얻어온다. 파라미터가 없으면 모든 row 를 리턴한다.
AGrid.prototype.getRows = function(start, end)
{
	if(start!=undefined) return this.tBody.children().slice(start, end);
	else return this.tBody.children();
};

AGrid.prototype.getCellText = function(rowIdx, colIdx)
{
	var cell = this.getCell(rowIdx, colIdx);
	if(cell && cell.dm) return cell.dm.unmask(cell);
	
	return cell.textContent;

    //return $(this.getCell(rowIdx, colIdx)).text();
};

AGrid.prototype.getCellTag = function(rowIdx, colIdx)
{
    return $(this.getCell(rowIdx, colIdx)).html();
};

AGrid.prototype.getCellData = function(rowIdx, colIdx)
{
    return this.getCell(rowIdx, colIdx).data;
};

//파라미터로 넘어온 cell 의 row, col index 를 배열로 리턴한다. -> [row, col]
AGrid.prototype.indexOfCell = function(cell)
{
	var row = $(cell).parent(); 
    return [this.indexOfRow(row), row.children().index(cell)];
};

//파라미터로 넘어온 row 의 index 를 리턴한다.
AGrid.prototype.indexOfRow = function(row)
{
    //return this.tBody.children().index(row);
	
	// row를 넘기지 않을 경우 -1을 리턴한다.
	if(!row) return -1;
	
	var inx = this.tBody.children().index(row);
	
	if(inx<0) return -1;
	
	if(this.bkManager) 
	{
		inx += this.bkManager.getHeadCount();
	}
	
	if(this.option.isClearRowTmpl) inx = parseInt(inx/this.$rowTmpl.length);

	return inx;
};

//파라미터로 넘어온 cell 의 row index 를 리턴한다.
AGrid.prototype.rowIndexOfCell = function(cell)
{
	return this.indexOfRow($(cell).parent());
};

//파라미터로 넘어온 cell 의 column index 를 리턴한다.
AGrid.prototype.colIndexOfCell = function(cell)
{
	return $(cell).parent().children().index(cell);
};

//isFullRowSelect 가 참이면 선택된 row 가 리턴된다.
AGrid.prototype.getSelectedCells = function()
{
    return this.selectedCells;
};


//-----------------------
//  set functions
//-----------------------



AGrid.prototype.setHeaderCellText = function(rowIdx, colIdx, txt)
{
    $(this.getHeaderCell(rowIdx, colIdx)).text(txt);
};

AGrid.prototype.setHeaderCellTag = function(rowIdx, colIdx, tag)
{
    this.getHeaderCell(rowIdx, colIdx).innerHTML = tag;
	this.setHeadHeight(this.getHeaderCell(rowIdx, colIdx).offsetHeight);
};

AGrid.prototype.setFooterCellText = function(rowIdx, colIdx, text)
{
	var cell = this.getFooterCell(rowIdx, colIdx);
	if(cell) 
	{
		if(cell.dm)
		{
			cell.dm.ele = cell;
			text = cell.dm.mask(text);
		}
		
		cell.textContent = text;
		
		//if(this.shrinkInfo) AUtil.autoShrink(cell, this.shrinkInfo[colIdx]);
		if(cell.shrinkInfo) AUtil.autoShrink(cell, cell.shrinkInfo);
	}
};

AGrid.prototype.setFooterCellTag = function(rowIdx, colIdx, tag)
{
    this.getFooterCell(rowIdx, colIdx).innerHTML = tag;
	this.setFootHeight(this.getFooterCell(rowIdx, colIdx).offsetHeight);
};

AGrid.prototype.setCellText = function(rowIdx, colIdx, text)
{
	var cell = this.getCell(rowIdx, colIdx);
	if(cell) 
	{
		if(cell.dm)
		{
			cell.dm.ele = cell;
			text = cell.dm.mask(text);
		}
		
		cell.textContent = text;
		
		//if(this.shrinkInfo) AUtil.autoShrink(cell, this.shrinkInfo[colIdx]);
		if(cell.shrinkInfo) AUtil.autoShrink(cell, cell.shrinkInfo);
	}
};

AGrid.prototype.setCellTag = function(rowIdx, colIdx, tag)
{
	if(tag==undefined) return;
	
	var cell = this.getCell(rowIdx, colIdx);
	if(cell) 
	{
		cell.innerHTML = tag;
		//cell.childNode[0].nodeValue = tag;
		//if(this.shrinkInfo) AUtil.autoShrink(cell, this.shrinkInfo[colIdx]);
		if(cell.shrinkInfo) AUtil.autoShrink(cell, cell.shrinkInfo);
	}

	//var cell = $(this.getCell(rowIdx, colIdx));
    //cell.html(tag);
	//cell.autoShrink(this.shrinkInfo[colIdx]);
};

AGrid.prototype.setCellData = function(rowIdx, colIdx, data)
{
    this.getCell(rowIdx, colIdx).data = data;
};

//return : Promise
AGrid.prototype.loadCellView = function(rowIdx, colIdx, url)
{
    var cell = this.getCell(rowIdx, colIdx);	//td
    var $item = $('<div></div>');

    $item.css(
    {
        width: '100%', height: '100%', overflow: 'auto'
    });
	
    $(cell).html($item);
    
	return AView.createView($item[0], url, this);
};

AGrid.prototype.setCellTextColor = function(rowIdx, colIdx, color)
{
	var cell = this.getCell(rowIdx, colIdx);
	cell.style.setProperty('color', color, 'important');
};

AGrid.prototype.setCellTextColor2 = function(cell,color)
{	
	var cellIndex = this.getCellIndex(cell);
	var headCell;
	
	if(this.isHeadCell(cell))
		headCell = this.showThead.children().eq(cellIndex[0]).children().get(cellIndex[1])
	
	if(color == null) 
	{
		cell[0].style.removeProperty('color');
		
		if(headCell)
			headCell.style.removeProperty('color');
	}
	
	cell[0].style['color'] = color;

	if(headCell)
		headCell.style['color'] = color;
}


AGrid.prototype.getCellTextColor2 = function(cell) { return cell[0].style['color']; };

AGrid.prototype.setCellBgColor2 = function(cell, color)
{
	var cellIndex = this.getCellIndex(cell);
	var headCell;
	
	if(this.isHeadCell(cell))
		headCell = this.showThead.children().eq(cellIndex[0]).children().get(cellIndex[1]);
	
	if(color == null) 
	{
		cell[0].style.removeProperty('background-color');
		
		if(headCell)
			headCell.style.removeProperty('background-color');
	}
	
	cell[0].style['background-color'] = color;

	if(headCell)
		headCell.style['background-color'] = color;
};

AGrid.prototype.getCellBgColor2 = function(cell) { return cell[0].style['background-color']; };

AGrid.prototype.getCellIndex = function(cell)
{
	var $cell = $(cell);
	
	return [$cell.parent().index(), $cell.index()];
}

AGrid.prototype.isHeadCell = function (cell)
{
	return this.getRowParentTag(cell) == 'thead';
};

AGrid.prototype.isFootCell = function (cell)
{
	return this.getRowParentTag(cell) == 'tfoot';
};

AGrid.prototype.setCellHAlign = function (cell, align)
{
	if(this.isHeadCell(cell))
	{	
		var cellIndex = this.getCellIndex(cell);
		
		var $headCell = $(this.showThead.children().eq(cellIndex[0]).children().get(cellIndex[1]));
		$headCell.css('text-align', align);	
	}
	cell[0].style['text-align'] = align;//cell.css('text-align', align);
};

AGrid.prototype.setCellVAlign = function (cell,align)
{
	if(this.isHeadCell(cell))
	{
		var cellIndex = this.getCellIndex(cell);
		
		var $headCell = $(this.showThead.children().eq(cellIndex[0]).children().get(cellIndex[1]));
		$headCell.css('vertical-align', align);	
	}
	cell[0].style['vertical-align'] = align;//cell.css('vertical-align', align);
};

AGrid.prototype.setHeaderCellStyle = function(rowIdx, colIdx, key, value)
{
	$(this.getHeaderCell(rowIdx, colIdx)).css(key, value);
};

AGrid.prototype.setHeaderCellStyleObj = function(rowIdx, colIdx, obj)
{
	$(this.getHeaderCell(rowIdx, colIdx)).css(obj);
};

//key : 문자열 또는 문자열배열
//return: 문자열 또는 오브젝트
AGrid.prototype.getHeaderCellStyle = function(rowIdx, colIdx, key)
{
	return $(this.getHeaderCell(rowIdx, colIdx)).css(key);
};

AGrid.prototype.setCellStyle = function(rowIdx, colIdx, key, value)
{
	$(this.getCell(rowIdx, colIdx)).css(key, value);
};

AGrid.prototype.setCellStyleObj = function(rowIdx, colIdx, obj)
{
	$(this.getCell(rowIdx, colIdx)).css(obj);
};

//key : 문자열 또는 문자열배열
//return: 문자열 또는 오브젝트
AGrid.prototype.getCellStyle = function(rowIdx, colIdx, key)
{
	return $(this.getCell(rowIdx, colIdx)).css(key);
};

AGrid.prototype.cellAddClass = function(rowIdx, colIdx, className)
{
    $(this.getCell(rowIdx, colIdx)).addClass(className);
};

AGrid.prototype.cellRemoveClass = function(rowIdx, colIdx, className)
{
    $(this.getCell(rowIdx, colIdx)).removeClass(className);
};

// 셀의 높이를 변경(row 전체가 바뀌어야 하므로 td 말고 tr 로 변경.)
AGrid.prototype.setCellHeight = function(cell, height)
{
	var isHead = this.isHeadCell(cell);
	var index = this.getCellIndex(cell);
	
	if(isHead)
	{
		this.showThead.children('tr').eq(index[0]).children().eq(index[1]).attr('height', height);
		this.hideThead.children('tr').eq(index[0]).children().eq(index[1]).attr('height', height);
	}
	else
		this.tBody.children('tr').eq(index[0]).children().eq(index[1]).attr('height', height);	
};

AGrid.prototype.getCellHeight = function(cell)
{
	return cell.attr('height');
};

// 헤더의 특정 Row 높이 리턴
AGrid.prototype.getHeadHeight = function(row)
{
	if(row == undefined) row = 0;
	return this.showThead.children('tr').eq(row).attr('height');
};

//헤더 높이 변경
AGrid.prototype.setHeadHeight = function(headHeight)
{
	this.showThead.children('tr').attr('height', headHeight);
	this.hideThead.children('tr').attr('height', headHeight);
};

// 바디 특정 Row 의 높이 리턴.
AGrid.prototype.getBodyHeight = function(row)
{
	if(row == undefined) row = 0;
	return this.tBody.children('tr').eq(row).attr('height');
};

//바디 높이 변경
AGrid.prototype.setBodyHeight = function(bodyHeight)
{
	this.tBody.children('tr').attr('height', bodyHeight);
};

//풋터 특정 Row 의 높이 리턴
AGrid.prototype.getFootHeight = function(row)
{
	if(row == undefined) row = 0;
	return this.tFoot.children('tr').eq(row).attr('height');
};

//풋터 높이 변경
AGrid.prototype.setFootHeight = function(footHeight)
{
	this.tFoot.children('tr').attr('height', footHeight);
};

AGrid.prototype.setHeadColor = function(color)
{
	this.showThead.children('tr').css('background-color', color);
};

AGrid.prototype.getHeadColor = function()
{
	return this.showThead.children('tr').eq(0).css('background-color');
};

AGrid.prototype.getFootColor = function()
{
	return this.tFoot.children('tr').eq(0).css('background-color');
};

AGrid.prototype.setFootColor = function(color)
{
	this.tFoot.children('tr').css('background-color', color);
};

AGrid.prototype.setBodyColor = function(color)
{
	this.tBody.children('tr').css('background-color', color);
};

AGrid.prototype.getBodyColor = function()
{
	return this.tBody.children('tr').eq(0).css('background-color');
};

AGrid.prototype.setHeadTextAlign = function(align)
{
	this.showThead[0].style.textAlign = align;
	this.hideThead[0].style.textAlign = align;
};

AGrid.prototype.getHeadTextAlign = function()
{
	return this.showThead[0].style.textAlign;
};

AGrid.prototype.setBodyTextAlign = function(align)
{
	this.tBody[0].style.textAlign = align;
};

AGrid.prototype.getBodyTextAlign = function()
{
	return this.tBody[0].style.textAlign;
};

AGrid.prototype.setFootTextAlign = function(align)
{
	this.tFoot[0].style.textAlign = align;
	this.hideFhead[0].style.textAlign = align;
};

AGrid.prototype.getFootTextAlign = function()
{
	return this.tFoot[0].style.textAlign;
};

//-----------------------------------------------------------------------------------
// data property 를 위해 차후에 추가된 함수들...

//컬럼 추가
AGrid.prototype.addColumn = function()
{
	var thisObj = this;
    var $cell = null;
    
    this.headerTable.find('colgroup').append($('<col></col>'));
	this.footerTable.find('colgroup').append($('<col></col>'));
    this.bodyTable.find('colgroup').append($('<col></col>'));
	
    this.showThead.children().each(_add_helper);
	this.hideThead.children().each(_add_helper);
    this.tBody.children().each(_add_helper);
	this.tFoot.children().each(_add_helper);
	this.hideFhead.children().each(_add_helper);
	
	for(var i=0; i<this.$rowTmpl.length; i++)
		_add_helper.call(this.$rowTmpl[i]);

	this.columnCount ++;
	
	
	function _add_helper(i)
	{
		$cell = $('<td></td>');
		
        //thisObj.makeDefaultCellStyle($cell);

		$(this).append($cell);
    	//$cell.css('border', thisObj.mGridBodyBorder);
        //$cell.css('border-width', thisObj.mGridBodyBorderW);
	}
};

//컬럼 삭제
AGrid.prototype.removeColumn = function(colIdx)
{
	var thisObj = this;
	var pos = colIdx;
	if(pos == undefined) pos = this.columnCount-1;
	
	this.headerTable.find('colgroup').children().eq(pos).remove();
	this.footerTable.find('colgroup').children().eq(pos).remove();
	this.bodyTable.find('colgroup').children().eq(pos).remove();
	
	this.showThead.children('tr').each(_remove_helper);
	this.hideThead.children('tr').each(_remove_helper);
    this.tBody.children('tr').each(_remove_helper);
	this.tFoot.children('tr').each(_remove_helper);
	this.hideFhead.children('tr').each(_remove_helper);
	
	for(var i=0; i<this.$rowTmpl.length; i++)
		_remove_helper.call(this.$rowTmpl[i]);
        
    this.columnCount --;
	
	function _remove_helper(i)
	{
		var removeTd = this.children[pos];
		thisObj.decreaseColSpan(removeTd);
		removeTd.remove();
	}
};

// 열 숨기기
// colIdx : number
AGrid.prototype.hideColumn = function(colIdx)
{
    if(colIdx<0) return false

	//hide 상태에서 hide 방지
	//if(this.headerTable.find('col')[colIdx].style.width == '0px') return;

	var colCnt = this.getColumnCount(),
		colHidedInfoArr = new Array(colCnt),
		colHidedCnt = 0;
	
	this.headerTable.find('col').each(function(i)
	{
		if(this.style.width == '0px')
		{
			colHidedInfoArr[i] = true;
			colHidedCnt++;
		}
	});
	
	if(colCnt == colHidedCnt+1)
	{
		if(colHidedInfoArr[colIdx] == undefined)
		{
			return false;
		}
	}

	var changeShowHTarget, changeHideHTarget, changeBTarget, changeFTarget, changeHideFHTarget,
		showTheadArr = this.showThead.children(),
		hideTheadArr = this.hideThead.children(),
		bodyArr = this.tBody.children(),
		footArr = this.tFoot.children(),
		hideFheadArr = this.hideFhead.children();
		
	this.headerTable.find('col')[colIdx].style.width = '0px';
	this.footerTable.find('col')[colIdx].style.width = '0px';
	this.bodyTable.find('col')[colIdx].style.width = '0px';

	changeShowHTarget = showTheadArr.children('td:nth-child('+(colIdx+1)+')');
	changeHideHTarget = hideTheadArr.children('td:nth-child('+(colIdx+1)+')');
	changeBTarget = bodyArr.children('td:nth-child('+(colIdx+1)+')');
	changeFTarget = footArr.children('td:nth-child('+(colIdx+1)+')');
	changeHideFHTarget = hideFheadArr.children('td:nth-child('+(colIdx+1)+')');


	this.oriWhiteSpace[colIdx] = [
		changeShowHTarget.css('white-space'),
		changeBTarget.css('white-space'),
		changeFTarget.css('white-space')
	];

	changeShowHTarget.css('white-space', 'nowrap');
	changeHideHTarget.css('white-space', 'nowrap');
	changeBTarget.css('white-space', 'nowrap');
	changeFTarget.css('white-space', 'nowrap');
	changeHideFHTarget.css('white-space', 'nowrap');
	
	if(this.option.isColumnResize && this.resizeBars[colIdx])
	{
		this.resizeBars[colIdx].css('display', 'none');

        //resizeBar 위치를 갱신해준다.
        this._updateBarPos();
	}
	
	return true;
};

// 열 숨기기 취소
// colIdx : number
AGrid.prototype.showColumn = function(colIdx)
{
    if(colIdx<0) return false
	//show 상태에서 show 방지
	//if(this.headerTable.find('col')[colIdx].style.width != '0px') return;

	var showTheadArr = this.showThead.children(),
		hideTheadArr = this.hideThead.children(),
		bodyArr = this.tBody.children(),
		footArr = this.tFoot.children(),
		hideFheadArr = this.hideFhead.children();
	
	this.headerTable.find('col')[colIdx].style.width = '';
	this.footerTable.find('col')[colIdx].style.width = '';
	this.bodyTable.find('col')[colIdx].style.width = '';

	var changeShowHTarget = showTheadArr.children('td:nth-child('+(colIdx+1)+')'),
		changeHideHTarget = hideTheadArr.children('td:nth-child('+(colIdx+1)+')'),
		changeBTarget = bodyArr.children('td:nth-child('+(colIdx+1)+')'),
		changeFTarget = footArr.children('td:nth-child('+(colIdx+1)+')'),
		changeHideFTarget = hideFheadArr.children('td:nth-child('+(colIdx+1)+')');

	if(this.oriWhiteSpace[colIdx])
	{
		changeShowHTarget.css('white-space', this.oriWhiteSpace[colIdx][0]||'');
		changeHideHTarget.css('white-space', this.oriWhiteSpace[colIdx][0]||'');
		changeBTarget.css('white-space', this.oriWhiteSpace[colIdx][1]||'');
		changeFTarget.css('white-space', this.oriWhiteSpace[colIdx][2]||'');
		changeHideFTarget.css('white-space', this.oriWhiteSpace[colIdx][2]||'');
		delete this.oriWhiteSpace[colIdx];
	}

	if(this.option.isColumnResize && this.resizeBars[colIdx])
	{
        this.resizeBars[colIdx].css('display', '');

        //resizeBar 위치를 갱신해준다.
        this._updateBarPos();

		// var $td = changeShowHTarget.eq(0);
		// this.resizeBars[colIdx].css('left', $td.position().left + $td.outerWidth() + 'px'); // + 2 + 'px');
		// this.resizeBars[colIdx].css('display', '');
	}
	
	return true;
};

AGrid.prototype.getColumnWidth = function(colIdx)
{
	return this.headerTable.find('col')[colIdx].getAttribute('width');
};

AGrid.prototype.setColumnWidth = function(colIdx, width, noUpdateBar)
{
	this.headerTable.find('col')[colIdx].setAttribute('width', width);
	this.footerTable.find('col')[colIdx].setAttribute('width', width);
	this.bodyTable.find('col')[colIdx].setAttribute('width', width);

    if(!noUpdateBar) this._updateBarPos()
};

AGrid.prototype.getColumnName = function(colIdx)
{
	return this.$hRowTmpl[0].children[colIdx].innerText;
};

AGrid.prototype.setColumnName = function(colIdx, name)
{
	this.$hRowTmpl[0].children[colIdx].innerText = name;
};

AGrid.prototype.getAllColumnName = function()
{
    let retArr = []
    let $tmplCells = this.$hRowTmpl.eq(0).children('td')

    $tmplCells.each((i, ele) =>
    {
        retArr.push(ele.innerText)
    })

    return retArr
};

AGrid.prototype.getAllColumnInfo = function()
{
    let totArr = [], tmpArr = null, totColArr = [], colArr,
        before = '', tmp, colSpan = 0, lastInx = this.$hRowTmpl.length - 1

    //  헤더의 구조를 2차원 배열로 구성
    //  colSpan(컬럼머지) 되어 있는 빈자리를 컬럼 이름으로 채운다. rowSpan(로우머지) 은 빈칸('') 으로
    //  |         country         |         |       [ 'country' , 'country' , 'age' ]  
    //  |-------------------------|   age   | ==>   [ 'city'    , 'town'    ,  ''   ]   <== totArr
    //  |    city    |    town    |         |

    this.$hRowTmpl.each((inx, ele1)=>
    {
        tmpArr = [], colArr = [], before = '', colSpan = 0

        $(ele1).children('td').each((i, ele2) =>
        {
            if(inx==lastInx) 
            {
                tmpArr.push(ele2.innerText)
                colArr.push(0)
            }
            else 
            {
                tmp = ele2.getAttribute('colspan')
                if(tmp) 
                {
                    colSpan = Number(tmp)
                    colArr.push(colSpan)
                }
                else colArr.push(0)

                if(ele2.innerText) before = ele2.innerText
                tmpArr.push(before)

                if(--colSpan==0) before = ''
            }
        })

        totArr.push(tmpArr)
        totColArr.push(colArr)
    })

    //console.log(totArr)
    //console.log(totColArr)

    let rootObj = { name: 'root', children: [] }, 
        xLen = totArr[0].length, yLen = totArr.length, val, curObj, newObj
        //inxArr = Array.from({ length: yLen }, () => 0) 

    //하위로 이동하면서 값이 있으면 자신의 자식 객체로 추가한다.
    for(let x=0; x<xLen; x++)
    {
        curObj = rootObj

        for(let y=0; y<yLen; y++)
        {
            val = totArr[y][x]

            if(!val) break
            else 
            {
                newObj = curObj.children.find( elem => elem.name==val )

                //이미 추가되어 있으면 기존 객체를 curObj 로 셋팅 
                if(!newObj)
                {
                    //let visible = y==0 ? !this.isHiddenColumn(inxArr[y]) : true
                    let visible = !this.isHiddenColumn(x)
                    
                    newObj = {name: val, colSpan:totColArr[y][x], oriInx:x,  isVisible: visible, children: []}
                    curObj.children.push(newObj)

                    //객체가 새로 추가되면 자신 뎁스의 인덱스를 하나 증가시키고 하위 인덱스를 초기화 한다.
                    //inxArr[y]++
                    //inxArr[y+1] = 0
                }

                curObj = newObj
            }
        }
    }

    //console.log(rootObj)

    return rootObj
};


// 열 숨기기 여부
// colIdx : number
AGrid.prototype.isHiddenColumn = function(colIdx)
{
	if(colIdx < 0 || colIdx >= this.getColumnCount()) return;
	if(this.headerTable.find('col')[colIdx].style.width == '0px') return true;
	else return;
};

// 열의 보임 여부에 따라 열을 숨기거나 보여준다.
// colIdx : number
AGrid.prototype.toggleColumn = function(colIdx)
{
	if(this.isHiddenColumn(colIdx)) this.showColumn(colIdx);
	else this.hideColumn(colIdx);
};

// 로테이트 : 특정 열 중 하나의 열만 보여주고 나머지는 돌아가며 보여준다.
// colIdxArr 의 순서대로 보여준다.
// colIdxArr : Array(number)
AGrid.prototype.setRotateColumns = function(colIdxArr)
{
	if(!colIdxArr || colIdxArr.length == 0) return;
	
	this.rotateColArr.push([colIdxArr, 0]);
	this.showColumn(colIdxArr[0]);
	for(var i=1; i<colIdxArr.length; i++)
	{
		this.hideColumn(colIdxArr[i]);
	}
};

// 로테이트 설정한 인덱스 정보로 컬럼을 전환
// setRotateColums 순번 (최초: 0) 을 입력하여 전환한다.
// index : number
AGrid.prototype.rotateColumns = function(index)
{
	var arr = this.rotateColArr[index];
	
	if(arr)
	{
		var colIdxArr = arr[0],
			showIdx = arr[1];
		this.hideColumn(colIdxArr[showIdx]);
		showIdx = (showIdx+1)%colIdxArr.length;
		this.showColumn(colIdxArr[showIdx]);
		arr[1] = showIdx;
	}
};

// 로테이트 설정한 인덱스에 해당하는 정보를 제거한다.
// index : number
AGrid.prototype.removeRotateColumns = function(index)
{
	this.rotateColArr[index] = null;
};

AGrid.prototype.decreaseColSpan = function(tdDom)
{
	var curColSpan = tdDom.getAttribute('colspan');
	
	if(curColSpan)
	{
		var newColSpan = parseInt(curColSpan, 10) - 1;
		if(newColSpan <= 1) tdDom.removeAttribute('colspan');
		else tdDom.setAttribute('colspan', newColSpan);
		return false;
	}  
	else
	{
		if(tdDom.style.display == 'none')
		{
			this.decreaseColSpan(tdDom.previousElementSibling);
		}	
		else return true;
	}
};

AGrid.prototype.insertDefaultCell = function(table, row, col, isAfter)
{
	var $newCell = $('<td></td>');
// 	this.makeDefaultCellStyle($newCell);
		
	var fromCell = table.children('tr').eq(row).children('td').eq(col);
	if(isAfter)
		fromCell.after($newCell);
	else 
		fromCell.before($newCell);
};

AGrid.prototype.insertSingleCol = function(colIndex, isAfter)
{
	// headerTable과 bodyTable의 colgroup 에 col 을 넣는다.
	_add_col_helper(this.headerTable, colIndex, isAfter);
	_add_col_helper(this.bodyTable, colIndex, isAfter);
	_add_col_helper(this.footerTable, colIndex, isAfter);

	var rowCount = this.showThead.children('tr').length, rIndex;
	for(rIndex = 0; rIndex < rowCount; ++rIndex)
	{
		this.insertDefaultCell(this.showThead, rIndex, colIndex, isAfter);
		this.insertDefaultCell(this.hideThead, rIndex, colIndex, isAfter);
		this.insertDefaultCell(this.hideFhead, rIndex, colIndex, isAfter);
	}
	
	rowCount = this.tBody.children('tr').length;
	for(rIndex = 0; rIndex < rowCount; ++rIndex)
	{
		this.insertDefaultCell(this.tBody, rIndex, colIndex, isAfter);
	}	
	
	rowCount = this.tFoot.children('tr').length;
	for(rIndex = 0; rIndex < rowCount; ++rIndex)
	{
		this.insertDefaultCell(this.tFoot, rIndex, colIndex, isAfter);
	}	
	
	
	++this.columnCount;
	
	function _add_col_helper($table, i, isAfter)
	{
		var fromCol = $table.find('colgroup').children('col').eq(i);
		var newCol = $('<col></col>');
		
		if(isAfter) fromCol.after(newCol);
		else fromCol.before(newCol);
	}
};

AGrid.prototype.insertSingleRow = function(rowIndex,isAfter,areaType)
{
	var rowHeight = 0;
	var $cell = null;

	if(areaType == 'thead')
		rowHeight = this.showThead.children('tr').attr('height');
	else if(areaType == 'tfoot')
		rowHeight = this.tFoot.children('tr').attr('height');
	else
		rowHeight = this.tBody.children('tr').attr('height');

	var row = $('<tr height = "'+rowHeight+';"></tr>');

	for(var i=0; i<this.columnCount; i++)
	{
		$cell = $('<td></td>');
		
		// 숨겨진 컬럼이 있는 경우 숨김 처리를 해준다.
		if(this.isHiddenColumn(i)) $cell.css('white-space', 'nowrap');
// 		this.makeDefaultCellStyle($cell);
		
		row.append($cell);
	}
	
	var color, colors;
	if(areaType == 'thead')
	{
		color = this.getHeadColor();
		colors = color.substring(5, color.length -1).replace(/ /gi,'').split(',');
		if(! ((colors[0] == 0) && (colors[1] == 0) && (colors[2] == 0) && (colors[3] == 0)))
			row.css('background-color', color);
		
		this.showThead.children('tr')

		const clone = row.clone();
		clone.height(0);
		if(isAfter)
		{		
			$(this.showThead.children().get(rowIndex)).after(row);
			$(this.hideThead.children().get(rowIndex)).after(clone.clone());
			$(this.hideFhead.children().get(rowIndex)).after(clone.clone());
		}
		else
		{
			$(this.showThead.children().get(rowIndex)).before(row);
			$(this.hideThead.children().get(rowIndex)).before(clone.clone());
			$(this.hideFhead.children().get(rowIndex)).before(clone.clone());
		}
	}
	else
	{
		color = this.getBodyColor();
		colors = color.substring(5, color.length -1).replace(/ /gi,'').split(',');
		if(! ((colors[0] == 0) && (colors[1] == 0) && (colors[2] == 0) && (colors[3] == 0)))
			row.css('background-color', color);
		
		var area = this.tBody;
		if(areaType == 'tfoot') area = this.tFoot;
		
		if(isAfter)
			$(area.children().get(rowIndex)).after(row);
		else
			$(area.children().get(rowIndex)).before(row);
	}

	return row[0];
};

AGrid.prototype.insertSingleFootRow = function(rowIndex,isAfter)
{
	var rowHeight = 0;
	var $cell = null;

	rowHeight = this.tFoot.children('tr').attr('height');

	var row = $('<tr height = "'+rowHeight+';"></tr>');

	for(var i=0; i<this.columnCount; i++)
	{
		$cell = $('<td></td>');
		
		// 숨겨진 컬럼이 있는 경우 숨김 처리를 해준다.
		if(this.isHiddenColumn(i)) $cell.css('white-space', 'nowrap');
// 		this.makeDefaultCellStyle($cell);
		
		row.append($cell);
	}
	
	
	var color = this.getFootColor();
	var colors = color.substring(5, color.length -1).replace(/ /gi,'').split(',');
	if(! ((colors[0] == 0) && (colors[1] == 0) && (colors[2] == 0) && (colors[3] == 0)))
		row.css('background-color', color);

	this.tFoot.children('tr')

	if(isAfter)
	{		
		$(this.tFoot.children().get(rowIndex)).after(row);
	}
	else
	{
		$(this.tFoot.children().get(rowIndex)).before(row);
	}

	return row[0];
};

/*
AGrid.prototype.makeDefaultCellStyle = function($cell)
{
	$cell.css('border', '1px solid #c2c2c2');

	if(this.isHeadCell($cell))
	{
		var index = this.getCellIndex($cell);
		
		var hideCell = this.getHideHeaderCell(index[0], index[1]);
		hideCell.css('border', '1px solid #c2c2c2');
	}
};	
*/

//로우셋 카운트 변경
AGrid.prototype.changeRowCount = function(count, isHead)
{
	var calcValue = 0;
	var thisObj = this;
	var headRowCnt = this.showThead.children().length;
	var bodyRowCnt = this.tBody.children().length;
	
	if(isHead) calcValue = count - headRowCnt
	else calcValue = count - bodyRowCnt;
	
	//로우 추가
	if(calcValue > 0)
	{
		for(let i=0; i<Math.abs(calcValue); i++)
			this.insertSingleRow(isHead?headRowCnt-1:bodyRowCnt-1, true ,isHead)			
	}
	//로우삭제
	else if(calcValue < 0)
	{
		for(let i=0; i<Math.abs(calcValue); i++)
			_removeRow_helper(isHead);			
	}
	
	function _removeRow_helper(isHead)
	{
		var pos;
		if(isHead) pos = headRowCnt-1; 
		else pos = bodyRowCnt -1;		

		let target;
		if(isHead)
		{
			target = thisObj.showThead.children().eq(pos);
			target.children('td').each(function(i){
				_decreaseRowSpan(this);	
			});
			target.remove();
			
			target = thisObj.hideThead.children().eq(pos);
			target.children('td').each(function(i){
				_decreaseRowSpan(this);	
			});
			target.remove();
			
			target = thisObj.hideFhead.children().eq(pos);
			target.children('td').each(function(i){
				_decreaseRowSpan(this);	
			});
			target.remove();
			
			headRowCnt--;
		}
		else
		{
			target = thisObj.tBody.children().eq(pos); 
			target.children('td').each(function(i){
				_decreaseRowSpan(this);	
				$(thisObj).remove();	
			});
			target.remove();
			
			bodyRowCnt--;
		}
	}
	
	function _decreaseRowSpan(tdDom)
	{
		var tdObj = $(tdDom);
		var tdIdx = tdObj.index();

		if(tdObj.attr('rowspan'))
		{
			var curRowSpan = tdObj.attr('rowspan');
			var newRowSpan = parseInt(curRowSpan, 10) - 1;
			if(newRowSpan <= 1) tdObj.removeAttr('rowspan');
			else tdObj.attr('rowspan', newRowSpan);
			return false;
		}  
		else
		{
			//if(tdObj.attr('data-span') == 'row_hide')
			if(tdDom.style.display == 'none')
			{
				var preTrIndex = tdObj.parent().prev();
				var preTd = preTrIndex.children('td').eq(tdIdx);
				if(preTd[0]) _decreaseRowSpan(preTd[0]);
			}
			else return true;	
		}
	}
};

//로우셋 카운트 변경
AGrid.prototype.changeFootRowCount = function(count)
{
	var calcValue = 0;
	var thisObj = this;
	var headRowCnt = this.showThead.children().length;
	var footRowCnt = this.tFoot.children().length;
	
	calcValue = count - footRowCnt
	
	//로우 추가
	if(calcValue > 0)
	{
		for(let i=0; i<Math.abs(calcValue); i++)
			this.insertSingleFootRow(footRowCnt-1, true);
	}
	//로우삭제
	else if(calcValue < 0)
	{
		for(let i=0; i<Math.abs(calcValue); i++)
			_removeRow_helper();			
	}
	
	function _removeRow_helper()
	{
		var pos;
		pos = footRowCnt-1; 		

		var target = thisObj.tFoot.children().eq(pos);
		target.children('td').each(function(i){
			_decreaseRowSpan(this);	
		});
		target.remove();

		footRowCnt--;
	}
	
	function _decreaseRowSpan(tdDom)
	{
		var tdObj = $(tdDom);
		var tdIdx = tdObj.index();

		if(tdObj.attr('rowspan'))
		{
			var curRowSpan = tdObj.attr('rowspan');
			var newRowSpan = parseInt(curRowSpan, 10) - 1;
			if(newRowSpan <= 1) tdObj.removeAttr('rowspan');
			else tdObj.attr('rowspan', newRowSpan);
			return false;
		}  
		else
		{
			//if(tdObj.attr('data-span') == 'row_hide')
			if(tdDom.style.display == 'none')
			{
				var preTrIndex = tdObj.parent().prev();
				var preTd = preTrIndex.children('td').eq(tdIdx);
				if(preTd[0]) _decreaseRowSpan(preTd[0]);
			}
			else return true;	
		}
	}
};

//여기까지
//-----------------------------------------------------------------------------------




//----------------------------------------------------------------
//   SCROLL AREA
//----------------------------------------------------------------
//스크롤

AGrid.prototype.getScrollPos = function()
{
	return this.scrollArea[0].scrollTop;
};

AGrid.prototype.scrollTo = function(pos)
{
	this.scrollArea[0].scrollTop = pos;
};

AGrid.prototype.scrollOffset = function(offset)
{
	this.scrollArea[0].scrollTop += offset;
};

//row or rowIndex
AGrid.prototype.scrollIntoArea = function(row, isAlignTop)
{
	if(typeof(row)=="number") row = this.getRow(row);
	
	row.scrollIntoView(isAlignTop);
};

AGrid.prototype.scrollToTop = function()
{
	//this.scrollArea[0].scrollTop = this.scrollArea[0].scrollHeight*-1;
	
	if(this.bkManager) this.bkManager.setMoveReal(true);
	
	this.scrollArea[0].scrollTop = 0;
};

AGrid.prototype.scrollToBottom = function()
{
	if(this.bkManager) this.bkManager.setMoveReal(true);
	
	this.scrollArea[0].scrollTop = this.scrollArea[0].scrollHeight;

    return this.scrollArea[0].scrollTop;

    /*
    let newTop = this.scrollArea[0].scrollHeight - this.scrollArea[0].clientHeight
    retVal = newTop - this.scrollArea[0].scrollTop
    this.scrollArea[0].scrollTop = newTop;
    */
};

AGrid.prototype.scrollToCenter = function()
{
	this.scrollArea[0].scrollTop = (this.scrollArea[0].scrollHeight - this.element.offsetHeight)/2;
};

AGrid.prototype.saveScrollPos = function()
{
	this.savedScrollPos = this.scrollArea[0].scrollTop;
};

AGrid.prototype.restoreScrollPos = function()
{
	if(this.savedScrollPos!=-1) 
	{
		this.scrollArea[0].scrollTop = this.savedScrollPos;
		this.savedScrollPos = -1;
	}
};

AGrid.prototype.isScrollTop = function()
{
	return (this.scrollArea[0].scrollTop == 0);
};

AGrid.prototype.isScrollBottom = function()
{
	var scrlEle = this.scrollArea[0];
	return (scrlEle.scrollHeight-scrlEle.clientHeight-scrlEle.scrollTop == 1);
};

AGrid.prototype.isMoreScrollTop = function()
{
	return (this.scrollArea[0].scrollTop > 0);
};

AGrid.prototype.isMoreScrollBottom = function()
{
	var scrlEle = this.scrollArea[0];
	return (scrlEle.scrollHeight-scrlEle.clientHeight-scrlEle.scrollTop > 1);
};

AGrid.prototype.isScroll = function()
{
    return (this.scrollArea[0].offsetHeight < this.scrollArea[0].scrollHeight);
};

AGrid.prototype.setRow = function(row, rowData, start, end)
{
	if(typeof(row)=="number") row = this.getRow(row);
	//var $row = $(this.getRow(row));
	
	var $row = $(row);
	var $cells = $row.children();
	
	if(start==undefined) 
	{
		start = 0; 
		end = $cells.length;
	}
	
	for(var i=start; i<end; i++)
	{
		$cells.get(i).textContent = rowData[i];
	}
	
	return $row;
};




///////////////////////////////////////////////////////////////////////
//
//	private area
//
///////////////////////////////////////////////////////////////////////


//rowSet 객체를 리턴한다.
AGrid.prototype.createRow = function(rowData)
{
	var $rowSet = null;
	
	//템플릿이 있으면 복제하여 사용
	if(this.$rowTmpl)
	{
		var idx = 0, $cell, $colSet, cellData, thisObj = this, $tmplCells; 
		
		$rowSet = this.$rowTmpl.clone();	//<tr></tr> <tr></tr> ...
		
		$rowSet.each(function(i)
		{
			$colSet = $(this).children('td');	//<td><td> ...
			
			//$tmplCells = thisObj.$rowTmpl.eq(i).children('td');
			$tmplCells = thisObj.$tmplTds[i];
			
			$colSet.each(function(j)
			{
				$cell = $(this);
				
				//if(!$cell.attr('data-span')) 
				if(this.style.display != 'none')
				{
					cellData = rowData[idx];
					
					//템플릿의 data mask 객체를 셋팅한다.
					this.dm = $tmplCells[j].dm;
					
					if(rowData.length>idx)
					{
						if(this.dm) cellData = this.dm.mask(cellData, this);
						
						if(cellData && cellData.element)
						{	
							$cell.append(cellData.element);
							this.data = cellData;
						}
						else if(cellData != undefined) $cell.html(cellData);
						//else $cell.html(cellData);
						
						//$cell.text(cellData);
					}
					
					//if(thisObj.shrinkInfo) $cell.autoShrink(thisObj.shrinkInfo[idx]);
					//템플릿의 shrinkInfo 객체를 셋팅한다.
					if($tmplCells[j].shrinkInfo)
					{
						this.shrinkInfo = $tmplCells[j].shrinkInfo;
						$cell.autoShrink(this.shrinkInfo);
					}
					
					idx++;
				}
			});
		
		});
		
	}
	
	return $rowSet;
};


/*
AGrid.prototype.checkAutoShrink = function(col, cell)
{
	var info = this.shrinkInfo[col];
	if(info)
	{
		var txt = cell.text();
		var len = (info.maxChar-txt.length)/txt.length;

		//afc.log(len);
		if(len<0)
		{
			//afc.log((info.fontSize+info.fontSize*len));
			cell.css('font-size', (info.fontSize+info.fontSize*len)+'px');
		}
	}
};
*/

//스크롤바 존재 여부에 따라 headerTable 의 사이즈를 조정한다.
AGrid.prototype.checkScrollbar = function(isAdd)
{
/*
	if(!this.isCheckScrl) return;
	if(this.scrlIndicator)
	{
		this.scrlIndicator.update();
		return;
	}
	
   //add 인 경우는 스크롤바가 안 보이는 경우만 체크하고
    //remove 인 경우는 스크롤바가 보이는 경우만 체크한다. 
    if(isAdd!=this.isScrollVisible)
    {
        this.isScrollVisible = this.scrollArea.hasScrollBar(); 
        if(isAdd==this.isScrollVisible) 
		{
			var add = afc.scrlWidth*isAdd;
			this.headerTable[0].style.width = 'calc(100% - ' + add + 'px)';
		}
    }
	*/
};

AGrid.prototype.setRealMap = function(realField)
{
	this.realField = realField;
	// this.realMap = null; 일 경우 addPattern 이 호출되기 전에 리얼이 수신되는 경우도 있다.
	this.realMap = {};
};

AGrid.prototype.getRealKey = function(data)
{
	return data[this.realField];
};

AGrid.prototype.setData = function(dataArr)
{
	if(!dataArr || !dataArr[0]) return;
	//this.removeAll();

	var data, row, arr, i, keyArr;
	
	data = dataArr[0];
	if(data && Object.prototype.toString.call(data) == '[object Array]')
	{
		keyArr = Object.keys(data);
	}
	else
	{
		keyArr = this.nameKeyArr;
		if(keyArr.length == 0) keyArr = Object.keys(data);
	}
	
	this.setQueryData(dataArr, keyArr, {});
};

// getQueryData 처럼 해야할지 getDataByOption 을 이용해야할지
AGrid.prototype.getData = function(dataArr, keyArr)
{
	//getQueryData에서 getData를 사용할 수 있을지 테스트 필요
	var rowTmplCount = this.$rowTmpl.length,
		rowsetCount = this.getRowCount() / rowTmplCount,
		columnCount = this.getColumnCount(),
		rowsetIndex, colIndex, keyVal, rowIndex, idx, cell, cellData,
		newFunc = _new_object;
		
	if(!keyArr) keyArr = this.nameKeyArr;
	
	if(!dataArr) dataArr = [];
	
	if(keyArr.length==0)
	{
		keyArr = [];
		for(i=0; i<this.$rowTmpl.children().length; i++) keyArr[i] = i;
		newFunc = _new_array;
	}
	
	for(var i=0; i<rowsetCount; i++)
	{
		rowsetIndex = i * rowTmplCount;
		idx = 0;

		for(var j=0; j<keyArr.length; j++)
		{
			keyVal = keyArr[j];
			rowIndex = parseInt(idx/columnCount);
			colIndex = idx % columnCount;
			cell = this.getCell(rowsetIndex + rowIndex, colIndex);

			// cell 이 merge된 셀이면 넘어간다.
			if(cell.style.display == 'none')
			{
				idx++;
				j--;
				continue;
			}

			if(keyVal)
			{
				// 만약 셀에 데이터가 있는 경우 매핑을 데이터로 해야할지?
				if(!dataArr[i]) dataArr[i] = newFunc();
				dataArr[i][keyVal] = this.getCellText(rowsetIndex + rowIndex, colIndex);
			}
			idx++;
		}
	}
	
	return dataArr;
	
	function _new_array(){ return []; }
	function _new_object(){ return {}; }
};

AGrid.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	if(this.option.isClearRowTmpl)
	{
		if(queryData.isReal) 
		{
			//asoocool 2019/4/19
			//복수의 realType 을 지정하기 위해 AQuery 쪽으로 옮김
			var realType = queryData.getRealType(this);
			
			//기존 버전도 동작하도록, 차후에 제거하도록
			if(realType==undefined) realType = this.updateType;
			
			this.doRealPattern(dataArr, keyArr, queryData, realType);
		}
		else this.doAddPattern(dataArr, keyArr, queryData);
	}
	else this.doUpdatePattern(dataArr, keyArr, queryData);
};

//rowSet 즉 멀티로우에 대한 리얼 처리가 안되어 있음.
//row = this.realMap[this.getRealKey(data)]; 이 부분에서 row.each 를 실행해 처리할 필요가 있음.
//realType : -1/prepend, 0/update, 1/append, 2/delete
AGrid.prototype.doRealPattern = function(dataArr, keyArr, queryData, realType)
{
	var data, row, keyVal, arr, rowArr, idx, cell, cellData, i, j;
	
	data = dataArr[0];
	//dataObj = AQueryData.getDataKeyObj(data.key);

	//update
	if(realType==0)
	{
		//row = this.realMap[this.getRealKey(data)];
		rowArr = this.realMap[this.getRealKey(data)];
		
		if(!rowArr) return;
		
		for(i=0; i<rowArr.length; i++)
		{
			row = rowArr[i];
			
			idx = 0;
			
			for(j=0; j<keyArr.length; j++)
			{
				keyVal = keyArr[j];
				cell = this.getCell(row, idx);

				//if(!cell) continue;

				//if(cell.getAttribute('data-span'))
				if(cell.style.display == 'none')
				{
					idx++;
					j--;
					continue;
				}

				if(keyVal)
				{
					/*
					//ret = this.getMaskValue(j, dataObj, keyVal, cell);
					//if(ret) this.setCellText(row, idx, ret);

					//this.setCellText(row, idx, dataObj[keyVal]);

					if(cell.dm) cell.dm.setQueryData(data, keyArr, queryData);

					this.setCellText(row, idx, data[keyVal]);
					*/

					cellData = data[keyVal];

					if(cell.dm)
					{
						cellData = cell.dm.mask(cellData, cell);
					}

					if(cellData != undefined) cell.innerHTML = cellData;

					if(cell.shrinkInfo) AUtil.autoShrink(cell, cell.shrinkInfo);				
				}

				idx++;
			}		
		}
	}
	
	else if(realType==2)
	{
		//row = this.realMap[this.getRealKey(data)];
		rowArr = this.realMap[this.getRealKey(data)];
		
		if(!rowArr) return;
		
		for(i=0; i<rowArr.length; i++)
		{
			this.removeRow(rowArr[i]);
		}
	}
	
	//insert
	else
	{
		arr = new Array(keyArr.length);
		for(j=0; j<keyArr.length; j++)
		{
			keyVal = keyArr[j];

			//if(keyVal) arr[j] = this.getMaskValue(j, dataObj, keyVal);
			//if(keyVal) arr[j] = dataObj[keyVal];
			if(keyVal) arr[j] = data[keyVal];
			//else arr[j] = '';
		}
		
		/*this.$rowTmpl.find('td').each(function()
		{
			if(this.dm) this.dm.setQueryData(data, keyArr, queryData);
		});*/

		//prepend
		if(realType==-1) row = this.prependRow(arr, data.row_data);
		//append
		else if(realType==1) row = this.addRow(arr, data.row_data);
		
		//asoocool 2019/4/19
		//리얼맵이 활성화 되어 있으면 추가 시점에 리얼맵을 셋팅해 준다.
		if(this.realField!=null) 
		{
			//if(!this.realMap[data.key]) this.realMap[data.key] = row;
			
			//this.realMap[this.getRealKey(data)] = row;
			
			rowArr = this.realMap[this.getRealKey(data)];
			
			if(!rowArr) rowArr = this.realMap[this.getRealKey(data)] = [];
			
			rowArr.push(row);
			
		}
	}

	/** 프로젝트에서 테스트 후 추가예정
	//푸터 데이터 추가
	if(!this.option.isHideFooter)
	{
		this.tFoot.children().each(function(i){
			$colSet = $(this).children('td');
			$colSet.each(function(j){
				$cell = $(this);

				if(this.style.display != 'none')
				{
					keyVal = keyArr[idx];
					if(keyVal)
					{
						cellData = data[keyVal];
						if(this.dm)
						{
							cellData = this.dm.mask(cellData, this);
						}
						if(cellData && cellData.element)
						{
							$cell.append(cellData.element);
							this.data = cellData;
						}
						else if(cellData != undefined) $cell.html(cellData);
					}
					idx++;
				}
			});
		});
	}
	*/
};

AGrid.prototype.doAddPattern = function(dataArr, keyArr, queryData)
{
	var data, row, keyVal, arr, i, j, rowArr;
	
	//조회하는 경우 기존의 맵 정보를 지운다.
	if(this.realField!=null) this.realMap = {};
	
	for(i=0; i<dataArr.length; i++)
	{
		data = dataArr[i];

		const bodyLength = this.$rowTmpl.children().length;
		const footLength = this.$fRowTmpl.children().length;
		arr = new Array(bodyLength);
		footArr = new Array(footLength);
		let isOnlyFoot = true;

		for(j=0; j<keyArr.length; j++)
		{
			keyVal = keyArr[j];
			if(keyVal)
			{
				if(j < bodyLength)
				{
					isOnlyFoot = false;
					arr[j] = data[keyVal];
				}
				else
				{
					footArr[j - bodyLength] = data[keyVal];
				}
			}
		}

		if(window.ADataMask) ADataMask.setQueryData(data, keyArr, dataArr);

/*
		row = this.addRow(arr);
		if(data.row_data) this.setCellData(row, 0, data.row_data);
*/
		//addRow 함수에 로우를 추가하면서 데이터 셋팅하는 기능 추가됐음.
		//queryData 에 row_data 란 필드를 추가하고 값을 셋팅하면 추가됨.
		if(!isOnlyFoot)
		{
			row = this.addRow(arr, data.row_data);

			//리얼맵이 활성화 되어 있으면 조회 시점에 리얼맵을 만든다.
			if(this.realField!=null) 
			{
				//if(!this.realMap[data.key]) this.realMap[data.key] = row;

				//this.realMap[this.getRealKey(data)] = row;

				rowArr = this.realMap[this.getRealKey(data)];

				if(!rowArr) rowArr = this.realMap[this.getRealKey(data)] = [];

				rowArr.push(row);
			}
		}

		//푸터 데이터 추가
		if(!this.option.isHideFooter)
		{
			let $colSet, $cell, idx = 0, cellData;
			this.tFoot.children().each(function(i){
				$colSet = $(this).children('td');
				$colSet.each(function(j){
					$cell = $(this);

					if(this.style.display != 'none')
					{
						cellData = footArr[idx];
						if(this.dm)
						{
							cellData = this.dm.mask(cellData, this);
						}
						if(cellData && cellData.element)
						{
							$cell.append(cellData.element);
							this.data = cellData;
						}
						else if(cellData != undefined) $cell.html(cellData);
						idx++;
					}
				});
			});
		}
	}

	//내부에서 자체적으로 호출되는 것으로 변경
	//if(this.bkManager) this.bkManager.applyBackupScroll();
};
/*
//조회시 단건 데이터의 업데이트, fixed grid 에서 사용함.
AGrid.prototype.doUpdatePattern = function(dataArr, keyArr, queryData)
{
	if(!dataArr || dataArr.length == 0) return;

	var $rowSet = this.getRowSet(0), $colSet, $cell, cellData, thisObj = this,
		data, rowData, keyVal, idx = 0;
		
	data = dataArr[0];
		
	rowData = new Array(keyArr.length);

	for(var k=0; k<keyArr.length; k++)
	{
		keyVal = keyArr[k];

		if(keyVal) rowData[k] = data[keyVal];
		//else rowData[k] = '';
	}
	
	
	$rowSet.each(function(i)
	{
		$colSet = $(this).children('td');	//<td><td> ...

		var $tmplCells = thisObj.$rowTmpl.eq(i).children('td');
			
		$colSet.each(function(j)
		{
			$cell = $(this);
				
			//if(!$cell.attr('data-span'))
			if(this.style.display != 'none')
			{
				cellData = rowData[idx];
					
				//템플릿의 data mask 객체를 셋팅한다.
				this.dm = $tmplCells[j].dm;
					
				if(this.dm)
				{
					// clearRowTmpl 은 ele 를 다시 지정할 필요가 있는지 판단 필요
					//this.dm.ele = this;
					cellData = this.dm.mask(cellData, this);
				}
					
				if(rowData.length>idx)
				{
					if(typeof cellData == 'object')
					{	
						$cell.append(cellData.element);
						this.data = cellData;
					}
					else if(cellData != undefined) $cell.html(cellData);
				}
				
				//if(thisObj.shrinkInfo) $cell.autoShrink(thisObj.shrinkInfo[idx]);
				if(this.shrinkInfo) $cell.autoShrink(this.shrinkInfo);
				
				idx++;
			}
		});
	});	

};
*/
//조회시 단건 데이터의 업데이트, fixed grid 에서 사용함.
AGrid.prototype.doUpdatePattern = function(dataArr, keyArr, queryData)
{
	if(!dataArr || dataArr.length == 0) return;

	var $rowSet = this.getRowSet(0), $colSet, $cell, cellData, thisObj = this,
		data, keyVal, idx = 0;
		
	data = dataArr[0];
	
	$rowSet.each(function(i)
	{
		$colSet = $(this).children('td');	//<td><td> ...

		var $tmplCells = thisObj.$rowTmpl.eq(i).children('td');
			
		$colSet.each(function(j)
		{
			$cell = $(this);
				
			//if(!$cell.attr('data-span'))
			if(this.style.display != 'none')
			{
				keyVal = keyArr[idx];
				if(keyVal)
				{
					cellData = data[keyVal];

					//템플릿의 data mask 객체를 셋팅한다.
					this.dm = $tmplCells[j].dm;

					if(this.dm)
					{
						// clearRowTmpl 은 ele 를 다시 지정할 필요가 있는지 판단 필요
						//this.dm.ele = this;
						cellData = this.dm.mask(cellData, this);
					}

					//if(rowData.length>idx)
					{
						if(cellData && cellData.element)
						{	
							$cell.append(cellData.element);
							this.data = cellData;
						}
						else if(cellData != undefined) $cell.html(cellData);
					}

					//if(thisObj.shrinkInfo) $cell.autoShrink(thisObj.shrinkInfo[idx]);
					if(this.shrinkInfo) $cell.autoShrink(this.shrinkInfo);
				}
				idx++;
			}
		});
	});

	//푸터 데이터 추가
	if(!this.option.isHideFooter)
	{
		this.tFoot.children().each(function(i){
			$colSet = $(this).children('td');
			$colSet.each(function(j){
				$cell = $(this);

				if(this.style.display != 'none')
				{
					keyVal = keyArr[idx];
					if(keyVal)
					{
						cellData = data[keyVal];
						if(this.dm)
						{
							cellData = this.dm.mask(cellData, this);
						}
						if(cellData && cellData.element)
						{
							$cell.append(cellData.element);
							this.data = cellData;
						}
						else if(cellData != undefined) $cell.html(cellData);
					}
					idx++;
				}
			});
		});
	}
};

// 백업 관련 처리는 되어있지 않음
AGrid.prototype.getQueryData = function(dataArr, keyArr)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length == 0) return;

	var rowTmplCount = this.$rowTmpl.length,
		rowsetCount = this.getRowCount() / rowTmplCount,
		columnCount = this.getColumnCount(),
		rowsetIndex, colIndex, keyVal, rowIndex, idx, cell, cellData;
	
	for(var i=0; i<rowsetCount; i++)
	{
		rowsetIndex = i * rowTmplCount;
		idx = 0;

		for(var j=0; j<keyArr.length; j++)
		{
			keyVal = keyArr[j];
			rowIndex = parseInt(idx/columnCount);
			colIndex = idx % columnCount;
			cell = this.getCell(rowsetIndex + rowIndex, colIndex);

			// cell 이 merge된 셀이면 넘어간다.
			if(cell.style.display == 'none')
			{
				idx++;
				j--;
				continue;
			}

			if(keyVal)
			{
				// 만약 셀에 데이터가 있는 경우 매핑을 데이터로 해야할지?
				if(!dataArr[i]) dataArr[i] = {};
				dataArr[i][keyVal] = this.getCellText(rowsetIndex + rowIndex, colIndex);
			}
			idx++;
		}
	}
};

AGrid.prototype.createBackup = function(maxRow, restoreCount)
{
	if(afc.isIos) return;
	
	if(!window['BackupManager']) return;
	
	//if(this.bkManager) return;//this.bkManager.destroy();
	
	this.destroyBackup();

	this.bkManager = new BackupManager();
	this.bkManager.create(this, maxRow, restoreCount);
	this.bkManager.setBackupInfo(this.rowTmplHeight, this.$rowTmpl.length, this.scrollArea[0], this.tBody);
	
	//we don't use grid scroll in PivotGridView
	if(this.scrollArea) this.aevent._scroll();
	
	//ios must enable scrollManager in backup
	if(afc.isIos) this.enableScrlManager();
};

AGrid.prototype.destroyBackup = function()
{
	if(this.bkManager)
	{
		this.bkManager.destroy();
		this.bkManager = null;
	}
};

//추가되는 순간 화면에 표시되지 않고 바로 백업되도록 한다. append 인 경우만 유효
AGrid.prototype.setDirectBackup = function(isDirect)
{
	this.directBackup = isDirect;
};

//-----------------------------------------------------
//	BackupManager delegate function

AGrid.prototype.getTopItem = function()
{
	return this.getFirstRow();
};

AGrid.prototype.getBottomItem = function()
{
	return this.getLastRow();
};

AGrid.prototype.getTotalCount = function()
{
	return this.getRowCount();
};


//--------------------------------------------------------------

//	현재 스타일을 객체로 반환한다.
AGrid.prototype.getCompStyleObj = function()
{
	//	getDefinedStyle 함수는 AUtil에서 만든 함수
	var obj = {}, ele = this.get$ele();
	obj.main = ele.getDefinedStyle();
	obj.thead = ele.find('thead').eq(0).getDefinedStyle();
	obj.td = ele.find('td').eq(0).getDefinedStyle();
	obj.select = ele.find('.agrid_select').eq(0).getDefinedStyle();
	
	return obj;
};

//	스타일을 다른 컴포넌트의 스타일로 변경한다.
AGrid.prototype.setCompStyleObj = function(obj)
{
	var p, ele = this.get$ele();
	for(p in obj.main) this.setStyle(p, obj.main[p]);
	for(p in obj.thead) this.showThead.css(p, obj.thead[p]);
	for(p in obj.td) ele.find('td').eq(0).css(p, obj.td[p]);
	for(p in obj.select) ele.find('.agrid_select').eq(0).css(p, obj.select[p]);
};


//cell이 tHead인지 tBody인지 판단
AGrid.prototype.getRowParentTag = function(cell)
{
	cell = $(cell);
	var parentTagStr = '';
	var parentDom = cell.parent().parent()[0];
	if(parentDom) parentTagStr = parentDom.tagName.toLowerCase();
	return parentTagStr;
};

AGrid.prototype.getCellPos = function(cell)
{
    return [this.rowIndexOfCell(cell), this.colIndexOfCell(cell)];
};

// 매핑가능한 개수를 리턴한다.
AGrid.prototype.getMappingCount = function()
{
	var thisObj = this, arr = [];
	/*for(var i=0; i<this.getRowCount(); i++)
	{
		for(var j=0; j<this.getColumnCount(); j++)
		{
			//if( !$(this.getCell(i, j)).attr('data-span') ) arr.push((i+1)+'-'+(j+1));
			if( this.getCell(i, j).style.display != 'none' ) arr.push((i+1)+'-'+(j+1));
		}
	}*/
	
	//runtime 에도 매핑정보를 가져오고 싶은 경우를 위해 $rowTmpl 에서 매핑정보 추출
	this.$rowTmpl.each(function(i)
	{
		$(this).children().each(function(j)
		{
			if(this.style.display != 'none') arr.push((i+1)+'-'+(j+1));
		});
	});
	
	//풋터 매핑 추가
	if(!this.option.isHideFooter)
	{
		this.tFoot.children().each(function(i)
		{
			$(this).children().each(function(j)
			{
				if(this.style.display != 'none') arr.push('f' + (i+1)+'-'+(j+1));
			});
		});
	}
	
	return arr;
};

//----------------------------------------------
//	merge row

AGrid.prototype.mergeHeadRow = function(row, col, span)
{
	this._mergeRow(row, col, span, this.showThead.children());
	this._mergeRow(row, col, span, this.hideThead.children());
	this._mergeRow(row, col, span, this.hideFhead.children());
};


AGrid.prototype.mergeRow = function(row, col, span)
{
	this._mergeRow(row, col, span, this.tBody.children() );
};

AGrid.prototype.mergeFootRow = function(row, col, span)
{
	this._mergeRow(row, col, span, this.tFoot.children());
};

AGrid.prototype._mergeRow = function (row, col, span, $rowEles)
{
	var start = row + 1;
	var end = start + span -1;
	
	var totalSpan = span;
	
	var $row = $rowEles.eq(row),
		startCol = $row.children().eq(col), curCol;
	
	for(var index = start; index < end; ++index)
	{
		curCol = $rowEles.eq(index).children().eq(col);
		
		if(index == end-1)
		{
			var addSpan = curCol.attr('rowspan');
			if(typeof addSpan != 'undefined')
				totalSpan += (addSpan -1);
		}
		
		startCol.append(curCol.children());
		
		curCol.removeAttr('rowspan');
		curCol.removeAttr('colspan');
		curCol.hide();
	}

  startCol.attr('rowspan', totalSpan); //add ukmani100	
};

//----------------------------------------------
//	merge column

AGrid.prototype.mergeHeadCol = function(row, col, span)
{
	this._mergeCol(this.showThead.children().get(row), col, span);
	this._mergeCol(this.hideThead.children().get(row), col, span);
	this._mergeCol(this.hideFhead.children().get(row), col, span);
};

AGrid.prototype.mergeCol = function(row, col, span)
{
	this._mergeCol(this.getRow(row), col, span);
};

AGrid.prototype.mergeFootCol = function(row, col, span)
{
	this._mergeCol(this.tFoot.children().get(row), col, span);
};

AGrid.prototype._mergeCol = function(rowEle, colInx, span)
{
	var $row = $(rowEle);

	// colspan td 다음부터(+1) 
	var start = colInx + 1; 
	var end = start + span-1;
	var totalSpan = span;
	
	var startCol = $row.children().eq(colInx);
		
	for(var index = start; index < end; ++index)
	{
		var curCol = $row.children().eq(index);
		// 마지막 col 에 colspan 존재하면 이를 더해야 함.
		// 중간의 colspan 은 이미 param 에 합쳐진 수치이므로 걍 attr 만 지우면 됨.		
		if(index == end -1)
		{
			var addSpan = curCol.attr('colspan');
			if(typeof addSpan != 'undefined')
				totalSpan += (addSpan-1);
		}
		
		startCol.append(curCol.children());
		
		curCol.removeAttr('rowspan');
		curCol.removeAttr('colspan');
		curCol.hide();
	}
	startCol.attr('colspan', totalSpan); //add ukmani100
};



//----------------------------------------------
//	split column


AGrid.prototype.splitHeadCell = function(row,col)
{
	this._splitCell(row, col, this.showThead.children().eq(row).children().get(col));	
	this._splitCell(row, col, this.hideThead.children().eq(row).children().get(col));
	this._splitCell(row, col, this.hideFhead.children().eq(row).children().get(col));
};

AGrid.prototype.splitCell = function(row, col)
{
	this._splitCell(row, col, this.getCell(row,col));	
};

AGrid.prototype.splitFootCell = function(row,col)
{
	this._splitCell(row, col, this.tFoot.children().eq(row).children().get(col));	
};

// merge 된 cell 의 row, col 을 전부 분리.
AGrid.prototype._splitCell = function(row, col, cellEle)
{	
	var $td = $(cellEle);
	
	var rowSpanCount = $td.attr('rowspan');
	if(rowSpanCount == undefined) rowSpanCount = 1;
		
	var colSpanCount = $td.attr('colspan');
	if(colSpanCount == undefined) colSpanCount = 1;
	
	//정수형으로 만들기 위해 
	var rStart = Number(row);
	var rEnd = rStart + Number(rowSpanCount);
		
	var cStart = Number(col);
	var cEnd = cStart + Number(colSpanCount);

	var $parent = $td.parent().parent();
	var $tr, $curTd;
	for(var rIndex = rStart; rIndex < rEnd; ++rIndex)
	{
		$tr = $parent.children().eq(rIndex);
		for(var cIndex = cStart; cIndex < cEnd; ++cIndex)
		{
			$curTd = $tr.children().eq(cIndex);
			$curTd.show();
		}
	}
		
	$td.removeAttr('rowspan');
	$td.removeAttr('colspan');
};

AGrid.prototype.splitRow = function(row, col)
{
	var $row = $(this.getRow(row));
	
	$row.children().eq(col).removeAttr('rowspan'); //add ukmani100
};

AGrid.prototype.splitCol = function(row, col)
{
	var $row = $(this.getRow(row));
	
	$row.children().eq(col).removeAttr('colspan'); //add ukmani100
};

AGrid.prototype.showGridMsg = function(isShow, msg)
{
	if(isShow)
	{
		var $msg = $('<p>no data</p>');
		$msg.css(
		{
			'float': 'left',
			width: '100%',
			'line-height': '150px',
			'text-align': 'center',
		});

		this.scrollArea.append($msg);
	}
	else
	{
		this.scrollArea.find('p').remove();
	}

};

AGrid.prototype._getDataStyleObj = function()
{
	var ret = AComponent.prototype._getDataStyleObj.call(this);
	
	var keyArr = ['data-select-class', 'data-style-header', 'data-style-body'], val;
	
	for(var i=0; i<keyArr.length; i++)
	{
		if(i==1) val = this.$ele.find('thead').attr(keyArr[i]);
		else if(i==2) val = this.$ele.find('tbody').attr(keyArr[i]);
		else val = this.getAttr(keyArr[i]);	//data-select-class

		//attr value 에 null 이나 undefined 가 들어가지 않도록
		ret[keyArr[i]] = val ? val : '';
	}
	
	return ret;
};

// object 형식의 css class 값을 컴포넌트에 셋팅한다.
// default style 값만 셋팅한다.
AGrid.prototype._setDataStyleObj = function(styleObj)
{
	for(var p in styleObj)
	{
		if(p==afc.ATTR_STYLE) this._set_class_helper(this.$ele, null, styleObj, p);	//화면에 바로 적용
		else if(p=='data-style-header') this._set_class_helper(this.$ele.find('thead'), null, styleObj, p);	//화면에 바로 적용
		else if(p=='data-style-body') this._set_class_helper(this.$ele.find('tbody'), null, styleObj, p);	//화면에 바로 적용
		else this.setAttr(p, styleObj[p]);	//data-select-class, attr 값만 셋팅
	}
};

AGrid.prototype.updatePosition = function(pWidth, pHeight)
{
	AComponent.prototype.updatePosition.call(this, pWidth, pHeight);

	//무조건 체크되도록 현재 상태의 반대값을 넣어준다.
	if(afc.isPC) this.checkScrollbar(!this.isScrollVisible);	
	
	//헤더가 있고 리사이저블인 경우에만 bar를 업데이트 한다.
	if(!this.option.isHideHeader) this._updateBarPos();
};

AGrid.prototype.setSortFunc = function(func)
{
	if(typeof(func) == 'string')
	{
		if(func == 'numeric')
		{
			this.sortFunc = function(x, y, isAsc){
				x = Number(x);
				y = Number(y);
				return isAsc?(x > y):(x < y);
			};
		}
		else //if(func == 'alphabet')
		{
			this.sortFunc = function(x, y, isAsc){ return isAsc?(x > y):(x < y); };
		}
	}
	else
	{
		this.sortFunc = func;	
	}
};

//colInx : 정렬하려고 하는 컬럼 인덱스
//isAsc : 오름차순 여부, false 이면 내림차순
AGrid.prototype.sortColumn = function(colInx, isAsc)
{
	var tbody, i, j, x, y,
		rsLen = 1,//this.$rowTmpl.length,
        rowCnt = this.getRowCount(),
		colCnt = this.getColumnCount(),
		plusRowIndex = 0,// = parseInt(colInx/colCnt),
		sortText = '',
		cell, isSorted = true;
	
	if(typeof(colInx) != "number")
	{
		if(this.isHeadCell(colInx))
		{
			var $row = $(colInx).parent();
			var rIdx = $row.parent().children().index($row);
			if(rIdx < 0) rIdx = 0;

			colInx = this.getColumnCount()*rIdx + $row.children().index(colInx);
		}
		else return;
	}
	
	if(this.$hRowTmpl.length == this.$rowTmpl.length)
	{
		rsLen = this.$rowTmpl.length;
		plusRowIndex = parseInt(colInx/colCnt);
	}
	
	// 이전 정렬 정보 초기화 ▲, ▼
	if(this.sortColumnIndex != colInx)
	{
		//not sorted by sort func
		isSorted = false;
		if(this.sortImg)
		{
			this.sortImg.remove();
			this.sortImg = null;
		}
		
		if(isAsc == undefined) isAsc = true;
	}
	else
	{
		if(isAsc == undefined)
		{
			if(this.sortImg.attr('src').indexOf('down') > -1) isAsc = true;
			else isAsc = false;
		}
	}
	
	// 정렬 정보와 정렬 위치 저장
	// 초기화인 경우 정렬 위치를 제거한다.
	this.sortState = isAsc;
	this.sortColumnIndex = colInx;//isAsc==undefined?isAsc:colInx;
	
	// 실제 컬럼 위치로 변경
	colInx = colInx%colCnt;
	
	sortText = isAsc==true?'sort_up':'sort_down'; //isAsc==true? ' ▲': ' ▼';
	if(this.sortImg) this.sortImg.attr('src', 'Framework/afc/image/' + sortText + '.png');
	else
	{
		cell = this.getHeaderCell(plusRowIndex, colInx%colCnt);
		this.sortImg = $('<img src="Framework/afc/image/' + sortText + '.png" style="vertical-align: middle; margin-left: 5px; margin-right: -21px"></img>');
		$(cell).append(this.sortImg);
	}
	
	tbody = this.tBody[0];
	switching = true;

    var trArr = [].concat(...tbody.children);
	if(!isSorted) {
		// If the data is not sorted by the sort function, check if the data is sorted.
		isSorted = true;
		var alreadySorted = true;
		var _sortResult;
		for (i = 0; i <rowCnt-rsLen; i=i+rsLen) 
		{
			x = _get_text_helper(trArr[i+plusRowIndex].children[colInx]);
			y = _get_text_helper(trArr[i+rsLen+plusRowIndex].children[colInx]);
			
			_sortResult = this.sortFunc(x, y, isAsc);

			//정렬하려는 반대로 정렬되어있는지 체크하기 위해 !isAsc 로 체크
			if(isSorted && !_sortResult) {
				isSorted = false;
			}
			
			//현재 원하는 정렬상태인지 체크하기 위해 isAsc 로 체크
			if(alreadySorted && _sortResult) {
				alreadySorted = false;
			}

			if(!isSorted && !alreadySorted) break;
		}

		//이미 원하는 정렬상태인 경우 리턴처리
		if(alreadySorted) return;
	}

	tbody.style.visibility = 'hidden';
	if(isSorted) {
		//기존에 이미 정렬되었거나 이미 정렬된 상태인 경우 reverse 처리만 한다.
		for (i=rowCnt-rsLen-1; i>-1; i=i-rsLen) {
			for(j=0; j<rsLen; j++) tbody.append(trArr[i+j]);
            trArr.push(...trArr.splice(i, rsLen));
		}
	} else {
		for (let i=rsLen; i<rowCnt; i++) {
			y = _get_text_helper(trArr[i+plusRowIndex].children[colInx]);
			let j = i-rsLen;
			while (j > -rsLen && this.sortFunc(_get_text_helper(trArr[j+plusRowIndex].children[colInx]), y, isAsc)) {
				j -= rsLen;
			}

			if(j == i-rsLen) continue;
			j += rsLen;
			let standardRow = trArr[j];
            
			for(var k=0; k<rsLen; k++)
				tbody.insertBefore(trArr[i+k], standardRow);
            trArr.splice(j, 0, ...trArr.splice(i, rsLen));
		}
	}
	
	tbody.style.visibility = '';

    function _get_text_helper(cell) {
        var ret;
        if(cell.dm) ret = cell.dm.unmask(cell);
		else ret = cell.textContent;

        var tmp = Number(ret);
        if(!isNaN(tmp)) ret = tmp;
        return ret;
    }
};

//AGrid 의 enableScrlManager 가 호출 되어졌고 스크롤 가능 영역에 추가되어져 있을 경우
//그리드 스크롤이 끝나고(ex, scrollBottom) 상위 스크롤이 연속적으로 발생되도록 하려면
//상위 스크롤은 enableScrlManager 가 호출되어져야 하고 자신은 overscrollBehavior 함수를 호출해야 한다.
AGrid.prototype.overscrollBehavior = function(disableScrlManager)
{
	if(!this.scrlManager) return;

	var thisObj = this, oldScrollTop, 
		scrlArea = this.scrollArea[0], startY = 0, isTouchLeave = false, isRemove = true;

	//touch start
	AEvent.bindEvent(this.element, AEvent.ACTION_DOWN, function(e)
	{
		if(isRemove)
		{
			isRemove = false;
			
			thisObj.scrlManager.addDisableManager(disableScrlManager);
		}
		
		oldScrollTop = scrlArea.scrollTop;
		
		startY = e.changedTouches[0].clientY;
		
		isTouchLeave = false;
	});
	
	AEvent.bindEvent(this.element, AEvent.ACTION_MOVE, function(e)
	{
		if(isTouchLeave) return;
		
		if(Math.abs(e.changedTouches[0].clientY - startY) >= disableScrlManager.option.moveDelay) 
		{
			isTouchLeave = true;

			//터치 이후 스크롤의 변화가 없으면 상위 스크롤이 작동되도록 해줌.
			if(oldScrollTop==scrlArea.scrollTop)
			{
				isRemove = true;

				thisObj.scrlManager.removeDisableManager(disableScrlManager);
			}
		}
	});
	
};

AGrid.prototype.columnResizable = function(callback)
{
	//이 함수를 직접 호출할 수도 있으므로 변수를 셋팅해 둔다.
	this.option.isColumnResize = true;
	this.resizeCallback = callback;
	
	//this.$headTds = this.showThead.find('td');

	this.resizeBars = [];

	let thisObj = this, pos, idx, hRowCount = this.getHeaderRowCount(), isLastColumn = false,
		$cols = this.headerTable.find('col'),
		colLen = $cols.length, arr = new Array(colLen);

    //저장하지 않고 동적으로 구해온다.
    let $headTds = this.$hRowTmpl.eq(0).children('td'),
        endIdx = $headTds.length - 1,//endIdx = $headTds.length/hRowCount - 1,
        scaleX = this.getBoundRect().width / this.element.offsetWidth,
        headLeft = this.showThead.position().left
	
	$headTds.each(function(i)
	{
        //moveColumn 시 오류나서 주석처리하고 width: 0으로 생성
		//if(this.style.display == 'none') return;		//앞에서 colspan 세팅했으므로 리턴
		//if(this.getAttribute('colspan') > 1) return;	//colspan 처리시 리턴
		idx = i%colLen;
		if(arr[idx]) return;							//이미 해당 컬럼에 $sizeBar를 생성한 경우 리턴
		isLastColumn = (idx == endIdx);

        //여기 아래 코드 추가하면 안됨, 리사이즈바는 일단 컬럼 개수만큼 생성돼야 함.(컬럼 위치 변경기능 때문에)
		//if(isLastColumn && !thisObj.option.isWidthChangable) return;

        // resizeBar 위치는 컬럼 영역내의 우측에 표시, 컬럼넓이가 4보다 작은 경우에는 원래 띄우는 위치보다 우측에 위치하게 처리
		pos = ($(this).position().left - headLeft) / scaleX + Math.max(this.offsetWidth, 4) - 4;// + $(this).outerWidth() - 2;
		//if(isLastColumn) pos -= 1;

		var $sizeBar = $('<div></div>');
		$sizeBar.css(
		{
			position: 'absolute',
			left: pos + 'px',
			top: '0px',
			width: this.style.display=='none'?0:'4px',//isLastColumn?'3px':'5px', 
			height: '100%',
			'z-index': 100,
			//border: '1px solid blue'
		});
		
		//컬럼 숨김시 resizeBar도 숨김
		if($cols[idx].style.width == '0px') $sizeBar.css('display', 'none');

        //넓이 변경 옵션이 아닌데 마지막 컬럼인 경우 resizeBar 숨김. 마지막 컬럼 넓이 변경하게 되면 비정상 작동한다.
		if(isLastColumn && !thisObj.option.isWidthChangable) $sizeBar.css('display', 'none');
		
		//리사이즈바가 헤더 안에서만 보이도록
		thisObj.showThead.append($sizeBar);
		
		//생성된 리사이즈 바를 별도의 배열에 저장함
		thisObj.resizeBars[idx] = $sizeBar;
        $sizeBar._inx = idx;

		thisObj._resizeProcess($sizeBar);
		
		arr[idx] = true;
	});
	
	//리사이즈를 활성화 시키면 마지막 컬럼에 셋팅된 값을 지워야 정상 작동한다.
    //isWidthChangable 이더라도 전체 컬럼 넓이의 합과 그리드의 넓이(PC 스크롤존재유무에 따라 다름) 가 다른 경우가 많으므로 무조건 지워준다.
    this.setColumnWidth(colLen-1, '', true);
};

AGrid.prototype._resizeProcess = function($sizeBar)
{
    let thisObj = this;

    //리사이즈 중인데 다른 resizebar 영역을 지나가면 enter 로 표시되는 버그
    this._isResizeStart = false;//리사이즈 시작여부
    
    $sizeBar.draggable(
    { 
        axis: 'x',
        containment: this.option.isWidthChangable?"#thumbnail":"parent", //containment: 'window',
        cursor: "e-resize",
        //helper: "clone",

        start: function(e)
        {
            //scale 된 경우에도 정상동작하도록 수정
            thisObj._dragScaleX = (thisObj.getBoundRect().width / thisObj.element.offsetWidth).toFixed(2);
            //사이즈바 라인이 전체적으로 보이도록
            thisObj.$ele.append($sizeBar);
            
            //스케일되기 전의 left 값으로 저장
            $sizeBar[0].beforeLeft = ($sizeBar.position().left + thisObj.showThead.position().left) / thisObj._dragScaleX;
        },
        
        stop: function( event, ui ) 
        {
            //리사이즈바가 헤더 안에서만 보이도록
            thisObj.showThead.append($sizeBar);
            $sizeBar.css(
            {
                top: 0,//top 값이 변경되어 0으로 초기화처리
                cursor: 'auto',
                background: 'transparent'
            });
        
            thisObj._colculResizeWidth($sizeBar._inx, ui.position.left, event);
            
            thisObj._updateBarPos();
        },

        drag: function( event, ui ) 
        {
            //스케일되기 전의 left 값으로 변경
            ui.position.left = ui.position.left / thisObj._dragScaleX;
            ui.position.top = 0; //top 값이 변경되어 0으로 초기화처리
            /*
            $sizeBar.css(
            {
                cursor: 'e-resize',
            });
            */
        }
    });

    $sizeBar.mouseenter(function(e)
    {
        //다른 그리드 리사이즈 상태일때도 동작하여 마우스 다운상태로 판단하게 수정
        if(e.which != 1)
        {
            $sizeBar.css(
            {
                cursor: 'e-resize',
                background: 'gray'
            });
        }
    });

    //마우스 다운상태였다가 마우스업하면 리사이즈 가능상태 표현되도록 수정
    $sizeBar.mouseup(function(e)
    {
        $sizeBar.css(
        {
            cursor: 'e-resize',
            background: 'gray'
        });
    });
    
    $sizeBar.mouseleave(function(e)
    {
        //마우스가 클릭되지 않고 나간 경우만
        if(e.which==0)
        {
            $sizeBar.css(
            {
                cursor: 'auto',
                background: 'transparent'
            });
        }
    });
};

//그리드의 사이즈가 변경된 경우등..
//사이즈바의 위치 계산을 다시 해야될 경우 호출된다.
AGrid.prototype._updateBarPos = function()
{
    if(!this.option.isColumnResize) return

	let thisObj = this, pos, idx, hRowCount = this.getHeaderRowCount(), isLastColumn = false,
		colLen = this.headerTable.find('col').length

    //저장하지 않고 동적으로 구해온다.
    let $headTds = this.$hRowTmpl.eq(0).children('td'),
        endIdx = $headTds.length - 1,//endIdx = $headTds.length/hRowCount - 1,
        scaleX = this.getBoundRect().width / this.element.offsetWidth,
        headLeft = this.showThead.position().left
	
	$headTds.each(function(i)
	{
		if(this.style.display == 'none') return;		//앞에서 colspan 세팅했으므로 리턴
		//if(this.getAttribute('colspan') > 1) return;	//colspan 세팅시 리턴
		idx = i%colLen;
		isLastColumn = (idx == endIdx);
        //여기 아래 코드 추가하면 안됨, 리사이즈바는 일단 컬럼 개수만큼 생성돼야 함.(컬럼 위치 변경기능 때문에)
		//if(isLastColumn && !thisObj.option.isWidthChangable) return; 
		
        // resizeBar 위치는 컬럼 영역내의 우측에 표시
        pos = ($(this).position().left - headLeft) / scaleX + Math.max(this.offsetWidth, 4) - 4;// + $(this).outerWidth() - 2;
		//if(isLastColumn) pos -= 1;

        thisObj.resizeBars[idx]._inx = idx
		
		thisObj.resizeBars[idx].css(
		{
			left: pos + 'px'
		});

        //console.log(pos+'px')
	});

    //console.log('-----------------------------------------')
};

//사이즈바가 이동한 만큼 컬럼의 사이즈를 변경해 준다.
//단, 퍼센트로 지정한 경우는 비율을 계산해서 퍼센트로 셋팅해 준다.
AGrid.prototype._colculResizeWidth = function(inx, newLeft, e)
{
	var tmpInx = inx, tmp, isAllPercent = true, preLeft,
        $headTds = this.$hRowTmpl.eq(0).children('td'),
        $headCols = this.headerTable.find('col'),
        tdEle = $headTds.get(inx),
        beforeLeft = this.resizeBars[inx][0].beforeLeft,
        isLastColumn = inx == this.getColumnCount()-1;

    //컬럼넓이가 4보다 작으면 우측에 위치하므로 계산하기 위해 빼준다.
    if(tdEle.offsetWidth < 4) beforeLeft -= 4;

    for(let i=$headTds.length-1; i>-1; i--)
    {
        if(i<=inx && preLeft == undefined)
        {
            //td 의 위치로 이전 resizebar 의 위치값을 계산한다.
            tmp = $headTds.eq(i);
            if(tmp && tmp[0].style.display != 'none')
            {
                //newLeft 도 scale 전의 값이므로 이전 리사이즈바 위치도 scale 전의 값으로 가져온다.
                preLeft = tmp.position().left / this._dragScaleX - 4;
            }
        }

        //값이 있는데 %가 아닌 경우 px로 판단
        tmp = $headCols[i].getAttribute('width');
        if(isAllPercent && (tmp && tmp.indexOf('%') < 0)) isAllPercent = false;

        if(preLeft != undefined && !isAllPercent) break;
    }

    if(preLeft == undefined) preLeft = - 4 + this.showThead.position().left / this._dragScaleX;
	
    //숨겨져있는 경우가 있으므로 아래 내용으로 개선
	//if(inx>0) preLeft = this.resizeBars[inx-1].position().left;
	//컬럼이 숨겨져 있으면 resizeBar도 숨겨져있으므로 보이는 resizeBar를 찾는다.
	// while(tmpInx >= 0)
	// {
	// 	//$tmpBar = this.resizeBars[--tmpInx];
    //     $tmpBar = $headTds.eq(tmpInx--);
	// 	if($tmpBar && $tmpBar[0].style.display != 'none')
	// 	{
    //         //newLeft 도 scale 전의 값이므로 이전 리사이즈바 위치도 scale 전의 값으로 가져온다.
	// 		preLeft = $tmpBar.position().left / this._dragScaleX - 4;
	// 		break;
	// 	}
	// }
	
    //새로운 위치값은 기존 컬럼의 넓이가 0이 될 위치값보다 작게는 불가능
    //다만 마지막 컬럼을 변경하는 경우 모든 컬럼의 넓이가 %이거나 값이 없으면 비율로 표시되므로 작게 처리해도 괜찮음
    //if(!isLastColumn || !isAllPercent) newLeft = Math.max(newLeft, beforeLeft - tdEle.offsetWidth/2 - tdEle.clientWidth/2);
    if(!isLastColumn || !isAllPercent) newLeft = Math.max(newLeft, $headTds.eq(inx).position().left-4);
    
    var moveWidth = newLeft - preLeft,
        changedWidth, unit = '%';

    //변경할 컬럼의 넓이가 0보다 작은 경우에는 넓이를 0으로 처리한다. 단위는 반드시 px 로 처리해야 함
    //마지막 컬럼인 경우는 isWidthChangable 이므로 컬럼넓이는 변경하지 않고 그리드 넓이만 변경하므로 음수로도 지정가능함
    if(!isLastColumn && moveWidth <= 0)
    {
        moveWidth = 0;
        unit = 'px';
    }

    //넓이 변경 옵션인 경우
    if(this.option.isWidthChangable)
    {
        /*if(moveWidth == 0)
        {
            if(inx < 1) newLeft = 0;
            else newLeft = preLeft;
        }*/
        
        changedWidth = this.getWidth() + newLeft - beforeLeft;
        this.setWidth(changedWidth);
    }

    // 마지막 위치의 컬럼넓이는 변경하지 않는다.
    if(!isLastColumn)
    {
        //병합된 값을 가져온다.
        const colspan = this.getHeaderCell(0, inx).getAttribute('colspan') || 1;
        
        var val = this.headerTable.find('col')[inx].getAttribute('width');
        
        //altKey, ctrlKey, shiftKey 등 여러 키로 px <-> % 변경할 수 있는 기능이나 단위를 1, 0.1 로 할 수 있으면 있으면 좋을듯
        //altKey 가 아니면서 값이 없거나 %이면, altKey 이면서 값이 있고 %가 아니면
        //if((!e.altKey && (!val || val.indexOf('%')>-1)) || e.altKey && val && val.indexOf('%')<0)
        //ctrlKey: px, shiftKey: %, 없으면 현재 값에 맞게
        //if(!e.ctrlKey && (e.shiftKey || !val || val.indexOf('%')>-1))
        
        if(!val || val.indexOf('%')>-1)
        {
            //첫번째 td 의 border-left 가 있는 경우 헤더 table 과 head 의 넓이가 달라 퍼센티지가 제대로 구해지지 않음
            moveWidth = moveWidth/this.showThead.width() * 100; //moveWidth = moveWidth/this.headerTable.width() * 100;
            //this.setColumnWidth(inx, moveWidth+unit, true);

            //병합된 컬럼 개수만큼 같은 넓이로 변경해준다.
            moveWidth /= colspan;
            for(let i=inx; i<inx+colspan; i++)
            {
                this.setColumnWidth(i, moveWidth+unit, true);
            }
        }
        else
        {
            //this.setColumnWidth(inx, moveWidth+'px', true);
            
            //병합된 컬럼 개수만큼 같은 넓이로 변경해준다.
            moveWidth /= colspan;
            for(let i=inx; i<inx+colspan; i++)
            {
                this.setColumnWidth(i, moveWidth+'px', true);
            }
        }
    }

	if(this.resizeCallback) this.resizeCallback(changedWidth, inx);
};
