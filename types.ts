
export interface CollageImage {
  id: string;
  url: string;
  file: File;
  filter?: string;
}

export interface TextLayer {
  id: string;
  text: string;
  color: string;
  fontSize: number;
  x: number;
  y: number;
}

export interface StickerLayer {
  id: string;
  emoji: string;
  x: number;
  y: number;
}

export interface CollageSettings {
  spacing: number;
  borderRadius: number;
  backgroundColor: string;
  aspectRatio: string;
}
