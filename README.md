# LLM-powered Chat Task Tracker

## GOAL
Build a small LLM-powered chat task tracker that turns a stream of chat messages into structured tasks, supports completing tasks and attaching free-text details, and provides a simple read-only web UI to view tasks.

This test is designed to evaluate:
- Practical product engineering with LLMs (prompting, tool/function calling, guardrails)
- Backend fundamentals (idempotency, persistence, correctness)
- End-to-end wiring (chat input → LLM → actions → storage → web view)



## ARCHITECTURE OVERVIEW
This application follows a **Controller-Service-Repository** pattern with an integrated **LLM Reasoning Layer**.

- Frontend (React): A unified interface to display readonly task and propmt chat
- Backend (Node/Express/Typescript): Manages state and history and api
- LLM Layer (Gemini): Uses Function Calling to handle tasks creation
- Storage (PostgreSQL): Persists, tasks, free text details and conversation threads.

## LLM Strategy & Tooling

## Idempotency

## System Reset

## Demo Path

1. Create. Type "I need to take a bath, buy groceries, and buy coffee" - Observe 3 tasks created.
2. Complete. Type "I bought groceries" - Observe the "buy groceries" task to be moved to completed.
3. Detail. Type "For the groceries, make sure to get bacon and eggs." - Observe the detail attached to the "Buy groceries".
4. Idempotency. Click "Send" twice rapidly on a message - Observe that only one task/detail is generated.
