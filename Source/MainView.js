
MainView = class MainView extends AView
{
	constructor()
	{
		super()

		//TODO:edit here
       this.brand = '';
       this.carModels = [

        // ----------------제네시스--------------------------
        
        /*
        { company : "genesis", name : "EQ900L", pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20210524_21%2Fauto_1621816203059aFjc0_PNG%2F20210524092812_UMfkVcKB.png"},
        { company : "genesis", name : "EQ900", pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20210524_153%2Fauto_1621816491077bS1tu_PNG%2F20210524093427_JigfANZf.png"},
        
        
        */
        /*
        { company : "genesis", name : "GV80 쿠페", pic : "Assets/carLogos/genesis/gv80co.png"},
        { company : "genesis", name : "GV80", pic : "Assets/carLogos/genesis/gv80.png"},
        { company : "genesis", name : "G80 일렉트리파이드", pic : "Assets/carLogos/genesis/G80ele.png"},
        */
        { company : "genesis", name : "G80", pic : "Assets/carLogos/genesis/g80.png", year : { 
            'G80 (16~20년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20190926_205%2Fauto_1569458601361cYc9z_PNG%2F20190926094317_foU3MaFj.png"
            },
            'G80 (20~23년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20221025_292%2Fauto_1666673748189LmvuP_PNG%2F20221025135539_1Xe2RUJ8.png"
            },
            'G80 일렉트리파이드 (21~24년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20240905_9%2Fauto_1725496695326OzYDS_PNG%2F20240905093758_WWyaLyaR.png"
            },
            'G80 (23년~현재)' : {
                pic : 'https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20250108_244%2Fauto_1736299553101HbvpA_PNG%2F20250108102545_hoQ92ZMp.png'
            },
            'G80 일렉트리파이드 (24년~현재)' : {
                pic : 'https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20240905_68%2Fauto_1725499122589jOh0t_PNG%2F20240905101841_M2mc68A0.png'
            }
            }
        },
        { company : "genesis", name : "G90", pic : "Assets/carLogos/genesis/g90.png", year : { 
            'G90 (18~21년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20200626_198%2Fauto_15931521656305d3CK_PNG%2F20200626151556_9h2BMYs8.png"
            }, 
            'G90 (21년~현재)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20240321_37%2Fauto_1710985403628e0sDy_PNG%2F20240321104315_nN8nvjKl.png"
            }
            }
        },
        { company : "genesis", name : "G90 LWB", pic : "Assets/carLogos/genesis/aaa.png", year : { 
            'G90 L (18~22년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20200626_70%2Fauto_1593151681603D2PSa_PNG%2F20200626150700_huPUOjhS.png"
            }, 
            'G90 LWB (22년~현재)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20240321_124%2Fauto_1710984884107Qk75x_PNG%2F20240321103437_U1QpcxoH.png"
            }      
            }
        },
        /*    
        { company : "genesis", name : "GV70 일렉트리파이드", pic : "Assets/carLogos/genesis/gv70ele.png"},
        { company : "genesis", name : "GV70", pic : "Assets/carLogos/genesis/gv70.png"},
        { company : "genesis", name : "G70", pic : "Assets/carLogos/genesis/g70.png"},
        { company : "genesis", name : "G70 슈팅브레이크", pic : "Assets/carLogos/genesis/g70st.png"},
        { company : "genesis", name : "GV60", pic : "Assets/carLogos/genesis/gv60.png"},
        */


        // ----------------------------현대----------------------------------
        /*
        { company : "hyundai", name : "투싼", pic : "Assets/carLogos/hyundai/tusan.png"},
        { company : "hyundai", name : "스타리아", pic : "Assets/carLogos/hyundai/staria.png"},
        */
        { company : "hyundai", name : "아반떼", pic : "Assets/carLogos/hyundai/avante.png", year : {
            '아반떼' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20191231_44%2Fauto_1577755415630KI2Nr_PNG%2F20191231102333_c7r4oTd6.png"
            },
            '올 뉴 아반떼' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20191231_34%2Fauto_15777562220909kQ0x_PNG%2F20191231103644_PfrGIyD2.png"
            },
            '아반떼XD (00~03년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=http%3A%2F%2Fimgauto.naver.com%2F20170620_205%2Fauto_1497939454053TujKI_PNG%2F12468_2006_XD_.png"
            },
            '뉴 아반떼XD (03~06년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=http%3A%2F%2Fimgauto.naver.com%2F20170620_16%2Fauto_1497939473146E2BgJ_PNG%2F11239_2008_HD.png"
            },
            '아반떼HD (06~10년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=http%3A%2F%2Fimgauto.naver.com%2F20170530_146%2Fauto_1496110846839Bc10R_PNG%2F10253_2010_.png"
            },
            '아반떼HD 하이브리드 (09~13년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20200813_18%2Fauto_1597285407948xNHLf_PNG%2F20200813112326_JLfYj24I.png"
            },
            '아반떼MD (10~13년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=http%3A%2F%2Fimgauto.naver.com%2F20170529_203%2Fauto_1496048340535qcU4A_PNG%2F18435_2013_.png"
            },
            '더 뉴 아반떼MD (13~15년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20191231_204%2Fauto_1577754557329zPpEi_PNG%2F20191231100915_rGueCGgf.png"
            },
            '아반떼AD (15~18년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20200326_122%2Fauto_1585186654163tBc2B_PNG%2F20200326103724_lOI3t1Ek.png"
            },
            '더 뉴 아반떼AD (18~20년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20190827_234%2Fauto_1566888481406l1Sjj_PNG%2F20190827154759_ARghztls.png"
            },
            '아반떼CN7 (20~23년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20230227_141%2Fauto_16774720478768lEh4_PNG%2F20230227132719_LRVXZYqG.png"
            },
            '아반떼CN7 하이브리드 (20~23년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20230313_290%2Fauto_1678670204982c6Ipw_PNG%2F20230313101636_SDg346JM.png"
            },
            '아반떼 N (21~23년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20230726_192%2Fauto_1690333112161X0PjQ_PNG%2F20230726095821_A52Adpb2.png"
            },
            '더 뉴 아반떼CN7 (23년~현재)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20240620_28%2Fauto_1718855596130QOJmC_PNG%2F20240620125307_7lHTuB3f.png"
            },
            '더 뉴 아반떼CN7 하이브리드 (23년~현재)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20240620_44%2Fauto_1718855782188YnQsc_PNG%2F20240620125612_Qn89gP75.png"
            },
            '더 뉴 아반떼 N (23년~현재)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20240620_283%2Fauto_1718854576553nXdge_PNG%2F20240620123603_KZq5T8bH.png"
            }
        }},
        /*
        { company : "hyundai", name : "코나", pic : "Assets/carLogos/hyundai/kona.png"},
        { company : "hyundai", name : "포터2", pic : "Assets/carLogos/hyundai/poter.png"},
        { company : "hyundai", name : "베뉴", pic : "Assets/carLogos/hyundai/venupng.png"},
        { company : "hyundai", name : "아반떼", pic : "Assets/carLogos/hyundai/avante.png"},
        { company : "hyundai", name : "캐스퍼", pic : "Assets/carLogos/hyundai/casper.png"},
        */
        // ----------------------------현대화물----------------------------------
        { company : "hyundaiTruck", name : "더 뉴 마이티", pic : "https://www.hyundai.com/contents/repn-car/side-w/290x130-mighty.png", year : {
            '전체' : {
                pic : "https://www.hyundai.com/contents/repn-car/side-w/290x130-mighty.png"
            }
        }},

        // ----------------------------기아----------------------------------
        { company : "kia", name : "스포티지", pic : "Assets/carLogos/kia/sportge.png", year : {
            '스포티지 (93년)' : {
                pic : 'https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=http%3A%2F%2Fimgauto.naver.com%2F20170620_167%2Fauto_1497940028413AxRn5_PNG%2F16588_1993_.png'
            },
            '스포티지 아멕스 (01년)' : {
                pic : 'https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=http%3A%2F%2Fimgauto.naver.com%2F20170620_226%2Fauto_1497939849013X6kQd_PNG%2F13466_2001_.png'
            },
            '뉴 스포티지 (04~10년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20190901_148%2Fauto_1567306704868NBetn_PNG%2F20190901115822_oprPvKYK.png"
            },
            '스포티지 R (10~13년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=http%3A%2F%2Fimgauto.naver.com%2F20170529_277%2Fauto_1496048265022mQ0Cc_PNG%2F18399_2013_R.png"
            },
            '더 뉴 스포티지 R (13~15년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=http%3A%2F%2Fimgauto.naver.com%2F20170529_290%2Fauto_1496048933286mQBOm_PNG%2F41729_2014_R.png"
            },
            '스포티지 4세대 (15~18년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=http%3A%2F%2Fimgauto.naver.com%2F20170523_256%2Fauto_1495542609691KNDR2_PNG%2F65843_2017_.png"
            },
            '스포티지 더 볼드 (18~21년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20190826_172%2Fauto_15668043184557lSRN_PNG%2F20190826162516_Gpr17mZ5.png"
            },
            '디 올 뉴 스포티지 하이브리드 (21~24년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20210720_116%2Fauto_1626745439680XLzQx_PNG%2F20210720104358_bybrLGa8.png"
            },
            '디 올 뉴 스포티지 (21~24년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20210706_234%2Fauto_1625534646981vFK4b_PNG%2F20210706102405_T7Iby7Ag.png"
            },
            '더 뉴 스포티지 하이브리드 (24년~현재)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20241105_288%2Fauto_1730782420020HRsjd_PNG%2F20241105135331_EhWRQAh8.png"
            },
            '더 뉴 스포티지 (24년 ~현재)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20241105_183%2Fauto_17307851635384INzp_PNG%2F20241105143915_n3XV3FdC.png"
            }
        }},
        /*
        { company : "kia", name : "니로 하이브리드", pic : "Assets/carLogos/kia/nirohy.png"},
        { company : "kia", name : "레이 EV", pic : "Assets/carLogos/kia/layev.png"},
        { company : "kia", name : "K5", pic : "Assets/carLogos/kia/k5.png"},
        { company : "kia", name : "셀토스", pic : "Assets/carLogos/kia/seltos.png"},
        { company : "kia", name : "봉고3", pic : "Assets/carLogos/kia/bonggo.png"},
        { company : "kia", name : "레이", pic : "Assets/carLogos/kia/lay.png"},
        { company : "kia", name : "모닝", pic : "Assets/carLogos/kia/moning.png"},
        */


        // -----------------------------르노 ---------------------------------
        { company : "rno", name : "마스터", pic : "Assets/carLogos/rno/master.png"},


        // -----------------------------쉐보레-----------------------------------
        { company : "chev", name : "토스카", pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=http%3A%2F%2Fimgauto.naver.com%2F20170620_48%2Fauto_1497939366894HclSf_PNG%2F12360_2006_.png", year : {
            '토스카 (06~08년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=http%3A%2F%2Fimgauto.naver.com%2F20170620_228%2Fauto_1497939430531ASPdk_PNG%2F11722_2007_.png"
            },
            '토스카 프리미엄 (08~11년)' : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=http%3A%2F%2Fimgauto.naver.com%2F20170530_102%2Fauto_1496110805673hsJ9u_PNG%2F10141_2010_.png"
            }
        }},

        /*
        { company : "chev", name : "타호", pic : "Assets/carLogos/chev/taho.png"},
        { company : "chev", name : "콜로라도", pic : "Assets/carLogos/chev/cololado.png"},
        { company : "chev", name : "트레버스", pic : "Assets/carLogos/chev/trabus.png"},
        { company : "chev", name : "트레일블레이저", pic : "Assets/carLogos/chev/trail.png"},
        { company : "chev", name : "트랙스 크로스오버", pic : "Assets/carLogos/chev/traxcross.png"},

        // ------------------------------쌍용--------------------------------------------
        { company : "ssang", name : "렉스턴", pic : "Assets/carLogos/ssang/rex.png"},
        { company : "ssang", name : "토레스 EVX", pic : "Assets/carLogos/ssang/torresevx.png"},
        { company : "ssang", name : "코란도 EV", pic : "Assets/carLogos/ssang/corandoev.png"},
        { company : "ssang", name : "액티언", pic : "Assets/carLogos/ssang/action.png"},
        { company : "ssang", name : "토레스", pic : "Assets/carLogos/ssang/torres.png"},
        { company : "ssang", name : "렉스턴 스포츠", pic : "Assets/carLogos/ssang/rexsport.png"},
        { company : "ssang", name : "코란도", pic : "Assets/carLogos/ssang/corando.png"},
        { company : "ssang", name : "티볼리", pic : "Assets/carLogos/ssang/tivol.png"},
        */

        /*
        // ----------------------------롤스로이스----------------------------------
       
        { company : "rolls", name : "팬텀 EWB", pic : "Assets/carLogos/rolls/phantomEWB.png"},
        */
        { company : "rolls", name : "팬텀", pic : "Assets/carLogos/rolls/phantom.png", year : {
            2003 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20190926_99%2Fauto_1569472201898zccHt_PNG%2F20190926133000_USpiIqyU.png"
            },
            2012 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=http%3A%2F%2Fimgauto.naver.com%2F20170529_124%2Fauto_1496048090363pKiCi_PNG%2F28475_2012__.png"
            },
            2018 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20200904_283%2Fauto_1599204388353qpG7R_PNG%2F20200904162626_PPMZwxIU.png"
            },
            2022 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20220513_186%2Fauto_16524176086652MknD_PNG%2F20220513135317_tsuYtRUM.png"
            },
            2023 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20221125_198%2Fauto_1669344146553I2Nki_PNG%2F20221125114217_eFl3hRkq.png"
            }
        }},
        /*
        { company : "rolls", name : "컬리넌 블랙배지", pic : "Assets/carLogos/rolls/culiBlack.png"},
        { company : "rolls", name : "컬리넌", pic : "Assets/carLogos/rolls/culi.png"},
        { company : "rolls", name : "스펙터", pic : "Assets/carLogos/rolls/spector.png"},
        { company : "rolls", name : "고스트 블랙배지", pic : "Assets/carLogos/rolls/ghostBlack.png"},
        { company : "rolls", name : "고스트 EWB", pic : "Assets/carLogos/rolls/ghostEWB.png"},
        { company : "rolls", name : "고스트", pic : "Assets/carLogos/rolls/ghost.png"},
        */

        // ----------------------------테슬라----------------------------------
        /*
        { company : "tsla", name : "모델X", pic : "Assets/carLogos/tsla/x.png"},
        */
        { company : "tsla", name : "모델S", pic : "Assets/carLogos/tsla/s.png", year : {
            2013 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20210122_185%2Fauto_1611295242221FzYQ3_PNG%2F20210122150040_1bTfzMPP.png"
            },
            2016 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20210122_12%2Fauto_16112952323719g8Y5_PNG%2F20210122150030_55evrSdX.png"
            },
            2017 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20210122_228%2Fauto_16112952251482eDNJ_PNG%2F20210122150023_oiwN0LKK.png"
            },
            2019 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20210122_130%2Fauto_161129521703191mRS_PNG%2F20210122150015_EKNTyaL5.png"
            },
            2021 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20210128_137%2Fauto_1611823795738PvfIw_PNG%2F20210128174941_GGgGIIpw.png"
            },
            2023 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20230330_249%2Fauto_1680139304460ifqWa_PNG%2F20230330102135_lxYWdtpW.png"
            },
            2024 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20240404_155%2Fauto_1712193229054r5Iq4_PNG%2F20240404101339_05U15rsA.png"
            }
        }},
        /*
        { company : "tsla", name : "모델3", pic : "Assets/carLogos/tsla/3.png"}
        */
  
       ]

	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

		//TODO:edit here
        this.modellistView2.$ele.parent().css('overflow', 'auto')
	}

	onInitDone()
	{
		super.onInitDone()

    //    this.mainText.$ele.css('opacity', '0');

       this.mainView.$ele.fadeTo(1000, 1, function() {
           setTimeout(() => {
               this.mainView.$ele.fadeTo(1000, 0, function() {
                    this.mainView.hide()
                    this.introView.$ele.fadeTo(1000,1)
                    // this.chatBtnView.$ele.fadeTo(1000,1) // ----------> 챗봇 버튼 
                    // this.mainText.$ele.fadeTo(1000, 1)
                    // this.mainText.setText('어떤 차량을 찾으시나요?')
                    // this.mainBtn.$ele.fadeTo(1000,1)
                    // this.nopickBtn.$ele.fadeTo(1000,1)
                    // this.pickBtn.$ele.fadeTo(1000,1)
               }.bind(this));
           }, 1000);
       }.bind(this));

	}

	onActiveDone(isFirst)
	{
		super.onActiveDone(isFirst)

		//TODO:edit here

	}


    

    onNoDataClick(comp, info, e)
    {
        AToast.show('데이터 준비 중 입니다.')
    }




	onNopickBtnClick(comp, info, e)
	{

		//TODO:edit here
        this.introView.$ele.fadeTo(1000,0, function() {
            this.introView.hide()
            this.koreaView.$ele.fadeTo(1000,1)
        }.bind(this))
        
        

	}

	onPickBtnClick(comp, info, e)
	{

		//TODO:edit here
        this.introView.$ele.fadeTo(1000,0, function() {
            this.introView.hide()
            this.aboardView.$ele.fadeTo(1000,1)
        }.bind(this))

	}

    ontruckBtnClick(comp, infe, e) {
        this.introView.$ele.fadeTo(1000,0, function() {
            this.introView.hide()
            this.truckView.$ele.fadeTo(1000,1)
        }.bind(this))
    }


    // ------------------------뒤로가기 버튼---------------------------------------
	onBack1BtnClick(comp, info, e)
	{

		//TODO:edit here
        this.koreaView.$ele.fadeTo(500,0, function() {
            this.koreaView.hide()
            this.introView.$ele.fadeTo(1000,1)
        }.bind(this))


	}

	onBack2BtnClick(comp, info, e)
	{

		//TODO:edit here
        this.aboardView.$ele.fadeTo(500,0, function() {
            this.aboardView.hide()
            this.introView.$ele.fadeTo(1000,1)
        }.bind(this))

	}

    onModelBackBtnClick(comp, info, e)
    {
        this.modelView.$ele.fadeTo(500,0, function() {
            this.modelView.hide()
            this.introView.$ele.fadeTo(1000,1)
        }.bind(this))
    }

    onYearBackBtn(comp, info, e) {
        this.yearView.$ele.fadeTo(500,0, function() {
            this.yearView.hide()
            this.introView.$ele.fadeTo(1000,1)
        }.bind(this))    
    }
    // --------------------------------------------------------------------------------





    // -------------- 국내 제조사 클릭-----------------------------------------------
	onHyundaiClick(comp, info, e)
	{

		 this.koreaView.$ele.fadeTo(1000,0, function() {
            this.koreaView.hide()
            this.modelView.$ele.fadeTo(1000,1)
		
            
            this.modelListView.removeAllItems()
            this.carModels
                .filter(item => item.company == 'hyundai')
                .forEach(item => {
                this.modelListView.addItem('Source/items/carModelList.lay', [item]); // 각 데이터를 아이템으로 추가
                // this.modelListView.setData(item)

                
            });

        
        }.bind(this))

	}
	

	onGenesisClick(comp, info, e)
	{

		//TODO:edit here
		 this.koreaView.$ele.fadeTo(1000,0, function() {
            this.koreaView.hide()
            this.modelView.$ele.fadeTo(1000,1)
			// this.getCarModels('genesis')

            this.modelListView.removeAllItems()
            this.carModels
                .filter(item => item.company == 'genesis')
                .forEach(item => {
                this.modelListView.addItem('Source/items/carModelList.lay', [item]); // 각 데이터를 아이템으로 추가
                // this.modelListView.setData(item)

                
            });
        
        }.bind(this))

	}


    
	onKiaClick(comp, info, e)
	{

		//TODO:edit here
		 this.koreaView.$ele.fadeTo(1000,0, function() {
            this.koreaView.hide()
            this.modelView.$ele.fadeTo(1000,1)
			// this.getCarModels('genesis')

            this.modelListView.removeAllItems()
            this.carModels
                .filter(item => item.company == 'kia')
                .forEach(item => {
                this.modelListView.addItem('Source/items/carModelList.lay', [item]); // 각 데이터를 아이템으로 추가
                // this.modelListView.setData(item)

                
            });
        
        }.bind(this))

	}

    onRnoClick(comp, info, e)
	{

		//TODO:edit here
		 this.koreaView.$ele.fadeTo(1000,0, function() {
            this.koreaView.hide()
            this.modelView.$ele.fadeTo(1000,1)
			// this.getCarModels('genesis')

            this.modelListView.removeAllItems()
            this.carModels
                .filter(item => item.company == 'rno')
                .forEach(item => {
                this.modelListView.addItem('Source/items/carModelList.lay', [item]); // 각 데이터를 아이템으로 추가
                // this.modelListView.setData(item)

                
            });
        
        }.bind(this))

	}


    onChevClick(comp, info, e)
	{
		//TODO:edit here
		this.koreaView.$ele.fadeTo(1000,0, function() {
            this.koreaView.hide()
            this.modelView.$ele.fadeTo(1000,1)
            this.modelListView.removeAllItems()
            this.carModels
                .filter(item => item.company == 'chev')
                .forEach(item => {
                this.modelListView.addItem('Source/items/carModelList.lay', [item]); // 각 데이터를 아이템으로 추가
            });
        }.bind(this))
	}

    onSsangClick(comp, info, e)
	{
		//TODO:edit here
		this.koreaView.$ele.fadeTo(1000,0, function() {
            this.koreaView.hide()
            this.modelView.$ele.fadeTo(1000,1)
            this.modelListView.removeAllItems()
            this.carModels
                .filter(item => item.company == 'ssang')
                .forEach(item => {
                this.modelListView.addItem('Source/items/carModelList.lay', [item]); // 각 데이터를 아이템으로 추가
            });
        }.bind(this))
	}

    // ---------------------------------------------------------------------------------




    // --------------------------수입 제조사 클릭 -------------------------------------------

    onTslaClick(comp, info, e)
	{

		//TODO:edit here
		 this.aboardView.$ele.fadeTo(1000,0, function() {
            this.aboardView.hide()
            this.modelView.$ele.fadeTo(1000,1)

            this.modelListView.removeAllItems()
            this.carModels
                .filter(item => item.company == 'tsla')
                .forEach(item => {
                this.modelListView.addItem('Source/items/carModelList.lay', [item]); // 각 데이터를 아이템으로 추가
            });
        }.bind(this))

	}
    
	onRollsClick(comp, info, e)
	{
		//TODO:edit here
		this.aboardView.$ele.fadeTo(1000,0, function() {
            this.aboardView.hide()
            this.modelView.$ele.fadeTo(1000,1)

            this.modelListView.removeAllItems()
            this.carModels
                .filter(item => item.company == 'rolls')
                .forEach(item => {
                this.modelListView.addItem('Source/items/carModelList.lay', [item]); // 각 데이터를 아이템으로 추가
            });
        }.bind(this))


	}


     // --------------------------화물차 클릭 -------------------------------------------
    onHyundaiTruckClick(comp, info, e)
	{
		//TODO:edit here
		this.truckView.$ele.fadeTo(1000,0, function() {
            this.truckView.hide()
            this.modelView.$ele.fadeTo(1000,1)

            this.modelListView.removeAllItems()
            this.carModels
                .filter(item => item.company == 'hyundaiTruck')
                .forEach(item => {
                this.modelListView.addItem('Source/items/carModelList.lay', [item]); // 각 데이터를 아이템으로 추가
            });
        }.bind(this))


	}


    // ------------------------------------------------------------------------------------
    onCarModelClick(data)
	{
        //TODO:edit here
        this.modelView.$ele.fadeTo(1000,0, function() {
            this.modelView.hide()
            this.yearView.$ele.fadeTo(1000,1)
            this.carYearImage.setImage(data.pic)

            console.log(data)

            this.yearlistView.$ele.parent().css('overflow', 'auto')

            this.yearData = Object.entries(data.year).map(([year, data]) => {
                return { year: year, pic: data.pic };
            });
            this.yearList.removeAllItems()
            this.yearData.forEach(year => {
                this.yearList.addItem('Source/items/carYearList.lay', [year])
            })
        }.bind(this))
	}


    onCarYearClick(uri) {
        this.carYearImage.$ele.fadeTo(500,0.5, function() {
            this.carYearImage.setImage(uri)
            this.carYearImage.$ele.fadeTo(500,1)
        }.bind(this))
    }

    
	onchatBtnClick(comp, info, e)
	{

		//TODO:edit here
      
        const wnd = new AWindow('chatWindow');

        // 윈도우 옵션을 설정합니다. (옵션은 필요에 따라 조정하세요)
        wnd.setWindowOption({
            isModal: true,             // 모달로 띄울지 여부
            isDraggable: true,         // 드래그 가능 여부
            isResizable: true          // 리사이즈 가능 여부
        });

        // WN_chat.lay 파일을 오픈합니다.
        // open 함수는 비동기이므로 then을 사용하여 로드 완료 후 작업을 수행할 수 있습니다.
        wnd.open('Source/windows/WN_chat.lay', null, 100, 100, 400, 300).then(() => {
            // 윈도우가 로드된 후 추가 작업을 수행할 수 있습니다.
            var view = wnd.getView();
            // 예: 특정 컴포넌트의 텍스트를 설정
            // view.someComponent.setText('Hello, World!');
        });

	}
}

