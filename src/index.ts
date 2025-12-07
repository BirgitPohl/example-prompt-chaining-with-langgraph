import dotenv from 'dotenv';
dotenv.config();

import { HumanMessage } from '@langchain/core/messages';
import { createWorkflow } from './graph/workflow.js';
import { awesomeDebugger, ChalkColors } from './utils/debug.js';

/**
 * Demo script for the LangGraph multi-agent system
 */

async function main() {
  awesomeDebugger('\n🚀 LangGraph Multi-Agent Demo\n', ChalkColors.Cyan, 'bold');

  const graph = createWorkflow();

  const exampleQuery = 'What are the latest developments in AI agents and how can I use them in my TypeScript projects?';

  awesomeDebugger(`📝 Example Query: ${exampleQuery}\n`, ChalkColors.White, 'bold');

  try {
    const result = await graph.invoke({
      messages: [new HumanMessage({ content: exampleQuery })],
    });

    awesomeDebugger('\n✅ Demo completed successfully!', ChalkColors.Green, 'bold');
    awesomeDebugger('\nFinal State:', ChalkColors.Cyan, 'bold');
    awesomeDebugger(`- Summary: ${result.summary}`, ChalkColors.White);
    awesomeDebugger(`- Pain Points: ${result.painPoints?.length || 0}`, ChalkColors.White);
    awesomeDebugger(`- Plan Steps: ${result.plan?.length || 0}`, ChalkColors.White);
    awesomeDebugger(`- Spawned Results: ${Object.keys(result.spawnedResults || {}).length}`, ChalkColors.White);
    awesomeDebugger(`- Final Response Length: ${result.finalResponse?.length || 0} chars\n`, ChalkColors.White);
  } catch (error) {
    awesomeDebugger('\n❌ Error running demo:', ChalkColors.Red, 'bold');
    awesomeDebugger(String(error), ChalkColors.Red);
    console.error(error);
  }
}

main();
