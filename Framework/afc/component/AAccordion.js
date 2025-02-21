
//--------------------------------------------------------------------------------
//  Accordion class
//
//  특정 구조(p,div)로 된 태그 정보를 파라미터로 받아 accordion 메뉴를 구성한다.
//--------------------------------------------------------------------------------

class AAccordion extends AComponent
{
	constructor()
	{
		super()
		
		this.menuHeight = 22;
		this.paddingX = 20;
		this.paddingY = 5;

		//현재 컨텐츠가 보여지고 있는 Item Element 
		this.selectedItem = null;

		//add ukmani
		this.upcss = {};//{backgroundImage : 'url("Source/img/arrow_left.png")', backgroundRepeat : 'no-repeat', backgroundPosition : '3px center', backgroundSize : '16px 16px'};
		this.downcss = {};//{backgroundImage : 'url("Source/img/arrow_down.png")', backgroundRepeat : 'no-repeat', backgroundPosition : '3px center', backgroundSize : '16px 16px'};
	}

    _includeView(view, inx)
    {
        this.insertItem(view.getName(), view)
    }

    includeChildView(parentView, menuFuncName)
    {
        if(!menuFuncName) menuFuncName = 'ComponentId'
        let promArr = []

        parentView.eachChild((acomp)=>
        {
            promArr.push(this.insertItem(acomp['get'+menuFuncName](), acomp))
        });

        return Promise.all(promArr)
    }


}

window.AAccordion = AAccordion

AAccordion.CONTEXT = 
{
    tag: '<div data-base="AAccordion" data-class="AAccordion" class="AAccordion-Style" data-single-show="true"></div>',

    defStyle: 
    {
        width:'400px', height:'200px'
    },

    events: ['select']
};

AAccordion.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

	/* 이전값
    this.setOption(
	{
    	showContent: false,			//아코디언 메뉴 추가시점에 바로 컨텐츠가 보여질지 여부
        speed: 'fast',				//에니메이션 속도
        isSingleShow: false,		//하나의 메뉴만 펼칠지
        isAnimation: true,
        isShowToggle: true,			//펼쳐진 항목 다시 클릭시 숨길지
        showEvent: 'click',			//bind event name,(ex: mouseover, ...)
        mouseOverEventDelay: 0,
        
        beforeShow: null,
        afterShow: null,
        beforeHide: null,
        afterHide: null,
        //isMobile: false
    }, true);
	*/

    this.setOption(
	{
    	showContent: this.getAttr('data-show-content'),			//아코디언 메뉴 추가시점에 바로 컨텐츠가 보여질지 여부
        speed: 'fast',											//에니메이션 속도
        isSingleShow: this.getAttr('data-single-show'),			//하나의 메뉴만 펼칠지
        isNoAnimation: this.getAttr('data-no-animation'),		//펼쳐질 때 에니메이션 효과를 줄지
        isNoToggle: this.getAttr('data-no-toggle'),				//펼쳐진 항목 다시 클릭시 숨길지
        showEvent: 'click',			//bind event name,(ex: mouseover, ...)
        mouseOverEventDelay: 0,
        
        beforeShow: null,
        afterShow: null,
        beforeHide: null,
        afterHide: null,
        //isMobile: false
    }, true);

	//
	this.itemHeight = this.getAttr('data-item-height');
	
	
	//----------------------------------------------------------------------------------------------
	//개발 모드가 아니면
	if(!this.isDev())
	{
		var itemInfos = this.getMultiAttrInfo('data-iteminfo-'), arr1 = [], arr2 = [], tmp, key, inx;
		
		if(itemInfos)
		{
			//key is attr key, 순서대로 추가하기 위해
			for(key in itemInfos)
			{
				tmp = itemInfos[key].split(',');	//index, title, url, itemId

				inx = Number(tmp[0]);
				arr1[inx] = tmp[1];
				arr2[inx] = tmp[2];
			}

			for(inx in arr1)
			{
				this.insertItem(arr1[inx], arr2[inx]);
			}
		}
	}	
	
};

//deprecated
AAccordion.prototype.setAccordionOption = function(option)
{
	for(var p in option)
	{ 
		if(option[p]!=undefined) 
			this.option[p] = option[p];
	}
};

AAccordion.prototype.setMenuPadding = function(paddingX, paddingY)
{
	this.paddingX = paddingX;
	this.paddingY = paddingY;
};

AAccordion.prototype.getItems = function()
{
    return this.$ele.children();
};

AAccordion.prototype.getItemByIndex = function(index)
{
    return this.getItems()[index];
};

AAccordion.prototype.getItemByName = function(name)
{
    var items = this.getItems(), retItem = null;
	
	items.each(function()
	{
		if($(this.menu).text()==name)
		{
			retItem = this;
			return false;
		}
	});
	
	return retItem;
};

AAccordion.prototype.getItemCount = function()
{
    return this.getItems().length;
};

//isLoadNow 는 추가하는 시점에 뷰를 로드할 지 여부이다.
AAccordion.prototype.insertItem = async function(menuText, url, data, posItem, isPrepend, isLoadNow)//,asyncCallback
{
	var $item = await this._createItem(menuText, url, data, isLoadNow);//, asyncCallback);
	
	//this.$ele.append($item);
	
	if(posItem)
	{
		if(isPrepend) $item.insertBefore(posItem);
		else $item.insertAfter(posItem);
	}
	else
	{
		if(isPrepend) 
		{
			this.$ele.prepend($item);
		}
		else 
		{
			this.$ele.append($item);
		}
	}
	
	return $item[0];
};

AAccordion.prototype._createItem = async function(menuText, url, data, isLoadNow)//, asyncCallback)
{
	var $item = $('<div></div>'), $menu = $('<div class="AAccordion-Menu"></div>'),
		$contents = $('<div class="AAccordion-Contents"></div>'), 
		item = $item[0], aview = null;
		
	item.menu = $menu[0];
	item.contents = $contents[0];
	//item.asyncCallback = asyncCallback;
		
	//$menu.css({'height':this.menuHeight+'px', 'padding-left':this.paddingX+'px',
	//			   'padding-top':this.paddingY+'px', 'padding-right':this.paddingX+'px'});
	
	$menu.css({'height':this.menuHeight+'px', 'line-height':this.menuHeight+'px', 'padding-left':this.paddingX+'px' });

	$menu.text(menuText);
	
	//아이템 높이를 지정했으면 셋팅
	if(this.itemHeight)
	{
		$contents.css('height', this.itemHeight);
	}

	item.contents.itemData = data
	
	if(typeof(url)=='string') 
	{
		item.url = url;
		
		//showContent 가 true 이면 무조건 로드해야 하므로
		if(this.option.showContent || isLoadNow)
		{
			aview = await AView.createView($contents[0], url, this);
		}
	}
	
	//url is aview
	else
	{
		aview = url;
		
		AView.setViewInItem(aview, $contents[0], this);
	}
	
	item.isOpen = this.option.showContent;
	
	this._afterCreated(aview, data);

	//add ukmani
	if(!this.option.showContent)
	{
		$contents.hide();	//$contents.css('display','none');
		$menu.css(this.upcss);
		$menu.removeClass('expand');
	}
	else
	{
		$menu.css(this.downcss);
		$menu.addClass('expand');
	}
	
	//this.showHideManage(item);
	
	$item.append($menu);
	
	$item.append($contents);
	
	this.aevent._select(item);
	
	return $item;
};

AAccordion.prototype._afterCreated = function(aview, data)
{
	if(!aview || !aview.isValid()) return;
	
	//기본적으로 서브뷰의 setData 를 호출해 준다.
	if(aview.setData) aview.setData(data);
};

AAccordion.prototype.removeAllItems = function()
{
	this.getItems().each(function()
	{
		if(this.contents.view) this.contents.view.removeFromView();

		$(this).remove();
	});
	
	this.selectedItem = null;
};


//파라미터 selItem 은 클릭되어진 메뉴의 상위 item Element 이다.
AAccordion.prototype.showHideManage = function(selItem)
{
	var thisObj = this;

	if(selItem.isOpen) 
	{
		//현재 오픈되어져 있는 메뉴를 다시 클릭했을 때 토글 옵션이 없으면
		//아무 작동도 되지 않는다.
		if(this.option.isNoToggle) return;
		
		_hideContents(selItem);
	}
	else 
	{
		if(this.option.isSingleShow && this.selectedItem) _hideContents(this.selectedItem);

		_showContents(selItem);
	}

	/////////////////////////////////////

	function _hideContents(item)
	{
		if(thisObj.option.beforeHide) thisObj.option.beforeHide(item);

		var $contents = $(item.contents);
		if(!thisObj.option.isNoAnimation) 
		{
			$contents.slideUp(thisObj.option.speed, function() 
			{
				if(thisObj.option.afterHide) thisObj.option.afterHide(item);
			});
		}
		else 
		{
			$contents.hide();
			if(thisObj.option.afterHide) thisObj.option.afterHide(item);
		}

		item.isOpen = false;
		thisObj.selectedItem = null;
		
		//add ukmani
		$(item.menu).css(thisObj.upcss);
		$(item.menu).removeClass('expand');
	}

	function _showContents(item)
	{
		if(thisObj.option.beforeShow) thisObj.option.beforeShow(item);

		var $contents = $(item.contents);
		if(!thisObj.option.isNoAnimation) 
		{
			$contents.slideDown(thisObj.option.speed, function() 
			{ 
				if(thisObj.option.afterShow) thisObj.option.afterShow(item);
			});
		}
		else 
		{
			$contents.show();
			if(thisObj.option.afterShow) thisObj.option.afterShow(item);
		}

		item.isOpen = true;
		thisObj.selectedItem = item;
		
		//add ukmani
		$(item.menu).css(thisObj.downcss);
        $(item.menu).addClass('expand');
	}

};

AAccordion.prototype.showHideByIndex = function(index, isAnimation)
{
	var backUp = this.option.isNoAnimation;
	this.option.isNoAnimation = !isAnimation;
	
	
	var eventMenu = this.$ele.find('.AAccordion-Menu').eq(index);

	//var eventMenu = this.menu.eq(index);
	if(eventMenu) eventMenu.trigger(this.option.showEvent);

	this.option.isNoAnimation = backUp;
};

AAccordion.prototype.showHideByName = function(name, isAnimation)
{
	var backUp = this.option.isNoAnimation;
	this.option.isNoAnimation = !isAnimation;

	var thisObj = this;
	
	this.$ele.find('.AAccordion-Menu').each(function()
	{
		if($(this).text()==name)
		{
			$(this).trigger(thisObj.option.showEvent);
			return false;	
		}
	});

	this.option.isNoAnimation = backUp;
};

//add ukmani
AAccordion.prototype.setMenuUpIcon = function(upIcon)
{
	this.upcss['background-image'] = 'url("' + upIcon + '")';
};

AAccordion.prototype.setMenuDownIcon = function(downIcon)
{
	this.downcss['background-image'] = 'url("' + downIcon + '")';
};

AAccordion.prototype.setMenuTooltip = function(item, msg)
{
	$(item.menu).attr('title', msg);
};

