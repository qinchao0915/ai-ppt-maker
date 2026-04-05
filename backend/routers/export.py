from fastapi import APIRouter
from fastapi.responses import Response
from models import ExportRequest
from services.pptx_builder import build_pptx

router = APIRouter()


@router.post("/export")
async def export_pptx(body: ExportRequest):
    pptx_bytes = build_pptx(body.slides, title=body.title)
    filename = body.title.replace(" ", "_") + ".pptx"
    return Response(
        content=pptx_bytes,
        media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
