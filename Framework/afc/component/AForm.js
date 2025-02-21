
/**
 * @author cheol
 */

class AForm extends AView
{
	constructor()
	{
		super()
	
	}

    init(context, evtListener)
    {
	    super.init(context, evtListener)
	
	
    }

	
	
}

window.AForm = AForm

AForm.CONTEXT = 
{
    tag: '<form data-base="AForm" data-class="AForm" class="AForm-Style"></form>',

    defStyle: 
    {
        width:'400px', height:'100px' 
    },

    events: []
};

AForm.NAME = 'AForm';




