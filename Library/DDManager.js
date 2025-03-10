/**
 * @author asoocool
 */



DDManager = class DDManager
{
    constructor(acomp)
    {
        this.acomp = acomp;
        
        this.isDraggable = false;
        this.isDroppable = false;
        
        this.touchStart = null;
        this.touchMove = null;
        this.touchEnd = null;
        this.touchCancel = null;
        
        this.option = 
        {
            isDropPropagation: false,
            direction: DDManager.DIR_BOTH,
            autoCenter: false
        };
        
        this.dragBound = null; //{left:0, top:0, right:0, bottom:0};
        this.offsetX = 0;
        this.offsetY = 0;
    }
}

DDManager.DROP_CLASS = 'drop_group';			//디자인을 위한 클래스가 아님.
DDManager.DIR_BOTH = 0;
DDManager.DIR_VERTICAL = 1;
DDManager.DIR_HORIZENTAL = 2;

DDManager.prototype.setDDOption = function(option)
{
	for(var p in option)
	{
		//if(!option.hasOwnProperty(p)) continue;
		if(this.option[p]!=undefined) this.option[p] = option[p];
	}
};

DDManager.prototype.setDragBound = function(bound)
{
	this.dragBound = bound;
};

DDManager.prototype.setOffset = function(offsetX, offsetY)
{
	this.offsetX = offsetX;
	this.offsetY = offsetY;
};


DDManager.prototype.enableDrag = function(isDraggable, listener)
{
	if(this.isDraggable==isDraggable) return;
	
    this.isDraggable = isDraggable;
	this.dragListener = listener;
    
    var thisObj = this, dragComp = this.acomp, dragEle;	//실제로 드래그 될 dom
    
    //listview item
    if(dragComp._item) dragEle = $(dragComp._item);
    else dragEle = dragComp.$ele;
    
    if(this.isDraggable)
    {
		var boxObj, halfX = 0, halfY = 0, dragSX, dragSY, isStart,
			isDown = false;
		
		function _dragSet()
		{
			isDown = true;
		
			//임의로 바꾸지 않는다. 필요하면 호출하는 곳에서 바꿈.
			//dragEle.css('z-index', 99999);
			
			boxObj = dragEle[0].getBoundingClientRect();
			
			if(thisObj.option.autoCenter)
			{
				halfX = parseInt(boxObj.width/2, 10);
				halfY = parseInt(boxObj.height/2, 10);
			}
			
			dragSX = boxObj.left + halfX - thisObj.offsetX;
			dragSY = boxObj.top + halfY - thisObj.offsetY;
			isStart = false;
			
			//미리 동작시켜두면 속도가 향상된다. 0.001 타임을 조금이라도 줘야 함.
			//dragEle.anima({translateX:0, translateY:0}, 0.001, 'linear');
		}

		_dragSet();

		//this.dragEle = dragEle[0];
		this.touchStart = AEvent.bindEvent(dragEle[0], AEvent.ACTION_DOWN, function(e) 
		{
			if(!thisObj.isDraggable) return false;
		
			e.preventDefault();
			e.stopPropagation();
			
			_dragSet();
		});
		this.touchMove = AEvent.bindEvent(dragEle[0], AEvent.ACTION_MOVE, function(e) 
		{
			if(!isDown) return;
			
			e.preventDefault();
			e.stopPropagation();
			
			var touchs = e.changedTouches[0];
			
			var touchX = touchs.clientX, touchY = touchs.clientY; 
			//var touchX = touchs.pageX, touchY = touchs.pageY; 
			
			if(thisObj.dragBound)
			{
				if(touchX<thisObj.dragBound.left) 
				{
					touchX = thisObj.dragBound.left;
					if(thisObj.dragListener && thisObj.dragListener.onDragScrollLeft) thisObj.dragListener.onDragScrollLeft(-1);
				}
				else if(touchX>thisObj.dragBound.right) 
				{
					touchX = thisObj.dragBound.right;
					if(thisObj.dragListener && thisObj.dragListener.onDragScrollLeft) thisObj.dragListener.onDragScrollLeft(1);
				}
				
				if(touchY<thisObj.dragBound.top) 
				{
					touchY = thisObj.dragBound.top;
					if(thisObj.dragListener && thisObj.dragListener.onDragScrollTop) thisObj.dragListener.onDragScrollTop(-1);
				}
				else if(touchY>thisObj.dragBound.bottom) 
				{
					touchY = thisObj.dragBound.bottom;
					if(thisObj.dragListener && thisObj.dragListener.onDragScrollTop) thisObj.dragListener.onDragScrollTop(1);
				}
				
			}
			
			switch(thisObj.option.direction)
			{
				case 0: dragEle.anima({translateX:touchX-dragSX, translateY:touchY-dragSY}, 0, 'linear'); break;
				case 1: dragEle.anima({translateY:touchY-dragSY}, 0, 'linear'); break;
				case 2: dragEle.anima({translateX:touchX-dragSX}, 0, 'linear'); break;
			}
			
			if(!isStart)
			{
				isStart = true;
				
				if(thisObj.dragListener && thisObj.dragListener.onDragStart) thisObj.dragListener.onDragStart(dragComp, e);
			}
		});
		
		this.touchEnd = AEvent.bindEvent(dragEle[0], AEvent.ACTION_UP, function(e) 
		{
			if(!isDown) return;
			isDown = false;
		
			e.preventDefault();
			e.stopPropagation();
			
			var touchs = e.changedTouches[0];
			var touchX = touchs.clientX, touchY = touchs.clientY;
			
			if(thisObj.dragBound)
			{
				if(touchX<thisObj.dragBound.left) touchX = thisObj.dragBound.left+1;
				else if(touchX>thisObj.dragBound.right) touchX = thisObj.dragBound.right-1;
				
				if(touchY<thisObj.dragBound.top) touchY = thisObj.dragBound.top+1;
				else if(touchY>thisObj.dragBound.bottom) touchY = thisObj.dragBound.bottom-1;
			}
			
			//dragEle.anima({translateX:0, translateY:0}, 0.001, 'linear');
			/*
			dragEle.css(
			{ 
				left: (touchs.clientX-halfX)+'px', 
				top: (touchs.clientY-halfY)+'px' 
			});
			*/
			
			if(thisObj.dragListener && thisObj.dragListener.onDragEnd) thisObj.dragListener.onDragEnd(dragComp, e);
			
			var dropComp = null;

			$( $('.'+DDManager.DROP_CLASS+':visible').get().reverse() ).each(function()
			{
				//drag 와 drop 컴프가 같은 경우는 리턴
				//drag 컴프 내부에 DROP_CLASS가 있는경우 bug fix
				if(dragEle[0]===this || dragComp.$ele.find(this).length > 0) return;
				
				//drop 영역
				var dropBox = this.getBoundingClientRect();

				if(dropBox.left<=touchX && dropBox.right>=touchX &&
				   dropBox.top<=touchY && dropBox.bottom>=touchY)
				{
					var evt = 
					{
						'dragComp': dragComp, 
						//'clientX': (touchX-dropBox.left-halfX),
						//'clientY': (touchY-dropBox.top-halfY)
						'touchX': touchX,
						'touchY': touchY
					};
					
					dropComp = this.acomp;
					if(!dropComp) dropComp = this.view;	//listview item
					
					if(dropComp.ddManager.dropListener && dropComp.ddManager.dropListener.onCompDrop) 
					{
						dropComp.ddManager.dropListener.onCompDrop(dropComp, evt);
					}
					
					if(!dropComp.ddManager.option.isDropPropagation) return false;
				}
			});
			
			//아무곳에도 드랍되지 않은 경우
			if(!dropComp && thisObj.dragListener && thisObj.dragListener.onDropFail) thisObj.dragListener.onDropFail(dragComp, e);
		});
		
		this.touchCancel = AEvent.bindEvent(dragEle[0], AEvent.ACTION_CANCEL, function(e) 
		{
			thisObj.touchEnd(e);
		});
	}
	else
	{
	
	//if(this.dragEle===dragEle[0]) console.log('test ++++')	;
	
		AEvent.unbindEvent(dragEle[0], AEvent.ACTION_DOWN, this.touchStart);
		AEvent.unbindEvent(dragEle[0], AEvent.ACTION_MOVE, this.touchMove);
		AEvent.unbindEvent(dragEle[0], AEvent.ACTION_UP, this.touchEnd);
		AEvent.unbindEvent(dragEle[0], AEvent.ACTION_CANCEL, this.touchCancel);
	
		this.touchStart = null;
		this.touchMove = null;
		this.touchEnd = null;
		this.touchCancel = null;
		
		dragEle.css(
		{
			'-webkit-transform': '',
			'-webkit-transition-property': '',
			'-webkit-transition-duration': '',
			'-webkit-transition-timing-function': '',
			'-webkit-transition-delay': ''
		});
	}
};

DDManager.prototype.setDropListener = function(listener)
{
	this.dropListener = listener;
};

DDManager.prototype.enableDrop = function(isDroppable, listener)
{
	if(this.isDroppable==isDroppable) return;
	
    this.isDroppable = isDroppable;
	this.dropListener = listener;
    
    var dropEle = null;
    
    //listview item
    if(this.acomp._item) dropEle = $(this.acomp._item);
    else dropEle = this.acomp.$ele;
    
    if(this.isDroppable) dropEle.addClass(DDManager.DROP_CLASS);
	else dropEle.removeClass(DDManager.DROP_CLASS);
};

