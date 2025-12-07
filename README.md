# Example Prompt Chaining with LangGraph

A multi-agent prompt chaining system built with **LangGraph.js** that demonstrates how to orchestrate multiple specialized AI agents to handle complex queries.

## 🌟 Features

- **Multi-Agent Architecture**: Sequential chain of specialized agents
- **LangGraph Framework**: Production-ready agent orchestration
- **Multi-Provider Support**: OpenAI GPT-4o + Anthropic Claude
- **State Management**: Shared state flowing through all agents
- **Interactive CLI**: Chat with the system in your terminal
- **Tool Integration**: Extensible tool system for various capabilities
- **Debug Logging**: Beautiful colored console output

## 🏗️ Architecture

The system chains five specialized agents in sequence:

```
User Query → 📝 Summarizer → 🔍 Pain Identifier → 📋 Plan Creator → 🤖 AI Spawner → 📢 Responder
```

### Agents

1. **Summarizer** - Condenses user query into a clear summary
2. **Pain Identifier** - Extracts pain points and challenges
3. **Plan Creator** - Generates step-by-step execution plan
4. **AI Spawner** - Dynamically spawns specialized agents for each plan step
5. **Responder** - Aggregates all results into final response

### LangGraph State

The state flows through all agents, with each agent reading from and writing to shared state:

- `messages`: Conversation history
- `summary`: Summarized query
- `painPoints`: Identified challenges
- `plan`: Execution plan with steps
- `spawnedResults`: Results from specialized agents
- `finalResponse`: Final aggregated answer

## 📋 Prerequisites

- Node.js 18+ or Bun
- OpenAI API key
- Anthropic API key (optional, for web search)

## 🚀 Installation

```bash
# Install dependencies
npm install

# or with bun
bun install
```

## ⚙️ Configuration

Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
AWESOME_DEBUG=true
```

## 💻 Usage

### Interactive CLI

Start the interactive chat interface:

```bash
npm run dev
# or
npm start
```

### Demo Script

Run the example demo:

```bash
npm run demo
```

### Commands (in CLI)

- `/help` - Show help message
- `/clear` - Clear the screen
- `/reset` - Reset conversation history
- `/history` - Show conversation history
- `/exit` - Exit the program

## 🛠️ Available Tools

The system includes the following tools:

- **search** - Web search using AI providers
- **calculate** - Mathematical calculations
- **analyzeData** - Data analysis and insights
- **format** - Text formatting and transformation
- **validate** - Data validation
- **dateTime** - Current date and time information

## 📚 Project Structure

```
src/
├── graph/
│   ├── state.ts              # LangGraph state definition
│   ├── workflow.ts           # Main workflow graph
│   └── nodes/
│       ├── summarizer.ts     # Summarizer agent
│       ├── pain-identifier.ts # Pain identifier agent
│       ├── plan-creator.ts   # Plan creator agent
│       ├── ai-spawner.ts     # AI spawner agent
│       └── responder.ts      # Responder agent
├── tools/
│   ├── registry.ts           # Tool registry
│   └── *.ts                  # Individual tool definitions
├── types/
│   └── index.ts              # TypeScript type definitions
├── utils/
│   └── debug.ts              # Awesome debugger utilities
├── cli.ts                    # Interactive CLI interface
└── index.ts                  # Demo entry point
```

## 🎨 Debug Logging

The system uses `awesomeDebugger` for beautiful console output. Enable it with:

```env
AWESOME_DEBUG=true
```

Colors indicate different stages:
- 🔵 Blue - Agent processing steps
- 🟢 Green - Successful completions
- 🔴 Red - Errors
- 🟡 Yellow - Warnings
- 🟣 Magenta - Web search operations
- 🔷 Cyan - Headers and summaries

## 🔄 How It Works

1. User submits a query through the CLI
2. **Summarizer** creates a concise summary
3. **Pain Identifier** extracts challenges from the summary
4. **Plan Creator** generates a step-by-step plan with required tools
5. **AI Spawner** executes each plan step:
   - Uses Anthropic Claude for web search tasks
   - Uses OpenAI GPT-4o for standard tasks
   - Executes required tools for each step
6. **Responder** aggregates all results into a comprehensive answer
7. Final response is displayed to the user

## 🆚 Comparison to Custom Implementation

This LangGraph version offers:

- ✅ Production-ready framework
- ✅ Built-in state management
- ✅ Type-safe graph construction
- ✅ Easier debugging and visualization
- ✅ Extensible architecture

## 📖 Learn More

- [LangGraph Documentation](https://langchain-ai.github.io/langgraphjs/)
- [LangChain Documentation](https://js.langchain.com/)
- [OpenAI API](https://platform.openai.com/docs)
- [Anthropic API](https://docs.anthropic.com/)

## 📝 License

MIT
