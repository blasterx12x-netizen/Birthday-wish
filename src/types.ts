export type PageId =
  | 'entry'
  | 'hub'
  | 'surprise'
  | 'games'
  | 'message'
  | 'unexpected'
  | 'finale';

export type MiniGameId = 'catch-hearts' | 'pop-balloons' | 'memory' | 'guess-gift';

export interface SurpriseCardData {
  id: string;
  category: 'compliment' | 'prediction' | 'wish';
  title: string;
  content: string;
}
