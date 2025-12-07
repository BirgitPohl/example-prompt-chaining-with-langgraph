import { StateGraph, END } from '@langchain/langgraph';
import { AgentState, AgentStateType } from './state.js';
import { summarizerNode } from './nodes/summarizer.js';
import { painIdentifierNode } from './nodes/pain-identifier.js';
import { planCreatorNode } from './nodes/plan-creator.js';
import { aiSpawnerNode } from './nodes/ai-spawner.js';
import { responderNode } from './nodes/responder.js';
import { awesomeDebugger, ChalkColors } from '../utils/debug.js';

/**
 * Create the multi-agent workflow graph
 *
 * Flow: User → Summarizer → Pain Identifier → Plan Creator → AI Spawner → Responder → END
 */
export function createWorkflow() {
  awesomeDebugger('\n🏗️  Building LangGraph workflow...', ChalkColors.Magenta, 'bold');

  const workflow = new StateGraph(AgentState)
    // Add all agent nodes
    .addNode('summarizer', summarizerNode)
    .addNode('pain_identifier', painIdentifierNode)
    .addNode('plan_creator', planCreatorNode)
    .addNode('ai_spawner', aiSpawnerNode)
    .addNode('responder', responderNode)

    // Define the sequential flow
    .addEdge('__start__', 'summarizer')
    .addEdge('summarizer', 'pain_identifier')
    .addEdge('pain_identifier', 'plan_creator')
    .addEdge('plan_creator', 'ai_spawner')
    .addEdge('ai_spawner', 'responder')
    .addEdge('responder', END);

  const graph = workflow.compile();

  awesomeDebugger('✅ LangGraph workflow built successfully', ChalkColors.Green, 'bold');
  awesomeDebugger(
    '\nWorkflow: User → Summarizer → Pain Identifier → Plan Creator → AI Spawner → Responder\n',
    ChalkColors.Cyan
  );

  return graph;
}
