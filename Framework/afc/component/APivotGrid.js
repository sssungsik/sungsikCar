
/**
 *	AView 를 상속받아 새로운 컴포넌트를 생성하는 예
 */
class APivotGrid extends AView
{
	constructor()
	{
		super()
	
		//	자신이 포함되어져 있는 프레임웍 이름을 지정합니다.
		this.frwName = 'afc';

		//Ex ---
		this.axisScrollLock = false;
		this.startX = -1;
		this.startY = -1;
		//Ex ---
	}


	
}

window.APivotGrid = APivotGrid

APivotGrid.pivotScrollAxisLock = false; //Ex

APivotGrid.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);

	var childComps = this.getChildren();
	if(childComps.length == 1)
	{
		this.scrlYView = childComps[0];
		childComps = childComps[0].getChildren();
	}
	this.scrollView = childComps[0];
	this.scrollGrid = this.scrollView.getChildren()[0];
	this.pivotGrid = childComps[1];
	
	//매핑타입을 3으로 지정하여 AView 의 ChildMapping 처럼 처리되게 한다.
	this.pivotGrid.mappingType = this.scrollGrid.mappingType = 3;
	this._setChildQueryInfo();
	
	this.setOption(
	{
		isHideHeader : this.getAttr('data-hide-header'),			//헤더를 숨길지
		isSingleSelect : this.getAttr('data-single-select'),		//ctrl 키를 누르고 선택해도 하나만 선택된다. 
		isFullRowSelect : this.getAttr('data-fullrow-select'),	
		isSelectable : this.getAttr('data-selectable'),				//선택 [불]가능 옵션 플래그
		isSortable : this.getAttr('data-sortable'),					//헤더 선택시 정렬처리 여부
		isColumnResize : this.getAttr('data-column-resize'),
		isClearRowTmpl : this.getAttr('data-clear-rowtmpl'),
	}, true);
	
	//개발인 경우는 작동되지 않도록
	if(this.isDev()) this.option.isColumnResize = false;
	
	// 런타임
	else
	{
		//개발중에는 선택 이벤트를 수정하지 않는다.
		//두 개의 그리드의 selectCell 함수 변경
		this._setAllGridSelect();
		
		//EXPivotVIew-Style 안의 pivotGrid, scrollGrid, scrollView의 스크롤바를 display: none; 처리를 했기 떄문에 스크롤 영역 체크하지 않게 처리한다.
		//this.addClass('EXPivotView-Style');
		
		this.pivotGrid.isCheckScrl = false;
		this.scrollGrid.isCheckScrl = false;

		//height auto 가 동작하기 위해 구성요소를 relative 로 변경해 준다.
		if(!this.element.style.height || this.element.style.height=='auto')
		{
			this.pivotGrid.$ele.css('position','relative');
			this.scrollGrid.$ele.css('position','relative');
		}
	}
	
	this.nameKeyArr = this.scrollGrid.nameKeyArr.slice();
	this.nameKeyArr = this.nameKeyArr.concat(this.pivotGrid.nameKeyArr);

	//옵션 정보를 실제 자식 그리드에 적용해 준다.
	this._applyOptionToChild();
	
	this.pivotGrid.addEventListener('select', this, '_onGridSelect');
	this.pivotGrid.addEventListener('dblclick', this, '_onGridDblclick');

	this.scrollGrid.addEventListener('select', this, '_onGridSelect');
	this.scrollGrid.addEventListener('dblclick', this, '_onGridDblclick');
	
	this.scrollGrid.scrollArea.css('overflow-y', 'visible');	//or hidden

	/*//스크롤 속도를 개선한 피봇 그리드 확장 클래스 인 경우는 기본 스크롤을 사용한다.
	if(!window.APivotGridEx || !(this instanceof APivotGridEx))
	{
		//height auto 인 경우는 상위 view 의 기본 스크롤이 작동하기 때문에 ScrollManager 를 사용하지 않는다.
		if(this.element.style.height && this.element.style.height!='auto')
		{
			this.pivotGrid.addEventListener('scroll', this, '_onGridScroll');
			this.pivotGrid.addEventListener('scrolltop', this, '_onGridScrollTop');
			this.pivotGrid.addEventListener('scrollbottom', this, '_onGridScrollBottom');
	
			this.pivotGrid.enableScrlManager(null, this.scrollGrid.scrollArea[0]);
			this.scrollGrid.enableScrlManager(this.pivotGrid.scrollArea[0], null);
			this.scrollView.enableScrlManagerX();

			this.scrollView.scrlManagerX.addDisableManager(this.scrollGrid.scrlManager);
			this.scrollGrid.scrlManager.addDisableManager(this.scrollView.scrlManagerX);
		}
	}*/
	
	
	if(afc.isScrollIndicator) this.enableScrollIndicator();
	
	this._initEx(); //Ex 관련 초기화
};

//Ex 관련 초기화
APivotGrid.prototype._initEx = function()
{
	//------------------------------------------------------------------------------
	//		height auto 인 경우는 확장 기능을 사용할 필요가 없음.
	if(!this.element.style.height || this.element.style.height=='auto') return;
	//------------------------------------------------------------------------------
	
	if(!this.scrlYView)
	{
		//scrollY 역할
		this.scrlYView = new AView();
		this.scrlYView.init();
		this.scrlYView.$ele.css({
			overflow: 'auto',
			left: '0px',
			top: '0px',
			width: '100%',
			height: '100%',
			'z-index': 0,
			'background-color': 'transparent'
		});

		//내부 그리드의 height 를 auto 로 지정해서
		//scrlYView 의 스크롤이 발생하게 한다.
		this.pivotGrid.$ele.css({
			overflow: 'visible',
			height: 'auto',
			position: 'sticky',
			left: 0
		});

		this.pivotGrid.$ele.append(this.pivotGrid.scrollArea.children());
		this.pivotGrid.scrollArea.remove();

		this.scrollGrid.$ele.css({
			overflow: 'visible',
			height: 'auto'
		});
		this.scrollGrid.$ele.append(this.scrollGrid.scrollArea.children());
		this.scrollGrid.scrollArea.remove();


		this.scrollView.$ele.css(
			{
				overflow: 'visible',
				'background-color': 'transparent'
			});

		//스크롤Y뷰 영역으로 이동
		this.scrlYView.addComponent(this.scrollView);
		this.scrlYView.addComponent(this.pivotGrid);

		this.addComponent(this.scrlYView);
	}
	//--------------------------------------------------

	//상하 스크롤 이벤트 처리
	this.scrlYView.addEventListener('scroll', this, '_onGridScroll');
	this.scrlYView.addEventListener('scrolltop', this, '_onGridScrollTop');
	this.scrlYView.addEventListener('scrollbottom', this, '_onGridScrollBottom');

	//현재는 글로벌 옵션으로 처리
	if(APivotGrid.pivotScrollAxisLock)
	{
		this.addEventListener('actiondown', this, '_onGridActionDown');
		this.addEventListener('actionmove', this, '_onGridActionMove');
		this.addEventListener('actionup', this, '_onGridActionUp');
	}
};

APivotGrid.prototype._qryLoadDone = function(aquery)
{
	AView.prototype._qryLoadDone.call(this, aquery);
	
	this._setChildQueryInfo(aquery);
};

//pivot scroll 그리드에 매핑정보를 전달하는 함수
//로드시점에 pivotGrid 즉 하위 컴포넌트가 초기화되기 전인 경우에는 무시한다.
//현재 컴포넌트의 init 시점에도 호출하여 지금까지 로드된 매핑정보를 전달한다.
APivotGrid.prototype._setChildQueryInfo = function(aquery)
{
	if(this.pivotGrid)
	{
		var thisObj = this, qryName;
		var dataKeyArr, pivotGridMappingCnt = this.pivotGrid.getMappingCount().length;
		
		if(aquery)
		{
			qryName = aquery.getName();
			_set_query_helper(qryName, this.dataKeyMap[qryName]);
		}
		else
		{
			for(qryName in this.dataKeyMap)
			{
				if(this.dataKeyMap[qryName])
				{
					_set_query_helper(qryName, this.dataKeyMap[qryName]);
				}
			}
		}
	}
	
	function _set_query_helper(qryName, qryDataKeyMap)
	{
		for(var blockName in qryDataKeyMap)
		{
			dataKeyArr = qryDataKeyMap[blockName];
			thisObj.pivotGrid.setQueryInfo(qryName, blockName, dataKeyArr.slice(0, pivotGridMappingCnt));
			thisObj.scrollGrid.setQueryInfo(qryName, blockName, dataKeyArr.slice(pivotGridMappingCnt));
		}
	}
};

APivotGrid.prototype.getPivotGrid = function()
{
	return this.pivotGrid;
};

APivotGrid.prototype._applyOptionToChild = function()
{
	this.scrollGrid.setOption(this.option);
	this.pivotGrid.setOption(this.option);

	if(!this.isDev()) 
	{
		this.removeAll();
		if(!this.option.isClearRowTmpl) this.addRow([], []);
	}
	
	if(this.option.isColumnResize)
	{
		this.scrollGrid.columnResizable(() => {
			this.calcHeight();
		});
		this.pivotGrid.columnResizable(changedWidth => {
			if(changedWidth)
			{
				this.scrollView.setStyleObj({
					left: changedWidth + 'px',
					width: 'calc(100% - ' + changedWidth + 'px)'
				});
				this.scrollGrid.updatePosition();//_updateBarPos();
			}
			this.calcHeight();
		});
	}
	
// 	if(this.option.isHideHeader) this.hideHeader();
// 	if(this.option.isHideHeader) this.hideFooter();
};

APivotGrid.prototype.calcHeight = function()
{
	const pivotTR = this.pivotGrid.showThead.children('tr');
	const scrollTR = this.scrollGrid.showThead.children('tr');

	pivotTR.each((i, tr) => {
		$(tr).css('height', '');
	});
	scrollTR.each((i, tr) => {
		$(tr).css('height', '');
	});
	
	let maxCnt = Math.max(pivotTR.length, scrollTR.length);
	const maxHeightArr = new Array(maxCnt);
	maxHeightArr.fill(0);
	let maxHeight = 0, rowspan;
	for(let i=0; i < maxCnt; i++)
	{
		maxHeight = 0;
		$(pivotTR[i]).children().each((j, td) => {
			rowspan = td.getAttribute('rowspan');
			if(!rowspan)
			{
				maxHeightArr[i] = Math.max(td.offsetHeight, maxHeightArr[i]);
			}
		});

		$(scrollTR[i]).children().each((j, td) => {
			rowspan = td.getAttribute('rowspan');
			if(!rowspan)
			{
				maxHeightArr[i] = Math.max(td.offsetHeight, maxHeightArr[i]);
			}
		});
	}
	
	for(let i=0; i < maxCnt; i++)
	{
		$(pivotTR[i]).css('height', maxHeightArr[i]);
		$(scrollTR[i]).css('height', maxHeightArr[i]);
	}
};

APivotGrid.prototype.setMainGridWidth = function(width)
{
	this.scrollGrid.setStyle('width', width);
};

APivotGrid.prototype.getMainGridWidth = function()
{
	return this.scrollGrid.getStyle('width');
};

APivotGrid.prototype.setPivotGridWidth = function(width)
{
	this.pivotGrid.setStyle('width', width);
	
	this.scrollView.posUtil.setPos('left', width);
	this.scrollView.posUtil.setStretchValue('left', width);
};

APivotGrid.prototype.getPivotGridWidth = function()
{
	return this.pivotGrid.getStyle('width');
};

APivotGrid.prototype._getDataStyleObj = function()
{
	return this.scrollGrid._getDataStyleObj();
};

// object 형식의 css class 값을 컴포넌트에 셋팅한다.
// default style 값만 셋팅한다.
APivotGrid.prototype._setDataStyleObj = function(styleObj)
{
	this.scrollGrid._setDataStyleObj(styleObj);
	this.pivotGrid._setDataStyleObj(styleObj);
};

// 매핑가능한 개수를 리턴한다.
APivotGrid.prototype.getMappingCount = function()
{
	var mappingArr = this.scrollGrid.getMappingCount();
	
	var pMappingArr = this.pivotGrid.getMappingCount();
	//pMappingArr[0] = 'P ' + pMappingArr[0];
	mappingArr = pMappingArr.concat(mappingArr);
	
	return mappingArr;
};

APivotGrid.prototype.showHeader = function()
{
	this.pivotGrid.showHeader();
	this.scrollGrid.showHeader();
};

APivotGrid.prototype.hideHeader = function()
{
	this.pivotGrid.hideHeader();
	this.scrollGrid.hideHeader();
};

APivotGrid.prototype.showFooter = function()
{
	this.pivotGrid.showFooter();
	this.scrollGrid.showFooter();
};

APivotGrid.prototype.hideFooter = function()
{
	this.pivotGrid.hideFooter();
	this.scrollGrid.hideFooter();
};

APivotGrid.prototype.enableScrollIndicator = function()
{
	var thisObj = this;
	
	//자동으로 생성된 pivotGrid 의 스크롤 인디케이터는 제거하고
	this.pivotGrid.scrlIndicator.destroy();
	this.pivotGrid.scrlIndicator = null;
	
	//우측의 스크롤 그리드의 스크롤 인디케이터의 위치를 보정하기 위해...
	//callback 으로 필요한 시점에 호출된다.
	this.scrollGrid.scrlIndicator.resetScrollPos(function()
	{
		if(!thisObj.isValid() || !thisObj.scrollView.isValid()) return;
		//우측의 스크롤 그리드의 스크롤 인디케이터의 위치를 보정한다.
		var newLeft = thisObj.scrollView.getWidth() + thisObj.scrollView.element.scrollLeft - ScrollIndicator.scrlWidth;
		
		// 'this' is scrollIndicator
		this.setStyle({left: newLeft+'px', right:''});
	});
	
	//상하 스크롤은 하지 않으므로 제거
	if(this.scrollView.scrlIndicatorY)
	{
		this.scrollView.scrlIndicatorY.destroy();
		this.scrollView.scrlIndicatorY = null;
	
	}
	
	//scrollView 의 스크롤이 발생하면 scrollGrid 의 ScrollIndicator 같이 움직이는 현상을 방지한다.
	this.scrollView.element.addEventListener('scroll', function(e)
	{
		thisObj.scrollGrid.scrlIndicator.hide();
	});
	
};

//APivotGrid 가 스크롤 가능 영역에 추가되어져 있을 경우
//APivotGrid 스크롤이 끝나고(ex, scrollBottom) 상위 스크롤이 연속적으로 발생되도록 하려면
//상위 스크롤은 enableScrlManager 가 호출되어져야 하고 자신은 overscrollBehavior 함수를 호출해야 한다.
APivotGrid.prototype.overscrollBehavior = function(disableScrlManager)
{
	this.pivotGrid.overscrollBehavior(disableScrlManager);
	this.scrollGrid.overscrollBehavior(disableScrlManager);
};

//------------------------------------------------------------------------------------------

APivotGrid.prototype.lockScrollView = function()
{
	this.scrollView.scrlManagerX.removeAllDisableManager();
	this.scrollGrid.scrlManager.removeAllDisableManager();
	this.scrollView.scrlManagerX.enableScroll(false);
};

APivotGrid.prototype.unlockScrollView = function()
{
	this.scrollView.scrlManagerX.addDisableManager(this.scrollGrid.scrlManager);
	this.scrollGrid.scrlManager.addDisableManager(this.scrollView.scrlManagerX);
	this.scrollView.scrlManagerX.enableScroll(true);
};


APivotGrid.prototype.scrollViewLeft = function()
{
	this.scrollView.element.scrollLeft = this.scrollGrid.getWidth();
};

APivotGrid.prototype.setData = function(pivotData, scrollData)
{
	this.pivotGrid.setData(pivotData);
	this.scrollGrid.setData(scrollData);

	//데이터가 추가될 때마다 scrollView 의 높이를 늘려줘서 scrlYView 의 스크롤이 발생하도록 한다.
	if(this.scrlYView) this.scrollView.setHeight(this.scrollGrid.getHeight()); //Ex
};

//하나의 row 를 추가한다.
APivotGrid.prototype.addRow = function(pivotData, scrollData)
{
	var row1 = this.pivotGrid.addRow(pivotData),
		row2 = this.scrollGrid.addRow(scrollData);

	//this._heightSync(row1, row2);
	
	//데이터가 추가될 때마다 scrollView 의 높이를 늘려줘서 scrlYView 의 스크롤이 발생하도록 한다.
	if(this.scrlYView) this.scrollView.setHeight(this.scrollGrid.getHeight()); //Ex

	return [row1, row2];
};


//데이터가 많은 경우 addRow 를 여러번 호출하는 것보다
//addRows 로 한번에 추가하는 것이 성능적으로 유리하다. 
APivotGrid.prototype.addRows = function(pivotInfoArr2, scrollInfoArr2, pivotRowData2, scrollRowData2)
{
	var ret1 = this.pivotGrid.addRows(pivotInfoArr2, pivotRowData2),
		ret2 = this.scrollGrid.addRows(scrollInfoArr2, scrollRowData2);
	
	if(this.scrlYView) this.scrollView.setHeight(this.scrollGrid.getHeight()); //Ex
	
	return [ret1, ret2];
};

APivotGrid.prototype.prependRow = function(pivotData, scrollData)
{
	var row1 = this.pivotGrid.prependRow(pivotData),
		row2 = this.scrollGrid.prependRow(scrollData);
		
	//this._heightSync(row1, row2);
	
	if(this.scrlYView) this.scrollView.setHeight(this.scrollGrid.getHeight()); //Ex

	return [row1, row2];
};

APivotGrid.prototype.setRow = function(rowInx, pivotData, scrollData, start, end)
{
	var row1 = this.pivotGrid.setRow(rowInx, pivotData, start, end);
	var row2 = this.scrollGrid.setRow(rowInx, scrollData, start, end);
	
	//this._heightSync(row1, row2);
	
	return [row1, row2];
};

//row가 여러줄 일 경우 다 같이 높이가 변한다.
/*
APivotGrid.prototype._heightSync = function(row1, row2)
{
	//height() 함수 호출이, 시간 소요가 크다.
	var h1 = row1.height(), h2 = row2.height();

	//컨텐츠에 따라 두 row 의 높이가 달라진 경우 높이를 맞춰준다. 대부분 같으므로 아래와 같이 처리하는 것이 성능에 유리
	if(h1!=h2)
	{
		var h = Math.max(h1, h2);
		row1.height(h);
		row2.height(h);
		
		//cell 의 높이를 직접 셋팅한 경우는 작동하지 않는지 테스트 필요, 안되면 다음과 같이
		//row1.children().height(h);
		//row2.children().height(h);
	}
};
*/

APivotGrid.prototype.removeRow = function(rowIdx)
{
	this.pivotGrid.removeRow(rowIdx);
	this.scrollGrid.removeRow(rowIdx);
	
	if(this.scrlYView) this.scrollView.setHeight(this.scrollGrid.getHeight()); //Ex
};

APivotGrid.prototype.removeFirst = function()
{
	this.pivotGrid.removeFirst();
	this.scrollGrid.removeFirst();
	
	if(this.scrlYView) this.scrollView.setHeight(this.scrollGrid.getHeight()); //Ex
};

APivotGrid.prototype.removeLast = function()
{
	this.pivotGrid.removeLast();
	this.scrollGrid.removeLast();
	
	if(this.scrlYView) this.scrollView.setHeight(this.scrollGrid.getHeight()); //Ex
};

// 오작동으로 인해 주석처리, 필요하다면 hide, show override 처리
/*
APivotGrid.prototype.show = function(showType)
{
	this.pivotGrid.show(showType);
	this.scrollGrid.show(showType);

	//AView.prototype.show.call(this, showType);
};
*/

APivotGrid.prototype.removeAll = function()
{
	this.pivotGrid.removeAll();
	this.scrollGrid.removeAll();
	
	if(this.scrlYView) this.scrollView.setHeight(this.scrollGrid.getHeight()); //Ex
};

APivotGrid.prototype.createBackup = function(maxRow, restoreCount)
{
	this.pivotGrid.createBackup(maxRow, restoreCount);
	this.scrollGrid.createBackup(maxRow, restoreCount);
	//Ex ---
	//height auto 인 경우는 확장 기능을 사용하지 않는다.
	if(!this.scrlYView) return;
	
	this.pivotGrid.bkManager.scrollEle = this.scrlYView.element;
	this.scrollGrid.bkManager.scrollEle = null;
	
	var bkManager1 = this.pivotGrid.bkManager,
		bkManager2 = this.scrollGrid.bkManager;
	
	this.scrlYView._scrollTopManage = function()
	{
		//비교는 하나만 해도 되지만 checkHeadBackup 함수는 둘다 호출되어야 함.
		var ret = bkManager1.checkHeadBackup();
				  bkManager2.checkHeadBackup();
		
		if(ret) 
		{
			if(bkManager1.isMoveReal()) this.scrollToTop();
			return false;
		}
		else return true;
	};

	this.scrlYView._scrollBottomManage = function()
	{
		//비교는 하나만 해도 되지만 checkTailBackup 함수는 둘다 호출되어야 함.
		var ret = bkManager1.checkTailBackup();
				  bkManager2.checkTailBackup();

		if(ret) 
		{
			if(bkManager1.isMoveReal()) this.scrollToBottom();
			return false;
		}
		else return true;
	};
	//Ex ---
};

APivotGrid.prototype.destroyBackup = function()
{
	this.pivotGrid.destroyBackup();
	this.scrollGrid.destroyBackup();
};

//추가되는 순간 화면에 표시되지 않고 바로 백업되도록 한다. append 인 경우만 유효
APivotGrid.prototype.setDirectBackup = function(isDirect)
{
	this.pivotGrid.setDirectBackup(isDirect);
	this.scrollGrid.setDirectBackup(isDirect);
};

APivotGrid.prototype.applyBackupScroll = function()
{
	this.pivotGrid.applyBackupScroll();
	return this.scrollGrid.applyBackupScroll();
};

//isFullRowSelect 가 참이면 선택된 row 가 리턴된다.
APivotGrid.prototype.getSelectedCells = function()
{
    return [ this.pivotGrid.getSelectedCells(), this.scrollGrid.getSelectedCells() ];
};

//endInx 가 생략되면 1개 선택
APivotGrid.prototype.selectRows = function(startIdx, endIdx)
{
	this.pivotGrid.selectRows(startIdx, endIdx);
	this.scrollGrid.selectRows(startIdx, endIdx);
};

APivotGrid.prototype._setAllGridSelect = function()
{
	var self = this;
	
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
	
	self.pivotGrid.selectCell = self.scrollGrid.selectCell = function(cellArr, e)
	{
		AGrid.prototype.selectCell.call(this, cellArr, e);
		
		var selRow = cellArr[0];
		
		//fullrowselect 옵션이면 로우셋 전체를 얻어온다. 헤더가 아닌 경우
		if(self.option.isFullRowSelect)
		{
			var otherGrid = null;

			if(this===self.pivotGrid) otherGrid = self.scrollGrid;
			else otherGrid = self.pivotGrid;
		
			var inx = this.indexOfRow(selRow);
			if(selRow.isHeader || selRow.isFooter)
			{
				otherGrid.clearSelected();
			}
			else
			{
				AGrid.prototype.selectCell.call(otherGrid, otherGrid.getRowSet(inx), e);
			}
		}
		
		
		/*
		var otherGrid = null;

		if(this===thisObj.pivotGrid) otherGrid = thisObj.scrollGrid;
		else otherGrid = thisObj.pivotGrid;
		
		//헤드부분은 무조건 셀이 넘어온다. 같은 셀을 넘겨주면 클리어처리
		if(cellArr[0].isHeader) otherGrid.clearSelected(); //AGrid.prototype.selectCell.call(otherGrid, cellArr, e);
		else
		{
			//var startIdx = this.indexOfRow(cellArr[0]),
			//	endIdx = this.indexOfRow(cellArr[cellArr.length-1]) + 1;

			//AGrid.prototype.selectCell.call(otherGrid, otherGrid.getRows(startIdx, endIdx), e);
		}
		*/
		
		
	};
	
};

APivotGrid.prototype._onGridSelect = function(acomp, info, e)
{
	if(this.aevent.selectBind)
	{
		this.reportEvent('select', info, e);
	}
};

APivotGrid.prototype._onGridScroll = function(acomp, info, e)
{
	if(this.aevent.scrollBind)
	{
		this.reportEvent('scroll', info, e);
	}
};

APivotGrid.prototype._onGridScrollTop = function(acomp, info, e)
{
	if(this.aevent.scrolltopBind)
	{
		this.reportEvent('scrolltop', info, e);
	}
};

APivotGrid.prototype._onGridScrollBottom = function(acomp, info, e)
{
	if(this.scrollGrid.getRow(0) &&  this.aevent.scrollbottomBind)
	{
		this.reportEvent('scrollbottom', info, e);
	}
};

APivotGrid.prototype._onGridDblclick = function(acomp, info, e)
{
	if(this.aevent.dblclickBind)
	{
		this.reportEvent('dblclick', info, e);
	}
};


APivotGrid.prototype.setScrollComp = function(acomp)
{
	if(acomp) acomp.setStyle('z-index', 3);
	this.pivotGrid.setScrollComp(acomp);
	this.scrollGrid.setScrollComp(acomp);
};

//Ex
APivotGrid.prototype._onGridActionDown = function(comp, info, e)
{
	const touch = e.targetTouches[0];
	this.startX = touch.pageX;
	this.startY = touch.pageY;
};

//Ex
APivotGrid.prototype._onGridActionMove = function(comp, info, e)
{
	const touch = e.targetTouches[0];
	const curX = touch.pageX;
	const curY = touch.pageY;

	if(this.axisScrollLock) return;

	if(Math.abs(this.startX - curX) > 10)
	{
		this.axisScrollLock = true;
		this.scrlYView.$ele.css({'overflow-y': 'hidden'});
	}
	else if(Math.abs(this.startY - curY) > 10)
	{
		this.axisScrollLock = true;
		this.scrlYView.$ele.css({'overflow-x': 'hidden'});
	}
};

//Ex
APivotGrid.prototype._onGridActionUp = function(comp, info, e)
{
	this.axisScrollLock = false;
	this.scrlYView.$ele.css({'overflow-y': 'auto'});
	this.scrlYView.$ele.css({'overflow-x': 'auto'});
};

//-----------------------------------------------------
//	about scroll
APivotGrid.prototype.scrollTo = function(pos)
{
	this.pivotGrid.scrollTo(pos);
	this.scrollGrid.scrollTo(pos);
};

APivotGrid.prototype.scrollOffset = function(offset)
{
	this.pivotGrid.scrollOffset(offset);
	this.scrollGrid.scrollOffset(offset);
};

//row or rowIndex
APivotGrid.prototype.scrollIntoArea = function(row, isAlignTop)
{
	this.pivotGrid.scrollIntoArea(row, isAlignTop);
	this.scrollGrid.scrollIntoArea(row, isAlignTop);
};

APivotGrid.prototype.scrollToTop = function()
{
	this.pivotGrid.scrollToTop();
	this.scrollGrid.scrollToTop();
};

APivotGrid.prototype.scrollToBottom = function()
{
	this.pivotGrid.scrollToBottom();
	this.scrollGrid.scrollToBottom();
};

APivotGrid.prototype.scrollToCenter = function()
{
	this.pivotGrid.scrollToCenter();
	this.scrollGrid.scrollToCenter();
};

//------------------------------------------------

APivotGrid.prototype.setUpdateType = function(updateType)
{
	this.pivotGrid.setUpdateType(updateType);
	this.scrollGrid.setUpdateType(updateType);
};

APivotGrid.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	this.pivotGrid.updateChildMappingComp(dataArr, queryData);
	this.scrollGrid.updateChildMappingComp(dataArr, queryData);
};

APivotGrid.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
};


//------------------------------------------------------------------------------


APivotGrid.NAME = "APivotGrid";

//scrollbar span 에 \n 이나 스페이스가 있어야 세로 스크롤바가 정상 작동한다.
//그래야 줄 바꿈이 되는 듯.
//data-flag 0100 -> 두번째 플래그 셋팅은 noChildSelect
//레이아웃트리에 하위 컴포넌트가 표현되지 않으며 캔버스에서도 선택되지 않는다.
//드래그&드랍으로 컴포넌트를 추가할 수도 없다.
APivotGrid.CONTEXT = 
{
	tag: '<div class="APivotGrid-Style" data-base="APivotGrid" data-class="APivotGrid" data-selectable="true" data-clear-rowtmpl="true" data-fullrow-select="true" style="width: 500px; height: 300px; position: absolute; left: 100px; top: 100px;" data-pivot-grid="true"\
        ><div data-base="AView" data-class="AView" class="AView-Style" style="width: 100%; height: 100%; overflow: auto; left: 0px; top: 0px; z-index: 0; background-color: transparent;"\
            ><div class="AView-Style" data-base="AView" data-class="AView" data-sgap-width="3" style="width: calc(70% - 0px); height: 100%; left: 30%; top: 0px; overflow: visible; z-index: 0; background-color: transparent;"\
                ><div data-base="AGrid" data-class="AGrid" class="AGrid-Style" data-selectable="true" style="width: 200%; height: auto; left: 0px; top: 0px; overflow: visible;" data-ver="3301" data-hide-footer="true"\
                    ><table class="grid-header-table" align="center"\
                        ><colgroup><col><col><col><col><col><col></colgroup\
                        ><thead align="center" class="head-prop" style="display: table-header-group;"\
                            ><tr height="22px"><td>col1</td><td>col2</td><td>col3</td><td>col4</td><td>col5</td><td>col6</td></tr\
                        ></thead\
                    ></table\
                    ><table class="grid-body-table" align="center"\
                        ><colgroup><col><col><col><col><col><col></colgroup\
                        ><thead align="center" class="head-prop"\
                            ><tr height="22px" style="height: 0px;"><td></td><td></td><td></td><td></td><td></td><td></td></tr\
                        ></thead\
                        ><tbody align="center" class="body-prop"\
                            ><tr height="22px"><td>1,1</td><td>1,2</td><td>1,3</td><td>1,4</td><td>1,5</td><td>1,6</td></tr\
                        ></tbody\
                    ></table\
                    ><table class="grid-footer-table" align="center"\
                        ><colgroup><col><col><col><col><col><col></colgroup\
                        ><thead align="center" class="head-prop"\
                            ><tr height="22px" style="height: 0px;"><td></td><td></td><td></td><td></td><td></td><td></td></tr\
                        ></thead\
                        ><tfoot align="center" class="foot-prop" style="display: none;"\
                            ><tr height="22px"><td>col1</td><td>col2</td><td>col3</td><td>col4</td><td>col5</td><td>col6</td></tr\
                        ></tfoot\
                    ></table\
                ></div\
            ></div\
            ><div data-base="AGrid" data-class="AGrid" class="AGrid-Style" data-selectable="true" style="width: 30%; height: auto; overflow: visible; position: sticky; left: 0px;" data-ver="3301" data-hide-footer="true"\
                ><table class="grid-header-table" align="center"\
                    ><colgroup><col><col><col></colgroup\
                    ><thead align="center" class="head-prop" style="display: table-header-group;"\
                        ><tr height="22px"><td>col1</td><td>col2</td><td>col3</td></tr\
                    ></thead\
                ></table\
                ><table class="grid-body-table" align="center"\
                    ><colgroup><col><col><col></colgroup\
                    ><thead align="center" class="head-prop"\
                        ><tr height="22px" style="height: 0px;"><td></td><td></td><td></td></tr\
                    ></thead\
                    ><tbody align="center" class="body-prop"\
                        ><tr height="22px"><td>1,1</td><td>1,2</td><td>1,3</td></tr\
                    ></tbody\
                ></table\
                ><table class="grid-footer-table" align="center"\
                    ><colgroup><col><col><col></colgroup\
                    ><thead align="center" class="head-prop"\
                        ><tr height="22px" style="height: 0px;"><td></td><td></td><td></td></tr\
                    ></thead\
                    ><tfoot align="center" class="foot-prop" style="display: none;"\
                        ><tr height="22px"><td>col1</td><td>col2</td><td>col3</td></tr\
                    ></tfoot\
                ></table\
            ></div\
        ></div\
    >',

    defStyle:
    {
        width:'500px', height:'300px'
    },
	
	flag: '0100',

    events: [ 'select', 'dblclick', 'scroll', 'scrolltop', 'scrollbottom' ]
};

