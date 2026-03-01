# LLM-powered Chat Task Tracker

## GOAL
Build a small LLM-powered chat task tracker that turns a stream of chat messages into structured tasks, supports completing tasks and attaching free-text details, and provides a simple read-only web UI to view tasks.

This test is designed to evaluate:
- Practical product engineering with LLMs (prompting, tool/function calling, guardrails)
- Backend fundamentals (idempotency, persistence, correctness)
- End-to-end wiring (chat input → LLM → actions → storage → web view)

## Prerequisites
- Docker ([download here](https://www.docker.com/products/docker-desktop/))

## INSTALLATION
1. **Clone the repository:**
   ```bash
   git clone https://github.com/ggallardo1/brighte-eats-app.git
   cd brighte-eats-apps
   cp .env.example .env

2. **Install dependencies:**  
Using Docker, make sure [docker desktop](https://www.docker.com/products/docker-desktop/) is installed:
    ```bash
    docker-compose up --build

3. **Run Webui**
Open in your browser, [http://localhost:5173/](http://localhost:5173/)

## ARCHITECTURE OVERVIEW
This application follows a **Controller-Service-Repository** pattern with an integrated **LLM Reasoning Layer**.

- Frontend (React): A unified interface to display readonly task and propmt chat
- Backend (Node/Express/Typescript): Manages state and history and api
- LLM Layer (Gemini): Uses Function Calling to handle tasks creation
- Storage (PostgreSQL): Persists, tasks, free text details and conversation threads.

## LLM Strategy & Tooling
- The application uses Gemini 2.5 Flash with a Function Calling (Tools) architecture. This ensures the LLM acts as a structured reasoning engine rather than just a text generator.
- Reasoning Layer: Instead of parsing raw text with Regex, the system provides the LLM with a set of executable tools (create_tasks, complete_tasks, append_detail).
- Context Injection (S3 & S4): For every request, the backend injects the current "Small Task-Set" (titles, IDs, and statuses) into the system prompt. This allows the LLM to map natural language (e.g., "the plumbing work") to a specific database ID ("fix the kitchen sink").
- Strict Schema: We use a JSON schema to force the LLM to return valid arguments for our internal CommandExecutor, ensuring type safety between the AI's intent and our database operations.

## Idempotency
To satisfy the S2 requirement, the system implements a Content Hashing strategy to ensure that duplicate requests do not result in duplicate side effects.

- Hashing: Every incoming userMessage is passed through a SHA-256 hashing utility.
- Persistence: We maintain a ProcessedMessages table in PostgreSQL that stores these unique hashes.
- Guard Logic: Before the LLM is even invoked, the system checks if the hash already exists:
- If Match Found: The system immediately returns a "Duplicate message ignored" response, bypassing the LLM and the Task repository entirely.
- If New: The message is processed, and the hash is saved to prevent future duplicates.

Benefit: This protects the system from network retries, double-clicks on the "Send" button, and saves unnecessary LLM API costs.

## System Reset
- A dedicated administrative endpoint POST /admin/reset is provided to return the application to a "Clean Slate."
- Atomic Operation: Uses a database transaction to truncate the Task, TaskDetail, and ProcessedMessage tables simultaneously.
- Frontend Integration: Accessible via the "ADMIN RESET" button in the Web UI for rapid testing and demoing.

## Demo Path

1. Create. Type "I need to buy groceries, fix the kitchen sink, and email the landlord about the lease." - Observe 3 tasks created.
2. Complete. Type "I finished the plumbing work." - Observe the "buy groceries" task to be moved to completed.
3. Detail. Type "For the groceries, make sure to get bacon, eggs, and almond milk." - Observe the detail attached to the "Buy groceries".
4. Idempotency. Send the exact same message from Step 4 again: "I finished the plumbing work."  - Observe that only one task/detail is generated.
