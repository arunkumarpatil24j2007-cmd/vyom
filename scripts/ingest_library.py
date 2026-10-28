#!/usr/bin/env python3
"""
Vyom Reproducible Document Ingestion & RAG Knowledge Indexing Pipeline
Processes classical Jyotish, Vedic divination, Shastras, and esoteric volumes.
Extracts clean text, normalizes formatting, extracts chapters, computes SHA-256 hashes,
generates structured semantic chunks with source provenance, and builds fast search indices.
"""

import os
import sys
import json
import re
import glob
import hashlib
import warnings
from datetime import datetime, timezone
from typing import List, Dict, Any

warnings.filterwarnings('ignore')

try:
    import pypdf
    pypdf._configuration.overwrite_configuration(
        page_tree_maximum_depth=3000, 
        page_tree_maximum_entries=300000
    )
except ImportError:
    print("pypdf is required. Please install via pip install pypdf")
    sys.exit(1)

PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SOURCES_DIR = os.path.join(PROJECT_ROOT, "data", "sources")
DOWNLOADS_DIR = "/Users/arunkumarpatil/Downloads"
OUTPUT_DIR = os.path.join(PROJECT_ROOT, "data", "knowledge")
os.makedirs(SOURCES_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Canonical 11 Volumes provided by user
LIBRARY_CONFIG = [
    {
        "id": "doc-bphs",
        "filename": "403096259-brihat-parashara-hora-shastra-english-V-pdf.pdf",
        "title": "Brihat Parashara Hora Shastra",
        "author": "Maharishi Parashara",
        "year": "Classical (Vedic Epoch)",
        "translator": "R. Santhanam & G.C. Sharma tradition",
        "tradition": "Classical Vedic Jyotish",
        "categories": [
            "Classical Vedic astrology",
            "Kundli and birth-chart interpretation",
            "Planetary positions, houses, Rashis, and Nakshatras",
            "Yogas and Doshas",
            "Vimshottari Dasha and other documented timing systems",
            "Traditional remedies and ritual practices"
        ],
        "default_chapter": "Parashari Principles & Bhavas",
        "source_kind": "classical_vedic_primary",
        "tags": ["bphs", "parashara", "grahas", "bhavas", "rashis", "yogas", "vimshottari", "mangal dosha", "navamsha"]
    },
    {
        "id": "doc-brihat-jataka",
        "filename": "2015.406251.Brihat-Jataka_text.pdf",
        "title": "The Brihat Jataka",
        "author": "Varahamihira",
        "year": "1919 (Archive Edition)",
        "translator": "N. Chidambaram Iyer",
        "tradition": "Classical Vedic Astronomy & Horoscopy",
        "categories": [
            "Classical Vedic astrology",
            "Kundli and birth-chart interpretation",
            "Planetary positions, houses, Rashis, and Nakshatras",
            "Yogas and Doshas",
            "Transits and predictive methods"
        ],
        "default_chapter": "Zodiacal Definitions & Planetary Characters",
        "source_kind": "classical_vedic_primary",
        "tags": ["varahamihira", "brihat jataka", "ayurdaya", "nabhasa yogas", "raja yoga", "karma jivana", "longevity"]
    },
    {
        "id": "doc-phaladeepika",
        "filename": "phaladeepika-2nd-ed-1950-by-v-subrahmanya-sastri-text.pdf",
        "title": "Mantreswara's Phaladeepika",
        "author": "Mantreswara",
        "year": "1950 (2nd Edition)",
        "translator": "Panditabhushana V. Subrahmanya Sastri, B.A.",
        "tradition": "Classical Vedic Predictive Astrology",
        "categories": [
            "Classical Vedic astrology",
            "Kundli and birth-chart interpretation",
            "Yogas and Doshas",
            "Vimshottari Dasha and other documented timing systems",
            "Transits and predictive methods",
            "Compatibility and relationship astrology"
        ],
        "default_chapter": "Predictive Phalas & Special Yogas",
        "source_kind": "classical_vedic_primary",
        "tags": ["phaladeepika", "mantreswara", "gajakesari", "rajayoga", "gochara", "transits", "sade sati", "ashtakavarga"]
    },
    {
        "id": "doc-saravali",
        "filename": "Saravali.pdf",
        "title": "Kalyana Varma's Saravali",
        "author": "King Kalyana Varma",
        "year": "Classical (8th Century CE)",
        "translator": "R. Santhanam",
        "tradition": "Classical Vedic Shastra",
        "categories": [
            "Classical Vedic astrology",
            "Kundli and birth-chart interpretation",
            "Planetary positions, houses, Rashis, and Nakshatras",
            "Yogas and Doshas",
            "Transits and predictive methods"
        ],
        "default_chapter": "Planetary Conjunctions & House Effects",
        "source_kind": "classical_vedic_primary",
        "tags": ["saravali", "kalyana varma", "conjunctions", "yuti", "planetary strength", "bhavas", "nabhasa"]
    },
    {
        "id": "doc-jataka-parijata",
        "filename": "jataka-parijata-vol-1.pdf",
        "title": "Vaidyanatha Dikshita's Jataka Parijata (Vol. 1)",
        "author": "Vaidyanatha Dikshita",
        "year": "1932 (Ranjan Repr.)",
        "translator": "V. Subrahmanya Sastri, B.A.",
        "tradition": "Classical Shastric Jyotish",
        "categories": [
            "Classical Vedic astrology",
            "Kundli and birth-chart interpretation",
            "Planetary positions, houses, Rashis, and Nakshatras",
            "Yogas and Doshas",
            "Timing systems"
        ],
        "default_chapter": "Graha Bala & Raja Yogas",
        "source_kind": "classical_vedic_primary",
        "tags": ["jataka parijata", "vaidyanatha", "shadbala", "ayurdaya", "vargas", "dhana yogas"]
    },
    {
        "id": "doc-rao-lessons",
        "filename": "book1-for-CD.pdf",
        "title": "Lessons on Vedic Astrology (Vol. 1)",
        "author": "P.V.R. Narasimha Rao",
        "year": "2004-2006",
        "translator": "Original English",
        "tradition": "Modern Sri Jagannath Center Pedagogy",
        "categories": [
            "Classical Vedic astrology",
            "Kundli and birth-chart interpretation",
            "Planetary positions, houses, Rashis, and Nakshatras",
            "Vimshottari Dasha and other documented timing systems",
            "Commentaries, analogies, case studies, and interpretive examples",
            "Modern research and reference material"
        ],
        "default_chapter": "Foundations & Divisional Charts",
        "source_kind": "modern_vedic_pedagogy",
        "tags": ["pvr narasimha rao", "lessons", "divisional charts", "navamsha", "dasha", "argala", "case studies"]
    },
    {
        "id": "doc-vasudev-origin",
        "filename": "Astrology-e-book-compressed.pdf",
        "title": "The Origin, Meaning & Purpose of Astrology",
        "author": "Chennareddy Vasudev",
        "year": "2019 (1st Edition)",
        "translator": "Original English",
        "tradition": "Philosophical & Modern Astrological Inquiry",
        "categories": [
            "Classical Vedic astrology",
            "Commentaries, analogies, case studies, and interpretive examples",
            "Modern research and reference material"
        ],
        "default_chapter": "Cosmological Principles & Zodiac Meaning",
        "source_kind": "philosophical_commentary",
        "tags": ["origin", "meaning", "purpose", "cosmology", "philosophy of astrology", "astronomical basis"]
    },
    {
        "id": "doc-compendium-divination",
        "filename": "The Practitioner's Compendium of Indian Astrology, Numerology & Palmistry.pdf",
        "title": "The Practitioner's Compendium of Indian Divination (Astrology, Numerology & Palmistry)",
        "author": "Classical Indian Divination Tradition",
        "year": "Modern Compendium",
        "translator": "Original English & Sanskrit Glosses",
        "tradition": "Triskandha Jyotish, Anka Shastra & Samudrika Hastarekha",
        "categories": [
            "Classical Vedic astrology",
            "Kundli and birth-chart interpretation",
            "Vedic Numerology (Anka Shastra)",
            "Palmistry (Samudrika Hastarekha)",
            "Commentaries, analogies, case studies, and interpretive examples"
        ],
        "default_chapter": "Three Pillars of Indian Divination & Palmistry",
        "source_kind": "divination_compendium",
        "tags": ["compendium", "numerology", "anka shastra", "mulank", "bhagyank", "palmistry", "hastarekha", "mounts", "parvat", "jeevan rekha", "mastishk rekha"]
    },
    {
        "id": "doc-levi-magic",
        "filename": "the-mysteries-of-magic-eliphas-levi-arthur-edward-waite-1389.pdf",
        "title": "The Mysteries of Magic: A Digest of the Writings of Éliphas Lévi",
        "author": "Éliphas Lévi (Alphonse Louis Constant)",
        "year": "1886 (George Redway, London)",
        "translator": "Arthur Edward Waite",
        "tradition": "Western Esotericism, Kabbalah & Hermetic Magic",
        "categories": [
            "Tantra and related esoteric traditions",
            "Black magic, curses, occult practices, and protective traditions",
            "Commentaries, analogies, case studies, and interpretive examples"
        ],
        "default_chapter": "The Doctrine of Magic & The Astral Light",
        "source_kind": "western_esoteric",
        "tags": ["eliphas levi", "waite", "astral light", "pentagram", "black magic", "sorcery", "bewitchments", "evocations", "protection"]
    },
    {
        "id": "doc-hartmann-magic",
        "filename": "magicwhiteblack00hart_0.pdf",
        "title": "Magic, White and Black: Or The Science of Finite and Infinite Life",
        "author": "Dr. Franz Hartmann, M.D.",
        "year": "1890 (4th Edition, Lovell / Redway)",
        "translator": "Original English",
        "tradition": "Theosophy, Hermeticism & Spiritual Alchemy",
        "categories": [
            "Traditional remedies and ritual practices",
            "Tantra and related esoteric traditions",
            "Black magic, curses, occult practices, and protective traditions",
            "Commentaries, analogies, case studies, and interpretive examples"
        ],
        "default_chapter": "The Science of Spiritual Alchemy & Protective Will",
        "source_kind": "western_esoteric",
        "tags": ["franz hartmann", "white magic", "black magic", "astral body", "sorcery", "demystification", "protection", "alchemy", "will"]
    },
    {
        "id": "doc-bowen-blackmagic",
        "filename": "blackmagic.pdf",
        "title": "Black Magic: A Tale of the Rise and Fall of the Antichrist",
        "author": "Marjorie Bowen",
        "year": "1909 (Chapman & Dodd, London)",
        "translator": "Original English",
        "tradition": "Occult Literature & Historical Esotericism",
        "categories": [
            "Black magic, curses, occult practices, and protective traditions",
            "Commentaries, analogies, case studies, and interpretive examples"
        ],
        "default_chapter": "Occult Narratives & Esoteric Dynamics",
        "source_kind": "literary_fiction",
        "tags": ["black magic", "marjorie bowen", "sorcery", "esoteric history", "curses", "protection", "allegory"]
    }
]

def find_file(filename: str) -> str:
    # 1. Check data/sources/
    p1 = os.path.join(SOURCES_DIR, filename)
    if os.path.exists(p1):
        return p1
    # 2. Check Downloads
    p2 = os.path.join(DOWNLOADS_DIR, filename)
    if os.path.exists(p2):
        return p2
    return ""

CHUNK_TARGET_CHARS = 2000
CHUNK_OVERLAP_CHARS = 250
CONTENT_KEYWORDS = [
    'sun', 'moon', 'mars', 'jupiter', 'saturn', 'venus', 'mercury', 'rahu', 'ketu',
    'lagna', 'dasha', 'gochara', 'sade sati', 'mangal dosha', 'kundli', 'navamsha',
    'hastarekha', 'palmistry', 'numerology', 'mulank', 'bhagyank',
    'astral', 'sorcery', 'curse', 'protection', 'remedy', 'mantra', 'alchemy'
]

def clean_text(raw_text: str) -> str:
    if not raw_text:
        return ""
    text = re.sub(r'[\r\t\f\v]', ' ', raw_text)
    text = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r' {2,}', ' ', text)
    return text.strip()

CHAPTER_PATTERNS = [
    re.compile(r'^Ch\.\s*\d+\.\s+[A-Z][^\n]{2,70}$'),                       # BPHS: "Ch. 36. Yogas"
    re.compile(r'^(ADHYAYA|Adhyaya|CHAPTER|Chapter|LESSON|Lesson)\s+[IVXLC\d]+(?:[-\s.,:][^\n]{0,60})?$'),
]

def detect_chapter(page_text: str, current_chapter: str) -> str:
    """Returns the last chapter heading found on the page (headings can appear mid-page);
    cross-references such as "Sloka 6, Ch. 4 of Saravali" are not headings and are skipped."""
    found = current_chapter
    for line in (l.strip() for l in page_text.split('\n')):
        if not line or len(line) > 80 or re.search(r'sloka|infra|supra|see ', line, re.IGNORECASE):
            continue
        if any(p.match(line) for p in CHAPTER_PATTERNS):
            found = line.rstrip(' .,;:')
        elif re.match(r'^[A-Z\s]{4,40}$', line) and any(w in line for w in ['YOGA', 'BHAVA', 'GRAHA', 'MAGIC', 'ASTRAL', 'DASHA', 'TRANSIT', 'LESSON', 'PALM', 'NUMEROLOGY']):
            found = line.title()
    return found

WORD_RE = re.compile(r"\b[a-zA-Z]{3,}\b")

def text_quality(text: str) -> float:
    """Share of non-space characters that form Latin-script words. Scanned books whose OCR text
    layer is garbage (e.g. English misread as Devanagari) score near 0."""
    body = re.sub(r'\[Page \d+\]', '', text)
    nonspace = len(re.sub(r'\s', '', body)) or 1
    return round(sum(len(w) for w in WORD_RE.findall(body)) / nonspace, 3)

MIN_TEXT_QUALITY = 0.35

def compute_file_hash(filepath: str) -> str:
    hasher = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def process_pdf(filepath: str, book_cfg: Dict[str, Any]) -> Dict[str, Any]:
    file_size_mb = os.path.getsize(filepath) / (1024 * 1024)
    file_hash = compute_file_hash(filepath)
    filename = os.path.basename(filepath)

    try:
        reader = pypdf.PdfReader(filepath)
        total_pages = len(reader.pages)
        print(f"  Pages: {total_pages}, Size: {file_size_mb:.2f} MB, SHA256: {file_hash[:12]}...")

        extracted_chunks: List[Dict[str, Any]] = []
        current_chapter = book_cfg.get('default_chapter', 'General Shastra Principles')
        # Buffer of (page_num, chapter, text) segments; chunks are cut as overlapping
        # windows so no extracted text is dropped and page ranges stay accurate.
        segments: List[Dict[str, Any]] = []
        total_extracted_chars = 0
        empty_pages = 0

        def emit(window_segments: List[Dict[str, Any]]):
            content = "\n".join(f"[Page {seg['page']}]\n{seg['text']}" for seg in window_segments).strip()
            if len(content) < 100:
                return
            page_start = window_segments[0]['page']
            chunk_tags = list(book_cfg.get('tags', []))
            lower_content = content.lower()
            for keyword in CONTENT_KEYWORDS:
                if keyword in lower_content and keyword not in chunk_tags:
                    chunk_tags.append(keyword)
            extracted_chunks.append({
                "id": f"{book_cfg['id']}-p{page_start}-{len(extracted_chunks)+1}",
                "docId": book_cfg['id'],
                "docTitle": book_cfg['title'],
                "author": book_cfg['author'],
                "year": book_cfg.get('year', 'Classical'),
                "translator": book_cfg.get('translator', 'Standard'),
                "tradition": book_cfg.get('tradition', 'Vedic Astrology'),
                "sourceKind": book_cfg.get('source_kind', 'unclassified_custom'),
                "pageStart": page_start,
                "pageEnd": window_segments[-1]['page'],
                "chapter": window_segments[0]['chapter'],
                "content": content,
                "textQuality": text_quality(content),
                "categories": book_cfg.get('categories', ['Classical Vedic astrology']),
                "tags": chunk_tags[:16]
            })

        def flush(force: bool = False):
            nonlocal segments
            while segments and (force or sum(len(s['text']) for s in segments) >= CHUNK_TARGET_CHARS):
                window: List[Dict[str, Any]] = []
                size = 0
                consumed_all = True
                for seg in segments:
                    remaining = CHUNK_TARGET_CHARS - size
                    if len(seg['text']) <= remaining:
                        window.append(seg)
                        size += len(seg['text'])
                    else:
                        consumed_all = False
                        cut = seg['text'].rfind('\n', 0, remaining)
                        if cut < remaining // 2:
                            cut = seg['text'].rfind('. ', 0, remaining)
                        if cut < remaining // 2:
                            cut = remaining
                        window.append({**seg, 'text': seg['text'][:cut].strip()})
                        size += cut
                        break
                emit(window)
                if consumed_all:
                    segments = []
                    break
                # Carry an overlap tail into the next window
                consumed = 0
                rest: List[Dict[str, Any]] = []
                for seg in segments:
                    if consumed + len(seg['text']) <= size - CHUNK_OVERLAP_CHARS:
                        consumed += len(seg['text'])
                        continue
                    offset = max(0, size - CHUNK_OVERLAP_CHARS - consumed)
                    rest.append({**seg, 'text': seg['text'][offset:]})
                    consumed += len(seg['text'])
                segments = rest

        for page_idx in range(total_pages):
            page_num = page_idx + 1
            try:
                raw_page_text = reader.pages[page_idx].extract_text() or ""
            except Exception:
                raw_page_text = ""

            cleaned_page = clean_text(raw_page_text)
            total_extracted_chars += len(cleaned_page)
            current_chapter = detect_chapter(cleaned_page, current_chapter)

            if len(cleaned_page) < 40:
                empty_pages += 1
                continue

            segments.append({'page': page_num, 'chapter': current_chapter, 'text': cleaned_page})
            flush()

        flush(force=True)

        low_quality = sum(1 for c in extracted_chunks if c['textQuality'] < MIN_TEXT_QUALITY)
        text_layer_status = 'unusable_needs_ocr' if extracted_chunks and low_quality / len(extracted_chunks) > 0.8 else ('partial' if low_quality else 'good')
        print(f"  Extracted {len(extracted_chunks)} structured chunks ({total_extracted_chars} chars, {empty_pages} pages without a text layer, {low_quality} unreadable chunks -> {text_layer_status}).")

        return {
            "id": book_cfg['id'],
            "filename": filename,
            "title": book_cfg['title'],
            "author": book_cfg['author'],
            "year": book_cfg.get('year', 'Classical'),
            "translator": book_cfg.get('translator', 'Standard'),
            "tradition": book_cfg.get('tradition', 'Vedic Astrology'),
            "sourceKind": book_cfg.get('source_kind', 'unclassified_custom'),
            "fileSizeMb": round(file_size_mb, 2),
            "sha256": file_hash,
            "totalPages": total_pages,
            "totalChunks": len(extracted_chunks),
            "totalExtractedChars": total_extracted_chars,
            "lowQualityChunks": low_quality,
            "textLayerStatus": text_layer_status,
            "categories": book_cfg.get('categories', []),
            "status": "success",
            "chunks": extracted_chunks
        }
    except Exception as e:
        print(f"  Error processing {filename}: {e}")
        return {
            "id": book_cfg['id'],
            "filename": filename,
            "status": "error",
            "error": str(e),
            "chunks": []
        }

PROCESS_DOCS_DIR = os.path.join(SOURCES_DIR, "process")

def ingest_process_documents() -> List[Dict[str, Any]]:
    """Split each Vyom process document (document_NN_*.md) into heading-delimited
    sections, keeping the heading path as provenance."""
    chunks: List[Dict[str, Any]] = []
    for path in sorted(glob.glob(os.path.join(PROCESS_DOCS_DIR, "document_*.md"))):
        name = os.path.basename(path)
        doc_num = re.match(r'document_(\d+)_', name).group(1)
        with open(path, 'r', encoding='utf-8') as f:
            lines = f.read().split('\n')
        doc_title = lines[0].lstrip('# ').strip()
        heading_path: List[str] = []
        buffer: List[str] = []

        def push():
            text = '\n'.join(buffer).strip()
            if len(text) < 40:
                return
            section = ' > '.join(heading_path) or doc_title
            # Long sections (big tables, rule JSON) are split on blank lines into ~3500-char parts
            parts, current = [], ''
            for block in text.split('\n\n'):
                # Oversized blocks (e.g. the rule-catalog JSON) are split at top-level rule objects
                pieces = [block]
                if len(block) > 3500 and block.lstrip().startswith('|'):
                    # Large tables: split into row groups, repeating the header rows in each part
                    rows = block.strip().split('\n')
                    header, body = rows[:2], rows[2:]
                    pieces, group = [], []
                    for row in body:
                        if group and sum(len(r) for r in header + group) + len(row) > 3000:
                            pieces.append('\n'.join(header + group))
                            group = []
                        group.append(row)
                    if group:
                        pieces.append('\n'.join(header + group))
                elif len(block) > 3500:
                    pieces = re.split(r'\n(?=  \{\s*$)', block, flags=re.M)
                for piece in pieces:
                    if current and len(current) + len(piece) > 3500:
                        parts.append(current)
                        current = ''
                    current += piece + '\n\n'
            if current.strip():
                parts.append(current)
            for i, part in enumerate(parts):
                chunks.append({
                    "id": f"proc-{doc_num}-{len(chunks)+1}",
                    "docId": f"process-doc-{doc_num}",
                    "docNumber": int(doc_num),
                    "docTitle": doc_title,
                    "section": section + (f" (part {i+1})" if len(parts) > 1 else ''),
                    "content": part.strip(),
                })

        for line in lines[1:]:
            m = re.match(r'^(#{2,4})\s+(.*)', line)
            if m:
                push()
                buffer = []
                level = len(m.group(1)) - 2
                heading_path = heading_path[:level] + [m.group(2).strip()]
            else:
                buffer.append(line)
        push()
    return chunks

def main():
    print("=" * 70)
    print("VYOM ADVANCED RAG INGESTION PIPELINE: Indexing Shastric Corpus...")
    print("=" * 70)

    manifest_docs = []
    all_chunks = []
    processed_filenames = set()

    report = {
        "engine": "Vyom Advanced RAG Knowledge Ingestion Pipeline v2.0",
        "processedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "totalFiles": 0,
        "successfulFiles": 0,
        "failedFiles": 0,
        "totalChunks": 0,
        "totalExtractedChars": 0,
        "files": []
    }

    # 1. Process Configured Books
    for cfg in LIBRARY_CONFIG:
        fn = cfg['filename']
        filepath = find_file(fn)
        print(f"\nProcessing [{cfg['id']}] {cfg['title']} ({fn})...")

        if not filepath:
            print(f"  File not found in {SOURCES_DIR} or {DOWNLOADS_DIR}")
            res = {
                "id": cfg['id'],
                "filename": fn,
                "status": "error",
                "error": "File not found",
                "chunks": []
            }
        else:
            processed_filenames.add(os.path.basename(filepath))
            res = process_pdf(filepath, cfg)

        chunks = res.pop("chunks", [])
        manifest_docs.append(res)
        all_chunks.extend(chunks)

        report['totalFiles'] += 1
        if res.get('status') == 'success':
            report['successfulFiles'] += 1
            report['totalChunks'] += res.get('totalChunks', 0)
            report['totalExtractedChars'] += res.get('totalExtractedChars', 0)
        else:
            report['failedFiles'] += 1

        report['files'].append({
            "id": res.get("id"),
            "filename": res.get("filename"),
            "status": res.get("status"),
            "chunks": res.get("totalChunks", 0),
            "lowQualityChunks": res.get("lowQualityChunks", 0),
            "textLayerStatus": res.get("textLayerStatus"),
            "error": res.get("error")
        })

    # 2. Auto-discover any other PDF files added to data/sources/
    extra_sources = glob.glob(os.path.join(SOURCES_DIR, "*.pdf"))
    for extra_path in extra_sources:
        extra_name = os.path.basename(extra_path)
        if extra_name in processed_filenames:
            continue
        print(f"\n[Auto-Discovery] Detected new book file: {extra_name}")
        base_id = "doc-custom-" + re.sub(r'[^a-z0-9]', '', extra_name.lower())[:16]
        title = os.path.splitext(extra_name)[0].replace('-', ' ').replace('_', ' ').title()
        extra_cfg = {
            "id": base_id,
            "filename": extra_name,
            "title": title,
            "author": "Astrological Treatise",
            "year": "Custom Addition",
            "translator": "Standard",
            "tradition": "Classical / Esoteric Tradition",
            "categories": ["Classical Vedic astrology", "Modern research and reference material"],
            "default_chapter": "General Discourse",
            "source_kind": "unclassified_custom",
            "tags": ["astrology", "shastra", "custom_source"]
        }
        res = process_pdf(extra_path, extra_cfg)
        chunks = res.pop("chunks", [])
        manifest_docs.append(res)
        all_chunks.extend(chunks)
        processed_filenames.add(extra_name)

        report['totalFiles'] += 1
        if res.get('status') == 'success':
            report['successfulFiles'] += 1
            report['totalChunks'] += res.get('totalChunks', 0)
            report['totalExtractedChars'] += res.get('totalExtractedChars', 0)
        else:
            report['failedFiles'] += 1

        report['files'].append({
            "id": res.get("id"),
            "filename": res.get("filename"),
            "status": res.get("status"),
            "chunks": res.get("totalChunks", 0),
            "error": res.get("error")
        })

    # 3. Save library manifest
    manifest_path = os.path.join(OUTPUT_DIR, "library_manifest.json")
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest_docs, f, indent=2, ensure_ascii=False)
    print(f"\nSaved library manifest -> {manifest_path}")

    # 4. Save the full RAG corpus. Every extracted chunk is kept so retrieval can reach
    # the whole of every book (an earlier version sampled only 35 chunks per book).
    curated_chunks = all_chunks
    chunks_path = os.path.join(OUTPUT_DIR, "curated_corpus.json")
    with open(chunks_path, 'w', encoding='utf-8') as f:
        json.dump(curated_chunks, f, ensure_ascii=False)
    print(f"Saved corpus ({len(curated_chunks)} chunks across {report['successfulFiles']} sources) -> {chunks_path}")

    # 4b. Index the 10 Vyom process documents section-by-section (methodology corpus)
    methodology_chunks = ingest_process_documents()
    methodology_path = os.path.join(OUTPUT_DIR, "methodology_corpus.json")
    with open(methodology_path, 'w', encoding='utf-8') as f:
        json.dump(methodology_chunks, f, indent=1, ensure_ascii=False)
    report['processDocuments'] = sorted({c['docId'] for c in methodology_chunks})
    report['methodologySections'] = len(methodology_chunks)
    print(f"Saved methodology corpus ({len(methodology_chunks)} sections from {len(report['processDocuments'])} process documents) -> {methodology_path}")

    # 5. Save Ingestion Report
    report_path = os.path.join(OUTPUT_DIR, "ingestion_report.json")
    with open(report_path, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    print(f"Saved ingestion report -> {report_path}")

    print("\n" + "=" * 70)
    print(f"RAG INGESTION COMPLETE: {report['successfulFiles']}/{report['totalFiles']} books indexed.")
    print(f"TOTAL CHUNKS: {report['totalChunks']} raw chunks | {len(curated_chunks)} active RAG search nodes.")
    print("=" * 70)

if __name__ == '__main__':
    main()
