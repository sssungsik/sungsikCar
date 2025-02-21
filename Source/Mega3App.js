
Mega3App = class Mega3App extends AApplication
{
	constructor()
	{
		super()

		//TODO:edit here
        // this.serverUrl = 'http://127.0.0.1:3000/users/';
		
		// this.qm = null;

	}

	onReady()
	{
		super.onReady();
        //    this.connectServer()

		this.setMainContainer(new APage('main'))
		this.mainContainer.open('Source/MainView.lay')

		//TODO:edit here

	}

	unitTest(unitUrl)
	{
		//TODO:edit here

		this.onReady()

		super.unitTest(unitUrl)
	}
// connectServer()
//     {
//         this.qm = new WasQueryManager()
        
//         let nio = new HttpIO(this.qm)
//         this.qm.setNetworkIo(nio)
        
//         this.qm.startManager(this.serverUrl)
//     }

}

