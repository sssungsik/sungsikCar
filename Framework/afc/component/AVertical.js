(async function(){

await afc.import("Framework/afc/component/AFlexLayout.js");

AVertical = class AVertical extends AFlexLayout
{
    static CONTEXT = 
    {
        //	실제로 구현하고자 하는 컴포넌트의 태그로 변경하십시요.
        tag:'<div data-base="AVertical" data-class="AVertical" class="AFlexLayout-Style AVertical-Style"></div>',

        //	컴포넌트를 lay 파일에 최초로 추가한 후 적용될 속성을 나열합니다.
        //	주로 컴포넌트 사이즈에 관련된 속성을 선언합니다.
        defStyle: 
        {
            width:'120px', height:'320px', 'flex-direction': 'column', 'align-items': 'center', 'justify-content': 'center'
        },
    
        events: []
    }

    constructor()
    {
        super();

        //TODO:edit here
        
        //	자신이 포함되어져 있는 프레임웍 이름을 지정합니다.
        this.frwName = 'afc';
    }

    init(context, evtListener)
    {
        super.init(context, evtListener)
    }
}
//window.AVertical = AVertical;

})();