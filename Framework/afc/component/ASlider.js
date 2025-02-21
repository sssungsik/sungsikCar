                
/**
 * @author cheol
 */

class ASlider extends AComponent
{
	constructor()
	{
		super()
	
	}

	
	
}

window.ASlider = ASlider


ASlider.CONTEXT = 
{
    tag: '<input data-base="ASlider" data-class="ASlider" type="range" min="0" max="100" value="25" step="1" class="ASlider-Style"/>',

    defStyle: 
    {
        width:'100px', height:'25px' 
    },
    
    events: ['change']
};

ASlider.prototype.init = function(context, evtListener)
{
	AComponent.prototype.init.call(this, context, evtListener);

};

ASlider.prototype.getValue = function() { return this.element.value; };
ASlider.prototype.getMax = function() { return this.getAttr('max'); };
ASlider.prototype.getMin = function() { return this.getAttr('min'); };
ASlider.prototype.getStep = function() { return this.getAttr('step'); };

ASlider.prototype.setValue = function(value) { this.element.value = value; };
ASlider.prototype.setMax = function(max) { this.setAttr('max', max); };
ASlider.prototype.setMin = function(min) { this.setAttr('min', min); };
ASlider.prototype.setStep = function(step) { this.setAttr('step', step); };

// 매핑가능한 개수를 리턴한다.
ASlider.prototype.getMappingCount = function()
{
	return ['value', 'max', 'min', 'step'];
};

ASlider.prototype.setData = function(data)
{
	if(typeof(data) == 'object')
	{
		this.setValue(data[0]);
		this.setMax(data[1]);
		this.setMin(data[2]);
		this.setStep(data[3]);
	}
	else this.setValue(data);
};

ASlider.prototype.getData = function()
{
	return this.getValue();
};

ASlider.prototype.getQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	if(!dataArr || dataArr.length==0) return;
	
	var data = dataArr[0];
	data[keyArr[0]] = this.getValue();
	data[keyArr[1]] = this.getMax();
	data[keyArr[2]] = this.getMin();
	data[keyArr[3]] = this.getStep();
};

ASlider.prototype.setQueryData = function(dataArr, keyArr, queryData)
{
	if(!keyArr) return;
	
	var data = dataArr[0];
	
	this.setValue(data[keyArr[0]]);
	this.setMax(data[keyArr[1]]);
	this.setMin(data[keyArr[2]]);
	this.setStep(data[keyArr[3]]);
};
