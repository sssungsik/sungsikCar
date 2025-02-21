

function BackupManager()
{
	this.headStack = null;
	this.tailStack = null;
	this.maxRow = 50;
	this.restoreCount = 20;
	
	this.itemHeight = 0;
	this.itemContentCnt = 0;
	this.$contentEle = null;
	this.scrollEle = null;
	
	//백업되면서 변경된 스크롤 위치 복원
	this.backupScroll = 0;
	this.delegator = null;
}

/*
BackupManager.managerStack = [];

BackupManager.clearManagerStack = function()
{
	var len = BackupManager.managerStack.length;
	
	for(var i=0; i<len; i++)
		BackupManager.managerStack[i].destroy();
	
	BackupManager.managerStack = [];
};
*/

BackupManager.prototype.create = function(delegator, maxRow, restoreCount)
{
	this.delegator = delegator;
	
	//BackupManager.managerStack.push(this);
	
	if(maxRow!=undefined) this.maxRow = maxRow;
	if(restoreCount!=undefined) this.restoreCount = restoreCount;
	
	if(this.maxRow/this.restoreCount < 3) 
	{
		var mod = this.maxRow % this.restoreCount;
		if(mod<10) mod = 10;
		this.maxRow = this.restoreCount * 2 + mod;
	}
	
	//this.headStack = $('<div style="display:none;"></div>');
	//$('body').append(this.headStack);
	
	//this.tailStack = $('<div style="display:none;"></div>');
	//$('body').append(this.tailStack);
	
	this.headStack = $('<div></div>');
	this.tailStack = $('<div></div>');
};

BackupManager.prototype.destroy = function()
{
	this.headStack.remove();
	this.headStack = null;

	this.tailStack.remove();
	this.tailStack = null;
};

BackupManager.prototype.clearAll = function()
{
	this.clearHead();
	this.clearTail();
};

BackupManager.prototype.setItemHeight = function(itemHeight)
{

	this.itemHeight = itemHeight;
//alert(this.itemHeight);	
};

BackupManager.prototype.setBackupInfo = function(itemHeight, itemContentCnt, scrollEle, $contentEle)
{
	this.itemHeight = itemHeight;
	this.itemContentCnt = itemContentCnt;
	this.scrollEle = scrollEle;
	this.$contentEle = $contentEle;
};

BackupManager.prototype._minusBackupScroll = function(count)
{
	//5.1 이후 버전에서는 scroll bottom 시점에 
	//backup scroll 을 실행하면 오작동 한다.
	//그래서 작동하지 않도록 this.backupScroll 값을 변경시키지 않는다. 
	
	if(!afc.isIos && afc.andVer>5.1) return;
	
	this.backupScroll -= this.itemHeight*count;
};

BackupManager.prototype._plusBackupScroll = function(scrollVal)
{
	this.backupScroll += scrollVal;
};


//about head
//상단 아이템을 백업한다.
BackupManager.prototype.backupHeadPre = function(row) { this.headStack.prepend(row); };
BackupManager.prototype.backupHead = function(row) { this.headStack.append(row); };
BackupManager.prototype.clearHead = function() { this.headStack.children().remove(); };
BackupManager.prototype.restoreHead = function() { return this.headStack.children().last(); };
BackupManager.prototype.getHeadCount = function() { return this.headStack.children().length; };
BackupManager.prototype.getHRestoreCount = function() { return Math.min(this.headStack.children().length, this.restoreCount); };


//about tail
//아단 아이템을 백업한다.
BackupManager.prototype.backupTailPre = function(row) { this.tailStack.prepend(row); };
BackupManager.prototype.backupTail = function(row) { this.tailStack.append(row); };
BackupManager.prototype.clearTail = function() { this.tailStack.children().remove(); };
BackupManager.prototype.restoreTail = function() { return this.tailStack.children().last(); };
BackupManager.prototype.getTailCount = function() { return this.tailStack.children().length; };
BackupManager.prototype.getTRestoreCount = function() { return Math.min(this.tailStack.children().length, this.restoreCount); };


//백업되거나 복원되면서 변경된 스크롤 포지션을 복원한다. 
BackupManager.prototype.applyBackupScroll = function()
{
	if(this.backupScroll!=0)
	{
		var retVal = this.backupScroll;
		
		this.backupScroll = 0;
		
		//여러 백업 매니저가 하나의 this.scrollEle 바라 볼 경우, 여러번 추가되므로
		//하나의 백업 매니저에만 셋팅하고 나머지는 null 일 수 있다. ex) APivotGridEx
		if(this.scrollEle) this.scrollEle.scrollTop += retVal;
		
		return retVal;
		
		//release overflow hidden for backup add
		//if(this.scrollArea) this.scrollArea.css('overflow', 'auto');
	}

	return 0;
};

//실제 ScrollTop, ScrollBottom 을 구현하기 위한 변수, AListView, AGrid 에서 사용
BackupManager.prototype.isMoveReal = function() { return this.moveReal; };
BackupManager.prototype.setMoveReal = function(enable) { this.moveReal = enable; };

//상단의 데이터가 백업되어 있다면 delegator의 상단 컨텐츠로 복원한다.
BackupManager.prototype.checkHeadBackup = function()
{
	//복원 가능한 개수를 얻어온다.
	var resCount = this.getHRestoreCount();
	if(resCount>0)
	{
		var $first = $(this.delegator.getTopItem());
		var $tmp = $('<div></div>');
		
		for(var i=0; i<resCount; i++)
		{
			//한번에 추가하기 위해 상단 stack 에 백업되어 있던 항목을 모은다.
			$tmp.prepend(this.restoreHead());

			//데이터가 상단으로 복원 됐으므로 하단에 있던 데이터는 하단 스택으로 백업한다. (tail stack 에 정보 백업)
			this.backupTail(this.delegator.getBottomItem());
		}
		
		//상단 stack 에 백업되어 있던 항목을 델리게이터 상단 컨텐츠로 복원한다.
		this.$contentEle.prepend($tmp.children());
		
		//this._plusBackupScroll(resCount/this.itemContentCnt);
		this._plusBackupScroll($first.position().top);
		
		this.applyBackupScroll();

		return true;
	}
	
	this.setMoveReal(false);
		
	return false;
};

//하단의 데이터가 백업되어 있다면 delegator의 하단 컨텐츠로 복원한다.
BackupManager.prototype.checkTailBackup = function()
{
	var resCount = this.getTRestoreCount();
	if(resCount>0)
	{
		var $tmp = $('<div></div>');
		
		for(var i=0; i<resCount; i++)
		{
			//한번에 추가하기 위해 하단 stack 에 백업되어 있던 항목을 모은다.
			$tmp.append(this.restoreTail());

			//데이터가 하단으로 복원 됐으므로 상단에 있던 데이터는 상단 스택으로 백업한다. (head stack 에 정보 백업)
			this.backupHead(this.delegator.getTopItem());
		}
		
		//하단 stack 에 백업되어 있던 항목을 델리게이터 하단 컨텐츠로 복원한다.
		this.$contentEle.append($tmp.children());
		
		this._minusBackupScroll(resCount/this.itemContentCnt);
		
		//iphone web
		//if(afc.isIos) this.backupScroll -= this.itemHeight*5;

		this.applyBackupScroll();

		return true;
	}
	
	this.setMoveReal(false);
	
	return false;
};

//	skipApplyBackupScroll
//	바로 백업스크롤을 적용하지 않고 모든 items 를 추가한 후 별도로 적용할 경우, true
//	일반적으로 생략
BackupManager.prototype.appendItemManage = function(items)//, skipApplyBackupScroll)
{
	if(this.delegator.getTotalCount()>=this.maxRow)
	{
		//백업중이면 백업스택에 추가
		if(this.getTRestoreCount()>0 || this.delegator.directBackup)
		{
			//items는 화면에 추가되지 않은 상태의 fragment 이므로 하나씩 추가해도 성능에 영향을 주지 않는다.
			for(let i=0; i<items.length; i++)
				this.backupTailPre(items[i]);
		}
		else
		{
			//release overflow hidden for backup add
			//if(this.scrollArea) this.scrollArea.css('overflow', 'hidden');
	
			//이 순서를 유지할 것.
			this.$contentEle.append(items);

			//상단 항목을 헤드스택에 백업, 여기서는 화면의 item 이 하나씩 이동하는 상황이 발생한다.
			for(let i=0; i<items.length; i++)
				this.backupHead(this.delegator.getTopItem());

			this._minusBackupScroll(1);
			
			//if(!skipApplyBackupScroll) 
			
			this.applyBackupScroll();
		}
		
		return true;
	}
	
	return false;
};

//상단에 아이템을 추가할 경우 처리
BackupManager.prototype.prependItemManage = function(items)
{
	if(this.delegator.getTotalCount()>=this.maxRow)
	{
		//백업중이면 백업스택에 추가
		if(this.getHRestoreCount()>0)
		{
			//items는 화면에 추가되지 않은 상태의 fragment 이므로 하나씩 추가해도 성능에 영향을 주지 않는다.
			for(let i=0; i<items.length; i++)
				this.backupHeadPre(items[i]);
		}
		else
		{
			//이 순서를 유지할 것.
			this.$contentEle.prepend(items);
			
			//하단 항목을 테일 스택에 백업, 여기서는 화면의 item 이 하나씩 이동하는 상황이 발생한다.
			for(let i=0; i<items.length; i++)
				this.backupTail(this.delegator.getBottomItem());
		}
		
		return true;
	}
	
	return false;
};






