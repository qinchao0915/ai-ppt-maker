import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_health():
    r = client.get("/health")
    assert r.status_code == 200
    assert r.json() == {"status": "ok"}


def test_export_returns_pptx():
    payload = {
        "title": "Test Deck",
        "slides": [
            {
                "id": "s1",
                "title": "Hello",
                "bullets": ["Point 1"],
                "layout": "title-bullets",
                "style": {"theme": "blue", "font": "sans"},
                "prompt": "An intro slide"
            }
        ]
    }
    r = client.post("/api/export", json=payload)
    assert r.status_code == 200
    assert r.headers["content-type"].startswith(
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    )
    assert len(r.content) > 0


def test_export_filename_header():
    payload = {
        "title": "My Presentation",
        "slides": [
            {
                "id": "s1",
                "title": "Slide 1",
                "bullets": [],
                "layout": "title-only",
                "style": {"theme": "minimal", "font": "sans"},
                "prompt": "Title slide"
            }
        ]
    }
    r = client.post("/api/export", json=payload)
    assert "My_Presentation.pptx" in r.headers["content-disposition"]
