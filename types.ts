
export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface MatchUpdate {
  content: string;
  sources: GroundingChunk[];
  timestamp: Date;
}

export enum SportCategory {
  ALL = 'All',
  FOOTBALL = 'Football',
  CRICKET = 'Cricket',
  BASKETBALL = 'Basketball',
  TENNIS = 'Tennis'
}