import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { AgentStateType } from '../state.js';
import { awesomeDebugger, ChalkColors } from '../../utils/debug.js';

/**
 * Summarizer Node
 *
 * Takes the user query and creates a concise summary
 */
export async function summarizerNode(state: AgentStateType): Promise<Partial<AgentStateType>> {
  awesomeDebugger('📝 Summarizer Agent - Processing user query...', ChalkColors.Blue, 'bold');

  const llm = new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0.3,
  });

  const systemPrompt = `You are a summarization expert. Your task is to:
1. Read and understand the user's query
2. Extract the key information and intent
3. Create a concise, clear summary that captures the essence of the request

Keep the summary brief but informative (2-3 sentences max).`;

  const userQuery = state.messages[state.messages.length - 1].content as string;

  const messages = [
    new HumanMessage({ content: systemPrompt }),
    new HumanMessage({ content: `User Query: ${userQuery}` }),
  ];

  const response = await llm.invoke(messages);
  const summary = response.content as string;

  awesomeDebugger(`✅ Summary: ${summary}`, ChalkColors.Green);

  return {
    summary,
    sender: 'summarizer',
    messages: [new AIMessage({ content: summary, name: 'summarizer' })],
  };
}
