
afc.import('Framework/afc/library/ASplitter.js');

/**
 * @author asoocool
 */

//--------------------------------------------------------------------
//	ASplitView 는 컨테이너처럼 스플릿 기능을 갖는다.
//	createSplit 호출 시 비어있는 item 을 생성해 준다.
//	이후 분할된 곳에 setSplitView 함수를 호출하여 뷰를 셋팅 또는 로드한다.
//--------------------------------------------------------------------

class ASplitView extends AComponent
{
	constructor()
	{
		super()
	
		this.splitter = null;
	}

    _includeView(view, inx)
    {
        this.setSplitView(inx, view)
    }
	
}

window.ASplitView = ASplitView

ASplitView.CONTEXT = 
{
    tag: '<div data-base="ASplitView" data-class="ASplitView" class="ASplitView-Style"></div>',

    defStyle: 
    {
        width:'400px', height:'200px'
    },

    events: []
};


ASplitView.prototype.init = function(context, evtListener)
{
    AComponent.prototype.init.call(this, context, evtListener);
    
};

//--------------------

ASplitView.prototype.updatePosition = function(pWidth, pHeight)
{
    AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	
	if(!this.splitter) return;
	
	//이 코드에서 내부적으로 호출하므로  
	//아래처럼 호출하면 안됨.
	this.splitter.updateSize();
	
	/*
	var count = this.splitter.getSplitCount(), view;
	
	for(var i=0; i<count; i++)
	{
		view = this.getSplitView(i);
		if(view) view.updatePosition();
	}
	*/
};

ASplitView.prototype.removeFromView = function(onlyRelease)
{
	this.destroySplit();
	
	AComponent.prototype.removeFromView.call(this, onlyRelease);
};

ASplitView.prototype._callSubActiveEvent = function(funcName, isFirst)
{
	if(!this.splitter) return;
	
	var count = this.splitter.getSplitCount(), view;
	
	for(var i=0; i<count; i++)
	{
		view = this.getSplitView(i);
		if(view) view[funcName](isFirst);
	}
};


//----------------------------------------------------------------------------------------
// split functions

ASplitView.prototype.createSplit = function(count, sizeArr, splitDir, barSize)
{
	if(this.splitter) return;

	this.splitter = new ASplitter(this, barSize);
	this.splitter.createSplit(this.element, count, sizeArr, splitDir);
};

ASplitView.prototype.destroySplit = function()
{
	if(!this.splitter) return;
	
	var count = this.splitter.getSplitCount(), view;
	
	for(var i=0; i<count; i++)
	{
		view = this.getSplitView(i);
		if(view) view.removeFromView();
	}

	this.splitter.removeAllSplit();
	this.splitter = null;
};


ASplitView.prototype.insertSplit = function(inx, splitSize, isAfter)
{
	if(this.splitter) this.splitter.insertSplit(inx, splitSize, isAfter);
};

ASplitView.prototype.appendSplit = function(splitSize)
{
	if(this.splitter) this.splitter.appendSplit(splitSize);
};

ASplitView.prototype.prependSplit = function(splitSize)
{
	if(this.splitter) this.splitter.prependSplit(splitSize);
};

ASplitView.prototype.removeSplit = function(inx)
{
	this.splitter.removeSplit(inx, function(removeItem)	
	{ 
		removeItem.view.removeFromView(); 
	});
};

ASplitView.prototype.getSplit = function(inx)
{
	return this.splitter.getSplit(inx);
};

ASplitView.prototype.getSplitBar = function(inx)
{
	return this.splitter.getSplitBar(inx);
};

ASplitView.prototype.getSplitView = function(inx)
{
	return this.splitter.getSplit(inx).view;
};

/*
ASplitView.prototype.includeChildView = function()
{
    var thisObj = this, parent = this.getParent(), splitIdx = 0;

    parent.eachChild(function(acomp, inx)
    {
		if(thisObj != acomp) thisObj.setSplitView(splitIdx++, acomp);
    });
};
*/

ASplitView.prototype.setSplitView = async function(inx, view)
{
	var $item = $(this.splitter.getSplit(inx));
	
	if(typeof(view)=='string') view = await AView.createView($item[0], view, this);
	
	else AView.setViewInItem(view, $item[0], this);
	
	//셋팅되는 뷰는 가득차게 한다.
    view.$ele.css({ left:'0px', top:'0px', width:'100%', height:'100%' });
    
	return view;
};

ASplitView.prototype.onSplitChanged = function(splitFrame)
{
	if(splitFrame.view)
		splitFrame.view.updatePosition();
};

                    
