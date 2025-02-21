               
/**
 * @author asoocool
 */

class ALayout extends AComponent
{
	constructor()
	{
		super()
	
	}

    

}

window.ALayout = ALayout

ALayout.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

	
};


ALayout.prototype.setParent = function(parent)
{
	AComponent.prototype.setParent.call(this, parent);
	
	var children = this.getAllLayoutComps();
	
	for(var i=0; i<children.length; i++)
		children[i].setParent(parent);
};


ALayout.prototype.getAllLayoutComps = function()
{
	return [];
};

ALayout.prototype.eachChild = function(callback, isReverse)
{

};

ALayout.prototype.updatePosition = function(pWidth, pHeight)
{
	AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	
	this.eachChild(function(acomp, inx)
	{
		acomp.updatePosition();
	});
};

ALayout.prototype.onContextAvailable = function()
{
	this.eachChild(function(acomp, inx)
	{
		if(acomp.onContextAvailable) acomp.onContextAvailable();
	});
};


ALayout.prototype.removeFromView = function(onlyRelease)
{
	this.eachChild(function(acomp, inx)
	{
		acomp.removeFromView(onlyRelease);
	});

	AComponent.prototype.removeFromView.call(this, onlyRelease);
};

ALayout.prototype._changeCompIdPrefix = function() 
{
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

ALayout.prototype.getMappingCount = function()
{
	//return this.getAllLayoutComps().length;

    let tot = 0

	this.getAllLayoutComps().forEach((child)=>{
		tot += child.getMappingCount()
	})

	return tot    


};

ALayout.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	var keyVal, children = this.getAllLayoutComps(), child;
	for(var i=0; i<children.length; i++)
	{
		child = children[i];
		
		keyVal = keyArr[i];
		if(keyVal) child.getQueryData(dataArr, [keyVal], queryData);
	}
};

ALayout.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	let children = this.getAllLayoutComps(), child, i, cnt;
	for(i=0; i<children.length; i++)
	{
		child = children[i];
		
		//하위 컴포넌트가 그리드인 경우 데이터가 변경되므로 매번 처음 인덱스값으로 변경
		//dataArr 가 없는 경우도 있으므로 예외처리한다.
		if(dataArr) ADataMask.setQueryData(dataArr[0], keyArr, queryData);
		
		if(child.mappingType==3) child.updateChildMappingComp(dataArr, queryData);
		else 
		{
            cnt = child.getMappingCount()
            child.setQueryData(dataArr, keyArr.slice(i, i+cnt), queryData);
		}
	}
};

// 컴포넌트 내부에 드랍 가능여부 리턴
ALayout.prototype.getDroppable = function()
{
	//return true;
	//_childSelect 가 세팅되어있지 않거나 0인 경우에만 드랍가능
	return !this._childSelect;
};

ALayout.prototype._callSubActiveEvent = function(funcName, isFirst) 
{
	this.eachChild(function(acomp, inx)
	{
		if(acomp._callSubActiveEvent) acomp._callSubActiveEvent(funcName, isFirst);
	});

};

ALayout.prototype.reset = function()
{
	this.eachChild(function(acomp)
	{
		if(acomp.reset) acomp.reset();
	});
};

//컴포넌트에 데이터를 세팅하는 함수
ALayout.prototype.setData = function(data)
{
	var children = this.getAllLayoutComps();
	if(Object.prototype.toString.call(data) == '[object Array]')
	{
		var len = Math.min(children.length, data.length);
		for(var i=0; i<len; i++)
		{
			if(data[i] != undefined) children[i].setData(data[i]);
		}
	}
	else if(Object.prototype.toString.call(data) == '[object Object]')
	{
		var keys = Object.keys(data);
		var len = Math.min(children.length, keys.length);
		for(var i=0; i<len; i++)
		{
			if(data[keys[i]] != undefined) children[i].setData(data[keys[i]]);
		}
	}
};

//컴포넌트의 데이터를 얻어오는 함수
ALayout.prototype.getData = function()
{
	var arr = [];
	var children = this.getAllLayoutComps();
	children.forEach(function(comp)
	{
		arr.push(comp.getData());
	});
	
	return arr;
};

ALayout.prototype._applyLoadedQuery = function()
{
	AComponent.prototype._applyLoadedQuery.call(this);
	
	this.eachChild(function(acomp, inx)
	{
		acomp._applyLoadedQuery();
	});
};
