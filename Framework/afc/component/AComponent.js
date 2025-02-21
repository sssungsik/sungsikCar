
/**
 * @author asoocool
 */

/*
this.dataKeyMap = 
{
	obcpp_logn_025a:
	{
		InBlock1: ['UI_UNIT_CLS', 'WRAP_ACNT_YN', '', '', ''], 
		InBlock2: ['', '' ,'ACNO', 'ASNO', '']
	},
	
	obcpp_logn_101a:
	{
		OutBlock1: ['UI_UNIT_CLS', 'WRAP_ACNT_YN', '', '', ''], 
		OutBlock2: ['', '' ,'ACNO', 'ASNO', ''],
		NextBlock1: ['WRAP_ACNT_YN'],
	}
}
*/

class AComponent
{
	constructor()
	{
		this.element = null;		//dom tree object
		this.$ele = null;			//jQuery object
		this.parent = null;			//parent AView
		//this.aevent = null;

		//클릭 이벤트시 상위로 터치 이벤트 전달 막음
		//상위 전달이 필요한 경우 개별적으로 설정(false)
		this.eventStop = true;

		this.isEnable = true;
		this.events = null;
		this.baseName = '';
		this.className = afc.getClassName(this);

		this.compId = '';
		this.groupName = '';

		//	드래그 & 드랍 Manager
		//this.ddManager = null;

		//자신이 사용할 네트웍 블럭의 data key
		this.dataKeyMap = null;
		this.mappingType = 0;

		this.sgapW = null;
		this.sgapH = null;
		//this.centerX = null;
		//this.centerY = null;

		this.rect = null;

		//attr 에서 값을 불러올 경우
        //여기에서 값을 초기화 하면 안됨. init 함수에서 setOption 함수를 이용함.
		this.option = {};
	
	}

}

window.AComponent = AComponent

AComponent.focusComp = null;

AComponent.setFocusComp = function(newComp, noActive) 
{
	if(AComponent.focusComp!==newComp)
	{
		//기존 컴프의 포커스 제거
		//if(AComponent.focusComp && AComponent.focusComp.$ele) AComponent.focusComp.$ele.blur();
		//--> blur 이벤트가 두번 발생해서 주석... 이걸 왜 해줬는지 기억이 나지 않음. 살펴볼 것.
		//--> coding 으로 직접 다른 컴포넌트로 포커스를 주기 위해 넣은 코드 같음.

		//새로운 컴프에게 포커스를 줌.
		//if(newComp && newComp.$ele) newComp.$ele.focus();

		//포커스가 이동하는 엘리먼트가 아닌 경우 이전 포커스 컴포넌트에 직접 블러처리를 해준다.
		//newComp가 codemirror인 경우 $ele는 element이므로 다시 jquery로 감싸서 확인한다.
		if(AComponent.focusComp && (!newComp || !$(newComp.$ele).is(':focusable')) &&
			AComponent.focusComp.$ele) $(AComponent.focusComp.$ele).blur();

		AComponent.focusComp = newComp;

		//if(newComp)
		//	console.log(newComp.className);

        if(newComp && !noActive)
        {
            let cntr = newComp.getContainer()
            if(cntr instanceof AWindow)
            {
                AWindow.makeTopWindow(cntr);
            }
        }
	}
	
	//rMate 컨텍스트 메뉴 종료 관련 예외처리, asoocool
	if(window['rMate'])
	{
		var $ctxMenu = theApp.rootContainer.$ele.find('.rMateH5__ContextMenu');
		
		$ctxMenu.each(function()
		{
			if( !$(this).is(':hidden') )
				$(this).parent().remove();
		});
	}
	
};

AComponent.getFocusComp = function() { return AComponent.focusComp; };

if(window.afc_)
{
	AComponent.getFocusComp = AComponent_.getFocusComp;
	AComponent.setFocusComp = AComponent_.setFocusComp;
}

//---------------------------------------------------------------------------------

AComponent.VISIBLE = 0;
AComponent.INVISIBLE = 1;
AComponent.GONE = 2;

AComponent.MASK = [afc.returnAsIt, afc.addComma, afc.addPercent, afc.commaPercent, afc.absPercent,
				   afc.absComma, afc.absCommaPercent, afc.abs, afc.formatDate, afc.formatTime,
				   afc.formatMonth, afc.formatDateTime, afc.formatTic, afc.floor2, afc.floor2Per,
				   afc.intComma, afc.plusfloorPercent, afc.absFloor2, afc.absFloor2Per, afc.formatHMS,
				   afc.sigaTotalAmount, afc.capitalAmount, afc.intComma, afc.addCommaIfFixed, afc.absCommaIfFixed,
				   afc.absFloor1, afc.formatDate2, afc.oneHundredMillionAmount ];
				   
//-------------------------------------------------------------------------------------



AComponent.realizeContext = function(context, container, rootView, parentView, listener)
{
	var className = context.getAttribute(afc.ATTR_CLASS);

	//item
	if(!className) 
	{
		return null;
	}

	var classFunc = window[className];
	if(!classFunc) 
	{
		afc.log('We can not find the class of ' + className );
		//alert(afc.log('We can not find the class of ' + className ));
		
		className = context.getAttribute(afc.ATTR_BASE);
		classFunc = window[className];
		
		//return null;
	}

	var acomp = new classFunc();
	
	context.container = container;
	
	if(rootView) context.rootView = rootView;
	else context.rootView = acomp;

	//parent 변수만 셋팅해야 하므로 setParent 함수를 호출하지 않는다.
	//acomp.setParent(parentView);

	acomp.parent = parentView;
	
	acomp.init(context, listener);

	return acomp;
};

//--------------------------------------------------------------------------------------------

AComponent.prototype.enableKeyPropagation = function(enable)
{
	this.keyPropagation = enable;
};

AComponent.prototype.createElement = function(context)
{
	//컨텍스트를 지정하지 않은 경우
	if(!context) context = this.className;
	
	//컨텍스트를 생성하도록 문자열로 지정한 경우. 즉, 클래스 이름으로 지정
	if(typeof(context)=="string") 
	{
		var compInfo = window[context].CONTEXT;	//AButton.CONTEXT
		
		if(!compInfo)
		{
			//확장컴포넌트인 경우 부모클래스를 얻어온다.
			context = window[context].prototype.superClass.name;
			compInfo = window[context].CONTEXT;
		}

		context = $(compInfo.tag);
		context.css(compInfo.defStyle);
		this.element = context[0];
	}
	
	//컨텍스트를 직접 지정한 경우
	else this.element = context;
	
	this.rect = new ARect();
    
	this.events = {};
    this.element.acomp = this;	//AComponent object
	
    this.$ele = $(this.element);
	
	this.version = this.$ele.attr('data-ver');
	
	if(!this.version) this.version = 0;
	else this.version = Number(this.version);
};

AComponent.prototype.init = function(context, evtListener)
{
	var $oldEle = null;
	
	//같은 메모리 주소의 context 가 온 경우(같은 리소스를 다시 초기화 하는 경우)
	this.reInitComp = (this.element===context);
	
	//기존에 이미 생성되어져 있는 컴포넌트이면 context 를 교체한다. reInitComp 가 아닌 경우
	//기존 리소스를 삭제하기위해 this.$ele 백업
	if(this.$ele && !this.reInitComp) 
	{
		$oldEle = this.$ele;
	}

	if(!this.reInitComp) this.createElement(context);
	
	if($oldEle)
	{
		$oldEle.after(this.$ele);
		$oldEle.remove();
	}
	
	var rootView = this.getRootView();
	
	if(this.element.id)
	{
		//컴포넌트 아이디값 셋팅, 클래스 명은 제거한다.
		var inx = this.element.id.indexOf(afc.CLASS_MARK);
		if(inx>-1) 
		{
			this.compId = this.element.id.substring(inx+afc.CMARK_LEN);

			//아이디를 지정한 경우 멤버 변수로 셋팅해 준다.
			//var rv = this.getRootView();
			if(rootView) rootView[this.compId] = this;
		}
	}
	
	//$ele 값 생성후 초기화 되기 이전에 필요한 작업을 하는 함수
	//if(this.preset) this.preset.call(this);
	if(this.beforeInit) this.beforeInit();
	
	//루트뷰에게 각각의 컴포넌트가 초기화 되기 이전임을 알린다.
	if(rootView && rootView.beforeChildInit) rootView.beforeChildInit(this);
	
	//----------------------------------------------------------------------------------	
	
	//그룹네임을 셋팅한다.
	this.groupName = this.getAttr(afc.ATTR_GROUP);
    
	this.baseName = this.getAttr(afc.ATTR_BASE);
	//APage 와 같이 delegator 방식인 경우 className 을 다싯 셋팅해야 하기 때문에 
	//다시 한번 셋팅한다.
	//this.className = this.getAttr(afc.ATTR_CLASS);

	this.sgapW = this.getAttr('data-sgap-width');
	this.sgapH = this.getAttr('data-sgap-height');
	//this.centerX = this.getAttr('data-center-left');
	//this.centerY = this.getAttr('data-center-top');
	
	if(!evtListener) evtListener = rootView;
	
	//런타임 시점(프로그램 실행 시점)
	if(!this.isDev())
	{
		this.eventStop = !this.getAttr('data-event-propagation');
		//this.loadQueryInfo( (rootView && rootView.isAsyncQryLoad) );
		this.loadQueryInfo();
		
		// 런타임시에만 disabled -> enable 변경 처리
		if(this.getAttr('disabled'))
		{
			this.removeAttr('disabled');
			this.enable(false);
		}

        // 애니메이션 init
        if(this.getAttr('data-animation-init')) this.playAnimate();
	}
	
	if(afc.isIos && !afc.isHybrid)
	{
		if(this.getAttr('data-ios-scroll')) this.escapePreventDefault();
	}
	
	//if(this.defaultAction) this.defaultAction();
	
	if(!this.reInitComp) 
	{
		this.loadEventInfo(evtListener);
		//툴팁설정
		this.initTooltip();
	}
	
	this.loadDataMask();
	
	this.loadShrinkInfo();
	
	// 위치 변경 Util 내부변수 설정
	if(this.isDev())
	{
		this.posUtil = new PosUtil(this);
		
		//--------------------------------------------------------
		//	data-flag="1100", 현재는 앞에 두자리만 사용
		//	attribute 보다 CONTEXT.flag 에 셋팅된 값을 우선한다.
		//	마지막 자리값이 셋팅되어져 있는 것은 예전에 사용하던 값, 이제는 사용안함.
		//	다음 사항이 필요한 경우가 아니면, 컴포넌트 태그에 기본적으로 data-flag 는 셋팅하지 않는다.
		
		var flag = window[this.baseName].CONTEXT.flag || this.getAttr('data-flag');
		if(flag)
		{
			//개발 시점에 자신의 컴포넌트가 선택되지 않도록 하는 옵션
			//하위의 여러 컴포넌트 중에서 특정 컴포넌트만 선택되지 않도록 할 경우
			if(flag.charCodeAt(0)==0x31) this._noSelectComp = true;	//--------------> 이 옵션이 필요한지 검토, 안 쓰고 있는듯
			
			//개발 시점에 하위 컴포넌트 관련 옵션
			//1: 하위 컴포넌트 선택불가 2: 하위 컴포넌트 선택가능하지만 순서변경 및 삭제는 불가
			this._childSelect = Number(flag.charAt(1));
		}
	}
	
	//로컬라이징..
	//if(PROJECT_OPTION.general.localizing)
	{
		var key_loc = this.getAttr('data-localizing-key');
		if(key_loc && this.setText)
		{
			var thisObj = this;
			LocalizeManager.conversionText(key_loc, function(result){
				if(result) thisObj.setText(result);
			});
		}
	}	
};

//터치나 마우스 다운 시 자신이 포커스 컴포넌트 되기, 필요한 컴포넌트만 호출해서 쓰기
AComponent.prototype.actionToFocusComp = function()
{
	var thisObj = this;
	
	this.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		//e.stopPropagation();
		//최초로 클릭된 컴포넌트만 셋팅하기 위해

		//currentTarget으로 바꿔야하는 이유가 있었는지는 모르겠지만
		//일단 target으로 바꿔서 최초 이벤트 수신 컴포넌트가 포커스 컴포넌트가 되도록 한다.
		//추후 focusComp가 넘어가도 되는 경우 플래그변수를 지정하여 다음 컴포넌트가 포커스 컴포넌트 되도록 한다.
		//타겟이 컴포넌트 안에 포함된 요소인 경우를 위해 _get_helper 함수 추가
		if(e.target===thisObj.element || _get_helper(e.target) === thisObj)
		//if(e.target===thisObj.element)
		//if(e.currentTarget===thisObj.element)
			AComponent.setFocusComp(thisObj);
	});

	function _get_helper(ele)
	{
		if(!ele) return;
		if(ele.acomp) return ele.acomp;
		return _get_helper(ele.parentElement);
	}
};

/*
AComponent.prototype.reuse = function()
{
	//기존 정보를 이용하여 aquery.addQueryComp() 다시 셋팅한다.
	this.reuseQueryInfo();
};
*/

//Do not call directly 
AComponent.prototype.release = function()
{
	if(this.aevent)
	{
		if(this.aevent.bindKeyDown) theApp.removeKeyEventListener('keydown', this.aevent);
		if(this.aevent.bindKeyUp) theApp.removeKeyEventListener('keyup', this.aevent);
	}

	this.removeFromAQuery();
	this.ddManager = undefined;
};

//현재 받은 데이터의 key에 값이 없을경우 이전 데이터를 merge함
//#### 코스콤에서 네트웍 성능 향상을 위해 사용하너 같은데...
//#### 현재는 사용하는 곳이 없어 보임... 나중에 사용하는지 확인 ####
AComponent.prototype.preValMerge = function(comp, data, keyArr)
{
	if(!comp.preVal) comp.preVal = {};
	
	var keyOne = null;
	for(var i = 0; i<keyArr.length; i++)
	{
		keyOne = keyArr[i];
		if(data[keyOne]) comp.preVal[keyOne] = data[keyOne];
		else data[keyOne] = comp.preVal[keyOne];
	}
};

AComponent.prototype.getContainer = function()
{
	if(this.isValid()) return this.element.container; 
	else return null;
};

AComponent.prototype.getContainerId = function()
{
	if(this.isValid() && this.element.container) return this.element.container.getContainerId();
	else return null;
};

AComponent.prototype.getRootView = function()
{
	if(this.isValid()) return this.element.rootView; 
	else return null;
};

//컨테이너의 메인뷰를 리턴한다.
AComponent.prototype.getContainerView = function()
{
	if(this.isValid()) return this.element.container.getView();
	else return null;
};

AComponent.prototype.getElement = function()
{
    return this.element;
};

AComponent.prototype.get$ele = function()
{
	return this.$ele;
};

AComponent.prototype.getStyle = function(key)
{
	if(this.isValid()) return this.element.style[key];
	else return '';
};

AComponent.prototype.setStyle = function(key, value)
{
	if(this.isValid()) this.element.style[key] = value;
};

AComponent.prototype.setStyleObj = function(obj)
{
	if(this.isValid())
	{
		for(var p in obj)
    		this.element.style[p] = obj[p];
	}
};

//url: 'Asset/test.png', pos: '10px 50%', size: '100% 100px', repeat: 'no-repeat'
AComponent.prototype.setBackgroundImage = function(url, pos, size, repeat)
{
	if(this.isValid()) 
	{
		this.element.style['background-image'] = 'url('+url+')';
		
		if(pos) this.element.style['background-position'] = pos;
		if(size) this.element.style['background-size'] = size;
		if(repeat) this.element.style['background-repeat'] = repeat;
	}
};

/*
//defVal : 아무값도 셋팅되어져 있을 않을 경우 리턴
AComponent.prototype.getAttr = function(key, defVal)
{
	var val = this.element.getAttribute(key);
	
	//아무값도 셋팅하지 않았으면
	if(!val && defVal!=undefined) val = defVal;
	else if(val=='false') val = Boolean(val);
	
	return val;
};
*/

AComponent.prototype.getAttr = function(key)
{
	if(this.isValid()) return this.element.getAttribute(key);
	else return null;
};


AComponent.prototype.setAttr = function(key, value)
{
	if(this.isValid()) return this.element.setAttribute(key, value);
	else return null;
};

AComponent.prototype.removeAttr = function(key)
{
	if(this.isValid()) return this.element.removeAttribute(key);
	else return null;
};

AComponent.prototype.isValid = function()
{
	return Boolean(this.element);
};


AComponent.prototype.setSgapW = function(sgapW)
{
	if(sgapW)
	{
		this.sgapW = sgapW;
		this.setAttr('data-sgap-width', sgapW);
	}
	else
	{
		this.sgapW = null;
		this.removeAttr('data-sgap-width');
	}
};

AComponent.prototype.setSgapH = function(sgapH)
{
	if(sgapH)
	{
		this.sgapH = sgapH;
		this.setAttr('data-sgap-height', sgapH);
	}
	else
	{
		this.sgapH = null;
		this.removeAttr('data-sgap-height');
	}
};

AComponent.prototype.getSgapW = function()
{
	return this.sgapW;
};

AComponent.prototype.getSgapH = function()
{
	return this.sgapH;
};


/*
AComponent.prototype.addClass = function(className)
{
	var curClass = this.element.className;
	
    if(curClass.indexOf(className)==-1)
    	this.element.className = curClass+' '+className;
};

AComponent.prototype.removeClass = function(className)
{
	this.element.className = this.element.className.replace(' '+className, '');
};
*/

AComponent.prototype.addClass = function(className)
{
	if(this.$ele) this.$ele.addClass(className);
};

AComponent.prototype.removeClass = function(className)
{
	if(this.$ele) this.$ele.removeClass(className);
};

//직접 호출하지 말것. 실제로 컴포넌트의 부모를 바꾸러면 parent.addComponent 를 사용해야 함.
//addComponent 만 호출하면 이전 부모에서 자동으로 새로운 부모로 이동함, 이전 부모에서 삭제하지 않아도 됨.
AComponent.prototype.setParent = function(parent)
{
	// 20171214 parent 무조건 세팅하게 임시처리 -김민수
	//if(this.parent===parent) return;
	
	if(parent)
	{
		this.element.container = parent.getContainer();
		this.element.rootView = parent.getRootView();
		
		if(this.compId)
		{
			//새로 바뀐 부모의 prefix 로 변경해 준다.
			this.element.id = this.element.rootView.compIdPrefix+this.compId;
			
			//--------------------------------------------------------------------------------------
			//	TODO. ★
			//	새로운 부모가 가지고 있는 자식중에 같은 아이디가 존재할 수 있으므로...변경 로직이 필요...
			//	그렇다고 지정한 아이디를 임의로 바꾸는 것도 문제....
			//	아이디 중복을 체크하여 중복이라는 알림을 보여주는 로직 생각해 보기
			//--------------------------------------------------------------------------------------
		}
	}
	
	this.parent = parent;
};

//AView
AComponent.prototype.getParent = function()
{
	return this.parent;
};

AComponent.prototype.getOwner = function()
{
	return this.owner;
};

AComponent.prototype.getPrevComp = function()
{
	var ele = this.$ele.prev().get(0);
	if(ele) return ele.acomp;
	return null;
};

AComponent.prototype.getNextComp = function()
{
	var ele = this.$ele.next().get(0);
	if(ele) return ele.acomp;
	return null;
};

//편집기에서 셋팅한 id
AComponent.prototype.getComponentId = function()
{
	return this.compId;
};

AComponent.prototype.setComponentId = function(compId)
{
	//if(this.element.id)
	//	this.element.id.replace(afc.CLASS_MARK+this.compId, afc.CLASS_MARK+compId);
	
	if(this.isValid() && this.element.rootView) 
		this.element.id = this.element.rootView.compIdPrefix+compId;
	
	this.compId = compId;
};

AComponent.prototype.getGroupName = function()
{
	return this.groupName;
};

AComponent.prototype.setGroupName = function(groupName)
{
	this.setAttr('data-group', groupName);
	this.groupName = groupName;
};

AComponent.prototype.getClassName = function()
{
	return this.className;
};

AComponent.prototype.setClassName = function(className)
{
	this.setAttr(afc.ATTR_CLASS, className);
	this.className = className;
};

//태그의 id attribute (실제 id)
AComponent.prototype.getElementId = function()
{
	return this.element.id;
};

AComponent.prototype.setName = function(name)
{
	this.setAttr('name', name);
};

AComponent.prototype.getName = function()
{
	return this.getAttr('name');
};

AComponent.prototype.isShow = function()
{
	//return (this.$ele.css('display')!='none' && this.$ele.css('visibility')=='visible');
	
	if(!this.isValid()) return false;
	
	return this.$ele.is(":visible");
};

/*
AComponent.prototype.show = function(showType)
{
	switch(showType)
	{
		case AComponent.VISIBLE:
			this.$ele.show(); 
			this.$ele.css('visibility', 'visible');
		break;
		
		case AComponent.INVISIBLE: 
			this.$ele.css('visibility', 'hidden');
		break;
			
		case AComponent.GONE: this.$ele.hide(); break;
	}
};
*/

AComponent.prototype.show = function() 
{ 
	if(!this.isValid()) return;
	
	this.$ele.css('visibility', 'visible'); 
	this.$ele.show(); 
};

AComponent.prototype.hide = function() 
{ 
	if(!this.isValid()) return;
	
	this.$ele.hide(); 
};

AComponent.prototype.visible = function() 
{ 
	if(!this.isValid()) return;
	
	this.$ele.css('visibility', 'visible'); 
};

AComponent.prototype.invisible = function() 
{ 
	if(!this.isValid()) return;
	
	this.$ele.css('visibility', 'hidden'); 
};

AComponent.prototype.enable = function(isEnable)
{
	this.isEnable = isEnable;
	
	//ios 14.6 에서 pointer-events : none 이 작동하지 않는다. 터치 작동이 막히지도 않고 css 도 반영되지 않는다.
	//임시로 disabled 어트리뷰트를 사용, 이 속성은 input 계열에서만 작동된다.
	//즉, input 계열이 아닌 다른 컴포넌트에서 enable(false) 를 호출해도 disable 되지 않는다.
	//이 증상은 ios 14.6 의 자체 버그이다. 14.7 에서 fix 될 예정
	if(afc.iosVer==14.5 || afc.iosVer==14.6)
	{
		if(isEnable) this.$ele.removeAttr('disabled');
		else this.$ele.css('disabled', 'true');
	}
	
	else
	{
		if(isEnable) this.$ele.css('pointer-events', 'auto');
		else this.$ele.css('pointer-events', 'none');
	}
	
};

//{left,top,right,bottom}
AComponent.prototype.getBoundRect = function()
{
	return this.element.getBoundingClientRect();
};

//return ARect
AComponent.prototype.getCompRect = function()
{
	var pos = this.getPos();
	this.rect.setSizeRect(pos.left, pos.top, this.getWidth(), this.getHeight());
	
	return this.rect;
};

AComponent.prototype.setCompRect = function(x, y, w, h)
{
	this.$ele.css( { left: x+'px', top: y+'px', width: w+'px', height: h+'px' });
};

AComponent.prototype.getPos = function()
{
	return this.$ele.position();
};

AComponent.prototype.setPos = function(x, y)
{
	//x 가 object 인 경우, {left: 100, top:100}
	if(typeof(x)=='object')
	{
		y = x.top;
		x = x.left;
	}
	
	x = Math.floor(x);
	y = Math.floor(y);
	
	this.$ele.css( { 'left': x+'px', 'top': y+'px' });
};

AComponent.prototype.offsetPos = function(dx, dy)
{
	var curPos = this.$ele.position();
	this.$ele.css( { 'left': (curPos.left+dx)+'px', 'top': (curPos.top+dy)+'px' });
};


AComponent.prototype.getWidth = function()
{
	return this.$ele.width();
};

AComponent.prototype.getHeight = function()
{
	return this.$ele.height();
};

AComponent.prototype.setWidth = function(w)
{
	this.$ele.width(w);
};

AComponent.prototype.setHeight = function(h)
{
	this.$ele.height(h);
};

AComponent.prototype.setSize = function(w, h)
{
	this.$ele.width(w);
	this.$ele.height(h);
};

AComponent.prototype.offsetSize = function(dw, dh)
{
	this.setSize(this.$ele.width()+dw, this.$ele.height()+dh);
};

AComponent.prototype.centerX = function()
{
	this.$ele.css('left', 'calc(50% - ' + this.$ele.width()/2 + 'px)');
	this.$ele.css('right', '');
};

AComponent.prototype.centerY = function()
{
	this.$ele.css('top', 'calc(50% - ' + this.$ele.height()/2 + 'px)');
	this.$ele.css('bottom', '');
};

AComponent.prototype.setInlineStyle = function(pos)
{
	if(!pos) pos = 'static';
	
	this.setStyleObj({ position:pos, display:'inline-block', 'vertical-align':'top' });	//'margin-bottom':'-5px'
	//this.setStyleObj({ position:'static', display:'inline-table', 'margin-bottom':'-5px' });
};

AComponent.prototype.removeFromView = function(onlyRelease)
{
	this.release();
	
	//리스트뷰가 view pool 을 사용할 경우 
	if(!onlyRelease)
	{
		//let con = this.getContainer();
		this.setParent(null)
		this.$ele.remove()
    	this.$ele = null
		this.element = null

        this.hideTooltip()
	}
};

AComponent.prototype.addEventListener = function(evtName, listener, funcName, isPrepend)
{
	var evts = this.events[evtName];
	if(!evts) 
	{
		evts = [];
		this.events[evtName] = evts;
		
		//AXEvent 가 구현해 놓은 event 처리 함수를 얻어온다.
		if(this.aevent)
		{
			var evtFunc = this.aevent[evtName];
			if(evtFunc) evtFunc.call(this.aevent);
		}
	}
	
	//기존에 같은 이벤트, 같은 리스너가 등록되어 있다면 삭제 -> removeEventListener 함수 내부에서 체크
	else this.removeEventListener(evtName, listener);
	
	var info =
	{
		'listener': listener,
		'funcName': funcName
	};
	
	if(isPrepend) evts.unshift(info);
	else evts.push(info);
};

AComponent.prototype.removeEventListener = function(evtName, listener)
{
	var evts = this.events[evtName];
	
	if(evts)
	{
		for(var i=0; i<evts.length; i++)
		{
			if(evts[i].listener===listener)
			{
				evts.splice(i, 1);
				return;
			}
		}
	}
};

//setTimeout so slow...
AComponent.prototype.reportEvent = function(evtName, info, event)
{
	//if(window.afc_ && !this._unitTest) return;
	
	if(!this.isValid()) return;
	
	var evts = this.events[evtName];
	
	if(evts)
	{
		var evt, func;
		for(var i=0; i<evts.length; i++)
		{
			evt = evts[i];
			func = evt.listener[evt.funcName];
			if(func) func.call(evt.listener, this, info, event);
			
			//evt.listener[evt.funcName](this, info, event);
		}
	}
};

AComponent.prototype.reportEventDelay = function(evtName, info, delay, event)
{
	var thisObj = this;
	
	setTimeout(function()
	{
		//if(thisObj.isValid())
		thisObj.reportEvent(evtName, info, event);
		
	}, delay);
};

//pWidth : parent width, pHeight : parent height
AComponent.prototype.updatePosition = function(pWidth, pHeight)
{

};

/*
AComponent.prototype.calcStretch = function(key, margin, pSize)
{
	var isPercent = (margin.indexOf('%')>-1);
	
	margin = parseInt(margin, 10);
	
	//if(isPercent) alert(margin);	
	
	var pos = this.getStyle(key);
	if(!pos || pos=='auto')
	{
		key = (key=='left') ? 'right' : 'bottom';
		pos = this.getStyle(key);
	}
	
	if(isPercent) margin = pSize*(margin/100);

	return (pSize - margin - parseInt(pos, 10));
};
*/

AComponent.prototype.setDataMask = function(func, param, ele)
{
	if(!ele) ele = this.element;
	
	var dm = null;
	
	if(typeof(func)=='string') 
	{
		func = func.split('.');
		
		dm = new ADataMask(ele);
		dm.insertMaskFunc(ADataMask[func[0]][func[1]].func, param);
	}
	else if(typeof(func)=='function') 
	{
		dm = new ADataMask(ele);
		dm.insertMaskFunc(func, param);
	}
	else dm = func;
	
	ele.dm = dm;
	
	if(dm)
	{
		dm.ele = ele;
		dm.acomp = this;
	}
};

AComponent.prototype.loadDataMask = function(ele)
{
	if(!ele) ele = this.element;

	var maskfunc = ele.getAttribute('data-maskfunc');
	
	if(maskfunc)
	{
		var dm = new ADataMask(ele, this), temp, i,
			maskparam = ele.getAttribute('data-maskparam'),
			attrObj = {'maskfunc': [], 'maskparam': []},
			isTryCatch;
		
		dm.setOriginal(ele.getAttribute('data-maskorigin'));
		
		maskfunc = maskfunc.split('|');
		if(maskparam) maskparam = maskparam.split('|');
		else
		{
			// 기존에 maskparam이 없었던 경우
			maskparam = [];
			for(i=0; i<maskfunc.length; i++)
			{
				maskparam.push('[]');
			}
		}
		
		for(i=0; i<maskfunc.length; i++)
		{
			//타입과 함수명 분리
			temp = maskfunc[i].split('.');
			attrObj.maskfunc.push(maskfunc[i]);
			attrObj.maskparam.push(maskparam[i]);
			try
			{
				dm.insertMaskFunc(ADataMask[temp[0]][temp[1]].func, JSON.parse(maskparam[i]));
			}
			catch(err)
			{
				isTryCatch = true;
				attrObj.maskfunc.pop();
				attrObj.maskparam.pop();
				if(ADataMask.removedArr.indexOf(maskfunc[i]) < 0) ADataMask.removedArr.push(maskfunc[i]);
			}
		}
		
		// fmt 파일에 사용자 포맷 함수를 만들어 설정하고 fmt 파일을 제거한 경우에 알림처리
		if(isTryCatch)
		{
			//문서의 읽기모드와 관계없이 무조건 수정처리한다.
			//MDIManager가 여러개인 경우 수정여부가 다른 문서에 전달되어 수정여부 체크 제거
			dm.resetElement();

			if(attrObj.maskfunc.length < 1)
			{
				ele.removeAttribute('data-maskfunc');
				ele.removeAttribute('data-maskparam');
				ele.removeAttribute('data-maskorigin');
			}
			else
			{
				ele.setAttribute('data-maskfunc', attrObj.maskfunc.join('|'));
				ele.setAttribute('data-maskparam', attrObj.maskparam.join('|'));
			}
		}
		
		ele.dm = dm;
		
		return dm;
	}
	
	else return null;
};

AComponent.prototype.getDataMask = function(idx, ele)
{
	if(!ele) ele = this.element;
	
	if(idx == undefined) return ele.dm;
	else if(!ele.dm) return null;
	else return ele.dm.getMaskFunc(idx);
};

AComponent.prototype.loadShrinkInfo = function(ele)
{
	if(!ele) ele = this.element;

	var shrinkInfo = ele.getAttribute('data-shrink-info');
	if(shrinkInfo)
	{
		shrinkInfo = shrinkInfo.split(',');
		this.setShrinkInfo({fontSize:Number(shrinkInfo[0]), maxChar:Number(shrinkInfo[1]), unit:shrinkInfo[2]}, ele);
	}
};

AComponent.prototype.loadEventInfo = function(evtListener)
{
	var evtClass = window[this.baseName+'Event']; 
	//이벤트 구현 클래스가 존재하지 않을 경우
	if(!evtClass) 
    {
        console.warn(this.baseName+'Event is not defined.');
        return;
    }
	
	this.aevent = new evtClass(this);
	
	//if(this.presetEvent) this.presetEvent.call(this);
	if(this.beforeLoadEvent) this.beforeLoadEvent();
	
	this.aevent.defaultAction();
	
	if(evtListener)
	{
        let evtObj = this.getMultiAttrInfo(afc.ATTR_LISTENER+'-');
        for(let p in evtObj)
        {
			evtInfo = evtObj[p];
			if(evtInfo)
			{
				evtInfo = evtInfo.split(':');
				this.addEventListener(p, evtListener, $.trim(evtInfo[1]));
			}
        }
        /*
		var evtInfo, events = afc.getEventList(this.baseName);
	
		for(var i=0; i<events.length; i++)
		{
			evtInfo = this.getAttr(afc.ATTR_LISTENER+'-'+events[i]);
			if(evtInfo)
			{
				evtInfo = evtInfo.split(':');
				this.addEventListener(events[i], evtListener, $.trim(evtInfo[1]));
			}
		}
        */
	}
};

AComponent.prototype.bindEvent = function(eventName, callback, options)
{
	return AEvent.bindEvent(this.element, eventName, callback, options);
};

AComponent.prototype.unbindEvent = function(eventName, callback, options)
{
	AEvent.unbindEvent(this.element, eventName, callback, options);
};

AComponent.prototype.setQueryInfo = async function(qryName, blockName, dataKeyArr, index)
{
	if(!qryName || !blockName || !dataKeyArr) return;

	//이미 로드해 놓은 정보가 없으면 메모리 할당
	if(!this.dataKeyMap) this.dataKeyMap = {};
	
	var aquery = await AQuery.getSafeQuery(qryName),
		ctnrId = this.getContainerId();

	if(!aquery) return;

	//auto mapping --> 필드키를 매핑한 상태를 보고 자동으로 블럭을 셋팅한다.
	if(this.mappingType==0)
	{
		if(blockName)
		{
			if(aquery.getValue('input')[blockName])
			{
				//if(aquery.getQueryComps(ctnrId, 'input').indexOf(this) > -1)
				if(this.dataKeyMap[blockName]) aquery.removeQueryComp(ctnrId, 'input', this);
				aquery.addQueryComp(ctnrId, 'input', this);
			}
			if(aquery.getValue('output')[blockName])
			{
				if(this.dataKeyMap[blockName]) aquery.removeQueryComp(ctnrId, 'output', this);
				aquery.addQueryComp(ctnrId, 'output', this);
			}
		}
	}
	//inblock mapping --> 필드키를 등록하지 않고도 input 영역에 컴포넌트를 등록할 수 있다.
	else if(this.mappingType==1)
	{
		if(this.dataKeyMap[blockName]) aquery.removeQueryComp(ctnrId, 'input', this);
		aquery.addQueryComp(ctnrId, 'input', this);
	}
	//outblock mapping --> 필드키를 등록하지 않고도 output 영역에 컴포넌트를 등록할 수 있다.
	else if(this.mappingType==2)
	{
		if(this.dataKeyMap[blockName]) aquery.removeQueryComp(ctnrId, 'output', this);
		aquery.addQueryComp(ctnrId, 'output', this);
	}

	if(!this.dataKeyMap[qryName]) this.dataKeyMap[qryName] = {};
	if(!this.dataKeyMap[qryName][blockName]) this.dataKeyMap[qryName][blockName] = [];
	
	if(index == undefined) this.dataKeyMap[qryName][blockName] = dataKeyArr;
	//index를 넣었다는 얘기는 dataKeyArr이 field명이라는 뜻이므로 해당 위치에 넣어준다.
	else this.dataKeyMap[qryName][blockName][index] = dataKeyArr;
};

//쿼리로드 완료시 처리 함수
AComponent.prototype._qryLoadDone = function(aquery)
{
	if(!this.isValid() || !aquery) return;
		
	//--------------------------------------
		
	var keyBlocks, dataKeyArr, keyMapObj, qryName = aquery.getName(), ctnrId = this.getContainerId();
		
//console.log('query load done - ' + qryName);

	//"InBlock1,UI_UNIT_CLS,WRAP_ACNT_YN,,,|OutBlock2,,,ACNO,ASNO,"
	keyBlocks = this.getAttr('data-blocks-'+qryName);

	//auto mapping --> 필드키를 매핑한 상태를 보고 자동으로 블럭을 셋팅한다.
	//블락명이 InBlock 으로 시작하지 않는 경우가 있어서 아래 dataKeyMap 세팅 부분에서
	//input, output 영역에 해당 블락정보가 있는지 체크하여 쿼리컴포넌트에 추가한다.
	/*if(this.mappingType==0)
	{
		//쿼리는 셋팅했지만 필드키를 매핑하지 않은 경우는 
		//쿼리에 컴포넌트를 등록하지 않는다.
		if(keyBlocks)
		{
			if(keyBlocks.indexOf('InBlock')>-1) aquery.addQueryComp(ctnrId, 'input', this);
			if(keyBlocks.indexOf('OutBlock')>-1) aquery.addQueryComp(ctnrId, 'output', this);
		}
	}*/

	//inblock mapping --> 필드키를 등록하지 않고도 input 영역에 컴포넌트를 등록할 수 있다.
	if(this.mappingType==1) aquery.addQueryComp(ctnrId, 'input', this);

	//outblock mapping --> 필드키를 등록하지 않고도 output 영역에 컴포넌트를 등록할 수 있다.
	else if(this.mappingType==2) aquery.addQueryComp(ctnrId, 'output', this);

	//AView 에서만 사용함
	//child mapping -> 부모 뷰가 자식의 updateComponent 를 호출해 주므로 addQueryComp 를 하지 않는다.
	//else if(this.mappingType==3);

	if(!keyBlocks || keyBlocks=='') this.dataKeyMap[qryName] = null;
	else 
	{
		keyMapObj = this.dataKeyMap[qryName] = {};

		//["InBlock1,UI_UNIT_CLS,WRAP_ACNT_YN,,,", "OutBlock2,,,ACNO,ASNO,"]
		keyBlocks = keyBlocks.split('|');
		
		var blockName;
		for(var j=0; j<keyBlocks.length; j++)
		{
			dataKeyArr = keyBlocks[j].split(',');

			//obcpp_logn_101a: 
			//{ 
			//	InBlock1: ['UI_UNIT_CLS', 'WRAP_ACNT_YN', '', '', ''], 
			//	OutBlock2:['', '' ,'ACNO', 'ASNO', ''] 
			//}
			blockName = dataKeyArr[0];
			keyMapObj[blockName] = dataKeyArr;
			dataKeyArr.shift();	//첫번째 원소 blockName 은 삭제
			
			//auto mapping --> 필드키를 매핑한 상태를 보고 자동으로 블럭을 셋팅한다.
			if(this.mappingType==0)
			{
				if(aquery.hasQueryBlock('input', blockName)) aquery.addQueryComp(ctnrId, 'input', this);
				if(aquery.hasQueryBlock('output', blockName)) aquery.addQueryComp(ctnrId, 'output', this);
			}
		}
	}
	
};

AComponent.prototype.loadQueryInfo = async function()
{
	//if(this.isDev()) return;
	
	//"obacb_balc_041r|obcpp_scrn_001r"
	var queryNames = this.getAttr(afc.ATTR_QUERY_NAME);
	
	if(!queryNames) return;

	//정보가 존재하면 메모리 할당
	this.dataKeyMap = {};
	
	//수신된 데이터 적용 방법, default, add, remove, select
	this.applyType = this.getAttr('data-apply-type');
	
	//쿼리 매핑 방법에 대한 셋팅 값
	var mtype = this.getAttr('data-mapping-type');
	if(mtype) this.mappingType = parseInt(mtype, 10);
	
	queryNames = queryNames.split('|');	//[obacb_balc_041r, obcpp_scrn_001r]
	
	/*
	for(var i=0; i<queryNames.length; i++)
	{
		this._qryLoadDone(await AQuery.getSafeQuery(queryNames[i]));
	}
	*/
	
	/*
	var qrys = await AQuery.getSafeQuerys(queryNames);
	for(var i=0; i<qrys.length; i++)
	{
		this._qryLoadDone(qrys[i]);
	}
	*/
	
	this.qryProms = AQuery.getSafeQuerys(queryNames, true);
};

AComponent.prototype._applyLoadedQuery = function()
{
	if(this.qryProms)
	{
		Promise.all(this.qryProms).then( values =>
		{
			for(var i=0; i<values.length; i++)
			{
				this._qryLoadDone(values[i]);
			}
		});
	}
};

AComponent.prototype.removeFromAQuery = function()
{
	if(!this.dataKeyMap) return;
	
	var aquery, qryName;
	var ctnrId = this.getContainerId();
	for(qryName in this.dataKeyMap)
	{
		aquery = AQuery.getQuery(qryName);
		
		if(aquery)
		{
			//afc.log(ctnrId + ':' + qryName);
		
			aquery.removeQueryComp(ctnrId, 'input', this);
			aquery.removeQueryComp(ctnrId, 'output', this);
		}
	}
};

AComponent.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	/*	
	//---- example ----
	
	if(!keyArr) return;
	
	var data, value;
	for(var i=0; i<3; i++)
	{
		data = dataArr[i];
		for(var j=0; j<keyArr.length; j++)
		{
			value = ... ;
			data[keyArr[j]] = value;
		}
	}
	
	//InBlock 이 occurs 인 경우
	//실제로 셋팅된 개수로 맞춰줘야 한다. 이후의 원소는 삭제된다.	
	dataArr.length = 3;	
	
	//--------------------
	// simple
	//--------------------
	
	if(!keyArr) return;
	
	var data = dataArr[0];
	data[keyArr[0]] = this.getText();
	*/
};

AComponent.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	/*	
	//---- example ----
	
	if(!keyArr) return;
	
	var data, value;
	for(var i=0; i<dataArr.length; i++)
	{
		data = dataArr[i];
		for(var j=0; j<keyArr.length; j++)
		{
			value = data[keyArr[j]];
			...
		}
	}
	
	//--------------------
	// simple
	//--------------------
	
	if(!keyArr) return;
	
	var data = dataArr[0];
	this.setText(data[keyArr[0]]);
	*/
};

//Component 의 값을 QueryData 에 반영한다.
AComponent.prototype.updateQueryData = function(queryData)
{
	var keyMap = this.dataKeyMap[queryData.getQueryName()];
	if(keyMap)
	{
		for(var blockName in keyMap)
		{
			// OutBlock 정보는 송신데이터에 세팅되지않는다.
			if(blockName.indexOf('OutB')>-1) continue;
		
			this.getQueryData(queryData.getBlockData(blockName), keyMap[blockName], queryData);
		}
	}
	
	else this.getQueryData(null, null, queryData);
};


//queryData 의 값을 컴포넌트에 반영한다.

//--------------------------------------------------------------------------------------------------------------------
//리얼데이터 수신 시 dataKey 가 동일한 컴포넌트 들은 일단 모두 updateComponent 가 호출된다.
//자신이 사용하는 fid 와 사용하지 않는 fid 가 혼합되어 들어오기 때문에(자신이 사용하지 않는 fid 만 셋팅 되어져 올 수도 있다.)
//setQueryData 내부에서 비교 로직을 구현해야 한다. io 엔진에서 미리 비교하여 사용하지 않으면 넘겨주지 않을 수도 있지만
//여러개중에서 하나라도 사용되면 넘겨주기때문에 어차피 setQueryData 내부에서 다시 비교해야 하므로 비효율적이다.

//--> 다음과 같이 변경
	
//자신과 상관없는 queryData 는 들어오지 않도록 체크해 주고 있음.
//하지만 자신이 사용하는 fid 와 사용하지 않는 fid 가 혼합되어 들어오기 때문에(여러개 중에서 하나라도 사용되면 넘겨준다.)
//setQueryData 내부에서 비교 로직을 구현해야 한다. 
//--------------------------------------------------------------------------------------------------------------------

AComponent.prototype.updateComponent = function(queryData)
{
	var qryName = queryData.getQueryName(), keyMap, blockName;

	keyMap = this.dataKeyMap[qryName];
	if(keyMap)
	{
		for(blockName in keyMap)
		{
			// InBlock 정보는 데이터 수신 후 컴포넌트에 세팅되지않는다.
			if(blockName.indexOf('InB')>-1) continue;
			var blockData = queryData.getBlockData(blockName);

			//데이터가 없거나 길이가 0인 경우는 처리하지 않는다.
			if(!blockData || blockData.length==0) continue;
			
			//현재 처리중인 블록명을 지정한다. updateChildMappingComp 를 호출되는 경우에 사용된다.
			queryData.curBlockName = blockName;
			ADataMask.setQueryData(blockData[0], keyMap[blockName], queryData);
			this.setQueryData(blockData, keyMap[blockName], queryData);
		}
	}
	else this.setQueryData(null, null, queryData);

	ADataMask.clearQueryData();
	
	//현재 처리중인 블록명을 제거한다.
	delete queryData.curBlockName;
};

AComponent.prototype.updateChildMappingComp = function(dataArr, queryData)
{
	var keyMap, blockName = queryData.curBlockName;
	
	//listview 에서 subview 를 호출하는 경우, dataKeyMap 자체가 없을 수도 있다.
	if(this.dataKeyMap) keyMap = this.dataKeyMap[queryData.getQueryName()];
		
	if(keyMap)
	{
		//처리중인 블록명이 있으면 블록명에 해당하는 매핑정보만 처리한다.
		if(blockName) this.setQueryData(dataArr, keyMap[blockName], queryData);
		else
		{
			for(blockName in keyMap)
			{
				this.setQueryData(dataArr, keyMap[blockName], queryData);
			}
		}
	}
	else this.setQueryData(dataArr, null, queryData);
};


//----------------------

AComponent.prototype.toString = function()
{
	var ret = '\n{\n', value;
    for(var p in this) 
    {
        if(!this.hasOwnProperty(p)) continue;
        
        value = this[p];
        
        if(typeof(value) == 'function') continue;
        
        else if(value instanceof HTMLElement)
        {
        	if(afc.logOption.compElement) ret += '    ' + p + ' : ' + $(value)[0].outerHTML + ',\n';
        	else ret += '    ' + p + ' : ' + value + ',\n';
        }
        else if(value instanceof Object) ret += '    ' + p +' : ' + afc.getClassName(value) + ',\n';
		else ret += '    ' + p + ' : ' + value + ',\n';
    }
    ret += '}\n';
    
    return ret;
};

//drag & drop 관련
AComponent.prototype.enableDrag = function(isDraggable, offsetX, offsetY, listener)
{
	if(!this.ddManager) this.ddManager = new DDManager(this);
	
	if(!offsetX) offsetX = 0;
	if(!offsetY) offsetY = 0;
	
	this.ddManager.setOffset(offsetX, offsetY);
	this.ddManager.enableDrag(isDraggable, listener);
};

AComponent.prototype.enableDrop = function(isDroppable, listener)
{
	if(!this.ddManager) this.ddManager = new DDManager(this);
	this.ddManager.enableDrop(isDroppable, listener);
};

/*
AComponent.prototype.actionDelay = function(filter)
{
	var fComp = this.$ele;
	if(filter) fComp = this.$ele.find(filter);
	 
	if(!fComp) return;
	
	fComp.css('pointer-events', 'none');
	
	var thisObj = this;
	setTimeout(function() 
	{
		if(thisObj.$ele) fComp.css('pointer-events', 'auto'); 
	}, afc.DISABLE_TIME);
};
*/

AComponent.prototype.actionDelay = function()
{
	var thisObj = this;
	
	this.enable(false);
	
	setTimeout(function() 
	{
		if(thisObj.isValid()) thisObj.enable(true); 
		
	}, afc.DISABLE_TIME);
};

//android 4.3 이하, BugFix
//윈도우가 구현한 preventDefault 가 실행되지 않도록, AWindow.prototype.preventTouch 참조
AComponent.prototype.escapePreventTouch = function()
{
/*
	if(afc.andVer>4.3) return;
	
	if(this.getContainer() instanceof AWindow)
	{
		var thisObj = this;
	    this.$ele.on('touchstart', function(e)
	    {
			//스크롤 매니저가 구현된 컴포넌트는 리턴
			if(thisObj.scrlManager || thisObj.scrlManagerX || thisObj.scrlManagerY) return;
	    	
	    	if(thisObj.isScroll && !thisObj.isScroll()) return; 
	    	
	    	e.stopPropagation();
	    });
	}
	*/
};

//컨테이너에 기본 touch 를 disable 시켜 드래그 바운스 효과를 없앨 경우 
//기본적인 스크롤 기능도 사라진다. 이 경우 scrollManager 를 사용하거나
//자체 스크롤 기능을 활성화 시키기 위해 이 함수를 호출하면 특정 컴포넌트만 활성화 된다.
AComponent.prototype.escapePreventDefault = function()
{
	/*
    this.$ele.on('touchstart', function(e)
    {
    	e.stopPropagation();
    });
	*/
	
	//iphone web
	this.$ele.bind('touchstart', function(e)
	{
		e.target.noPreventDefault = true;
	});
	
	
	
};

AComponent.prototype.setEventSync = function(dstEventEle) 
{
	if(dstEventEle)
	{
		if(this.downHandler) this.setEventSync(null);
	
		this.downHandler = AEvent.bindEvent(this.element, AEvent.ACTION_DOWN, function(e)	{ AEvent.triggerEvent(dstEventEle, AEvent.ACTION_DOWN, e); });
		this.moveHandler = AEvent.bindEvent(this.element, AEvent.ACTION_MOVE, function(e)	{ AEvent.triggerEvent(dstEventEle, AEvent.ACTION_MOVE, e); });
		this.upHandler = AEvent.bindEvent(this.element, AEvent.ACTION_UP, function(e)	{ AEvent.triggerEvent(dstEventEle, AEvent.ACTION_UP, e); });
	}
	else
	{
		AEvent.unbindEvent(this.element, AEvent.ACTION_DOWN, this.downHandler);
		AEvent.unbindEvent(this.element, AEvent.ACTION_MOVE, this.moveHandler);
		AEvent.unbindEvent(this.element, AEvent.ACTION_UP, this.upHandler);
		
		this.downHandler = this.moveHandler = this.upHandler = null;
	}
};

//info : {maxChar:15, fontSize:24}
AComponent.prototype.autoShrink = function(info) 
{
	this.$ele.autoShrink(info);
};

//info : {maxChar:15, fontSize:24, unit:'px'}
AComponent.prototype.setShrinkInfo = function(info, ele)
{
	if(!ele) ele = this.element;

	if(info) ele.shrinkInfo = info;
	else
	{
		delete ele.shrinkInfo;
		ele.style['font-size'] = '';
	}
};




//start make by ukmani
//툴팁설정
AComponent.prototype.initTooltip = function()
{
	var thisObj = this;
	
	this.ttMsg = this.getAttr('data-tooltip');
	
	if(this.ttMsg)
	{
		if(!window['ATooltip'])
		{
			AToast.show('ATooltip is not imported.');
			return;
		}
		
		var timer = null;
		
		this.$ele.hover(
			function()
			{ 
				timer = setTimeout(function()
				{
					timer = null;
					thisObj.showTooltip(); 
				}, 700);
				
			},
			function()
			{ 
				if(timer) 
				{
					clearTimeout(timer);
					timer = null;
				}
				else thisObj.hideTooltip(); 
			}
		);
	}
};

AComponent.prototype.showTooltip = function()
{
	if(this.tooltip)
	{
		this.tooltip.hide();
		this.tooltip = null;
	}

    if(this.isValid())
    {
	    this.tooltip = new ATooltip();
	    this.tooltip.show(this.ttMsg, this.getBoundRect());
    }
};

AComponent.prototype.hideTooltip = function()
{
	if(this.tooltip)
	{
		this.tooltip.hide();
		this.tooltip = null;
	}
};

AComponent.prototype.reloadTooltip = function()
{
	this.hideTooltip();
	this.showTooltip();
};

AComponent.prototype.getTooltip = function()
{
	return this.ttMsg;
};

AComponent.prototype.setTooltip = function(ttMsg)
{
	this.$ele.attr('data-tooltip', ttMsg);

	if(!this.ttMsg) this.initTooltip();
	else this.ttMsg = ttMsg;
};

//	현재 스타일을 객체로 반환한다.
AComponent.prototype.getCompStyleObj = function()
{
	//	getDefinedStyle 함수는 AUtil에서 만든 함수
	return {"main": this.get$ele().getDefinedStyle()};
};

//	스타일을 다른 컴포넌트의 스타일로 변경한다.
AComponent.prototype.setCompStyleObj = function(obj)
{
	for(var p in obj.main) this.setStyle(p, obj.main[p]);
};

// 매핑가능한 개수를 리턴한다.
AComponent.prototype.getMappingCount = function()
{
	return 1;
};

//cursor
AComponent.prototype.setCursor = function(cursorName)
{
	this.$ele.css('cursor', !cursorName ? 'default' : cursorName);
};

AComponent.prototype.getCursor = function()
{
	return this.$ele.css('cursor');
};


AComponent.prototype.setFocus = function(noActive)
{
	if(this.isValid())
	{
		this.element.focus();
		AComponent.setFocusComp(this, noActive);
	}
};

//compIdPrefix 는 AView 인 경우만 사용한다.

//이미 초기화 된 컴포넌트의 클론은 문제 발생 요소가 많아 제거함
AComponent.prototype.cloneComponent = function()
{
	if(!this.isValid()) return null;

	let cloneComp = new window[this.getClassName()](),
		context = this.$ele.clone()[0];

    context.id = undefined
	context.container = undefined
	context.rootView = undefined
	
	cloneComp.init(context);
	
	return cloneComp;
};

AComponent.prototype.getMultiAttrInfo = function(dataKey)
{
	var attrs = this.element.attributes, obj = {}, attrName, key;

	//dataKey 가 포함된 태그의 attribute 들을 object 로 만들어 리턴한다.
	//attribute 이름에서 dataKey 부분을 제외한 영역을 오브젝트의 키로 하고 attribute value 를 
	//object 의 값으로 한다.
	for(var p in attrs)	//p is 0,1,2, ...
	{
		attrName = attrs[p].name;
		if(attrName && attrName.indexOf(dataKey)>-1)
		{
			key = attrName.replace(dataKey, '');
			obj[key] = this.$ele.attr(attrName);
		}
	}
	
	return obj;
};

// 컴포넌트 내부에 드랍 가능여부 리턴
AComponent.prototype.getDroppable = function()
{
	return false;
};

//noOverwrite 가 true 이면, 기존의 값이 존재할 경우 덮어쓰지 않는다.
AComponent.prototype.setOption = function(option, noOverwrite)
{
    for(var p in option)
    {
    	if(!option.hasOwnProperty(p)) continue;
    	
		if(!noOverwrite || this.option[p]==undefined)
		{
			this.option[p] = option[p];
		}
    }
};

AComponent.prototype.setUpdateType = function(updateType)
{
	this.updateType = updateType;
};

AComponent.prototype.includeChildView = function(parentView, groupName)
{
    let inx = 0

    if(!groupName)
    {
        parentView.eachChild((acomp)=>
        {
            if(acomp !== this && acomp instanceof AView) this._includeView(acomp, inx++)
        })
    }
    else
    {
        parentView.findCompByGroup(groupName).forEach((acomp)=>
        {
            if(acomp !== this && acomp instanceof AView) this._includeView(acomp, inx++)
        })
    }
}

AComponent.prototype._includeView = function(view, inx)
{

}

//-----------------------------------------------------------------
//	다음 두 함수는 개발 시점에만 사용되어진다.

//Apperance 의 style 에 추가된 css class 값들을 object 형태로 리턴
//default style 값만 리턴한다.
//서브 태그에 data-style- 이 추가된 컴포넌트는 함수를 재구현한다.
AComponent.prototype._getDataStyleObj = function()
{
	var ret = {}, val = this.getAttr(afc.ATTR_STYLE);
	
	//attr value 에 null 이나 undefined 가 들어가지 않도록
	ret[afc.ATTR_STYLE] = val ? val : '';
	
	return ret;
};

// object 형식의 css class 값을 컴포넌트에 셋팅한다.
// default style 값만 셋팅한다.
AComponent.prototype._setDataStyleObj = function(styleObj)
{
	this._set_class_helper(this.$ele, null, styleObj, afc.ATTR_STYLE);
};

AComponent.prototype._set_class_helper = function($attrEle, $cssEle, styleObj, attrKey)
{
	var attrVal = $attrEle.attr(attrKey);
	
	if(!$cssEle) $cssEle = $attrEle;

	//기존에 추가되어져 있던 default style 을 제거하고
	if(attrVal) $cssEle.removeClass(attrVal);

	attrVal = styleObj[attrKey];

	//새로 셋팅되는 default style을 추가한다.
	if(attrVal) $cssEle.addClass(attrVal);
	
	$attrEle.attr(attrKey, attrVal);
};

//컴포넌트에 데이터를 세팅하는 함수, 가져오는 함수
AComponent.prototype.setData = function(){};
AComponent.prototype.getData = function(){};

//개발시점을 판단하는 함수
AComponent.prototype.isDev = function()
{
	return window._isDev;
};

//컴포넌트의 animation을 재생하는 함수.
AComponent.prototype.playAnimate = function()
{
    let keyframeArr;
	try
	{
		keyframeArr = JSON.parse(this.getAttr('data-keyframe'));
	}
	catch(e)
	{
		return;
	}

    if(!keyframeArr) return;

	//이미 재생중인 애니메이션을 cancel 요청한뒤에 잠시후에 다시 재생시도.
	if(this.__AnimObj) 
	{	
		this.__AnimObj.cancel();
		setTimeout(()=>{
			this.playAnimate();
		}, 50)
		return;
	}
	
	let option = {
		duration: parseTime(this.element.style.getPropertyValue('animation-duration'), 0),
		easing: this.element.style.getPropertyValue('animation-timing-function') || 'linear',
		delay: parseTime(this.element.style.getPropertyValue('animation-delay'), 0),
		iterations: parseIterations(this.element.style.getPropertyValue('animation-iteration-count'), 1),
		direction: this.element.style.getPropertyValue('animation-direction') || 'normal',
		fill: this.element.style.getPropertyValue('animation-fill-mode') || 'none'
	};
		
	let AnimObj = this.element.animate(keyframeArr, option);
	this.__AnimObj = AnimObj;
	AnimObj.onfinish = () => {
		this.__AnimObj = null;
	}
	
	AnimObj.oncancel = () => {
		this.__AnimObj = null;
	}
	
	function parseTime(timeString, defaultValue) {
		if (timeString === "" || timeString === undefined) return defaultValue;
		if (timeString.endsWith('ms')) {
			return parseFloat(timeString);
		} else if (timeString.endsWith('s')) {
			return parseFloat(timeString) * 1000;
		}
		return defaultValue;
	}

	function parseIterations(iterationsString, defaultValue) {
		if (iterationsString === "" || iterationsString === undefined) return defaultValue;
		if (iterationsString === 'infinite') return Infinity;
		return parseFloat(iterationsString);
	}
};
