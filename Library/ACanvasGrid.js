(async function() {

afc.import("Framework/afc/component/AScrollBar.js")
afc.import("Framework/afc/event/AScrollBarEvent.js")
afc.import("Framework/afc/event/AGridEvent.js")
await afc.import("Framework/afc/component/AGrid.js")


//	*함수 호출 구조

//	updateGrid (전체 그리드를 다시 그린다)
//	--> drawBackground
//	--> drawGrid
//		--> drawData 	--> _drawRow, _drawCell
//		--> drawHeader	--> _drawRow, _drawCell

//	
//	updatePosition (컴포넌트 사이즈 변경 시점)
//  --> _setColSizeInfo
//	--> _updateCanvasSizeInfo
//	--> _setRowTmplSizeInfo
//	-->	_resetContextState

//
//	onContextAvailable (element 온전히 생성된 시점)
//	--> _makeStyleArr	--> _makeStyleObj
//	--> _makeStyleObj
//  --> _setDrawMarginInfo
//  --> _setSelectedCellStyles


//#################################
//	error.
//	[#### 완료 ####] backgroundImage 셋팅된 셀은 보더가 까맣게 그려짐.. 또는 안 그려지는 듯.
//	[#### 완료 ####] 모바일에서 배경이미지가 셀을 넘어감....
//	[#### 완료 ####] 그리드 하단과 우측 끝이 조금 짤림, 스크롤바 관련 정확히 스크롤 되게 ---> 스크롤바 데이터 셋팅 관련 확인해 보기
//                   다시 발생하는지 확인 필요! setScrollArea 함수 호출 파라미터 값 수정
//  * 그리드 헤더나 빈 공간 클릭 시 오류...
//	Todo. 
//	[#### 완료 ####] text 정렬
//	* cell control(button, check, radio...) ---> image, custom draw(drawFunction setting) 로 구현
//	* 셀렉트 표시 --> ctrl select, shift select, deselect
//	* pivot 그리드 좌우 스크롤
//	* sort, column resize, cell merge
//  * padding 변경하여 text 표시되는 Y좌표값 확인 필요
//  * isClearRowTmpl 이 아니어도 사용할 수 있게 변경, 호가그리드를 위한 사전작업?


ACanvasGrid = class ACanvasGrid extends AGrid
{
    constructor()
    {
        super()
		
		this.bodyData = [];		    //body grid data
		this.headerData = [];		//header grid data
		this.scrollY = 0;			//scroll y offset
		
		this.drawRowCount = 0;		//한 화면에 그려질 row 개수
		// this.autoWidth = 0;			//넓이가 auto 인 경우 계산된 자동 넓이
		this.rowWidth = 0;			//로우의 넓이, 보통 그리드의 넓이가 된다.
		
		//성능 개선 및 자체적인 계산 로직을 적용하기 위해 미리 구해 둔다.
		
		//-------------------------------------------------------------------------------------------
		//	updatePosition 시점에 _setRowTmplSizeInfo 함수를 호출하여 생성한다.
		this.cellSizeInfo = [];	//바디로우템플릿의 각 셀의 사이즈 정보를 가지고 있음. 2차원 배열
		this.hCellSizeInfo = [];	//헤더로우템플릿의 각 셀의 사이즈 정보를 가지고 있음. 2차원 배열
		
		this.useDoubleBuffer = true;
		this.useAniFrame = false;		//성능 테스트 용으로만 사용
		this.frameResult = 0;
		this.frameCount = 0;
		
		//--------------------------------------------
		//	스타일 정보 관련 변수들
		
		//-------------------------------------------------------------------------------------------
		// onContextAvailable 시점에 element 에 셋팅된 정보를 읽어 들인다.
		
		this.selectedStyle = null;		//AGrid 의 selectStyle 클래스에 셋팅되어져 있는 값을 읽어옴.
		this.gridBgStyle = null;		//AGrid 에 셋팅된(AGrid 전체를 감싸는 div) 기본 스타일 값을 읽어옴
		
		this.bodyRowStyles = [];		//로우템플릿의 row(tr)에 셋팅된 스타일 값을 배열로 가지고 있음(1차원 --> 여러개의 row)
		this.bodyCellStyles = [];		//로우템플릿의 cell(td)에 셋팅된 스타일 값을 배열로 가지고 있음(2차원 --> 여러개의 row 에 있는 cell들)
		this.headRowStyles = [];
		this.headCellStyles = [];
        this.selectedCellStyles = [];   //선택된 셀 스타일(2차원 --> 여러개의 row 에 있는 cell들)
    }

    beforeInit()
    {
        //캔버스 그리드는 무조건 rowTmpl 삭제
        this.option.isClearRowTmpl = true
    }

    createElement(context)
    {
        //rowTmpl 등 element를 제거하기 전에 복사하기 위함
        //확장컴포넌트라서 context가 무조건 있으므로 가능한 코딩
        //if(!context) this.cloneNode = $(window.AGrid.CONTEXT.tag)[0];
        //else this.cloneNode = context.cloneNode(true);
        this.cloneNode = context.cloneNode(true);
        this.cloneNode.id = '';
        this.cloneNode.style.display = 'none';

        super.createElement(context);
        
        this.frgm = document.createDocumentFragment();
        this.frgm.append(this.cloneNode);
    }

    setDefaultBodyInfo()
    {
        //바디데이터 영역 사이즈를 지정
        let bodyData = [];
        this.dmShrinkArr = [];
        this.$tmplTds.forEach(($cells) =>
        {
            let arr = [], rowArr = [];
            $cells.each((i, tmplCell) =>
            {
                //if(!$cell.attr('data-span')) 
                if(tmplCell.style.display != 'none')
                {
                    //템플릿의 data mask 객체를 셋팅한다.
                    arr.push({
                        dm: tmplCell.dm,
                        shrinkInfo: tmplCell.shrinkInfo
                    });

                    rowArr.push({});
                }
            })
            this.dmShrinkArr.push(arr);
            bodyData.push(rowArr);
        });
        
        //if(this.option.isClearRowTmpl == 2) this.bodyData = bodyData;
    }

    prependRow(infoArr, rowData, noUpdate)
    {
        var pushData = [], styleObj;

        //columnCount
        let i=0, obj;
        this.dmShrinkArr.forEach((arr, k) =>
        {
            arr.forEach((dmShrink, j) =>
            {
                if(infoArr[i] != null)
                {
                    if(typeof(infoArr[i])=='object') obj = infoArr[i];
                    else obj = { text: infoArr[i] };

                    if(dmShrink.dm)
                    {
                        obj.oriText = infoArr[i];
                        styleObj = obj.style;
                        if(!styleObj) styleObj = {};
                        obj.text = dmShrink.dm.mask(infoArr[i], null, styleObj);
                        for(let key in styleObj) { obj.style = styleObj; break; }
                    }
                }
                else obj = {}

                pushData.push(obj);
                i++;
            });
        });

        // for(var i=0; i<infoArr.length; i++)
        // {
        // 	if(typeof(infoArr[i])=='object') pushData.push(infoArr[i]);
        // 	else pushData.push({ text: infoArr[i] });
        // }
        
        pushData[0]._data = rowData;
        this.bodyData.splice(0, 0, pushData);
        
        this.scrlBarV.setDataCount(this.bodyData.length);
        
        if(!noUpdate) this.updateGrid();

        return pushData;
    }

    removeRow(rowIdx, noUpdate)
    {
        this.bodyData.splice(rowIdx, 1);
        
        this.scrlBarV.setDataCount(this.bodyData.length);
        
        if(!noUpdate) this.updateGrid();
    };

    _setColSizeInfo(colSizeInfo)
    {
        if(colSizeInfo) this.colSizeInfo = [];
        else colSizeInfo = this.colSizeInfo;

        let adjustedW = this._getCanvasWidth()-this.drawMarginInfo.leftW-this.drawMarginInfo.rightW;

        //1. auto O :있으면 무조건 px 우선세팅, 그이후 %세팅, 그이후 나머지 auto에서 나눠가짐
        //2. auto X && totalPx >= totalPer_to_px의 나머지값 : px 우선세팅, 그외 %가 나눠가짐
        //3. auto X && totalPx < totalPer_to_px의 나머지값 : % 우선세팅, 그외 px이 나눠가짐

        let width, changedWidth, w_1percent = adjustedW/100
        let perArr = [], pxArr = [], autoArr = [],
            totalPer = 0, totalPx = 0, countAuto = 0,
            isAuto, obj, remainW;
        for(let i=colSizeInfo.length-1; i>-1; i--)
        {
            width = colSizeInfo[i].width;

            // TODO: isColumnResize 작업하는 경우 columnResizable 에서 마지막 col 넓이를 제거하므로 수정
            // if(this.option.isColumnResize && i==colSizeInfo.length-1) width = '';

            obj = {};
            if(width && !isNaN(parseInt(width)) && width != '0%')
            {
                if(width.indexOf('%') > -1)
                {
                    perArr[i] = obj;
                    changedWidth = w_1percent*parseFloat(width);
                    totalPer += parseFloat(width);
                }
                else
                {
                    pxArr[i] = obj;
                    changedWidth = parseFloat(width);
                    totalPx += changedWidth;
                }
            }
            else
            {
                autoArr[i] = obj;
                changedWidth = w_1percent*100/this.getColumnCount()
                countAuto++;
                width = '';
                isAuto = true;
            }

            obj.width = width;
            obj.changedWidth = changedWidth;
            this.colSizeInfo[i] = obj;
        }

        //1. auto O :있으면 무조건 px 우선세팅, 그이후 %세팅, 그이후 나머지 auto에서 나눠가짐
        //2. auto X && totalPx >= totalPer_to_px의 나머지값 : px 우선세팅, 그외 %가 나눠가짐
        remainW = adjustedW - totalPx
        if(isAuto || totalPx >= (100-totalPer)*w_1percent)
        {
            //px은 그대로 두고 %, auto 의 넓이를 계산한다.

            //totalPx 은 이제 사용하지 않으므로 초기화하여 다른 변수로 사용
            totalPx = 0;
            if(totalPer > 0)
            {
                //px 제외한 넓이가 전체퍼센티지 넓이 변경한 값과 다르면 즉, 보다 작으면 남은 영역을 나눠가지기 위해 단위값을 변경한다.
                if(remainW != w_1percent*totalPer) w_1percent = remainW/totalPer;

                perArr.forEach(obj => {
                    if(!obj) return;

                    obj.changedWidth = parseFloat(obj.width) * w_1percent;
                    totalPx += obj.changedWidth;
                });
            }

            if(isAuto)
            {
                remainW = remainW - totalPx;
                autoArr.forEach(obj => {
                    if(!obj) return;
                    if(remainW > 0) obj.changedWidth = remainW/countAuto;
                    else obj.changedWidth = 0;
                });
            }
        }
        //3. auto X && totalPx < totalPer_to_px의 나머지값 : % 우선세팅, 그외 px이 나눠가짐
        else
        {
            remainW = adjustedW - totalPer*w_1percent;
            w_1percent = remainW/totalPx;
            pxArr.forEach(obj => {
                if(!obj) return;
                obj.changedWidth = parseFloat(obj.width) * w_1percent;
            });
        }

        //계산했지만 총합과 전체넓이가 다르면 조정해준다.
        let diffWidth = this.colSizeInfo.reduce((accumulator, item) => accumulator + item.changedWidth, 0);
        diffWidth = adjustedW - diffWidth;
        if(diffWidth != 0) this.colSizeInfo[this.colSizeInfo.length-2].changedWidth += diffWidth;
    }

    //조회시 단건 데이터의 업데이트, fixed grid 에서 사용함.
    doUpdatePattern(dataArr, keyArr, queryData)
    {
	    if(!dataArr || dataArr.length == 0) return;

	    let data = dataArr[0], dm, keyVal, idx = 0, styleObj;
        this.bodyData.forEach((rowArr, i) => {
            rowArr.forEach((cellData, j) => {
                keyVal = keyArr[idx++];
                if(keyVal)
                {
                    cellData.text = data[keyVal];

                    //템플릿의 data mask 객체를 셋팅한다.
                    dm = this.dmShrinkArr[i][j].dm;

                    if(dm)
                    {
                        // clearRowTmpl 은 ele 를 다시 지정할 필요가 있는지 판단 필요
                        //dm.ele = this;
                        cellData.oriText = cellData.text;
                        styleObj = {};
                        cellData.text = dm.mask(cellData.text, null, styleObj);
                        for(let key in styleObj) { cellData.style = styleObj; break; }
                    }
                }
            });
        });

        this.bodyData[0]._data = data;
        
        this.scrlBarV.setDataCount(this.bodyData.length);
        
        this.updateGrid();
    }

    doRealPattern(dataArr, keyArr, queryData, realType)
    {
        var data, row, keyVal, arr, rowArr, idx, cellData, i, j, dm, styleObj;
        
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
                    cellData = row[idx];

                    if(!cellData)
                    {
                        idx++;
                        j--;
                        continue;
                    }

                    if(keyVal)
                    {
                        cellData.text = data[keyVal];
                        
                        //템플릿의 data mask 객체를 셋팅한다.
                        dm = this.dmShrinkArr[i][j].dm;

                        if(dm)
                        {
                            // clearRowTmpl 은 ele 를 다시 지정할 필요가 있는지 판단 필요
                            //dm.ele = this;
                            cellData.oriText = cellData.text;
                            styleObj = {};
                            cellData.text = dm.mask(cellData.text, null, styleObj);
                            for(let key in styleObj) { cellData.style = styleObj; break; }
                        }
                        
                        // dm = this.dmShrinkArr[i][j].shrinkInfo;
                        // if(dm) AUtil.autoShrink(cellData, dm);	
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
                this.removeRow(this.bodyData.indexOf(rowArr[i]));
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

        this.updateGrid();
    };

//-----------------------
//  get functions
//-----------------------
    getRow(rowIdx)
    {
        return this.bodyData[rowIdx];
    }

    getCell(rowIdx, colIdx)
    {
        let row = this.bodyData[rowIdx];
        return row?row[colIdx]:null;
    }

    getRowCount()
    {
        return this.bodyData.length;
    }

    getHeaderRowCount()
    {
        return this.headerData.length;
    };

    getFooterRowCount()
    {
        return 0;
        //return this.footerData.length;
    }

    //상하좌우의 최대 보더넓이의 반 값을 구한다. 현재 leftW, rightW 등을 left, right 으로 변경하는게 보기 나을지도?
    _setDrawMarginInfo()
    {
        let bw, obj = {};
        this.drawMarginInfo = obj;
        obj.leftW = obj.rightW = obj.topH = obj.headBtmH = obj.btmH = 0;
        this.headCellStyles.forEach((headCellStyles, i) =>
        {
            bw = headCellStyles[0].borderWidth;
            if(!bw) return;
            if(Array.isArray(bw)) obj.leftW = Math.max(parseFloat(bw[3])/2, obj.leftW);
            else obj.leftW = Math.max(parseFloat(bw)/2, obj.leftW);
            
            bw = headCellStyles[headCellStyles.length-1].borderWidth;
            if(!bw) return;
            if(Array.isArray(bw)) obj.rightW = Math.max(parseFloat(bw[1])/2, obj.rightW);
            else obj.rightW = Math.max(parseFloat(bw)/2, obj.rightW);

            if(i==0)
            {
                headCellStyles.forEach(headCellStyle =>
                {
                    bw = headCellStyle.borderWidth;
                    if(!bw) return;
                    if(Array.isArray(bw)) obj.topH = Math.max(parseFloat(bw[0])/2, obj.topH);
                    else obj.topH = Math.max(parseFloat(bw)/2, obj.topH);
                })
            }

            if(i==this.headCellStyles.length-1)
            {
                headCellStyles.forEach(headCellStyle =>
                {
                    bw = headCellStyle.borderWidth;
                    if(!bw) return;
                    if(Array.isArray(bw)) obj.headBtmH = Math.max(parseFloat(bw[2])/2, obj.headBtmH);
                    else obj.headBtmH = Math.max(parseFloat(bw)/2, obj.headBtmH);
                })
            }
        });
        this.bodyCellStyles[this.bodyCellStyles.length-1].forEach(bodyCellStyle =>
        {
            bw = bodyCellStyle.borderWidth;
            if(!bw) return;
            if(Array.isArray(bw)) obj.btmH = Math.max(parseFloat(bw[2])/2, obj.btmH);
            else obj.btmH = Math.max(parseFloat(bw)/2, obj.btmH);
        })

        //console.log('drawMarginInfo', obj);
    }

    _getCanvasWidth() 
    {
        //정수로 표현됨
        let canvasWidth = this.element.clientWidth;
        if(afc.isPC) canvasWidth -= 17;
        return canvasWidth;
        //return this.getWidth() - 17;
    }

    removeAll()
    {
        if(!this.gridBgStyle) return;

        this.bodyData.length = 0;
        
        this.scrlBarV.setDataCount(this.bodyData.length);
        
        this.updateGrid();
    }
    
    _setSelectedCellStyles($tmp)
    {
        $tmp.children().addClass(this.selectStyleName);
        this._makeStyleArr($tmp, [], this.selectedCellStyles);
        this.selectedCellStyles.forEach((styles, i) =>
        {
            styles.forEach((style, j) => {
                let beforeStyle = this.bodyCellStyles[i][j];
                for(let key in style)
                {
                    if(beforeStyle[key] == style[key]) delete style[key];
                }
            })
        })
        $tmp.removeClass(this.selectStyleName);
    }
}

//window.ACanvasGrid = ACanvasGrid;

ACanvasGrid.propNames = [
    'color', 'backgroundColor', 'backgroundImage', 'backgroundRepeat', 'borderWidth', 'borderColor',
    'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft', 'whiteSpace', 'textAlign', 'fontSize', 'fontFamily'
];

//AGrid 의 이벤트 함수 오버라이드
ACanvasGrid.prototype.beforeLoadEvent = function()
{
	this.aevent.select = function() { this.selectBind = true; };
	this.aevent.scroll = function() { this.scrollBind = true; };
	this.aevent.scrolltop = function() { this.scrolltopBind = true; };
	this.aevent.scrollbottom = function() { this.scrollbottomBind = true; };
};

ACanvasGrid.prototype.init = function(context, evtListener)
{
    AGrid.prototype.init.call(this, context, evtListener);
	
	//헤더로우템플릿에 셋팅되어져 있는 데이터를 읽어온다. (this.headerData)에 셋팅
	this.setDefaultHeaderData();
    
    //바디로우템플릿에 세팅되어져 있는 dm, shrink를 읽어온다. (this.dmShrinkArr)에 셋팅
    this.setDefaultBodyInfo();
	
	//-------------------------------
	
	//기존 그리드 element 를 삭제하고 캔버스를 추가한다.
	this.$ele.children().remove();
	
	this.realCanvas = document.createElement('canvas');
    this.realCanvas.style.position = 'absolute';
    this.realCanvas.style.left = '0';
    this.realCanvas.style.backgroundColor = 'transparent';
    this.realCanvas.style.imageRendering = 'pixelated';
	this.realCtx = this.realCanvas.getContext('2d');//, { alpha: false });
	
	this.bufCanvas = document.createElement('canvas');
    this.bufCanvas.style.position = 'absolute';
    this.bufCanvas.style.left = '0';
    this.bufCanvas.style.backgroundColor = 'transparent';
    this.bufCanvas.style.imageRendering = 'pixelated';
	this.bufCtx = this.bufCanvas.getContext('2d');//, { alpha: false });
	
	//------------------------------
	
	if(this.useDoubleBuffer) this.$ele.append(this.realCanvas);
	else this.$ele.append(this.bufCanvas);
	
	//그리드 화면 스크롤 관련
	this.scrlManager = new ScrollManager();
	
	//----------------------------------
	
	//console.log(this.rowTmplHeight);
	//console.log(this.hRowTmplHeight);
	
	//----------------------------------------------
	//	캔버스 데이터를 스크롤할 스크롤바 추가
	this.scrlBarV = new AScrollBar();
	this.scrlBarV.init();
	this.scrlBarV.$ele.css({
		right: '0px',
		top: '0px',
		height: '100%'
	});
	
	this.$ele.append(this.scrlBarV.$ele);
	
	//스크롤 정보 관련 셋팅
	this.scrlBarV.addWheelArea(this.element);
	//this.scrlBarV.setScrollArea(this.$ele.height(), this.hRowTmplHeight, this.rowTmplHeight);
	this.scrlBarV.addEventListener('scroll', this, '_onScrollY');
	
	//모바일인 경우 스크롤 인디케이터가 작동되도록
	if(afc.isMobile) 
	{
		this.scrlBarV.enableScrollIndicator();
	}
	
	//----------------------------------------------
	
	//캔버스 터치를 감지하여 그리드를 스크롤되게 한다.
	this.checkTouchMove();
};

//AComponent 의 context(dom element) 가 사용 가능해지면 호출된다.
ACanvasGrid.prototype.onContextAvailable = function()
{
    this.getRootView().getElement().append(this.cloneNode);
	//let styleObj;
	
	//----------------------------------------------
	//	AGrid 의 기본 텍스트 색상과 배경 색상을 얻어 둔다.
	this.gridBgStyle = this._makeStyleObj(this.$ele);
	
	//-------------------------------------------------------------------
	//	selectedStyle -> selectedCellStyles
    //  this.selectStyleName 클래스에 셋팅되어져 있는 css 프로퍼티를 읽어 온다.
    //

    // var $tmp = $("<div>").css('display', 'none').addClass(this.selectStyleName);	//this.selectStyleName is member variable of AGrid
	//add to DOM, in order to read the CSS property
    // this.$ele.append($tmp);	
	
	// this.selectedStyle = this._makeStyleObj($tmp);
	
	// $tmp.remove();
	
	//-------------------------------------------------------------------
	//	bodyRowStyles
	//
	
	//this._makeStyleArr(this.$rowTmpl, this.bodyRowStyles, this.bodyCellStyles);
    this._makeStyleArr($(this.cloneNode.getElementsByTagName('tbody').item(0)).children(), this.bodyRowStyles, this.bodyCellStyles);
	
	//console.log('bodyCellStyles', this.bodyCellStyles);
	
	//-------------------------------------------------------------------
	//	headRowStyles
	//

    //thead 중 가장 첫번째에 위치한 것은 headerTable 의 thead
    this._makeStyleArr($(this.cloneNode.getElementsByTagName('thead').item(0)).children(), this.headRowStyles, this.headCellStyles);
	//this._makeStyleArr(this.$hRowTmpl, this.headRowStyles, this.headCellStyles);

	//console.log('headCellStyles', this.headCellStyles);
	
	//-------------------------------------------------------------------
	//	drawMarginInfo
	//

    this._setDrawMarginInfo();
	
	//-------------------------------------------------------------------
	//	colSizeInfo
	//

    $tmp = this.cloneNode.getElementsByTagName('colgroup').item(0).children;
    this.colSizeInfo = [];
    this._setColSizeInfo($tmp);
	
	//-------------------------------------------------------------------
	//	selectedCellStyles
	//
    
    $tmp = $(this.cloneNode.getElementsByTagName('tbody').item(0)).children();
    this._setSelectedCellStyles($tmp);
    
    //복사해놓은 노드 제거
    this.frgm.append(this.cloneNode);
};

ACanvasGrid.prototype._makeStyleArr = function($rowTmpl, rowStyles, cellStyles)
{
	var rowArr = null, self = this, rowStyle, tmpStyle, $tmp, parentStyle;

    rowStyles.length = cellStyles.length = 0;

    parentStyle = self._makeStyleObj($rowTmpl.parent());
    //배경색이 투명인 경우에는 제거한다.
    if(parentStyle.backgroundColor == 'rgba(0, 0, 0, 0)') delete parentStyle.backgroundColor;
	
	$rowTmpl.each(function(i)
	{
        rowStyle = self._makeStyleObj($(this));
		rowStyles.push(rowStyle);
        
        //배경색이 투명인 경우에는 제거한다.
        if(rowStyle.backgroundColor == 'rgba(0, 0, 0, 0)') delete rowStyle.backgroundColor;
		
		rowArr = [];
		
		$(this).children('td').each(function()
		{
			tmpStyle = {};
			
			//class 에 추가된 스타일 값을 뽑아 온다.
			if(this.className)
			{
				for(var name of this.classList)
				{
					$tmp = $("<div>").css('display', 'none').addClass(name);
					self.$ele.append($tmp);
					
					Object.assign(tmpStyle, self._makeStyleObj($tmp));
					
					$tmp.remove();
				}
			}
			
			//직접 셋팅된 스타일이 우선순위가 높기때문에 나중에 추가
			Object.assign(tmpStyle, self._makeStyleObj($(this)) );

            //배경색이 투명인 경우에는 제거한다.
            if(tmpStyle.backgroundColor == 'rgba(0, 0, 0, 0)') delete tmpStyle.backgroundColor;
            
            //td, tr, tbody 순으로 0번째 위치의 배경색이 투명도가 있는 경우에 상위영역의 배경색을 추가한다.
            let bgColorArr = [];
            if(tmpStyle.backgroundColor) bgColorArr.push(tmpStyle.backgroundColor);
            if(rowStyle.backgroundColor && (bgColorArr.length == 0 || bgColorArr[0].indexOf('rgba') > -1)) bgColorArr.unshift(rowStyle.backgroundColor);
            if(parentStyle.backgroundColor && (bgColorArr.length == 0 || bgColorArr[0].indexOf('rgba') > -1)) bgColorArr.unshift(parentStyle.backgroundColor);
            tmpStyle.backgroundColor = bgColorArr;
        
            rowArr.push(tmpStyle);
        });
		
		cellStyles.push(rowArr);
	});
};

//element 에 있는 특정 스타일 프로퍼티를 읽어 저장한다.
ACanvasGrid.prototype._makeStyleObj = function($ele)
{
	var styleObj = {}, val;
	for(var name of ACanvasGrid.propNames)
	{
        val = $ele.css(name);
		
		if(val && val!='none') styleObj[name] = val;
        if(name.indexOf('padding') > -1) styleObj[name] = parseFloat(styleObj[name])||0;
	}
    
    //borderWidth, borderColor 작업
    if((styleObj.borderWidth.match(' ') || styleObj.borderColor.match(/[^,] /g)))
    {
        let bwArr = styleObj.borderWidth.split(' '),
            bcArr = styleObj.borderColor.replace(/, /g, ',').split(' ')
        
        bwArr.forEach((bw, i) => bwArr[i] = parseFloat(bw));

        //0 1px -> 0 1px 0 1px
        //0 1px 2px -> 0 1px 2px 1px
        if(bwArr.length < 3) while(bwArr.length < 4) bwArr = bwArr.concat(bwArr);
        else if(bwArr.length < 4) bwArr[3] = bwArr[1];
        if(bcArr.length < 3) while(bcArr.length < 4) bcArr = bcArr.concat(bcArr);
        else if(bcArr.length < 4) bcArr[3] = bcArr[1];
        bwArr.length = bcArr.length = 4;

        styleObj.borderWidth = bwArr;
        styleObj.borderColor = bcArr;
        
        let idxInfoArr = bwArr.map((width, index) => ({
            width,
            originalIndex: index
        }));
        
        //넓이가 작고 좌-상-우-하 순서로 정렬한다.
        idxInfoArr.sort(function(a, b)
        {
            if(a.width == b.width)
            {
                if(a.originalIndex == 3) return -1;
                else if(b.originalIndex == 3) return -1;
                else return a.originalIndex - b.originalIndex;
            }
            return a.width - b.width;
        });
        styleObj.idxInfoArr = idxInfoArr;
    }
    else styleObj.borderWidth = parseFloat(styleObj.borderWidth);
	
	return styleObj;
};

//헤더로우템플릿은 정적이므로 이미 셋팅되어져 있다.
//헤더로우템플릿에 셋팅되어져 있던 데이터를 읽어와 변수(this.headerData)에 셋팅
ACanvasGrid.prototype.setDefaultHeaderData = function()
{
	var thisObj = this, $tmplCells, infoArr;
	
	this.$hRowTmpl.each(function()
	{
		$tmplCells = $(this).children('td');

        infoArr = [];
		
		$tmplCells.each(function()
		{
			infoArr.push({ text: $(this).text() });
		});
        
	    thisObj.headerData.push(infoArr);
	});
};

//캔버스 컨텍스트 관련 정보를 기본값으로 초기화
//updatePosition 함수에서 호출해 준다.
ACanvasGrid.prototype._resetContextState = function()
{
	this.bufCtx.textBaseline = 'middle';
	this.bufCtx.textAlign = 'center';
	this.bufCtx.lineWidth = '1px';
	
	this.bufCtx.font = `${this.$ele.css('font-weight')} ${this.$ele.css('font-size')} ${this.$ele.css('font-family')}`;
	
	//disable line anti
	if(afc.isPC)
	{
		//this.bufCtx.translate(0.5, 0.5);
        //this.bufCtx.translate(this.scale/2, this.scale/2);
	}
    // this.bufCtx.imageSmoothingEnabled = false;
    // this.realCtx.imageSmoothingEnabled = false;
};

//그리드의 사이즈가 변경되면 캔버스 사이즈 관련 정보도 바꿔준다.
ACanvasGrid.prototype._updateCanvasSizeInfo = function()
{
    // PC: 스크롤바 영역이 있고 Mobile: 없으므로 계산된 넓이로 표현되어야함
	var w = Math.round(this.getWidth());
	var h = this.getHeight();
	
	var scale = window.devicePixelRatio;
    scale = Math.max(scale, this.getBoundRect().width / this.getWidth());
    this.scale = scale;
	//-----------------------------------------------------------------
	//	disable blur, anti
	//	캔버스 사이즈를 크게 하고 스케일 적용해 축소해야 깨끗하게 그려진다.
	
	this.realCanvas.style.width = w + "px";
	this.realCanvas.style.height = h + "px";

	this.bufCanvas.style.width = w + "px";
	this.bufCanvas.style.height = h + "px";

	this.realCanvas.width = w * scale;
	this.realCanvas.height = h * scale;

	this.bufCanvas.width = w * scale;
	this.bufCanvas.height = h * scale;
	
	//this.realCtx.scale(scale, scale);	// <------- 얘는 하면 안됨
	this.bufCtx.scale(scale, scale);
	//-----------------------------------------------------------------	
	
	//컬럼의 넓이
	// this.autoWidth = w/this.columnCount;
	this.rowWidth = w;

	//한 화면에 그려질 row 개수
	this.drawRowCount = Math.ceil(h/this.bodyTotalHeight) + 1;	//1칸 더 그려서 나타나거나 사라지는 모습이 안 보이게
	
    //scrollPadding 에 하단보더값을 + 해줘야 하단 보더가 표현됨
	this.scrlBarV.setScrollArea(this.$ele.height(), this.headerTotalHeight+this.drawMarginInfo.btmH*2, this.bodyTotalHeight, true);
};

//AGrid 의 rowTmpl 정보로 각 셀의 사이즈 정보 배열(cellSizeInfo) 을 만든다.
ACanvasGrid.prototype._setRowTmplSizeInfo = function($rowTmpl, cellSizeInfo, cellStyles)
{
	var thisObj = this, $tmplCells, cell, info, infoArr, rowHeight, cellHeight, cStyle,
        maxRowHeight = 0, rowspanArr;
	
	// <tr></tr>  ...
    for(let i=$rowTmpl.length-1; i>-1; i--)
	//$rowTmpl.each(function(i)
	{
        $tmplCells = $rowTmpl.eq(i).children('td');
		
		infoArr = cellSizeInfo[i] = [];
		
		//화면 개발 시점에 셋팅한
		//rowTmpl 에 셋팅되어져 있는 height attribute 에서 값을 가져와야 한다.
		//parseInt 가 숫자로 변경되지 않은 경우, null, undefined ...
		rowHeight = parseInt($rowTmpl.eq(i).attr('height'));
		rowHeight = isNaN(rowHeight) ? 0 : rowHeight;
		//cellHeight = parseInt($tmplCells.eq(0).attr('height'));
		//cellHeight = isNaN(cellHeight) ? 0 : cellHeight;
		
		//cellHeight 에 셋팅되어진 값이 더 크면 rowHeight 값을 셀의 높이로 변경한다.
		//if(cellHeight>rowHeight) rowHeight = cellHeight;

        //posX = thisObj._getCanvasWidth() - thisObj.drawMarginInfo.leftW - thisObj.drawMarginInfo.rightW;
        //for(let j=$tmplCells.length-1; j>-1; j--)

        rowSpanArr = [];

        for(let j=$tmplCells.length-1; j>-1; j--)
		//$tmplCells.each(function(j)
		{
            cell = $tmplCells.get(j);
			//info 는 하나의 cell 정보
			info = infoArr[j] = {};
			
			//백그라운드 이미지나 그라디언트는 사이즈가 변경될 때마다 변경된 사이즈로 객체를 구해야 한다.
            cStyle = cellStyles[i][j];

            cellHeight = parseInt(cell.getAttribute('height'));
            cellHeight = isNaN(cellHeight) ? 0 : cellHeight;
            
            if(rowHeight <= cellHeight)
            {
                if(Array.isArray(cStyle.borderWidth)) info.height = cellHeight + cStyle.borderWidth[0]/2 + cStyle.borderWidth[2]/2;
                else info.height = cellHeight + (cStyle.borderWidth||0);
            }
            else info.height = rowHeight;

            //폰트가 표현되는 높이 > td height 인 경우에 규칙을 찾아서 넣어야 할듯
            //미리 계산해놓기, select 일 때도 셀의 폰트크기가 다른 경우에 미리 계산해서 높이가 다르면 높이를 저장해놓아야할듯
            // this.bufCtx.font = `${cStyle.fontWeight||this.$ele.css('font-weight')} ${cStyle.fontSize||this.$ele.css('font-size')} ${cStyle.fontFamily||this.$ele.css('font-family')}`;
            // let metrics = this.bufCtx.measureText('가A9*');
            // let fontHeight = metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent;
            // let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            // if(fontHeight > info.height)
            // {
            //     info.height = fontHeight;
            // }

            maxRowHeight = Math.max(maxRowHeight, info.height);
			
            //기존
            //if(!this.style.width || this.style.width=='auto') info.width = thisObj.autoWidth;

            //수정
            info.width = thisObj.colSizeInfo[j].changedWidth;
            for(let k=1; k<cell.colSpan; k++)
            {
                info.width += thisObj.colSizeInfo[j+k].changedWidth;
                infoArr[j+k].colSpan = true;
            }
            
            if(cell.rowSpan > 1) rowSpanArr.push({i,j, rowSpan: cell.rowSpan});

            if(!info.width) continue;
			
			//스타일에 background-image 속성이 있으면
			if(cStyle.backgroundImage)
			{
				//속성의 값이 이미지 url 이면
				if(cStyle.backgroundImage.indexOf('url')>-1) thisObj._getImageObj(info.width, info.height, cStyle);
				//아니면 그라디언트
				else thisObj._getGradientObj(info.width, info.height, cStyle);
			}
			
			//_getColorBgObj 함수 주석 참조
			else if(cStyle.backgroundColor)
			{
				thisObj._getColorBgObj(info.width, info.height, cStyle);
			}
			
        // }	
		}

        //계산된 최대 높이로 다시 지정한다.
        infoArr.forEach((info, i) => infoArr[i].height = maxRowHeight);
        
        rowSpanArr.forEach(({i, j, rowSpan}) =>
        {
            info = cellSizeInfo[i][j];
            for(let k=1; k<rowSpan; k++)
            {
                info.height += cellSizeInfo[i+k][j].height;
                cellSizeInfo[i+k][j].rowSpan = true;
            }
        })
	}
};

//전체 그리드를 다시 그린다.
ACanvasGrid.prototype.updateGrid = function(isUpdateFrame)
{
	//useAniFrame 이 활성화 된 경우 updateFrame 함수 외의 곳에서 호출된 경우는 리턴
	if(this.useAniFrame && !isUpdateFrame) return;

    //준비가 안 된 상태에서 그리지 않음
    if(!this.gridBgStyle) return;

	//배경 그리기
	this._drawBackground();

	//dwaw grid
	this._drawGrid();
	
	if(this.useAniFrame) this._drawDebugInfo();
	
	//buffer screen flip
	if(this.useDoubleBuffer) this.realCtx.drawImage(this.bufCanvas, 0, 0);
	// if(this.useDoubleBuffer) this.realCtx.putImageData(this.bufCtx.getImageData(0,0,this.bufCanvas.width,this.bufCanvas.height),0,0);
};

ACanvasGrid.prototype._drawDebugInfo = function()
{
	this.bufCtx.fillStyle = 'rgb(255,0,0)';
	this.bufCtx.fillText('ellapse time : ' + this.frameResult, 10, 10);
};

ACanvasGrid.prototype._drawGrid = function()
{
	this._drawData();
	
	this._drawHeader();
};

ACanvasGrid.prototype._drawBackground = function()
{
    this.bufCtx.clearRect(0, 0, this.bufCanvas.width, this.bufCanvas.height);
    this.realCtx.clearRect(0, 0, this.realCanvas.width, this.realCanvas.height);
    
    if(this.gridBgStyle.backgroundColor)
    {
		this.bufCtx.fillStyle = this.gridBgStyle.backgroundColor;
		this.bufCtx.fillRect(0,0,this.realCanvas.width, this.realCanvas.height);
    }
	//clear background
	// if(!this.gridBgStyle.backgroundColor)
	// {
	// 	this.bufCtx.clearRect(0,0,this.realCanvas.width, this.realCanvas.height);
	// }
	// else
	// {
	// 	this.bufCtx.fillStyle = this.gridBgStyle.backgroundColor;
	// 	this.bufCtx.fillRect(0,0,this.realCanvas.width, this.realCanvas.height);
	// }
};

//	그리드의 헤더 영역을 그린다.
//	
ACanvasGrid.prototype._drawHeader = function()
{
    if(this.option.isHideHeader) return;
	var len = this.headerData.length, x, y, rowData, info, infoArr, i, j, cellData, borderWidth,
		posX, posY;
	
	posY = this.headerTotalHeight + this.drawMarginInfo.topH;
	
	for(i=len-1; i>-1; i--)
	{
		rowData = this.headerData[i];
        infoArr = this.hCellSizeInfo[i];
        posY -= infoArr[0].height;

        this._drawRow(this.drawMarginInfo.leftW, posY, this.rowWidth, infoArr[0].height, this.headRowStyles[i]);
        
        // x = 0;
        // posX = this.drawMarginInfo.leftW;
        // for(j=0; j<infoArr.length; j++)
        // {
        //     cellData = rowData[x++];
        //     info = infoArr[j];

        //     //if(j>2) { posX += info.width; continue; }
        //     this._drawCell(posX, posY, info.width, info.height, cellData, this.headCellStyles[i][j]);
            
        //     posX += info.width;
        // }

        x = rowData.length-1;
        posX = this._getCanvasWidth() - this.drawMarginInfo.rightW;
        //← 방향으로 컬럼 그리기 
        for(j=infoArr.length-1; j>-1; j--)
        {
            info = infoArr[j];
            if(info.colSpan) continue;
            posX -= info.width;
            if(info.rowSpan) continue;
            cellData = rowData[x--]


            this._drawCell(posX, posY, info.width, info.height, cellData, this.headCellStyles[i][j]);
        }
	}
    // for(y=0; y<len; y++)
	// {
	// 	row = this.headerData[y];

	// 	x = 0;
	// 	for(i=0; i<this.hCellSizeInfo.length; i++)
	// 	{
	// 		infoArr = this.hCellSizeInfo[i];

	// 		posX = this.drawMarginInfo.leftW;
			
	// 		this._drawRow(posX, posY, this.rowWidth, infoArr[0].height, this.headRowStyles[i]);

	// 		for(j=0; j<infoArr.length; j++)
	// 		{
	// 			info = infoArr[j];

    //             this._drawCell(posX, posY, info.width, info.height, row[x], this.headCellStyles[i][j]);
    //             x++
	// 			posX += info.width;
	// 		}

	// 		posY += info.height;
	// 	}
	// }
};

//	그리드의 바디 영역을 그린다.
//	로우템플릿의 cellSizeInfo 에 따라, this.bodyData 중에서 화면에 보여져야할 데이터 영역을 그린다.
//
ACanvasGrid.prototype._drawData = function()
{
	var len = this.bodyData.length, x, y, rowData, info, infoArr, i, j, cellData,
		posX, posY, startY, endY;
	
	//마지막 스크롤 위치
	var endOfScroll = parseInt(this.headerTotalHeight + this.bodyTotalHeight * len - this.getHeight()) + this.drawMarginInfo.btmH*2;//+10;
	
//console.log('=========================== ', this.getHeight());	
//console.log('+++++++++++++++++++++++++++ ', this.headerTotalHeight, this.bodyTotalHeight);	
//console.log(this.scrollY, endOfScroll);
	
	// ScrollTop 인 경우나 데이터가 스크롤 영역보다 적은 경우 스크롤 안 되도록
	if(this.scrollY>0 || endOfScroll<0) this.scrollY = 0;
	
	//ScrollBottom 인 경우 스크롤 안 되도록
	else if(this.scrollY<-endOfScroll) this.scrollY = -endOfScroll;
	
	//화면에 그려질 row 의 시작 인덱스, 끝 인덱스
	startY = parseInt(this.scrollY / this.bodyTotalHeight) * -1;
	endY = Math.min(startY + this.drawRowCount, len);
	
	//console.log(startY, endY);

    posY = this.scrollY + startY*this.bodyTotalHeight;
    if(!this.option.isHideHeader) posY += this.headerTotalHeight + this.drawMarginInfo.topH;

    posY += Math.min(len - startY, this.drawRowCount)*this.bodyTotalHeight;
    
	for(y=endY-1; y>startY-1; y--)
	{
        rowData = this.bodyData[y];
		
		//x = 0;
        x = rowData.length-1;
		
		//한 줄의 rowData 는 여러줄의 로우템플릿으로 표현된다.
		for(i=this.cellSizeInfo.length-1; i>-1; i--)
		{
			infoArr = this.cellSizeInfo[i];
			posY -= infoArr[0].height;
			this._drawRow(this.drawMarginInfo.leftW, posY, this.rowWidth, infoArr[0].height, this.bodyRowStyles[i]);
			
            // posX = this.drawMarginInfo.leftW;
            // for(j=0; j<infoArr.length; j++)
            // {
            //     info = infoArr[j];

            //     this._drawCell(posX, posY, info.width, info.height, rowData[x++], this.bodyCellStyles[i][j]);
                
            //     posX += info.width;
            // }

            posX = this._getCanvasWidth() - this.drawMarginInfo.rightW;
            //← 방향으로 컬럼 그리기 
            for(j=infoArr.length-1; j>-1; j--)
            {
                info = infoArr[j];
                if(info.colSpan) continue;
                posX -= info.width;
                if(info.rowSpan) continue;
                cellData = rowData[x--]
                
                this._drawCell(posX, posY, info.width, info.height, cellData, this.bodyCellStyles[i][j], this.selectedCellStyles[i][j]);
            }
		}
	}
    // for(y=startY; y<endY; y++)
	// {
	// 	rowData = this.bodyData[y];
		
	// 	x = 0;
		
	// 	//한 줄의 rowData 는 여러줄의 로우템플릿으로 표현된다.
	// 	for(i=0; i<this.cellSizeInfo.length; i++)
	// 	{
	// 		infoArr = this.cellSizeInfo[i];
			
	// 		posX = this.drawMarginInfo.leftW;
			
	// 		this._drawRow(posX, posY, this.rowWidth, infoArr[0].height, this.bodyRowStyles[i]);
			
	// 		//컬럼 그리기
	// 		for(j=0; j<infoArr.length; j++)
	// 		{
	// 			info = infoArr[j];

	// 			this._drawCell(posX, posY, info.width, info.height, rowData[x++], this.bodyCellStyles[i][j]);
	// 			posX += info.width;
	// 		}
			
	// 		posY += info.height;
	// 	}
	// }
};

ACanvasGrid.prototype._drawRow = function(x, y, width, height, style)
{
	//셀에 셋팅된 배경색이 있으면 
	// if(style.backgroundColor) this.bufCtx.fillStyle = style.backgroundColor;
	
	// //아니면 기본 배경색
	// else this.bufCtx.fillStyle = 'transparent';
	
	// this.bufCtx.fillRect(x, y, width, height);
    if(!style.backgroundColor) return;
    this.bufCtx.fillStyle = style.backgroundColor;
    this.bufCtx.fillRect(x, y, width, height);
};

//하나의 cell 을 그린다.
ACanvasGrid.prototype._drawCell = function(x, y, width, height, cellData={}, style, selStyle)
{
    var curStyle = style, bw;
    if(cellData.style) curStyle = Object.assign({}, style, cellData.style);
	
	//선택된 셀이면 최우선으로 그린다.
	if(cellData.selected)
    {
        //curStyle = selStyle;
        curStyle = Object.assign({}, curStyle, selStyle);
        //if(selStyle.height) height = selStyle.height;
    }

    bw = curStyle.borderWidth;
    if(!Array.isArray(bw)) bw = new Array(4).fill(bw);

    // 1) cell 의 배경을 그린다.
	// 배경이 이미지면
	if(curStyle.imageCanvas) 
	{
		//this.bufCtx.drawImage(curStyle.imageCanvas, x, y);
        this.bufCtx.drawImage(curStyle.imageCanvas, x+bw[3]/2, y+bw[0]/2, width-bw[1]/2-bw[3]/2, height-bw[0]/2-bw[2]/2);
	}
	
	else 
	{
		//셀에 셋팅된 배경색이 있으면 
		// if(curStyle.backgroundColor) this.bufCtx.fillStyle = curStyle.backgroundColor;
		//아니면 기본 배경색
		// else this.bufCtx.fillStyle = 'transparent';

		// this.bufCtx.fillRect(x, y, width, height);

        if(curStyle.backgroundColor)
        {
            curStyle.backgroundColor.forEach(bgColor =>
            {
                this.bufCtx.fillStyle = bgColor;
                this.bufCtx.fillRect(x+bw[3]/2, y+bw[0]/2, width-bw[1]/2-bw[3]/2, height-bw[0]/2-bw[2]/2);
            })
        }
	}
	
	// 2) cell 의 보더를 그린다.
	this._drawBorder(x, y, width, height, curStyle, this.bufCtx);
	
	// 3) cellData 의 텍스트 그리기
    let text = cellData.text;
	if(text)
	{
        this.bufCtx.font = `${curStyle.fontWeight||this.$ele.css('font-weight')} ${curStyle.fontSize||this.$ele.css('font-size')} ${curStyle.fontFamily||this.$ele.css('font-family')}`;

		if(curStyle.color) this.bufCtx.fillStyle = curStyle.color;
		else this.bufCtx.fillStyle = this.gridBgStyle.color;

        let pLeft = curStyle.paddingLeft || style.paddingLeft, pRight = curStyle.paddingRight || style.paddingRight,
            pTop = curStyle.paddingTop || style.paddingTop || 0, pBtm = curStyle.paddingBottom || style.paddingBottom || 0,
            left, top = y + pTop + (height-pBtm-pTop)/2;

        
        this.bufCtx.textAlign = curStyle.textAlign || style.textAlign || 'center';
        if(this.bufCtx.textAlign == 'center') left = x + width/2 + pLeft - pRight;
        else if(this.bufCtx.textAlign == 'right') left = x + width - pRight;
        else left = x + pLeft;
        
        this.bufCtx.fillText(text, left, top, width-pLeft-pRight);
        
        //줄바꿈한다면 아래 내용 참고하여 개선(기존 그리드에 글자크기 및 줄바꿈하여 높이가 달라지는 부분도 추가로 생각하기)
        // let metrics = this.bufCtx.measureText(text), remainText = '';
        // while(pLeft + metrics.width + pRight > width)
        // {
        //     remainText = text.substring(text.length-1) + remainText;
        //     text = text.substring(0, text.length-1);
        //     metrics = this.bufCtx.measureText(text);
        // }

        // if(curStyle.whiteSpace != 'nowrap' && remainText)
        // {
        //     this.bufCtx.fillText(text, left, top - (metrics.fontBoundingBoxDescent));
        //     this.bufCtx.fillText(remainText, left, top + (metrics.fontBoundingBoxAscent));
        // }
		// else this.bufCtx.fillText(text, left, top);
	}
};

ACanvasGrid.prototype._drawBorder = function(x, y, width, height, style, ctx)
{
	if(style.borderWidth=='0px') return;

    if(Array.isArray(style.borderWidth))
    {
        let bwArr = style.borderWidth,
            bcArr = style.borderColor,
            idxInfoArr = style.idxInfoArr;
        
        //넓이가 작고 좌-상-우-하 순서로 그린다.
        for(let j=0; j<idxInfoArr.length; j++)
        //for(let i=3; i>-1; i--)
        {
            let i = idxInfoArr[j].originalIndex;

            //↑, → 의 보더보다 ↓, ← 의 보더 넓이가 넓은 경우에는 그리지 않는다.
            //if(i<2 && (bw < bwArr[i+2])) continue;

            stroke_helper(i);
        }

        function stroke_helper(i)
        {
            let bw = bwArr[i];
            if(!bw) return;

            let bc = bcArr[i];
            ctx.beginPath();
            ctx.strokeStyle = bc;
            ctx.fillStyle = bc;
            ctx.lineWidth = bw;

            //현재 인덱스가 연관된 보더의 우선순위보다 높은 경우인지를 판단하여 +- 처리해야할지도..
            
            if(i==0)
            {
                //ctx.fillRect(x, y, width, bw);
                //ctx.moveTo(Math.round(x-bwArr[3]/2), y),ctx.lineTo(x+width, y);
                //ctx.moveTo(x-bwArr[3]/2, y),ctx.lineTo(x+width+bwArr[1]/2, y);
                //ctx.fillRect(Math.round(x-bwArr[3]/2), Math.round(y-bw/2), Math.round(width+bwArr[1]/2+bwArr[3]/2), bw);
                ctx.fillRect((x-bwArr[3]/2), (y-bw/2), (width+bwArr[1]/2+bwArr[3]/2), bw);
            }
            else if(i==1)
            {
                //ctx.moveTo(x+width, Math.round(y-bwArr[0]/2)),ctx.lineTo(x+width, Math.round(y+height+bwArr[2]/2));
                //ctx.fillRect(Math.round(x+width-bw/2), Math.round(y-bwArr[0]/2), bw, Math.round(height+bwArr[0]/2+bwArr[2]/2));
                ctx.fillRect((x+width-bw/2), (y-bwArr[0]/2), bw, (height+bwArr[0]/2+bwArr[2]/2));
            }
            //else if(i==2) ctx.moveTo(x-bwArr[3]/2, y+height),ctx.lineTo(x+width+bwArr[1]/2, y+height);//ctx.fillRect(Math.round(x-bwArr[3]/2), Math.round(y+height-bw/2), Math.round(width+bwArr[3]/2+bwArr[1]/2), bw);
            else if(i==2)
            {
                // ctx.moveTo(x, y+height),ctx.lineTo(x+width, y+height);
                //ctx.fillRect(Math.round(x-bwArr[3]/2), Math.round(y+height-bw/2), Math.round(width+bwArr[3]/2+bwArr[1]/2), bw);
                ctx.fillRect(x-bwArr[3]/2, y+height-bw/2, width+bwArr[3]/2+bwArr[1]/2, bw);
            }
            else if(i==3)
            {
                // if(y==0) ctx.moveTo(x, y-bwArr[0]/2),ctx.lineTo(x, y+height+bwArr[2]);
                // else ctx.moveTo(x, y+bwArr[0]/2),ctx.lineTo(x, y+height+bwArr[2]);
                //ctx.fillRect(Math.round(x-bw/2), Math.round(y-bwArr[0]/2), bw, Math.round(height+bwArr[0]+bwArr[2]));
                ctx.fillRect((x-bw/2), (y-bwArr[0]/2), bw, (height+bwArr[0]/2+bwArr[2]/2));

                //ctx.moveTo(x, y-bwArr[0]/2),ctx.lineTo(x, y+height+bwArr[2]);
            }

            // if(i==0) ctx.moveTo(x, y-bw),ctx.lineTo(x+width, y-bw);
            // else if(i==1) ctx.moveTo(x+width, y),ctx.lineTo(x+width, y+height);
            // else if(i==2) ctx.moveTo(x+width, y+height-bw),ctx.lineTo(x, y+height-bw);
            // else if(i==3) ctx.moveTo(x, y+height),ctx.lineTo(x, y);
            ctx.closePath();
            ctx.stroke();
        }
    }
    else
    {
        ctx.strokeStyle = style.borderColor || '#c2c2c2';
        ctx.lineWidth = parseFloat(style.borderWidth) || 1;

        //-----------------------------------------------------------------
        // border 표시 뭉개지는 현상 해결하려한 흔적. pixelated 로 해결되었을수도 있음.
        // let addX = 0, addY = 0, addW = 0, addH = 0;
        // let x1 = +(Math.floor((x*10)%10)+'e-1'),
        //     y1 = +(Math.floor((y*10)%10)+'e-1')
        
        // if(ctx.lineWidth%2==1)
        // {
        //     if(x1*ctx.lineWidth*2 < 1) width = parseInt(width) - 0.5;
        //     else width = parseInt(width) + 0.5;

        //     if(y1*ctx.lineWidth*2 < 1) height = parseInt(height) - 0.5;
        //     else height = parseInt(height) + 0.5;
        // }
        // else
        // {
        //     if(x1*ctx.lineWidth*2 < 1) width = parseInt(width);
        //     else width = parseInt(width) + 1;

        //     if(y1*ctx.lineWidth*2 < 1) height = parseInt(height);
        //     else height = parseInt(height) + 1;
        // }

	    // ctx.strokeRect(x+addX, y+addY, width+addW, height+addH);
        //-----------------------------------------------------------------

        ctx.strokeRect(x, y, width, height);
    }

	// if(style.borderColor && style.borderWidth) 
	// {
	// 	ctx.strokeStyle = style.borderColor;
	// 	ctx.lineWidth = style.borderWidth;
	// }
	// else
	// {
	// 	ctx.strokeStyle = '#c2c2c2';
	// 	ctx.lineWidth = '1px';
	// }

	// ctx.strokeRect(x, y, width, height);
};


//-----------------------------------------------------------------
//	disable blur, anti
//	캔버스 사이즈를 크게 하고 스케일 적용해 축소해야 깨끗하게 그려진다.

ACanvasGrid.prototype._getImgCanvasCtx = function(width, height)
{
	var imgCnvs = document.createElement('canvas');
   	var imgCtx = imgCnvs.getContext('2d');
		
	//var scale = window.devicePixelRatio;

	//imgCnvs.style.width = width + "px";
	//imgCnvs.style.height = height + "px";

	//imgCnvs.width = width * scale;
	//imgCnvs.height = height * scale;

	imgCnvs.width = width;
	imgCnvs.height = height;

	//imgCtx.scale(scale, scale);
	//-----------------------------------------------------------------	

    //셀 bgColor 가 rgba 가 설정되어있으면 그리드 배경색에 영향을 받으므로 추가
    if(this.gridBgStyle.backgroundColor)
    {
        imgCtx.fillStyle = this.gridBgStyle.backgroundColor;
	    imgCtx.fillRect(0, 0, width, height);
    }
	
	return imgCtx;
};


//향후에... 4면의 보더를 각각 그려야 하는 경우, 성능이 저하되므로
//기본 배경색이라 하더라도 보더까지 그려진 버퍼이미지를 만들어 그릴 경우 아래 함수를 사용한다.
ACanvasGrid.prototype._getColorBgObj = function(width, height, style)
{
	var imgCtx = this._getImgCanvasCtx(width, height);
	
	//스케일된 넓이 셋팅
	//width = imgCtx.canvas.width;
	//height = imgCtx.canvas.height;
	
	//셀에 셋팅된 배경색이 있으면 
	// if(style.backgroundColor) imgCtx.fillStyle = style.backgroundColor;
	//아니면 기본 배경색
	// else imgCtx.fillStyle = 'transparent';

	// imgCtx.fillRect(0, 0, width, height);
    
    if(style.backgroundColor)
    {
        style.backgroundColor.forEach(bgColor =>
        {
            imgCtx.fillStyle = bgColor;
            imgCtx.fillRect(0, 0, width, height);
        })
    }
	
	//this._drawBorder(0, 0, width, height, style, imgCtx);
	
	style.imageCanvas = imgCtx.canvas;
};

ACanvasGrid.prototype._getImageObj = function(width, height, style)
{
	var img = new Image();
	var url = style.backgroundImage;
	
	//괄호안의 값만 얻어온다.
	img.src = url.substring( url.indexOf('"') + 1, url.lastIndexOf('"') );

    //selected 스타일인 경우에는 onload 하기 전에 style 객체의 color, repeat 값이 제거되는 경우가 있으므로 변수로 가지고 있게 한다.
	var self = this, bgColor = style.backgroundColor, bgRepeat = style.backgroundRepeat;
	
	img.onload = function()
	{
		var imgCtx = self._getImgCanvasCtx(width, height);

		//스케일된 넓이 셋팅
		//width = imgCtx.canvas.width;
		//height = imgCtx.canvas.height;
	
        //셀에 셋팅된 배경색이 있으면 
        if(bgColor)
        {
            bgColor.forEach(color =>
            {
                imgCtx.fillStyle = color;
                imgCtx.fillRect(0, 0, width, height);
            })
        }

		imgCtx.fillStyle = imgCtx.createPattern(img, bgRepeat);
		imgCtx.fillRect(0, 0, width, height);
		
		//self._drawBorder(0, 0, width, height, style, imgCtx);

		style.imageCanvas = imgCtx.canvas;
	};

};

ACanvasGrid.prototype._getGradientObj = function(width, height, style)
{
	var strCssGradient = style.backgroundImage;
	var gradientAngle = strCssGradient.substring(strCssGradient.indexOf('(') + 1, strCssGradient.indexOf(','));

	var angle = this._prepareCssAngle(gradientAngle);
	var start = this._getRectAngleBound(width, height, angle.theta);
	var end = this._getRectAngleBound(width, height, angle.revTheta);

	var gradient = this.bufCtx.createLinearGradient(start.x, start.y, end.x, end.y);
	var grdInfos = _parseGrdStr(strCssGradient);
	
	for(var info of grdInfos)
	{
		for(var colInfo of info)
		{
			if(colInfo.length==1) colInfo[1] = 0;	//포지션 값이 없으면 0%
			else colInfo[1] = Number(colInfo[1].replace('%', ''))/100;
			
			gradient.addColorStop(colInfo[1], colInfo[0]);		//gradient.addColorStop(0.19, 'rgb(89, 111, 92)');
		}
	}
	
	var imgCtx = this._getImgCanvasCtx(width, height);

	//스케일된 넓이 셋팅
	//width = imgCtx.canvas.width;
	//height = imgCtx.canvas.height;

	imgCtx.fillStyle = gradient;
	imgCtx.fillRect(0, 0, width, height);
	
	//this._drawBorder(0, 0, width, height, style, imgCtx);
	
	style.imageCanvas = imgCtx.canvas;
	
	
	//여러개의 linear-gradient 를 파싱하여 리턴하지만 향후 사용하는 곳에서 여러개의 그라디언트 객체를 생성해서 그려야 한다.
	
	//parse sample
	//linear-gradient(45deg, #000, #ff00ff 20%, #00ffff 50%, #ffff00 80%, #0000ff);	
	//linear-gradient(90deg, rgb(89, 111, 92) 19%, rgb(162, 149, 149) 93%);
	//linear-gradient(185deg, #39adb2 0%, rgba(255, 255, 255, 0.24) 100%), linear-gradient(to top, rgba(152, 227, 230, 0.18) 0%, rgba(196, 229, 255, 0) 99%, rgba(196, 229, 255, 0) 100%);
	
	function _parseGrdStr(str)
	{
		//매번 그릴 때마다 위의 로직이 실행되면 성능이 저하되므로
		//각도와 기타 기본 정보는 최초 한번만 실행해서 찾아오고 그라디언트 객체만 만들어서 리턴하도록 한다.
		
		var grdStrArr = str.split('linear-gradient'), grd, tokenArr, i, token, colorArr, colInfo, grdInfoArr = [];
		
		//[ '(45deg, #000, #ff00ff 20%, #00ffff 50%, #ffff00 80%, #0000ff)', ... ]
		//console.log(grdStrArr);
		
		
		//공백 원소 제거
		grdStrArr.splice(0, 1);
		
		for(grd of grdStrArr)
		{
			//괄호안의 값만 얻어온다.
			grd = grd.slice(grd.indexOf('(') + 1, grd.lastIndexOf(')'));
			
			//포지션 별 컬러값을 뽑아 오기 위해 콤마로 토큰 생성
			tokenArr = grd.split(',');

			//["45deg", " #000", " #ff00ff 20%", " #00ffff 50%", " #ffff00 80%", " #0000ff"]
			//["185deg", " #39adb2 0%", " rgba(255", " 255", " 255", " 0.24) 100%", " "]
			//["185deg", " #39adb2 0%", " rgb(255", " 255", " 255) 100%", " "]
			//console.log(tokenArr);
			
			colorArr = [];
			
			for(i=0; i<tokenArr.length; i++)
			{
				token = tokenArr[i].trim();
				
				if(token.indexOf('#')>-1)
				{
					colInfo = token.split(' ');
					//console.log('color info : ', colInfo);
					
					colorArr.push(colInfo);
				}
				else if(token.indexOf('rgba')>-1)
				{
					colInfo = tokenArr[i+3].trim().split(' ');
					colInfo[0] = token + ',' + tokenArr[i+1] + ',' + tokenArr[i+2] + ', ' + colInfo[0];
					
					i += 3;
					
					//console.log('color info', colInfo);
					
					colorArr.push(colInfo);
				}
				else if(token.indexOf('rgb')>-1)
				{
					colInfo = tokenArr[i+2].trim().split(' ');
					colInfo[0] = token + ',' + tokenArr[i+1] + ',' + colInfo[0];
					
					i += 2;
					
					//console.log('color info', colInfo);
					
					colorArr.push(colInfo);
				}
			}
			
			grdInfoArr.push(colorArr);
			
		}
		
		//console.log(grdInfoArr);
		//console.log('---------------------------------------');
		
		return grdInfoArr;
	}
	
};

//-------------------------------------------------------------------------------------------

ACanvasGrid.prototype.scrollTo = function(value)
{
	this.scrollY = -value;
	
	this.updateGrid();
};

ACanvasGrid.prototype.scrollOffset = function(move)
{
	this.scrollY += move;
	
	this.updateGrid();
};

ACanvasGrid.prototype.addHeaderRow = function(infoArr, noUpdate)
{
	var pushData = [];
	for(var i=0; i<infoArr.length; i++)
	{
		if(typeof(infoArr[i])=='object') pushData.push(infoArr[i]);
		else pushData.push({ text: infoArr[i] });
	}

	this.headerData.push(pushData);
	
	if(!noUpdate) this.updateGrid();
};

//infoArr = ['a', 'b', 1, 2, ... ]
//infoArr = [ {text:'a'}, {text: 1}, 'b', 2, 3, ... ]
ACanvasGrid.prototype.addRow = function(infoArr, rowData, noUpdate)
{
	var pushData = [], styleObj;

    //columnCount
    let i=0, obj;
    this.dmShrinkArr.forEach((arr, k) =>
    {
        arr.forEach((dmShrink, j) =>
        {
            if(infoArr[i] != null)
            {
                if(typeof(infoArr[i])=='object') obj = infoArr[i];
                else obj = { text: infoArr[i] };

                if(dmShrink.dm)
                {
                    obj.oriText = infoArr[i];
                    styleObj = obj.style;
                    if(!styleObj) styleObj = {};
                    obj.text = dmShrink.dm.mask(infoArr[i], null, styleObj);
                    for(let key in styleObj) { obj.style = styleObj; break; }
                }
            }
            else obj = {}

            pushData.push(obj);
            i++;
        });
    });

	// for(var i=0; i<infoArr.length; i++)
	// {
	// 	if(typeof(infoArr[i])=='object') pushData.push(infoArr[i]);
	// 	else pushData.push({ text: infoArr[i] });
	// }
	
    pushData[0]._data = rowData;
	this.bodyData.push(pushData);
	
	this.scrlBarV.setDataCount(this.bodyData.length);
	
	if(!noUpdate) this.updateGrid();

    return pushData;
};

//그리드의 사이즈가 변경될 때마다 호출된다.
ACanvasGrid.prototype.updatePosition = function(pWidth, pHeight)
{
    AGrid.prototype.updatePosition.call(this, pWidth, pHeight);

    //변경된 넓이에 맞게 치환된 넓이정보를 갱신 후 아래 헤더, 바디 사이즈정보 처리
    this._setColSizeInfo();
	
	//헤더 로우템플릿의 사이즈 정보 갱신
	this._setRowTmplSizeInfo(this.$hRowTmpl, this.hCellSizeInfo, this.headCellStyles);
    if(this.option.isHideHeader) this.headerTotalHeight = 0;
    else this.headerTotalHeight = this.hCellSizeInfo.reduce((accumulator, item) => accumulator + item[0].height, 0);
	
	//바디 로우템플릿의 사이즈 정보 갱신
	this._setRowTmplSizeInfo(this.$rowTmpl, this.cellSizeInfo, this.bodyCellStyles);
    this.bodyTotalHeight = this.cellSizeInfo.reduce((accumulator, item) => accumulator + item[0].height, 0);
    
    this.selectedCellStyles.forEach((styles, i) => 
    {
        styles.forEach((style, j) => 
        {
            let cStyle = Object.assign({}, this.bodyCellStyles[i][j], style);
            
            let info = this.cellSizeInfo[i][j];
            if(cStyle.backgroundImage)
			{
				//속성의 값이 이미지 url 이면
				if(cStyle.backgroundImage.indexOf('url')>-1) this._getImageObj(info.width, info.height, cStyle);
				//아니면 그라디언트
				else this._getGradientObj(info.width, info.height, cStyle);
			}
			
			//_getColorBgObj 함수 주석 참조
			else if(cStyle.backgroundColor)
			{
				this._getColorBgObj(info.width, info.height, cStyle);
			}

            let beforeStyle = this.bodyCellStyles[i][j];
            for(let key in cStyle)
            {
                if(beforeStyle[key] == cStyle[key]) delete cStyle[key];
            }
            styles[j] = cStyle;
        });
    })

	//캔버스 사이즈 정보 갱신
	this._updateCanvasSizeInfo();

	//캔버스 컨텍스트를 기본값으로 리셋하고 
	this._resetContextState();
	
	if(this.useAniFrame)
	{
		if(this.aniFrame) cancelAnimationFrame(this.aniFrame);
		
		this.lastRender = Date.now();
		this._updateFrame();	//animationFrame 최초 시작 시점
	}
	else
	{
		//다시 그린다.
		this.updateGrid();
	}
	
};

ACanvasGrid.prototype._updateFrame = function()
{
	var now = Date.now();
		
	if((now-this.lastRender)>=1000) 
	{
		this.frameResult = this.frameCount;
			
		this.frameCount = 0;
		this.lastRender = now;
	}
	else 
	{
		this.frameCount++;
	}
	
	this.updateGrid(true);

	this.aniFrame = requestAnimationFrame(this._updateFrame.bind(this));
};

//캔버스 터치를 감지하여 데이터가 스크롤되도록 한다.
//터치 정보를 스크롤 매니저에게 넘겨 자연스럽게 스크롤 되도록 한다.
ACanvasGrid.prototype.checkTouchMove = function()
{
	var thisObj = this;
	
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var isDown = false, isTouchLeave = false;
	
	AEvent.bindEvent(this.realCanvas, AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		isTouchLeave = false;
		
		//e.preventDefault();
		
		thisObj.scrlManager.initScroll(e.changedTouches[0].clientY);
	});
	
	AEvent.bindEvent(this.realCanvas, AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		e.preventDefault();
		
		//var scrlArea = this;
		thisObj.scrlManager.updateScroll(e.changedTouches[0].clientY, function(move)
		{
			isTouchLeave = true;
			
			thisObj.scrollOffset(-move);
			thisObj.scrlBarV.offsetBarPos(move);
		});
	});
	
	AEvent.bindEvent(this.realCanvas, AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		//e.preventDefault();
		
		if(!isTouchLeave) thisObj._selectCellManage(e);
		
		//var scrlArea = this;
		thisObj.scrlManager.scrollCheck(e.changedTouches[0].clientY, function(move)
		{
			thisObj.scrollOffset(-move);
			thisObj.scrlBarV.offsetBarPos(move);
			return true;
		});
	});
};

//터치된 영역이 선택되도록 한다.
ACanvasGrid.prototype._selectCellManage = function(evt)
{
	let pt = this._getActionPos(evt.changedTouches[0]);
	
	//터치된 영역이 전체 데이터에서 몇번째 row 인지 
	let row = Math.floor((pt.y - this.headerTotalHeight - this.scrollY)/this.bodyTotalHeight), 
		col, sub = 0, infoArr, info, posX = 0, 
		
		//터치된 위치의 로우템플릿의 캔버스상의 y 좌표
		posY = this.scrollY + row*this.bodyTotalHeight + this.headerTotalHeight;


    //데이터가 없는 영역을 클릭한 경우
    if(this.bodyData.length<=row) return;
    if(pt.y < this.headerTotalHeight) return;

	//--------------------------------------------------------------------
	//	터치된 영역의 row 에서, 로우템플릿의 서브 <tr> 의 index 를 구한다.
	
	for(let i=0; i<this.cellSizeInfo.length; i++)
	{
		info = this.cellSizeInfo[i][0];

		if(pt.y>=posY && pt.y<=posY+info.height)
		{
			sub = i;
			break;
		}

		posY += info.height;
	}
	
	
	//----------------------------------------------------------
	//	터치된 영역의 column 값을 구한다.

	infoArr = this.cellSizeInfo[0];	//this.cellSizeInfo 는 로우템플릿의 각 셀의 정보를 가지고 있음. 2차원 배열

	for(let j=0; j<infoArr.length; j++)
	{
		info = infoArr[j];
		
		if(pt.x>=posX && pt.x<=posX+info.width)
		{
			col = j;
			break;
		}

		posX += info.width;
	}

    if(row>-1) this.selectCellRange({row:row, col:col + sub*this.columnCount}, null, evt);	//로우템플릿이 여러 <tr> 인 경우, 선택이 적용되도록 sub 값 적용
	
	if(this.aevent.selectBind) this.reportEvent('select', {row:row, col:col}, evt);
	
	this.updateGrid();
};


//	시작셀(좌상)과 끝셀(우하)을 지정하면 그 영역을 선택된 상태로 만들어 준다.
//
//	startCell = { row: 10, col: 1 }, 
//	endCell   = { row: 11, col: 3 }
//
//  로우템플릿은 내부 tr 이 여러개 있더라도 데이터의 관점에서 하나의 row 이다.
//	
ACanvasGrid.prototype.selectCellRange = function(startCell, endCell, e) 
{
	var y, x, data;
	
    //if(!e.ctrlKey) this.clearSelect();
    this.clearSelect();
	
	//fullRowSelect 값이 참이면 로우 전체를 선택한 상태로 바꿔준다.
	if(this.option.isFullRowSelect)
	{
		startCell = { row: startCell.row, col:0 };
		endCell = { row: startCell.row, col:this.columnCount*this.$rowTmpl.length-1 };	//하나의 로우템플릿 내의 <tr> 이 여러개 일 수 있다.
	}
	
	if(!endCell) endCell = startCell;
	
	for(y=startCell.row; y<=endCell.row; y++)
	{
		for(x=startCell.col; x<=endCell.col; x++)
		{
			data = this.bodyData[y][x];
            if(!data) continue;
            // 속도확인 필요
			// if(data.selected)
            // {
            //     data.selected = false;
			//     this.selectedCells.find(item => item.row==y &&item.col==x).data.selected = false;
            // }
            // else
            // {
                data.selected = true;
			    this.selectedCells.push({row:y, col:x, data: data});
            // }
		}
	}
	
	this.selectedCellRange = [startCell, endCell];
};

ACanvasGrid.prototype.clearSelect = function() 
{
	for(var i=0; i<this.selectedCells.length; i++)
	{
		this.selectedCells[i].data.selected = false;
	}
	
	this.selectedCells.length = 0;
	
	this.selectedCellRange = null;
};

ACanvasGrid.prototype.getSelectedCells = function() 
{
	return this.selectedCells;
};


/*
if(!this.selectedCellRange) return;
	
var x, y, data, startCell = this.selectedCellRange[0], endCell = this.selectedCellRange[1];
	
for(y=startCell.row; y<=endCell.row; y++)
{
	for(x=startCell.col; x<=endCell.col; x++)
	{
		data = this.bodyData[y][x];
		
	}
}
*/

//this.selectedCellRange = [ startCell, endCell ];
//startCell = { row: 10, col: 1 }
ACanvasGrid.prototype.getSelectedCellRange = function() 
{
	return this.selectedCellRange;
};


//캔버스에 발생된 터치 정보를 캔버스 좌상이 시작점이 되도록 변경 
ACanvasGrid.prototype._getActionPos = function(evt) 
{
	var rect = this.realCanvas.getBoundingClientRect();
	return {
	  x: evt.clientX - rect.left,
	  y: evt.clientY - rect.top
	};
};

ACanvasGrid.prototype._onScrollY = function(acomp, info, e)
{
	//중간쯤 스크롤되어져 있다가 데이터를 모두 삭제하는 경우도 스크롤 이벤트 발생. 
	if(this.bodyData.length==0) return;
	
	this.scrollTo(info);
	
	if(this.aevent.scrollBind) this.reportEvent('scroll', info, e);	
	
	
	if(this.aevent.scrollbottomBind && this.scrlBarV.isScrollBottom()) 
	{
		this.reportEvent('scrollbottom', info, e);	
	}
	
	else if(this.aevent.scrolltopBind && this.scrlBarV.isScrollTop()) 
	{
		 this.reportEvent('scrolltop', info, e);
	}
	
};

ACanvasGrid.prototype.renderSVGOnCanvas = function(svg) 
{
	var img = new Image();
	var ctx = this.realCtx;
	var self = this;

	img.onload = function() 
	{
		console.log("SVG drawImage()");
		//console.log(img.naturalWidth);
		//console.log(img.naturalHeight);
		ctx.drawImage(img, 0, 0);
		
		if(self.callback) 
		{
			self.callback();
		}
	};
	
	img.src = svg;

	ctx.font = "bold 12px sans-serif";
	ctx.fillStyle = "#000000";
	ctx.fillText("Foobar", 10, 10);
};

ACanvasGrid.prototype.cookSVG = function(html)
{
	var svgTemplate = "data:image/svg+xml," +
           "<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>" +
             "<foreignObject width='100%' height='100%'>" +
               "${html}" +
             "</foreignObject>" +
           "</svg>";
		   
	if(!html)
	{
		var div = $("<div>Hello World!</div>");

        div.attr("xmlns", 'http://www.w3.org/1999/xhtml');
		div.css({
           	"color" : "black",
            "background" : "yellow",
            "vertical-align" : "top",
            "text-align"  : "left",
            "font-size" : "16px",
            "font-color" : "black",
            "font-family" : "Helvetica",
			width: '800px',
			height: '800px'
        });
		
		html = div[0].outerHTML;
	}


	var data = {
		width : '800px',
		height : '800px',
		html : html
	};

	var svg = svgTemplate;

	$.each(data, function(key, value) {
		svg = svg.replace("${" + key + "}", value);
	});

	return svg;

};

//-----------------------------------------------------------------------------------------------------


ACanvasGrid.prototype._convertAngleToRadians = function(angle) 
{
    var convertedAngle = parseFloat(angle);

    //check for CSS angle keywords
    //TODO: these values are currently wrong and need to be fixed
    if (angle.indexOf('to') > -1) {
        var bottom = angle.indexOf('bottom') > -1,
            top = angle.indexOf('top') > -1,
            left = angle.indexOf('left') > -1,
            right = angle.indexOf('right') > -1;

        if (bottom) {
            //bottom left, 225deg
            if (left) {
                convertedAngle = 225;
                //bottom right, 135deg
            } else if (right) {
                convertedAngle = 135;
                //bottom, 180deg
            } else {
                convertedAngle = 180;
            }
        } else if (top) {
            //top left, 315deg
            if (left) {
                convertedAngle = 315;
                //top right, 45deg
            } else if (right) {
                convertedAngle = 45;
                //top, no rotation
            } else {
                convertedAngle = 0;
            }
            //left, 270deg
        } else if (left) {
            convertedAngle = 270;
            //right, 90deg
        } else {
            convertedAngle = 90;
        }
        convertedAngle = convertedAngle * Math.PI / 180;
    }
    else if (angle.indexOf('deg') > -1) {
        convertedAngle = convertedAngle * Math.PI / 180;
    }
    else if (angle.indexOf('grad') > -1) {
        convertedAngle = convertedAngle * Math.PI / 200;
    }
    else if (angle.indexOf('turn') > -1) {
        convertedAngle = convertedAngle * Math.PI / 0.5;
    }
    //no value, 180deg
    else if (isNaN(convertedAngle)) {
        convertedAngle = Math.PI;
    }

    return convertedAngle;
};

//takes the css angle and prepares it for the _getRectAngleBound func
ACanvasGrid.prototype._prepareCssAngle = function(angle) 
{
    var revAngle;
    var theta;
    var revTheta;

    theta = (1.5 * Math.PI) - this._convertAngleToRadians(angle);
    revTheta = theta + Math.PI;

    return { theta: theta, revTheta: revTheta };
};


//http://stackoverflow.com/questions/4061576/finding-points-on-a-rectangle-at-a-given-angle?noredirect=1&lq=1
//angle is in radians, starting position is the right side of the rectangle
//positive degrees move counter-clockwise, which is opposite of the css linear-gradient
ACanvasGrid.prototype._getRectAngleBound = function(rectWidth, rectHeight, angle) 
{
    var twoPI = Math.PI * 2;
    var theta = angle;

    while (theta < -Math.PI) {
        theta += twoPI;
    }

    while (theta > Math.PI) {
        theta -= twoPI;
    }

    var rectAtan = Math.atan2(rectHeight, rectWidth);
    var tanTheta = Math.tan(theta);
    var region;

    if (theta > -rectAtan && theta <= rectAtan) {
        region = 1;
    } else if (theta > rectAtan && theta <= Math.PI - rectAtan) {
        region = 2;
    } else if (theta > Math.PI - rectAtan || theta <= -(Math.PI - rectAtan)) {
        region = 3;
    } else {
        region = 4;
    }

    var edgePoint = { x: rectWidth / 2, y: rectHeight / 2 };
    var cx = rectWidth / 2;
    var cy = rectHeight / 2;

    switch (region) {
        case 1:
            //right
            edgePoint.x = rectWidth;
            edgePoint.y = cy - ((rectWidth / 2) * tanTheta);
            break;
        case 2:
            //top
            edgePoint.x = cx + rectHeight / (2 * tanTheta);
            edgePoint.y = 0;
            break;
        case 3:
            //left
            edgePoint.x = 0;
            edgePoint.y = cy + ((rectWidth / 2) * tanTheta);
            break;
        case 4:
            //bottom
            edgePoint.x = cx - rectHeight / (2 * tanTheta);
            edgePoint.y = rectHeight;
            break;
    }

    return {
        x: edgePoint.x,
        y: edgePoint.y,
        region: region
    };
};

                    
})();