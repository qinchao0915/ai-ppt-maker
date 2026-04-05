import json
import uuid
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from models import GenerateRequest, Slide, OutlineItem
from services.claude_client import stream_lines
from prompts import GENERATE_SYSTEM, GENERATE_USER

router = APIRouter()


def _outline_to_text(outline: list[OutlineItem]) -> str:
    return "\n".join(f"{i.index + 1}. {i.title}" for i in outline)


@router.post("/generate")
async def generate_slides(body: GenerateRequest):
    outline_text = _outline_to_text(body.outline)
    user_msg = GENERATE_USER.format(
        description=body.description,
        outline_text=outline_text,
    )

    def event_stream():
        for line in stream_lines(GENERATE_SYSTEM, user_msg):
            try:
                data = json.loads(line)
                if not data.get("id"):
                    data["id"] = str(uuid.uuid4())
                slide = Slide(**data)
                yield f"data: {slide.model_dump_json()}\n\n"
            except Exception:
                continue

    return StreamingResponse(event_stream(), media_type="text/event-stream")
