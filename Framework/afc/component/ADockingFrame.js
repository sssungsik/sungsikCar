(async function() {

await afc.import("Framework/afc/component/AFrameWnd.js");


/**
Constructor
Do not call Function in Constructor.
*/
ADockingFrame = class ADockingFrame extends AFrameWnd
{
	constructor(containerId)
	{
		super(containerId)
		
		this.dockedCntr = null;
		this.lastDockedCntr = null;

		this.titleHeight = 22;
	}

	

}

//window.ADockingFrame = ADockingFrame

//-------------------------------------------------------------------------
//	static area
//
//
//	framePosition:
//	{
//		"ProjectFrame" : { dockedCntrId: "_1_0", dockedIndex: 0, close: 1 },	//2 is hide
//	}
//
//	오픈되어져 있는 프레임 목록이 아님!
//	지금까지 열려졌던 프레임들의 포지션 정보 목록
ADockingFrame.framePosition = null;

ADockingFrame.getFramePosition = function(frmId) { return frmId?ADockingFrame.framePosition[frmId]:ADockingFrame.framePosition; };
ADockingFrame.setFramePosition = function(frmId, posInfo) { ADockingFrame.framePosition[frmId] = posInfo; };

ADockingFrame.setPosValue = function(frmId, key, value) 
{
	var posInfo = ADockingFrame.framePosition[frmId];
	if(posInfo) posInfo[key] = value;
};

ADockingFrame.getPosValue = function(frmId, key) 
{
	var posInfo = ADockingFrame.framePosition[frmId];
	if(posInfo) return posInfo[key];
	else return null;
};


ADockingFrame.readFramePosition = function(defPos) 
{
	let strData = null, posInfo = null;

	if(window.localStorage)
		strData = window.localStorage.getItem('frame_position');
	
	if(strData) 
	{
		try
		{
			posInfo = JSON.parse(strData);
		}
		catch(err) {}
	}
	
	//파일이 없거나 오류로 셋팅이 안되었으면 
	if(!posInfo)
	{
		if(!defPos) defPos = {};
		
		ADockingFrame.framePosition = defPos;
	}
	else ADockingFrame.framePosition = posInfo;
};

ADockingFrame.writeFramePosition = function() 
{
	var cntr, p, frmId;
	//오픈되어져 있는 전체 컨테이너 중에서
	for(p in AContainer.openContainers)
	{
		cntr = AContainer.openContainers[p];
		
		//도킹 프레임만 정보를 저장한다.
		if(cntr instanceof ADockingFrame)
		{
			frmId = cntr.getContainerId();
			
			//이미 닫혀진 상태인 frame 은 값을 갱신하지 않고 마지막으로 셋팅되어져 있는 값으로 파일로 저장한다.
			//hide 상태 포함, 1,2
			if(ADockingFrame.getPosValue(frmId, 'close')) continue;
			
			//열려져 있는 프레임들의 위치 정보를 갱신
			ADockingFrame.setFramePosition(frmId, cntr.getPositionInfo());
		}
	}

	if(window.localStorage)
		window.localStorage.setItem('frame_position', JSON.stringify(ADockingFrame.framePosition, undefined, 4));
	
	//Cmd.WriteFileFromString(path, JSON.stringify(ADockingFrame.framePosition, undefined, 4));
};

//-------------------------------------------------------------------------




ADockingFrame.prototype.init = function(context)
{
	/*
	this.setOption(
	{
		inParent: true,
		
	}, true);
	*/

	AFrameWnd.prototype.init.call(this, context);
	
};

ADockingFrame.prototype._makeTitle = async function()
{
    await AFrameWnd.prototype._makeTitle.call(this);

	this.minBtn.hide();
	this.maxBtn.hide();
};

//오버라이드
ADockingFrame.prototype._onMinBtnClick = function(acomp, info)
{
	var thisObj = this;
	setTimeout(function()
	{
		thisObj.hide();
		
	}, 0);
};


ADockingFrame.prototype.open = async function(viewUrl, parent, title, left, top, width, height)
{
	await AFrameWnd.prototype.open.call(this, viewUrl, parent, title, left, top, width, height);
	
	ADockingFrame.setPosValue(this.getContainerId(), 'close', 0);
};

ADockingFrame.prototype.close = function(result)
{
	var frmId = this.getContainerId();

	//undockFrame 함수 내부에서 사이즈 정보를 저장한다.
	if(this.dockedCntr) this.dockedCntr.undockFrame(this, 0, 0, 0, 0);	//어차피 닫힐 창 이므로 0,0,0,0 으로 언독 후에 닫는다.
	else ADockingFrame.setFramePosition(frmId, this.getPositionInfo());
	
	ADockingFrame.setPosValue(frmId, 'close', 1);
	
	AFrameWnd.prototype.close.call(this, result);
};

ADockingFrame.prototype.show = function(delay)
{
	AFrameWnd.prototype.show.call(this, delay);

	ADockingFrame.setPosValue(this.getContainerId(), 'close', 0);
};

ADockingFrame.prototype.hide = function()
{
	var frmId = this.getContainerId();

	//undockFrame 함수 내부에서 사이즈 정보를 저장한다.
	if(this.dockedCntr) this.dockedCntr.undockFrame(this, 0, 0);	//도킹 상태의 사이즈로 언독 시킨다. 사이즈 값을 주지 않으면 자신의 현재 사이즈로 언독된다.
	else ADockingFrame.setFramePosition(frmId, this.getPositionInfo());

	ADockingFrame.setPosValue(frmId, 'close', 2);

	AFrameWnd.prototype.hide.call(this);
};

ADockingFrame.prototype.onCreateDone = function()
{
	this.setDragOption('scope', '_docking_drag_drop_');
	
};

ADockingFrame.prototype.onDragStart = function(event, ui)
{
    AFrameWnd.prototype.onDragStart.call(this, event, ui);

    theApp.getMainContainer().dropPosWnd.show();
    theApp.getMainContainer().dropPosWnd.onResize();
};

ADockingFrame.prototype.onDragStop = function(event, ui)
{
    AFrameWnd.prototype.onDragStop.call(this, event, ui);

    theApp.getMainContainer().dropPosWnd.hide();
};

ADockingFrame.prototype.selectIfDocked = function()
{
	if(this.dockedCntr)
	{
		var tabPanel = this.getParent().getParent();
		tabPanel.tabBar.selectTabById(this.getContainerId());
	}
};

ADockingFrame.prototype.getPositionInfo = function()
{
	var pos = this.getPos();
	var obj = 
	{
		x: pos.left, y: pos.top,
		width: this.getWidth(), height: this.getHeight()
	};
	
	if(this.dockedCntr)
	{
		var inx = this.dockedCntr.indexOfPanel(this.getParent().getParent());
	
		obj.dockedCntrId = this.dockedCntr.getContainerId();
		obj.dockedIndex = inx;
	}
	
	return obj;
};

ADockingFrame.prototype.applyPositionInfo = function(obj)
{
	if(obj.dockedCntrId)
	{
		var cntr = AContainer.findOpenContainer(obj.dockedCntrId);
		
		if(cntr) 
		{
			cntr.dockFrame(this, obj.dockedIndex, 0);
			return;
		}
	}
	
	this.move(obj.x, obj.y);
	this.setWidth(obj.width);
	this.setHeight(obj.height);
};

})();