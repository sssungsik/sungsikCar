(async function(){

await afc.import('Framework/afc/component/ABar.js');


/**
 * @author asoocool
 */

ATabBar = class ATabBar extends ABar
{
	constructor()
	{
		super()
	
		this.selectedTab = null;
		this.moreBtn = null;

		this.ttTimer = null;
		this.curTooltip = null;
		this.iconMap = null;

		this.btnStyles = ['',''];
		this.iconType = null;
	}

	
	
}

//window.ATabBar = ATabBar

ATabBar.CONTEXT = 
{
	tag: '<div data-base="ATabBar" data-class="ATabBar" class="ATabBar-Style"></div>',

    defStyle:
    {
        width:'100%', height:'40px'
    },

    events: ['itemdblclick']
};

ATabBar.prototype.init = function(context, evtListener)
{
	ABar.prototype.init.call(this, context, evtListener);
	
	//ATabBar 기본 옵션
	//이 위치에서 세팅했으나 beforeInit 에서 option값으로 처리하는 부분이 있어 위치 변경
	
	//탭 버튼의 줄바꿈 옵션 과 더보기 버튼 공백
	if(this.option.isTabWrap)
	{
		this.setStyleObj(
		{
			'-webkit-flex-wrap': 'wrap',
			'-ms-flex-wrap': 'wrap',
			'padding-right': '20px'
		});
	}
};

ATabBar.prototype.beforeInit = function()
{
	//ATabBar 기본 옵션
	//원래 init 에서 세팅했으나 아래 내용에서 option값으로 처리하는 부분이 있어 위치 변경
	this.setOption(
	{
		isCloseBtn: true,
		isIcon: true,
		isTabWrap: true
		
	}, true);

	//우측 끝의 더보기 버튼
	var btn = new AButton();

	/*btn.beforeInit = function()
	{
		this.setAttr('data-center-top', true);
		this.setAttr('data-color', 'rgb(255, 255, 255)|rgb(255, 255, 255)|');
		this.setAttr('data-bgcolor', 'rgb(58, 58, 58)|rgb(89, 89, 89)|');
	};*/

	btn.init();
	//btn.setText('▼');
	btn.setText('');
	btn.addClass('tabbar-morebtn'); 
	btn.setStyleObj({ left:'', right:'5px', top:'5px', width:'15px', height:'15px', 'font-size': '10px' });
	btn.addEventListener('click', this, 'onDropBtnClicked');
	this.addComponent(btn);

	this.moreBtn = btn;
		
	if(!this.option.isTabWrap) this.moreBtn.hide();
};

//----------------------------------------------------------
//  delegate functions
//  function onCloseContainer();
//----------------------------------------------------------
ATabBar.prototype.setDelegator = function(delegator)
{
    this.delegator = delegator;
};


ATabBar.prototype.onDropBtnClicked = function(acomp, info)
{
	var tabs = this.getHiddenTabs(), tab;
	var menuItem = [];
	
	if(tabs.length==0) return;
	
	for(var i=0; i<tabs.length; i++)
	{
		tab = tabs[i];
		menuItem.push({ text: this.getTabTitle(tab), id:tab.tabId, icon:tab.icon });
	}

	var pos = acomp.getBoundRect();

	var menu = new AMenu(null, 0, this.iconMap);//MenuInfo.PRJ_MENU_ICON); //temp code
	menu.setIconType(this.iconType);
	menu.setItemInfoArr(menuItem);
	menu.setSelectListener(this, 'onMenuSelect');
	menu.popupEx( { 'left': pos.left+'px', 'top': pos.top+acomp.getHeight()+'px' } );
	
	var w = menu.$frame.width();
	var sub = (pos.x + w) - $(window).width();
	if(sub > 0)
	{
		menu.$frame.css('left', pos.left-sub);
	}
};

ATabBar.prototype.onMenuSelect = function(menu, info)
{
	var tab = this.selectTabById(info.id, true);
	
	if(tab) this.reportEvent('select', tab, {});
};

ATabBar.prototype.onCloseBtnClick = function(acomp, info)
{
	var rTab = acomp.getParent();
	
	if(this.ttTimer)
	{
		clearTimeout(this.ttTimer);
		this.ttTimer = null;
	}

	if(this.curTooltip)
	{
		this.curTooltip.hide();
		this.curTooltip = null;
	}

	//onCloseContainer 함수에서 true 를 리턴하면 닫지 않기
	if(this.delegator && this.delegator.onCloseContainer(rTab)) return;
	
	this.removeTab(rTab);
};

ATabBar.prototype.moveTab = function(mvTab, posTab, isAfter)
{
	if(isAfter) mvTab.$ele.insertAfter(posTab.element);
	else mvTab.$ele.insertBefore(posTab.element);
};

ATabBar.prototype.indexOfTab = function(tab)
{
	return (this.$ele.children().index(tab.element) - 1);
};

ATabBar.prototype.getNextTab = function(tab)
{
	if(!tab) tab = this.selectedTab;
	
	var nextTab = tab.$ele.next()[0];
	if(nextTab) return nextTab.acomp;
	else return null;
};

ATabBar.prototype.getPrevTab = function(tab)
{
	if(!tab) tab = this.selectedTab;
	
	var prevTab = tab.$ele.prev()[0];
	if(prevTab) return prevTab.acomp;
	else return null;
};

ATabBar.prototype.getSelectedTab = function()
{
	return this.selectedTab;
};

ATabBar.prototype.getSelectedCntr = function()
{
	if(this.selectedTab) return this.selectedTab.cntr;
	else return null;
};

ATabBar.prototype.getActiveTabIdx = function()
{
	if(!this.selectedTab) return -1;

	var tabIdx = -1,
		selTabId = this.selectedTab.tabId;
	
	this.eachChild(function(acomp, inx)
	{
		if(acomp.tabId==selTabId) 
		{
			tabIdx = inx - 1;	//drop button 제거
			return false;	//loop stop
		}
	});
	
	return tabIdx;
};

ATabBar.prototype.selectTab = function(tab, moveFirst)
{
	if(tab)
	{
		//더보기 버튼이 태그 순서상 제일 앞이다.
		//if(moveFirst) tab.$ele.insertAfter(this.moreBtn.$ele);
		if(moveFirst) this.moveTab(tab, this.moreBtn, true);

		if(this.selectedTab!==tab) 
		{
			tab.$ele.css('background-color', '#1473e6');
			tab.addClass('ATabBar_select ' + this.btnStyles[1]);
			
			if(this.selectedTab) 
			{
				//if(this.selectedTab.cntr) 
				//this.selectedTab.cntr.hide();

				//AContainer 의 hide 함수를 호출하면 active, deactive 가 두번 발생한다.
				//활성화될 컨테이너의 show 만 호출해 줘도 되지만 성능을 위해 안보이는 컨테이너를 숨기기 위해
				//$ele.hide 만 호출해 준다.
				if(this.selectedTab.cntr && this.selectedTab.cntr.isValid())
				{
					this.selectedTab.cntr.$ele.hide();
					if(this.selectedTab.cntr.getView() && this.selectedTab.cntr.getView().onHide) this.selectedTab.cntr.getView().onHide();
				}
				
				this.selectedTab.$ele.css('background-color', '#424242');
				this.selectedTab.removeClass('ATabBar_select ' + this.btnStyles[1]);
			}
			
			if(tab.cntr && tab.cntr.isValid()) 
			{
				tab.cntr.show();
				if(tab.cntr.getView() && tab.cntr.getView().onShow) tab.cntr.getView().onShow();
				tab.cntr.onResize();
			}

			this.selectedTab = tab;
		}
	}
		
	return tab;
};

ATabBar.prototype.selectTabById = function(tabId, moveFirst)
{
	if(this.ttTimer)
	{
		clearTimeout(this.ttTimer);
		this.ttTimer = null;
	}

	if(this.curTooltip)
	{
		this.curTooltip.hide();
		this.curTooltip = null;
	}

	var tab = this.findTabById(tabId);
	
	//참 여부는 함수 내부에서 검사
	return this.selectTab(tab, moveFirst);
};


ATabBar.prototype.selectTabByIndex = function(index, moveFirst)
{
	var tab = this.findTabByIndex(index);
	
	//참 여부는 함수 내부에서 검사
	return this.selectTab(tab, moveFirst);
};


/*
ATabBar.prototype.setTabTitle = function(tabId, title)
{
	var tab = this.findTabById(tabId);
	if(tab)
	{
		tab.getChildren()[1].setText(title);
	}
};

ATabBar.prototype.getTabTitle = function(tabId)
{
	var tab = this.findTabById(tabId);
	
	if(tab) return tab.getChildren()[1].getText();
	else return null;
};
*/

ATabBar.prototype.setTabTitle = function(tab, title)
{
	tab.getFirstChild().getItemComp(1).setText(title);
};

ATabBar.prototype.getTabTitle = function(tab)
{
	return tab.getFirstChild().getItemComp(1).getText();
};

//deprecated
ATabBar.prototype.setIconMapUrl = function(iconMap)
{
	this.setIconMap(iconMap);
};

ATabBar.prototype.setIconMap = function(iconMap)
{
	if(iconMap)
	{
		if(typeof(iconMap) == 'string')
		{
			if(iconMap.match(/\./))
			{
				this.changeIcon = this._changeIconByUrl;
				this.iconMap = 'url("' + iconMap + '")';
			}
			else
			{
				this.changeIcon = this._changeIconByCss;
				this.iconMap = iconMap;
			}
		}
		else
		{
			this.iconMap = [];
			this.changeIcon = this._changeIconByUrl;
			
			//보통 0번째에 해당하는 아이콘이 메인이므로 역순으로 아이콘을 배치한다.
// 			for(var i=0; i<iconMap.length; i++)
			for(var i=iconMap.length-1; i>-1; i--)
			{
				this.iconMap.push('url("' + iconMap[i] + '")');
			}
			this.iconMap = this.iconMap.join(', ');
		}
		
// 		if(iconMap.match(/\./)) this.changeIcon = this._changeIconByUrl;
// 		else this.changeIcon = this._changeIconByCss;
// 		this.iconMap = iconMap;
	}
};

ATabBar.prototype.changeIcon = function(tab, icon, iconType)
{
	this._changeIconByUrl(tab, icon, iconType);
};

ATabBar.prototype._changeIconByCss = function(tab, icon, iconType)
{
	tab.icon = icon;
	tab.iconType = iconType;

	var $iconLbl = tab.iconLbl.$ele;
	$iconLbl.addClass(this.iconMap);
	$iconLbl.css(
	{
		'background-position': this.getBgPos(icon||tab.icon, iconType),//(-16 * icon) + 'px 0px',
		'background-size': 'auto'
	});
	
	tab.icon = icon;
};

ATabBar.prototype._changeIconByUrl = function(tab, icon, iconType)
{
	tab.icon = icon;
	tab.iconType = iconType;

	var $iconLbl = tab.iconLbl.$ele;
	$iconLbl.css(
	{
		'background-image': 'url("' + this.iconMap + '")',//'url("Theme/img/tree_item.png")',
		'background-position': this.getBgPos(icon||tab.icon, iconType),//(-16 * icon) + 'px 0px',
		'background-size': 'auto'
	});
	
	tab.icon = icon;
};

/*
// ATabView와 동일하게 만들었으나 굳이 필요없을듯 하여 일단 주석
ATabBar.prototype.addTabEx = function(tabInfo)
{
	return this.addTab(tabInfo.tabId, tabInfo.title, tabInfo.cntr, tabInfo.ttMsg, tabInfo.icon);
};*/

ATabBar.prototype.addTab = async function(tabId, title, cntr, ttMsg, icon)
{
	var tabBtnView = await this._makeTab(),
		comps = tabBtnView.getFirstChild().getAllLayoutComps();//tabBtnView.getChildren();
	
	tabBtnView.tabId = tabId;
	tabBtnView.ttMsg = ttMsg;
	
	if(cntr)
	{
		tabBtnView.cntr = cntr;
		cntr.tab = tabBtnView;
	}
	
	if(this.option.isIcon)
	{
		icon = icon||0;
		tabBtnView.icon = icon;
		tabBtnView.iconType = this.iconType;
		
		//comps[0].setImage('Theme/img/tree_item.png');

		//comps[0] is label
		tabBtnView.iconLbl = comps[0];
		this.changeIcon(tabBtnView, icon, this.iconType);
		/*comps[0].$ele.css(
		{
			'background-image': 'url("' + this.iconMap + '")',//'url("Theme/img/tree_item.png")',
			'background-position': (-16 * icon) + 'px 0px',
			'background-size': 'auto'
		});*/
	}
	
	//label
	comps[1].setText(title);
	comps[1].$ele.css('white-space', 'nowrap');
	
	//temp code
	if(this.option.isCloseBtn)
	{
		//x button
		comps[2].invisible();
		
		var tooltip = null, thisObj = this;

		tabBtnView.$ele.hover(
			function() 
			{
				comps[2].visible();
				
				if(tabBtnView.ttMsg)
				{
					thisObj.ttTimer = setTimeout(function()
					{
						thisObj.ttTimer = null;
						
						if(tabBtnView.isValid())
						{
							thisObj.curTooltip = new ATooltip();
							thisObj.curTooltip.show(tabBtnView.ttMsg, tabBtnView.getBoundRect());
						}

					}, 700);
				}
			},
			function() 
			{ 
				if(thisObj.ttTimer) 
				{
					clearTimeout(thisObj.ttTimer);
					thisObj.ttTimer = null;
				}
				
				if(thisObj.curTooltip)
				{
					thisObj.curTooltip.hide();
					thisObj.curTooltip = null;
				}
			
				comps[2].invisible(); 
			}
		);
		
		comps[2].eventStop = true;
		comps[2].addEventListener('click', this, 'onCloseBtnClick');
	}

	this.aevent._select(tabBtnView);
	this.aevent._move(tabBtnView);
	this.aevent._itemdblclick(tabBtnView);
	
	this.addComponent(tabBtnView);
	
	return tabBtnView;
};

ATabBar.prototype.removeTab = function(rTab, noSelect, noClose)
{
	if(!noClose && rTab.cntr) 
	{
		rTab.cntr.close();
		rTab.cntr = null;
	}

	this.removeComponent(rTab);
	
	if(rTab === this.selectedTab) this.selectedTab = null;
	
	//일단 맨 마지막 탭을 활성화 시킨다. 차후 바로 이전 탭으로 활성화 해주기
	
	var tabCnt = this.getTabCount();
	
	if(!noSelect && tabCnt > 0)
	{
		var tab = this.getLastChild();
		this.selectTab(tab);
	}
	
	return tabCnt;
};

ATabBar.prototype.getFirstTab = function() 
{
	return this.getNextTab(this.moreBtn);
};

ATabBar.prototype.getLastTab = function() 
{ 
	return this.getLastChild(); 
};

ATabBar.prototype.selectFirstTab = function() 
{ 
	return this.selectTab(this.getFirstTab()); 
};

ATabBar.prototype.selectLastTab = function() 
{
	return this.selectTab(this.getLastTab());
};

//더보기 버튼 제외하기 위해 -1
ATabBar.prototype.getTabCount = function()
{
	return (this.getChildCount()-1);
};

ATabBar.prototype._makeTab = async function()
{
	var view = await AView.createView(null, 'Framework/afc/layout/tabbar-item.html', this);
	
	//tabbar-item.lay 파일의 리소스 상에서 아래 항목들을 셋팅해 줬으므로 
	//아래 코딩이 추가로 필요없다.
	/*
	view.setStyleObj(
	{
		'position': 'static',
		width: 'auto', height: 'auto',
		'padding': '0 20px 0 20px',
	});
	*/
	
	//temp code	
	var flyt = view.getFirstChild();
	if(!this.option.isIcon) flyt.getItemComp(0).hide();//view.getFirstChild().hide();
	if(!this.option.isCloseBtn) flyt.getItemComp(-1).hide();//view.getLastChild().hide();
	
	view.addClass(this.btnStyles[0]);
	
	return view;
};

ATabBar.prototype.findTabById = function(tabId)
{
	var retTab = null;
	
	if(tabId)
	{
		this.eachChild(function(acomp)
		{
			if(acomp.tabId==tabId) 
			{
				retTab = acomp;
				return false;	//loop stop
			}
		});
	}
		
	return retTab;
};

ATabBar.prototype.findTabByIndex = function(index)
{
	var retTab = null;	
	
	this.eachChild(function(acomp, inx)
	{
		if(index+1==inx) 
		{
			retTab = acomp;
			return false;	//loop stop
		}
	});
	
	return retTab;
};


ATabBar.prototype.getAllTabs = function()
{
	var rets = [];

	this.eachChild(function(acomp, inx)
	{
		//더보기 버튼 제외
		if(inx==0) return;
	
		//모두 가져오는 경우
		rets.push(acomp);
	});
	
	return rets;
};


ATabBar.prototype.getHiddenTabs = function()
{
	var rets = [], pos;

	this.eachChild(function(acomp, inx)
	{
		//더보기 버튼 제외
		//if(tabs[i].className == 'AButton') continue;
		if(inx==0) return;
	
		pos = acomp.getPos();
		//두번째 줄에 있는 버튼이면 히든 버튼임.
		if(pos.top>0) rets.push(acomp);
		
		//모두 가져오는 경우
		//rets.push(acomp);
	
	});
	
	return rets;
};

/*
//탭바는 연결되어져 있는 컨테이너와 공간적으로 떨어져 있는 별개의 컴포넌트이므로
//다음과 같이 updatePosition 을 구현하면 안됨.
ATabBar.prototype.updatePosition = function(pWidth, pHeight)
{
	ABar.prototype.updatePosition.call(this, pWidth, pHeight);
	
	if(this.selectedTab)
	{
		var cntr = this.selectedTab.cntr;
		
		if(cntr) cntr.onResize();
	}
};
*/

//default-Style, select-Style
ATabBar.prototype.setBtnStyle = function(defStyle, selStyle)
{
	var def = this.btnStyles[0], sel = this.btnStyles[1];
	if(defStyle != undefined) def = defStyle;
	if(selStyle != undefined) sel = selStyle;

	var thisObj = this;
	this.getAllTabs().forEach(function(tabBtnView)
	{
		tabBtnView.removeClass(thisObj.btnStyles[0]);
		tabBtnView.removeClass(thisObj.btnStyles[1]);
		
		tabBtnView.addClass(def);
		if(tabBtnView.$ele.hasClass('ATabBar_select')) tabBtnView.addClass(sel);
	});
	
	this.btnStyles = [def, sel];
};

ATabBar.prototype.getBgPos = function(icon, iconType)
{
	var bgPos = [];

	if(iconType != undefined) bgPos.push((-16 * iconType) + 'px 0px');

	if(typeof(icon) == 'object')
	{
		for(var i=0; i<icon.length; i++)
		{
			bgPos.push((-16 * icon[i]) + 'px 0px');
		}
	}
	else
	{
		bgPos.push((-16 * icon) + 'px 0px');
	}

	return bgPos.join(', ');
};

ATabBar.prototype.setIconType = function(iconType)
{
	this.iconType = iconType;
};


})();