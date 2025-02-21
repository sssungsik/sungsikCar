
/**
* TODO:

* - 각 셀의 Drag & Drop 기능
* - 합계 그리드 
* - distinct
*/

// ==> 모바일에서 스크롤 매니저 작동 오류 - [완료]


class ADataGrid extends AView
{
	constructor()
	{
		super()
	
		//-----------------------------------------------------------	
		//	data object format
		//	object = { text: 'abc', type:'check', select:true }

		this.dataArr2 = [];
		this.showArr2 = this.dataArr2;

        this.oriColumnKeys = null
        this.columnKeys = null  //컬럼을 대표하는 키값을 배열로 가지고 있다. 최초 헤더의 컬럼 name 으로 셋팅된다.
        this.columnInds = null  //컬럼 위치가 변경될 경우 바뀐 인덱스를 가지고 있다. 

		//-----------------------------------------------------------

		//보여지는 데이터의 시작 인덱스
		this.dataInx = 0;
		this.renderRowCnt = 0;

		this.startCol = 0;
		this.endCol = 0;

		this.sortInfo = [];
		this.sortColInx = -1;

		this.selObjs = [];

		//리얼 관련
		this.realMap = null;
		this.realField = null;

        //하단에 가려져 있던 그리드 로우를 보여주기위해 이동한 스크롤 거리
        this.scrollMoved = 0
	}

    setOption(option, noOverwrite)
    {
        super.setOption(option, noOverwrite)

        if(this.option.isColumnChange==true)
        {
            if(!this.dndMgr)
            {
                this.dndMgr = new DnDManager();
                this.dndMgr.setDropOption({applyChild: true, hoverClass: 'drag_over_style1'});  //this.overStyle
                this._regDragManage(true)
            }
        }
        else if(this.option.isColumnChange==false)
        {
            if(this.dndMgr)
            {
                this._regDragManage(false)
                this.dndMgr = null
            }
        }

        if(this.option.isWidthChangable!=undefined)
        {
            this.grid.setOption({ isWidthChangable: this.option.isWidthChangable } )
        }

        if(this.option.isHideHeader!=undefined)
        {
            if(this.option.isHideHeader) this.hideHeader();
            else this.showHeader();
        }
                
        if(this.option.isHideFooter!=undefined)
        {
            if(this.option.isHideFooter) this.hideFooter();
            else this.showFooter();
        }
    }

    isHiddenColumn(colIdx)
    {
        //배열이 아니면
        if(colIdx.length==undefined) colIdx = [colIdx]

        let pivotColumn = this.getPivotColumnCount()

        let arr = [];

        colIdx.forEach((idx)=>
        {
            idx = this._chgKeyToInx(idx)
            
            if(idx<pivotColumn) arr.push(this.pivotGrid.isHiddenColumn(idx));
            else arr.push(this.grid.isHiddenColumn(idx-pivotColumn));
        })

        if(arr.length > 1) return arr;
        else return arr[0];
    }

    //endRow 생략하면 하나의 startRow 만 선택
    selectRows(startRow, endRow, noUpdate)
    {
        if(this.option.isSingleSelect) this.clearSelected()

        if(endRow==undefined) endRow = startRow + 1

        for(let i=startRow; i<endRow; i++)
            this.selectCells(i, 0, -1, true)

        if(!noUpdate) this._renderData()
    }

    //endCol 이 -1 이면... 끝까지, endCol 생략하면 하나의 startCol 만 선택
    selectCells(rowInx, startCol, endCol, noUpdate)
    {
        let parentDataArr = this.showArr2[rowInx], obj

        if(endCol==undefined) endCol = startCol + 1
        else if(endCol<0)
        {
            endCol = this.grid.columnCount
            if(this.pivotGrid) endCol += this.pivotGrid.columnCount
        }
        else endCol++
        
        for(let i=startCol; i<endCol; i++)
        {
            obj = parentDataArr[i]
            
            if(obj)
            {
                obj.parentDataArr = parentDataArr
                this.addSelectObj(obj, true)
            }
        }
		
        if(!noUpdate) this._renderData()
    }

    scrollToTop()
    {
        this.scrollBarV.scrollToTop()
    }

    scrollToBottom()
    {
        this.scrollBarV.scrollToBottom()
    }

    exportExcel(fileName) 
    {
        const workbook = this._createExcelObjectFromData(),
              wbout = XLSX.write(workbook, {bookType:'xlsx', type:'array'}),
              blob = new Blob([wbout], {type:'application/octet-stream'}),
              url = URL.createObjectURL(blob)

        if(!fileName) fileName = 'export.xlsx'

        this._downloadFromLink(url, fileName);
    }

    exportCsv(fileName) 
    {
        const csvArray = this._createCsvArrayFromData(),
			csvContent = csvArray.join("\n"),
			bom = new Uint8Array([0xEF, 0xBB, 0xBF]),
            blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' }),
            url = URL.createObjectURL(blob)

        if(!fileName) fileName = 'export.csv'

        this._downloadFromLink(url, fileName);
    }

    _createExcelObjectFromData() 
    {
        let aoaData = [], rowArray

        // 헤더 포함
        aoaData.push(this.getAllColumnName());

        const data = this.getFilteredData()

        data.forEach((row) => 
        {
            rowArray = row.map(cell => cell.text);
            aoaData.push(rowArray);
        })

        //------------------------------------------------------

        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(aoaData);

        if (aoaData.length > 0 && aoaData[0].length > 0) {
            const range = {s: {c: 0, r: 0}, e: {c: aoaData[0].length - 1, r: aoaData.length - 1}};
            worksheet['!ref'] = XLSX.utils.encode_range(range);
        }

        // rowSpan를 가진 데이터 병합
        // worksheet['!merges'] = [];
        // data.forEach((row, rowIndex) => {
        //     row.forEach((cell, cellIndex) => {
        //         if (cell.rowSpan && cell.rowSpan > 1) {
        //             let adjustedRowIndex = this.includeGridHeaders ? rowIndex + 1 : rowIndex;
        //             worksheet['!merges'].push({
        //                 s: {r: adjustedRowIndex, c: cellIndex},
        //                 e: {r: adjustedRowIndex + cell.rowSpan - 1, c: cellIndex}
        //             });
        //         }
        //     });
        // });

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        return workbook;
    }

    _createCsvArrayFromData() 
    {
        let data = this.getFilteredData(),
            dataArray = [], rowArray

        // 헤더 포함
        const headers = this.getAllColumnName();
		
		const quotedHeaders = headers.map(header => {
			return header.includes(",") ? `"${header}"` : header;
		});
		
        dataArray.push(quotedHeaders.join(","));

        data.forEach((row) => {
            rowArray = row.map(cell => {
				const value = cell.text;
				return typeof value === 'string' && value.includes(",") ? `"${value}"` : value;
			})
            dataArray.push(rowArray.join(","))
        });

        return dataArray
    }    

    _downloadFromLink(url, fileName) 
    {
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", fileName);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    async importExcel(file, sheetName)
    {
        if (!(file instanceof File) || !this._isExcelFile(file)) 
        {
            console.error('올바른 파일 객체가 아닙니다.')
            return
        }

        const excelFile = await this._loadExcelFile(file);

        this._bindExcelToGrid(excelFile, sheetName)
    }

    _isExcelFile(file) 
    {
        const validExtensions = ['.xlsx', '.xls', '.xlsm', '.xlsb'];
        const fileName = file.name.toLowerCase();
        return validExtensions.some(ext => fileName.endsWith(ext));
    }

    _loadExcelFile(file) 
    {
        return new Promise(resolve => 
        {
            const reader = new FileReader()
            let result = []
            reader.onload = (e) => 
            {
                const data = e.target.result;
                const workbook = XLSX.read(data, {type: "binary"})
                workbook.SheetNames.forEach(sheetName => 
                {
                    result[sheetName] = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                })

                resolve(result);
            }

            reader.readAsBinaryString(file);
        })
    }

    _bindExcelToGrid(excelFile, sheetName) 
    {
        const sheetNames = Object.keys(excelFile);

        if (sheetNames.length === 0) return;

        // 시트 이름 파라미터가 있을 경우
        if(sheetName && sheetNames.includes(sheetName)) 
        {
            const sheetData = excelFile[sheetName];
            this.addRowDataArr(sheetData)
        } 

        // 없을 경우
        else 
        { 
            sheetNames.forEach(sheetName => 
            {
                const sheetData = excelFile[sheetName];
                this.addRowDataArr(sheetData, null, true)
            })

            this.updateDataGrid()
        }
    }



	
}

window.ADataGrid = ADataGrid

ADataGrid.prototype.init = function(context, evtListener)
{
	AView.prototype.init.call(this, context, evtListener);
	
	var childComps = this.getChildren();
	this.scrlView = childComps[0];
	this.grid = this.scrlView.getChildren()[0];
	this.scrollBarV = childComps[1];
	this.scrollBarH = childComps[2];
	
	this.setOption(
	{
		isHideHeader : this.getAttr('data-hide-header'),			//헤더를 숨길지
		isSingleSelect : this.getAttr('data-single-select'),		//ctrl 키를 누르고 선택해도 하나만 선택된다. 
		isFullRowSelect : this.getAttr('data-fullrow-select'),		//특정 cell 을 클릭해도 그 row 전체가 선택된다.
		isSelectable : this.getAttr('data-selectable'),				//선택 [불]가능 옵션 플래그
		isSortable : this.getAttr('data-sortable'),					//헤더 선택시 정렬처리 여부
		isColumnResize : this.getAttr('data-column-resize'),		//컬럼 리사이즈 여부
		isHideFooter : this.getAttr('data-hide-footer'),			//푸터를 숨길지
		
		isPivotGrid: this.getAttr('data-pivot-grid'),
		isHideHScrollbar: this.getAttr('data-hide-hscrollbar'),
        isColumnChange: true
		
	}, true);
	
	//개발인 경우는 작동되지 않도록
	if(this.isDev()) 
		this.option.isColumnResize = false;
	
	this.nameKeyArr = this.grid.nameKeyArr.slice();
	if(this.option.isPivotGrid) 
	{
		this.pivotGrid = childComps[3];
		this.nameKeyArr = this.nameKeyArr.concat(this.pivotGrid.nameKeyArr);
	}

    //param 이 null 이면, 기본적으로 헤더의 text 를 컬럼키로 사용한다.
    this.setColumnKeys()
	
	if(afc.isMobile)
	{
		this.scrlView.setWidth('calc(100% - ' + this.scrlView.getPos().left + 'px)');
		this.scrlView.setHeight('100%');
		
		this.scrollBarV.setHeight('100%');
		this.scrollBarH.setWidth('100%');
		
		if(this.pivotGrid) this.pivotGrid.setHeight('100%');
		
		//모바일을 위한 자체 스크롤 활성화
		this.enableScrlManagerY();
		
		this.enableScrlManagerX();
	}
	

	//옵션 정보를 실제 자식 그리드에 적용해 준다.
	this._applyOptionToChild();
	
	for(var i=0; i<this.grid.columnCount; i++)
	{
		this.sortInfo.push({order:1});		//정렬 오름차순 1, 내림차순 -1
	}
	
	//if(this.pivotGrid) this.scrollBarV.addWheelArea(this.pivotGrid.element);
	
	this.scrollBarV.addWheelArea(this.grid.element);
	this.scrollBarH.addWheelArea(this.grid.element);

	this.scrollBarV.addEventListener('scroll', this, '_onScrollY');
	this.scrollBarH.addEventListener('scroll', this, '_onScrollX');
	
	if(this.pivotGrid) 
	{
        this.scrollBarV.addWheelArea(this.pivotGrid.element);
        this.scrollBarH.addWheelArea(this.pivotGrid.element);

        this.pivotGrid.scrollArea.css('overflow-y', 'hidden');

        this.$pTmplCells = this.pivotGrid.$rowTmpl.eq(0).children('td');
	}

    //마스크 관련 작업을 위해 미리 얻어둔다.
    this.$tmplCells = this.grid.$rowTmpl.eq(0).children('td');
	
    this.aevent.applyEvent()
	
    //기본 스크롤바가 생기지 않도록
	this.grid.scrollArea.css('overflow-y', 'hidden');
	
    //하단에 공백이 생기지 않도록 countAreaAdd, isCountAreaCeil 값을 설정해 준다.
    this.scrollBarV.setOption({
        countAreaAdd: 1,       
        isBorderCount: true, 
        isCountAreaCeil: true 
    })
	
	//scrollGap : 하나의 데이터를 표현할 영역의 넓이... 보통 그리드에서 로우
	//scrollPadding : 스크롤 영역에서 제외할 상단 영역.. 보통 그리드에서 헤더
	this.scrollBarV.setScrollArea(this.grid.scrollArea.height(), this.grid.hRowTmplHeight, this.grid.rowTmplHeight);
	
	//각각의 컴포넌트 내부에서 해 주므로 추가로 호출할 필요 없음
	//if(afc.isScrollIndicator) this.enableScrollIndicator();

/*
    if(this.option.isColumnChange) 
    {
        this.dndMgr = new DnDManager();
        this.dndMgr.setDropOption({applyChild: true, hoverClass: 'drag_over_style1'});  //this.overStyle
        this._regDragManage()
    }
*/
};

ADataGrid.prototype._regDragManage = function(isReg)
{
    let i, $cells;
	for(i=0; i<this.grid.$hRowTmpl.length; i++)
	{
		$cells = this.grid.$hRowTmpl.eq(i).children('td')
        $cells.each((inx, cell)=>
        {
            if(isReg)
            {
                this.dndMgr.regDrag(cell, this)
                this.dndMgr.regDrop(cell, this)
            }
            else
            {
                this.dndMgr.unregDrag(cell)
                this.dndMgr.unregDrop(cell)
            }
        })
	}
};

ADataGrid.prototype.onElementDrop = function(ddm, e, dragEle)
{
	var dropEle = e.currentTarget;	//드랍한 element

    let fromInx = this.grid.colIndexOfCell(dragEle),
        toInx = this.grid.colIndexOfCell(dropEle)

    //console.log(fromInx, toInx)
//debugger
    this.moveColumn(fromInx, toInx)

    if(this.delegator && this.delegator.onMoveColumn) 
    {
        this.delegator.onMoveColumn(this, fromInx, toInx)
    }
};

ADataGrid.prototype.resetColumnPos = function()
{
    let toInx, fromInx

    for(toInx=0; toInx<this.columnInds.length; toInx++)
    {
        fromInx = this.columnInds.indexOf(toInx)
        if(fromInx!=toInx) this.moveColumn(fromInx, toInx, true)
    }

    this.updateDataGrid(true)
};

ADataGrid.prototype.moveColumn = function(fromInx, toInx, noUpdate)
{
    let pColumn = this.getPivotColumnCount()

    let totColSpan = this.grid.$hRowTmpl.get(0).children[fromInx].colSpan

    //뒤에서 앞으로 이동
    if(fromInx>toInx)
    {
        for(let i=0; i<totColSpan; i++)
        {
            this._moveArrEle(this.columnKeys, fromInx+i+pColumn, toInx+i+pColumn)
            this._moveArrEle(this.columnInds, fromInx+i+pColumn, toInx+i+pColumn)

            this.showArr2.forEach((cols) => { this._moveArrEle(cols, fromInx+i+pColumn, toInx+i+pColumn) })
        }
    }
    //앞에서 뒤로 이동
    else if(fromInx<toInx)
    {
        for(let i=0; i<totColSpan; i++)
        {
            this._moveArrEle(this.columnKeys, fromInx+pColumn, toInx+pColumn)
            this._moveArrEle(this.columnInds, fromInx+pColumn, toInx+pColumn)

            this.showArr2.forEach((cols) => { this._moveArrEle(cols, fromInx+pColumn, toInx+pColumn) })
        }
    }
    else return;
    
    //_move_helper(this.grid.$hRowTmpl.eq(0), this.grid.headerTable)
    //_move_helper(this.grid.$rowTmpl.eq(0), this.grid.bodyTable)
    //_move_helper(this.grid.$fRowTmpl.eq(0), this.grid.footerTable)
    _move_helper(this.grid.$hRowTmpl, this.grid.headerTable)
    _move_helper(this.grid.$rowTmpl, this.grid.bodyTable)
    _move_helper(this.grid.$fRowTmpl, this.grid.footerTable)

    //$rowTmpl 이 변경되어 다시 얻어온다.
    this.$tmplCells = this.grid.$rowTmpl.eq(0).children('td');

    if(this.grid.resizeBars) 
    {
        this._moveArrEle(this.grid.resizeBars, fromInx, toInx)
        this.grid._updateBarPos()
    }

    if(!noUpdate) this.updateDataGrid(true)
    
    //-------------------------
    // help function 

    function _move_helper($tmpl, table)
    {
        let $cells, $toEle, i

        $cells = table.find('col')
        $toEle = $cells.eq(toInx)

        for(i=0; i<totColSpan; i++)
        {
            $toEle.before($cells.eq(fromInx+i))
        }

        $tmpl.each((inx, row)=>
        {
            $cells = $(row).children('td')
            $toEle = $cells.eq(toInx)
            for(i=0; i<totColSpan; i++)
            {
                $toEle.before($cells.eq(fromInx+i))
            }
        })
    }

    //console.log(this.columnInds)

};

ADataGrid.prototype.getHeaderCell = function(colInx)
{
    let pivotColumn = this.getPivotColumnCount()

    colInx = this._chgKeyToInx(colInx)

    if(colInx<pivotColumn) return this.pivotGrid.getHeaderCell(0, colInx)
    else return this.grid.getHeaderCell(0, colInx-pivotColumn)
}

ADataGrid.prototype.getColumnWidth = function(colInx)
{
    let pivotColumn = this.getPivotColumnCount()

    colInx = this._chgKeyToInx(colInx)

    if(colInx<pivotColumn) return this.pivotGrid.getColumnWidth(colInx)
    else return this.grid.getColumnWidth(colInx-pivotColumn)
}

ADataGrid.prototype.setColumnWidth = function(colInx, width)
{
    let pivotColumn = this.getPivotColumnCount()

    colInx = this._chgKeyToInx(colInx)

    if(colInx<pivotColumn) this.pivotGrid.setColumnWidth(colInx, width)
    else this.grid.setColumnWidth(colInx-pivotColumn, width)
}

ADataGrid.prototype.getColumnName = function(colInx)
{
    let pivotColumn = this.getPivotColumnCount()

    colInx = this._chgKeyToInx(colInx)

    if(colInx<pivotColumn) return this.pivotGrid.getColumnName(colInx)
    else return this.grid.getColumnName(colInx-pivotColumn)
};

ADataGrid.prototype.setColumnName = function(colInx, name)
{
    let pivotColumn = this.getPivotColumnCount()

    colInx = this._chgKeyToInx(colInx)

    if(colInx<pivotColumn) this.pivotGrid.setColumnName(colInx, name)
    else this.grid.setColumnName(colInx-pivotColumn, name)
};

//deprecated
ADataGrid.prototype.getAllColumnName = function()
{
    let retArr = [], $tmplCells

    if(this.pivotGrid)
    {
        $tmplCells = this.pivotGrid.$hRowTmpl.eq(0).children('td')
        $tmplCells.each((i, ele) =>
        {
            retArr.push(ele.innerText)
        })
    }

    $tmplCells = this.grid.$hRowTmpl.eq(0).children('td')
    $tmplCells.each((i, ele) =>
    {
        retArr.push(ele.innerText)
    })

    return retArr
};

ADataGrid.prototype.getAllColumnInfo = function()
{
    let retObj = this.grid.getAllColumnInfo()

    if(this.pivotGrid) 
    {
        let pivotObj = this.pivotGrid.getAllColumnInfo()
        retObj.children = pivotObj.children.concat(retObj.children)
    }

    return retObj
};

ADataGrid.prototype.getColumnCount = function()
{
    return this.getPivotColumnCount()+this.grid.getColumnCount()
};

ADataGrid.prototype.getPivotColumnCount = function()
{
    return this.pivotGrid ? this.pivotGrid.columnCount : 0
}

ADataGrid.prototype.showHeader = function()
{
	this.grid.showHeader();
	if(this.pivotGrid) this.pivotGrid.showHeader();
	
};

ADataGrid.prototype.hideHeader = function()
{
	this.grid.hideHeader();
	if(this.pivotGrid) this.pivotGrid.hideHeader();
};

ADataGrid.prototype.showFooter = function()
{
	this.grid.showFooter();
	if(this.pivotGrid) this.pivotGrid.showFooter();
};

ADataGrid.prototype.hideFooter = function()
{
	this.grid.hideFooter();
	if(this.pivotGrid) this.pivotGrid.hideFooter();
};

//colIdx is Number or Number Array 
ADataGrid.prototype.showColumn = function(colIdx)
{
    //배열이 아니면
    if(colIdx.length==undefined) colIdx = [colIdx]

    let pivotColumn = this.getPivotColumnCount()

    colIdx.forEach((idx)=>
    {
        idx = this._chgKeyToInx(idx)

        if(idx<0) return

        if(idx<pivotColumn) this.pivotGrid.showColumn(idx)
        else this.grid.showColumn(idx-pivotColumn)
    })

    this.updateDataGrid(true)
};

ADataGrid.prototype.hideColumn = function(colIdx)
{
    //배열이 아니면
    if(colIdx.length==undefined) colIdx = [colIdx]

    let pivotColumn = this.getPivotColumnCount()

    colIdx.forEach((idx)=>
    {
        idx = this._chgKeyToInx(idx)

        if(idx<0) return
        
        if(idx<pivotColumn) this.pivotGrid.hideColumn(idx)
        else this.grid.hideColumn(idx-pivotColumn)
    })

    this.updateDataGrid(true);
};

//임의로 활성화 시킬 경우 호출
ADataGrid.prototype.enableScrollIndicator = function()
{
	this.scrlView._enableScrollIndicatorX();
	this.scrollBarV.enableScrollIndicator();
}

ADataGrid.prototype._applyOptionToChild = function()
{
	this.grid.setOption(this.option);

	//그리드의 fullRowSelect 가 작동되지 않도록
	//데이터그리드는 자체적으로 처리한다.
	this.grid.option.isFullRowSelect = false;
	

	//데이터 그리드는 무조건 로우템플릿을 제거하므로 
	if(!this.isDev()) this.grid.removeAll();

	if(this.option.isPivotGrid)
	{
		this.pivotGrid.setOption(this.option);
		this.pivotGrid.option.isFullRowSelect = false;
	
		if(!this.isDev()) this.pivotGrid.removeAll();
	}

	if(this.option.isColumnResize)
	{
		this.grid.columnResizable((width, inx)=> 
        {
            if(this.delegator && this.delegator.onResizeColumn) 
            {
                this.delegator.onResizeColumn(this, inx, width)
            }

            if(this.option.isWidthChangable)
                this.updateDataGrid(true)
        })

		if(this.option.isPivotGrid) this.pivotGrid.columnResizable()
	}
	
};

ADataGrid.prototype._updateScrollBarH = function()
{
    let scrlSize = this.scrlView.$ele.width()

    if(scrlSize)
    {
        let pivotAdd = 0
        
        if(this.pivotGrid) pivotAdd = this.pivotGrid.getWidth()

        this.scrollBarH.setScrollArea(scrlSize, 0, 1)
        this.scrollBarH.setDataCount(this.grid.$ele.width()+pivotAdd)
    }
};

ADataGrid.prototype.updatePosition = function(width, height)
{
	AView.prototype.updatePosition.call(this, width, height);
	
    let scrlSize = this.grid.scrollArea.height();

    if(scrlSize)
	    this.scrollBarV.setScrollArea(scrlSize, this.grid.hRowTmplHeight, this.grid.rowTmplHeight);
	
    this._updateScrollBarH()
	
	if(!this.isDev())
	{
		this._resetInitRow(true);
		this._renderData();
	}
};

//좌우 스크롤시 보여지는 컬럼만 갱신하기 위해 startCol 과 endCol 의 값을 구한다.
ADataGrid.prototype.checkColPos = function()
{
	let chkStart = this.scrlView.element.scrollLeft, 
		chkEnd = chkStart + this.scrlView.element.clientWidth - 17;
	
    let cells = this.grid.getRow(0);
    if(!cells) return;

    cells = cells.children;

	let end = cells.length, sum = 0, i = 0;
	
	for(; i<end; i++)
	{
		sum += cells[i].offsetWidth;
		
		if(sum>chkStart) 
		{
			this.startCol = i++;
			break;
		}
	}
	
	for(; i<end; i++)
	{
		sum += cells[i].offsetWidth;
		
		if(sum>chkEnd || i+1 == end) 
		{
			this.endCol = i;
			break;
		}
	}
		
	//console.log(this.startCol + ', ' + this.endCol);
};

ADataGrid.prototype.resetColPos = function()
{
	this.startCol = 0;
	this.endCol = this.grid.getColumnCount() - 1;
};


ADataGrid.prototype.clearSelected = function()
{
	//기존에 선택되어져 있는 선택정보를 지운다. 원본 obj 의 원소가 지워지는 것이 아니므로
	for(var i=0; i<this.selObjs.length; i++)
	{
		this.selObjs[i].select = undefined;
		this.selObjs[i].parentDataArr = undefined;
	}

	this.selObjs.length = 0;
};

ADataGrid.prototype.addSelectObj = function(selObj, existCheck)
{
	if(existCheck)
	{
		//기존에 원소가 존재하면 지우고 추가 실패이므로 return false
		if(this.removeSelectObj(selObj)>-1) return;
	}
	
	selObj.select = true;
	
	this.selObjs.push(selObj);
};

//selObj 가 존재하지 않으면 -1 리턴
ADataGrid.prototype.removeSelectObj = function(selObj)
{
	var inx = this.selObjs.indexOf(selObj);
	
	if(inx>-1) 
	{
		selObj.select = undefined;
		selObj.parentDataArr = undefined;
		
		this.selObjs.splice(inx, 1);
	}
	
	return inx;
};

ADataGrid.prototype._getAddVal = function(grid)
{
    //피봇그리드가 존재하면서 스크롤 그리드의 셀을 선택한 경우
	if(this.pivotGrid && grid===this.grid) return this.pivotGrid.columnCount
    else return 0
};

ADataGrid.prototype._gridClickManage = function(acomp, info, e)
{
	let cell = info[0], evtObj = {}, pos = acomp.indexOfCell(cell)

	evtObj.isHeader = cell.isHeader;

    //cell 을 못 찾은 경우
    if(pos[0] < 0) return evtObj;
	
	let	rowInx = this.dataInx + pos[0],
		colInx = this._getAddVal(acomp) + pos[1],
		parentDataArr = this.showArr2[rowInx];

	//헤더를 클릭한 경우
	if(cell.isHeader)
	{
		evtObj.rowInx = 0;
		evtObj.colInx = colInx;

        if(this.option.isSortable) this.sortColumn(colInx, cell);
	}
	
	//body cell 을 클릭한 경우
	else
	{
		var isClear = (this.option.isSingleSelect || !e.ctrlKey);	//싱글 셀렉트가 아니고 컨트롤키가 눌리면 
		
		if(isClear) this.clearSelected();

		var obj;
			
		evtObj.rowInx = rowInx;
		evtObj.colInx = colInx;

		if(this.option.isFullRowSelect) 
		{
			var colCnt = this.grid.columnCount;
			
			if(this.pivotGrid) colCnt += this.pivotGrid.columnCount;
			
			for(var i=0; i<colCnt; i++)
			{
				obj = parentDataArr[i];
				
				if(obj)
				{
					obj.parentDataArr = parentDataArr;

					this.addSelectObj(obj, !isClear);

					//클릭한 셀만 체크
					if(i==colInx)
					{
						//type은 checkbox 또는 radio 임
						if(obj.type) obj.checked = !obj.checked;
					}
				}
			}
			
			evtObj.selObj = parentDataArr;
		}
		else
		{
			obj = parentDataArr[colInx];
			
			if(obj)
			{
				//향후에 obj 만으로 자신의 배열상의 인덱스를 얻기 위해 저장해 둠.
				obj.parentDataArr = parentDataArr;

				this.addSelectObj(obj, !isClear);

				evtObj.selObj = obj;

				//type은 checkbox 또는 radio 임
				if(obj.type) obj.checked = !obj.checked;
			}
		}
		
		this._renderData();
	}
	
	return evtObj;
};

ADataGrid.prototype._onScrollX = function(acomp, info, e)
{
	this.scrlView.element.scrollLeft = info;
	
	if(!this.isScrollingX) 
	{
		this.isScrollingX = true;
		this.isScrollingY = false;
		
		//좌우스크롤이 시작되는 시점에 초기화하고 화면 갱신
		this.resetColPos();
        if(this.mergeEnabled) this._resetInitRow(true);
		this._renderData();
	}
	
	
};

ADataGrid.prototype._onScrollY = function(acomp, info, e)
{
	//중간쯤 스크롤되어져 있다가 데이터를 모두 삭제하는 경우도 스크롤 이벤트 발생. 
	if(this.showArr2.length==0) return;
	
	var newInx = 0;

	if(this.scrollBarV.isScrollBottom()) 
	{
		newInx = this.showArr2.length - this.scrollBarV.getCountPerArea();
		
		// removeAll 되는 경우 스크롤이벤트가 발생한다.
		// 그 때 위의 dataInx 구하는 방식으로는 음수가 나오게 되므로 최소값인 0으로 세팅한다.
		if(newInx < 0) newInx = 0;
		
		if(this.aevent.scrollbottomBind) this.reportEvent('scrollbottom', null, e);	

        //하단에 가려져 있던 그리드 로우를 보여준다.
        if(this.pivotGrid) this.pivotGrid.scrollToBottom()
        this.scrollMoved = this.grid.scrollToBottom()

        //console.log('================= ', this.scrollMoved)
	}
	else 
	{
		//if(this.aevent.scrolltopBind && this.scrollBarV.isScrollTop()) this.reportEvent('scrolltop', null, e);

        if(this.scrollBarV.isScrollTop()) 
        {
            if(this.aevent.scrolltopBind) this.reportEvent('scrolltop', null, e);
            
            //상단에 가려져 있던 그리드 로우를 보여준다.
            if(this.pivotGrid) this.pivotGrid.scrollToTop()
            this.grid.scrollToTop()

            this.scrollMoved = 0
        }

        info -= this.scrollMoved
        if(info<0) info = 0
	
		newInx = Math.floor(info/this.grid.rowTmplHeight);
	}

    //console.log(this.dataInx, newInx)
	
	//값이 달라진 경우만 렌더링 되도록
	if(newInx != this.dataInx) 
	{
		this.dataInx = newInx;
		
		if(!this.isScrollingY) 
		{
			this.isScrollingY = true;
			this.isScrollingX = false;

			//상하 스크롤이 시작되는 시점에 체크
			this.checkColPos();
		}
		
		//셀에 추가된 스타일의 변경과 머지된 그리드의 스크롤을 위해 필요.
        //아래 코드로 성능 저하가 발생한다. 필요없는 경우 안 할 수 있도록 
        //머지된 그리드로 셋팅한 경우만 리셋되도록
		if(this.mergeEnabled) this._resetInitRow(true);
		
		this._renderData();
	}
};

//	모든 row 를 지우고 현재의 데이터와 상황에 맞게 row 를 다시 추가한다.
ADataGrid.prototype._resetInitRow = function(isReset)
{
	var areaCnt = this.scrollBarV.getCountPerArea();
	var renderCnt = Math.min(areaCnt, this.showArr2.length);

	//화면이 안 보여지고 있는 경우는 -1이 리턴된다.
	if(areaCnt<0) return;
	
	//isReset 을 생략한 경우는 자동으로 계산해 준다.
	//if(isReset==undefined) isReset = (this.showArr2.length<=areaCnt);
	if(isReset==undefined) isReset = (this.renderRowCnt!=areaCnt || this.showArr2.length<areaCnt);
	
	if(isReset)
	{
		this.isScrollingX = false;
		this.isScrollingY = false;
	
		if(this.scrollMoveState)
		{
			// touchmove 이벤트 중에... element 가 제거되면 무브 이벤트가 중단되므로 
			// 최초 이동시에는 숨긴다.
			if(this.scrollMoveState==1)
			{
				if(this.pivotGrid) this.pivotGrid.tBody.children().hide();
				this.grid.tBody.children().hide();
			}
			else 
			{
				//계속해서 추가된 돔이 많아지면 성능이 저하되므로 무브 이벤트 이후에 추가된 로우는 제거한다.
				if(this.pivotGrid) this.pivotGrid.tBody.find(':visible').remove();
				this.grid.tBody.find(':visible').remove();
			}
		}
		
		var infoArr2 = [];
		infoArr2.length = renderCnt;

		for(var i=0; i<renderCnt; i++)
			infoArr2[i] = [];

		if(this.scrollMoveState)
		{
			this.scrollMoveState = 2;
		
			//새로 추가되는 로우가 숨겨진 로우 앞으로 와야 하므로 prepend 를 true 로 셋팅
			if(this.pivotGrid) this.pivotGrid.addRows(infoArr2, null, true);
			this.grid.addRows(infoArr2, null, true);
		}
		else
		{
			if(this.pivotGrid) this.pivotGrid.setRows(infoArr2);
			this.grid.setRows(infoArr2);
		}

		this.renderRowCnt = renderCnt;
		this.checkColPos();

        if(!this.option.isHideHScrollbar) this._updateScrollBarH()

        //console.log(this.renderRowCnt)
	}

};

//현재의 index 및 offset 정보로 부터 데이터를 얻어와 그리드 셀의 각 값을 갱신한다.
//즉, 화면을 다시 그리는 일을 한다.
ADataGrid.prototype._renderData = function()
{
	var end = this.dataInx + this.renderRowCnt, 
		i = this.dataInx, j = 0;
		
	if(end>this.showArr2.length) end = this.showArr2.length;

	if(this.pivotGrid) this.pivotGrid.clearSelected();

	this.grid.clearSelected();

	var dataOffset = this.getPivotColumnCount()
	
	for(; i<end; i++)
	{
		if(this.pivotGrid) this._setRowsByObj(this.pivotGrid, i, j, this.showArr2[i]);
		
		this._setRowsByObj(this.grid, i, j++, this.showArr2[i], this.startCol, this.endCol, dataOffset);
	}
};

//onDataGridInputChange(ADataGrid, dataObj, event)
//onDataGridInputClick(ADataGrid, dataObj, event)
//onResizeColumn(ADataGrid, inx, width)
//onMoveColumn(ADataGrid, fromInx, toInx)
ADataGrid.prototype.setDelegator = function(delegator)
{
	this.delegator = delegator;
};


ADataGrid.prototype.enableScrlManagerY = function()
{
	if(this.scrlManagerY) return this.scrlManagerY;
	
	var thisObj = this;
	
	this.scrlManagerY = new ScrollManager();
	this.scrlManagerY.setOption({moveDelay: 5});
	
	this.scrlManagerY.setStopCallback(function()
	{
		//스크롤이 완료되면 값을 리셋한다.
		thisObj.scrollMoveState = 0;
	
		if(thisObj.pivotGrid) thisObj.pivotGrid.tBody.find(':hidden').remove();
		thisObj.grid.tBody.find(':hidden').remove();
	});
	
	this._scrollImplementY();
	
	return this.scrlManagerY;
};

ADataGrid.prototype.enableScrlManagerX = function()
{
	if(this.scrlManagerX) return this.scrlManagerX;
	
	var thisObj = this;
	
	this.scrlManagerX = new ScrollManager();
	this.scrlManagerX.setOption({moveDelay: 10});
	
	this._scrollImplementX();
	
	return this.scrlManagerX;
};


ADataGrid.prototype._scrollImplementY = function() 
{
	var thisObj = this,
		isDown = false,	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
		scrlArea = this.element;
		
	//--------------------------------------------------------
	//	scroll 그리드 
	
	//touch start
	AEvent.bindEvent(scrlArea, AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		thisObj.isScrollingY = false;
		thisObj.isScrollingX = false;
		
		thisObj.scrlManagerY.initScroll(e.changedTouches[0].clientY);
		
		//setStopCallback 에서 값 0 이 된 이후에 셋팅되도록 initScroll 함수 뒤에 호출해야 한다.
		thisObj.scrollMoveState = 1;
	});
	
	//touch move
	AEvent.bindEvent(scrlArea, AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown || thisObj.isScrollingX) return;
		
		e.preventDefault();
		
		thisObj.scrlManagerY.updateScroll(e.changedTouches[0].clientY, _scrlHelper);
	});
	
	//touch end
	AEvent.bindEvent(scrlArea, AEvent.ACTION_UP, function(e)
	{
		if(!isDown || thisObj.isScrollingX) return;
		isDown = false;
		
		thisObj.scrlManagerY.scrollCheck(e.changedTouches[0].clientY, _scrlHelper);
	});
	
	
	function _scrlHelper(move)
	{
		if(move==0) return true;
		
		thisObj.scrollBarV.offsetBarPos(move);
		
		return true;
	}
};

ADataGrid.prototype._scrollImplementX = function() 
{
	var thisObj = this,
		isDown = false,	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
		scrlArea = this.scrlView.element;
		
	//--------------------------------------------------------
	//	scroll 그리드 
	
	//touch start
	AEvent.bindEvent(scrlArea, AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		thisObj.isScrollingX = false;
		thisObj.isScrollingY = false;
		
		//e.preventDefault();
		
		thisObj.scrlManagerX.initScroll(e.changedTouches[0].clientX);
		
	});
	
	//touch move
	AEvent.bindEvent(scrlArea, AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown || thisObj.isScrollingY) return;
		
		e.preventDefault();
		
		thisObj.scrlManagerX.updateScroll(e.changedTouches[0].clientX, _scrlHelper);
	});
	
	//touch end
	AEvent.bindEvent(scrlArea, AEvent.ACTION_UP, function(e)
	{
		if(!isDown || thisObj.isScrollingY) return;
		isDown = false;
		
		//e.preventDefault();
		
		thisObj.scrlManagerX.scrollCheck(e.changedTouches[0].clientX, _scrlHelper);
	});
	
	
	function _scrlHelper(move)
	{
		if(move==0) return true;
		
		thisObj.scrollBarH.offsetBarPos(move);
		
		return true;
	}
};


//-----------------------------------------------------------------------------------
//	public functions

//showArr2 의 변화값을 스크롤바에 반영하고 그리드의 각 값도 갱신한다.
//isReset : 그리드 사이즈와 데이터 구조에 맞게 보이는 로우셋을 재 생성한다.
ADataGrid.prototype.updateDataGrid = function(isReset)
{
	this.scrollBarV.setDataCount(this.showArr2.length);
	
	this._resetInitRow(isReset);
	
	this._renderData();
};

//내부적으로만 사용, _resetInitRow 함수를 호출하지 않고 업데이트 한다.
ADataGrid.prototype._noResetUpdate = function()
{
	this.scrollBarV.setDataCount(this.showArr2.length);
	
	this._renderData();
};

ADataGrid.prototype.getGridData = function()
{
	return this.dataArr2;
};

ADataGrid.prototype.getFilteredData = function()
{
	return this.showArr2;
};

//	dataArr2 is two dimension array that is composed of objects
//	object = { text: 'abc', type:'check', select:true }
//  updateType ==> 0: (update,init) 1: (noupdate,init) 2:(update,noinit)
ADataGrid.prototype.setGridData = function(dataArr2, updateType, isFiltered)
{
    dataArr2.forEach((ele, i)=>{
        dataArr2[i] = this._chgQueryToArr(ele)
    })

	if(!isFiltered) this.dataArr2 = dataArr2;
	
	this.showArr2 = dataArr2;
	
	//원본 데이터가 사라지므로 데이터만 지워주면 됨.
	if(updateType != 2)
	{
		this.selObjs.length = 0;
		this.dataInx = 0;	
	}
	
	if(!isFiltered) this._maskGridData(dataArr2);
	
	// type이 sum인 경우 위의 항목을 다 더한다.
	//this.sum();
	
	if(updateType != 1) this.updateDataGrid();
};

//filterData 가 null 이면 필터를 해제한다.
ADataGrid.prototype._setFilteredData = function(filterData, updateType)
{
	if(filterData==null) this.setGridData(this.dataArr2, updateType, false);
	else this.setGridData(filterData, updateType, true);
};

//필터를 해제한다.
ADataGrid.prototype.clearFilter = function(updateType)
{
	this._setFilteredData(null, updateType);
};

//필터를 설정 또는 해제한다.
ADataGrid.prototype.filter = function(filterFunc, updateType)
{
    if(filterFunc == null)
    {
        this.clearFilter(updateType);
    }
    else
    {
        var arr = this.dataArr2.filter(filterFunc);
        
        this._setFilteredData(arr, updateType);
    }
};

/*
const dlerIdIdx = this.findColIdx('dler_id');  // 키 값으로 해당 컬럼의 위치를 찾음

this.grdChe.filter((rowItem) => dealerIdArr.includes(rowItem[dlerIdIdx].text), 2);
*/


ADataGrid.prototype.removeAllRowData = function(noUpdate)
{
	this.dataArr2.length = 0;
    this.showArr2 = this.dataArr2;
	
	//원본 데이터가 사라지므로 데이터만 지워주면 됨.
	this.selObjs.length = 0;
	this.dataInx = 0;
	
	if(!noUpdate) this.updateDataGrid();
};

ADataGrid.prototype._maskGridData = function(rowDataArr)
{
	for(let i=0; i<rowDataArr.length; i++)
	{
		this._maskRowData(rowDataArr[i])
	}

    return rowDataArr
}

ADataGrid.prototype._maskRowData = function(rowData)
{
	let cell, pColCnt = 0, i, dataObj, retObj

	if(this.pivotGrid) pColCnt = this.pivotGrid.getColumnCount()

    for(i=0; i<rowData.length; i++)
    {
        if(i<pColCnt) cell = this.$pTmplCells[i]
        else cell = this.$tmplCells[i-pColCnt]

        if(cell.dm) 
        {
            dataObj = rowData[i]

            if(dataObj.text==undefined) 
            {
                dataObj.oriText = dataObj.value
                retObj = cell.dm.mask(dataObj.value, null, dataObj)

                if(typeof(retObj)=='object') rowData[i] = retObj
                else dataObj.value = retObj
            }
            else 
            {
                dataObj.oriText = dataObj.text
                retObj = cell.dm.mask(dataObj.text, null, dataObj)

                if(typeof(retObj)=='object') rowData[i] = retObj
                else dataObj.text = retObj
            }

            /*
            if(dataObj.text==undefined) dataObj.oriText = dataObj.value
            else dataObj.oriText = dataObj.text

            retObj = cell.dm.mask(dataObj.oriText, null, dataObj)
            if(typeof(retObj)=='object') rowData[i] = retObj
            else if(dataObj.text==undefined) dataObj.value = retObj
            else dataObj.text = retObj
            */
        }
    }

    return rowData
}

ADataGrid.prototype._maskCellData = function(colInx, cellData)
{
    let cell, pColCnt = 0

	if(this.pivotGrid) pColCnt = this.pivotGrid.getColumnCount()

    if(colInx<pColCnt) cell = this.$pTmplCells[colInx]
    else cell = this.$tmplCells[colInx-pColCnt]

    if(cell.dm) 
    {
        if(cellData.text==undefined) cellData.oriText = cellData.value
        else cellData.oriText = cellData.text

        let retObj = cell.dm.mask(cellData.text, null, cellData)
        if(typeof(retObj)=='object') cellData = retObj
        else cellData.text = retObj
    }

    return cellData
}

//queryData : { "name": "하이루", "sex": 1, "age": 28} ==> [ { "text": "하이루" }, { "text": 1 }, { "text": 28 } ]
ADataGrid.prototype._chgQueryToArr = function(queryData, keyArr)
{
    if(queryData.length==undefined)
    {
        if(keyArr==undefined) keyArr = this.oriColumnKeys
        return this.columnInds.map((inxVal)=> { return { text: queryData[keyArr[inxVal]] } })
    }
    else return queryData
}

ADataGrid.prototype._chgKeyToInx = function(key)
{
    if(typeof(key)=='string') return this.columnKeys.indexOf(key)
    else if(this.option.isColumnChange) return this.columnInds.indexOf(key)
    else return key
}

ADataGrid.prototype._moveArrEle = function(arr, fInx, tInx)
{
    arr.splice(tInx, 0, arr[fInx])

    if(fInx<tInx) arr.splice(fInx, 1)
    //뒤에 있는 원소를 앞에 삽입했으므로 인덱스를 증가시켜 준다.
    else arr.splice(fInx+1, 1)

    return arr
}

ADataGrid.prototype.getMetaData = function(row)
{
	if(typeof(row)=="number") row = this.dataArr2[row];
	
	if(row) return row._data;
	else return null;
};

ADataGrid.prototype.setMetaData = function(row, metaData)
{
	if(typeof(row)=="number") row = this.dataArr2[row];
	
	if(row) row._data = metaData;
};

//Object 형식의 데이터가 추가될 경우, 컬럼 키의 순서에 맞게 배열 데이터를 생성하기 위해 필요한 변수
//컬럼을 대표하는 키값을 배열로 가지고 있다. 최초 헤더의 컬럼 name 으로 셋팅된다.
ADataGrid.prototype.setColumnKeys = function(columnKeys)
{
    if(!columnKeys)
    {
        //헤더의 text 를 컬럼키로 사용한다.
        columnKeys = this.grid.getAllColumnName()
        if(this.pivotGrid) columnKeys = this.pivotGrid.getAllColumnName().concat(columnKeys)
    }

    this.oriColumnKeys = columnKeys

    //컬럼 이동을 위해 복사본을 만든다. 
	this.columnKeys = columnKeys.slice()

    //[0,1,2,3,4,...]
    this.columnInds = Array.from({ length: this.columnKeys.length }, (_, i) => i);
};

ADataGrid.prototype.insertRowData = function(rowInx, rowData, metaData, noUpdate)
{
    rowData = this._chgQueryToArr(rowData)

	this._maskRowData(rowData);
	this.dataArr2.splice(rowInx, 0, rowData);
	
	if(metaData) rowData._data = metaData;

	// type이 sum인 경우 위의 항목을 다 더한다.
	//this.sum();
	
	if(!noUpdate) this.updateDataGrid();
};

//rowData 는 다음 두가지 형식 모두 가능
// 1. { "name": "하이루", "sex": 1, "age": 28} 
// 2. [ { "text": "하이루" }, { "text": 1 }, { "text": 28 } ]

// 1번을 사용할 경우 this.dataGrid.setColumnKeys(['name', 'sex', 'age'])
// 호출하거나 object 의 키값과 컬럼 네임을 일치시켜줘야 한다. 
ADataGrid.prototype.addRowData = function(rowData, metaData, noUpdate)
{
    rowData = this._chgQueryToArr(rowData)
    
    this._maskRowData(rowData);
    this.dataArr2.push(rowData);
    
    if(metaData) rowData._data = metaData;

    // type이 sum인 경우 위의 항목을 다 더한다.
    //this.sum();
    
    if(!noUpdate) this.updateDataGrid();
};

ADataGrid.prototype.addRowDataArr = function(rowDataArr, metaDataArr, noUpdate)
{
    if(metaDataArr) rowDataArr.forEach((val, inx)=> this.addRowData(val, metaDataArr[inx], true) )
    else rowDataArr.forEach((val)=> this.addRowData(val, null, true) )
    
    if(!noUpdate) this.updateDataGrid();
};

//특정 row 의 전체 데이터를 덮어 쓴다.
ADataGrid.prototype.setRowData = function(rowInx, rowData, metaData, noUpdate)
{
    rowData = this._chgQueryToArr(rowData)

	this._maskRowData(rowData);
	this.dataArr2[rowInx] = rowData;
	
	if(metaData) rowData._data = metaData;
	
	if(!noUpdate) this._noResetUpdate();
};

//셀에 추가된 스타일의 변경과 머지된 그리드의 스크롤을 위해 _resetInitRow 함수 호출 필요.
//하지만 _resetInitRow 코드로 성능 저하가 발생한다. 필요없는 경우 안 할 수 있도록 
//머지된 그리드로 셋팅한 경우만 리셋되도록
ADataGrid.prototype.enableMerge = function(enabled)
{
    this.mergeEnabled = enabled 
}

//this.mergeCellData 함수와 같은 작업을 로우의 전체 cell 에 수행한다.
ADataGrid.prototype.mergeRowData = function(rowInx, rowData, noUpdate)
{
	let curRowData = this.dataArr2[rowInx];

    rowData = this._chgQueryToArr(rowData)
	
	for(let i=0; i<curRowData.length; i++)
		afc.mergeObject(curRowData[i], rowData[i]);
	
	if(!noUpdate) this.updateDataGrid(true);
};


ADataGrid.prototype.removeRowData = function(rowInx, noUpdate)
{
	if(typeof(rowInx)!="number") rowInx = this.dataArr2.indexOf(rowInx);

	this.dataArr2.splice(rowInx, 1);
	
	if(!noUpdate) this.updateDataGrid();
};

ADataGrid.prototype.getRowData = function(rowInx)
{
	return this.dataArr2[rowInx];
};

ADataGrid.prototype.getFilteredRowData = function(rowInx)
{
	return this.showArr2[rowInx];
};

//startRow, endRow 생략 시 처음부터 끝까지
//endRow -1 이면 끝까지
ADataGrid.prototype.getColumnData = function(colInx, startRow, endRow, callback)
{
    let retArr = undefined

    if(!callback) retArr = []

    if(!startRow) startRow = 0;
    if(!endRow || endRow==-1) endRow = this.showArr2.length;

    colInx = this._chgKeyToInx(colInx)

    for(let i=startRow; i<this.showArr2.length; i++)
    {
        if(callback) callback(this.showArr2[i][colInx], i)
        else retArr.push(this.showArr2[i][colInx])
    }

    return retArr
}


//특정 cell 의 데이터를 덮어 쓴다.
//cellData 는 { text: 'Hello' } 또는 'Hello' 
ADataGrid.prototype.setCellData = function(rowInx, colInx, cellData, noUpdate)
{
    colInx = this._chgKeyToInx(colInx)

    //cellData 는 Object 아니면 문자열이다.
    //즉, 문자열이면 오브젝트로 만든다.
    if(cellData.length!=undefined) cellData = { text: cellData }

	this.dataArr2[rowInx][colInx] = this._maskCellData(colInx, cellData);
	
	if(!noUpdate) this._noResetUpdate();
};

//특정 cell 의 기존 데이터와 새로운 데이터를 머지한다.
//cellData 는 { text: 'Hello' } 또는 'Hello' 
ADataGrid.prototype.mergeCellData = function(rowInx, colInx, cellData, noUpdate)
{
    colInx = this._chgKeyToInx(colInx)

	let curData = this.dataArr2[rowInx][colInx];

    if(cellData.length!=undefined) cellData = { text: cellData }
	
	afc.mergeObject(curData, this._maskCellData(colInx, cellData));
	
	if(!noUpdate) this.updateDataGrid(true);
};

ADataGrid.prototype.getCellData = function(rowInx, colInx)
{
    colInx = this._chgKeyToInx(colInx)

	return this.dataArr2[rowInx][colInx];
};

ADataGrid.prototype.sortColumn = function(colInx)
{
    if(this.sortColInx==colInx) 
    {
        this.sortInfo[colInx].order *= -1;
    }
    
    //정렬 컬럼이 바뀌면 
    else 
    {
        //이전 컬럼의 정렬 정보를 초기화
        if(this.sortColInx>-1)
        {
            this.sortInfo[this.sortColInx].order = 1;	//정렬 오름차순 1, 내림차순 -1
        
            this.sortImg.remove();
            this.sortImg = null;
        }
    
        this.sortColInx = colInx;
    }
    
    let sortImgName = this.sortInfo[colInx].order == 1? 'sort_up':'sort_down';
    // sort Image 변경
    if(this.sortImg) this.sortImg.attr('src', 'Framework/afc/image/' + sortImgName + '.png');
    else
    {
        let cell = this.getHeaderCell(colInx)
        if(cell)
        {
            this.sortImg = $('<img src="Framework/afc/image/' + sortImgName + '.png" style="vertical-align: middle; margin-left: 5px; margin-right: -21px"></img>');
            $(cell).append(this.sortImg);
        }
    }

//------------------------------------------------------------------------------------------------

    //colInx = this._chgKeyToInx(colInx)

	let order = this.sortInfo[colInx].order;
	
	this.showArr2.sort(function(a, b)
	{
		var textA = a[colInx].text;//.toUpperCase();
		var textB = b[colInx].text;//.toUpperCase();
		if (textA < textB) return -order;
		if (textA > textB) return order;
		return 0;
	});

    this.updateDataGrid(true);
};

//선택된 모든 object 들을 배열로 리턴한다. 
ADataGrid.prototype.getSelectedData = function()
{
	return this.selObjs;
};

//선택된 obj 가 포함된 부모 배열들을 배열로 리턴한다.
ADataGrid.prototype.getSelectedRowArrs = function()
{
	var retArr = [], parArr;
	
	for(var i=0; i<this.selObjs.length; i++)
	{
		parArr = this.selObjs[i].parentDataArr;
		
		if(retArr.indexOf(parArr)<0) 
		{
			retArr.push(parArr);
			
			if(this.option.isFullRowSelect) i += this.grid.columnCount - 1;
		}
	}
	
	return retArr;
};

// 데이터 목록 중 colInx 위치의 데이터가 checked 인 인덱스를 배열로 리턴하는 함수
ADataGrid.prototype.getCheckedIndices = function(colInx)
{
    if(colInx == undefined) colInx = 0;

    colInx = this._chgKeyToInx(colInx)

	let arr = [], obj, i;
	for(i=0; i<this.showArr2.length; i++)
	{
		obj = this.showArr2[i][colInx];
		
		if(obj && obj.checked)
		{
			arr.push(i);
		}
	}
	
	return arr;
};

//row array 의 인덱스를 리턴한다. row array 는 object 담고 있는 1차원 배열
ADataGrid.prototype.indexOfRowArr = function(rowArr)
{
	return this.showArr2.indexOf(rowArr);
};

//object 가 위치한 row 의 index 를 리턴한다.
ADataGrid.prototype.rowIndexOfData = function(dataObj)
{
	if(dataObj.parentDataArr) return this.showArr2.indexOf(dataObj.parentDataArr);
	else return -1;
};

//object 가 위치한 column 의 index 를 리턴한다.
ADataGrid.prototype.colIndexOfData = function(dataObj)
{
	if(dataObj.parentDataArr) return dataObj.parentDataArr.indexOf(dataObj);
	else return -1;
};

ADataGrid.prototype.setPivotGrid = function(grid)
{
	this.pivotGrid = grid;
	this.option.isPivotGrid = grid ? true : false;
	
	//현재 옵션을 그리드에 세팅하기 위해 함수 호출
	this._applyOptionToChild();
};

ADataGrid.prototype.getPivotGrid = function()
{
	return this.pivotGrid;
};

ADataGrid.prototype.setPivotGridWidth = function(width)
{
	if(this.pivotGrid) 
	{
		this.pivotGrid.setSgapH(afc.scrlWidth+'px');
		this.pivotGrid.posUtil.setSize(width, 'calc(100% - ' + afc.scrlWidth + 'px)');
		this.pivotGrid.posUtil.setStretchValue('height', afc.scrlWidth+'px');

		this.scrlView.posUtil.setPos('left', width);
		this.scrlView.posUtil.setStretchValue('left', width);
	}
};

ADataGrid.prototype.getPivotGridWidth = function()
{
	if(!this.pivotGrid) return '';
	
	return this.pivotGrid.getStyle('width');
};


ADataGrid.prototype.setMainGridWidth = function(width)
{
	this.grid.setStyle('width', width);
};

ADataGrid.prototype.getMainGridWidth = function()
{
	return this.grid.getStyle('width');
};

ADataGrid.prototype._getDataStyleObj = function()
{
	return this.grid._getDataStyleObj();
};

// object 형식의 css class 값을 컴포넌트에 셋팅한다.
// default style 값만 셋팅한다.
ADataGrid.prototype._setDataStyleObj = function(styleObj)
{
	this.grid._setDataStyleObj(styleObj);
	
	if(this.pivotGrid) this.pivotGrid._setDataStyleObj(styleObj);
};

// 매핑가능한 개수를 리턴한다.
ADataGrid.prototype.getMappingCount = function()
{
	var mappingArr = this.grid.getMappingCount();
	if(this.pivotGrid)
	{
		var pMappingArr = this.pivotGrid.getMappingCount();
		//pMappingArr[0] = 'P ' + pMappingArr[0];
		mappingArr = pMappingArr.concat(mappingArr);
	}
	
	return mappingArr;
};

ADataGrid.prototype.setRealMap = function(realField)
{
	this.realField = realField;
	// this.realMap = null; 일 경우 addPattern 이 호출되기 전에 리얼이 수신되는 경우도 있다.
	this.realMap = {};
};

ADataGrid.prototype.getRealKey = function(data)
{
	return data[this.realField];
};

ADataGrid.prototype.setData = function(dataArr)
{
	//this.removeAll();

	var data, arr, i, j, keyArr;
	
	//조회하는 경우 기존의 맵 정보를 지운다.
	if(this.realField!=null) this.realMap = {};
	
	data = dataArr[0];
	if(data && Object.prototype.toString.call(data) == '[object Array]')
	{
		keyArr = [];
		for(i=0; i<data.length; i++) 
            keyArr[i] = i;
	}
	else
	{
		keyArr = this.nameKeyArr;
		if(keyArr.length == 0) keyArr = Object.keys(data);
	}

    for(i=0; i<dataArr.length; i++)
    {
        data = dataArr[i];

        arr = this._chgQueryToArr(data, keyArr)
        
        ADataMask.setQueryData(data, keyArr, dataArr);

        this.addRowData(arr, data.row_data, true);

        //리얼맵이 활성화 되어 있으면 조회 시점에 리얼맵을 만든다.
        if(this.realField!=null) this.realMap[this.getRealKey(data)] = arr;
    }
	
	this.updateDataGrid();
};

ADataGrid.prototype.getData = function()
{
	return this.getGridData();
};

ADataGrid.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	if(queryData.isReal) 
	{
		var realType = queryData.getRealType(this);
		
		this.doRealPattern(dataArr, keyArr, queryData, realType);
	}
	else this.doAddPattern(dataArr, keyArr, queryData);
};

ADataGrid.prototype.doAddPattern = function(dataArr, keyArr, queryData)
{
	var i, j, data, arr, keyVal;
	
	//조회하는 경우 기존의 맵 정보를 지운다.
	if(this.realField!=null) this.realMap = {};
	
	for(i=0; i<dataArr.length; i++)
	{
		data = dataArr[i];

        arr = this._chgQueryToArr(data, keyArr)

		ADataMask.setQueryData(data, keyArr, queryData);

        this.addRowData(arr, data.row_data, true);
		
		//리얼맵이 활성화 되어 있으면 조회 시점에 리얼맵을 만든다.
		if(this.realField!=null) 
		{
			this.realMap[this.getRealKey(data)] = arr;
		}
	}
	
	this.updateDataGrid();
}

ADataGrid.prototype.doRealPattern = function(dataArr, keyArr, queryData, realType)
{
	let data = dataArr[0], arr, val
	
	//update
	if(realType==0)
	{
		arr = this.realMap[this.getRealKey(data)];
		
		if(!arr) return;
		
        this.columnInds.forEach((inxVal, i)=> 
        {
            arr[i].text = data[keyArr[inxVal]]
        })
	
		ADataMask.setQueryData(data, keyArr, queryData);
        
		this._maskRowData(arr);
		this._noResetUpdate();
	}
	
	else if(realType==2)
	{
		let realKey = this.getRealKey(data);
		
		arr = this.realMap[realKey];
		
		if(!arr) return;
		
		this.removeRowData(arr);
		
		delete this.realMap[realKey];
	}
	
	//insert
	else
	{
        arr = this._chgQueryToArr(data, keyArr)
		
		ADataMask.setQueryData(data, keyArr, queryData);
		
		//prepend
		if(realType==-1) this.insertRowData(0, arr, data.row_data);
		//append
		else if(realType==1) this.addRowData(arr, data.row_data);
		
		//리얼맵이 활성화 되어 있으면 추가 시점에 리얼맵을 셋팅해 준다.
		if(this.realField!=null) 
		{
			this.realMap[this.getRealKey(data)] = arr;
		}
	}
	
};

//rowData = [ {}, {}, ... ];
//{} --> { text: 'abc', type:'check', select:true, rowSpan:2 }
//{} --> { type:'sum', select:true, rowSpan:2 }
//{} --> { type:'text', value: 'Hello' }

ADataGrid.prototype._setRowsByObj = function(grid, dataInx, rowInx, rowData, start, end, dataOffset)
{
	//let $cells = $(grid.getRow(rowInx)).children();
    let cells = grid.getRow(rowInx).children;
	
	if(start==undefined) 
	{
		start = 0; 
		end = cells.length - 1;
	}
	
	if(dataOffset==undefined) dataOffset = 0;
	
	let i, obj, cell, checked = '', childEle, label, tmp;
	for(i=start; i<=end; i++)
	{
		obj = rowData[i+dataOffset];
		
		if(!obj) continue;

		//text = obj.maskdata || obj.text
		//if(text == undefined) text = ""
		
		cell = cells[i];
		
		cell.dataObj = obj;
		
		//이 코드가 들어가면 row, col 동시 머지가 안된다.
		//if(cell.style.display=='none') continue;
		
        if(cell.originStyle == undefined) cell.originStyle = cell.style.cssText;
        if(cell.originClassValue == undefined) cell.originClassValue = cell.classList.value;

		//if(obj.select) grid._addCell(cell);
		
		if(obj.type)
		{
            if(obj.type=='sequence')
            {
                if(obj.value=='desc') cell.innerHTML = this.showArr2.length - dataInx
                else cell.innerHTML = dataInx+1
                
                if(cell.shrinkInfo) AUtil.autoShrink(cell, cell.shrinkInfo)           
            }
            else if(obj.type=='select')
            {
                let opts = '<select>', isSel
                if(!obj.values) obj.values = obj.names
                for(let j=0; j<obj.names.length; j++)
                {
                    if(j==obj.selInx) isSel = 'selected'
                    else isSel = ''

                    opts += `<option value="${obj.values[j]}" ${isSel}>${obj.names[j]}</option>`
                }
                opts += '</select>'

                cell.innerHTML = opts

                childEle = cell.children[0]

                childEle.addEventListener('change', (e) =>
                {
                    let dataObj = e.target.parentNode.dataObj
                    dataObj.selInx = e.target.selectedIndex

                    if(this.delegator) 
                    {
                        e.rowIndex = dataInx
                        e.colIndex = grid.colIndexOfCell(e.target.parentNode) + this._getAddVal(grid)
                        
                        if(this.delegator.onDataGridInputChange) this.delegator.onDataGridInputChange(this, dataObj, e)
                        else console.warn('Your delegator do not have onDataGridInputChange function')
                    }
                })
            }

            // input 계열, button, checkbox, text
            else
            {
                if(obj.checked) checked = 'checked'
                else checked = ''

                if(obj.label!=undefined) label = obj.label
                else label = ''

                cell.innerHTML = `<input type="${obj.type}" value="${obj.value}" ${checked} />${label}`

                childEle = cell.children[0]

                //---------------------------------
                //  event process

                //<input type='text'>
                if(obj.type=='text')
                {
                    childEle.addEventListener('change', (e) =>
                    {
                        let dataObj = e.target.parentNode.dataObj

                        dataObj.value = e.target.value

                        if(this.delegator) 
                        {
                            e.rowIndex = dataInx
                            e.colIndex = grid.colIndexOfCell(e.target.parentNode) + this._getAddVal(grid)

                            if(this.delegator.onDataGridInputChange) this.delegator.onDataGridInputChange(this, dataObj, e)
                            else console.warn('Your delegator do not have onDataGridInputChange function')
                        }
                    })

                    childEle.addEventListener('focus', (e) =>
                    {
                        let dataObj = e.target.parentNode.dataObj
                        if(dataObj.oriText) e.target.value = dataObj.oriText
                        
                        e.target.select()
                    })

                    childEle.addEventListener('blur', (e) =>
                    {
                        /* 췰로 스크롤 하면서 블러되면 오류남. 차후에 원인 찾아서 수정하기
                        let _cell = e.target.parentNode
                        let dataObj = _cell.dataObj

                        dataObj.value = e.target.value

                        if(_cell.dm)
                        {
                            dataObj.oriText = dataObj.value

                            let retObj = _cell.dm.mask(dataObj.value, null, dataObj)
                            if(typeof(retObj)=='object') _cell.dataObj = retObj
                            else dataObj.value = retObj
                        }

                        this._renderData()
                        */
                    })
                }

                //<input type='button, checkbox, radio, ...'>
                else 
                {
                    childEle.addEventListener('click', (e) =>
                    {
                        let dataObj = e.target.parentNode.dataObj

                        if(dataObj.type=='checkbox') dataObj.checked = e.target.checked

                        if(this.delegator) 
                        {
                            e.rowIndex = dataInx
                            e.colIndex = grid.colIndexOfCell(e.target.parentNode) + this._getAddVal(grid)

                            if(this.delegator.onDataGridInputClick) this.delegator.onDataGridInputClick(this, dataObj, e)
                            else console.warn('Your delegator do not have onDataGridInputClick function')
                        }
                    })

                }

            }

		}
		
		else if(obj.text != undefined) 
		{
			cell.innerHTML = obj.text;
			
			if(cell.shrinkInfo) AUtil.autoShrink(cell, cell.shrinkInfo);
		}
		
		if(obj.rowSpan)
		{
			grid.mergeRow(rowInx, i, obj.rowSpan);
		}
		
		if(obj.colSpan)
		{
			grid.mergeCol(rowInx, i, obj.colSpan);
			i += obj.colSpan - 1;
		}
		
		//if(obj.style) cell.style.cssText += obj.style;
		//if(obj.class) cell.classList.add(obj.class);

        tmp = cell.originStyle;
        if(obj.style) tmp += ` ${obj.style}`
        cell.style.cssText = tmp;

        tmp = cell.originClassValue;
        if(obj.class) tmp += ` ${obj.class}`
        cell.classList.value = tmp;
        
        if(obj.select) grid._addCell(cell);

	}

};


//------------------------------------------------------------------------------


ADataGrid.NAME = "ADataGrid";

//scrollbar span 에 \n 이나 스페이스가 있어야 세로 스크롤바가 정상 작동한다.
//그래야 줄 바꿈이 되는 듯.
//data-flag 0100 -> 두번째 플래그 셋팅은 noChildSelect
//레이아웃트리에 하위 컴포넌트가 표현되지 않으며 캔버스에서도 선택되지 않는다.
//드래그&드랍으로 컴포넌트를 추가할 수도 없다.
ADataGrid.CONTEXT = 
{
    tag: '<div class="ADataGrid-Style" data-base="ADataGrid" data-class="ADataGrid"\
			data-selectable="true" data-fullrow-select="true" data-hide-footer="true">\
        <div class="AView-Style" data-base="AView" data-class="AView" data-sgap-height="1" data-sgap-width="1" data-stretch-height="true" data-stretch-width="true"\
		style="width: calc(100% - ' + afc.scrlWidth + 'px); height: calc(100% - ' + afc.scrlWidth + 'px); left: 0px; top: 0px; overflow: hidden; z-index: 0;">\
		<div data-base="AGrid" data-class="AGrid" class="AGrid-Style" data-selectable="true" style="width: 200%; height: 100%; left: 0px; top: 0px;">\
			<div class="grid-scroll-area">\
				<table class="grid-header-table" align="center">\
					<colgroup><col><col><col><col><col><col></colgroup>\
					<thead align="center" class="head-prop">\
						<tr height="22px"><td>col1</td><td>col2</td><td>col3</td><td>col4</td><td>col5</td><td>col6</td></tr>\
					</thead>\
				</table>\
				<table class="grid-body-table" align="center">\
					<colgroup><col><col><col><col><col><col></colgroup>\
					<tbody align="center" class="body-prop">\
						<tr height="22px"><td >1,1</td><td >1,2</td><td >1,3</td><td >1,4</td><td >1,5</td><td >1,6</td></tr>\
					</tbody>\
				</table>\
				<table class="grid-footer-table" align="center">\
					<colgroup><col><col><col><col><col><col></colgroup>\
					<tfoot align="center" class="foot-prop">\
						<tr height="22px"><td>col1</td><td>col2</td><td>col3</td><td>col4</td><td>col5</td><td>col6</td></tr>\
					</tfoot>\
				</table>\
			</div>\
		</div>\
	</div>\
	<div class="AScrollBar-Style" data-base="AScrollBar" data-class="AScrollBar" data-scroll-type="vert" data-sgap-height="1" data-stretch-height="true"\
		style="width: ' + afc.scrlWidth + 'px; height: calc(100% - ' + afc.scrlWidth + 'px); overflow-y: scroll; position: absolute; right: 0px; top: 0px; overflow-x: hidden;">\
		<span style="width: 100%; height: 0px;"></span>\n<span style="width: 100%; height: 0px;"></span></div>\
	<div class="AScrollBar-Style" data-base="AScrollBar" data-class="AScrollBar" data-scroll-type="hori" data-sgap-width="1" data-stretch-width="true"\
		style="height: ' + afc.scrlWidth + 'px; overflow-x: scroll; width: calc(100% - ' + afc.scrlWidth + 'px); position: absolute; left: 0px; bottom: 0px; overflow-y: hidden;">\
		<span style="width: 830px; height: 100%;"></span>\n<span style="width: 830px; height: 100%;"></span></div></div>',

    defStyle:
    {
        width:'500px', height:'300px'
    },
	
	flag: '0100',

    events: [ 'dblclick', 'longtab', 'select', 'scrolltop', 'scrollbottom' ]
};

