import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { AgentStateType } from '../state.js';
import { awesomeDebugger, ChalkColors } from '../../utils/debug.js';

/**
 * Responder Node
 *
 * Aggregates all results from previous agents and creates a final, comprehensive response
 */
export async function responderNode(state: AgentStateType): Promise<Partial<AgentStateType>> {
  awesomeDebugger('📢 Responder Agent - Creating final response...', ChalkColors.Blue, 'bold');

  const llm = new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0.4,
    maxTokens: 3000,
  });

  const systemPrompt = `You are a response aggregation expert. Your task is to:
1. Review all the information gathered from previous agents
2. Synthesize the results into a coherent, comprehensive response
3. Address the user's original query directly and completely
4. Present the information in a clear, well-structured format

Create a natural, helpful response that answers the user's question using all available information.`;

  // Prepare context from all previous steps
  const context = `
User's Original Query: ${state.messages[0].content}

Summary: ${state.summary}

Pain Points Identified:
${state.painPoints?.map((p, i) => `${i + 1}. ${p}`).join('\n')}

Execution Plan:
${state.plan?.map((p) => `Step ${p.step}: ${p.description}`).join('\n')}

Results from Specialized Agents:
${JSON.stringify(state.spawnedResults, null, 2)}
`;

  const messages = [
    new HumanMessage({ content: systemPrompt }),
    new HumanMessage({ content: context }),
  ];

  const response = await llm.invoke(messages);
  const finalResponse = response.content as string;

  awesomeDebugger('\n' + '='.repeat(80), ChalkColors.Cyan);
  awesomeDebugger('📋 FINAL RESPONSE:', ChalkColors.Green, 'bold');
  awesomeDebugger('='.repeat(80), ChalkColors.Cyan);
  awesomeDebugger(finalResponse, ChalkColors.White);
  awesomeDebugger('='.repeat(80) + '\n', ChalkColors.Cyan);

  return {
    finalResponse,
    sender: 'responder',
    messages: [new AIMessage({ content: finalResponse, name: 'responder' })],
  };
}
