# Vyom Knowledge Ingestion & RAG Sources Directory

This directory (`data/sources/`) is the central repository for adding new books, shastras, and astrological treatises to the Vyom RAG knowledge engine.

## How to Add New Sources
1. Place any `.pdf`, `.txt`, or `.md` book files directly into this directory (`data/sources/`), or keep them in your `Downloads` folder.
2. Run the ingestion command:
   ```bash
   npm run ingest
   ```
   *(or `python3 scripts/ingest_library.py`)*

## What the RAG Pipeline Does Automatically
- **Text Extraction & Normalization**: Strips corrupt characters, repairs whitespace, and processes unicode Sanskrit/English text.
- **Chapter & Topic Detection**: Detects Adhyayas, Cantos, and thematic boundaries (Grahas, Bhavas, Yogas, Dashas, Hastarekha/Palmistry, Anka/Numerology).
- **Semantic Chunking**: Emits structured, contextual chunks with page numbers and topic tags.
- **RAG Indexing**: Updates `data/knowledge/library_manifest.json` and `data/knowledge/curated_corpus.json`.
- **Live In-Memory Hot Reloading**: The Vite dev server auto-detects changes to the corpus and immediately uses the new sources for Gemini 3 Flash consultations!
