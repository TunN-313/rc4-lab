# Security Specification: RC4 Lab Firestore Rules

## 1. Data Invariants
- Each user can only access their own user document `/users/{userId}` where `request.auth.uid == userId`.
- All operational records (`encryption_runs`, `experiment_runs`, `quiz_scores`) must have `userId == request.auth.uid` and strictly immutable `userId` and `createdAt` (bound to `request.time`).
- No anonymous or unauthenticated user may create, read, update, or delete records.
- Documents cannot exceed strictly bounded string sizes and property sets.
- `EncryptionRun` payloads strictly validate `inputFormat` in `['text', 'hex', 'tiny-N4', 'tiny-N8', 'tiny-N16']` and `outputFormat` in `['hex', 'base64', 'numbers', 'binary']` to support both Full RC4 and TinyRC4 runs.

## 2. The "Dirty Dozen" Payloads
1. **Unauthenticated Read**: Attempt to read `/users/victim_user` with `request.auth == null` -> DENY
2. **Cross-User Profile Read**: User A reading `/users/user_B` -> DENY
3. **Identity Spoofing on Run Creation**: User A creating `/encryption_runs/run1` with `userId: "user_B"` -> DENY
4. **Forged Timestamp Attack**: Creating an encryption run with `createdAt: 1999-01-01` instead of `request.time` -> DENY
5. **Shadow Field Injection**: Adding `{ backdoorKey: "secret_123" }` to `EncryptionRun` -> DENY
6. **Denial of Wallet Oversized String**: Submitting a note exceeding 500 characters -> DENY
7. **Cross-User List Query**: User A running a collection query on `/experiment_runs` without `userId == request.auth.uid` filter -> DENY
8. **Owner Mutation on Update**: User A attempting to change `userId` on existing `/experiment_runs/exp1` -> DENY
9. **Tampering with Quiz Score**: Setting `score: 999` or negative numbers -> DENY
10. **Malicious Path ID Injection**: Target path `/encryption_runs/../../../evil` with invalid characters -> DENY
11. **Impersonating Admin without verification**: Claiming admin email with unverified token -> DENY
12. **Foreign Delete**: User A attempting to delete User B's `/quiz_scores/score_B` -> DENY
