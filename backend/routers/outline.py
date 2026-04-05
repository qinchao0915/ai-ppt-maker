import json
from fastapi import APIRouter, HTTPException
from models import OutlineRequest, OutlineResponse, OutlineItem
from services.claude_client import complete
from prompts import OUTLINE_SYSTEM, OUTLINE_USER

router = APIRouter()


@router.post("/outline", response_model=OutlineResponse)
async def create_outline(body: OutlineRequest):
    user_msg = OUTLINE_USER.format(description=body.description)
    try:
        raw = complete(OUTLINE_SYSTEM, user_msg)
        items_data = json.loads(raw)
        items = [OutlineItem(**item) for item in items_data]
        return OutlineResponse(outline=items)
    except (json.JSONDecodeError, Exception) as e:
        raise HTTPException(status_code=502, detail=f"Claude error: {e}")
