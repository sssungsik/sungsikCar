
afc.import('Framework/afc/library/ScrollManager.js');

/**
 * @author extrmk
 */

class ASlideView extends AComponent
{
	constructor()
	{
		super()
	
		this.inx = 0;
		this.delegator = null;
		this.isDown = false;
	}

	
	
}

window.ASlideView = ASlideView

ASlideView.CONTEXT = 
{
    tag: '<div data-base="ASlideView" data-class="ASlideView" class="ASlideView-Style"></div>',

    defStyle: 
    {
        width:'400px', height:'200px'
    },

    //events: ['swipe', 'longtab', 'scroll', 'scrollleft', 'scrollright', 'scrolltop', 'scrollbottom', 'drop', 'dragStart', 'dragEnd' ]
    events: ['change']
};

ASlideView.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

	this.setOption(
	{
		direction: this.getAttr('data-direction'),	//슬라이드 뷰 스크롤 방향
		moveSpeed: 100,			//이동 속도
		easing: 'linear',		//감속 옵션, easeInQuad, easeOutQuad, easeInOutQuad, ... http://gsgd.co.uk/sandbox/jquery/easing/
		slideRatio: 0.2			//20% 정도 이동하면 다음 슬라이드로 넘어간다.
		
	}, true);


	this.enableScrlManager();
	this.selectBtn = null;
	
	if(this.option.direction=='vertical') this.$ele.css('white-space', 'normal');
	else this.$ele.css('white-space', 'nowrap');
};

//---------------------------------------
//	deprecated, use setOption();
ASlideView.prototype.setSpeed = function(speed)
{
	this.option.moveSpeed = speed;
};

//---------------------------------------
//	deprecated, use setOption();
ASlideView.prototype.setEasing = function(easing)
{
	/*
	if(!jQuery.easing[easing])
	{
		alert('To use this value ' + easing + ', Add System Library : jquery-easing.js');
	}
	else this.easing = easing;
	*/
	
	this.option.easing = easing;
};

//---------------------------------------
//	deprecated, use setOption();
ASlideView.prototype.setMoveUnit = function()
{

};

ASlideView.prototype.enableScrlManager = function()
{
	if(this.scrlManager) return this.scrlManager;
	
	this.scrlManager = new ScrollManager();
	this.scrlManager.setOption(
	{
		startDelay: 10,
		endDelay: 20,
		scrollAmount: 10,
		speedRatio: 0.03
	});
	
	//아래 주석을 풀면 preventDefault 를 사용해서 기본 스크롤 기능을 disable 해야 한다. 그럴 경우 다른 스크롤이 발생하지 않는다.
	//현재는 overflow: hidden 을 사용하여 기본 스크롤 기능을 disable 하고 있음, preventDefault 를 사용하지 않음.
	//this.$ele.css({'overflow':'auto', '-webkit-overflow-scrolling': '', 'z-index':0});	//가속을 위한 z-index 설정
	
	this.$ele.css('z-index', 0);	//가속을 위한 z-index 설정
	
	if(this.option.direction=='vertical') this.scrollYImplement();
	else this.scrollXImplement();
	
//	this.aevent._scroll();

	return this.scrlManager;
};

//function bindData(view, dataArray[i], this);
ASlideView.prototype.setDelegator = function(delegator)
{
	this.delegator = delegator;	
};

ASlideView.prototype.setButtonView = function(buttonView)
{
	this.btnView = buttonView;
	
	var children = this.btnView.getChildren();
	
	for(var i=0; i<children.length; i++)
	{
		children[i].addEventListener('click', this, 'onBtnClick');
	}
	this.selectButton(children[0]);
};

ASlideView.prototype.onBtnClick = function(comp, info)
{
	var children = this.btnView.getChildren();
	
	for(var i=0; i<this.$ele.children().length; i++)
	{
		if(children[i] == comp)
		{
			this.slideTo(i, true);
			return;
		}
	}
};

ASlideView.prototype.setButtonFlexLayout = function(buttonFlexLayout)
{
	this.btnFlex = buttonFlexLayout;
	
	var children = this.btnFlex.getAllLayoutComps();
	
	for(var i=0; i<children.length; i++)
	{
		children[i].addEventListener('click', this, 'onFlexBtnClick');
	}
	this.selectButton(children[0]);
};

ASlideView.prototype.onFlexBtnClick = function(comp, info)
{
	var children = this.btnFlex.getAllLayoutComps();
	
	for(var i=0; i<this.$ele.children().length; i++)
	{
		if(children[i] == comp)
		{
			this.slideTo(i, true);
			return;
		}
	}
};

ASlideView.prototype.selectButton = function(selBtn)
{
	if(this.selectBtn) this.selectBtn.enable(true);
	if(selBtn) selBtn.enable(false);
	
	// removeAllItems에서 선택된 버튼을 제거하기 위해 selBtn을 undefined로 보내는 경우에도 내부 selectBtn 변수가 초기화 되어야 한다.
	this.selectBtn = selBtn;
};

//여러개의 url 을 동시에 추가한다. 단, urlArr 과 dataArr 은 1:1 로 매칭된다.
ASlideView.prototype.addItems = async function(urlArr, dataArr, isPrepend)//, asyncCallback)
{
	var urlLen = urlArr.length, newItems = [], items;
	
	for(var i=0; i<urlArr.length; i++)
	{
		items = await this.addItem(urlArr[i], [ dataArr[i] ], isPrepend);
		newItems.push(items[0]);
	}
	
	return newItems;
};

ASlideView.prototype.addItem = async function(url, dataArray, isPrepend)//, asyncCallback, turnback)
{
    var thisObj = this, $item, item, aview, newItems = [], cssKey;
		
	var cssObj = 
	{
		"position": "static",
		"display": "inline-block",
		"width": "100%",
		"height": "100%",
		"vertical-align": "top"
	};
	
	var dataLen = dataArray.length;
	
	for(var i=0; i<dataArray.length; i++)
	{
        $item = $('<div></div>');
        item = $item[0];
		
		$item.css(cssObj);
        
		if(isPrepend) this.$ele.prepend(item);
		else this.$ele.append(item);
		
        item.itemData = dataArray[i];
        
        newItems.push(item);
		
		if(i==0) aview = await AView.createView(item, url, this);

		//두번째 아이템부터는 마지막 로드된 html string 으로 뷰를 생성한다.
		//else aview = AView.createView(item, url, this, null, null, null, null, AView.lastLoadedHtml);
		else aview = await AView.createView(item, url, this, null, null, null, null, this.lastLoadedHtml);
		
		this._afterCreated(aview);
		
	}
	
	return newItems;
};

ASlideView.prototype._afterCreated = function(aview)
{
	if(!aview || !aview.isValid()) return;
	
	//슬라이드 뷰에 추가된 서브뷰 자체의 이벤트가 상위로 전달되어져야  
	//슬라이드를 감지할 수 있다. 예를 들어 뷰에 클릭 이벤트를 등록한 경우 
	//아래와 같이 하지 않으면 슬라이드가 동작하지 않는다.
	aview.eventStop = false;
	
	if(this.delegator) this.delegator.bindData(aview._item, aview._item.itemData, this);

	//델리게이터를 셋팅하지 않으면 기본적으로 서브뷰의 setData 를 호출해 준다.
	else if(aview.setData) aview.setData(aview._item.itemData);
};

ASlideView.prototype.addDisableManager = function(disableManager)
{
	this.scrlManager.addDisableManager(disableManager);
	//같은 객체를 중복해서 추가해도 무시된다.
	disableManager.addDisableManager(this.scrlManager);
};

ASlideView.prototype.removeAllItems = function()
{
	this.getItems().each(function()
	{
		this.view.removeFromView();

		$(this).remove();
	});
	
	//슬라이드뷰 초기화(버튼뷰가 있다면 버튼 선택해제)
	this.inx = 0;
	if(this.btnView) this.selectButton();
	if(this.btnFlex) this.selectButton();
};

ASlideView.prototype.getItem = function(index)
{
    return this.getItems()[index];
};

ASlideView.prototype.getItems = function()
{
    return this.$ele.children();
};

ASlideView.prototype.indexOfItem = function(item)
{
	return this.getItems().index(item);
};

ASlideView.prototype.getCurrentView = function()
{
	var item = this.getItem(this.inx);
	if(item) return item.view;
	else return null;
};

ASlideView.prototype.slideTo = function(index, isReport)
{
	var aniObj = {}, val;
		
	if(this.option.direction=='vertical') aniObj.scrollTop = this.getHeight()*index;
	else aniObj.scrollLeft = this.getWidth()*index;

	this.$ele.stop().animate(aniObj, this.option.moveSpeed, this.option.easing);
	
	if(this.inx!=index)
	{
		this.inx = index;
		
		if(this.btnView) this.selectButton(this.btnView.getChildren()[this.inx]);
		if(this.btnFlex) this.selectButton(this.btnFlex.getAllLayoutComps()[this.inx]);
		if(isReport) this.reportEvent('change', this.inx);
// 		if(this.delegator && this.delegator.onViewChanged) this.delegator.onViewChanged(this.inx, this);
	}
};

ASlideView.prototype.slidePrev = function()
{
	if(this.inx==0) this.inx = 1;
	
	this.slideTo(this.inx-1, true);
};

ASlideView.prototype.slideNext = function()
{
	if(this.inx+1==this.getItems().length) this.inx--;
	
	this.slideTo(this.inx+1, true);
};


ASlideView.prototype.scrollXImplement = function()
{
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var thisObj = this, scrlArea = this.element;
    this.isDown = false;
	
	this.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		thisObj.isDown = true;
		
		//이 부분을 추가하면 다른 스크롤이 발생하지 않음.
		//e.preventDefault();
		
		e.stopPropagation();
		
		thisObj.scrlManager.initScroll(e.changedTouches[0].clientX);
	});
	
	this.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		if(!thisObj.isDown) return;
		
		e.stopPropagation();
		
		thisObj.scrlManager.updateScroll(e.changedTouches[0].clientX, function(move)
		{
			scrlArea.scrollLeft += move;
		});
	});
	
	this.bindEvent(AEvent.ACTION_UP, slideEnd);
	
	this.bindEvent(AEvent.ACTION_LEAVE, slideEnd);
	
	function slideEnd(e)
	{
		if(!thisObj.isDown) return;
		thisObj.isDown = false;

		e.stopPropagation();
		
		if(!thisObj.isValid() || !e.changedTouches) return;

		thisObj.scrlManager.scrollCheck(e.changedTouches[0].clientX, function(move)
		{
			//moveDelay 만큼 이동해야 실제로 움직이므로 그만큼 빼줘야 정확히 계산된다.
			var dis = Math.abs(this.totDis) - this.option.moveDelay;
			var ratio = dis/thisObj.getMoveUnit();
			
			//부모의 30% 보다 작으면 제자리로
			if(ratio<thisObj.option.slideRatio) thisObj.slideTo(thisObj.inx, true);
			else if(this.totDis<0) thisObj.slidePrev();//음수면 이전 방향
			else if(this.totDis>0) thisObj.slideNext();//양수면 다음 방향
			else thisObj.slideTo(thisObj.inx, true);
			
			return false;
		});
	}
};

ASlideView.prototype.scrollYImplement = function()
{
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var thisObj = this, scrlArea = this.element;
    this.isDown = false;
	
	this.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		thisObj.isDown = true;
		
		//이 부분을 추가하면 다른 스크롤이 발생하지 않음.
		//e.preventDefault();
		
		e.stopPropagation();
		
		thisObj.scrlManager.initScroll(e.changedTouches[0].clientY);
	});
	
	this.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		if(!thisObj.isDown) return;
		
		e.stopPropagation();
		
		thisObj.scrlManager.updateScroll(e.changedTouches[0].clientY, function(move)
		{
			scrlArea.scrollTop += move;
		});
	});
	
	this.bindEvent(AEvent.ACTION_UP, slideEnd);

	this.bindEvent(AEvent.ACTION_LEAVE, slideEnd);
	
	
	function slideEnd(e)
	{
		if(!thisObj.isDown) return;
		thisObj.isDown = false;

		e.stopPropagation();
		
		if(!thisObj.isValid() || !e.changedTouches) return;

		thisObj.scrlManager.scrollCheck(e.changedTouches[0].clientY, function(move)
		{
			var dis = Math.abs(this.totDis) - this.option.moveDelay;
			var ratio = dis/thisObj.getMoveUnit();
			
			//부모의 30% 보다 작으면 제자리로
			if(ratio<thisObj.option.slideRatio) thisObj.slideTo(thisObj.inx, true);
			else if(this.totDis<0) thisObj.slidePrev();
			else if(this.totDis>0) thisObj.slideNext();
			else thisObj.slideTo(thisObj.inx, true);
			
			return false;
		});
	}
	
};

ASlideView.prototype.getMoveUnit = function()
{
	if(this.option.direction=='vertical') return this.getHeight();
	else return this.getWidth();
};

ASlideView.prototype.updatePosition = function(pWidth, pHeight)
{
    AComponent.prototype.updatePosition.call(this, pWidth, pHeight);

	if(this.option.direction=='vertical') this.element.scrollTop = this.getHeight()*this.inx;
	else this.element.scrollLeft = this.getWidth()*this.inx;
    
   	this.getItems().each(function(inx)
   	{
       	if(this.view) this.view.updatePosition();
   	});
};

ASlideView.prototype.stopSlide = function()
{
	this.isDown = false;
    this.slideTo(this.inx, true);
};
