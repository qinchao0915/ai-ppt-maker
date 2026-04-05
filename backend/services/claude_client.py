from __future__ import annotations
import os
import json
from anthropic import Anthropic

_client: Anthropic | None = None


def get_client() -> Anthropic:
    global _client
    if _client is None:
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            raise RuntimeError("ANTHROPIC_API_KEY environment variable not set")
        _client = Anthropic(api_key=api_key)
    return _client


def complete(system: str, user: str, model: str = "claude-opus-4-5") -> str:
    """Single-turn, non-streaming completion. Returns assistant text."""
    client = get_client()
    message = client.messages.create(
        model=model,
        max_tokens=4096,
        system=system,
        messages=[{"role": "user", "content": user}],
    )
    return message.content[0].text


def stream_lines(system: str, user: str, model: str = "claude-opus-4-5"):
    """
    Streaming completion that yields complete NDJSON lines as they arrive.
    Buffers partial lines internally.
    """
    client = get_client()
    buffer = ""
    with client.messages.stream(
        model=model,
        max_tokens=8192,
        system=system,
        messages=[{"role": "user", "content": user}],
    ) as stream:
        for text in stream.text_stream:
            buffer += text
            while "\n" in buffer:
                line, buffer = buffer.split("\n", 1)
                line = line.strip()
                if line:
                    yield line
    # Flush remaining buffer
    if buffer.strip():
        yield buffer.strip()
