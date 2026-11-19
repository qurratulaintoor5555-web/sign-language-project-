# PSL Dataset Collection & Quality Protocol

## Target
Target at least 10,000 labeled **sequence files** after augmentation. The number is a pipeline target, not a claim about the starter archive. Aim first for diverse genuine recordings, then augment only training groups.

## Vocabulary
`dataset/labels/psl_words.csv` is a proposed English-gloss collection list. A qualified PSL signer/interpreter must approve, correct, or remove each item and provide a reference demonstration. Regional variants should be recorded as metadata or separate labels only after expert guidance.

## Recording protocol
- Obtain informed, documented consent for recording and intended use.
- Use signer pseudonyms (e.g. S001), not names, in filenames/manifests.
- Record each label multiple times per signer and across multiple sessions.
- Vary camera distance, left/right position, background, clothing, lighting, and natural speed.
- Keep hands and relevant upper-body context visible; avoid cropping wrists/fingers.
- Record natural examples; do not ask signers to exaggerate movements unnaturally.
- Record two-handed signs with both hands visible.
- If facial expression/body movement is linguistically meaningful, plan a later pose/face feature extension; hand-only predictions must not be represented as full PSL understanding.
- Capture 2–4 second clips at a consistent frame sampling rate. The collector produces a fixed 30-frame sequence.

## Augmentation
Apply modest landmark-space transformations to training examples only:
- small rotation, scale, translation, and coordinate noise;
- temporal resampling/jitter that preserves sequence meaning;
- occasional mild landmark dropout only if it does not destroy the sign.
Never mirror left/right signs by default: mirroring can change meaning or handedness. Do not synthesize validation/test data.

## Split strategy
Split original recording groups (preferably signer/session grouped) into train/validation/test before augmentation. A suggested starting split is 70/15/15, with signer-independent test data if enough signers are available. Do not allow the same original recording or its augmentations into multiple splits.

## Manifest fields
`sample_id, source_id, signer_id, session_id, label, split, path, is_augmented, parent_sample_id, fps, frames, consent_verified, reviewer_status`

## Quality gates
- no empty/corrupt sequences;
- each label exists in the expert-approved label registry;
- consistent tensor shape `[30, 126]`;
- consent verified before use;
- reviewer status is approved;
- class counts and signer counts are reported;
- evaluate per-class precision/recall/F1, macro-F1, confusion matrix, and signer-independent performance;
- inspect false positives and false negatives with a PSL reviewer.

## Important
10,000 augmented files do not equal 10,000 independent participants or recordings. Report original count, augmented count, signer count, and per-class count separately.
