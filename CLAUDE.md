# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` - Start development server (default port 3000)
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Architecture Overview

This is a Next.js TypeScript application demonstrating advanced voice agent patterns using the OpenAI Realtime API and OpenAI Agents SDK.

### Core Patterns

1. **Chat-Supervisor Pattern** (`src/app/agentConfigs/chatSupervisor/`):
   - Realtime chat agent handles basic interactions
   - Text-based supervisor model (GPT-4.1) handles complex tool calls
   - Lower latency with intelligent fallback

2. **Sequential Handoff Pattern** (`src/app/agentConfigs/customerServiceRetail/`):
   - Specialized agents transfer users between them
   - Each agent has specific domain expertise
   - Handoffs coordinated via tool calls and session updates

### Key Directories

- `src/app/agentConfigs/` - Agent configuration files and logic
- `src/app/components/` - UI components (Transcript, Events, Toolbar)
- `src/app/contexts/` - React contexts for events and transcripts
- `src/app/hooks/` - Custom React hooks
- `src/app/lib/` - Utility functions and API helpers
- `src/app/api/` - Next.js API routes for session management

### Agent Configuration System

New agent scenarios are registered in `src/app/agentConfigs/index.ts`:

```typescript
export const allAgentSets: Record<string, RealtimeAgent[]> = {
  scenarioName: scenarioAgents,
};
```

Agent configs define instructions, tools, toolLogic, and handoff relationships.

## Environment Setup

- Requires `OPENAI_API_KEY` in environment variables or `.env` file
- Copy `.env.sample` to `.env` and add your API key

## Development Notes

- Default agent scenario is `chatSupervisor`
- Switch scenarios via "Scenario" dropdown in UI
- WebRTC connection established via `/api/session` endpoint
- Guardrails check assistant messages before display
- Tool calls return `True` by default unless custom toolLogic is defined