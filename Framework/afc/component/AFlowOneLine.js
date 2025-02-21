
/**
	JH
 */
 
 
 
AFlowOneLine = class AFlowOneLine extends AComponent
{
	constructor()
	{
		super();
		
	}
}

AFlowOneLine.CONTEXT = 
{
    tag: '<svg data-base="AFlowOneLine" data-class="AFlowOneLine" data-direct="horizon" data-arrow-position="start" data-linecolor="black" class="AFlowOneLine-Style">'+
		 	'<defs>'+
				'<marker id="arrowStart" markerWidth="8" markerHeight="10" refX="0" refY="5" orient="auto">'+
		 			'<path d="M8,0 L0,5 L8,10" stroke-width="1" stroke="black" fill="none"/>'+
		 		'</marker>'+
		 		'<marker id="arrowEnd" markerWidth="8" markerHeight="10" refX="8" refY="5" orient="auto">'+
		 			'<path d="M0,0 L8,5 L0,10" stroke-width="1" stroke="black" fill="none"/>'+
		 		'</marker>'+
			'</defs>'+
		 	'<path id="mainPath" d="M0 10 L200 10" stroke-width="1" stroke="black"></path></svg>',

    defStyle: 
    {
        width:'200px', height:'20px', overflow:'visible'
    },

    events: []
};

AFlowOneLine.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	this._getPathEle();
	this.setLineColor(this.getAttr('data-linecolor'));
	this.setArrowPosition(this.getAttr('data-arrow-position'));
};

AFlowOneLine.prototype._getPathEle = function()
{
	var d = new Date();
	this.timeCode = d.getTime()%1000000;
	
	this.pathEle = this.element.getElementsByTagName('path').mainPath;
	
	var marker = this.element.getElementsByTagName('marker');
	
	marker[0].setAttribute('id', 'arrowStart'+this.timeCode);
	marker[1].setAttribute('id', 'arrowEnd'+this.timeCode);
};

AFlowOneLine.prototype.resizePath = function()
{
	var left = parseFloat(this.$ele.css('left'));
	var top = parseFloat(this.$ele.css('top'));
	var width = parseFloat(this.$ele.css('width'));
	var height = parseFloat(this.$ele.css('height'));
	
	if(this.getAttr('data-direct') == "horizon")
	{
		this.$ele.css('height', '20px');
		var str = "M0 10 L"+width+" 10";
	}
	else if(this.getAttr('data-direct') == "vertical")
	{
		this.$ele.css('width', '20px');
		var str = "M10 0 L10 "+height;
	}
	if(str) this.pathEle.setAttribute('d', str);
};

AFlowOneLine.prototype.setDirect = function(info)
{
	var left = parseFloat(this.$ele.css('left'));
	var top = parseFloat(this.$ele.css('top'));
	var width = parseFloat(this.$ele.css('width'));
	var height = parseFloat(this.$ele.css('height'));
	
	if(info == "horizon")
	{
		this.$ele.css('width', height);
		this.$ele.css('height', '20px');
		var str = "M0 10 L"+height+" 10";
	}
	else if(info == "vertical")
	{
		this.$ele.css('height', width);
		this.$ele.css('width', '20px');
		var str = "M10 0 L10 "+width;
	}
	if(str) this.pathEle.setAttribute('d', str);
};

AFlowOneLine.prototype.setArrow = function(info)
{
	if(info)
	{
		if(this.getAttr('data-arrow-position') == "start") this.pathEle.setAttribute('marker-start',"url(#arrowStart"+this.timeCode+")");
		else if(this.getAttr('data-arrow-position') == "end") this.pathEle.setAttribute('marker-end',"url(#arrowEnd"+this.timeCode+")");
		else if(this.getAttr('data-arrow-position') == "both") 
		{
			this.pathEle.setAttribute('marker-start',"url(#arrowStart"+this.timeCode+")");
			this.pathEle.setAttribute('marker-end',"url(#arrowEnd"+this.timeCode+")");
		}
	}
	else
	{
		this.pathEle.removeAttribute('marker-start');
		this.pathEle.removeAttribute('marker-end');
	}
};

AFlowOneLine.prototype.setArrowPosition = function(info)
{
	if(!this.getAttr('data-arrow')) return;
	
	if(info == "start")
	{
		this.pathEle.removeAttribute('marker-end');
		this.pathEle.setAttribute('marker-start',"url(#arrowStart"+this.timeCode+")");
	}
	else if(info == "end")
	{
		this.pathEle.removeAttribute('marker-start');
		this.pathEle.setAttribute('marker-end',"url(#arrowEnd"+this.timeCode+")");
	}
	else if(info == "both")
	{
		this.pathEle.setAttribute('marker-start',"url(#arrowStart"+this.timeCode+")");
		this.pathEle.setAttribute('marker-end',"url(#arrowEnd"+this.timeCode+")");
	}
	
};

AFlowOneLine.prototype.setLineColor = function(color)
{
	var path = this.element.getElementsByTagName('path');
	for(var i=0;i<path.length;i++)
	{
		path[i].setAttribute('stroke', color);
	}
};

AFlowOneLine.prototype.setStrokeWidth = function(value)
{
	this.pathEle.setAttribute('stroke-width', value);
};

AFlowOneLine.prototype.updatePosition = function(pWidth, pHeight)
{
	AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	this.resizePath();
};
