
carModelList = class carModelList extends AView
{
	constructor()
	{
		super()

		//TODO:edit here
        this.data = null

	}
    setData(data) {
        this.data = data
        console.log(data)
        this.carName.setText(data.name)
        this.carPic.setImage(data.pic)
        
    }

	init(context, evtListener)
	{
		super.init(context, evtListener)

		//TODO:edit here

     
	}

	onInitDone()
	{
		super.onInitDone()

		//TODO:edit here

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		//TODO:edit here

	}



	onCarModelClick(comp, info, e)
	{
        console.log(this.data)
        this.getContainer().getView().onCarModelClick(this.data)

	}
}

