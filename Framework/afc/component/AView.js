
/**
 * @author asoocool
 */
 
//------------------------------------------------------------------------
//	뷰에는 내부에 다른 뷰를 로드하는 기능이 없도록 한다. 
//	뷰는 오로지 addcomponent 를 통해서만 다른 컴포넌트를 추가할 수 있다. 
//	폼을 구성하기 위한 기본 요소이다.
//------------------------------------------------------------------------

class AView extends AComponent
{
	constructor()
	{
		super()
	
		this.isActiveActionDelay = afc.isMobile;   //모바일인 경우만 true

		//AView 의 소유자, 자신을 로드한 주체
		this.owner = null;
		this.document = null;
		this.url = null;

		//중복 아이디를 막기 위해 동적으로 할당된 prefix
		//afc.CLASS_MARK 를 포함하고 있다. ex, 4736352637362--
		this.compIdPrefix = '';

		//자체적인 스크롤 구현
		this.scrlManagerX = null;
		this.scrlManagerY = null;

		//this.isInitDone = false;	//init 이 완전히 완료되었는지, 알메이트 컴포넌트 관련해서 체크해야 함


		this.ldView = null;	//loaded view --> deprecated
		this.ldCntr = null;
	}

	
	
}

window.AView = AView


//--------------------------------------------------------------------------------------------
//	static area

AView.CONTEXT = 
{
    tag: '<div data-base="AView" data-class="AView" class="AView-Style"></div>',

    defStyle: 
    {
        width:'400px', height:'200px'
    },

    //events: ['swipe', 'longtab', 'scroll', 'scrollleft', 'scrollright', 'scrolltop', 'scrollbottom', 'drop', 'dragStart', 'dragEnd' ]
    events: ['click', 'dblclick', 'swipe', 'longtab', 'scroll', 'scrollleft', 'scrollright', 'scrolltop', 'scrollbottom' ]
};

AView.NAME = "AView";

//lay 에 매칭된 cls 파일이 이미 로드되어 있어도 재로드 한다.
AView.enforceClsLoad = false;

AView.setViewInItem = function(aview, item, owner)
{
	aview.$ele.css(
	{
		position: 'relative',
		left: '0px', top: '0px'
	});

	$(item).append(aview.$ele);

	aview.owner = owner;	//자신을 로드한 주체(AComponent, AContainer)
	aview._item = item;		//뷰를 감싸고 있는 dom element 값을 item 이란 변수로 저장
	item.view = aview;		//item 은 view 란 변수로 AView 객체를 저장

	if(owner) aview.element.container = owner.getContainer();
	
	return aview;
};


//	뷰 객체만 로드하여 얻고 싶은 경우는 
//	item 에 null 값을 주고 url 만 입력하면 됨
//	--> AView.createView(null, 'view/test.lay');
//
//	turnback 은 비동기 함수인 callback 에 다시 되돌려주는 변수
//	callback 변수를 거짓으로 넘기면서 turnback 에 이미 로드된 html 을 넘기면 loadHtml 를 호출하지 않고 view 를 생성한다.

AView.createView = function(item, url, owner, eventListener, skipUpdatePos, skipActiveDone, callback, turnback)
{
	//Promise 지원
	return new Promise(function(resolve, reject) 
	{
		var aview = null;
		//var searchValue = AUtil.extractFileNameExceptExt(url, '/') + afc.CLASS_MARK;

		if(!item) item = $('<div></div>')[0];

		//반응형 사용여부
		if(PROJECT_OPTION.general.responsiveLay)
		{
			var RESPONSIVE_MODE = null;

			if(afc.isPC) RESPONSIVE_MODE = 'Pc'; 
			else if(afc.isMobile) 
			{
				if(afc.isTablet) RESPONSIVE_MODE = 'Pc';
				else RESPONSIVE_MODE = 'Mobile';

				//RESPONSIVE_MODE = 'Mobile';
			}

			if(afc.isSimulator && PROJECT_OPTION.general.responsiveTest)
			{
				RESPONSIVE_MODE = PROJECT_OPTION.general.responsiveTest;
			}

			if(RESPONSIVE_MODE)
			{
				var path = AUtil.extractLoc(url,'/');
				var fileName = AUtil.extractFileNameExceptExt(url,'/');
				var resUrl = path + RESPONSIVE_MODE + '/' +fileName+'.lay';
				if(ResponsiveManager.isExistFile(url, RESPONSIVE_MODE)) url = resUrl;
			}
		}

		//로컬라이징 사용여부
		if(PROJECT_OPTION.general.localizing)
		{
			let path = AUtil.extractLoc(url,'/');
			let fileName = AUtil.extractFileNameExceptExt(url,'/');
			let resUrl = path + LocalizeManager.LANGUAGE + '/' +fileName+'.lay';
			if(LocalizeManager.isExistFile(url, LocalizeManager.LANGUAGE)) url = resUrl;
		}
		
		//afc.asyncWait.reg(url);

		// turnback 은 비동기 함수인 callback 에 다시 되돌려주는 변수
		// callback 변수를 거짓으로 넘기면서 turnback 에 이미 로드된 html 을 넘기면 loadHtml 를 호출하지 않고 view 를 생성한다.

		if(!callback && turnback) 
		{
			item.innerHTML = turnback;

			_loadHelper.call(item, turnback);
		}
		else 
		{
			//afc.loadHtml(item, url, _loadHelper, null, null, Boolean(asyncCallback));
			afc.loadHtml(item, url, _loadHelper); 
		}

		async function _loadHelper(retHtml)
		{
			//retHtml 이 null 인 경우는 ajax 에러이므로 리턴한다.
			if(!retHtml) 
			{
				if(callback) callback(null);
				else resolve(null);
				
				//afc.asyncWait.unreg(url);
				return;
			}
		
			//마지막으로 로드 성공한 html 문자열 정보를 저장해 둔다.
			//if(retHtml) AView.lastLoadedHtml = retHtml;
			if(owner) owner.lastLoadedHtml = retHtml;

            let viewObj = $(item).children();
	        let viewContext = viewObj[0];

			//AView의 absolute 옵션을 relative로 바꿔준다.
			//그래야 자식 컴포넌트들이 자신을 기준으로 배치된다.
			viewObj.css(
			{
				position: 'relative',
				left: '', top: ''
			});

			var _className = viewObj.attr(afc.ATTR_CLASS), isAView = (_className=='AView'),	//lay 에 매칭된 cls 가 없는 경우는 기본 AView class 이다.
				isRespCss = viewObj.hasClass(_className+'-resp');

			if(!_className)
			{
				console.warn(afc.log('There is no className in attribute. url : ' + url));
			}

			if(isRespCss)
			{
				afc.loadCss('Template/' + _className + '-resp.css');
			}

			//-------------------------------------------------------------------------
			// 컴포넌트 파일 동적 로딩
			//if(PROJECT_OPTION.build.dynamicComp && !isAView) 
			if(PROJECT_OPTION.build.frwLoadOption=='inTimeLoad')// && !isAView) 
			{
				var classMap = viewObj.attr('data-class-map');

				if(classMap)
				{
					var arr, p, i;

					classMap = JSON.parse(classMap);
					for(p in classMap)
					{
						arr = classMap[p];

						for(i=0; i<arr.length; i++)
						{
							afc.import('Framework/' + p + '/component/' + arr[i] + '.js');
							afc.import('Framework/' + p + '/event/' + arr[i] + 'Event.js');
						}
					}
				}
			}
			//-------------------------------------------------------------------------

			//-------------------------------------------------------------------------
			// cls 파일 동적 로딩
			//if(PROJECT_OPTION.build.dynamicInc && !isAView) 
			//cls 파일은 무조건 동적 로딩으로 바뀌어서 PROJECT_OPTION.build.dynamicInc 이 옵션을 비교할 필요 없음.
			if(!isAView && url) 
			{
				//로컬라이징 사용여부
				if(PROJECT_OPTION.general.localizing) url = url.replace("/"+LocalizeManager.LANGUAGE+"/","/");
				//반응형
				if(PROJECT_OPTION.general.responsiveLay) url = url.replace("/"+RESPONSIVE_MODE+"/","/");

				//로드가 완료된 이후에 scriptReady 가 호출되어야 한다.
				await afc._loadScriptWait( url.substring(0, url.lastIndexOf(".")) + '.js', AView.enforceClsLoad);	//true, 무조건 강제 로드
			}
			//-------------------------------------------------------------------------		

			//위에서 동적으로 로드한 스크립트가 모두 로드된 후에 진행되도록
			//위의 스크립트 내부에서 호출된 await afc.import(); 까지 모두 로드되어야 호출된다.
			afc.scriptReady(function()
			{
                let _classFunc = window[_className];
                if(!_classFunc) 
                {
                    //alert(afc.log('We can not find the class of ' + _className ));
                    console.warn(afc.log('We can not find the class of ' + _className ));

                    aview = new AView();
                }
                else aview = new _classFunc();

				aview.url = url;
				aview.owner = owner;	//자신을 로드한 주체(AComponent, AContainer)
				aview._item = item;		//뷰를 감싸고 있는 dom element 값을 item 이란 변수로 저장
				item.view = aview;		//item 은 view 란 변수로 AView 객체를 저장


				var rootView = aview;

				if(owner) 
				{
					viewContext.container = owner.getContainer();

					//단독으로 로드된 lay 인 경우 owner 의 루트뷰로 변경해 준다.
					if(isAView && owner.getRootView) //AContainer 인 경우는 함수가 없다.
					{
						rootView = owner.getRootView();
					}
				}

				if(!eventListener) eventListener = rootView;

				//비동기 로드이면 쿼리 파일도 비동기로 로드되도록
				//rootView.isAsyncQryLoad = true;

				viewContext.rootView = rootView;
				viewContext.compIdPrefix = afc.makeCompIdPrefix();

				aview.init(viewContext, eventListener);

                //hot reload 기능
                if(theApp.isHotReload())
                {
                    //로드된 뷰인 경우만
                    if(!isAView && url) theApp.watchReloadFile(aview);
                }

                //afc.queryReady의 타이밍 이슈로 afc.queryReady호출되기전에 처리.
                aview._rMateManage(skipUpdatePos, skipActiveDone, function()
                {
                    afc.queryReady(aview, function()
                    {
                        //initDone, activeDone 이전에 호출된다.
                        if(callback) callback(aview, turnback);
                        else resolve(aview);

                        aview._initDoneManage(skipUpdatePos, skipActiveDone);
                    })
                })

			});
		}
	
	});
	
	//return aview;

};

AView._findTextContains = function(viewComp, text, ignoreCase, retArr)
{
	var ret = null, tmp;
	
	if(retArr) ret = retArr;
	else ret = [];
	
	if(ignoreCase) text = text.toLowerCase();
	
	viewComp.eachChild(function(acomp)
	{
		if(acomp instanceof AView || acomp instanceof ALayout) 
		{
			AView._findTextContains(acomp, text, ignoreCase, ret);
		}
		else if(acomp.getText) 
		{
			tmp = acomp.getText();

			if(ignoreCase) tmp = tmp.toLowerCase();

			if(tmp.indexOf(text)>-1) ret.push(acomp);
		}
	});
	
	return ret;
};


//--------------------------------------------------------------------------------------------


AView.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	//context 에 rootView 가 셋팅되어져 있지 않으면 자신을 rootView 로 셋팅한다.	
	if(!this.element.rootView) this.element.rootView = this;

	//var respClass = this.getAttr(afc.ATTR_RESP);
	//if(respClass) this.addClass(respClass);
	
	this.setOption(
	{
		getDataAsArray : this.getAttr('data-option-getdata-as-array')
		
	}, true);
	
	//jQuery droppable 클래스 제거
	this.removeClass('ui-droppable');
	
	//if(!this.element.noRealizeChildren) this._realizeChildren(evtListener);
	
	this._realizeChildren(evtListener, this.reInitComp);
	
	// 개발중에 하위 컴포넌트를 선택하지 못하는 경우 직접 하위 컴포넌트의 이벤트를 등록하여 전달해준다.
	this.loadChildEventInfo(evtListener);
	
	/*
	if(afc.isIos)
	{
		if(this.$ele.css('overflow')!='hidden')
			this.$ele.css('-webkit-overflow-scrolling', 'touch');
	}
	else
	{
		var val = this.$ele.css('overflow');
		
		//뷰에 스크롤이 발생할 경우 가속기능을 부여하기 위해, z-index가 없거나 auto인 경우 0으로 대체
		//이 부분이 없으면 크롬 브라우저에서 뷰 스크롤 시 안보이던 부분이 안그려지는 버그가 생김
		if(val=='auto' || val=='scroll')
		{
			val = this.$ele.css('z-index');
			if(!val || val == 'auto') this.$ele.css('z-index', 0);
			
			// 여러 absolue 태그가 중첩되어 스크롤 기능이 작동될 때
			// 겹쳐지는 버그 수정(z-index 관련 오류)
			this.$ele.css('-webkit-backface-visibility', afc.isSimulator?'':'hidden');
			// 이미 backface0visibility 값이 SpiderGen에서 화면 오픈 할 때 hidden으로 처리되었으므로 일단 제거하고
			// 추후에 아래의 내용으로 변경할지 고민 필요
			//if(!afc.isSimulator && !window.afc_) this.$ele.css('-webkit-backface-visibility', 'hidden');
		}
		
		
		//android 4.3 이하, BugFix
		//스크롤뷰 안의 컴포넌트 터치 안되는 버그 수정
		if(afc.andVer<4.4)
		{
			this.$ele.css('-webkit-transform', 'translateZ(0)');
			
			//thisObj = this;
			//setTimeout(function() { thisObj.$ele.css('-webkit-transform', ''); }, 100);
		}
	}
	*/
	
	//-----------------------------------------------------------------------
	//	asoocool 2019.04.09 
	var val = this.$ele.css('overflow');

	if(val=='auto' || val=='scroll')
	{
		if(afc.isIos)
		{
			this.$ele.css('-webkit-overflow-scrolling', 'touch');
		}

		//	android
		//	뷰에 스크롤이 발생할 경우 가속기능을 부여하기 위해, z-index가 없거나 auto인 경우 0으로 대체
		//	이 부분이 없으면 크롬 브라우저에서 뷰 스크롤 시 안보이던 부분이 안그려지는 버그가 생김
		else
		{
			val = this.$ele.css('z-index');
			if(!val || val == 'auto') this.$ele.css('z-index', 0);
			
			// 여러 absolue 태그가 중첩되어 스크롤 기능이 작동될 때
			// 겹쳐지는 버그 수정(z-index 관련 오류)
			this.$ele.css('-webkit-backface-visibility', afc.isSimulator?'':'hidden');

			// 이미 backface0visibility 값이 SpiderGen에서 화면 오픈 할 때 hidden으로 처리되었으므로 일단 제거하고
			// 추후에 아래의 내용으로 변경할지 고민 필요
			//if(!afc.isSimulator && !window.afc_) this.$ele.css('-webkit-backface-visibility', 'hidden');
			
			if(afc.isScrollIndicator) 
			{
				this._enableScrollIndicatorX();
				this._enableScrollIndicatorY();
			}
		}
	}
	
	//-----------------------------------------------------------------------	
	
	//this.escapePreventTouch();
	
	if(!this.reInitComp)
	{
		this.actionToFocusComp();

		if(context && context.compIdPrefix) this._changeCompIdPrefix(context.compIdPrefix);

		//for mirae - crud component 확인
		//this._initCrudComponent();


		var loadUrl = this.getAttr('data-load-url');
		if(loadUrl && !this.isDev()) 
		{
			var thisObj = this;

			//setTimeout(function()
			//{
				thisObj.loadView(loadUrl);

			//}, 0);
		}
	}
	
	
};


AView.prototype._initCrudComponent = function() 
{
	if(typeof CrudManager != "function") return;
	
	this.crudObj = CrudManager.getCrudbyFileName(this.className);
	if(!this.crudObj) return;
    var children = this.getChildren();

	for(var i=0;i<children.length;i++)
	{
		this._findChildCrudComp(children[i]);
	}

};

AView.prototype._findChildCrudComp = function(comp) 
{
	if(comp.baseName == 'AGridLayout' || comp.baseName == 'AFlexLayout')
	{
		var thisObj = this;
		comp.eachChild(function(acomp){
			thisObj._findChildCrudComp(acomp);
		});
	}
	else if(comp.baseName == 'AView' || comp.baseName == 'ARadioGroup')
	{
		var childView = comp.getChildren();
		for(var i in childView)
		{
			this._findChildCrudComp(childView[i]);
		}
	}
	else
	{
		var crud = comp.getAttr('data-crud');
		switch(crud)
		{
			case '1':
				if(this.crudObj.create == '0') comp.enable(false);
			break;
			case '2':
				if(this.crudObj.read == '0') comp.enable(false);
			break;
			case '3':
				if(this.crudObj.update == '0') comp.enable(false);
			break;
			case '4':
				if(this.crudObj.delete == '0') comp.enable(false);
			break;
		}
	}
};

//리턴값과 상관없이 callback 만 있으면 되지만 기존 코드와의 호환성을 위해 유지
AView.prototype._rMateManage = function(skipUpdatePos, skipActiveDone, callback) 
{
	if(!window.rMate) 
    {
        if(callback) callback()
        return false;
    }

	let $rGrid = this.$ele.find('.RGrid-Style'),
		$rChart = this.$ele.find('.RChart-Style'),
		gridCnt = $rGrid.length, chartCnt = $rChart.length, thisObj = this;

	function _initDoneCheck()
	{
		if( gridCnt+chartCnt == 0 && thisObj.isValid())
		{
			//thisObj._initDoneManage(skipUpdatePos, skipActiveDone);
            if(callback) callback()
            else thisObj._initDoneManage(skipUpdatePos, skipActiveDone);
		}
	}

	if(gridCnt+chartCnt > 0)
	{
		let delegator = 
		{
			onChartReady: function(rChart)
			{
				//console.log(rChart.className + ':' + chartCnt);

				chartCnt--;
				_initDoneCheck();
			},

			onGridReady: function(rGrid)
			{
				//console.log(rGrid.className + ':' + gridCnt);

				gridCnt--;
				_initDoneCheck();
			}
		};

		$rGrid.each(function() { this.acomp.setDelegator(delegator); });
		$rChart.each(function() { this.acomp.setDelegator(delegator); });

		return true;
	}
	
	else 
    {
        if(callback) callback()
        return false;
    }
};

AView.prototype.onContextAvailable = function()
{
    this.eachChild(function(acomp)
    {
        if(acomp.onContextAvailable) acomp.onContextAvailable();
    });
};

AView.prototype._initDoneManage = function(skipUpdatePos, skipActiveDone) 
{
	var thisObj = this;
	
	//화면이 렌더링된 후 onInitDone 이 호출되도록 
	setTimeout(function()
	{
		if(!thisObj.isValid()) return;
	
		//thisObj.onInitDone();

		if(!skipUpdatePos) 
        {
            thisObj.onContextAvailable();
            thisObj.updatePosition();
        }

        thisObj.onInitDone();

		if(!skipActiveDone) 
		{
			thisObj.onActiveDone(true);

			var tabview = thisObj.owner;

			//동적 로드 옵션인 경우는 없을 수도 있다.
			if(window['ATabView'] && tabview instanceof ATabView)
			{
				if(tabview.delegator && tabview.delegator.afterTabChanged) 
				{
					var oldView = tabview.oldTab ? tabview.oldTab.content.view : null;
					tabview.delegator.afterTabChanged(oldView, thisObj, true, tabview);
				}
			}
		}
	
	}, 0);
	
};


AView.prototype.getUrl = function() 
{
	return this.url;
};

AView.prototype._callSubActiveEvent = function(funcName, isFirst) 
{
	//최초 onActiveDone 은 initDoneManage 에서 호출해 주므로 스킵한다.
	if(funcName=='onActiveDone' && isFirst) return;

	if(this.ldView)
	{
		this.ldView[funcName].call(this.ldView, isFirst);
	}
	
	else if(this.ldCntr)
	{
		this.ldCntr[funcName].call(this.ldCntr, isFirst);
	}
	
	else
	{
		this.$ele.children().each(function()
		{
			if(!this.acomp) return;
			
			//서브 아이템으로 뷰를 가지고 있는 컴포넌트들(ATabView, ASplitView, AFlexView)은 
			//_callSubActiveEvent 란 함수를 가지고 있다.	AListView는 필요시 동적으로 함수를 만든다.
			if(this.acomp._callSubActiveEvent) this.acomp._callSubActiveEvent(funcName, isFirst);
		});
	}
	
};

AView.prototype.enableActiveFocus = function(enable) 
{
	this.isActiveFocus = enable;
};


AView.prototype.onInitDone = function() 
{

};


//필요한 곳에서 재구현해서 사용한다.
//_callSubActiveEvent 함수 호출하면 서브 컴포넌트에 전달해 준다.

//뷰가 활성화되기 바로 전에 호출된다.
AView.prototype.onWillActive = function(isFirst) 
{
	if(this.isActiveFocus) AComponent.setFocusComp(this);
	
	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this._callSubActiveEvent('onWillActive', isFirst);
};

//뷰의 활성화가 시작되면 호출된다.
AView.prototype.onActive = function(isFirst) 
{
	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this._callSubActiveEvent('onActive', isFirst);
};

//뷰의 활성화가 완료되면 호출된다.
AView.prototype.onActiveDone = function(isFirst) 
{
	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this._callSubActiveEvent('onActiveDone', isFirst);
	
	//IOS 웹 브라우저에서 스크롤이 안되는 버그 수정
	if(!AContainer.disableIosScroll && afc.isIos && !afc.isHybrid) afc.refreshApp(this.$ele);
	
	//뷰가 활성화 될 때 화면을 다시 한번 그려준다.
	//브라우저의 여러 경우에 따라 화면 렌더링의 버그가 있을 경우 옵션을 설정해 준다.
	//else if(this.option.isActiveRerender) afc.refreshApp();
};

AView.prototype.onWillDeactive = function() 
{
	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this._callSubActiveEvent('onWillDeactive');
};

AView.prototype.onDeactive = function() 
{
	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this._callSubActiveEvent('onDeactive');
};

AView.prototype.onDeactiveDone = function() 
{

	var cntr = this.getContainer();
	if(cntr && cntr.isActiveRecursive) this._callSubActiveEvent('onDeactiveDone');
};


//--------------------------------------------------------

/*
AView.prototype.reuse = function()
{
	AComponent.prototype.reuse.call(this);
	
	var container = this.getContainer();
	
	this.$ele.children().each(function()
	{
		if(this.acomp) 
		{
			this.container = container;
			//루트뷰는 변경되지 않는다.
			//this.rootView = rootView;
			this.acomp.reuse();
		}
	});
};
*/

AView.prototype.setScrollArrowX = function()
{
	var sa = new ScrollArrow();
	sa.setArrow('horizontal');
	sa.apply(this.element);
};

AView.prototype.setScrollArrowY = function()
{
	var sa = new ScrollArrow();
	sa.setArrow('vertical');
	sa.apply(this.element);
};


AView.prototype._enableScrollIndicatorX = function()
{
	this.scrlIndicatorX = new ScrollIndicator();
	this.scrlIndicatorX.init('horizontal', this.element);
	
	var thisObj = this;
	
	//scrollIndicator 는 상위 element 에 추가된다.
	//view 는 scrollArea 가 없기 때문에 스크롤바의 위치를 보정해야 함.
	this.scrlIndicatorX.resetScrollPos(function()
	{
		if(!thisObj.isValid()) return;
		var value = thisObj.getPos().left;
		
		this.setStyle({left: value+'px'});
		this.setScrollOffset(value);
	});	
};

AView.prototype._enableScrollIndicatorY = function()
{
	this.scrlIndicatorY = new ScrollIndicator();
	this.scrlIndicatorY.init('vertical', this.element);
	
	var thisObj = this;
	
	this.scrlIndicatorY.resetScrollPos(function()
	{
		if(!thisObj.isValid()) return;
		var value = thisObj.getPos().top;
		
		this.setStyle({top: value+'px'});
		this.setScrollOffset(value);
	});	
};

AView.prototype.enableScrlManagerX = function()
{
	if(this.scrlManagerX) return this.scrlManagerX;
	
	this.scrlManagerX = new ScrollManager();
	
	//animationFrame 이 지원되지 않는 경우만 작동되는 옵션
	this.scrlManagerX.setOption(
	{
		startDelay: 10,
		endDelay: 20,
		scrollAmount: 10,
		speedRatio: 0.03
	});
	
	this.$ele.css({'overflow':'auto', '-webkit-overflow-scrolling': ''});
	
	this._scrollXImplement();
	this.aevent._scroll();
	
	return this.scrlManagerX;
};

AView.prototype.enableScrlX = function()
{
	this.scrlManagerX.enableScroll(true);
};

AView.prototype.disableScrlX = function()
{
	this.scrlManagerX.enableScroll(false);
};

AView.prototype.enableScrlManagerY = function()
{
	if(this.scrlManagerY) return this.scrlManagerY;
	
	this.scrlManagerY = new ScrollManager();
	this.$ele.css({'overflow':'auto', '-webkit-overflow-scrolling': ''});
	
	this._scrollYImplement();
	this.aevent._scroll();
	
	return this.scrlManagerY;
};

AView.prototype.setScrollXComp = function(acomp)
{
	this.scrollXComp = acomp;
};

AView.prototype._scrollXImplement = function()
{
	var aview = this;
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var isDown = false;
	
	this.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		
		//e.preventDefault();
		
		aview.scrlManagerX.initScroll(e.changedTouches[0].clientX);
	});
	
	this.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		e.preventDefault();
		
		var scrlArea = this;
		aview.scrlManagerX.updateScroll(e.changedTouches[0].clientX, function(move)
		{
			scrlArea.scrollLeft += move;
			if(aview.scrollXComp) aview.scrollXComp.element.scrollLeft += move;
		});
	});
	
	this.bindEvent(AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		//e.preventDefault();
		
		var scrlArea = this;
		aview.scrlManagerX.scrollCheck(e.changedTouches[0].clientX, function(move)
		{
			scrlArea.scrollLeft += move;
			if(aview.scrollXComp) aview.scrollXComp.element.scrollLeft += move;
			
			return true;
		});
	});
};

AView.prototype._scrollYImplement = function()
{
	var aview = this;
	//PC인 경우 자신의 영역 mousedown 과 상관없이 mousemove 가 무조건 발생한다.
	var isDown = false;
	
	this.bindEvent(AEvent.ACTION_DOWN, function(e)
	{
		isDown = true;
		
		//e.preventDefault();
		
		aview.scrlManagerY.initScroll(e.changedTouches[0].clientY);
	});
	
	this.bindEvent(AEvent.ACTION_MOVE, function(e)
	{
		if(!isDown) return;
		
		e.preventDefault();
		
		var scrlArea = this;
		aview.scrlManagerY.updateScroll(e.changedTouches[0].clientY, function(move)
		{
			scrlArea.scrollTop += move;
		});
	});
	
	this.bindEvent(AEvent.ACTION_UP, function(e)
	{
		if(!isDown) return;
		isDown = false;
		
		//e.preventDefault();
		
		var scrlArea = this;
		aview.scrlManagerY.scrollCheck(e.changedTouches[0].clientY, function(move)
		{
			scrlArea.scrollTop += move;
			return true;
		});
	});
};


AView.prototype._scrollTopManage = function()
{
	if(this.scrlManagerY) this.scrlManagerY.stopScrollTimer();
	
	return true;
};

AView.prototype._scrollBottomManage = function()
{
	if(this.scrlManagerY) this.scrlManagerY.stopScrollTimer();

	return true;
};

AView.prototype._scrollLeftManage = function()
{
	if(this.scrlManagerX) this.scrlManagerX.stopScrollTimer();
	
	return true;
};

AView.prototype._scrollRightManage = function()
{
	if(this.scrlManagerX) this.scrlManagerX.stopScrollTimer();
	
	return true;
};

AView.prototype._realizeChildren = function(evtListener, reInitComp)
{
	var thisObj = this, acomp,
		container = this.getContainer(), rootView = this.getRootView();
	
	if(reInitComp)
	{
		this.$ele.children().each(function()
		{
			if(this.acomp) this.acomp.init(this.acomp.element, evtListener);
			
			//뷰를 감싸고 있는 item 인 경우
			else
			{
				acomp = $(this).children()[0].acomp;
				acomp.init(acomp.element);
			}
		});
	}
	else
	{
		this.$ele.children().each(function()
		{
			acomp = AComponent.realizeContext(this, container, rootView, thisObj, evtListener);
			if(acomp)
			{
				if(acomp.baseName != 'AView' && container && container.tabKey) container.tabKey.addCompMap(acomp, rootView.owner);
			}
			//뷰를 감싸고 있는 item 인 경우
			else
			{
				//동적으로 로드한 뷰에 대한 realize 를 시작한다.
				acomp = AComponent.realizeContext($(this).children()[0], container);

				acomp.owner = thisObj;
				acomp._item = this;		//뷰를 감싸고 있는 dom element 값을 item 이란 변수로 저장
				this.view = acomp;		//item 은 view 란 변수로 AView 객체를 저장
			}
		});
		
		if(container && container.tabKey && rootView.owner) container.tabKey.saveOwnerMap(rootView.owner);
		
	}
	
};

AView.prototype._applyLoadedQuery = function()
{
	AComponent.prototype._applyLoadedQuery.call(this);
	
	this.eachChild(function(acomp, inx)
	{
		acomp._applyLoadedQuery();
	});
};

AView.prototype._changeCompIdPrefix = function(newPrefix) 
{
	//compIdPrefix 값은 rootView 만 가지고 있다.
	if(newPrefix) this.compIdPrefix = newPrefix;
	
	var compId;
	
	this.eachChild(function(acomp, inx)
	{
		compId = acomp.getComponentId();
		
		//componentId 가 존재하면 새로운 compIdPrefix 가 적용되도록 다시 호출해 준다.
		if(compId) acomp.setComponentId(compId);
		
		//자신이 포함하고 있는 하위의 컴포넌트들도 바꿔주기 위해, AView, ALayout
		if(acomp._changeCompIdPrefix) acomp._changeCompIdPrefix();
	});
};

// 개발중에 하위 컴포넌트를 선택하지 못하는 경우 직접 하위 컴포넌트의 이벤트를 등록하여 전달해준다.
AView.prototype.loadChildEventInfo = function(evtListener)
{
	//setTimeout 을 사용해야만 해당 컴포넌트의 super init 이후의 코드도 호출되므로
	//이벤트 등록시점에 super init 이후의 코드상에서 저장한 멤버변수 등에 접근하여 사용이 가능하다.
	//setTimeout(() => {
		if(!this.aevent) return;
		const flag = window[this.baseName].CONTEXT.flag || this.getAttr('data-flag');
		if(!flag || flag.charCodeAt(1)!=0x31) return;
		//if(!flag || Number(flag.charAt(1)) != 1) return;

		if(evtListener)
		{
			var evtInfo, events = afc.getChildEventList(this.baseName);

			for(var i=0; i<events.length; i++)
			{
				evtInfo = this.getAttr(afc.ATTR_LISTENER+'-'+events[i]);
				if(evtInfo)
				{
					evtInfo = evtInfo.split(':');
					this.addEventListener(events[i], evtListener, $.trim(evtInfo[1]));
				}
			}
		}
	//});
};

/*
AView.prototype._realizeChildren = function(evtListener)
{
	var thisObj = this, container = this.getContainer(), rootView = this.getRootView();
	
	_realize_helper(this.$ele.children(), evtListener, null);
	
	//--------------------------------------------------------------------
	
	function _realize_helper($children, listener, item)
	{
		var acomp, className, classFunc;
		
		$children.each(function()
		{
			className = this.getAttribute(afc.ATTR_CLASS);

			//item
			if(!className) 
			{
				//동적으로 로드한 뷰에 대한 realize 를 시작한다.
				_realize_helper($(this).children(), null, this);
				return;
			}

			classFunc = window[className];
			if(!classFunc) 
			{
				alert(afc.log('We can not find the class of ' + className ));
				return;
			}

			acomp = new classFunc();
			this.container = container;

			//item 이 참이면 동적 로드뷰 이므로 parent 가 없다. 즉, 자신이 rootView 이다.
			if(item)
			{
				//this.owner = thisObj;
				acomp._item = item;		//뷰를 감싸고 있는 dom element 값을 item 이란 변수로 저장
				item.view = acomp;		//item 은 view 란 변수로 AView 객체를 저장
				
				this.rootView = acomp;
				//listener = acomp;		//init 시점에 listener 가 null 이면 자동으로 rootView 가 리스너가 된다.
			}
			else 
			{
				//parent 변수만 셋팅해야 하므로 setParent 함수를 호출하지 않는다.
				//acomp.setParent(thisObj);
			
				acomp.parent = thisObj;
				this.rootView = rootView;
			}

			acomp.init(this, listener);
		});
	}
};
*/

AView.prototype.setParent = function(parent)
{
	AComponent.prototype.setParent.call(this, parent);
	
	var children = this.getChildren();
	
	for(var i=0; i<children.length; i++)
	{
		// 자식들의 부모까지 바뀐 것은 아니므로 parent 를 넘겨선 안됨.
		// 그대신 자신을 넘기면서 새로운 값으로 변경된 this 의 값들을 자식들에게 셋팅해 준다.
		children[i].setParent(this);
	}
};

AView.prototype.setHtml = function(html)
{
	$(this.element).html(html);
};

AView.prototype.findCompById = function(strId)
{
	//var ele = document.getElementById(this.getRootView().compIdPrefix+strId);
	var ele = this.$ele.find('#'+this.getRootView().compIdPrefix+strId)[0];
	
	if(ele) return ele.acomp;
	else return null;
};

//return : Array
AView.prototype.findCompByGroup = function(strGroup)
{
	var ret = [];
	$(this.element).find('*[data-group="'+strGroup+'"]').each(function()
	{
		if(this.acomp) 
			ret.push(this.acomp);
	});
	
	return ret;
};

//return : Array
AView.prototype.findCompByClass = function(className)
{
	var ret = [];
	$(this.element).find('*['+afc.ATTR_CLASS+'="'+className+'"]').each(function()
	{
		if(this.acomp) 
			ret.push(this.acomp);
	});
	
	return ret;
};

//return : Array
AView.prototype.findCompByBase = function(baseName)
{
	var ret = [];
	$(this.element).find('*['+afc.ATTR_BASE+'="'+baseName+'"]').each(function()
	{
		if(this.acomp) 
			ret.push(this.acomp);
	});
	
	return ret;
};

AView.prototype.findCompByText = function(text)
{
	return AView._findTextContains(this, text, true);
};

AView.prototype.findCompByName = function(name)
{
	var ret = [];
	this.$ele.find('*[name="'+name+'"]').each(function()
	{
		if(this.acomp) 
			ret.push(this.acomp);
	});
	
	return ret;
};

AView.prototype.addComponent = function(acomp, isPrepend, posComp)
{
	if(!acomp.element) 
	{
		alert('First of all, you must call function init();');
		return;
	}
	
	if(posComp)
	{
		if(isPrepend) acomp.$ele.insertBefore(posComp.element);
		else acomp.$ele.insertAfter(posComp.element);
	}
	else
	{
		if(isPrepend) this.$ele.prepend(acomp.element);
		else this.$ele.append(acomp.element);
	}
	
	//1.0에 있던 사라진 기능
	//var arrange = this.$ele.attr('data-arrange');
	//if(arrange) acomp.$ele.css({'position':'relative', left:'0px', top:'0px', 'float':arrange});
	
	acomp.setParent(this);
};

AView.prototype.removeComponent = function(acomp)
{
	acomp.removeFromView();
};

AView.prototype.getFirstChild = function()
{
	var ele = this.$ele.children()[0];
	if(ele) return ele.acomp;
	else return null;
};

AView.prototype.getLastChild = function()
{
	var ele = this.$ele.children().last()[0];
	if(ele) return ele.acomp;
	else return null;
};

AView.prototype.getChild = function(index)
{
	var ele = this.$ele.children()[index];
	if(ele) return ele.acomp;
	else return null;
};

AView.prototype.getChildCount = function()
{
	return this.$ele.children().length;
};

AView.prototype.eachChild = function(callback, isReverse)
{
	var $children;
	
	if(isReverse) $children = $(this.$ele.children().get().reverse());
	else $children = this.$ele.children();

	$children.each(function(inx)
	{
		if(!this.acomp) return;
		
		if(callback(this.acomp, inx)==false) return false;
	});
};

AView.prototype.getChildren = function()
{
	var ret = [];
	this.$ele.children().each(function()
	{
		if(this.acomp) 
			ret.push(this.acomp);
	});
	
	return ret;
};

AView.prototype.removeChildren = function(onlyRelease)
{
	this.$ele.children().each(function()
	{
		if(this.acomp) 
			this.acomp.removeFromView(onlyRelease);
	});
};

AView.prototype.removeFromView = function(onlyRelease)
{
	this.removeChildren(onlyRelease);
	
	this.removeLoadView();
	
	this.removeLoadContainer();

    //hot reload 기능
    if(theApp.isHotReload() && this.url) theApp.unWatchFile(this);
	
	AComponent.prototype.removeFromView.call(this, onlyRelease);
};

AView.prototype.setWidth = function(w)
{
	AComponent.prototype.setWidth.call(this, w);
	
	this.updatePosition();
};

AView.prototype.setHeight = function(h)
{
	AComponent.prototype.setHeight.call(this, h);
	
	this.updatePosition();
};

AView.prototype.updatePosition = function(pWidth, pHeight)
{
	//AView 클래스만 다음 비교를 한다.
	if(pWidth!=undefined) 
		AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	
	if(this.ldView)
	{
		this.ldView.updatePosition();
	}
	
	else if(this.ldCntr)
	{
		this.ldCntr.onResize();
	}
	
	else
	{
		var width = this.$ele.width();
		var height = this.$ele.height();

		this.$ele.children().each(function()
		{
			if(this.acomp)
				this.acomp.updatePosition(width, height);
		});

		if(this.onUpdatePosition) this.onUpdatePosition(width, height);
	}
};

//툴바의 inline 기능을 추가
AView.prototype.inlineChildren = function()
{
	var children = this.getChildren();
	
	for(var i=0; i<children.length; i++)
		children[i].setInlineStyle();
};


/*
//스크롤이 있을경우 스크롤을 가운데로 셋팅
AView.prototype.scrollToCenter = function(tHeight)
{
	var tremHeight = 0;
	if(tHeight) tremHeight = tHeight;
	this.element.scrollTop = ((this.element.scrollHeight + tremHeight) - this.element.offsetHeight)/2;
};
*/

AView.prototype.scrollTo = function(pos)
{
	this.element.scrollTop = pos;
};

AView.prototype.scrollOffset = function(offset)
{
	this.element.scrollTop += offset;
};

AView.prototype.scrollToTop = function()
{
	this.element.scrollTop = this.element.scrollHeight*-1;
};

AView.prototype.scrollToBottom = function()
{
	this.element.scrollTop = this.element.scrollHeight;
};

AView.prototype.scrollToCenter = function()
{
	this.element.scrollTop = (this.element.scrollHeight - this.element.offsetHeight)/2;
};

AView.prototype.isMoreScrollTop = function()
{
	if(this.element.scrollTop > 0) return true;
	else return false;	
};

AView.prototype.isMoreScrollBottom = function()
{
	if(this.element.offsetHeight + this.element.scrollTop < this.element.scrollHeight) return true;
	else return false;	
};

AView.prototype.isMoreScrollLeft = function()
{
	if(this.element.scrollLeft > 0) return true;
	else return false;	
};

AView.prototype.isMoreScrollRight = function()
{
	if(this.element.offsetWidth + this.element.scrollLeft < this.element.scrollWidth) return true;
	else return false;
};

AView.prototype.isHscroll = function()
{
	return (this.element.offsetWidth < this.element.scrollWidth);
};

AView.prototype.isVscroll = function()
{
    return (this.element.offsetHeight < this.element.scrollHeight);
};

AView.prototype.isScroll = function()
{
	return (this.isHscroll() || this.isVscroll());
};

/*
enable 은 원래가 자신만 하면 되는데..
버그 때문에 하위까지 하게 된 것.... 그러므로...
하위까지 해야 하는 경우를 enable 함수의 파람으로 구별해서 처리하게 한다.
하위까지 해야 하는 경우는...
disable 시점에 기존의 정보를 저장해 두었다가 enable 시점에 확인하여 
기존의 값으로 복원...
하위까지 변경하는 경우 disable 없이 enable 만 호출하면 모두 풀리게 되는 것이 정상
*/
AView.prototype.enable = function(isEnable)
{
	AComponent.prototype.enable.call(this, isEnable);

	//input, textarea tag 도 같이 해줘야 이벤트 전달시 키보드 오픈을 막을 수 있다.
    this.enableChildren(isEnable);
};

AView.prototype.enableChildren = function(isEnable)
{
	//input, textarea tag 도 같이 해줘야 이벤트 전달시 키보드 오픈을 막을 수 있다.
	_enable_helper(this.element.getElementsByTagName('input'))
	_enable_helper(this.element.getElementsByTagName('textarea'))
	_enable_helper(this.element.getElementsByClassName('.RGrid-Style'))
	_enable_helper(this.element.getElementsByTagName('button')) //button 도 전달되므로 추가
	
    //@param {HTMLCollection} forms `요소의 문서 내 순서대로 정렬된 일반 컬렉션`
	function _enable_helper(forms)
	{
        if(isEnable)
        {
            // 엘리먼트이거나 컴포넌트인데 이전에 isEnable true 였던 경우 auto 처리
            // **엘리먼트인 경우에도 이전에 isEnable false 였다면 문제가 될수도 있을듯함
            Array.prototype.forEach.call(forms, function(ele) {
                if(!ele.acomp || (ele.acomp && ele.acomp.isEnable))
                    ele.style.setProperty('pointer-events', 'auto')
            })
        }
        else
        {
            Array.prototype.forEach.call(forms, function(ele)
            {
                ele.style.setProperty('pointer-events', 'none')
            })
        }
	}
};

AView.prototype.show = function()
{
	if(this.isShow()) return;
	
	this.onWillActive(false);
	
	AComponent.prototype.show.call(this);
	
	this.onActive(false);

	var thisObj = this;
	setTimeout(function() 
	{
		thisObj.onActiveDone(false);
	}, 0);
};

AView.prototype.hide = function()
{
	if(!this.isShow()) return;
	
	this.onWillDeactive();

	AComponent.prototype.hide.call(this);

	this.onDeactive();
	
	var thisObj = this;
	setTimeout(function() 
	{
		if(thisObj.isValid()) thisObj.onDeactiveDone();
	}, 0);
};

AView.prototype.shrinkChildren = function(ratio)
{
	var children = this.getChildren(), acomp, newTop, newHeight, newFontSize, unit;
	
	for(var i=0; i<children.length; i++)
	{
		acomp = children[i];
		
		//afc.log('[' + acomp.$ele.css('bottom') + ']');
		
		//newTop = acomp.getPos().top * ratio;
		//newHeight  = acomp.getHeight() * ratio;
		
		newTop = acomp.getPos().top;
		newHeight  = acomp.getHeight();
		newFontSize = acomp.$ele.css('font-size');
		
		unit = newFontSize.substring(newFontSize.length-2);
		newFontSize = Number(newFontSize.substring(0, newFontSize.length-2));
		
		//afc.log('[' + unit + ']');

		newTop = parseInt(newTop * ratio, 10);
		newHeight = parseInt(newHeight * ratio, 10);
		newFontSize = parseInt(newFontSize * ratio, 10);

		if(acomp.$ele.css('bottom')!='auto') 
		{
			acomp.$ele.css(
			{
				'height': newHeight+'px'
			});
			
			acomp.element.style.setProperty('font-size', newFontSize+unit, 'important');
		}
		else
		{
			acomp.$ele.css(
			{
				'top': newTop+'px',
				'height': newHeight+'px'
			});
			
			acomp.element.style.setProperty('font-size', newFontSize+unit, 'important');
		}
		
		//afc.log('[' + newFontSize+unit + ']');
		
		if(acomp.baseName=='AView') acomp.shrinkChildren(ratio);
	}

};

//컴포넌트에 데이터를 세팅하는 함수
AView.prototype.setData = function(data)
{
	if(Object.prototype.toString.call(data) == '[object Array]')
	{
		var children = this.getChildren();
		var len = Math.min(children.length, data.length);
		for(var i=0; i<len; i++)
		{
			if(data[i] != undefined) children[i].setData(data[i]);
		}
	}
	else if(Object.prototype.toString.call(data) == '[object Object]')
	{
		for(var key in data)
		{
			this.findCompByName(key).forEach(function(comp)
			{
				if(data[key] != undefined) comp.setData(data[key]);
			});
		}
		/*this.eachChild(function(comp)
		{
			compName = comp.getName();
			if(data[compName]) comp.setData(data[compName]);
		});*/
	}
};

//컴포넌트의 데이터를 얻어오는 함수
//isRecursive : 내부적으로 호출했는지 여부
AView.prototype.getData = function()
{
	if(this.option.getDataAsArray)
	{
		var arr = [];
		this.eachChild(function(comp)
		{
			if(comp instanceof AView || comp instanceof ALayout) arr.push(comp.getData());
			else arr.push(comp.getData());
		});

		return arr;
	}
	else
	{
		var obj = {};
		var finder = this.$ele.find('[name][name!=""]');
		if(finder.length > 0)
		{
			var comp;
			finder.each(function(idx, ele)
			{
				comp = ele.acomp;
				if(comp && !obj[comp.getName()]) obj[comp.getName()] = comp.getData();
			});
		}
		return obj;
	}
	
};

AView.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	var keyVal, children = this.getChildren(), child;
	for(var i=0; i<children.length; i++)
	{
		child = children[i];
		
		keyVal = keyArr[i];
		if(keyVal) child.getQueryData(dataArr, [keyVal], queryData);
	}
};

AView.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
    if(!keyArr) return;

	let children = this.getChildren(), child, i, cnt
	for(i=0; i<children.length; i++)
	{
		child = children[i];
		
		//하위 컴포넌트가 그리드인 경우 데이터가 변경되므로 매번 처음 인덱스값으로 변경
		//dataArr 가 없는 경우도 있으므로 예외처리한다.
		if(dataArr) ADataMask.setQueryData(dataArr[0], keyArr, queryData);
		
		//AView 에서만 사용함
		//매핑 타입이 child mapping 이면 자식 컴포넌트 자체에 셋팅된 필드키를 적용한다.
		if(child.mappingType==3) child.updateChildMappingComp(dataArr, queryData);
		else 
		{
            cnt = child.getMappingCount()
            child.setQueryData(dataArr, keyArr.slice(i, i+cnt), queryData);
		}
	}
	
};

AView.prototype.getDocument = function() 
{
	return this.document;
};

AView.prototype.bindDocument = function(doc) 
{
	this.document = doc;
	
	doc.setView(this);
};

AView.prototype.setLoadView = function(view)
{
	this.ldView = view;
	
	AView.setViewInItem(view, this.element, this);
};
 
AView.prototype.loadView = async function(url)//, asyncCallback, turnback)
{
	//기존에 존재하던 로드뷰가 있으면 제거
	this.removeLoadView();

    var $item = $('<div></div>');
    $item.css(
    {
        width: '100%', height: '100%', overflow: 'auto'
    });
	
    this.$ele.html($item);
	
	//this.ldView = await AView.createView($item[0], url, this);
    this.ldProm = AView.createView($item[0], url, this);
    this.ldView = await this.ldProm;

    //여기에 하면 안됨... createView 에서 로드되는 태그들은 실제 활성화된 돔에 추가되어야 한다. 
	//this.$ele.html($item);
	
	return this.ldView;
};

AView.prototype.loadContainer = async function(viewUrl, cntrId, data, cntrClass)
{
	//기존에 존재하던 로드컨테이너가 있으면 제거
	this.removeLoadContainer();

	if(cntrClass==undefined) cntrClass = 'APanel';
	
	var acont = new window[cntrClass](cntrId);
	
	this.ldCntr = acont;

	acont.init();
		
	this.$ele.html(acont.$ele);
	
	//새로운 값으로 변경
	acont._item = this.element;
	this.element.acont = acont;
	acont.parent = this.getContainer();
	acont.owner = this;
	
	acont.$ele.css({ left:'0px', top:'0px', width:'100%', height:'100%' });
	
	acont.setData(data);
	
	if(viewUrl) 
	{
		await acont.setView(viewUrl);
	}

	acont.onCreate();
	
	return acont;
};

AView.prototype.getLoadCntr = function()
{
	return this.ldCntr;
};


AView.prototype.getLoadView = function()
{
	return this.ldView;
};

AView.prototype.awaitLoadView = function()
{
	return this.ldProm;
};

AView.prototype.removeLoadView = function()
{
	if(this.ldView)
	{
		this.ldView.removeFromView();
		this.ldView = null;
        this.ldProm = null;
	}
};

AView.prototype.removeLoadContainer = function()
{
	if(this.ldCntr)
	{
		this.ldCntr.close();
		this.ldCntr = null;
	}
};

// 매핑가능한 개수를 리턴한다.
AView.prototype.getMappingCount = function()
{
	//return this.getChildren().length;

    let tot = 0

	this.getChildren().forEach((child)=>{
		tot += child.getMappingCount()
	})

	return tot    
};

// 컴포넌트 내부에 드랍 가능여부 리턴
AView.prototype.getDroppable = function()
{
	//return true;
	//_childSelect 가 세팅되어있지 않거나 0인 경우에만 드랍가능
	return !this._childSelect;
};

AView.prototype.getItem = function()
{
	return this._item;
};


//탭뷰에 로드되어진 경우 선택시 넘겨준 데이터를 얻어온다.
AView.prototype.getTabData = function()
{
	if(this._item.tab) return this._item.tab.data;
	else return null;
};

AView.prototype.setTabData = function(data)
{
	if(this._item.tab) this._item.tab.data = data;
};


AView.prototype.getItemData = function()
{
	if(this._item) return this._item.itemData;
	else return null;
};

AView.prototype.setItemData = function(data)
{
	if(this._item) this._item.itemData = data;
};


AView.prototype.getCntrData = function()
{
	var cntr = this.getContainer();
	
	if(cntr) return cntr.getData();
	else return null;
};

AView.prototype.setCntrData = function(data)
{
	var cntr = this.getContainer();
	if(cntr) cntr.setData(data);
};

AView.prototype.getOwnerData = function()
{
    if(window['ATabView'] && this.owner instanceof ATabView) return this.getTabData()
    else if(window['AListView'] && this.owner instanceof AListView) return this.getItemData()
    else return this.getCntrData()
};

AView.prototype.reset = function()
{
	this.eachChild(function(acomp)
	{
		if(acomp.reset) acomp.reset();
	});
};

