function TabKeyController()
{
	//depth가 있는 맵. 기본적으로 이곳에 쌓임.
	this.componentMap = 
	[
		
	];
	
	//탭인덱스를 빠르게 검색하기 위한 배열
	this.tabIndexArr =
	[
	
	];
}

TabKeyController.prototype.init = function(rootView)
{
	this.rootView = rootView;
	this.rootView.element.setAttribute('tabindex', -1);
	this.rootView.element.addEventListener('keydown', this._keydown);
};

TabKeyController.prototype.focusOnInit = function(flag, noActive)
{
	if(flag)
	{
		this.makeTabIndexArr();
		var nextComp = this._getFirstComp();
		if(nextComp) nextComp.setFocus(noActive);
		else
		{
			if(this.rootView && this.rootView.isValid())
			{	
				this.rootView.enableActiveFocus(true);
				AComponent.setFocusComp(this.rootView, noActive);
			}
		}
	}
};

//key down 이벤트
TabKeyController.prototype._keydown = function(e)
{
	var acont = this.acomp.getContainer();
	if(!acont) return;

	if(e.keyCode == 9 && acont.tabKey)
	{
		TabKeyController.nextFocus(AComponent.getFocusComp(), e);
	}
};

//다음 탭이 가능한 컴포넌트를 찾음. 
//없으면 탭이 가능한 첫번째 컴포넌트로. (주로 포커스가 rootView에 있을경우 발생한다.)
TabKeyController.prototype.findNextTab = function(comp, isShift)
{
	if(this.componentMap.length == 0) return;
	
	if(!this._isMakeArr) this.makeTabIndexArr();
	
	var nowIndex = this._getCompIndex(comp);
	
	if(nowIndex != null)
	{
		if(isShift)
		{
			return this._getPrevCompByIndex(nowIndex, nowIndex-1);
		}
		else
		{
			return this._getNextCompByIndex(nowIndex, nowIndex+1);
		}
	}
	else
	{
		return this._getFirstComp();
	}
};



//현재 컴포넌트의 순서를 찾음.
TabKeyController.prototype._getCompIndex = function(comp)
{
	if(!comp) return null;
	
	for(var i=0;i<this.tabIndexArr.length;i++)
	{
		if(this.tabIndexArr[i] == comp)
		{
			return i;
		}
	}
	return null;
};

//다음.
TabKeyController.prototype._getNextCompByIndex = function(start, inx)
{
	if(start == inx) return this.tabIndexArr[start];

	if(inx < this.tabIndexArr.length)
	{
		if(this._checkTabValieComp(this.tabIndexArr[inx])) return this.tabIndexArr[inx];
		else return this._getNextCompByIndex(start, inx+1);
	}
	else
	{
		return this._getNextCompByIndex(start, 0);
	}
};

//이전
TabKeyController.prototype._getPrevCompByIndex = function(start, inx)
{
	if(start == inx) return this.tabIndexArr[start];
	
	if(inx < 0)
	{
		return this._getPrevCompByIndex(start, this.tabIndexArr.length-1);
	}
	else
	{
		if(this._checkTabValieComp(this.tabIndexArr[inx])) return this.tabIndexArr[inx];
		else return this._getPrevCompByIndex(start, inx-1);
	}
};

//탭이 가능한 첫번쨰 컴포넌트를 리턴한다.
TabKeyController.prototype._getFirstComp = function()
{
	for(var i=0;i<this.tabIndexArr.length;i++)
	{
		if(this._checkTabValieComp(this.tabIndexArr[i])) return this.tabIndexArr[i];
	}
};

//뷰에서 호출함. 탭키컨트롤러 배열로 컴포넌트맵을 만듬.
TabKeyController.prototype.addCompMap = function(acomp, owner)
{
	this._isMakeArr = false;
	var inx = acomp.getAttr('tabindex'), map;
	
	if(owner)
	{
		if(owner.ownerTabMap) map = owner.ownerTabMap;
		else 
		{
			owner.ownerTabMap = [];
			map = owner.ownerTabMap;
		}
	}
	
	if(!map) map = this.componentMap;
	
	if(inx == 0 || inx == null)
	{
		this.pushCompIntoMap(map, acomp);
	}
	else
	{
		if(map.length == 0) this.pushCompIntoMap(map, acomp);
		else
		{
			var chk = false;
			for(var i in map)
			{
				if(!map[i].comp.element.getAttribute('tabindex') || parseInt(inx) < parseInt(map[i].comp.element.getAttribute('tabindex')))
				{
					map.splice(i, false, {comp:acomp, childArr:[]});
					chk = true;
					break;
				}
			}
			if(!chk) this.pushCompIntoMap(map, acomp);
		}	
	}
};

//컴포넌트를 추가할때 여러 예외처리를 위해서 따로 함수로 뺌
//예외 사항이 생기면 예외처리 부분에 주석을 달아놓기로함.
TabKeyController.prototype.pushCompIntoMap = function(map, acomp)
{
	//예외1 캘린더피커
	//캘린더피커는 내부적으로 아이템을 가지고 있는데
	//이 아이템에 탭인덱스 지정이 불가능하므로 아이템 자체는 탭 배열에 넣지않고 있다가
	//캘린더피커 자체가 들어가는 시점에서 텍스트 필드를 대신 넣어준다.
	if(acomp.parent && acomp.parent.className == "ACalendarPickerItem") return;
	if(acomp.baseName == "ACalendarPicker") 
	{
		acomp.childComp.textfield.setAttr('tabindex', acomp.getAttr('tabindex'));
		acomp = acomp.childComp.textfield;
	}

	//////////////////////////////////////////////////////////////////////////
	map.push({comp:acomp, childArr:[]});
};
//동적로드된 경우에는 따로 모아두는데
//모아 뒀던 탭인덱스 배열을 세이브하는 함수.
TabKeyController.prototype.saveOwnerMap = function(owner)
{
	if(owner.ownerTabMap)
	{
		var result = this._setOwnerChild(owner, this.componentMap);
		if(!result) this.componentMap.push({comp: owner, childArr: owner.ownerTabMap.slice()});

		delete owner.ownerTabMap;
	}
};

TabKeyController.prototype._setOwnerChild = function(owner, targetArr)
{
	for(var i=0;i<targetArr.length;i++)
	{
		if(targetArr[i].comp == owner) 
		{
			targetArr[i].childArr = targetArr[i].childArr.concat(owner.ownerTabMap.slice());
			let aIndex, bIndex;
			targetArr[i].childArr.sort((a, b) => {
				aIndex = a.comp.getAttr('tabindex');
				bIndex = b.comp.getAttr('tabindex');
				if(aIndex == null && bIndex == null) return 0; //둘 다 tabindex가 없는 경우 순서 유지
				if(bIndex == null) return -1;
				if(aIndex == null) return 1;
				return parseInt(aIndex) - parseInt(bIndex);
			});
			return true;
		}
		if(targetArr[i].childArr.length > 0) 
		{
			var res = this._setOwnerChild(owner, targetArr[i].childArr);
			if(res) return res;
		}
	}
};

//트리탐색은 for문이 겹쳐서 매번 탭마다 부하를 줄이기 위해
//빠른탐색 배열을 최초1회 만들어둔다.
TabKeyController.prototype.makeTabIndexArr = function()
{	
	this.tabIndexArr = [];
	this._makeArray(this.componentMap);
	this._isMakeArr = true;
};

TabKeyController.prototype._makeArray = function(arr)
{
	for(var i=0;i<arr.length;i++)
	{
		if(arr[i].childArr.length > 0) this._makeArray(arr[i].childArr);
		else this.tabIndexArr.push(arr[i].comp);
	}
};

//탭키이동이 가능한 컴포넌트인지 검사한다.
// tabindex가 -1이 아님
// 숨겨진 상태가 아님.
// enable false 상태가 아님.
// 탭키가 가능한 컴포넌트인가?
TabKeyController.prototype._checkTabValieComp = function(comp)
{
	if(!comp.isValid()) return false;
	
	if(comp.getAttr('tabindex') == -1) return false;
	
	if(!comp.isEnable) return false;
	
	if(!comp.isShow()) return false;
	
	if(!comp.isTabable) return false;

	//readonly 제외.
	//if(comp.getAttr('readonly') == 'readonly') return false;
	
	return true;
};

TabKeyController.nextFocus = function(acomp, e)
{
	if(!acomp) return;
	var acont = acomp.getContainer();
	if(!acont) return;
	var nextComp = acont.tabKey.findNextTab(acomp, e.shiftKey);
	if(nextComp) nextComp.setFocus(); 
	e.preventDefault();
	e.stopPropagation();
}

