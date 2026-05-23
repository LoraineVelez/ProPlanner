# Firestore Security Specification - Multi-User Dashboard

This document details the Zero-Trust data invariants and rules for the multi-user PTO and Coverage Planner.

## 1. Data Invariants
- Anyone can read a specific calendar via its shared ID, which connects visitors directly to a viewer's live calendar.
- Only the authenticated owner (`request.auth.uid == resource.data.ownerId`) can update or delete their calendar.
- Only authenticated users can create new calendars, setting themselves as the `ownerId`.

## 2. Security Rules Mapping
- **Read**: `allow read: if true;` (enables guests to view the planner and fetch dynamic configurations synchronously).
- **Create**: `allow create: if request.auth != null && request.resource.data.ownerId == request.auth.uid;`
- **Update**: `allow update: if request.auth != null && resource.data.ownerId == request.auth.uid && request.resource.data.ownerId == request.auth.uid;`
- **Delete**: `allow delete: if request.auth != null && resource.data.ownerId == request.auth.uid;`
