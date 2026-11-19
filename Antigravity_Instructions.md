# Antigravity Agent Instructions

Open the repository root and ask Antigravity to follow these instructions in order. Do not generate fake dataset records or claim model accuracy without an actual evaluation.

## Mission
Build a usable two-way Pakistan Sign Language (PSL) communication application. Frontend is React + TypeScript, main backend is ASP.NET Core 8, AI inference/training is Python + FastAPI, and persistent data is SQL Server.

## Non-negotiable requirements
1. Keep the architecture: React → ASP.NET Core → FastAPI/PyTorch.
2. The browser must request camera permission explicitly and show a visible camera preview and recording status.
3. Send recorded video to the .NET API; .NET proxies it to FastAPI. Do not expose internal AI service URLs/secrets to the browser.
4. Display the recognized English gloss, confidence, and a clear “uncertain / please repeat” state below the configured threshold.
5. Never turn low-confidence output into a confident sentence using an LLM. An LLM may only improve punctuation/grammar after a verified sequence of recognized glosses, with the raw glosses preserved.
6. English-to-PSL must retrieve a verified PSL clip/animation from a curated vocabulary table. If no verified media exists, say “Sign media not available”; do not invent a sign.
7. Include consent, privacy, delete-history, accessibility, keyboard navigation, high contrast, large touch targets, and mobile-responsive layouts.
8. Save translation history only with user consent. Do not store raw camera video by default.
9. Add tests for API validation, low-confidence handling, missing model, and unsupported vocabulary.
10. Keep dataset provenance: original sample ID, signer pseudonym, session ID, label, capture conditions, consent status, and augmentation lineage.
11. Split by signer/session/source recording before augmentation. Augmented siblings must never appear across train/validation/test.
12. Label registry must be reviewed by a PSL expert. English labels are glosses, not a complete representation of PSL grammar.
13. Keep all keys and connection strings in environment variables or user secrets. Never commit secrets.

## Implementation phases
- Phase 1: inspect repository and summarize architecture; preserve existing files.
- Phase 2: make AI service run, add health/readiness, video preprocessing, model loading, prediction response.
- Phase 3: implement .NET controllers, AI proxy, SQL Server EF Core history, validation and Swagger.
- Phase 4: implement React camera recording, translation result, confidence display, English speech output, history and error states.
- Phase 5: implement verified English-to-PSL media lookup and upload/admin workflow.
- Phase 6: add authentication/roles, consent, retention/deletion, tests, Docker Compose and deployment documentation.
- Phase 7: run all builds/tests and report exact commands, results, known limitations, and missing data.

## Definition of done
- `dotnet build` succeeds.
- `npm run build` succeeds.
- Python imports and FastAPI health checks succeed.
- No-model behavior is graceful and explicit.
- Camera permission denial and unsupported browsers are handled.
- API contract and README match implementation.
- No fabricated training data, metrics, or PSL translations.
