import pytest
from pydantic import ValidationError
from models import Slide, ProjectRecord, OutlineItem

def test_slide_valid():
    s = Slide(
        id="s1",
        title="Intro",
        bullets=["Point A", "Point B"],
        layout="title-bullets",
        style={"theme": "blue", "font": "sans"},
        prompt="Create an intro slide about AI"
    )
    assert s.id == "s1"
    assert len(s.bullets) == 2

def test_slide_invalid_layout():
    with pytest.raises(ValidationError):
        Slide(
            id="s2",
            title="X",
            bullets=[],
            layout="bad-layout",
            style={"theme": "blue", "font": "sans"},
            prompt="test"
        )

def test_outline_item_valid():
    item = OutlineItem(index=0, title="Introduction", slide_count=1)
    assert item.index == 0

def test_project_record_valid():
    from models import Slide, ProjectRecord
    slide = Slide(
        id="s1", title="T", bullets=[], layout="title-only",
        style={"theme": "blue", "font": "sans"}, prompt="p"
    )
    pr = ProjectRecord(
        id="proj-1",
        deviceId="device-abc",
        title="My Project",
        slides=[slide],
        createdAt="2026-04-05T00:00:00Z",
        updatedAt="2026-04-05T00:00:00Z"
    )
    assert pr.title == "My Project"
