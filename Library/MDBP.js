//미래에셋에서 odsBP.js 파일, 미래에셋파일이라는것을 구분하기 위해 이름을 변경함.
// 총 길이
var SZ_SND_ODS_TOTAL_HEADER = 1372;
//var SZ_RCV_ODS_TOTAL_HEADER = 66;

//------------------------------
//	입력정보 Header 영역
//------------------------------
var SZ_ODS_GB					= 3;		//"ODS"로 입력
var SZ_ODS_START_GB				= 1;		//"S"로 입력
var SZ_ODS_INPUT_GB				= 2;		//00:일반, 01:거래정보 재사용, 02:평문데이터 암호화
var SZ_ODS_LOGIN_GB				= 2;		//00:일반, 01:기존세션 삭제 후 로그인
var SZ_ODS_PW_KEY				= 64;		//평문데이터 암호화 시 사용( 입력구분이 02인 경우 )
var SZ_ODS_PW_DATA				= 260;		//평문데이터 암호화 시 사용( 입력구분이 02인 경우 )
var SZ_ODS_DECODE_START			= 50;		//TR XML의 시작점에서 복호화할 항목의 시작점
var SZ_ODS_DECODE_END			= 50;		//TR XML의 시작점에서 복호화할 항목의 종료점
var SZ_ODS_HISTORY_SAVE			= 2;		//01:저장, 02:저장안함
var SZ_ODS_POSITION_RESULT_VAL	= 1;		//위치인증결과값 이력정보 저장용 데이터
var SZ_ODS_POSITION_MGS			= 255;		//위치인증상세메세지내용 이력정보 저장용 데이터
var SZ_ODS_POSITION_SCORE		= 3;		//위치인증점수 이력정보 저장용 데이터
var SZ_ODS_POSITION_VAL1		= 40;		//위치정보값1 이력정보 저장용 데이터
var SZ_ODS_POSITION_VAL2		= 40;		//위치정보값2 이력정보 저장용 데이터
var SZ_ODS_POSITION_VAL3		= 40;		//위치정보값3 이력정보 저장용 데이터
var SZ_ODS_CS_NO				= 8;		//고객번호
var SZ_ODS_AC_NO				= 12;		//계좌번호
var SZ_ODS_ORZ_CD				= 6;		//조직코드
var SZ_ODS_MI_SQUARE_PW			= 16;		//마이스퀘어비번
var SZ_ODS_ERR_MSG_CD			= 16;		//오류메세지코드
var SZ_ODS_ERR_MSG_CN			= 500;		//오류메세지내용
var SZ_ODS_END_GB				= 1;		//"E"로 입력


//------------------------------
//	출력정보 Header 영역 (수신)
//------------------------------
var SZ_ODS_RCV_START_GB			= 1;		//"S"로 입력
var SZ_ODS_RCV_PW_KEY			= 64;		//평문데이터 암호화 시 사용( 입력구분이 02인 경우 )
var SZ_ODS_RCV_END_GB			= 1;		//"E"로 입력

//------------------------------------------------------------------------------------------------------------------
//	OFFSET
//------------------------------------------------------------------------------------------------------------------

//------------------------------
//	G/W Header 영역
//------------------------------

var OS_ODS_GB					= SZ_SND_TMAX_HEADER;
var OS_ODS_SG					= OS_ODS_GB + SZ_ODS_GB;
var OS_ODS_IG					= OS_ODS_SG + SZ_ODS_START_GB;
var OS_ODS_LG					= OS_ODS_IG + SZ_ODS_INPUT_GB;
var OS_ODS_PK					= OS_ODS_LG + SZ_ODS_LOGIN_GB;
var OS_ODS_PD					= OS_ODS_PK + SZ_ODS_PW_KEY;
var OS_ODS_DS					= OS_ODS_PD + SZ_ODS_PW_DATA;
var OS_ODS_DE					= OS_ODS_DS + SZ_ODS_DECODE_START;
var OS_ODS_HS					= OS_ODS_DE + SZ_ODS_DECODE_END;
var OS_ODS_PRV					= OS_ODS_HS + SZ_ODS_HISTORY_SAVE;
var OS_ODS_PM					= OS_ODS_PRV + SZ_ODS_POSITION_RESULT_VAL;
var OS_ODS_PS					= OS_ODS_PM + SZ_ODS_POSITION_MGS;
var OS_ODS_PV1					= OS_ODS_PS + SZ_ODS_POSITION_SCORE;
var OS_ODS_PV2					= OS_ODS_PV1 + SZ_ODS_POSITION_VAL1;
var OS_ODS_PV3					= OS_ODS_PV2 + SZ_ODS_POSITION_VAL2;
var OS_ODS_CN					= OS_ODS_PV3 + SZ_ODS_POSITION_VAL3;
var OS_ODS_AN					= OS_ODS_CN + SZ_ODS_CS_NO;
var OS_ODS_OC					= OS_ODS_AN + SZ_ODS_AC_NO;
var OS_ODS_MSPW					= OS_ODS_OC + SZ_ODS_ORZ_CD;
var OS_ODS_EMCD					= OS_ODS_MSPW + SZ_ODS_MI_SQUARE_PW;
var OS_ODS_EMCN					= OS_ODS_EMCD + SZ_ODS_ERR_MSG_CD;
var OS_ODS_EG					= OS_ODS_EMCN + SZ_ODS_ERR_MSG_CN;
var OS_ODS_END					= OS_ODS_EG + SZ_ODS_END_GB;

//------------------------------
//	G/W OUTPUT Header 영역
//------------------------------
/*
var OS_ODS_RSG					= SZ_RCV_TMAX_HEADER;
var OS_ODS_RPK					= OS_ODS_RSG + SZ_ODS_RCV_START_GB;
var OS_ODS_REG					= OS_ODS_RPK + SZ_ODS_RCV_PW_KEY;
var OS_ODS_REND					= OS_ODS_REG + SZ_ODS_RCV_END_GB;
*/




