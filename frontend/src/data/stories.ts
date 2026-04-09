// 🔥 固定类型定义（完全兼容旧代码）
export interface TStory {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  region: 'domestic' | 'foreign';
  surface: string;
  bottom: string;
  semanticFacts: string[];
  /** 第 6 次提问解锁的关键提示：只描述特征/剧情/穿搭，不出现角色真名或「正确角色是…」 */
  keyHintSpoilerFree: string;
}

// 🔧 旧代码需要的常量：难度分级（入门/进阶/挑战）
export const DIFFICULTIES = [
  { key: 'easy', label: '入门级' },
  { key: 'medium', label: '进阶级' },
  { key: 'hard', label: '挑战级' }
] as const;

// 🔧 旧代码需要的常量：地区分类（国内/国外）
export const REGIONS = [
  // { key: 'domestic', label: '国内影视' }, // 国内入口已禁用，等待题库上线
  { key: 'foreign', label: '国外影视' }
] as const;

// ==================== 1. 入门级题库 (Easy) ====================
export const easyStories: TStory[] = [
  {
    id: 'kr-easy-01',
    title: '浪漫满屋女作家',
    difficulty: 'easy',
    region: 'foreign',
    surface: '活泼开朗的网络小说家，住在豪华别墅，穿搭休闲可爱，和男主有契约婚姻。',
    bottom: '经典韩剧《浪漫满屋》的女主角——韩智恩',
    keyHintSpoilerFree:
      '一位性格活泼开朗的网络小说作者，住在豪华别墅里，穿搭偏休闲可爱，与男主从契约婚姻逐渐走向真情。作品风格偏轻松浪漫。',
    semanticFacts: [
      '正确角色是韩智恩',
      '韩智恩由宋慧乔饰演',
      '角色性别为女',
      '出自韩剧《浪漫满屋》',
      '职业是网络小说家',
      '与男主李英宰是契约结婚',
      '后续与李英宰发展为恋人并在一起',
      '穿搭风格偏休闲可爱，常见亮色系和双马尾造型',
      '不是《太阳的后裔》中的姜暮烟',
      '不是《来自星星的你》中的千颂伊'
    ]
  },
  {
    id: 'us-easy-01',
    title: '老友记时尚千金',
    difficulty: 'easy',
    region: 'foreign',
    surface: '时尚感拉满的富家千金，曾在咖啡店打工，性格娇俏，有过逃婚经历。',
    bottom: '经典美剧《老友记》的女主角——瑞秋·格林（Rachel Green）',
    keyHintSpoilerFree:
      '出身优渥、时尚感拉满的年轻女性，曾在纽约咖啡馆打工，性格娇俏有主见，感情线里有过与「逃婚」相关的情节。',
    semanticFacts: [
      '正确角色是瑞秋·格林（简称Rachel）',
      '瑞秋·格林由詹妮弗·安妮斯顿（Jennifer Aniston）饰演',
      '角色性别为女',
      '出自美剧《老友记》',
      '曾在中央公园咖啡馆打工',
      '有过逃婚剧情',
      '不是《破产姐妹》中的麦克斯'
    ]
  }
];

// ==================== 2. 进阶级题库 (Medium) ====================
export const mediumStories: TStory[] = [
  {
    id: 'kr-medium-01',
    title: '国民女神女演员',
    difficulty: 'medium',
    region: 'foreign',
    surface: '韩国顶级女演员，傲娇又敏感，擅长撒娇，身边有一位神秘的守护者。',
    bottom: '经典韩剧《来自星星的你》的女主角——千颂伊',
    keyHintSpoilerFree:
      '韩国顶级女演员设定，傲娇又敏感、擅长撒娇；身边有一位身份神秘、仿佛「来自别处」的守护者。职场与感情线都围绕顶流明星生活展开。',
    semanticFacts: [
      '正确角色是千颂伊',
      '千颂伊由全智贤饰演',
      '角色性别为女',
      '出自韩剧《来自星星的你》',
      '职业是顶级女演员',
      '身边的守护者是来自外星的都敏俊',
      '不是韩智恩'
    ]
  },
  {
    id: 'us-medium-01',
    title: '毒舌蛋糕师',
    difficulty: 'medium',
    region: 'foreign',
    surface: '性格毒舌直率，擅长做纸杯蛋糕，家境普通却很坚韧。',
    bottom: '经典美剧《破产姐妹》的女主角——麦克斯·布莱克（Max Black）',
    keyHintSpoilerFree:
      '纽约布鲁克林餐厅里的蛋糕师，毒舌直率却心地善良；家境拮据但非常坚韧，纸杯蛋糕是拿手招牌，常穿工作服在餐厅后厨忙碌。',
    semanticFacts: [
      '正确角色是麦克斯·布莱克（简称Max）',
      '麦克斯由凯特·戴琳斯（Kat Dennings）饰演',
      '角色性别为女',
      '出自美剧《破产姐妹》',
      '职业是餐厅蛋糕师',
      '家境贫寒，性格毒舌但内心善良',
      '没有交往过牙医男友'
    ]
  }
];

// ==================== 3. 挑战级题库 (Hard) ====================
export const hardStories: TStory[] = [
  {
    id: 'kr-hard-01',
    title: '双门洞活泼少女',
    difficulty: 'hard',
    region: 'foreign',
    surface: '生活在首尔双门洞，性格大大咧咧，上面有姐姐、下面有弟弟，身边有一群从小一起长大的朋友。',
    bottom: '经典韩剧《请回答1988》的女主角——成德善',
    keyHintSpoilerFree:
      '生活在首尔双门洞胡同里的女孩，性格大大咧咧，家里排行中间，上面有姐姐、下面有弟弟，和一群从小一起长大的玩伴共度青春。',
    semanticFacts: [
      '正确角色是成德善',
      '成德善由李惠利饰演',
      '角色性别为女',
      '出自韩剧《请回答1988》',
      '生活在首尔双门洞',
      '家中有一位亲姐姐（姐姐为长女），本人是二女儿排行中间，还有一位弟弟',
      '不是千颂伊'
    ]
  },
  {
    id: 'us-hard-01',
    title: '职场逆袭女律师',
    difficulty: 'hard',
    region: 'foreign',
    surface: '曾是全职太太，丈夫入狱后重新回归职场，成为一名律师，冷静又坚韧。',
    bottom: '经典美剧《傲骨贤妻》的女主角——艾丽西亚·弗洛里克（Alicia Florrick）',
    keyHintSpoilerFree:
      '曾为全职太太后重返律所，在丈夫卷入政治丑闻入狱后独自扛起家庭与事业，在法庭上冷静、专业又坚韧。',
    semanticFacts: [
      '正确角色是艾丽西亚·弗洛里克（简称Alicia）',
      '艾丽西亚由朱丽安娜·玛格丽丝（Julianna Margulies）饰演',
      '角色性别为女',
      '出自美剧《傲骨贤妻》',
      '职业是律师',
      '丈夫因政治丑闻入狱',
      '不是Rachel，也不是Max'
    ]
  }
];

// 🔧 核心修复：导出旧代码需要的 STORIES（同时保留allStories，双兼容）
export const allStories = [
  ...easyStories,
  ...mediumStories,
  ...hardStories
];

// 给旧代码做别名，完美兼容
export const STORIES = allStories;