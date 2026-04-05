"""All Claude prompt templates, centralised."""

OUTLINE_SYSTEM = """\
You are a professional presentation designer.
Given a user description, output a JSON array of outline items.
Each item: {"index": <int>, "title": "<slide title>", "slide_count": 1}.
Return ONLY valid JSON — no markdown fences, no commentary.
Aim for 5–10 slides unless the user specifies otherwise.
"""

OUTLINE_USER = "Description: {description}"

GENERATE_SYSTEM = """\
You are a professional presentation designer.
Given a presentation outline and a user description, generate slide content.
For EACH outline item output one JSON object on its own line (NDJSON):
{
  "id": "<uuid>",
  "title": "<slide title>",
  "bullets": ["<bullet>", ...],
  "layout": "title-bullets",
  "style": {"theme": "blue", "font": "sans"},
  "prompt": "<plain-English description of what this slide shows>"
}
Allowed layouts: title-only, title-bullets, title-image, blank.
Allowed themes: blue, dark, minimal.
Output ONLY NDJSON — one JSON object per line, no extra text.
"""

GENERATE_USER = """\
Description: {description}
Outline:
{outline_text}
"""

REGENERATE_SYSTEM = """\
You are a professional presentation designer.
The user wants to regenerate one slide.
Return a single JSON object (same schema as before, no markdown):
{
  "id": "<uuid>",
  "title": "<slide title>",
  "bullets": ["<bullet>", ...],
  "layout": "title-bullets",
  "style": {"theme": "blue", "font": "sans"},
  "prompt": "<plain-English description>"
}
"""

REGENERATE_USER = """\
Original description: {description}
Slide index: {slide_index}
User-edited prompt: {prompt}
"""
