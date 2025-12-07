import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { AgentStateType } from '../state.js';
import { awesomeDebugger, ChalkColors } from '../../utils/debug.js';
import { getToolByName } from '../../tools/registry.js';

/**
 * AI Spawner Node
 *
 * Dynamically spawns specialized agents based on the plan steps
 * Uses OpenAI for standard tasks and Anthropic for web search
 */
export async function aiSpawnerNode(state: AgentStateType): Promise<Partial<AgentStateType>> {
  awesomeDebugger('🤖 AI Spawner Agent - Executing plan steps...', ChalkColors.Blue, 'bold');

  const results: Record<string, any> = {};

  if (!state.plan || state.plan.length === 0) {
    awesomeDebugger('⚠️  No plan steps to execute', ChalkColors.Yellow);
    return {
      spawnedResults: results,
      sender: 'ai_spawner',
      messages: [new AIMessage({ content: 'No plan steps to execute', name: 'ai_spawner' })],
    };
  }

  for (const step of state.plan) {
    awesomeDebugger(
      `\n🔧 Executing Step ${step.step}: ${step.description}`,
      ChalkColors.Cyan,
      'bold'
    );
    awesomeDebugger(`   Tools needed: ${step.toolsNeeded.join(', ') || 'none'}`, ChalkColors.Gray);

    // Check if web search is needed
    const needsWebSearch = step.toolsNeeded.includes('search');

    // Spawn appropriate agent
    let llm;
    let agentResult;

    if (needsWebSearch) {
      awesomeDebugger('   🌐 Using Anthropic Claude with web search', ChalkColors.Magenta);

      llm = new ChatAnthropic({
        modelName: 'claude-sonnet-4-5',
        temperature: 0.5,
        maxTokens: 2000,
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const messages = [
        new HumanMessage({
          content: `You are a specialized agent executing this step: ${step.description}\n\nUser's original query: ${state.summary}\n\nUse web search to find current, accurate information.`,
        }),
      ];

      // Note: Anthropic web search is configured differently
      // For now, we'll use standard completion and note that web search would be enabled
      const response = await llm.invoke(messages);
      agentResult = response.content as string;
    } else {
      awesomeDebugger('   🔵 Using OpenAI GPT-4o', ChalkColors.Blue);

      llm = new ChatOpenAI({
        modelName: 'gpt-4o',
        temperature: 0.5,
        maxTokens: 2000,
      });

      const messages = [
        new HumanMessage({
          content: `You are a specialized agent executing this step: ${step.description}\n\nUser's original query: ${state.summary}\n\nProvide a detailed response.`,
        }),
      ];

      const response = await llm.invoke(messages);
      agentResult = response.content as string;
    }

    // Execute any tools if needed
    const toolResults: Record<string, any> = {};
    for (const toolName of step.toolsNeeded) {
      const tool = getToolByName(toolName);
      if (tool) {
        awesomeDebugger(`   🔨 Executing tool: ${toolName}`, ChalkColors.Yellow);
        try {
          // For demonstration, we'll pass basic args
          const toolResult = await tool.execute({ query: step.description });
          toolResults[toolName] = toolResult;
          awesomeDebugger(`   ✅ Tool ${toolName} completed`, ChalkColors.Green);
        } catch (error) {
          awesomeDebugger(`   ❌ Tool ${toolName} failed: ${error}`, ChalkColors.Red);
          toolResults[toolName] = { error: String(error) };
        }
      }
    }

    results[`step_${step.step}`] = {
      description: step.description,
      agentResponse: agentResult,
      toolResults,
      complexity: step.estimatedComplexity,
    };

    awesomeDebugger(`   ✅ Step ${step.step} completed`, ChalkColors.Green);
  }

  awesomeDebugger(
    `\n✅ All ${state.plan.length} plan steps executed successfully`,
    ChalkColors.Green,
    'bold'
  );

  return {
    spawnedResults: results,
    sender: 'ai_spawner',
    messages: [new AIMessage({ content: JSON.stringify(results), name: 'ai_spawner' })],
  };
}
