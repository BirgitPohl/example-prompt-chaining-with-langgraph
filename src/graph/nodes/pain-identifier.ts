import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { AgentStateType } from '../state.js';
import { awesomeDebugger, ChalkColors } from '../../utils/debug.js';

/**
 * Pain Identifier Node
 *
 * Analyzes the summary to identify pain points and challenges
 */
export async function painIdentifierNode(state: AgentStateType): Promise<Partial<AgentStateType>> {
  awesomeDebugger('🔍 Pain Identifier Agent - Analyzing pain points...', ChalkColors.Blue, 'bold');

  const llm = new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0.3,
  });

  const systemPrompt = `You are an expert at identifying pain points and challenges from user requests.
Analyze the summary and identify:
1. Core problems the user is facing
2. Underlying challenges or obstacles
3. What the user is trying to achieve

Return your analysis as a JSON array of pain points.
Example: ["Problem 1", "Problem 2", "Problem 3"]

Return ONLY the JSON array, no additional text.`;

  const messages = [
    new HumanMessage({ content: systemPrompt }),
    new HumanMessage({ content: `Summary: ${state.summary}` }),
  ];

  const response = await llm.invoke(messages);
  const content = response.content as string;

  // Parse the JSON response
  let painPoints: string[] = [];
  try {
    painPoints = JSON.parse(content);
  } catch (error) {
    awesomeDebugger('⚠️  Failed to parse pain points JSON, using raw response', ChalkColors.Yellow);
    painPoints = [content];
  }

  awesomeDebugger(`✅ Pain Points Identified: ${painPoints.length}`, ChalkColors.Green);
  painPoints.forEach((point, idx) => {
    awesomeDebugger(`   ${idx + 1}. ${point}`, ChalkColors.Cyan);
  });

  return {
    painPoints,
    sender: 'pain_identifier',
    messages: [new AIMessage({ content: JSON.stringify(painPoints), name: 'pain_identifier' })],
  };
}
