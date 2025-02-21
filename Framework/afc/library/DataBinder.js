
DataBinder = class DataBinder
{
	constructor()
	{
	
	}
	
	setData(data)
	{
		let self = this
		
		for(let p in data)
		{
			this.bindComp(p, data[p])
		}
		
		let proxy = new Proxy(data, 
		{
			get(target, prop, receiver) 
			{
				return self[prop]?.getData()
			},
			
			set(target, prop, value, receiver) 
			{
				self[prop]?.setData(value)
				
				return true
			},
		})
		
				
		return proxy
	}
	
	bindComp(dataKey, comp)
	{
		this[dataKey] = comp
	}
	
}
   
   
   
   