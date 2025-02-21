
carYearList = class carYearList extends AView
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
        this.year.setText(data.year)

        
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




	onAView1Click(comp, info, e)
	{

		//TODO:edit here
        console.log(this.data)
        this.getContainer().getView().onCarYearClick(this.data.pic)

	}
}

