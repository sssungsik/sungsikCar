

ResizeManager = class ResizeManager
{
	constructor(isVertical)
	{
        this.isVertical = isVertical
        this.resizeBars = []
	}

    setScaleGetter(getter)
    {
        this.getScale = getter
    }

    setResizeCallback(callback)
    {
        this.resizeCallback = callback
    }

    getScale()
    {
        return 1
    }

    updateResizeEle($resizeEles)
    {
        this.resizeBars.forEach(($ele)=>
        {
            $ele.remove()
        })

        this.resizeBars = []
        this.$resizeEles = $resizeEles
        
        let thisObj = this, pos, idx,
            colLen = this.$resizeEles.length, arr = new Array(colLen),
            endIdx = colLen - 1, scale = this.getScale()
        
        this.$resizeEles.each(function(i)
        {
            if(this.style.display == 'none') return;		//앞에서 colspan 세팅했으므로 리턴
            //if(this.getAttribute('colspan') > 1) return;	//colspan 처리시 리턴

            idx = i%colLen;

            //이미 해당 컬럼에 $sizeBar를 생성한 경우 리턴, 또는 마지막 컬럼인 경우
            if(arr[idx] || idx == endIdx) return;

            let $sizeBar = $('<div class="dev-size-bar"></div>');
            $sizeBar.css(
            {
                position: 'absolute',
                color: 'magenta',
                fontSize: '16px',
                fontWeight: 'bold',
                'white-space': 'nowrap',
                'z-index': 100,
            });

            if(thisObj.isVertical) 
            {
                pos = $(this).position().top/scale + $(this).outerHeight()

                $sizeBar.css(
                {
                    left: '0px',
                    top: pos + 'px',
                    width: '100%', 
                    height: '4px',
                });
            }
            else 
            {
                pos = $(this).position().left/scale + $(this).outerWidth()

                $sizeBar.css(
                {
                    left: pos + 'px',
                    top: '0px',
                    width: '4px', 
                    height: '100%',
                });
            }
            
            //리사이즈바가 헤더 안에서만 보이도록
            thisObj.$cntr.append($sizeBar);
            
            //생성된 리사이즈 바를 별도의 배열에 저장함
            thisObj.resizeBars[idx] = $sizeBar;
            $sizeBar._inx = idx;

            thisObj._resizeProcess($sizeBar);
            
            arr[idx] = true;
        });
    }

    enableResize($cntr, $resizeEles)
    {
        if(!$cntr)
        {
            debugger
            console.log($cntr, $resizeEles)

            return
        }

        this.$cntr = $cntr

        this.updateResizeEle($resizeEles)
    };

    _showSizeBoth($sizeBar)
    {
        let $prevEle = this.$resizeEles.eq($sizeBar._inx),
            $nextEle = this.$resizeEles.eq($sizeBar._inx+1)

        if(this.isVertical) $sizeBar.html(`<br>${$prevEle.outerHeight()}px, ${$nextEle.outerHeight()}px`)
        else $sizeBar.html(`&nbsp;${$prevEle.outerWidth()}px, ${$nextEle.outerWidth()}px`)
    }

    _showMoveSizeInfo($sizeBar, moveSize)
    {
        let $prevEle = this.$resizeEles.eq($sizeBar._inx)

        if(this.isVertical) $sizeBar.html(`<br>${$prevEle.outerHeight()+moveSize}px`)
        else $sizeBar.html(`&nbsp;${$prevEle.outerWidth()+moveSize}px`)
    }

    _resizeProcess($sizeBar)
    {
        //리사이즈 중인데 다른 resizebar 영역을 지나가면 enter 로 표시되는 버그
        let _isResizeStart = false, //리사이즈 시작여부
            thisObj = this, firstVal = 0, moveVal = 0

        $sizeBar.draggable(
        { 
            axis: thisObj.isVertical ? 'y' : 'x',
            containment: "parent",
            cursor: thisObj.isVertical ? "s-resize" : "e-resize",

            start: function(e, ui)
            {
                _isResizeStart = true;

                //$sizeBar[0].beforeLeft = $sizeBar.position().left;

                if(thisObj.isVertical) 
                {
                    firstVal = ui.position.top
                    ui.position.top = 0
                }
                else 
                {
                    firstVal = ui.position.left
                    ui.position.left = 0;
                }
            },
            
            stop: function( event, ui ) 
            {
                _isResizeStart = false;

                $sizeBar.css(
                {
                    //top: 0,//top 값이 변경되어 0으로 초기화처리
                    cursor: 'auto',
                    background: 'transparent'
                });

                thisObj._colculResizeWidth($sizeBar._inx, moveVal);
                
                //thisObj.updateBarPos();
            },

            drag: function( event, ui ) 
            {
                if(thisObj.isVertical)
                {
                    moveVal = parseInt((ui.position.top-firstVal)/thisObj.getScale())
                    thisObj._showMoveSizeInfo($sizeBar, moveVal)

                    // adjust new top by our zoomScale
                    let newTop = ui.originalPosition.top + (ui.position.top - ui.originalPosition.top) / thisObj.getScale()
                    ui.position.top = newTop;
                }
                else
                {
                    moveVal = parseInt((ui.position.left-firstVal)/thisObj.getScale())
                    thisObj._showMoveSizeInfo($sizeBar, moveVal)

                    // adjust new left by our zoomScale
                    let newLeft = ui.originalPosition.left + (ui.position.left - ui.originalPosition.left) / thisObj.getScale() 
                    ui.position.left = newLeft;
                }
               
            }
        });

        $sizeBar.mouseenter(function(e)
        {
            if(!_isResizeStart && e.which==0)
            {
                $sizeBar.css(
                {
                    cursor: thisObj.isVertical ? "s-resize" : "e-resize",
                    background: 'gray'
                });

                thisObj._showSizeBoth($sizeBar)
            }
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

                $sizeBar.html('')
            }
        });
    }

    //사이즈바가 이동한 만큼 컬럼의 사이즈를 변경해 준다.
    //단, 퍼센트로 지정한 경우는 비율을 계산해서 퍼센트로 셋팅해 준다.
    _colculResizeWidth(inx, moveVal)
    {
        let $prevEle = this.$resizeEles.eq(inx)

        if(this.isVertical) moveVal += $prevEle.outerHeight()
        else moveVal += $prevEle.outerWidth()

        if(this.resizeCallback) this.resizeCallback(inx, moveVal);
    }

    //그리드의 사이즈가 변경된 경우등..
    //사이즈바의 위치 계산을 다시 해야될 경우 호출된다.
    updateBarPos()
    {
        if(!this.$resizeEles) return

        let thisObj = this, pos, idx, isLastColumn = false,
            colLen = this.$resizeEles.length, endIdx = colLen - 1, scale = this.getScale()
        
        this.$resizeEles.each(function(i)
        {
            if(this.style.display == 'none') return;		//앞에서 colspan 세팅했으므로 리턴
            //if(this.getAttribute('colspan') > 1) return;	//colspan 세팅시 리턴
            idx = i%colLen;
            isLastColumn = (idx == endIdx);

            if(isLastColumn) return;
            
            if(thisObj.isVertical) 
            {
                pos = $(this).position().top/scale + $(this).outerHeight()
                thisObj.resizeBars[idx].css('top', pos + 'px');
            }
            else 
            {
                pos = $(this).position().left/scale + $(this).outerWidth()
                thisObj.resizeBars[idx].css('left', pos + 'px');
            }

            thisObj.resizeBars[idx]._inx = idx
        });

        //console.log('-----------------------------------------')
    }

}


