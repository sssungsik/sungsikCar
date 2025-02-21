
/**
	JH
 */
 
AFlowThreeLine = class AFlowThreeLine extends AComponent
{
	constructor()
	{
		super();
		
	}
}

AFlowThreeLine.CONTEXT = 
{
    tag: '<svg data-base="AFlowThreeLine" data-leaning-value="100" data-leaning-postion="true" data-class="AFlowThreeLine" data-direct="0" data-arrow-position="start" data-linecolor="black" class="AFlowThreeLine-Style">'+
		 	'<defs>'+
				'<marker id="arrowStart" markerWidth="8" markerHeight="10" refX="0" refY="5" orient="auto">'+
		 			'<path d="M8,0 L0,5 L8,10" stroke-width="1" stroke="black" fill="none"/>'+
		 		'</marker>'+
		 		'<marker id="arrowEnd" markerWidth="8" markerHeight="10" refX="8" refY="5" orient="auto">'+
		 			'<path d="M0,0 L8,5 L0,10" stroke-width="1" stroke="black" fill="none"/>'+
		 		'</marker>'+
			'</defs>'+
		 	'<path id="mainPath" d="M0 200 L0 0 L150 0 L150 200" stroke-width="1" stroke="black" fill="none"></path></svg>',

    defStyle: 
    {
        width:'150px', height:'200px', overflow:'visible'
    },

    events: []
};

AFlowThreeLine.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);
	
	this._getPathEle();
	this.setLineColor(this.getAttr('data-linecolor'));
	this.setArrowPosition(this.getAttr('data-arrow-position'));
};

AFlowThreeLine.prototype._getPathEle = function()
{
	var d = new Date();
	this.timeCode = d.getTime()%1000000;
	
	this.pathEle = this.element.getElementsByTagName('path').mainPath;
	
	var marker = this.element.getElementsByTagName('marker');
	
	marker[0].setAttribute('id', 'arrowStart'+this.timeCode);
	marker[1].setAttribute('id', 'arrowEnd'+this.timeCode);
};

AFlowThreeLine.prototype.resizePath = function()
{
	this.drawPath();
};

AFlowThreeLine.prototype.drawPath = function()
{
	var width = parseFloat(this.$ele.css('width'));
	var height = parseFloat(this.$ele.css('height'));
	
	var leaning = this.getAttr('data-leaning-value')/100;
	var leaningPos = this.getAttr('data-leaning-postion');
	
	var str;
	 
	if(this.getAttr('data-direct') == "0")
	{
		if(leaningPos) str = "M0 "+(height*leaning)+" L0 0 L"+width+" 0 L"+width+" "+height;
		else str = "M0 "+height+" L0 0 L"+width+" 0 L"+width+" "+(height*leaning);
	}
	else if(this.getAttr('data-direct') == "90")
	{
		if(leaningPos) str = "M"+width*(1-leaning)+" 0 L"+width+" 0 L"+width+" "+height+" L0 "+height;
		else str = "M0 0 L"+width+" 0 L"+width+" "+height+" L"+width*(1-leaning)+" "+height;
	}
	else if(this.getAttr('data-direct') == "180")
	{
		if(leaningPos) str = "M"+width+" "+height*(1-leaning)+" L"+width+" "+height+" L0 "+height+" L0 0";
		else str = "M"+width+" 0 L"+width+" "+height+" L0 "+height+" L0 "+height*(1-leaning);
	}
	else if(this.getAttr('data-direct') == "270")
	{
		if(leaningPos) str = "M"+(width*leaning)+" "+height+" L0 "+height+" L0 0 L"+width+" 0";
		else str = "M"+width+" "+height+" L0 "+height+" L0 0 L"+(width*leaning)+" 0";
	}
	
	if(str) this.pathEle.setAttribute('d', str);
};

AFlowThreeLine.prototype.setArrow = function(info)
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

AFlowThreeLine.prototype.setArrowPosition = function(info)
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

AFlowThreeLine.prototype.setLineColor = function(color)
{
	var path = this.element.getElementsByTagName('path');
	for(var i=0;i<path.length;i++)
	{
		path[i].setAttribute('stroke', color);
	}
};

AFlowThreeLine.prototype.setStrokeWidth = function(value)
{
	this.pathEle.setAttribute('stroke-width', value);
};

AFlowThreeLine.prototype.updatePosition = function(pWidth, pHeight)
{
	AComponent.prototype.updatePosition.call(this, pWidth, pHeight);
	this.resizePath();
};
