from __future__ import annotations
from typing import Literal
from pydantic import BaseModel


class SlideStyle(BaseModel):
    theme: str
    font: str


class Slide(BaseModel):
    id: str
    title: str
    bullets: list[str]
    layout: Literal["title-only", "title-bullets", "title-image", "blank"]
    style: SlideStyle
    prompt: str


class OutlineItem(BaseModel):
    index: int
    title: str
    slide_count: int = 1


class ProjectRecord(BaseModel):
    id: str
    deviceId: str
    title: str
    slides: list[Slide]
    createdAt: str
    updatedAt: str


# --- Request / Response shapes ---

class OutlineRequest(BaseModel):
    description: str

class OutlineResponse(BaseModel):
    outline: list[OutlineItem]

class GenerateRequest(BaseModel):
    outline: list[OutlineItem]
    description: str

class RegenerateRequest(BaseModel):
    prompt: str
    slide_index: int
    description: str

class ExportRequest(BaseModel):
    slides: list[Slide]
    title: str = "Presentation"
