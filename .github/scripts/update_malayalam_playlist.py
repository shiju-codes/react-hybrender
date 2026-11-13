#!/usr/bin/env python3
"""
Daily updater: fetches the full playlist and writes only Malayalam movies
to src/hooks/malayalam-playlist.m3u
"""

import re
import urllib.request
from pathlib import Path

SOURCE_URL = "https://thirud4a4.github.io/movies_m3u/playlist.m3u"
OUTPUT_PATH = Path("src/hooks/malayalam-playlist.m3u")


def fetch_playlist(url: str) -> str:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "Mozilla/5.0 (compatible; MalayalamPlaylistBot/1.0)"},
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="ignore")


def extract_malayalam(content: str) -> list[str]:
    """Return cleaned #EXTINF + URL pairs for Malayalam only."""
    entries = []
    blocks = re.split(r"(?=#EXTINF)", content)

    for block in blocks:
        block = block.strip()
        if not block.startswith("#EXTINF"):
            continue

        # Only keep Malayalam
        if not re.search(r'group-title="[^"]*Malayalam[^"]*"', block, re.I):
            continue

        lines = [l.strip() for l in block.splitlines() if l.strip()]
        if len(lines) < 2:
            continue

        info_line = lines[0]
        url = lines[1]

        # Extract name (text after the last comma)
        name_match = re.search(r",(.+)$", info_line)
        name = name_match.group(1).strip() if name_match else "Unknown"

        # Extract logo if present
        logo_match = re.search(r'tvg-logo="([^"]+)"', info_line)
        logo = logo_match.group(1) if logo_match else ""

        # Extract group-title
        group_match = re.search(r'group-title="([^"]+)"', info_line)
        group = group_match.group(1) if group_match else "Movies / Malayalam"

        # Clean simplified format (works better with most IPTV apps)
        if logo:
            clean_info = f'#EXTINF:-1 tvg-logo="{logo}" group-title="{group}",{name}'
        else:
            clean_info = f'#EXTINF:-1 group-title="{group}",{name}'

        entries.append(f"{clean_info}\n{url}")

    return entries


def main():
    print("Downloading source playlist...")
    content = fetch_playlist(SOURCE_URL)

    print("Filtering Malayalam movies...")
    malayalam = extract_malayalam(content)
    print(f"Found {len(malayalam)} Malayalam entries")

    # Write output
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        f.write("#EXTM3U\n")
        f.write("\n".join(malayalam))
        f.write("\n")

    print(f"Written to {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
