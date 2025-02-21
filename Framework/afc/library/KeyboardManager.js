
//----------------------------------------------------------------------------------
//	Keyboard 관련
//

var KeyboardManager = 
{
	//keyboard show 시에 textfield 위치 계산용
	displayHeight: 0,
	topWnd: null,
	wndMove: 0,
	oriPos: null,
	resizeWebview: true,
	showCount: 0
};

KeyboardManager.getFocus = function(doc)
{
	if(!doc) return;
   
	var $focus = $(doc.activeElement);
	if($focus[0].tagName == 'IFRAME')
	{
		$focus = KeyboardManager.getFocus($focus[0].contentDocument);
	}

	return $focus;
};

KeyboardManager.onKeyBoardShow = function(displayHeight, keyboardHeight, focusComp)
{
	var focusEle;
	if(focusComp) focusEle = focusComp.getElement();
	else {
		//var $focus = $(':focus');
		//var $focus = $(document.activeElement);
		var $focus = KeyboardManager.getFocus(document);
		if(!$focus) $focus = $(':focus');

		if($focus.length==0) return;
		
		focusEle = $focus[0];
		focusComp = focusEle.acomp;
	}
	
	//textfield option
	//키보드 매니저 사용여부에 대한 옵션
	//외부 웹 오픈되는 경우 포커스된 엘리먼트가 컴포넌트가 아닌 경우가 있어서 acomp 존재여부도 체크 
	if(!focusComp || !focusComp.option.isEnableKM) return;
	
	//키패드가 떠 있는 상태에서 보안키패드를 띄워 show 처리를 하는 경우
	//보안키패드에서 show가 먼저 호출되고 키패드에서 hide가 나중에 호출되는 경우의 문제 해결을 위한 카운트
	this.showCount++;
	
	KeyboardManager.displayHeight = displayHeight;
	var topWnd = KeyboardManager.topWnd = focusComp.getContainer();//AWindow.getTopWindow();
	
	if(topWnd)
	{
		var minMargin = 0,
			fTopOffset = focusComp.$ele.offset().top;
			
		// 윈도우의 높이가 100% 인 경우에는 scrlMaker를 생성하여 추가하여 처리한다.
		if(topWnd.element.style['height'] == '100%')
		{
			_add_scrlMaker(topWnd);
			
			// topWnd를 초기화하여 이후의 처리를(onKeyBoardHide, inputScrollToCenter)
			// scrlMaker 가 있을 때의 처리와 동일하게 한다. 그래서 null 로 셋팅한다.
			KeyboardManager.topWnd = null;
			
			//스크롤메이커를 생성하였으므로 컴포넌트가 안보이는 상태인 경우 scrollTop 을 변경해준다.
			if(fTopOffset < minMargin)
			{
				topWnd.element.scrollTop = topWnd.getPos().top + (-1 * fTopOffset) + minMargin;
			}
		}
		else if(!KeyboardManager.oriPos)
		{
			KeyboardManager.oriPos = topWnd.getPos();
			
			var eleStyle = topWnd.element.style;
			KeyboardManager.oriPosInfo = {
				top: eleStyle.top,
				right: eleStyle.right,
				bottom: eleStyle.bottom,
				left: eleStyle.left
			};
			
			// % to px 처리 관련 함수 호출(모바일웹)
			if(KeyboardManager.resizeWebview)
				KeyboardManager.replaceHeight(KeyboardManager.topWnd, displayHeight + keyboardHeight);
			
			//컴포넌트가 안보이는 상태인 경우 컨테이너의 top 을 변경해준다.
			if(fTopOffset < minMargin)
			{
				topWnd.$ele.css('top', topWnd.getPos().top + (-1 * fTopOffset) + minMargin);
			}
		}
	}
	else
	{
		//var cntr = theApp.getMainContainer();
		//if(!cntr) cntr = ANavigator.getActiveNaviPage();
		
		var cntr = AContainer.getDefaultParent();
		
		// 함수 내부에서 scrlMaker 없으면 추가한다.
		_add_scrlMaker(cntr);
	}
	
	//textfield 위치 계산
	
	//adjustResize
	if(KeyboardManager.resizeWebview) focusEle.scrollIntoView(false);
	
	//adjustPan
	else KeyboardManager.inputScrollToCenter(focusEle, true);
	
	//focusEle.classList.add('_INPUT_FOCUS'); //$focus.addClass('_INPUT_FOCUS');
	
	function _add_scrlMaker(_cntr)
	{
		if(KeyboardManager.resizeWebview)
		{
			KeyboardManager.container = _cntr;

			// % to px 처리 관련 함수 호출(모바일웹)
			KeyboardManager.replaceHeight(_cntr, displayHeight + keyboardHeight);
		}
		else
		{
			var _scrlMaker = document.getElementById('scroll-maker');
			
			if(_scrlMaker) _scrlMaker = $(_scrlMaker);
			else
			{
				_scrlMaker = $('<div id="scroll-maker"></div>');
				_cntr.$ele.append(_scrlMaker);

				KeyboardManager.container = _cntr;
				KeyboardManager.prevOverflow = _cntr.$ele.css('overflow');
				_cntr.$ele.css('overflow', 'auto');
			}

			_scrlMaker.css({position:'absolute', width:'100%', height:keyboardHeight+'px', bottom:(-1*keyboardHeight)+'px'});
		}
		
	}
};

KeyboardManager.onKeyBoardHide = function()
{
	//키패드가 떠 있는 상태에서 보안키패드를 띄워 show 처리를 하는 경우
	//보안키패드에서 show가 먼저 호출되고 키패드에서 hide가 나중에 호출되는 경우의 문제 해결을 위한 카운트
	--this.showCount;
	if(this.showCount != 0) {
		if(this.showCount < 0) this.showCount = 0;
		return;
	}
	
	//var $focus = $(':focus');
	//var $focus = $(document.activeElement);
	
	var $focus = KeyboardManager.getFocus(document);
	if(!$focus) $focus = $(':focus');
	
	//$focus.removeClass('_INPUT_FOCUS');
	
	KeyboardManager.displayHeight = 0;
	
	var topWnd = KeyboardManager.topWnd;
	
	if(topWnd)
	{
		if(topWnd.$ele)
		{
			//윈도우의 기존위치값이 bottom 으로 세팅되어 있던 경우에 기존 위치로 되돌아가지 않는 버그 수정
			//** resize가 되기전의 top pos 면 기존 위치로 돌아갈 것 같으나 기존값으로 되돌리는 것이 더 바람직한 것 같아 아래 내용으로 처리
			//topWnd.setPos(KeyboardManager.oriPos);
			topWnd.$ele.css(KeyboardManager.oriPosInfo);
			
			if(KeyboardManager.resizeWebview) KeyboardManager.restoreHeight(topWnd);
		}
		KeyboardManager.wndMove = 0;
		KeyboardManager.topWnd = KeyboardManager.oriPos = KeyboardManager.oriPosInfo = null;
	}
	else
	{
		// container는 height가 100%인 윈도우와 그외 컨테이너이다.
		var _cntr = KeyboardManager.container;
		if(_cntr && _cntr.$ele)
		{
			// % to px 바꾸기 전 값으로 변경하는 함수 호출(모바일웹)
			if(KeyboardManager.resizeWebview) KeyboardManager.restoreHeight(_cntr);
				
			// container에 이전 overflow 값 세팅
			if(KeyboardManager.prevOverflow) _cntr.$ele.css('overflow', KeyboardManager.prevOverflow);
		}
		
		// container, prevOverflow, oriH 초기화
		KeyboardManager.container = KeyboardManager.prevOverflow = null;
		
		if(!KeyboardManager.resizeWebview) {
		
			//스크롤메이커가 사라지면서 화면의 스크롤 위치가 변경될 때 터치위치 컴포넌트의 클릭 이벤트 방지
			var win = new AWindow();
			win.setOption({ isModal: false });
			win.openFull();
		
			$('#scroll-maker').remove();
			
			//스크롤메이커가 사라지면서 화면의 스크롤 위치가 변경될 때 터치위치 컴포넌트의 클릭 이벤트 방지
			setTimeout(function(){ win.close(); });
		}
	}
	
	KeyboardManager.oriH = null;

	$focus.blur();
};

KeyboardManager.replaceHeight = function(cntr, fullH)
{
	var cntrH = cntr.element.style['height'];
	if(cntrH.indexOf('%') > -1)
	{
		KeyboardManager.oriH = cntrH;
		cntr.setHeight(parseFloat(cntrH)/100 * fullH);
	}
};

KeyboardManager.restoreHeight = function(cntr)
{
	if(KeyboardManager.oriH) cntr.setHeight(KeyboardManager.oriH);
	KeyboardManager.oriH = 0;
};

KeyboardManager.inputScrollToCenter = function(input, isAppear)
{
	//중복 처리 방지, onKeyBoardShow 와 input focus 이벤트시 -> onKeyBoardShow 만 처리
	if(input && KeyboardManager.displayHeight>0)
	{
		var topWnd = KeyboardManager.topWnd;
		var box = input.getBoundingClientRect();
		var move = box.top - (KeyboardManager.displayHeight/2);
		
		if(topWnd && topWnd.moveY)
		{
			//윈도우가 밑으로 내려가는 경우는 없도록 한다.
			KeyboardManager.wndMove += move;
			if(KeyboardManager.wndMove>0)
			{
				// 계산한 윈도우의 하단 부분이 키보드와 떨어지지 않게 한다.
				var plusH = KeyboardManager.displayHeight - (KeyboardManager.oriPos.top-KeyboardManager.wndMove + topWnd.getHeight());
				if(plusH > 0)
				{
					KeyboardManager.wndMove -= plusH;
					plusH = 0;
				}
				
				if(isAppear) topWnd.moveY(KeyboardManager.oriPos.top-KeyboardManager.wndMove);
				else
				{
					setTimeout(function() { 
						if(KeyboardManager.oriPos)
							topWnd.moveY(KeyboardManager.oriPos.top-KeyboardManager.wndMove);
					}, 1);
				}
			}
		}
		else
		{
			var _cntr = KeyboardManager.container;
			if(_cntr && _cntr.isValid()) 
			{
				if(isAppear) _cntr.element.scrollTop += move;
				else
				{
					//키보드가 보여지고 있을 때 
					//포커스 이벤트시 스크롤을 시키면 다른 곳에 포커스가 생기는 버그 때문에
					setTimeout(function() { _cntr.element.scrollTop += move; }, 1);
				}
			}
			
		}
	}
};