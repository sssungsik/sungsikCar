
/**
 *	AComponent 를 상속받아 새로운 컴포넌트를 생성하는 예
 */
ASpacer = class ASpacer extends AComponent
{
    static CONTEXT = 
    {
        //	실제로 구현하고자 하는 컴포넌트의 태그로 변경하십시요.
        tag:'<span data-base="ASpacer" data-class="ASpacer" class="ASpacer-Style"></span>',

        //	컴포넌트를 lay 파일에 최초로 추가한 후 적용될 속성을 나열합니다.
        //	주로 컴포넌트 사이즈에 관련된 속성을 선언합니다.
        defStyle: 
        {
            width:'60px', height:'30px' 
        },
    
        //	AEvent.defEvents = ['actiondown', 'actionmove', 'actionup', 'actioncancel', 'actionenter', 'actionleave', 'keydown', 'keyup'];
        //	기본 이벤트 즉, AEvent.defEvents 에 정의된 이벤트 외에 
        //	추가적으로 발생시키고자 하는 이벤트 명을 나열합니다.
        
        events: []
    }

    constructor()
    {
        super();

    }

    init(context, evtListener)
    {
        super.init(context, evtListener)

        if(this.isDev()) this.$ele.addClass('spacer_border')
        else this.$ele.removeClass('spacer_border')
    }
}
