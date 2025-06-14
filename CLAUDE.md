# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Azure OpenAI** adaptation of the OpenAI Realtime Agents Demo, showcasing advanced voice agent patterns using Azure's implementation of the OpenAI Realtime API combined with the OpenAI Agents SDK. It implements one key architectural pattern:

1. **Sequential Handoff Pattern**: Specialized agents with intent-based transfers for complex multi-agent workflows

## Development Commands

```bash
# Core development workflow
npm run dev        # Start development server (localhost:3000)
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint

# Environment setup (Azure-specific)
# Add these to .env file:
# AZURE_OPENAI_API_KEY=<your-azure-key>
# AZURE_OPENAI_ENDPOINT=<your-azure-endpoint>
# AZURE_OPENAI_API_VERSION=2025-04-01-preview
# AZURE_OPENAI_DEPLOYMENT=gpt-4.1
```

## Azure-Specific Architecture

### Key Differences from Standard OpenAI
- **Endpoints**: Uses Azure OpenAI services instead of OpenAI direct
  - Session creation: `https://actig-gpt.openai.azure.com/openai/realtimeapi/sessions`
  - Realtime API: `https://eastus2.realtimeapi-preview.ai.azure.com/v1/realtimertc`
- **Authentication**: `AZURE_OPENAI_API_KEY` instead of `OPENAI_API_KEY`
- **Models**: `gpt-4o-mini-realtime-preview` (realtime) + `gpt-4.1` (supervisor)
- **API Versioning**: Azure-specific versions (`2025-04-01-preview`, `2024-08-01-preview`)

### Modern Hooks Architecture
- **useRealtimeSession**: Modern React hook for Azure OpenAI session management
- **useHandleSessionHistory**: Comprehensive session history and event handling
- **WebRTC Transport**: Custom configuration for Azure endpoints
- **Session Management**: Ephemeral tokens via `/api/session` endpoint
- **Event Handling**: Azure-specific event forwarding and error handling

## Agent Configuration System

### Agent Scenarios
- `src/app/agentConfigs/simpleHandoff.ts` - Basic greeter → haiku writer handoff
- `src/app/agentConfigs/customerServiceRetail/` - Complex multi-agent customer service flow
- `src/app/agentConfigs/chatSupervisor/` - Hybrid realtime/text model approach

### Configuration Format
```typescript
{
  instructions: string,           // Agent behavior instructions
  tools?: Tool[],                // Available function calls
  handoff?: HandoffConfig[],     // Agent transfer rules
  model?: string                 // Optional model override
}
```

### Tool Integration
- **Supervisor Pattern**: Complex tool calls delegated to GPT-4.1 via Azure OpenAI
- **Proxy API**: `/api/responses/` bridges client requests to Azure OpenAI
- **Custom Logic**: Agent-specific tool implementations

## State Management Architecture

### React Context Pattern
- **TranscriptContext**: Conversation history and streaming updates
- **EventContext**: Real-time event logging and debugging
- **Custom Hooks**: `useRealtimeSession` for WebRTC, `useAudioDownload` for recording

### Azure Integration Layer
- **AzureOpenAI Client**: Configured in `src/app/lib/callOai.ts`
- **Environment Setup**: `src/app/lib/envSetup.ts` handles Azure-specific config
- **Audio Utils**: `src/app/lib/audioUtils.ts` for WebRTC audio processing

## Content Safety System

### Guardrails Implementation
- **Real-time Moderation**: `src/app/agentConfigs/guardrails.ts`
- **Azure OpenAI Integration**: Uses Azure's content filtering
- **Categories**: OFFENSIVE, OFF_BRAND, VIOLENCE, NONE
- **Visual Indicators**: GuardrailChip components show moderation status

## Technical Implementation Details

### Azure Realtime API Integration
- **Session Creation**: Custom Azure endpoint for ephemeral tokens
- **WebRTC Configuration**: Azure-specific transport settings
- **Model Selection**: Configurable between Azure OpenAI deployments
- **Error Handling**: Azure-specific error codes and responses

### Development Notes
- **TypeScript Strict Mode**: Enabled with path mapping (`@/*` → `./src/*`)
- **ESLint Configuration**: Relaxed rules for agent patterns (`no-explicit-any`, `exhaustive-deps` disabled)
- **Next.js App Router**: Modern routing with API routes for Azure proxy
- **No Test Framework**: Currently no automated testing configured
- **WebRTC Audio**: Direct browser-to-Azure connection for low latency