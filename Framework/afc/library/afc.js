/**
 * @author asoocool
 */

var afc = 
{
    BTN_STATE: ['normal', 'touch', 'disable'],
    CHECK_STATE: ['check', 'normal'],
    
    ATTR_BASE: 'data-base',
    ATTR_CLASS: 'data-class',
    //ATTR_COLOR: 'data-color',               //텍스트 색상
    ATTR_GROUP: 'data-group',
    
    //ATTR_BGCOLOR: 'data-bgcolor',  			//배경 색상
    //ATTR_BGIMAGE: 'data-bgimage',  			//배경 이미지
    ATTR_STYLE: 'data-style',           	//스타일
    ATTR_STYLE_TAB: 'data-style-tab',       //탭 버튼 스타일
    ATTR_DEFAULT: 'data-default',           //라디오버튼(초기셀렉트 아이디)
    
    ATTR_LISTENER: 'data-listener',
    ATTR_QUERY_NAME: 'data-query-name',
    //ATTR_RESP: 'data-responsive',
	ATTR_MASK: 'data-mask',
    
    CLASS_MARK: '--',
    CMARK_LEN: 2,
    
    MASK_NONE: 0,
    MASK_MONEY: 1,
	MASK_FLOAT: 2,

	DISABLE_TIME: 500,
	//TOUCH_DELAY_TIME: 300,	//AppManager 로 옮겨짐, 차후 삭제
	CLICK_DELAY: 100,
	
    //키이벤트
	KEY_TAB: 9, KEY_ENTER: 13, KEY_ESC: 27, KEY_SPACE: 32, KEY_PGUP: 33, KEY_PGDOWN: 34, KEY_END: 35, KEY_HOME: 36, 
	KEY_SHIFT: 16, KEY_CTRL: 17, KEY_ALT: 18,
    KEY_LEFT: 37, KEY_UP: 38, KEY_RIGHT: 39, KEY_DOWN: 40, KEY_DEL: 46,
    KEY_A: 65, KEY_B: 66, KEY_C: 67, KEY_D: 68, KEY_E: 69, KEY_F: 70, KEY_G: 71,KEY_H: 72, KEY_N: 78, KEY_O: 79, 
	KEY_Q: 81, KEY_S: 83, KEY_V: 86, KEY_W: 87, KEY_X: 88, KEY_Y: 89, KEY_Z: 90,
    KEY_F1: 112, KEY_F2: 113, KEY_F3: 114, KEY_F4: 115, KEY_F5: 116, KEY_F6: 117, KEY_F7: 118, KEY_F8: 119, KEY_F9: 120, KEY_F10: 121, 
	
	
	LBUTTON: 1, MBUTTON: 2, RBUTTON: 3,
	
	PHONE_DOC_WIDTH: 640,
	TABLET_DOC_WIDTH: 1280,	//1024
	
};

//deprecated 
afc.ClassName =
{
    LABEL:'ALabel',
	TEXTBOX:'ATextBox',
    BUTTON:'AButton',
    CHECKBOX:'ACheckBox',
    RADIOGROUP:'ARadioGroup',
    RADIOBUTTON:'ARadioButton',
    TEXTFIELD:'ATextField',
    TEXTAREA:'ATextArea',
    DROPBOX:'ADropBox',
    SELECTBOX:'ASelectBox',
    GRID:'AGrid',
    TREE:'ATree',
    SWITCHBUTTON:'ASwitchButton',
    IMAGE:'AImage',
    CANVAS:'ACanvas',
    PROGRESS : 'AProgress',
    SLIDER : 'ASlider',
    //DATEPICKER : 'ADatePicker',
    TIMEPICKER : 'ATimePicker',
	SCROLLBAR : 'AScrollBar',
	
    GRIDLAYOUT : 'AGridLayout',
    FLEXLAYOUT : 'AFlexLayout',
	
    VIEW:'AView',
    LISTVIEW:'AListView',
    TABVIEW:'ATabView',
    WEBVIEW:'AWebView',
    SLIDEVIEW:'ASlideView',

    FLEXVIEW:'AFlexView',
    SPLITVIEW:'ASplitView',
    ACCORDION: 'AAccordion',

	BAR: 'ABar',
    TOOLBAR: 'AToolBar',
	MENUBAR: 'AMenuBar',
	TABBAR: 'ATabBar',
	
	FLOAT: 'AFloat',
	TOAST: 'AToast',
	INDICATOR: 'AIndicator',
	MENU: 'AMenu',
    
    PAGE:'APage',
    WINDOW: 'AWindow',
    APPLICATION: 'AApplication'
    
};

//afc.ACTION_DOWN = 'touchstart';
//afc.ACTION_MOVE = 'touchmove';
//afc.ACTION_UP = 'touchend';

afc.COMP_CTX = {};

//afc.COMP_CTX.defEvents = ['actiondown', 'actionmove', 'actionup'];

afc.compLabel = {
	"ALabel": "Label",
	"ATextBox": "TextBox",
	"AButton": "Button",
	"ACheckBox": "CheckBox",
	"ARadioButton": "RadioButton",
	"ADropBox": "DropBox",
	"ASelectBox": "SelectBox",
	"ATextField": "TextField",
	"ATextArea": "TextArea",
	"ASwitchButton": "SwitchButton",
	"AImage": "Image",
	"AVideo": "Video",
	"ACanvas": "Canvas",
	"AGrid": "Grid",
	"ATree": "Tree",
	"AScrollBar": "ScrollBar",
	"AView": "View",
	"ARadioGroup": "RadioGroup",
	"AListView": "ListView",
	"ATabView": "TabView",
	"AWebView": "WebView",
	"AProgress": "Progress",
	"ASlider": "Slider",
	"AGridLayout": "GridLayout",
	"AFlexLayout": "FlexLayout",
	"AFlexView": "FlexView",
	"ASplitView": "SplitView",
	"AAccordion": "Accordion",
	"ADataGrid": "DataGrid",
	"ASlideView": "SlideView",
	"APivotGrid": "PivotGrid",
	"AForm": "Form",
	"AFileUploader": "FileUploader",
	"ACalendarPicker": "CalendarPicker",
	"APagingBar": "PagingBar",
	"AFlowOneLine": "FlowOneLine",
	"AFlowTwoLine": "FlowTwoLine",
	"AFlowThreeLine": "FlowThreeLine",
	"AVertical": "Vertical",
	"AHorizontal": "Horizontal",
	"ASpacer": "Spacer"
};

//--------------------------------------- Component -------------------------------------------------------------------------

afc.enableUserSelect = function(enable, element)
{
	var $ele;
	
	if(element) $ele = $(element);
	else $ele = $('body');
	
	if(enable)
	{
		$ele.css('-webkit-user-select', 'auto');
		$ele.find('span').css('-webkit-user-select', 'auto');
	}
	else
	{
		$ele.css('-webkit-user-select', 'none');
		$ele.find('span').css('-webkit-user-select', 'none');
	}
};

afc.enableScrollIndicator = function()
{
	//var strCss = '';
	
	//strCss += 'div { -ms-overflow-style: none; }';		//ie
	//strCss += '::-webkit-scrollbar { display: none; }';	//webkit
	//$('<style></style>').text(strCss).appendTo('head');	

	afc.isScrollIndicator = true;
};

//----------------------------
//	비동기 쿼리 로드 완료 대기

afc.qryWait = new AAwait();
afc.queryReady = function(acomp, callback)
{
	afc.qryWait.waitAllProm().then(values => 
    {
		acomp._applyLoadedQuery();
        callback(values);

        afc.qryWait.resetProm();
    });
};

//-----------------------------------
// 	비동기 스크립트 로드 완료 대기
//	afc._loadScriptWait 에서 사용

afc.scriptWait = new AAwait();
afc.scriptReady = function(callback)
{
	afc.scriptWait.waitAllProm().then(values => 
    {
        callback(values);
        afc.scriptWait.resetProm();
    });
};

//----------------------------
//	비동기 html 로드 완료 대기
/*
afc.htmlWait = new AAwait();
afc.htmlReady = function(callback)
{
	afc.htmlWait.waitAllProm().then(values => 
    {
        callback(values);
        afc.htmlWait.resetProm();
    });

};
*/

//----------------------------
//	

afc.loadWait = new AAwait();

afc._loadScriptWait = function(url, isReload) 
{
	afc.loadWait.begin(url);

	var prom = new Promise(function(resolve, reject) 
	{
		afc.loadScript(url, function(isCache)
		{
            //이전에 이미 로드되어져 있는 파일은 바로 resolve
            if(isCache)
            {
                afc.loadWait.end(url, true);

                resolve(url);
            }
            else
            {
                //모든 비동기 작업이 완료되면 호출될 콜백을 등록한다.
                //즉, 자신의 스크립트 파일의 로드가 완료되었지만 추가적인 비동기 작업이 등록되어 있으면
                //자신의 resolve 를 보류하고 모든 비동기 작업이 완료되면 다음 콜백이 호출되면서 
                //자신의 promise 를 resolve 시킨다.
                afc.loadWait.waitAll(function()
                {
                    resolve(url);
                });	

                //다음 함수가 호출될 때 자신의 end 가 마지막 비동기이면 등록된 모든 콜백이 호출된다.
                afc.loadWait.end(url);
            }
		}, isReload);
	});
	
	return afc.scriptWait.addProm(prom);
};

//화면 개발시점에는 이 함수를 사용해야 한다.
afc.import = function(url) 
{
    //console.log('script url : ' ,url);
	return afc._loadScriptWait(url);
};


//--------------------------------------------------------------------------------------------
// About Log
//--------------------------------------------------------------------------------------------

afc.disableLog = function()
{
	afc.log = function() { return ''; };
	console.log = function() {};
};

afc.logFilter = 'SpiderGen';
afc.logOption = 
{
	compElement: false,
};

afc.log = function(msg)
{
	var logMsg = '';
	
	if(msg instanceof AComponent || msg instanceof AContainer) logMsg = msg.toString(); 
	else if(msg instanceof HTMLElement) logMsg = $(msg)[0].outerHTML;
	else if(msg instanceof Object) logMsg = afc.stringifyOnce(msg, undefined, 4);
	else logMsg = msg;
	
	logMsg = afc.logFilter + ' => ' + logMsg;
	console.log(logMsg);
	
	if(afc.isIos && window.AppManager) AppManager.consoleLog(logMsg);
	
	return logMsg;
};

afc.log2 = function(msg)
{
	var logMsg = '';
	
	if(msg instanceof HTMLElement) logMsg = $(msg)[0].outerHTML;
	else if(msg instanceof Object) logMsg = afc.stringifyOnce(msg, undefined, 4);
	else logMsg = msg;
	
	logMsg = afc.logFilter + ' => ' + logMsg;
	console.log(logMsg);
	
	if(afc.isIos && window.AppManager) AppManager.consoleLog(logMsg);
	
	return logMsg;
};


afc.setLogFilter = function(filter)
{
	afc.logFilter = filter;
};

afc.setLogOption = function(option)
{
	for(var p in option)
	{
		if(!option.hasOwnProperty(p)) continue;
		afc.logOption[p] = option[p];
	}
};

afc.stringifyOnce = function(obj, replacer, indent)
{
    var printedObjects = [];
    var printedObjectKeys = [];

    function printOnceReplacer(key, value)
    {
        if ( printedObjects.length > 200) // browsers will not print more than 20K, I don't see the point to allow 2K.. algorithm will not be fast anyway if we have too many objects
        { 
        	return 'object too long';
        }
        
        var printedObjIndex = false;
        printedObjects.forEach(function(obj, index)
        {
            if(obj===value)
                printedObjIndex = index;
        });

		//root element
        if ( key == '')
        {
        	printedObjects.push(obj);
            printedObjectKeys.push("root");
            return value;
        }
        else if(printedObjIndex+"" != "false" && typeof(value)=="object")
        {
            if ( printedObjectKeys[printedObjIndex] == "root") return "(pointer to root)";
            else return "(see " + ((!!value && !!value.constructor) ? afc.getClassName(value).toLowerCase()  : typeof(value)) + " with key " + printedObjectKeys[printedObjIndex] + ")";
        }
        else
        {
            var qualifiedKey = key || "(empty key)";
            printedObjects.push(value);
            printedObjectKeys.push(qualifiedKey);
            
            if(replacer) return replacer(key, value);
            else return value;
        }
    }
    
    return JSON.stringify(obj, printOnceReplacer, indent);
};


//--------------------------------------------------------------------------------------------
// About Time Check
//--------------------------------------------------------------------------------------------

afc.startTime = 0;
afc.oldTime = 0;
afc.beginTimeCheck = function(msg)
{
	afc.startTime = afc.oldTime = Date.now();
	
	if(!msg) msg = '';
	console.log(msg + ' -- Start time ==>			' + afc.startTime + ' --------------------------------------------------');
};

afc.ellapseCheck = function(msg, isEnd)
{
	if(afc.startTime==0) afc.beginTimeCheck(msg);
	else if(isEnd) afc.endTimeCheck(msg);
	else
	{
		if(!msg) msg = '';

		console.log(msg + ' -- Ellapsed time ==>		' + (Date.now() - afc.oldTime));
		afc.oldTime = Date.now();
	}
	
};

afc.endTimeCheck = function(msg)
{
	if(!msg) msg = '';
	
	afc.oldTime = Date.now();
	
	console.log(msg + ' -- End time ==> 			' + afc.oldTime + ' -------------------------------------');
	console.log(msg + ' -- Total Ellapsed time ==>	' + (afc.oldTime - afc.startTime) + ' -------------------------------------');
	
	afc.startTime = 0;
	afc.oldTime = 0;
};

afc.prefixCnt = 0;

afc.makeCompIdPrefix = function()
{
/*
	var time = new Date().getTime(),
		//rnd = parseInt(Math.random()*1000, 10);
		rnd = Math.random(),
		ret = time + rnd + afc.CLASS_MARK;
	
	return ret.replace('.', '');
	*/
	
	// Number.MAX_SAFE_INTEGER == 9007199254740991
	// IE에서는 지원하지 않는 변수이기 때문에 실제 숫자로 비교한다.
	if(afc.prefixCnt == 9007199254740991) afc.prefixCnt = 0;
	
	afc.prefixCnt++;
	
	return '_' + afc.prefixCnt + afc.CLASS_MARK;
};

//-------------------------------------------------------------------
//  function MyObject()
//  {
//      ParentObject.call(this); //부모에 변수 선언이 있다면 호출해 줄 것.
//  }
//  afc.extendsClass(MyObject, ParentObject);
//--------------------------------------------------------------------

//클래스 상속 관련 처리를 해준다.
afc.extendsClass = function(childClass, parentClass)
{
    //이미 상속처리가 되어져 있는 경우는 리턴
    if(childClass.prototype.superClass) return;
	
	if(!parentClass)
	{
		console.error('afc.extendsClass : parentClass is not defined.');
		return;
	}

	//상속 받을 부모의 프로토 타입 객체를 생성한다.
	var superProto = new parentClass(); //파라미터 없이 호출한다.
	for(var p in superProto) 
		if(superProto.hasOwnProperty(p)) delete superProto[p];

	childClass.prototype = superProto;
	childClass.prototype.constructor = childClass;
	childClass.prototype.superClass = parentClass;
};

//newObj 에 존재하는 프로퍼티만 curObj 에 셋팅해 준다.
afc.mergeObject = function(curObj, newObj)
{
	if(newObj)
	{
		for(var p in newObj)
		{
			if (newObj.hasOwnProperty(p))
				curObj[p] = newObj[p];
		}
	}
	
	return curObj;
};


afc.getClassName = function(funcObj)
{
	if(afc.isIE)
	{
		var funcNameRegex = /function (\w*)/;	//   /function (.{1,})\(/;
		var results = (funcNameRegex).exec(funcObj.constructor.toString());
		return (results && results.length > 1) ? results[1] : "";
/*		
  		var f = typeof funcObj == 'function';
  		var s = f && ((funcObj.name && ['', funcObj.name]) || funcObj.toString().match(/function ([^\(]+)/));
  		return (!f && 'not a function') || (s && s[1] || 'anonymous');
  */
	}
	else return funcObj.constructor.name;
};

afc.getUrlParameter = function()
{  
    var ParameterObject = {};  
    var locate = location.href;  
 
    if(locate.indexOf("?")==-1)  
        return ParameterObject;  
 
    var parameter = locate.split("?")[1];  
    var paramAreay = parameter.split("&");  
    for ( var i=0; i<paramAreay.length; i++ )  
    {  
        var tem = paramAreay[i].split("=");  
        ParameterObject[tem[0]] = tem[1];  
    }

    return ParameterObject;  
};


//---------------------------
//	lay, cls 로드 캐시 설정

afc.isLoadCache = true;

afc.enableLoadCache = function(enable)
{
	afc.isLoadCache = enable;
};

afc._loadHtmlHelper = function(trgEle, url, callback, searchValue, newValue, isSync) 
{
	var pre = '';
	if(PROJECT_OPTION.build.subName) pre = PROJECT_OPTION.build.subName + '/';

	//url = pre + url.replace('.lay', '.html');
	url = url.replace('.lay', '.html');

	var tmp = url.split('#'), viewId = null;

	if(tmp.length==2)	//url 뒤에 #view_id 를 붙이면 lay 내의 특정 뷰만 로드한다.
	{
		url = tmp[0];
		viewId = tmp[1];
	}

	if(afc.versionMap)
	{
		var vCode = afc.versionMap[url];
		if(vCode) url += '?v=' + vCode;
	}

	$.ajax(
	{
		async: !isSync,
		cache: afc.isLoadCache,
		url: pre+url,
		dataType: 'text',
		success: function(txt)
		{
			if(searchValue)
				txt = txt.replace(searchValue, newValue);

			if(trgEle)
			{
				let trgObj = $(trgEle);
                
				if(viewId)	//url 뒤에 #view_id 를 붙이면 lay 내의 특정 뷰만 로드한다.
				{
                    let loadObj = $(txt);

					let _className = loadObj.attr(afc.ATTR_CLASS) + afc.CLASS_MARK,
						_classMap = loadObj.attr('data-class-map');

					loadObj = loadObj.find('#' + _className + viewId);
					loadObj.attr('data-class-map', _classMap);

					//trgObj.html(findView);
                    trgObj.html(loadObj);
				}
                else trgObj.html(txt);

				if(callback) callback.call(trgEle, txt);
				//else resolve(txt);
			}
			else 
			{
				if(callback) callback(txt);
				//else resolve(txt);
			}
		},

		error: function() 
		{
			if(callback) callback.call(trgEle, null);
			//else resolve(null);
		}
	});
};

afc.loadHtmlSync = function(trgEle, url, callback, searchValue, newValue)
{
	afc._loadHtmlHelper(trgEle, url, callback, searchValue, newValue, true);
};

afc.loadHtml = function(trgEle, url, callback, searchValue, newValue) 
{
    //console.log('html url : ' ,url);  

	return new Promise(function(resolve, reject) 
	{
		afc._loadHtmlHelper(trgEle, url, function(txt)
		{
			if(callback) callback.call(trgEle, txt);
			else 
            {
                if(txt) resolve(txt);
                else reject();
            }
			
		}, searchValue, newValue, false);
	});	
};

afc.scriptMap = {};
afc.cssMap = {};

afc.versionMap = null;

afc.setVersionMap = function(obj)
{
	if(!afc.versionMap) afc.versionMap = {};

	var url, p;
	
    for(p in obj)
	{
		url = p;
		
		url = url.replace('.cls', '.js');
		url = url.replace('.lay', '.html');
		
		afc.versionMap[url] = obj[p];
	}
};


afc.getFileSrc = function(url, isEnc)
{
	var retVal = '';
	jQuery.ajax(
	{
		async:false, type:'GET', url: url, dataType:'text',
		success: function(data) 
		{
			if(isEnc)
			{
				//GibberishAES.size(128);	
				//retVal = GibberishAES.aesDecrypt(data, 'asydhf745igjdfdf'); //asydhf745igjdfdf 암호화 키(16자리)
			}
			else retVal = data;
		},
		error: function(xhr, textStatus, errorThrown) 
		{ 
			retVal = null;
		}
	});

	return retVal;
};

//특별히 afc.import 로직을 타지 말아야 할 경우를 제외하면 
//화면 개발 시점에는 afc.import 를 사용할 것.
afc.loadScript = function(url, callback, isReload)
{
	//Promise 지원
	var prom = new Promise(function(resolve, reject) 
	{
		var pre = '';
		if(PROJECT_OPTION.build.subName) pre = PROJECT_OPTION.build.subName + '/';

		//여기서 하면 안됨..
		//url = pre + url.replace('.cls', '.js');

		url = url.replace('.cls', '.js');

		if(isReload) afc.removeScript(url);
		
		
		var scriptObj = afc.scriptMap[url];

		if(scriptObj)
		{
			//네트웍 로딩 상태이면
			if(scriptObj.isPending)
			{
				if(!scriptObj.pendingQueue) scriptObj.pendingQueue = [];

				if(callback) scriptObj.pendingQueue.push(callback);
				else scriptObj.pendingQueue.push(resolve);
			}
			else 
			{
                //cache is true
				if(callback) callback(true);
				else resolve(true);
			}		
		}
		else
		{
			scriptObj = {};
			//펜딩 상태로 셋팅하고 로드를 시작한다.
			scriptObj.isPending = true;

			afc.scriptMap[url] = scriptObj;

			if(afc.versionMap)
			{
				var vCode = afc.versionMap[url];
				if(vCode) url += '?v=' + vCode;
			}

			if(!afc.isLoadCache)
			{
				var _add = Math.random();

				if(url.indexOf('?')>-1) url += _add;
				else url += '?' + _add;
			}
			
			var tag = document.createElement('script');
			
			var retFunc = function(success)
			{
				var pendingQueue = scriptObj.pendingQueue;

				scriptObj.isPending = undefined;
				scriptObj.pendingQueue = undefined;
				
				//실패 시 지운다.
				if(!success) afc.scriptMap[url] = null;

				if(callback) callback();
				else resolve();

				//펜딩큐에 있는 콜백함수들에게도 알린다.
				if(pendingQueue)
				{
					pendingQueue.forEach(function(_callback)
					{
						_callback();
					});
				}			
			
			};

			tag.onload = function()
			{
				//if(callback) callback(resolve);
				//else resolve(url);
				
				
				retFunc(true);
			};
			
			tag.onerror = function()
			{
				//if(callback) callback(resolve);
				//else resolve(null);
				
				
				retFunc(false);
			};
			
			tag.src = pre + url;
			tag.defer = true;
			
            //console.log('script url : ' , tag.src);
			document.getElementsByTagName('head')[0].appendChild(tag);
		}

	});
	
	//if(!callback) afc.scriptWait.addProm(prom);
	
	return prom;
	
};

if(window.afc_)
{
	afc.loadScript = afc_.loadScript;
	afc._loadScriptWait = function(url)
	{
		var prom = new Promise(function(resolve, reject) 
		{
			afc_.loadScript(url);
			
			resolve();
			//if(callback) callback();
		});
		
		return afc.scriptWait.addProm(prom);
	};
}

afc.removeScript = function(url, objNameArr)
{
	var node = $.find('[src="' + url + '"]')[0];
	if(node) node.remove();
	
	afc.scriptMap[url] = undefined;
	
	if(objNameArr)
	{
		objNameArr.forEach(function(name)
		{
			delete window[name];
		});
	}
};

//하나의 파일로 연결할 때도 다음 로직을 사용한다.
afc.existScriptSrc = function(chkSrc)
{
	var ss = document.getElementsByTagName('script'),
		src, loc = window.location.href;
		
	loc = loc.substring(0, loc.lastIndexOf('/')+1);

	for(var i=0; i<ss.length; i++)
	{
		src = ss[i].src.replace(loc, '');
		
		if(src==chkSrc) return true;
	}
	
	return false;
};

afc.setIndexScriptMap = function(loc)
{
	var ss = document.getElementsByTagName('script'), src;

	if(!loc) loc = window.location.href;
		
	var subLen = PROJECT_OPTION.build.subLength;
	
	//html 의 위치와 script 의 위치가 다르면 sbuLen 은 2 이상일 수 있다.
	if(!subLen) subLen = 1;
	
	for(var h=0; h<subLen; h++)
		//loc = loc.substring(0, loc.lastIndexOf('/')+1);
		loc = loc.substring(0, loc.lastIndexOf('/'));
		
	loc += '/';
		
	//console.log('loc => ' + loc);
		
	for(var i=0; i<ss.length; i++)
	{
		src = ss[i].src.replace(loc, '');
		
		src = src.split('?')[0];
		
		if(!afc.scriptMap[src])
		{
			afc.scriptMap[src] = {};

			//console.log('afc.setIndexScriptMap => ' + src);
		}
		//else console.log('afc.setIndexScriptMap already => ' + src);
	}
};


//--------------------------------------------------------------------
//	ex) <link href="styles.css" rel="stylesheet" media="all and (max-width: 1024px)">

afc.loadCss = function(url, attrObj)
{
	var pre = '';
	if(PROJECT_OPTION.build.subName) pre = PROJECT_OPTION.build.subName + '/';
	
	if(!afc.cssMap[url])
	{
		afc.cssMap[url] = true;
	
		/*
		var strAttr = '';
		
		if(attrObj)
		{
			for(var p in attrObj)
				strAttr += ' ' + p + '="' + attrObj[p] + '"';
		}
		
		$('<link rel="stylesheet" href="' + pre + url + '"' + strAttr + '/>').appendTo('head');
		*/
		
		var link = document.createElement('link');
		link.rel = "stylesheet";
		link.href = pre + url;
		
		if(attrObj)
		{
			for(var p in attrObj)
				link[p] = attrObj[p];
		}
		
		document.getElementsByTagName('head')[0].appendChild(link);
	}
};

afc.removeCss = function(url)
{
	var pre = '';
	if(PROJECT_OPTION.build.subName) pre = PROJECT_OPTION.build.subName + '/';
	
	$('head link[href="' + pre + url + '"]').remove();
	
	// 2번 이상 로드를 하는 경우 로드여부를 제거해야 다시 loadCss를 호출할 수 있으므로 제거한다.
	delete afc.cssMap[url];
};

afc.refreshApp = function($cntr)
{
	var tmp = $('<div style="position:absolute; z-index:0; width:1px; height:1px;"> </div>');
	
	if(!$cntr) $cntr = $('body');
	
	$cntr.append(tmp);

	setTimeout(function() { tmp.remove(); }, 700);
};

//컴포넌트 클래스가 구현 가능한 모든 이벤트 목록을 얻어온다. 
//셋팅한 파라미터의 이벤트 목록만 리턴한다. 둘다 null 이면 AEvent.events 리턴
afc.getEventList = function(baseName)
{
	/*
	var retArr = AEvent.events;
	
	if(baseName) retArr = retArr.concat(window[baseName+'Event'].events);
	if(className && baseName!=className) 
	{
		var evtClass = window[className+'Event'];
		if(evtClass) retArr = retArr.concat(evtClass.events);
	}
	
	return retArr;
	*/
	var ctx = window[baseName].CONTEXT;
	
	if(ctx) return ctx.events.concat(AEvent.defEvents);
	else return [];
};

//컴포넌트 클래스가 구현 가능한 자식이벤트 목록을 얻어온다. AView(_childSelect==2)에서만 사용한다.
afc.getChildEventList = function(baseName)
{
	var ctx = window[baseName].CONTEXT;
	if(ctx && ctx.childEvents) return ctx.childEvents.concat();
	else return [];
};

//--------------------------------------------------------------------------------------------
// About Device & Version
//--------------------------------------------------------------------------------------------

afc.isAndroid = false;
afc.isIos = false;
afc.isTizen = false;
afc.isPC = false;
afc.isMobile = false;
afc.isSimulator = false;
afc.isChrome = false;
afc.isIE = false;
afc.isHybrid = false;
afc.isSamsungBrowser = false;
afc.isFirefox = false;

afc.isTablet = false;
afc.isPhone = false;

//pc
afc.isWindow = false;
afc.isMac = false;
afc.isLinux = false;

//
afc.isExec = false;		//old chrome bridge version
afc.isNwjs = false;		//node webkit, nwjs
afc.isElectron = false;	//electron
afc.isCloud = false;	//클라우드 버전, 웹버전


afc.andVer = 1000.0;	//버전값으로만 ios 제외하기 위해 , 4.1, 4.2 ...
afc.iosVer = 1000.0;	//7.0, 7.1 ...

afc.strAndVer = ''; 	//4.1.2
afc.strIosVer = '';		//7.1.2
afc.strIEVer = '';		//edge

afc.strModuleName = '';
afc.scrlWidth = 17;

afc.OS = '';
afc.DIV = '/';

//Win32
if(window.navigator.platform.indexOf('Win')>-1) 
{
	afc.OS = 'WIN';
	afc.DIV = '\\';
	afc.isWindow = true;
}
//MacIntel
else if(window.navigator.platform.indexOf('Mac')>-1) 
{
	afc.OS = 'MAC';
	afc.DIV = '/';
	afc.isMac = true;
}
else
{
	afc.OS = 'LNX';
	afc.DIV = '/';
	afc.isLinux = true;
}


afc.isDeviceOf = function(device)
{
	return (navigator.userAgent.indexOf(device)>-1);
};

afc.androidVersion = function()
{
	var match = navigator.userAgent.match(/Android\s([0-9\.]*)/);
	afc.strAndVer = match ? match[1] : null;
	
	return afc.strAndVer;
};

afc.iosVersion = function()
{
	var match;
	if(afc.isDeviceOf('iPhone')) 
	{
		match = navigator.userAgent.match(/iPhone OS\s([0-9\_]*)/);
	}
	else if(afc.isDeviceOf('iPad'))
	{
		match = navigator.userAgent.match(/iPad; CPU OS\s([0-9\_]*)/);
	}
	
	afc.strIosVer = match ? match[1] : null;
	
	if(afc.strIosVer) 
	{
		afc.strIosVer = afc.strIosVer.replace(/_/g, '.');
		return afc.strIosVer;
	}
	else return null; 
};

afc.makeMeta = function()
{
	//------------------------------------------------------------------------------
	//  param check
	//------------------------------------------------------------------------------
    var params = afc.getUrlParameter();
    var scale = params['scale'];
    var density = params['density'];
    
	afc.urlParameter = params;
	
    //alert(navigator.userAgent);
    
	//var meta = null,
	//	docWidth = PROJECT_OPTION.general.docWidth;
	
	var meta = document.createElement('meta'), docWidth = null, content;
	meta.setAttribute('name', 'viewport');
	
	//이전 버전
	if(PROJECT_OPTION.general.phoneDocWidth==undefined) docWidth = PROJECT_OPTION.general.docWidth;
	
	//폰, 태블릿 별 세로모드 시점의 document width
	else docWidth = afc.isPhone ? PROJECT_OPTION.general.phoneDocWidth : PROJECT_OPTION.general.tabletDocWidth;

	
	//자동으로 스케일 값을 계산해 주는 경우
	if(PROJECT_OPTION.general.autoScale)
	{
		//킷캣 이하 버전
		//if(density)	meta = '<meta name="viewport" content="width=device-width, target-densitydpi=' + density + 'dpi';
		if(density)	content = `width=device-width, target-densitydpi=${density}dpi`;
		else
		{
			//screen width, height 가 세로모드일 때... 800, 1280 이었으면 
			//가로모드일 때는 1280, 800 이다. 
			
			//가로모드로 시작할 경우, 스케일 계산 오류 수정
			var chkWidth = Math.min(screen.width, screen.height);
			
			//######################################################################
			//	차후 각 기기별(폰, 태블릿, 제품별)로 chkWidth 가 어떻게 나오는지 확인해서
			//	docWidth 를 지정하지 않은 경우 자동으로 할당해줄 최적값을 구하도록 한다.
			//######################################################################
			
			//auto 로 지정한 경우
			if(!docWidth)
			{
				//태블릿 인 경우
				if(afc.isTablet) docWidth = afc.TABLET_DOC_WIDTH;	//1280;
				else docWidth = afc.PHONE_DOC_WIDTH;				//640
			}
			
			//alert(screen.width + ', ' + screen.height);

			if(!scale) scale = chkWidth / docWidth;
			
			//확대시킬 경우, 가로나 세로가 body 를 넘어가 스크롤이 발생
			if(scale>1)
			{
				$('body').css('overflow', 'hidden');
			}
			
			//meta = '<meta name="viewport" content="width=device-width, initial-scale=' + scale;
			content = `width=device-width, initial-scale=${scale}`;
			
			PROJECT_OPTION.general.scaleVal = scale;
		}
	}
	
	//설정값으로 스케일 하는 경우
	else
	{
		//meta = '<meta name="viewport" content="width=' ;
		//meta += !docWidth ? 'device-width' : docWidth;	//자동인 경우는 diveice-width, 아닌 경우는 설정값으로
		//meta += ', initial-scale=' + PROJECT_OPTION.general.scaleVal;
		content = `width=${!docWidth ? 'device-width' : docWidth}, initial-scale=${PROJECT_OPTION.general.scaleVal}`;	
		//자동인 경우는 device-width, 아닌 경우는 설정값으로
	}

	//if(PROJECT_OPTION.general.userScalable && !afc.isHybrid) meta += ', user-scalable=yes"/>';
	//else meta += ', user-scalable=no"/>';
	if(PROJECT_OPTION.general.userScalable && !afc.isHybrid) content += ', user-scalable=yes';
	else content += ', user-scalable=no';
	
	meta.setAttribute('content', content);
	
console.log(meta);
	
	document.getElementsByTagName('head')[0].prepend(meta);//$(meta).prependTo('head');
   	
	$('<meta http-equiv="Content-Security-Policy" content="connect-src *; default-src * gap://ready file:; img-src * data: blob:; style-src * \'unsafe-inline\'; script-src * \'unsafe-inline\' \'unsafe-eval\'">').prependTo('head');
    
	//아이폰 숫자 폰번호 인식 방지
	$('<meta name="format-detection" content="telephone=no"/>').prependTo('head');
};

afc.changeScale = function(scale)
{
	if(!scale) scale = PROJECT_OPTION.general.scaleVal;
	var viewport = document.querySelector('meta[name="viewport"]');
	viewport.content = viewport.content.replace(/initial-scale[\s\S]*?(?=,|")/, 'initial-scale='+scale);
};

afc.browserCheck = function()
{
	var agent = navigator.userAgent.toLowerCase(); 
	var name = navigator.appName;

	// IE old version ( IE 10 or Lower ) 
	if ( name == "Microsoft Internet Explorer" ) afc.strIEVer = "msie"; 
	else 
	{
		// IE 11 
		if(agent.indexOf("trident") > -1) afc.strIEVer = "trident"; 
		// Microsoft Edge  
		else if(agent.indexOf("edge/") > -1 )
		{
			afc.strIEVer = "edge";
			//edge에서 12에서 17로 변경.
			afc.scrlWidth = 17;
		}
		
		else if(agent.indexOf("chrome") > -1) 
		{
			afc.isChrome = true;
			afc.scrlWidth = 17;
			
			//프로젝트에서 커스텀한 경우 이 값을 변경한다.
		}
	}
	
	afc.isIE = (afc.strIEVer!='');
	
	if(afc.isDeviceOf('SamsungBrowser')) 
	{
		afc.isSamsungBrowser = true;
	}
	
	if(afc.isDeviceOf('Firefox'))
	{
		afc.isFirefox = true;
		afc.scrlWidth = 17;
	}
};

afc.deviceCheck = function()
{
	if(window.exec) afc.isExec = true;
	else if(window.nw) afc.isNwjs = true;	//node webkit, nwjs
	else 
	{
		if(afc.isDeviceOf(' Electron/')) afc.isElectron = true;
		else
		{
			afc.isCloud = true;				//클라우드 버전, 웹버전
			afc.DIV = '/';
		}
	}

	afc.isMobile = true;
	
	afc.isHybrid = (window.PROJECT_OPTION && PROJECT_OPTION.build.bridgeName!='none');
	
	//스파이더젠 시뮬레이터, 크롬 브라우저이지만 agent 에 Simulator 값을 가지고 있다.
	if(afc.isDeviceOf('Simulator'))
	{
		afc.isSimulator = true;
	}
	
	//----------------------------------------
	
	
	if(afc.isDeviceOf('Android')) 
	{
		afc.isAndroid = true;
		afc.andVer = parseFloat(afc.androidVersion());
	}
	else if(afc.isDeviceOf('iPhone') || afc.isDeviceOf('iPad') || afc.isDeviceOf('iPod')) 
	{
		//ios 13이상의 아이패드에서 userAgent에서 iPad가 빠지고 맥os로 자동변경되어
		//아이패드라는걸 인식하지 못하는 이슈가 있는데 이는 네이티브에서 처리해야한다.
		//RND\SpiderGen3.0\document의 Wkebview 가이드 참고.
		afc.isIos = true;
		afc.iosVer = parseFloat(afc.iosVersion());
		
		//document에 touchend 이벤트를 바인드하지 않으면 아이폰에서 특정 컴포넌트의 touchend가 가끔식 발생하지 않음
		$(document).bind('touchend', function(e){});
	}
	else if(afc.isDeviceOf('Tizen')) 
	{
		afc.isTizen = true;
	}
	
	//pc 
	else
	{
		//alert(navigator.userAgent);
		
		afc.isPC = true;
		afc.isMobile = false;
		
		//시뮬레이터에서 모바일 모드로 변경할 수 있으므로 여기서 비교하면 안됨.		
		//if(afc.isDeviceOf('Simulator'))
		//{
		//	afc.isSimulator = true;
		//}
	}
	
	if(afc.isMobile)
	{
		var chkWidth = Math.min(screen.width, screen.height);
	
		//###########################################################################################################
		// 예외 상황이 있을 경우 window.devicePixelRatio 값도 비교해 보기
		//###########################################################################################################

		if(!PROJECT_OPTION.general.tabletMinWidth) PROJECT_OPTION.general.tabletMinWidth = 500;
		
		afc.isTablet = (chkWidth>PROJECT_OPTION.general.tabletMinWidth);
		afc.isPhone = !afc.isTablet;
		
		//모바일일때만 키보드매니저를 동적으로 추가해준다. 비동기 로드
		afc.import('Framework/afc/library/KeyboardManager.js');
		afc.import('Framework/afc/library/ScrollIndicator.js');
	}
	
	
	//시뮬레이터 pc모드인데 브릿지 셋팅이 되어 있으면 모바일 처럼 작동하기위해 
	//스크롤바를 숨김
	if(afc.isPC && afc.isSimulator && afc.isHybrid )
	{
		var strCss = '::-webkit-scrollbar { display: none; }'; 
		$('<style></style>').text(strCss).appendTo('head');	
	}
	
	if(window.PROJECT_OPTION && !window.afc_)
	{
		if(PROJECT_OPTION.deployment.checkVersion)
		{
			afc.import('Source/Version.js?ver=' + Date.now());
		}
	
		if(PROJECT_OPTION.build.bridgeName=='cordova')
		{
			//시뮬레이터 모바일 모드에서 오류가 발생하므로
			//무조건 windows/cordova.js 를 로드한다.
			if(afc.isSimulator) afc.import('Bridge/windows/cordova.js');
			else if(afc.isIos) afc.import('Bridge/ios/cordova.js');
			else if(afc.isAndroid) afc.import('Bridge/android/cordova.js');
			else if(afc.isPC) afc.import('Bridge/windows/cordova.js');
		}
	}
};

//--------------------------------------------------------------------------------------------
// About BugFix
//--------------------------------------------------------------------------------------------

//스타일을 동적으로 수정하기
afc.addRule = function(sheet, selector, styles)
{
	if(sheet.insertRule) return sheet.insertRule(selector + '{' + styles + '}');
	if(sheet.addRule) return sheet.addRule(selector, styles);
};

//전화걸기
//This function is deprecated, instead of this, use AppManager.phoneCall()
/*
afc.phoneCall = function(phoneNumber)
{
	var phoneStr = 'tel:'+phoneNumber;
	if(afc.isAndroid) AppManager.goUrl(phoneStr);
	else if(afc.isIos) window.location = phoneStr;
};
*/

//pos자리만큼 소수점 버림
afc.floor = function(value, pos) 
{
	var digits = Math.pow(10, pos);
	return parseFloat(parseInt(value*digits, 10)/digits).toFixed(pos);
};

//pos자리만큼 소수점 버림 + '%'
afc.floorPer = function(value, pos) 
{
	var digits = Math.pow(10, pos);
	return parseFloat(parseInt(value*digits, 10)/digits).toFixed(pos)+'%';
};


//pos만큼 소수점 자리 자르기
afc.floatFix = function(value, pos) 
{
	if(!value) value = 0;
	else value = parseFloat(value);
	
	if(!pos) pos = 2;
	return value.toFixed(pos);
};

//천단위마다 콤마 추가
afc.addComma = function(val) 
{
	if(val != undefined)
	{
		var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
		val += '';  // 숫자를 문자열로 변환
		while (reg.test(val))
			val = val.replace(reg, '$1' + ',' + '$2');
		return val;	
	}
	else return '';
	
	/*
	if(val != undefined) return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	else return '';
	*/
};

//천단위마다 콤마 추가 값이 0인 경우 특수문자 "　" 리턴
afc.hogaComma = function(val) 
{
	if(val != 0)
	{
		var reg = /(^[+-]?\d+)(\d{3})/;   // 정규식
		val += '';  // 숫자를 문자열로 변환
		while (reg.test(val))
			val = val.replace(reg, '$1' + ',' + '$2');
		return val;	
	}
	else return '　';
	
	/*
	if(val != undefined) return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	else return '';
	*/
};

//콤마 삭제
afc.removeComma = function(val) 
{
	if(!val) return '';
	else return val.toString().replace(/,/g, '');
};

//더미 데이터의 길이만큼 '*'를 생성
afc.makeDummyString = function(length) 
{
	var dumStr = '';
	for(var i=0; i<length; i++) dumStr += '●';
	return dumStr;
};

//계좌정보에서 계좌정보에 셋팅할 텍스트를 생성
afc.makeAccText = function(accInfo, isGroup) 
{
	var regAcNo = accInfo['D1계좌번호'];
	var accText = '';
	if(theApp.systemInfo)
	{
		accText = theApp.systemInfo.makeAccNumber(regAcNo);
	}
	else accText = regAcNo.substring(0, 3) + "-" + regAcNo.substring(3, 5) + "-" + regAcNo.substring(5, regAcNo.length);
	return accText;
};

//랜덤컬러값을 생성
afc.getRandomColor = function()
{
	return "#"+((1<<24)*Math.random()|0).toString(16);
};

//DATE객체를 String으로 
afc.dateToString = function(date) 
{
	//return sprintf('%4d%02d%02d', date.getFullYear(), date.getMonth()+1, date.getDate());
	return date.getFullYear().zf(4) + (date.getMonth()+1).zf(2) + date.getDate().zf(2);
};

afc.formatDate = function(dateNum)
{
	if(!parseInt(dateNum, 10)) return '';
    dateNum+='';
    return dateNum.substring(0,4)+'/'+dateNum.substring(4,6)+'/'+dateNum.substring(6,8); 
};

afc.formatDate2 = function(dateNum)
{
	if(!parseInt(dateNum, 10)) return '';
    dateNum+='';
    return dateNum.substring(2,4)+'/'+dateNum.substring(4,6)+'/'+dateNum.substring(6,8); 
};

afc.formatMonth = function(monthNum)
{
    monthNum+='';
	return monthNum.substring(0,4)+'/'+monthNum.substring(4,6); 
};

afc.formatDateTime = function(datetimeNum)
{
    datetimeNum+='';
	return datetimeNum.substring(0,2)+'/'+datetimeNum.substring(2,4)+' '+datetimeNum.substring(4,6)+':'+datetimeNum.substring(6,8); 
};

afc.formatTime = function(time)
{
	if(!parseInt(time, 10)) return '';
	
	var map1 = { '31000000':'장마감',
			   '41000000':'시간외마감',
			   '51000000':'장전',
			   '61000000':'장중',
			   '71000000':'장후',
			   '81000000':'단일가',
			   '88000000':'단일가 마감',
			   '91000000':'BN 마감',
			   '91000001':'BN 마감',
			   '91000002':'BN 마감',
			   '91000003':'BN 마감',
			   '91000004':'BN 마감',
			   '91000005':'BN 마감',
			   '91000006':'BN 마감',
			   '91000007':'BN 마감',
			   '91000008':'단일가BN마감'};
	if(map1[time]) return map1[time];
	
	var map2 = ['3','4','5','6','7','8','9'];
    time+='';
	if(map2.indexOf(time.substring(0,1)) > -1) time = '0' + time;	

	return time.substring(0,2)+':'+time.substring(2,4); 
};

afc.formatHMS = function(time)
{
	if(!parseInt(time, 10)) return '';
	
	var map1 = { '31000000':'장마감',
			   '41000000':'시간외마감',
			   '51000000':'장전',
			   '61000000':'장중',
			   '71000000':'장후',
			   '81000000':'단일가 마감',
			   '88000000':'단일가 마감',
			   '91000000':'BN 마감',
			   '91000001':'BN 마감',
			   '91000002':'BN 마감',
			   '91000003':'BN 마감',
			   '91000004':'BN 마감',
			   '91000005':'BN 마감',
			   '91000006':'BN 마감',
			   '91000007':'BN 마감',
			   '91000008':'단일가BN마감'};
	if(map1[time]) return map1[time];
	
	var map2 = ['3','4','5','6','7','8','9'];
    time+='';
	if(map2.indexOf(time.substring(0,1)) > -1) time = '0' + time;

	return time.substring(0,2)+':'+time.substring(2,4)+':'+time.substring(4,6);
};

afc.formatTic = function(ticNum)
{
    ticNum+='';
	return ticNum.substring(0,2)+' '+ticNum.substring(2,4)+':'+ticNum.substring(4,6)+':'+ticNum.substring(6,8); 
};

afc.formatSecond = function(t)
{
    t+='';
	return t.substring(0,2)*3600+t.substring(2,4)*60+t.substring(4,6)*1; 
};

afc.switchButtonColor = function(comp)
{
	comp.removeClass('BT38_K00007');
	
    if(comp.getText() == 'ON')
	{
		comp.removeClass('BT92_K06102');
		comp.addClass('BT91_K06101');
	}
	else
	{
		comp.removeClass('BT91_K06101');
		comp.addClass('BT92_K06102');
	}
};

afc.returnAsIt = function(val)
{
	return val;
};

afc.abs = function(val)
{/*
	if(val == '') val = 0;
	else val *= 1;
	
	return val<0 ? val*-1 : val;*/
	val = val.toString();
	if(val.charAt(0) == '-') return val.substring(1);
	else return val;
};

afc.addPercent = function(val)
{
	return val + '%';
};

afc.absComma = function(val)
{
	return afc.addComma(afc.abs(val));
};

afc.intComma = function(val)
{
	return afc.addComma(parseInt(val));
};

afc.absPercent = function(val)
{
	return afc.abs(val) + '%';
};

afc.commaPercent = function(val)
{
	return afc.addComma(val) + '%';
};

afc.absCommaPercent = function(val)
{
	return afc.addComma(val) + '%';
};

afc.plusfloorPercent = function(val)
{
	var digits = Math.pow(10, 2);
	var retVal = parseFloat(parseInt(val*digits, 10)/digits).toFixed(2)+'%';
	//if(val > 0) retVal = ('+'+retVal);
	return retVal;
};

//소수점2자리 버림
afc.floor2 = function(value)
{
	var digits = Math.pow(10, 2);
	return afc.addComma(parseFloat(parseInt(value*digits, 10)/digits).toFixed(2));
};

//소수점2자리 반올림
afc.toFixed2 = function(value)
{
	return afc.addComma(value.toFixed(2));
};

//절대값 소수점2자리 버림
afc.absFloor2 = function(value)
{
	var digits = Math.pow(10, 2);
	value = afc.abs(value);
	return afc.addComma(parseFloat(parseInt(value*digits, 10)/digits).toFixed(2));
};

//절대값 소수점1자리 버림
afc.absFloor1 = function(value)
{
	var digits = Math.pow(10, 1);
	value = afc.abs(value);
	return afc.addComma(parseFloat(parseInt(value*digits, 10)/digits).toFixed(1));
};

//소수점2자리 버림 + '%'
afc.floor2Per = function(value)
{
	
	if(!value) return null;  // 임의 처리 오류 확인을 하기 위함. 2016.12.01
	
//value값이 0.28 등으로 들어올 때 0.29로 javascript에서 처리하기에 toFixed 함수 새로 생성	2016.11.21. 황청유
	//var digits = Math.pow(10, 2);
	//return parseFloat(parseInt(value*digits, 10)/digits).toFixed(2)+'%';
	return ( afc.toFixed(value, 2) + '%' );
};

//num 을 소숫점 fixed 자릿수 이하에서 버리는 함수
afc.toFixed = function (num, fixed) 
{
	if((num != undefined) && (fixed != undefined))
	{
		var numArr = num.toString().split('.');
		var decimal = '';
		if(numArr[1] != undefined)
		{
			var len = numArr[1].length;
			if(len > fixed)
			{
				return parseFloat(numArr[0]+"."+numArr[1].substring(0, fixed)).toFixed(fixed);	
			}
			return parseFloat(num).toFixed(fixed);
		}
		else
		{
			return parseFloat(num).toFixed(fixed);
		}
	}
	else 
	{
		var tmp = '0.';
		for(var i = 0; i < fixed; i++) tmp = tmp + "0";
		return tmp;
	}
	
	/*
	if(!num || !fixed) { // 임의 처리 오류 확인을 하기 위함. 216.12.01
		return null;
	}
	//값이 없을 경우 처리
	if(num*10 == 0) {
		var tmp = '0.';
		for(var i = 0; i < fixed; i++) tmp = tmp + "0";
		return tmp;
	}

    var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
    return num.toString().match(re)[0]; // <<- // 오류 사항 : TypeError:null is not an object (evaluation 'a.toString().match(d)'), ....
    */ 
};

afc.absFloor2Per = function(value) 
{
	var digits = Math.pow(10, 2);
	value = afc.abs(value);
	return parseFloat(parseInt(value*digits, 10)/digits).toFixed(2)+'%';
};

afc.sigaTotalAmount = function(value) 
{
	if(!value) return '0';
	else
	{
		value = value/1000000000;
		if(value < 0) return value.toFixed(2);
		else return afc.addComma(parseInt(value, 10));
	}
};

afc.capitalAmount = function(value) 
{
	if(!value) return '0';
	else
	{
		value = value/1000000;
		if(value < 0) return value.toFixed(2);
		else return afc.addComma(parseInt(value, 10));
	}
};

afc.addCommaIfFixed = function(value) 
{
	if(!value) return 0;
	else
	{
		if(value.toString().indexOf('.') > -1)
		{
			if(value<0) value *= -1;
			value = parseFloat(value)*1;
			return afc.addComma(value.toFixed(2));
		}
		else return afc.addComma(value);
	}
};

afc.absCommaIfFixed = function(value) 
{
	if(!value) return 0;
	else
	{
		if(value.toString().indexOf('.') > -1)
		{
			if(value<0) value *= -1;
			value = afc.absComma(parseFloat(value))*1;
			return value.toFixed(2);
		}
		else return afc.absComma(value);
	}
};

afc.oneHundredMillionAmount = function(value)
{
	if(!value) return '0';
	else
	{
		value = value/100000000;
		if(value < 0) return value.toFixed(2);
		else return afc.addComma(parseInt(value, 10));
	}
};

afc.isResize = true;

//------------------------------------------------------------------------------------------------------------------
Date.prototype.format = function(f) 
{
    if (!this.valueOf()) return " ";
    
    var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    var d = this;

    return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ms|ss|a\/p)/gi, function($1) 
    {
        switch ($1) 
        {
            case "yyyy": return d.getFullYear();
            case "yy": return (d.getFullYear() % 1000).zf(2);
            case "MM": return (d.getMonth() + 1).zf(2);
            case "dd": return d.getDate().zf(2);
            case "E": return weekName[d.getDay()];
            case "HH": return d.getHours().zf(2);
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
            case "mm": return d.getMinutes().zf(2);
			case "ms": return d.getMilliseconds().zf(3);
            case "ss": return d.getSeconds().zf(2);
            case "a/p": return d.getHours() < 12 ? "오전" : "오후";
            default: return $1;
        }
    });
};

String.prototype.str = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".str(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};

String.prototype.replaceAt = function(inx, searchVal, newVal)
{
	inx = this.indexOf(searchVal, inx);
	
	if(inx<0) return this;
	else return this.substr(0, inx) + newVal + this.substr(inx + searchVal.length);
};


//------------------------------------------------------------------------------------------------------------------

	
window.onerror = function(message, url, lineNumber, colNumber, error)
{

	if(!lineNumber || !url) return;

	//if(window.theApp) theApp.onError(message, url, lineNumber);
	//if(window.theApp) theApp.onError.apply(theApp, arguments);
	if(window.theApp) theApp.onError(message, url, lineNumber, colNumber, error);
};

window.onunhandledrejection = function(error)
{
	if(error.reason && error.reason.stack)
	{
		error.stack = error.reason.stack;
		const match = error.reason.stack.match(/(\w+:\/\/[\s\S]*?):(\d*):(\d*)/),
			  message = error.reason.message;
			  
		let url, lineNumber, colNumber;
		if(match)
		{
			url = match[1];
			lineNumber = match[2];
			colNumber = match[3];
		}
		
		window.onerror(message, url, lineNumber, colNumber, error);
	}
};

afc.loadCSSIfNotLoaded = function() 
{
    var ss = document.styleSheets;
	var headEle = document.getElementsByTagName("head")[0];
	
	var ssLen = ss.length;
    for(var i=0; i<ssLen; i++) 
	{
		if(ss[i].cssRules.length==0)
		{
			ss[i].disabled = true;
			
			var link = document.createElement("link");
			link.rel = "stylesheet";
			link.href = ss[i].href;
			headEle.appendChild(link);
		}
    }
};

//------------------------------------------------------------------------------------------------------------------
// function call


	afc.deviceCheck();
	afc.browserCheck();

	if(!window.afc_) afc.makeMeta();


	//다음 주석은 지우지 말 것. 화면 개발 시점에 필요한 정보
	console.log(navigator.userAgent);
	console.log('devicePixelRatio : ' + window.devicePixelRatio);
	console.log('screen : ' + screen.width + 'px, ' + screen.height+'px');
	//------------------------------------------------------------------------------------------------------------------

	afc.setIndexScriptMap();

	afc.beginTimeCheck('---- end of afc ----');






