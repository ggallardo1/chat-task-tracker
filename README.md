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

## Idempotency

## System Reset

## Demo Path

1. Create. Type "I need to buy groceries, fix the kitchen sink, and email the landlord about the lease." - Observe 3 tasks created.
2. Complete. Type "I finished the plumbing work." - Observe the "buy groceries" task to be moved to completed.
3. Detail. Type "For the groceries, make sure to get bacon, eggs, and almond milk." - Observe the detail attached to the "Buy groceries".
4. Idempotency. Send the exact same message from Step 4 again: "I finished the plumbing work."  - Observe that only one task/detail is generated.
