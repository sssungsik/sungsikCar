(async function() {
                    

await afc.import("Framework/afc/component/APivotGrid.js");


//확장 컴포넌트로 사용
//향후 안정성 확인이 되면 대체하기
APivotGridEx = class APivotGridEx extends APivotGrid
{
    constructor()
    {
        super()
		
		this.axisScrollLock = false;
		this.startX = -1;
		this.startY = -1;
	

    }
}

//window.APivotGridEx = APivotGridEx;

APivotGridEx.pivotScrollAxisLock = false;

APivotGridEx.prototype.init = function(context, evtListener)
{
	APivotGrid.prototype.init.call(this, context, evtListener);
	
	//------------------------------------------------------------------------------
	//		height auto 인 경우는 확장 기능을 사용할 필요가 없음.
	if(!this.element.style.height || this.element.style.height=='auto') return;
	//------------------------------------------------------------------------------
	
	//scrollY 역할
	
	this.scrlYView = new AView();
	this.scrlYView.init();
	this.scrlYView.$ele.css({
		overflow: 'auto',
		left: '0px',
		top: '0px',
		width: '100%',
		height: '100%',
		'z-index': 0
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
		overflow: 'visible'
	});
	
	
	//스크롤Y뷰 영역으로 이동
	this.scrlYView.addComponent(this.scrollView);
	this.scrlYView.addComponent(this.pivotGrid);
	
	
	this.addComponent(this.scrlYView);
	
	
	//--------------------------------------------------

	//상하 스크롤 이벤트 처리
	this.scrlYView.addEventListener('scroll', this, '_onGridScroll');
	this.scrlYView.addEventListener('scrolltop', this, '_onGridScrollTop');
	this.scrlYView.addEventListener('scrollbottom', this, '_onGridScrollBottom');

	//현재는 글로벌 옵션으로 처리
	if(APivotGridEx.pivotScrollAxisLock)
	{
		this.addEventListener('actiondown', this, '_onGridActionDown');
		this.addEventListener('actionmove', this, '_onGridActionMove');
		this.addEventListener('actionup', this, '_onGridActionUp');
	}
};

APivotGridEx.prototype.setData = function(pivotData, scrollData)
{
	APivotGrid.prototype.setData.call(this, pivotData, scrollData);

	//데이터가 추가될 때마다 scrollView 의 높이를 늘려줘서 scrlYView 의 스크롤이 발생하도록 한다.
	if(this.scrlYView) this.scrollView.setHeight(this.scrollGrid.getHeight());
};

APivotGridEx.prototype.addRow = function(pivotData, scrollData)
{
	var retArr = APivotGrid.prototype.addRow.call(this, pivotData, scrollData);
	
	//데이터가 추가될 때마다 scrollView 의 높이를 늘려줘서 scrlYView 의 스크롤이 발생하도록 한다.
	if(this.scrlYView) this.scrollView.setHeight(this.scrollGrid.getHeight());
	
	return retArr;
};

APivotGridEx.prototype.addRows = function(pivotInfoArr2, scrollInfoArr2, pivotRowData2, scrollRowData2)
{
	var retArr = APivotGrid.prototype.addRows.call(this, pivotInfoArr2, scrollInfoArr2, pivotRowData2, scrollRowData2);
	
	if(this.scrlYView) this.scrollView.setHeight(this.scrollGrid.getHeight());
	
	return retArr;
};

APivotGridEx.prototype.removeRow = function(rowIdx)
{
	APivotGrid.prototype.removeRow.call(this, rowIdx);
	
	if(this.scrlYView) this.scrollView.setHeight(this.scrollGrid.getHeight());
};

APivotGridEx.prototype.removeFirst = function()
{
	APivotGrid.prototype.removeFirst.call(this);
	
	if(this.scrlYView) this.scrollView.setHeight(this.scrollGrid.getHeight());
};

APivotGridEx.prototype.removeLast = function()
{
	APivotGrid.prototype.removeLast.call(this);
	
	if(this.scrlYView) this.scrollView.setHeight(this.scrollGrid.getHeight());
};

APivotGridEx.prototype.removeAll = function()
{
	APivotGrid.prototype.removeAll.call(this);
	
	if(this.scrlYView) this.scrollView.setHeight(this.scrollGrid.getHeight());
};

APivotGridEx.prototype.createBackup = function(maxRow, restoreCount)
{
	APivotGrid.prototype.createBackup.call(this, maxRow, restoreCount);
	
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
	
};

APivotGridEx.prototype._onGridActionDown = function(comp, info, e)
{
	const touch = e.targetTouches[0];
	this.startX = touch.pageX;
	this.startY = touch.pageY;
};

APivotGridEx.prototype._onGridActionMove = function(comp, info, e)
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

APivotGridEx.prototype._onGridActionUp = function(comp, info, e)
{
	this.axisScrollLock = false;
	this.scrlYView.$ele.css({'overflow-y': 'auto'});
	this.scrlYView.$ele.css({'overflow-x': 'auto'});
};
                    
})();