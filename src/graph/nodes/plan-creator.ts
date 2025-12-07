import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { AgentStateType } from '../state.js';
import { PlanStep, ComplexityLevel } from '../../types/index.js';
import { awesomeDebugger, ChalkColors } from '../../utils/debug.js';
import { toolRegistry } from '../../tools/registry.js';

/**
 * Plan Creator Node
 *
 * Creates a step-by-step execution plan based on summary and pain points
 */
export async function planCreatorNode(state: AgentStateType): Promise<Partial<AgentStateType>> {
  awesomeDebugger('📋 Plan Creator Agent - Generating execution plan...', ChalkColors.Blue, 'bold');

  const llm = new ChatOpenAI({
    modelName: 'gpt-4o',
    temperature: 0.4,
  });

  const availableTools = Object.keys(toolRegistry).join(', ');

  const systemPrompt = `You are an expert planning agent. Create a step-by-step execution plan to address the user's request.

Available tools: ${availableTools}

For each step, provide:
- step: number (starting from 1)
- description: clear description of what needs to be done
- toolsNeeded: array of tool names needed (from available tools)
- estimatedComplexity: "low", "medium", or "high"

Return your plan as a JSON array of steps.
Example:
[
  {
    "step": 1,
    "description": "Search for recent information",
    "toolsNeeded": ["search"],
    "estimatedComplexity": "medium"
  }
]

Return ONLY the JSON array, no additional text.`;

  const messages = [
    new HumanMessage({ content: systemPrompt }),
    new HumanMessage({
      content: `Summary: ${state.summary}\n\nPain Points:\n${state.painPoints?.join('\n')}`,
    }),
  ];

  const response = await llm.invoke(messages);
  const content = response.content as string;

  // Parse the JSON response
  let plan: PlanStep[] = [];
  try {
    const parsedPlan = JSON.parse(content);
    plan = parsedPlan.map((step: any) => ({
      step: step.step,
      description: step.description,
      toolsNeeded: step.toolsNeeded || [],
      estimatedComplexity: step.estimatedComplexity as ComplexityLevel,
    }));
  } catch (error) {
    awesomeDebugger('⚠️  Failed to parse plan JSON', ChalkColors.Yellow);
    plan = [
      {
        step: 1,
        description: content,
        toolsNeeded: [],
        estimatedComplexity: ComplexityLevel.MEDIUM,
      },
    ];
  }

  awesomeDebugger(`✅ Plan Created: ${plan.length} steps`, ChalkColors.Green);
  plan.forEach((step) => {
    awesomeDebugger(
      `   Step ${step.step}: ${step.description} [${step.estimatedComplexity}]`,
      ChalkColors.Cyan
    );
    if (step.toolsNeeded.length > 0) {
      awesomeDebugger(`      Tools: ${step.toolsNeeded.join(', ')}`, ChalkColors.Gray);
    }
  });

  return {
    plan,
    sender: 'plan_creator',
    messages: [new AIMessage({ content: JSON.stringify(plan), name: 'plan_creator' })],
  };
}
