export interface TStoryStill {
  src: string
  alt: string
}

export const STORY_STILLS: Record<string, TStoryStill[]> = {
  'kr-easy-01': [{ src: '/images/stills/kr-easy-01.png', alt: '韩智恩剧照' }],
  'us-easy-01': [{ src: '/images/stills/us-easy-01.png', alt: '瑞秋·格林剧照' }],
  'kr-medium-01': [{ src: '/images/stills/kr-medium-01.png', alt: '千颂伊剧照' }],
  'us-medium-01': [{ src: '/images/stills/us-medium-01.png', alt: '麦克斯·布莱克剧照' }],
  'kr-hard-01': [{ src: '/images/stills/kr-hard-01.png', alt: '成德善剧照' }],
  'us-hard-01': [{ src: '/images/stills/us-hard-01.png', alt: '艾丽西亚·弗洛里克剧照' }],
}

export const STORY_REVEAL_KEYWORDS: Record<string, string[]> = {
  'kr-easy-01': ['韩智恩', '宋慧乔', '李英宰', '浪漫满屋'],
  'us-easy-01': ['瑞秋', 'Rachel', '安妮斯顿', '老友记'],
  'kr-medium-01': ['千颂伊', '全智贤', '都敏俊', '来自星星的你'],
  'us-medium-01': ['麦克斯', 'Max', 'Kat', '破产姐妹'],
  'kr-hard-01': ['成德善', '李惠利', '请回答1988', '双门洞'],
  'us-hard-01': ['艾丽西亚', 'Alicia', 'Julianna', '傲骨贤妻'],
}
