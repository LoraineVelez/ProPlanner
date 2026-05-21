# Firestore Security Specification

This document details the data invariants, vulnerable payload types, and rule behaviors for the PTO and Coverage Planner application.

## 1. Data Invariants
- Anyone can read the shared global calendar configurations, schedules, and custom links (supporting guest access to employee links and print/PDF views).
- Day rows, custom holidays, and labels can be saved with comprehensive type-validation, preventing junk strings and invalid schema structures.
- Document IDs must conform to proper standard identifiers (e.g., standard identifiers under 128 characters, typically `global`).

## 2. The "Dirty Dozen" Payloads (Denial-of-Service / Integrity Attacks)
We enforce that payloads matching the following invalid shapes are strictly rejected:
1. Document ID Poisoning (1MB junk string ID)
2. Ghost fields inside update requests
3. Invalid non-object types for `dayRows`
4. Empty or missing required strings (e.g., empty `calendarTitle`)
5. Unbounded/oversized payload injections (e.g., `calendarTitle` exceeds limit)

## 3. Rules Mapping
We implement standard validation helpers in our rules matching `/calendars/{calendarId}` paths.
- **Read Operations**: Universal read allowed to support the shared link functionality.
- **Write Operations**: Type constraints and schema checks verified via `isValidCalendarState(request.resource.data)`.
