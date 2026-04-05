import json
import uuid
from fastapi import APIRouter, HTTPException
from models import RegenerateRequest, Slide
from services.claude_client import complete
from prompts import REGENERATE_SYSTEM, REGENERATE_USER

router = APIRouter()


@router.post("/regenerate/{slide_id}")
async def regenerate_slide(slide_id: str, body: RegenerateRequest):
    user_msg = REGENERATE_USER.format(
        description=body.description,
        slide_index=body.slide_index,
        prompt=body.prompt,
    )
    try:
        raw = complete(REGENERATE_SYSTEM, user_msg)
        data = json.loads(raw)
        data["id"] = slide_id
        slide = Slide(**data)
        return slide
    except (json.JSONDecodeError, Exception) as e:
        raise HTTPException(status_code=502, detail=f"Claude error: {e}")
