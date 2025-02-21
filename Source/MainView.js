
MainView = class MainView extends AView
{
	constructor()
	{
		super()

		//TODO:edit here
       this.brand = '';
       this.carModels = [

        // ----------------제네시스--------------------------
        { company : "genesis", name : "EQ900L", pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20210524_21%2Fauto_1621816203059aFjc0_PNG%2F20210524092812_UMfkVcKB.png"},
        { company : "genesis", name : "EQ900", pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20210524_153%2Fauto_1621816491077bS1tu_PNG%2F20210524093427_JigfANZf.png"},
        { company : "genesis", name : "G90 LWB", pic : "Assets/carLogos/genesis/aaa.png", year : { 
            2019 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20200128_56%2Fauto_1580191033736FMpg9_PNG%2F20200128145711_ROl9jcAR.png"}, 
            2020 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20201214_243%2Fauto_1607924362360bd3y4_PNG%2F20201214143907_dlc866GD.png"},
            2021 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20200626_70%2Fauto_1593151681603D2PSa_PNG%2F20200626150700_huPUOjhS.png"},
            2022 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20211214_182%2Fauto_163944496799798by8_PNG%2F20211214102237_s8eSKKgG.png"
            }, 2023 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20230324_160%2Fauto_1679619181182yY3SC_PNG%2F20230324095253_Je3OVM6Z.png"
            }, 2024 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20240321_124%2Fauto_1710984884107Qk75x_PNG%2F20240321103437_U1QpcxoH.png"
            }        }},
        { company : "genesis", name : "G90", pic : "Assets/carLogos/genesis/g90.png", year : { 
            2019 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20190825_151%2Fauto_15666923148746cOYI_PNG%2F20190825091832_uOu7fPc4.png"}, 
            2020 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20201214_147%2Fauto_1607923082253G5fTz_PNG%2F20201214141745_GoqrLWk4.png"},
            2021 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20200626_198%2Fauto_15931521656305d3CK_PNG%2F20200626151556_9h2BMYs8.png"},
            2022 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20230324_160%2Fauto_1679624211298KSP3A_PNG%2F20230324111649_zFrLJhKb.png"
            }, 2023 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20230324_34%2Fauto_1679624237978NqBmN_PNG%2F20230324111716_eahK4pa8.png"
            }, 2024 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20240321_37%2Fauto_1710985403628e0sDy_PNG%2F20240321104315_nN8nvjKl.png"
            }        }},
        { company : "genesis", name : "GV80 쿠페", pic : "Assets/carLogos/genesis/gv80co.png"},
        { company : "genesis", name : "GV80", pic : "Assets/carLogos/genesis/gv80.png"},
        { company : "genesis", name : "G80 일렉트리파이드", pic : "Assets/carLogos/genesis/G80ele.png"},
        { company : "genesis", name : "G80", pic : "Assets/carLogos/genesis/g80.png", year : { 
            2019 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20200128_56%2Fauto_1580191033736FMpg9_PNG%2F20200128145711_ROl9jcAR.png"}, 
            2020 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20201214_243%2Fauto_1607924362360bd3y4_PNG%2F20201214143907_dlc866GD.png"},
            2021 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20200626_70%2Fauto_1593151681603D2PSa_PNG%2F20200626150700_huPUOjhS.png"},
            2022 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20211214_182%2Fauto_163944496799798by8_PNG%2F20211214102237_s8eSKKgG.png"
            }, 2023 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20230324_160%2Fauto_1679619181182yY3SC_PNG%2F20230324095253_Je3OVM6Z.png"
            }, 2024 : {
                pic : "https://search.pstatic.net/common?type=f&size=298x140&quality=95&direct=true&ttype=input&src=https%3A%2F%2Fimgauto-phinf.pstatic.net%2F20240321_124%2Fauto_1710984884107Qk75x_PNG%2F20240321103437_U1QpcxoH.png"
            }        }},
        { company : "genesis", name : "GV70 일렉트리파이드", pic : "Assets/carLogos/genesis/gv70ele.png"},
        { company : "genesis", name : "GV70", pic : "Assets/carLogos/genesis/gv70.png"},
        { company : "genesis", name : "G70", pic : "Assets/carLogos/genesis/g70.png"},
        { company : "genesis", name : "G70 슈팅브레이크", pic : "Assets/carLogos/genesis/g70st.png"},
        { company : "genesis", name : "GV60", pic : "Assets/carLogos/genesis/gv60.png"},


        // ----------------------------현대----------------------------------
        { company : "hyundai", name : "투싼", pic : "Assets/carLogos/hyundai/tusan.png"},
        { company : "hyundai", name : "스타리아", pic : "Assets/carLogos/hyundai/staria.png"},
        { company : "hyundai", name : "아반떼 하이브리드", pic : "Assets/carLogos/hyundai/avantehy.png"},
        { company : "hyundai", name : "코나", pic : "Assets/carLogos/hyundai/kona.png"},
        { company : "hyundai", name : "포터2", pic : "Assets/carLogos/hyundai/poter.png"},
        { company : "hyundai", name : "베뉴", pic : "Assets/carLogos/hyundai/venupng.png"},
        { company : "hyundai", name : "아반떼", pic : "Assets/carLogos/hyundai/avante.png"},
        { company : "hyundai", name : "캐스퍼", pic : "Assets/carLogos/hyundai/casper.png"},

        // ----------------------------기아----------------------------------
        { company : "kia", name : "스포티지", pic : "Assets/carLogos/kia/sportge.png"},
        { company : "kia", name : "니로 하이브리드", pic : "Assets/carLogos/kia/nirohy.png"},
        { company : "kia", name : "레이 EV", pic : "Assets/carLogos/kia/layev.png"},
        { company : "kia", name : "K5", pic : "Assets/carLogos/kia/k5.png"},
        { company : "kia", name : "셀토스", pic : "Assets/carLogos/kia/seltos.png"},
        { company : "kia", name : "봉고3", pic : "Assets/carLogos/kia/bonggo.png"},
        { company : "kia", name : "레이", pic : "Assets/carLogos/kia/lay.png"},
        { company : "kia", name : "모닝", pic : "Assets/carLogos/kia/moning.png"},


        // -----------------------------르노 ---------------------------------
        { company : "rno", name : "마스터", pic : "Assets/carLogos/rno/master.png"},

        // -----------------------------쉐보레-----------------------------------
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

        // ----------------------------롤스로이스----------------------------------
        { company : "rolls", name : "팬텀 EWB", pic : "Assets/carLogos/rolls/phantomEWB.png"},
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
        { company : "rolls", name : "컬리넌 블랙배지", pic : "Assets/carLogos/rolls/culiBlack.png"},
        { company : "rolls", name : "컬리넌", pic : "Assets/carLogos/rolls/culi.png"},
        { company : "rolls", name : "스펙터", pic : "Assets/carLogos/rolls/spector.png"},
        { company : "rolls", name : "고스트 블랙배지", pic : "Assets/carLogos/rolls/ghostBlack.png"},
        { company : "rolls", name : "고스트 EWB", pic : "Assets/carLogos/rolls/ghostEWB.png"},
        { company : "rolls", name : "고스트", pic : "Assets/carLogos/rolls/ghost.png"},

        // ----------------------------테슬라----------------------------------
        { company : "tsla", name : "모델X", pic : "Assets/carLogos/tsla/x.png"},
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
        { company : "tsla", name : "모델3", pic : "Assets/carLogos/tsla/3.png"}
  
       ]

	}

	init(context, evtListener)
	{
		super.init(context, evtListener)

		//TODO:edit here

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

    // ------------------------------------------------------------------------------------
    onCarModelClick(data)
	{
        //TODO:edit here
        this.modelView.$ele.fadeTo(1000,0, function() {
            this.modelView.hide()
            this.yearView.$ele.fadeTo(1000,1)
            this.carYearImage.setImage(data.pic)

            console.log(data)

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
}

