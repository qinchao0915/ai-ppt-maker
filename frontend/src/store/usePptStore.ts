import { create } from "zustand";
import type { Slide, OutlineItem, ProjectRecord } from "@/types";

interface PptState {
  // Data
  slides: Slide[];
  outline: OutlineItem[] | null;
  currentProject: ProjectRecord | null;
  selectedSlideIndex: number;
  // UI State
  isGeneratingOutline: boolean;
  isGeneratingSlides: boolean;
  generatingSlideIds: Set<string>;
  description: string;
  // Actions
  setDescription: (desc: string) => void;
  setOutline: (outline: OutlineItem[]) => void;
  setSlides: (slides: Slide[]) => void;
  appendSlide: (slide: Slide) => void;
  updateSlide: (id: string, patch: Partial<Slide>) => void;
  selectSlide: (index: number) => void;
  setIsGeneratingOutline: (v: boolean) => void;
  setIsGeneratingSlides: (v: boolean) => void;
  setSlideGenerating: (id: string, v: boolean) => void;
  loadProject: (project: ProjectRecord) => void;
  setCurrentProject: (project: ProjectRecord | null) => void;
  reset: () => void;
}

const initialState = {
  slides: [] as Slide[],
  outline: null as OutlineItem[] | null,
  currentProject: null as ProjectRecord | null,
  selectedSlideIndex: 0,
  isGeneratingOutline: false,
  isGeneratingSlides: false,
  generatingSlideIds: new Set<string>(),
  description: "",
};

export const usePptStore = create<PptState>((set) => ({
  ...initialState,

  setDescription: (desc) => set({ description: desc }),
  setOutline: (outline) => set({ outline }),
  setSlides: (slides) => set({ slides }),
  appendSlide: (slide) =>
    set((s) => ({ slides: [...s.slides, slide] })),
  updateSlide: (id, patch) =>
    set((s) => ({
      slides: s.slides.map((sl) => (sl.id === id ? { ...sl, ...patch } : sl)),
    })),
  selectSlide: (index) => set({ selectedSlideIndex: index }),
  setIsGeneratingOutline: (v) => set({ isGeneratingOutline: v }),
  setIsGeneratingSlides: (v) => set({ isGeneratingSlides: v }),
  setSlideGenerating: (id, v) =>
    set((s) => {
      const next = new Set(s.generatingSlideIds);
      v ? next.add(id) : next.delete(id);
      return { generatingSlideIds: next };
    }),
  loadProject: (project) =>
    set({
      slides: project.slides,
      currentProject: project,
      selectedSlideIndex: 0,
      outline: null,
    }),
  setCurrentProject: (project) => set({ currentProject: project }),
  reset: () => set({ ...initialState, generatingSlideIds: new Set() }),
}));
