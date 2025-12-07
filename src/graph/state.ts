import { Annotation } from '@langchain/langgraph';
import { BaseMessage } from '@langchain/core/messages';
import { PlanStep } from '../types/index.js';

/**
 * LangGraph State Definition
 *
 * The state acts as a shared memory that flows through all agents in the graph.
 * Each agent node can read from and write to this state, enabling agents to pass
 * information to each other in a sequential chain:
 *
 * User Query → Summarizer → Pain Identifier → Plan Creator → AI Spawner → Responder
 *
 * Each field has a reducer function that determines how updates are merged.
 * The default reducer (x, y) => y ?? x keeps the latest non-null value.
 */
export const AgentState = Annotation.Root({
  // Conversation messages - accumulates all messages between user and agents
  messages: Annotation<BaseMessage[]>({
    reducer: (x, y) => x.concat(y),
  }),

  // Current sender - tracks which agent is currently active
  sender: Annotation<string>({
    reducer: (x, y) => y ?? x ?? 'user',
    default: () => 'user',
  }),

  // Summarizer output - condensed version of user query
  summary: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => '',
  }),

  // Pain identifier output - extracted pain points from the query
  painPoints: Annotation<string[]>({
    reducer: (x, y) => y ?? x ?? [],
    default: () => [],
  }),

  // Plan creator output - step-by-step execution plan
  plan: Annotation<PlanStep[]>({
    reducer: (x, y) => y ?? x ?? [],
    default: () => [],
  }),

  // AI spawner results - outputs from dynamically spawned specialized agents
  spawnedResults: Annotation<Record<string, any>>({
    reducer: (x, y) => ({ ...x, ...y }),
    default: () => ({}),
  }),

  // Final response - aggregated result from the responder agent
  finalResponse: Annotation<string>({
    reducer: (x, y) => y ?? x,
    default: () => '',
  }),
});

export type AgentStateType = typeof AgentState.State;
