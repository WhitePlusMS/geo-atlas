"""Combine the archived world reference with downloaded Tianditu province data.

Run with Python, Shapely 2 and the original 2026-10 Tianditu GeoJSON:
    python scripts/prepare-world-reference.py --world path/to/natural-earth.geojson --china path/to/中国_省.geojson
The resulting geography is a derivative reference, not an approved standard map.
"""
from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path

from shapely.geometry import mapping, shape
from shapely.ops import unary_union

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public/data/world_reference.geojson"
NATURAL_HASH = "3e458fc036ad0a66411f2c1e6cac49c5d7bfb81cb1123bc513b22511a2b7fdeb"
CHINA_HASH = "3af8294f9ad61cc2bf84c1bb7e4bbf86a6336c68d754b699a0e6ddc33ef81486"


def read_pinned(path: Path, expected_hash: str) -> dict:
    raw = path.read_bytes()
    if hashlib.sha256(raw).hexdigest() != expected_hash:
        raise ValueError(f"Source hash mismatch: {path}")
    data = json.loads(raw)
    if data.get("type") != "FeatureCollection":
        raise ValueError(f"Unexpected source format: {path}")
    return data


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--world", type=Path, required=True, help="Pinned Natural Earth country GeoJSON")
    parser.add_argument("--china", type=Path, required=True, help="Official China province GeoJSON downloaded from Tianditu")
    args = parser.parse_args()
    world = read_pinned(args.world, NATURAL_HASH)
    official = read_pinned(args.china, CHINA_HASH)
    provinces = [shape(item["geometry"]) for item in official["features"] if item["geometry"]["type"] == "MultiPolygon"]
    lines = [shape(item["geometry"]) for item in official["features"] if item["geometry"]["type"] == "MultiLineString"]
    if len(provinces) != 34:
        raise ValueError("Expected 34 province geometries")
    china = unary_union(provinces)
    # The source's only ten-part line is the South China Sea dashed line.
    sea_lines = [line for line in lines if len(line.geoms) == 10 and line.bounds[1] < 5 and line.bounds[0] > 100]
    if not china.is_valid or len(sea_lines) != 1:
        raise ValueError("Unexpected Chinese geometry or South China Sea line")

    features = []
    adjusted = []
    for item in world["features"]:
        name = item["properties"]["NAME"]
        if name in {"China", "Taiwan", "Hong Kong", "Macao"}:
            continue
        geometry = shape(item["geometry"])
        if geometry.intersects(china):
            geometry = geometry.difference(china)
            adjusted.append(name)
        if geometry.is_empty:
            continue
        if geometry.geom_type not in {"Polygon", "MultiPolygon"}:
            raise ValueError(f"Unexpected geometry after clipping {name}: {geometry.geom_type}")
        features.append({"type": "Feature", "properties": {"name": name}, "geometry": mapping(geometry)})
    features.append({"type": "Feature", "properties": {"name": "China"}, "geometry": mapping(china)})
    result = {
        "type": "FeatureCollection",
        "source": {
            "world": {"title": "Natural Earth 1:50m Admin 0 Countries", "url": "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/9380cca83db5f9aef52d5e762765100745f84b27/geojson/ne_50m_admin_0_countries.geojson", "sha256": NATURAL_HASH},
            "china": {"title": "天地图行政区划可视化：中国省级 GeoJSON", "url": "https://cloudcenter.tianditu.gov.cn/administrativeDivision/", "updated": "2026-10", "sha256": CHINA_HASH, "crs": "EPSG:4490"},
            "derivation": "Union Chinese provinces, remove overlapping Natural Earth areas, and retain the source South China Sea dashed line; this composite is not an approved standard map.",
            "adjusted_features": adjusted,
        },
        "southChinaSeaLines": mapping(sea_lines[0])["coordinates"],
        "features": features,
    }
    # 保持 LF 原始字节，避免 Windows 自动转换导致仓库数据指纹变化。
    OUTPUT.write_bytes((json.dumps(result, ensure_ascii=False, separators=(",", ":")) + "\n").encode("utf-8"))
    print(json.dumps({"features": len(features), "adjusted_features": adjusted, "sha256": hashlib.sha256(OUTPUT.read_bytes()).hexdigest()}, ensure_ascii=False))


if __name__ == "__main__":
    main()
