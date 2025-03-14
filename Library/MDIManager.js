


/*
this.docTmplMap = 
{
	txt:  
	[
		{
			containerClass: 'MDIPage',
			documentClass: 'MDIDocument',
			viewUrl: 'views/MainPageView.lay',
			extNames: ['txt','js','cls'],
		},
		
		{
			containerClass: 'MDIPage',
			documentClass: 'MDIDocument',
			viewUrl: 'views/MainPageView.lay',
			extNames: ['txt','js','cls'],
		}
	],
	
	html:
	[
		{
			containerClass: 'MDIPage',
			documentClass: 'MDIDocument',
			viewUrl: 'views/MainPageView.lay',
			extNames: ['txt','js','cls'],
		}
	],
	
	...
};
*/



afc.import("Framework/afc/event/ATabBarEvent.js")
afc.import("Framework/afc/component/ATabBar.js")

MDIManager = class MDIManager
{
	constructor(name)
	{
		this.docTmplMap = {}
		this.trgContainer = null
		this.tabPanel = null
		this.docPanel = null
		this.tabBar = null
		
		this.matchingMap = {}
		
		this.tabHistory = []
		this.copyTabHistory = []
		this.tabOffset = 1
	
		this.defaultIcon = 0
		this.iconByExtObj = {}
		
		this.cntrClass = 'AFrameWnd'
		
		if(!name) name = '_'
		this.managerName = name
		
		this.watchMsgs = {}
	
		//file path 를 키값으로 File or Blob 객체를 가지고 있다.
		//FileReader 를 사용할 경우 필요
		this.fileMap = {}
	}
}

MDIManager.MODIFIED_MARK = '*';
MDIManager.mdiManagers = [];
MDIManager.curMdiManager = null;

MDIManager.getCurrentDocument = function()
{
	if(!MDIManager.curMdiManager) return;
	let doc = MDIManager.curMdiManager.getActiveContainer();
	if(doc) doc = doc.getView().getDocument();
	return doc;
};

MDIManager.saveCurrentDocTmplFile = function()
{
	if(!MDIManager.curMdiManager) return;
	let mdiMgr = MDIManager.curMdiManager;
	let doc = mdiMgr.getActiveContainer();
	if(doc)
	{
		doc = doc.getView().getDocument();
		mdiMgr.saveDocContainer(doc.uri);
	}
};

MDIManager.reloadMdiDocs = function(filePath, exMdimanager)
{
    var arr = MDIManager.mdiManagers, mgr;

    //console.log('mgr len : ' + arr.length);

    for(var i=0; i<arr.length; i++)
    {
        mgr = arr[i];
        if(mgr!==exMdimanager) 
        {
            //console.log(mgr.managerName);
            mgr.reloadDocument(filePath);
        }
    }
};

//---------------------------------------------------------

MDIManager.prototype.regMdiManager = function()
{
    MDIManager.mdiManagers.push(this);
};

MDIManager.prototype.unregMdiManager = function()
{
    var arr = MDIManager.mdiManagers;

    for(var i=0; i<arr.length; i++)
    {
        if(arr[i]===this) 
        {
            arr.splice(i, 1);
            break;
        }
    }
};

MDIManager.prototype.addMatchingExt = function(ext1, ext2)
{
	this.matchingMap[ext1] = ext2;
	this.matchingMap[ext2] = ext1;
};

MDIManager.prototype.setTargetContainer = function(trgContainer)
{
	this.trgContainer = trgContainer;
	
	trgContainer.mdiManager = this;
	
	trgContainer.createSplit(2, [25, -1], 'column', 0);
	
	this.tabPanel = trgContainer.getSplitPanel(0);
	this.docPanel = trgContainer.getSplitPanel(1);
	
	this.tabBar = new ATabBar();
	this.tabBar.init();
	this.tabBar.setDelegator(this);
	
	this.tabBar.addEventListener('select', this, 'onTabBarSelect');
	
	this.tabPanel.setView(this.tabBar);

	MDIManager.curMdiManager = this;
	
	trgContainer.element.addEventListener('click', () => {
		MDIManager.curMdiManager = this;
	}, {capture: true});
};

MDIManager.prototype.getTargetContainer = function() { return this.trgContainer; };
MDIManager.prototype.getTabPanel = function() { return this.tabPanel; };
MDIManager.prototype.getDocPanel = function() { return this.docPanel; };
MDIManager.prototype.getTabBar = function() { return this.tabBar; };


//파일 오픈시 띄울 컨테이너 클래스명 셋팅, cntrClass is string
MDIManager.prototype.setOpenCntrClass = function(cntrClass)
{
	this.cntrClass = cntrClass;
};



/*
var docTemplate = 
{
	documentClass: 'MDIDocument',
	viewUrl: 'views/MainPageView.lay',
	extNames: ['txt','js','cls'],
	newDocName: '문서'
};
*/
//같은 확장자에 여러 다른 템플릿을 등록할 수 있다.
MDIManager.prototype.regDocTemplate = function(docTemplate, isDefault)
{
	var len = docTemplate.extNames.length, ext, tmplArr = null;
	
	docTemplate.newDocCnt = 0;
	
	for(var i=0; i<len; i++)
	{
		ext = docTemplate.extNames[i];
		
		tmplArr = this.docTmplMap[ext];
		
		if(!tmplArr) this.docTmplMap[ext] = tmplArr = [];
		
		tmplArr.push(docTemplate);
	}
	
	if(isDefault) this.defDocTmpl = docTemplate;

};

MDIManager.prototype.setDefaultIcon = function(icon)
{
	this.defaultIcon = icon;
};

MDIManager.prototype.setIconByExt = function(ext, icon)
{
	if(typeof(ext) == 'string') this.iconByExtObj[ext] = icon;
	else if(typeof(ext) == 'object')
	{
		for(var key in ext)
		{
			this.iconByExtObj[key] = ext[key];
		}
	}
};

MDIManager.prototype.getIconByExt = function(ext)
{
	return this.iconByExtObj[ext] || this.defaultIcon;
};

MDIManager.prototype.findDocTemplate = function(filePath, index)
{
	var ext = AUtil.extractExtName(filePath).toLowerCase();
	
	return this.getDocTemplate(ext, index);
};

MDIManager.prototype.getDocTemplate = function(ext, index)
{
	if(index==undefined) index = 0;
	
	var tmplArr = this.docTmplMap[ext];
	
	if(tmplArr) return tmplArr[index];
	else 
	{
		if(this.defDocTmpl) return this.defDocTmpl;
		else return null;
	}
};



MDIManager.prototype.getActiveContainer = function()
{
	return this.tabBar.getSelectedCntr();
};


MDIManager.prototype.getActiveCntrIdx = function()
{
	return this.tabBar.getActiveTabIdx();
};

MDIManager.prototype.getAllTabs = function()
{
	return this.tabBar.getAllTabs();
};

//deprecated --> instead of this, use doc.reportModify
MDIManager.prototype.reportModify = function(doc, modified)
{
	if(!doc) doc = theApp.getActiveDocument();
	
    if(doc.isModified()!=modified)
	{
		doc.setModifiedFlag(modified);
		this.applyModifiedMark(doc);
		
		if(modified==false) MDIManager.reloadMdiDocs(doc.uri, this);
	}
};

MDIManager.prototype.applyModifiedMark = function(doc)
{
	var title = doc.docName;
	
	if(doc.isModified()) title = MDIManager.MODIFIED_MARK + doc.docName;
	
	var tab = this.tabBar.findTabById(doc.uri);
	if(tab) this.tabBar.setTabTitle(tab, title);
};

//----------------------------------------------------------------------------
//	return tabBtnView, tabBtnView has cntr, tabId, docTmpl

MDIManager.prototype.newDocContainer = async function(docTmpl, newDocName)
{
	docTmpl.newDocCnt++;
	
	//컨테이너 객체를 생성하고 오픈한다. 뷰 객체가 내부에서 생성된다.
	var cntr = new window[this.cntrClass](),
		newDocId = docTmpl.documentClass + docTmpl.newDocCnt;
		
	var docName = newDocName ? newDocName : (docTmpl.newDocName + docTmpl.newDocCnt);

	var icon = this.getIconByExt(AUtil.extractExtName(docName));
	
	//addTab = function(tabId, title, cntr, ttMsg)
	var tabBtnView = await this.tabBar.addTab(newDocId, docName, cntr, docName, icon);
	
	tabBtnView.docTmpl = docTmpl;

	cntr.setWindowOption({inParent: true});
	
	await cntr.open(null, this.getDocPanel(), '0px', '0px', '100%', '100%');

    if(cntr.maximize) cntr.maximize();	//for AFrameWnd

	this.activeDocContainer(newDocId, true);

	if(cntr.hideTitle) cntr.hideTitle();

	//cntr.enableResize(false);
		
	return tabBtnView;
};



MDIManager.prototype.openMatchingDoc = async function(filePath)
{
	if(!filePath) return;
	
	var ext = AUtil.extractExtName(filePath).toLowerCase();
	
	var matchExt = this.matchingMap[ext];
	if(!matchExt) return;
	
	var matchPath = AUtil.filePathExceptExt(filePath) + '.' + matchExt;
	
	return await this.openDocContainer(matchPath, null, null, true);
};

MDIManager.prototype.openDocContainer = async function(filePath, docTmpl, noLoad, bSilent)
{
	//if(!this.isFileExisting(filePath, !bSilent)) return null;

	//filePath 가 File 객체인 경우는 저장해 두고 문자열 파일패스로 변경해 준다.
	if(typeof(filePath)!='string')
	{
		this.fileMap[filePath.path] = filePath;
		filePath = filePath.path;
	}
	
	if(!docTmpl) docTmpl = this.findDocTemplate(filePath);
	
	if(docTmpl)
	{
		var actTab = await this.activeDocContainer(filePath);
		
		//새로운 탭이면 
		if(!actTab)
		{
			var fileName = AUtil.extractFileName(filePath), thisObj = this;
			var icon = this.getIconByExt(AUtil.extractExtName(filePath));

			//컨테이너 객체를 생성하고 오픈한다. 뷰 객체가 내부에서 생성된다.
			var cntr = new window[this.cntrClass]();

			actTab = await this.tabBar.addTab(filePath, fileName, cntr, filePath, icon);
			
			/*
			actTab.$ele.dblclick(function(e)
			{
				thisObj.openMatchingDoc(filePath);
			});
			*/
			
			actTab.docTmpl = docTmpl;
			
			cntr.setWindowOption({inParent: true});
			
            await cntr.open(null, this.getDocPanel(), '0px', '0px', '100%', '100%');

            if(cntr.maximize) cntr.maximize();
			
			if(!noLoad) this.activeDocContainer(filePath);
			else this.saveTabHistory(filePath);
			
			if(cntr.hideTitle) cntr.hideTitle();
			
			//cntr.enableResize(false);
		}
		
		return actTab;
	}
	
	return null;
};

MDIManager.prototype.saveDocContainer = function(filePath)
{
	var docTmpl = this.findDocTemplate(filePath);
	
	if(docTmpl)
	{
		var tab = this.tabBar.findTabById(filePath), doc;

		if(tab) doc = tab.cntr.getView().getDocument();
		else doc = theApp.getActiveDocument();
		
		if(doc.isModified()) doc.saveDocument(filePath);
	}
};

MDIManager.prototype.findDocContainer = function(filePath)
{
	var tab = this.tabBar.findTabById(filePath);
	
	if(tab) return tab.cntr;
	else return null;
};

//탭 히스토리를 클론 하여 작업하는 이유는
//원본 탭 히스토리는 이전 히스토리로 이동 할 때마다 변경되어
//가장 첫 히스토리까지 이동 했을 때 역순으로 바뀌기 때문이다.
MDIManager.prototype.backDocContainer = function()
{
	//탭히스토리 배열을 클론
	if(jQuery.isEmptyObject(this.copyTabHistory)) this.copyTabHistory = jQuery.extend([], this.tabHistory);	//this.tabHistory clone
	
	//복사 된 탭 히스토리 끝에 도달 시 인덱스를 다시 처음으로
	if(this.tabOffset >= this.copyTabHistory.length) this.tabOffset = 0;
	
	//다음 인덱스의 탭으로 이동
	this.tabOffset++;
	if(this.copyTabHistory[this.copyTabHistory.length-this.tabOffset])
	{
		this.activeDocContainer(this.copyTabHistory[this.copyTabHistory.length-this.tabOffset]);
	}
};


//다큐먼트가 수정되어져 있는지 여부를 체크하여
//저장할 지 여부를 묻고 저장하는 로직
//탭바의 close 버튼 클릭이나 ctrl+F4 등의 문서가 닫혀야 되는 경우 
//이 함수를 호출해야 함.
MDIManager.prototype.closeDocContainer = function(filePath, callback, isForce, isSave)
{
	var docTmpl = this.findDocTemplate(filePath);
	
	if(docTmpl)
	{
		var tab = this.tabBar.findTabById(filePath), doc, view;
		
		if(!tab) 
		{
			if(callback) callback(-1);
			return;
		}

		view = tab.cntr.getView();
		
		if(view) doc = view.getDocument();
		

	    var changedNewSelTabId;
		//히스토리가 없는 경우 가장 뒤 탭으로
		if(this.tabHistory.length == 1)
			changedNewSelTabId = this.tabBar.getChild(this.getActiveCntrIdx()).tabId;
		else
			changedNewSelTabId = this.tabHistory[this.tabHistory.length-2];
			
		var isSelTab = (filePath == this.tabBar.getSelectedTab().tabId);

		if(view && doc.isModified())
		{
			if(isForce)
			{
				if(isSave) doc.saveDocument();
			}
			else
			{
				var wnd = new AMessageBox(), thisObj = this;

				wnd.openBox(null, 'Notification', '변경된 파일 내용을 저장하시겠습니까?', AMessageBox.YES_NO_CANCEL, 
				function(result)
				{
					if(result!=undefined && result!=2) //취소가 아닌 경우 --> 예/아니오
					{
						if(result==0) doc.saveDocument();	//예
						
						thisObj.removeHistory(tab.tabId);
						
						thisObj.tabBar.removeTab(tab, true);
						
						if(isSelTab) thisObj.activeDocContainer(changedNewSelTabId);
					}

					if(callback) callback(result);
				});
				return;
			}
		}
		
		this.removeHistory(tab.tabId);
		
		this.tabBar.removeTab(tab, true);
		
		if(isSelTab) this.activeDocContainer(changedNewSelTabId);
		
		//아무일도 일어나지 않은 경우
		if(callback) callback(1);
	}

};

//ATabBar delegate function
//true 를 리턴하면 컨테이너가 닫히지 않는다.
//자체적인 로직을 통해 닫기 위해 true 값을 리턴
MDIManager.prototype.onCloseContainer = function(tabBtnView)
{
	this.closeDocContainer(tabBtnView.tabId);
	
	return true;
};

MDIManager.prototype.onTabBarSelect = function(comp, info, e)
{
	var thisObj = this, tabId = info.tabId;
	
	this.saveTabHistory(tabId);

	if(e.which == 3)
	{
		var menu = new AMenu(null, 0);
		var tabbarArr = jQuery.extend([], MenuInfo.tabbar);	//MenuInfo.tabbar clone
		
		menu.setItemInfoArr(tabbarArr);
		menu.setSelectListener(thisObj, 'contextMenuEvent');
		menu.popup(e.pageX+1, e.pageY+1);
	
	}
		
	this.activeDocContainer(tabId);
};

MDIManager.prototype.saveTabHistory = function(tabId)
{
	//히스토리에 저장되어 있는지 확인
	this.removeHistory(tabId);

	//히스토리에 저장
	this.tabHistory.push(tabId);
};

MDIManager.prototype.contextMenuEvent = function(acomp, info)
{
	if(!info) return;
	const selTab = this.tabBar.getSelectedTab();
	
	switch(info.id)
	{
		case 'CLOSE':
			this.closeDocContainer(selTab.tabId); 
		break;
		
		case 'ALL':
			this.closeAllTabs();
		break;
		
		case 'OTHERS':
			this.closeOtherTabs(selTab.tabId);
		break;
		
		case 'RIGHT':
			if(selTab != this.tabBar.getLastTab()) this.closeRightTabs(selTab.tabId);
		break;
		
		case 'FLOATING':
			this.floatTabContainer(selTab, 100, 100);
		break;
	}
};

MDIManager.prototype.landTabContainer = function(cntr)
{
    //cntr.tab.show();
	cntr.hideTitle();
	
    cntr.setParent(this.getDocPanel());
    cntr.maximize();
};

MDIManager.prototype.floatTabContainer = function(tab, offX, offY)
{
	var cntr = tab.cntr;
	
    //this.tabBar.removeTab(tab, false, true);
    //tab.hide();
	cntr.showTitle();
	
	cntr.restore();
    //cntr.setParent(theApp.getMainContainer(), {left: '100px', top: '100px',width: '400px', height:'600px'});
    cntr.setParent(theApp.getMainContainer());
    cntr.offset(offX, offY);
};


MDIManager.prototype.closeOtherTabs = function(tabId, callback)
{
	var tabs = this.getAllTabs(), tab, doc, exTab = null, view;
	
	for(var i in tabs)
	{
		tab = tabs[i];
		
		if(tab.tabId == tabId) exTab = tab;
		else
		{
			view = tab.cntr.getView();

			if(view) doc = view.getDocument();

			if(!view || !doc.isModified()) 
				this.closeDocContainer(tab.tabId);
		}
	}
	
	this.closeAllActiveTabs(callback, [exTab]);
};

MDIManager.prototype.closeRightTabs = function(tabId, callback)
{
	var tabs = this.getAllTabs(), tab, doc, exTabArr = [], view, isRight;
	
	for(var i in tabs)
	{
		tab = tabs[i];
		
		if(isRight)
		{
			view = tab.cntr.getView();

			if(view) doc = view.getDocument();

			if(!view || !doc.isModified()) 
				this.closeDocContainer(tab.tabId);
		}
		else
		{
			if(tab.tabId == tabId) isRight = true;
			exTabArr.push(tab);
		}
	}
	
	this.closeAllActiveTabs(callback, exTabArr);
};

MDIManager.prototype.closeAllTabs = function(callback)
{
	var selTab = this.tabBar.getSelectedTab();
	
	if(selTab)
	{
		//active tab 을 제외한 다른 탭들부터 모두 닫은 후, 마지막으로 active tab 을 닫는다.
		this.closeOtherTabs(selTab.tabId, function(result)
		{
			//theApp.closeActiveDocTmplFile(callback);
			
			//취소
			if(result==2)
			{
				if(callback) callback(false);
			}
			else
			{
				theApp.closeActiveDocTmplFile(function(result)
				{
					//취소가 아닌 경우는 true
					if(callback) callback(result!=2); 
				});
			}
			
		});
	}
	
	else if(callback) callback(true);
	
};

MDIManager.prototype.closeAllActiveTabs = function(callback, exTabArr)
{
	var thisObj = this;
	
	//현재 선택된 탭이 제외할 탭 중의 하나라면
	if(exTabArr.indexOf(this.tabBar.getSelectedTab())>-1)
	{
		//전체탭개수 - 제외탭개수가 0인 경우 닫기 종료
		var tabCnt = this.tabBar.getTabCount();
		
		if(tabCnt - exTabArr.length < 1) 
		{
			//all other Documents Closed
			if(callback) callback(true);
		}
		else
		{
			var selTab = null;
			var allTabs = this.tabBar.getAllTabs();
			for(var i=allTabs.length-1; i>-1; i--)
			{
				if(exTabArr.indexOf(allTabs[i]) < 0)
				{
					selTab = allTabs[i];
					break;
				}
			}
			
			this.activeDocContainer(selTab.tabId);
			
			//활성화된 다큐먼트를 하나씩 물어보고 닫는다.
			this.closeAllActiveTabs(callback, exTabArr);
		}
	}
	
	else
	{
		theApp.closeActiveDocTmplFile(function(result)
		{
			if(result==-1) //all documents are closed!
			{
				//thisObj.allDocumentsClosed();

				if(callback) callback(true);
			}

			//취소인 경우
			else if(result==2)	//yes: 0, no: 1, cancel: 2
			{
				if(callback) callback(false);
			}

			//예, 아니오
			else 
			{
				setTimeout(function()
				{
					//활성화된 다큐먼트를 하나씩 물어보고 닫는다.
					thisObj.closeAllActiveTabs(callback, exTabArr);
				}, 0);
			}

		});
	}
	
};


MDIManager.prototype.removeHistory = function(tabId)
{
	//close된 탭을 history에서 빼준다.
	for(var a in this.tabHistory)
	{
		if(tabId == this.tabHistory[a])
		{
			this.tabHistory.splice(a, 1);
			break;
		}
	}
};

MDIManager.prototype.activeDocContainer = async function(filePath, isNewDoc)
{
	var selTab = null;
	if( !filePath || !(selTab = this.tabBar.selectTabById(filePath)) )
	{
		return null;
	}
	
	var hiddenTabs = this.tabBar.getHiddenTabs();
	for(var i in hiddenTabs)
	{
		if(hiddenTabs[i] === selTab)
		{
			this.tabBar.moveTab(selTab, this.tabBar.moreBtn, true);
			break;
		}
	}
	
	this.saveTabHistory(filePath);
	
	//--------------------------------------------------------------------------
	
	//로드되어져 있지 않으면 동적으로 로드한다.
	if(!selTab.cntr.getView()) 
	{
		//	1. 뷰를 로드하고
		await selTab.cntr.setView(selTab.docTmpl.viewUrl);
	
		//	2. 다큐먼트 객체를 생성하고 
		var doc = new window[selTab.docTmpl.documentClass](),
			view = selTab.cntr.getView();
		
		//* mdiManager 저장
		doc.mdiManager = this; //doc.setMdiManager(this);

		//	3. 생성된 뷰와 다큐먼트를 연결한다.
		view.bindDocument(doc);
		
		if(isNewDoc)
		{
			doc.newDocument(filePath, this.tabBar.getTabTitle(selTab));
			_bindDone(true);
		}
		else
		{
			//	4. 문서를 오픈한다.
			var res = doc.openDocument(filePath, function(_res)		//비동기인 경우 호출되는 콜백
			{
				_bindDone(_res);
			});

			if(res!=undefined) _bindDone(res);
		}
		
		//------------------------------------------------------
		function _bindDone(bindRes)
		{
			if(bindRes)
			{
				//	5. 바인드 완료 이벤트를 알린다. 
				if(view.onDocumentReady)
				{
					//onInitDone, onActiveDone 보다 나중에 호출되도록
					setTimeout(function()
					{
						view.onDocumentReady(doc);
					}, 10);
				}

			}
		}
	}
	
	return selTab;
};

/*
MDIManager.prototype.isFileExisting = function(filePath, isAlert)
{
	var fileName = AUtil.extractFileName(filePath);
	var retVal = JSON.parse( Cmd.FindFile(filePath.replace(fileName, ''), fileName) );
	
	if( retVal.length > 0) return true;
	
	if(isAlert)
	{
		var box = new AMessageBox();
		box.openBox(null, '다음 경로에 파일이 존재하지 않습니다.<br><br>' + filePath);
	}

	return false;
};
*/

MDIManager.prototype.reloadDocument = function(filePath)
{
	var cntr = this.findDocContainer(filePath);

	//변경된 파일이 열려져 있는 탭인지 체크
	if(!cntr) return;

	var view = cntr.getView();
	
	//열려있지만 활성화는 되지 않은 경우 리턴
	if(!view) return;
	
	var doc = view.getDocument();

	//console.log(data);

	//수정 중이면
	if(doc.isModified())
	{
		//하나의 파일이 저장될 때.. 버퍼에 여러번 나누어서 저장하므로 여러번 change 이벤트가 발생한다.
		//같은 메시지박스가 여러번 뜨지 않도록
		if(this.watchMsgs[filePath]) return;

		var thisObj = this;

		this.activeDocContainer(filePath);

		var wnd = AfcMessageBox('알림', filePath + ' : 파일이 변경 되었습니다. 다시 로드하시겠습니까?', AMessageBox.YES_NO, function(ret)
		{
			if(ret==0)
			{
				thisObj._reOpenManage(view, doc, filePath);
				thisObj.reportModify(doc, false);
			}

			thisObj.watchMsgs[filePath] = null;
		});

		this.watchMsgs[filePath] = wnd;
	}
	else
	{
		this._reOpenManage(view, doc, filePath);
	}

};

MDIManager.prototype._reOpenManage = function(view, doc, filePath)
{
	//문서를 오픈한다.
	var res = doc.openDocument(filePath, function(_res)		//비동기인 경우 호출되는 콜백
	{
		_bindDone(_res);
	});

	if(res!=undefined) _bindDone(res);

	function _bindDone(bindRes)
	{
		if(bindRes)
		{
			//doc 정보가 갱신되도록 화면 갱신 
			if(view.onDocumentReady)
			{
				setTimeout(function()
				{
					view.onDocumentReady(doc);
				}, 10);
			}
		}
	}
};
