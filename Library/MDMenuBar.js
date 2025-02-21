(async function(){

afc.import("Framework/afc/event/AMenuBarEvent.js")
await afc.import("Framework/afc/component/AMenuBar.js")

/**
Constructor
Do not call Function in Constructor.
*/
MDMenuBar = class MDMenuBar extends AMenuBar
{
	constructor()
	{
		super()

		this.$cloneMenuBar = null
		this.menuInfo = null
		
		this.isCloneActive = false
		this.activeMenu = null
		this.$activeMenuBtn = null
	}

}


MDMenuBar.prototype.beforeLoadEvent = function()
{
	var thisObj = this;
	
	this.aevent._select = function(btnEle, menuItem, iconMap, isCloneBtn)
	{
		var $btn = $(btnEle)
		
		if(!isCloneBtn)
		{			
			AEvent.bindEvent(btnEle, AEvent.ACTION_DOWN, function(e)
			{
				thisObj.isCloneActive = true;
				thisObj.doMakeMainMenu($btn, menuItem, iconMap);
				thisObj.makeCloneMenuBar();
			});
			
			$btn.hover(
				function() 
				{ 
					$btn.css({'color':'#d9d9d9', 'background-color':'#202020'}); 
				},
				function() 
				{ 				
					$btn.css({'color':'#d9d9d9', 'background-color':'#3A3A3A'}); 
				}
			);
		}
		else
		{
			AEvent.bindEvent(btnEle, AEvent.ACTION_DOWN, function(e)
			{
				if(!thisObj.isCloneActive)
				{
					thisObj.isCloneActive = true;
					thisObj.doMakeMainMenu($btn, menuItem, iconMap);
				}
				else
				{
					thisObj.removeCloneMenuBar();
				}
			});
			
			$btn.hover(
				function() 
				{
					if(!thisObj.$activeMenuBtn || $btn !== thisObj.$activeMenuBtn)
					{
						$btn.css({'color':'#d9d9d9', 'background-color':'#202020'}); 
						
						if(thisObj.activeMenu) thisObj.activeMenu.close();
						if(thisObj.$activeMenuBtn) thisObj.$activeMenuBtn.css({'color':'#d9d9d9', 'background-color':'#3A3A3A'});
						
						thisObj.doMakeMainMenu($btn, menuItem, iconMap);
					}
					else
					{
						$btn.css({'color':'#d9d9d9', 'background-color':'#202020'}); 
					}
				},
				function() 
				{ 
					if(!thisObj.activeMenu)
					{
						$btn.css({'color':'#d9d9d9', 'background-color':'#3A3A3A'}); 
					} 
				}
			);
		}
	};
};


MDMenuBar.prototype.init = function(context, evtListener)
{
	AMenuBar.prototype.init.call(this, context, evtListener);
	
};


MDMenuBar.prototype.initWithMenuInfo = function(menuInfo)
{
	this.init('AMenuBar');
	
	this.menuInfo = menuInfo;
	
	for(var i=0; i<menuInfo.length; i++)
	{		
		this.addMenuButton(menuInfo[i].text, menuInfo[i].sub, menuInfo[i].iconMap);
	}
};

MDMenuBar.prototype.addMenuButton = function(text, menuItem, iconMap)
{
	var $btn = 	$('<button></button>')
				.html(text)
				.css({
					'color': '#d9d9d9',
					'background-color': '#3A3A3A',
					'border': 'none',
					'padding': '0px 15px 0px 15px'
				});
	
	this.aevent._select($btn[0], menuItem, iconMap);

	this.$ele.append($btn);
};

MDMenuBar.prototype.makeCloneMenuBar = function()
{	
	this.$cloneMenuBar = this.$ele.clone();
	this.$cloneMenuBar.empty();
	
	for(var i=0; i<this.menuInfo.length; i++)
	{			
		this.addCloneMenuButton(this.menuInfo[i].text, this.menuInfo[i].sub, this.menuInfo[i].iconMap);
	}
	
	var $oriMenuBar = $("div[data-base='AMenuBar']"),
		oriMenuBarEle = $oriMenuBar[0],
		oriMenuBarPos = oriMenuBarEle.getBoundingClientRect();
	
	this.$cloneMenuBar.css({
		position : 'absolute',
		top : oriMenuBarPos.top,
		left : oriMenuBarPos.left,
		height : oriMenuBarPos.height + 'px',
		width : oriMenuBarPos.width + 'px',
		backgroundImage : 'transparent',
		zIndex : 9999
	});
	
	$('body').append(this.$cloneMenuBar);
	
};

MDMenuBar.prototype.addCloneMenuButton = function(text, menuItem, iconMap)
{	
	var $btn = 	$('<button></button>')
				.html(text)
				.css({
					'color': '#d9d9d9',
					'background-color': '#3A3A3A',
					'border': 'none',
					'padding': '0px 15px 0px 15px'
				});
	
	this.aevent._select($btn[0], menuItem, iconMap, true);

	this.$cloneMenuBar.append($btn);
};

MDMenuBar.prototype.doMakeMainMenu = function($btn, menuItem, iconMap)
{	
	var pos = $btn[0].getBoundingClientRect();
	
	var menu = new AMenu();
	
	this.activeMenu = menu;
	
	this.$activeMenuBtn = $btn;
	
	menu.setItemInfoArr(menuItem);

	//add ukmani100
	if(iconMap) menu.setIconMap(iconMap);

	menu.setSelectListener(this, 'onMenuSelect');

	menu.popup(pos.left, pos.top+$btn.height());
};

MDMenuBar.prototype.removeCloneMenuBar = function()
{	
	if(this.activeMenu)
	{
		this.activeMenu.close();
		this.activeMenu = null;
	}	

	if(this.$activeMenuBtn) this.$activeMenuBtn = null;

	this.$cloneMenuBar.remove();
	
	this.$cloneMenuBar = null;
	
	this.isCloneActive = false;
	
};


MDMenuBar.prototype.onMenuSelect = function(menu, info)
{	
	this.removeCloneMenuBar();

	if(info.id) this.reportEvent('select', info);
	
};






})();











