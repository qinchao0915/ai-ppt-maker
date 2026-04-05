"use client";
import { useCallback } from "react";
import SplitLayout from "@/components/layout/SplitLayout";
import ConversationInput from "@/components/left/ConversationInput";
import PromptCardList from "@/components/left/PromptCardList";
import HistoryPicker from "@/components/left/HistoryPicker";
import ThumbnailStrip from "@/components/right/ThumbnailStrip";
import SlidePreview from "@/components/right/SlidePreview";
import ExportButton from "@/components/shared/ExportButton";
import { usePptStore } from "@/store/usePptStore";
import { fetchOutline, streamSlides, regenerateSlide } from "@/lib/api";
import { saveProject } from "@/lib/db";
import { getDeviceId } from "@/lib/deviceId";
import type { ProjectRecord, Slide } from "@/types";

export default function Home() {
  const {
    slides,
    outline,
    description,
    selectedSlideIndex,
    isGeneratingOutline,
    isGeneratingSlides,
    generatingSlideIds,
    setDescription,
    setOutline,
    setSlides,
    appendSlide,
    updateSlide,
    selectSlide,
    setIsGeneratingOutline,
    setIsGeneratingSlides,
    setSlideGenerating,
    loadProject,
    setCurrentProject,
  } = usePptStore();

  const currentSlide = slides[selectedSlideIndex] ?? null;
  const isLoading = isGeneratingOutline || isGeneratingSlides;

  const handleSubmit = useCallback(
    async (desc: string) => {
      setDescription(desc);
      setIsGeneratingOutline(true);
      setSlides([]);

      try {
        const outlineItems = await fetchOutline(desc);
        setOutline(outlineItems);
        setIsGeneratingOutline(false);

        setIsGeneratingSlides(true);
        const received: Slide[] = [];

        for await (const slide of streamSlides(outlineItems, desc)) {
          appendSlide(slide);
          received.push(slide);
        }

        const deviceId = getDeviceId();
        const project: ProjectRecord = {
          id: crypto.randomUUID(),
          deviceId,
          title: desc.slice(0, 60),
          slides: received,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        await saveProject(project);
        setCurrentProject(project);
      } catch (e) {
        console.error(e);
        alert("生成失败，请检查网络或 API Key 后重试");
      } finally {
        setIsGeneratingOutline(false);
        setIsGeneratingSlides(false);
      }
    },
    [appendSlide, setCurrentProject, setDescription, setIsGeneratingOutline, setIsGeneratingSlides, setOutline, setSlides]
  );

  const handleRegenerate = useCallback(
    async (slide: Slide) => {
      setSlideGenerating(slide.id, true);
      try {
        const newSlide = await regenerateSlide(
          slide.id,
          slide.prompt,
          slides.indexOf(slide),
          description
        );
        updateSlide(slide.id, newSlide);
      } catch (e) {
        console.error(e);
        alert("重新生成失败");
      } finally {
        setSlideGenerating(slide.id, false);
      }
    },
    [description, setSlideGenerating, slides, updateSlide]
  );

  const handlePromptChange = useCallback(
    (id: string, prompt: string) => {
      updateSlide(id, { prompt });
    },
    [updateSlide]
  );

  const handleHistorySelect = useCallback(
    (project: ProjectRecord) => {
      loadProject(project);
    },
    [loadProject]
  );

  const pendingCount = isGeneratingSlides
    ? Math.max(0, (outline?.length ?? 0) - slides.length)
    : 0;

  const leftPanel = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h1 className="text-base font-semibold text-gray-800">🎨 AI PPT Maker</h1>
      </div>
      <HistoryPicker onSelect={handleHistorySelect} />
      <div className="flex-1 overflow-hidden">
        <PromptCardList
          slides={slides}
          generatingSlideIds={generatingSlideIds}
          pendingCount={pendingCount}
          onRegenerate={handleRegenerate}
          onPromptChange={handlePromptChange}
        />
      </div>
      <ConversationInput onSubmit={handleSubmit} disabled={isLoading} />
    </div>
  );

  const rightPanel = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2">
        <span className="text-sm text-gray-500">
          {slides.length > 0 ? `${slides.length} 张幻灯片` : ""}
        </span>
        <ExportButton slides={slides} title={description || "演示文稿"} />
      </div>
      <ThumbnailStrip
        slides={slides}
        selectedIndex={selectedSlideIndex}
        onSelect={selectSlide}
      />
      <SlidePreview
        slide={currentSlide}
        onUpdateSlide={updateSlide}
      />
    </div>
  );

  return <SplitLayout left={leftPanel} right={rightPanel} />;
}
