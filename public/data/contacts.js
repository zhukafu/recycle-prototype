/* ===========================================================
 *  共享数据缓存（window._AL_PRODUCTS）
 *  - 在每个使用数据的 HTML 中通过 <script src="data/contacts.js"> 引入
 *  - 每次页面刷新 / 跳转都会重新执行本脚本，重新填充 window 缓存
 *  - 多个页面（category / search-results / product / contactors 等）共享同一份数据
 *  - 通过 window._AL_PRODUCTS 访问；按 id 检索 / 按 cat 分类
 *  =========================================================== */
(function () {
  'use strict';

  // 防止被覆盖：检测已有数据并合并
  const existing = Array.isArray(window._AL_PRODUCTS) ? window._AL_PRODUCTS : [];

  // 当前加载时间戳（用于页面感知数据新鲜度）
  window._AL_DATA_LOADED_AT = new Date().toISOString();

  // 5 个分类对应的真实产品图（已下载到 public/images/products/ 本地加载）
  window._AL_CAT_IMG = {
    contactor: '/images/products/cat-contactor.png',
    breaker:   '/images/products/cat-breaker.png',
    relay:     '/images/products/cat-relay.png',
    button:    '/images/products/cat-button.png',
    switch:    '/images/products/cat-switch.png'
  };

  // 接触器分类常量
  window._AL_CAT_LABEL = { contactor: '接触器', breaker: '断路器', relay: '继电器', button: '按钮开关', switch: '隔离开关' };
  window._AL_CAT_COLOR = { contactor: 'green', breaker: 'amber', relay: 'cyan', button: 'slate', switch: 'purple' };

  // 数据源（含 category.html 中的 7 张卡片 + 搜索页 22 条扩展数据）
  // img 字段为本地 / 网络地址；缺省时回退到 _AL_CAT_IMG
  const PRODUCTS = [
    // ============== category.html 中的接触器分类卡片 ==============
    { id: 'c1', cat: 'contactor', model: '【老款】CJX2-9511', brand: '正泰', spec: 'AC380V 95A 老款设计', silver: '8.2g', price: '190.46', stock: '现货', tag: '老款',
      img: '/【老款】CJX2-9511 .jpg',
      silverCopperPrice: '185.60',
      unitWeight: [{name:'银触点',weight:'8.2g',purity:'88%',value:'45.92'},{name:'铜线圈',weight:'185g',purity:'99%',value:'13.69'},{name:'铜排',weight:'42g',purity:'98%',value:'3.11'}],
      desc: '正泰老款 CJX2-9511 交流接触器，AC380V/95A 大电流规格，老款工艺、扎实耐用，是工业配电柜中的经典型号，银触点含量高，回收价值优秀。' },
    { id: 'c2', cat: 'contactor', model: '【新款】CJX2-9511', brand: '正泰', spec: 'AC380V 95A 新款设计', silver: '7.5g', price: '166.64', stock: '现货', tag: '新款',
      img: '/【新款】CJX2-9511 .jpg',
      silverCopperPrice: '162.30',
      unitWeight: [{name:'银触点',weight:'7.5g',purity:'85%',value:'42.00'},{name:'铜线圈',weight:'178g',purity:'99%',value:'13.17'},{name:'铜排',weight:'38g',purity:'98%',value:'2.81'}],
      desc: '正泰新款 CJX2-9511 交流接触器，AC380V/95A，新款外观工艺升级，触点银含量略低于老款但整体回收价稳定。' },
    { id: 'c3', cat: 'contactor', model: '【老款】CJX2-9511', brand: '正泰', spec: 'AC380V 95A 工厂库存', silver: '9.0g', price: '215.88', stock: '现货', tag: '老款高银',
      img: '/【老款】CJX2-9511.jpg',
      silverCopperPrice: '210.50',
      unitWeight: [{name:'银触点',weight:'9.0g',purity:'92%',value:'50.40'},{name:'铜线圈',weight:'195g',purity:'99%',value:'14.43'},{name:'铜排',weight:'48g',purity:'98%',value:'3.55'}],
      desc: '正泰老款 CJX2-9511 工厂库存版本，含银量更高（9.0g），触点厚实、线圈铜质好，回收价最可观。' },
    { id: 'c4', cat: 'contactor', model: '【老款】CJX2-8011', brand: '正泰', spec: 'AC380V 80A 老款', silver: '6.0g', price: '160.00', stock: '现货', tag: '老款',
      img: '/【老款】CJX2-8011 .jpg',
      silverCopperPrice: '155.20',
      unitWeight: [{name:'银触点',weight:'6.0g',purity:'85%',value:'33.60'},{name:'铜线圈',weight:'152g',purity:'99%',value:'11.25'},{name:'铜排',weight:'35g',purity:'98%',value:'2.59'}],
      desc: '正泰老款 CJX2-8011 交流接触器，AC380V/80A，老款经典规格，常见于大功率电机启停柜。' },
    { id: 'c5', cat: 'contactor', model: '【新款22年以后】CJX2-...', brand: '正泰', spec: '2022 年后新款系列', silver: '5.5g', price: '97.89', stock: '现货', tag: '22款',
      img: '/【新款22年以后】CJX2-... .jpg',
      silverCopperPrice: '92.80',
      unitWeight: [{name:'银触点',weight:'5.5g',purity:'78%',value:'30.80'},{name:'铜线圈',weight:'128g',purity:'99%',value:'9.47'},{name:'铜排',weight:'28g',purity:'98%',value:'2.07'}],
      desc: '正泰 2022 年以后新款接触器，新工艺、新结构，触点含银量相对减少，更适合自动化设备大批量采购。' },
    { id: 'c6', cat: 'contactor', model: '【老款22年以前】CJX2-...', brand: '正泰', spec: '2022 年前老款系列', silver: '7.0g', price: '122.25', stock: '现货', tag: '老款',
      img: '/【老款22年以前】CJX2-... .jpg',
      silverCopperPrice: '118.50',
      unitWeight: [{name:'银触点',weight:'7.0g',purity:'82%',value:'39.20'},{name:'铜线圈',weight:'145g',purity:'99%',value:'10.73'},{name:'铜排',weight:'32g',purity:'98%',value:'2.37'}],
      desc: '正泰 2022 年以前老款接触器，含银量较高，是回收商重点关注的对象，市场流通量大。' },
    { id: 'c7', cat: 'contactor', model: '【铁底座】CJX2-5011', brand: '正泰', spec: 'AC380V 50A 铁底座', silver: '4.0g', price: '', stock: '询价', tag: '铁底座',
      img: '/【铁底座】CJX2-5011 .jpg',
      silverCopperPrice: '82.50',
      unitWeight: [{name:'银触点',weight:'4.0g',purity:'80%',value:'22.40'},{name:'铜线圈',weight:'95g',purity:'99%',value:'7.03'},{name:'铜排',weight:'22g',purity:'98%',value:'1.63'}],
      desc: '正泰【铁底座】CJX2-5011 接触器，AC380V/50A，铁质底座、扎实耐用，价格随行情波动，需询价。' },

    // ============== contactors.html "最新上架" 8 张卡片 ==============
    { id: 'c8', cat: 'contactor', model: '交流接触器 CJX2-1210', brand: '正泰', spec: 'AC220V 12A 3P+1NC', silver: '0.8g', price: '28.50', stock: '会员', tag: '直流接触器',
      title: '正泰交流接触器 CJX2-1210',
      subtitle: '12A 小电流规格 · 3 主触点 + 1 辅助',
      img: '/交流接触器CJX2-1210.jpg',
      silverCopperPrice: '28.50',
      unitWeight: [{name:'银触点',weight:'0.8g',purity:'85%',value:'4.48'},{name:'铜线圈',weight:'45g',purity:'99%',value:'3.33'},{name:'铜排',weight:'12g',purity:'98%',value:'0.89'}],
      desc: '正泰 CJX2-1210 交流接触器，AC220V/12A 小电流规格，3 主触点 + 1 辅助触点，结构紧凑，适用于小功率电机控制。需开通会员查看完整回收价。' },
    { id: 'c9', cat: 'contactor', model: '41标接触器（5个）', brand: '正泰', spec: '41标 5个装', silver: '6.0g', price: '380.00', stock: '会员', tag: '钨钢类',
      title: '41 标接触器 5 个装',
      subtitle: '正泰钨钢类批量组 · 工厂直发装',
      img: '/41标接触器 5个.jpg',
      silverCopperPrice: '380.00',
      unitWeight: [{name:'银触点×5',weight:'6.0g',purity:'80%',value:'33.60'},{name:'铜线圈×5',weight:'285g',purity:'99%',value:'21.09'},{name:'钨钢片',weight:'35g',purity:'钨钢',value:'8.40'}],
      desc: '41 标接触器 5 个装批次，钨钢类材质，含银量较高，是回收商的热门品类。需开通会员查看详细价。' },
    { id: 'c10', cat: 'contactor', model: '交流接触器 CJX2-1210', brand: '正泰', spec: 'AC220V 12A 钨钢类', silver: '0.9g', price: '32.80', stock: '会员', tag: '钨钢类',
      title: '正泰 CJX2-1210 钨钢版',
      subtitle: '钨钢触点 · 高耐磨长寿命',
      img: '/交流接触器.jpg',
      silverCopperPrice: '32.80',
      unitWeight: [{name:'钨银触点',weight:'0.9g',purity:'钨银',value:'6.80'},{name:'铜线圈',weight:'45g',purity:'99%',value:'3.33'},{name:'铜排',weight:'12g',purity:'98%',value:'0.89'}],
      desc: '正泰 CJX2-1210 交流接触器，钨钢材质版本，AC220V/12A，触点耐磨、寿命长，适合高频次切换场合。' },
    { id: 'c11', cat: 'breaker', model: 'ZJW20-400A', brand: '正泰', spec: '400A 银触点专用', silver: '12.0g', price: '420.00', stock: '会员', tag: '银触点价格',
      title: '正泰 ZJW20-400A 大电流',
      subtitle: '400A 空气开关 · 含银 12g',
      img: '/ZJW20-400A.jpg',
      silverCopperPrice: '420.00',
      unitWeight: [{name:'银触点',weight:'12.0g',purity:'85%',value:'67.20'},{name:'铜排',weight:'320g',purity:'99%',value:'23.68'},{name:'铜线圈',weight:'180g',purity:'99%',value:'13.32'}],
      desc: '正泰 ZJW20-400A 大电流空气开关，400A 额定电流，主触点含银量高达 12g，回收价值极高，电力系统常用。' },
    { id: 'c12', cat: 'breaker', model: '银触点价格 - 断路器', brand: '施耐德', spec: '银触点专用断路器', silver: '5.5g', price: '156.00', stock: '现货', tag: '银触点价格',
      title: '施耐德银触点专用断路器',
      subtitle: '主触点含银 5.5g · 现货可发',
      img: '/银触点价格 断路器.jpg',
      silverCopperPrice: '148.50',
      unitWeight: [{name:'银触点',weight:'5.5g',purity:'85%',value:'30.80'},{name:'铜排',weight:'165g',purity:'99%',value:'12.21'},{name:'灭弧栅',weight:'28g',purity:'铜合金',value:'2.80'}],
      desc: '施耐德银触点专用断路器型号，主触点银含量 5.5g，回收参考价 ¥156，可直接交易。' },
    { id: 'c13', cat: 'breaker', model: '银触点价格 - 八爪', brand: '德力西', spec: '八爪银触点结构', silver: '3.8g', price: '108.60', stock: '会员', tag: '银触点价格',
      title: '德力西八爪银触点断路器',
      subtitle: '多触点结构 · 电流分布更均匀',
      img: '/银触点价格 八爪...jpg',
      silverCopperPrice: '108.60',
      unitWeight: [{name:'银触点×8',weight:'3.8g',purity:'82%',value:'21.28'},{name:'铜排',weight:'128g',purity:'99%',value:'9.47'},{name:'灭弧栅',weight:'22g',purity:'铜合金',value:'2.20'}],
      desc: '德力西八爪银触点结构断路器，独特的多触点设计，电流分布更均匀，含银量 3.8g，回收价需开通会员查看。' },
    { id: 'c14', cat: 'breaker', model: '银触点价格 - 断路器', brand: '德力西', spec: '标准银触点断路器', silver: '4.2g', price: '115.80', stock: '会员', tag: '银触点价格',
      title: '德力西标准银触点断路器',
      subtitle: '含银 4.2g · 配电柜常备型号',
      img: '/银触点价格 断路器-2.jpg',
      silverCopperPrice: '115.80',
      unitWeight: [{name:'银触点',weight:'4.2g',purity:'85%',value:'23.52'},{name:'铜排',weight:'142g',purity:'99%',value:'10.51'},{name:'灭弧栅',weight:'25g',purity:'铜合金',value:'2.50'}],
      desc: '德力西标准银触点断路器，4.2g 含银量，性能稳定可靠，电力配电柜常见型号。' },
    { id: 'c15', cat: 'contactor', model: '交流接触器 CJX1-0910', brand: '正泰', spec: 'AC220V 9A 银触点', silver: '1.0g', price: '38.00', stock: '现货', tag: '银触点价格',
      title: '正泰 CJX1-0910 银触点版',
      subtitle: 'AC220V/9A · 含银 1.0g',
      img: '/交流接触器CJX1-0910.jpg',
      silverCopperPrice: '35.20',
      unitWeight: [{name:'银触点',weight:'1.0g',purity:'85%',value:'5.60'},{name:'铜线圈',weight:'38g',purity:'99%',value:'2.81'},{name:'铜排',weight:'10g',purity:'98%',value:'0.74'}],
      desc: '正泰 CJX1-0910 交流接触器，AC220V/9A 小电流规格，银触点材质，回收参考价 ¥38/件。' },

    // ============== 接触器数据库左侧导航 + 顶部标签的真实产品数据 ==============
    { id: 'c16', cat: 'contactor', model: 'SC-E03', brand: '富士', spec: 'AC220V 11A 3P+1NC', silver: '1.0g', price: '42.00', stock: '现货', tag: 'CJX2',
      img: '/images/products/c16-fuji-sc-e03.png',
      silverCopperPrice: '38.50', unitWeight: [{name:'银触点',weight:'1.0g',purity:'85%',value:'5.60'},{name:'铜线圈',weight:'42g',purity:'99%',value:'3.11'},{name:'铜排',weight:'11g',purity:'98%',value:'0.81'}],
      desc: '富士 SC-E03 交流接触器，AC220V/11A，日系原装进口，性能稳定可靠，主触点含银 1g，回收参考价 ¥42。' },
    { id: 'c17', cat: 'contactor', model: 'S-T21', brand: '三菱', spec: 'AC220V 20A 3P+1NC', silver: '1.5g', price: '85.00', stock: '现货', tag: 'CJX2',
      img: '/images/products/c17-mitsubishi-s-t21.png',
      silverCopperPrice: '78.60', unitWeight: [{name:'银触点',weight:'1.5g',purity:'88%',value:'8.40'},{name:'铜线圈',weight:'65g',purity:'99%',value:'4.81'},{name:'铜排',weight:'18g',purity:'98%',value:'1.33'}],
      desc: '三菱 S-T21 交流接触器，AC220V/20A，三菱原装进口品质，触点含银 1.5g，工业自动化常用型号。' },
    { id: 'c18', cat: 'contactor', model: 'S-P21', brand: '士林', spec: 'AC220V 20A 3P+1NC', silver: '1.3g', price: '38.00', stock: '现货', tag: 'CJX2',
      img: '/images/products/c18-shilin-s-p21.png',
      silverCopperPrice: '35.80', unitWeight: [{name:'银触点',weight:'1.3g',purity:'85%',value:'7.28'},{name:'铜线圈',weight:'62g',purity:'99%',value:'4.59'},{name:'铜排',weight:'16g',purity:'98%',value:'1.18'}],
      desc: '士林 S-P21 交流接触器，AC220V/20A，台系品牌，性价比高，触点含银 1.3g。' },
    { id: 'c19', cat: 'contactor', model: 'XTCE015B', brand: '伊顿', spec: 'AC220V 15A 3P', silver: '1.2g', price: '125.00', stock: '现货', tag: 'CJX2',
      img: '/images/products/c19-eaton-xtce.png',
      silverCopperPrice: '118.20', unitWeight: [{name:'银触点',weight:'1.2g',purity:'85%',value:'6.72'},{name:'铜线圈',weight:'58g',purity:'99%',value:'4.29'},{name:'铜排',weight:'15g',purity:'98%',value:'1.11'}],
      desc: '伊顿 XTCE015B 交流接触器，AC220V/15A，美系品牌，全铜线圈、银触点，进口工业级。' },
    { id: 'c20', cat: 'contactor', model: '3RT2015', brand: '西门子', spec: 'AC220V 15A 3P+1NC', silver: '1.4g', price: '168.00', stock: '现货', tag: 'CJX2',
      img: '/images/products/c20-siemens-3rt.png',
      silverCopperPrice: '158.50', unitWeight: [{name:'银触点',weight:'1.4g',purity:'88%',value:'7.84'},{name:'铜线圈',weight:'60g',purity:'99%',value:'4.44'},{name:'铜排',weight:'16g',purity:'98%',value:'1.18'}],
      desc: '西门子 3RT2015 交流接触器，AC220V/15A，德国原装进口，SIRIUS 系列经典型号。' },
    { id: 'c21', cat: 'breaker', model: 'CM1-100M', brand: '常熟', spec: '3P 100A 塑壳断路器', silver: '0.0g', price: '155.00', stock: '现货', tag: '断路器',
      img: '/images/products/c21-changshu-cm1.png',
      silverCopperPrice: '65.00', unitWeight: [{name:'铜排',weight:'280g',purity:'99%',value:'20.72'},{name:'铜线圈',weight:'95g',purity:'99%',value:'7.03'},{name:'铁芯',weight:'120g',purity:'硅钢',value:'2.40'}],
      desc: '常熟 CM1-100M 塑壳断路器，3P 100A，国产品牌，性价比高，机房配电柜常用型号。' },
    { id: 'c22', cat: 'breaker', model: 'RDX1-63', brand: '人民电器', spec: '3P C63 小型断路器', silver: '0.0g', price: '25.00', stock: '现货', tag: '断路器',
      img: '/images/products/c22-people-rdx1.png',
      silverCopperPrice: '12.50', unitWeight: [{name:'铜排',weight:'48g',purity:'99%',value:'3.55'},{name:'铜线圈',weight:'22g',purity:'99%',value:'1.63'},{name:'铁芯',weight:'35g',purity:'硅钢',value:'0.70'}],
      desc: '人民电器 RDX1-63 小型断路器，3P C63，分断能力 6kA，民用配电首选。' },
    { id: 'c23', cat: 'breaker', model: 'RT16-63', brand: '正泰', spec: '熔断器 63A', silver: '0.5g', price: '18.00', stock: '现货', tag: '熔断器',
      img: '/images/products/c23-rt16-fuse.png',
      silverCopperPrice: '15.80', unitWeight: [{name:'银触点',weight:'0.5g',purity:'85%',value:'2.80'},{name:'铜熔片',weight:'28g',purity:'99%',value:'2.07'},{name:'铜底座',weight:'18g',purity:'98%',value:'1.33'}],
      desc: '正泰 RT16-63 螺旋式熔断器，63A 额定电流，触点含银 0.5g，过载保护场合常用。' },
    { id: 'c24', cat: 'breaker', model: 'DW17-1600', brand: '人民电器', spec: '万能断路器 1600A', silver: '15.0g', price: '1280.00', stock: '期货', tag: '万能断路器',
      img: '/images/products/c24-dw17-acb.png',
      silverCopperPrice: '1250.00', unitWeight: [{name:'银触点',weight:'15.0g',purity:'88%',value:'84.00'},{name:'铜排',weight:'680g',purity:'99%',value:'50.32'},{name:'铜线圈',weight:'320g',purity:'99%',value:'23.68'}],
      desc: '人民电器 DW17-1600 万能式断路器，1600A 大电流，含银量 15g，电力系统主进线柜专用。' },
    { id: 'c25', cat: 'contactor', model: 'GMC-25', brand: '产电', spec: 'AC220V 25A 3P', silver: '1.4g', price: '52.00', stock: '现货', tag: 'CJX2',
      img: '/images/products/c25-ls-gmc25.png',
      silverCopperPrice: '48.50', unitWeight: [{name:'银触点',weight:'1.4g',purity:'85%',value:'7.84'},{name:'铜线圈',weight:'55g',purity:'99%',value:'4.07'},{name:'铜排',weight:'15g',purity:'98%',value:'1.11'}],
      desc: '产电 GMC-25 交流接触器，AC220V/25A，韩系品牌，质量稳定，触点含银 1.4g。' },
    { id: 'c26', cat: 'switch', model: 'HD11-200', brand: '正泰', spec: '200A 隔离开关', silver: '2.5g', price: '95.00', stock: '现货', tag: '开关',
      img: '/images/products/c26-zhengtai-hd11.png',
      silverCopperPrice: '88.50', unitWeight: [{name:'银触点',weight:'2.5g',purity:'85%',value:'14.00'},{name:'铜排',weight:'185g',purity:'99%',value:'13.69'},{name:'铜接线端',weight:'42g',purity:'98%',value:'3.11'}],
      desc: '正泰 HD11-200 隔离开关，200A 刀开关，触点含银 2.5g，配电柜检修隔离用。' },
    { id: 'c27', cat: 'switch', model: 'HD13-400', brand: '德力西', spec: '400A 隔离开关', silver: '4.5g', price: '180.00', stock: '现货', tag: '开关',
      img: '/images/products/c27-delixi-hd13.png',
      silverCopperPrice: '168.80', unitWeight: [{name:'银触点',weight:'4.5g',purity:'85%',value:'25.20'},{name:'铜排',weight:'350g',purity:'99%',value:'25.90'},{name:'铜接线端',weight:'68g',purity:'98%',value:'5.03'}],
      desc: '德力西 HD13-400 隔离开关，400A 大电流，含银 4.5g，工业配电柜主开关常用。' },
    { id: 'c28', cat: 'switch', model: 'INS-250', brand: '施耐德', spec: '250A 隔离开关', silver: '3.8g', price: '320.00', stock: '现货', tag: '开关',
      img: '/images/products/c28-schneider-ins.png',
      silverCopperPrice: '298.50', unitWeight: [{name:'银触点',weight:'3.8g',purity:'88%',value:'21.28'},{name:'铜排',weight:'280g',purity:'99%',value:'20.72'},{name:'铜接线端',weight:'55g',purity:'98%',value:'4.07'}],
      desc: '施耐德 INS-250 隔离开关，250A 进口品质，含银 3.8g，工业级稳定性。' },
    { id: 'c29', cat: 'contactor', model: 'CJ20-100', brand: '正泰', spec: 'AC380V 100A 3P', silver: '6.5g', price: '285.00', stock: '现货', tag: 'CJ20',
      img: '/images/products/c29-cj20-100.png',
      silverCopperPrice: '275.00', unitWeight: [{name:'银触点',weight:'6.5g',purity:'85%',value:'36.40'},{name:'铜线圈',weight:'168g',purity:'99%',value:'12.43'},{name:'铜排',weight:'55g',purity:'98%',value:'4.07'}],
      desc: '正泰 CJ20-100 交流接触器，AC380V/100A，CJ20 系列经典规格，触点含银 6.5g，回收价值优秀。' },
    { id: 'c30', cat: 'contactor', model: 'CJ20-63', brand: '正泰', spec: 'AC380V 63A 3P', silver: '4.2g', price: '185.00', stock: '现货', tag: 'CJ20',
      img: '/images/products/c30-cj20-63.png',
      silverCopperPrice: '178.00', unitWeight: [{name:'银触点',weight:'4.2g',purity:'85%',value:'23.52'},{name:'铜线圈',weight:'125g',purity:'99%',value:'9.25'},{name:'铜排',weight:'42g',purity:'98%',value:'3.11'}],
      desc: '正泰 CJ20-63 交流接触器，AC380V/63A，CJ20 系列中电流规格。' },
    { id: 'c31', cat: 'contactor', model: 'J20-100', brand: '正泰', spec: 'AC380V 100A J系列', silver: '5.8g', price: '215.00', stock: '现货', tag: 'J20',
      img: '/images/products/c31-j20-100.png',
      silverCopperPrice: '208.50', unitWeight: [{name:'银触点',weight:'5.8g',purity:'85%',value:'32.48'},{name:'铜线圈',weight:'155g',purity:'99%',value:'11.47'},{name:'铜排',weight:'48g',purity:'98%',value:'3.55'}],
      desc: '正泰 J20-100 交流接触器，AC380V/100A，J 系列老型号，工业场景广泛使用，含银 5.8g。' },
    { id: 'c32', cat: 'contactor', model: 'J20-63', brand: '正泰', spec: 'AC380V 63A J系列', silver: '3.5g', price: '135.00', stock: '现货', tag: 'J20',
      img: '/images/products/c32-j20-63.png',
      silverCopperPrice: '128.50', unitWeight: [{name:'银触点',weight:'3.5g',purity:'85%',value:'19.60'},{name:'铜线圈',weight:'115g',purity:'99%',value:'8.51'},{name:'铜排',weight:'38g',purity:'98%',value:'2.81'}],
      desc: '正泰 J20-63 交流接触器，AC380V/63A，J 系列，回收常见型号。' },

    // ============== 接触器扩展数据 ==============
    { id: 'p1', cat: 'contactor', model: 'CJX2-1810', brand: '正泰', spec: 'AC220V 18A 3P+1NC', silver: '1.2g', price: '38.50', stock: '现货',
      silverCopperPrice: '36.20', unitWeight: [{name:'银触点',weight:'1.2g',purity:'85%',value:'6.72'},{name:'铜线圈',weight:'52g',purity:'99%',value:'3.85'},{name:'铜排',weight:'14g',purity:'98%',value:'1.04'}],
      desc: '正泰 CJX2-1810 交流接触器，适用于 AC220V/50Hz 电路，最大工作电流 18A，3 对常开主触点 + 1 对常开辅助触点。结构紧凑、寿命长，是低压配电与电机控制领域应用最广泛的型号之一。' },
    { id: 'p2', cat: 'contactor', model: 'CJX2-2510', brand: '正泰', spec: 'AC220V 25A 3P+1NC', silver: '1.8g', price: '52.00', stock: '现货',
      silverCopperPrice: '48.80', unitWeight: [{name:'银触点',weight:'1.8g',purity:'85%',value:'10.08'},{name:'铜线圈',weight:'68g',purity:'99%',value:'5.03'},{name:'铜排',weight:'18g',purity:'98%',value:'1.33'}],
      desc: '正泰 CJX2-2510 交流接触器，额定电流 25A，触点银合金材质抗氧化、导电性能优异。常用于工业自动化、电力控制系统。' },
    { id: 'p3', cat: 'contactor', model: 'CJX2-3210', brand: '正泰', spec: 'AC220V 32A 3P+1NC', silver: '2.4g', price: '68.00', stock: '现货',
      silverCopperPrice: '65.50', unitWeight: [{name:'银触点',weight:'2.4g',purity:'85%',value:'13.44'},{name:'铜线圈',weight:'82g',purity:'99%',value:'6.07'},{name:'铜排',weight:'22g',purity:'98%',value:'1.63'}],
      desc: '正泰 CJX2-3210 交流接触器，额定电流 32A，主触点采用高纯度银合金，适合中等功率电机启停控制。' },
    { id: 'p4', cat: 'contactor', model: 'CJX2-4011', brand: '德力西', spec: 'AC380V 40A 3P+1NO+1NC', silver: '3.2g', price: '95.00', stock: '现货',
      silverCopperPrice: '92.00', unitWeight: [{name:'银触点',weight:'3.2g',purity:'85%',value:'17.92'},{name:'铜线圈',weight:'105g',purity:'99%',value:'7.77'},{name:'铜排',weight:'28g',purity:'98%',value:'2.07'}],
      desc: '德力西 CJX2-4011 交流接触器，380V 三相 40A 配置，1 常开 + 1 常闭辅助触点，适用于大功率电机及配电系统。' },
    { id: 'p5', cat: 'contactor', model: 'CJX2-6511', brand: '德力西', spec: 'AC380V 65A 3P+1NO+1NC', silver: '4.5g', price: '168.00', stock: '期货',
      silverCopperPrice: '162.50', unitWeight: [{name:'银触点',weight:'4.5g',purity:'85%',value:'25.20'},{name:'铜线圈',weight:'138g',purity:'99%',value:'10.21'},{name:'铜排',weight:'35g',purity:'98%',value:'2.59'}],
      desc: '德力西 CJX2-6511 大功率交流接触器，65A 额定电流，期货备货，含银量较高，回收价值优秀。' },
    { id: 'p6', cat: 'contactor', model: 'CJX2-8011', brand: '施耐德', spec: 'AC380V 80A 3P+1NO+1NC', silver: '6.0g', price: '320.00', stock: '现货',
      silverCopperPrice: '308.50', unitWeight: [{name:'银触点',weight:'6.0g',purity:'88%',value:'33.60'},{name:'铜线圈',weight:'158g',purity:'99%',value:'11.69'},{name:'铜排',weight:'42g',purity:'98%',value:'3.11'}],
      desc: '施耐德原装 CJX2-8011 大电流交流接触器，80A 容量，全铜线圈、银合金触点，工业级稳定性。' },
    { id: 'p7', cat: 'contactor', model: 'CJX2-9511', brand: '施耐德', spec: 'AC380V 95A 3P+1NO+1NC', silver: '8.2g', price: '485.00', stock: '现货',
      silverCopperPrice: '472.00', unitWeight: [{name:'银触点',weight:'8.2g',purity:'88%',value:'45.92'},{name:'铜线圈',weight:'192g',purity:'99%',value:'14.21'},{name:'铜排',weight:'52g',purity:'98%',value:'3.85'}],
      desc: '施耐德 CJX2-9511 顶级规格交流接触器，95A 大电流，含银量高达 8.2g，回收价值最高。' },
    { id: 'p8', cat: 'contactor', model: 'LC1-D1810', brand: '施耐德', spec: 'AC220V 18A 3P+1NC', silver: '1.4g', price: '78.00', stock: '现货',
      silverCopperPrice: '72.80', unitWeight: [{name:'银触点',weight:'1.4g',purity:'88%',value:'7.84'},{name:'铜线圈',weight:'55g',purity:'99%',value:'4.07'},{name:'铜排',weight:'15g',purity:'98%',value:'1.11'}],
      desc: '施耐德 TeSys D 系列 LC1-D1810，国际通用型号，触点银层厚实可靠，进口品质。' },
    { id: 'p9', cat: 'contactor', model: 'LC1-D2510', brand: '施耐德', spec: 'AC220V 25A 3P+1NC', silver: '2.0g', price: '108.00', stock: '现货',
      silverCopperPrice: '102.50', unitWeight: [{name:'银触点',weight:'2.0g',purity:'88%',value:'11.20'},{name:'铜线圈',weight:'72g',purity:'99%',value:'5.33'},{name:'铜排',weight:'20g',purity:'98%',value:'1.48'}],
      desc: '施耐德 LC1-D2510 TeSys D 系列 25A 接触器，模块化设计、可扩展辅助触点组。' },
    { id: 'p10', cat: 'contactor', model: 'LC1-D3210', brand: '施耐德', spec: 'AC220V 32A 3P+1NC', silver: '2.8g', price: '156.00', stock: '现货',
      silverCopperPrice: '148.50', unitWeight: [{name:'银触点',weight:'2.8g',purity:'88%',value:'15.68'},{name:'铜线圈',weight:'88g',purity:'99%',value:'6.51'},{name:'铜排',weight:'25g',purity:'98%',value:'1.85'}],
      desc: '施耐德 LC1-D3210 TeSys D 系列 32A 接触器，业内口碑款，应用范围广。' },
    { id: 'p11', cat: 'contactor', model: 'LC1-D4011', brand: '施耐德', spec: 'AC380V 40A 3P+1NO+1NC', silver: '3.6g', price: '228.00', stock: '现货',
      silverCopperPrice: '218.50', unitWeight: [{name:'银触点',weight:'3.6g',purity:'88%',value:'20.16'},{name:'铜线圈',weight:'110g',purity:'99%',value:'8.14'},{name:'铜排',weight:'30g',purity:'98%',value:'2.22'}],
      desc: '施耐德 LC1-D4011 TeSys D 系列 380V 40A 接触器，性能稳定可靠。' },
    { id: 'p12', cat: 'contactor', model: 'NXC-25', brand: '人民电器', spec: 'AC220V 25A 3P+1NC', silver: '1.6g', price: '45.00', stock: '现货',
      silverCopperPrice: '42.50', unitWeight: [{name:'银触点',weight:'1.6g',purity:'85%',value:'8.96'},{name:'铜线圈',weight:'62g',purity:'99%',value:'4.59'},{name:'铜排',weight:'16g',purity:'98%',value:'1.18'}],
      desc: '人民电器 NXC-25 交流接触器，性价比高，适用于通用电机控制。' },
    { id: 'p13', cat: 'contactor', model: 'CJ19-2511', brand: '正泰', spec: 'AC380V 25A 切换电容接触器', silver: '1.5g', price: '62.00', stock: '现货',
      silverCopperPrice: '58.50', unitWeight: [{name:'银触点',weight:'1.5g',purity:'85%',value:'8.40'},{name:'铜线圈',weight:'58g',purity:'99%',value:'4.29'},{name:'铜排',weight:'15g',purity:'98%',value:'1.11'}],
      desc: '正泰 CJ19-2511 切换电容接触器，专用抑制涌流设计，电容柜标配。' },

    // ============== 断路器 ==============
    { id: 'p14', cat: 'breaker', model: 'DZ47-63', brand: '正泰', spec: '3P C63 断路器', silver: '0.0g', price: '28.00', stock: '现货',
      silverCopperPrice: '12.80', unitWeight: [{name:'铜排',weight:'52g',purity:'99%',value:'3.85'},{name:'铜线圈',weight:'25g',purity:'99%',value:'1.85'},{name:'铁芯',weight:'38g',purity:'硅钢',value:'0.76'}],
      desc: '正泰 DZ47-63 3P C63 小型断路器，分断能力 6kA，塑料外壳不含银，回收以铜为主。' },
    { id: 'p15', cat: 'breaker', model: 'DZ20-100', brand: '德力西', spec: '3P 100A 塑壳断路器', silver: '0.0g', price: '185.00', stock: '现货',
      silverCopperPrice: '72.50', unitWeight: [{name:'铜排',weight:'295g',purity:'99%',value:'21.83'},{name:'铜线圈',weight:'98g',purity:'99%',value:'7.25'},{name:'铁芯',weight:'125g',purity:'硅钢',value:'2.50'}],
      desc: '德力西 DZ20-100 塑壳断路器，100A 大电流，机房配电柜常用。' },
    { id: 'p16', cat: 'breaker', model: 'NSX160F', brand: '施耐德', spec: '3P 160A 塑壳断路器', silver: '0.0g', price: '680.00', stock: '现货',
      silverCopperPrice: '285.00', unitWeight: [{name:'铜排',weight:'520g',purity:'99%',value:'38.48'},{name:'铜线圈',weight:'165g',purity:'99%',value:'12.21'},{name:'铁芯',weight:'210g',purity:'硅钢',value:'4.20'}],
      desc: '施耐德 NSX160F 塑壳断路器，36kA 分断能力，进口工业级。' },

    // ============== 继电器 ==============
    { id: 'p17', cat: 'relay', model: 'JZX-22F', brand: '人民电器', spec: 'DC24V 8脚小型继电器', silver: '0.3g', price: '8.50', stock: '现货',
      silverCopperPrice: '8.20', unitWeight: [{name:'银触点',weight:'0.3g',purity:'85%',value:'1.68'},{name:'铜线圈',weight:'18g',purity:'99%',value:'1.33'},{name:'铁芯',weight:'12g',purity:'硅钢',value:'0.24'}],
      desc: '人民电器 JZX-22F 小型继电器，DC24V 线圈电压，8 脚直插，PCB 板常用。' },
    { id: 'p18', cat: 'relay', model: 'MY2N', brand: '欧姆龙', spec: 'DC24V 8脚 通用继电器', silver: '0.4g', price: '18.00', stock: '现货',
      silverCopperPrice: '16.50', unitWeight: [{name:'银触点',weight:'0.4g',purity:'88%',value:'2.24'},{name:'铜线圈',weight:'22g',purity:'99%',value:'1.63'},{name:'铁芯',weight:'15g',purity:'硅钢',value:'0.30'}],
      desc: '欧姆龙 MY2N 通用继电器，DPDT 8 脚，国际标准型号，工业级稳定性。' },
    { id: 'p19', cat: 'relay', model: 'HH52P', brand: '正泰', spec: 'AC220V 8脚 中间继电器', silver: '0.3g', price: '12.50', stock: '现货',
      silverCopperPrice: '11.80', unitWeight: [{name:'银触点',weight:'0.3g',purity:'85%',value:'1.68'},{name:'铜线圈',weight:'20g',purity:'99%',value:'1.48'},{name:'铁芯',weight:'14g',purity:'硅钢',value:'0.28'}],
      desc: '正泰 HH52P 中间继电器，AC220V 线圈，8 脚直插，配电柜二次回路常用。' },

    // ============== 按钮 ==============
    { id: 'p20', cat: 'button', model: 'LA38-11', brand: '正泰', spec: 'Φ22 平头自复位按钮', silver: '0.0g', price: '9.50', stock: '现货',
      silverCopperPrice: '5.80', unitWeight: [{name:'铜触点',weight:'3.5g',purity:'99%',value:'0.26'},{name:'铜接线端',weight:'8g',purity:'98%',value:'0.59'},{name:'弹簧',weight:'2g',purity:'不锈钢',value:'0.05'}],
      desc: '正泰 LA38-11 平头自复位按钮，Φ22 标准安装孔，1 常开 + 1 常闭。' },
    { id: 'p21', cat: 'button', model: 'LA4-3H', brand: '施耐德', spec: 'Φ22 急停按钮', silver: '0.0g', price: '32.00', stock: '现货',
      silverCopperPrice: '18.50', unitWeight: [{name:'铜触点',weight:'5.2g',purity:'99%',value:'0.38'},{name:'铜接线端',weight:'12g',purity:'98%',value:'0.89'},{name:'弹簧',weight:'4g',purity:'不锈钢',value:'0.10'}],
      desc: '施耐德 LA4-3H 急停按钮，蘑菇头旋转复位，Φ22 安装，机械自锁。' },
    { id: 'p22', cat: 'button', model: 'XB2-BA31', brand: '施耐德', spec: 'Φ22 绿色启动按钮', silver: '0.0g', price: '15.00', stock: '现货',
      silverCopperPrice: '8.50', unitWeight: [{name:'铜触点',weight:'4.0g',purity:'99%',value:'0.30'},{name:'铜接线端',weight:'10g',purity:'98%',value:'0.74'},{name:'弹簧',weight:'3g',purity:'不锈钢',value:'0.08'}],
      desc: '施耐德 XB2-BA31 绿色启动按钮，Φ22 圆形平头，弹簧复位。' }
  ];

  // 合并去重（避免重复 id；后出现的覆盖前面的）
  const byId = new Map();
  existing.forEach(p => byId.set(p.id, p));
  PRODUCTS.forEach(p => byId.set(p.id, p));
  window._AL_PRODUCTS = Array.from(byId.values());

  // 工具方法：按 id 取单品
  window._AL_getById = function (id) {
    return (window._AL_PRODUCTS || []).find(p => p.id === id) || null;
  };
  // 工具方法：按分类筛
  window._AL_getByCat = function (cat) {
    return (window._AL_PRODUCTS || []).filter(p => !cat || cat === 'all' || p.cat === cat);
  };
  // 工具方法：关键词搜索（型号 / 厂家 / 规格）
  window._AL_search = function (q) {
    const all = window._AL_PRODUCTS || [];
    if (!q) return all;
    const lower = q.toLowerCase();
    return all.filter(p => ['model', 'brand', 'spec'].some(k => (p[k] || '').toLowerCase().includes(lower)));
  };
})();
