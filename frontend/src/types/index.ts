export interface SlideStyle {
  theme: "blue" | "dark" | "minimal";
  font: "sans" | "serif";
}

export interface Slide {
  id: string;
  title: string;
  bullets: string[];
  layout: "title-only" | "title-bullets" | "title-image" | "blank";
  style: SlideStyle;
  prompt: string;
}

export interface OutlineItem {
  index: number;
  title: string;
  slide_count: number;
}

export interface ProjectRecord {
  id: string;
  deviceId: string;
  title: string;
  slides: Slide[];
  createdAt: string;
  updatedAt: string;
}
