#!/usr/bin/env node

import * as readline from 'readline';
import { HumanMessage } from '@langchain/core/messages';
import { createWorkflow } from './graph/workflow.js';
import { awesomeDebugger, ChalkColors } from './utils/debug.js';
import chalk from 'chalk';

/**
 * Interactive CLI for the LangGraph multi-agent system
 */

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let conversationHistory: any[] = [];
const graph = createWorkflow();

console.clear();
console.log(chalk.cyan.bold('\n╔════════════════════════════════════════════════════════════════╗'));
console.log(chalk.cyan.bold('║   LangGraph Multi-Agent Prompt Chaining System                ║'));
console.log(chalk.cyan.bold('╚════════════════════════════════════════════════════════════════╝\n'));

console.log(chalk.white('This system uses multiple specialized AI agents:'));
console.log(chalk.gray('  1. 📝 Summarizer - Condenses your query'));
console.log(chalk.gray('  2. 🔍 Pain Identifier - Identifies challenges'));
console.log(chalk.gray('  3. 📋 Plan Creator - Creates execution plan'));
console.log(chalk.gray('  4. 🤖 AI Spawner - Executes plan with specialized agents'));
console.log(chalk.gray('  5. 📢 Responder - Delivers final answer\n'));

console.log(chalk.yellow('Commands:'));
console.log(chalk.gray('  /help    - Show this help message'));
console.log(chalk.gray('  /clear   - Clear the screen'));
console.log(chalk.gray('  /reset   - Reset conversation history'));
console.log(chalk.gray('  /history - Show conversation history'));
console.log(chalk.gray('  /exit    - Exit the program\n'));

console.log(chalk.green('Type your query and press Enter to begin!\n'));

function prompt() {
  rl.question(chalk.blue.bold('You: '), async (input) => {
    const trimmedInput = input.trim();

    if (!trimmedInput) {
      prompt();
      return;
    }

    // Handle commands
    if (trimmedInput.startsWith('/')) {
      handleCommand(trimmedInput);
      return;
    }

    // Process user query through the graph
    try {
      console.log(chalk.magenta('\n🚀 Processing your query through the agent chain...\n'));

      const result = await graph.invoke({
        messages: [new HumanMessage({ content: trimmedInput })],
      });

      conversationHistory.push({
        user: trimmedInput,
        response: result.finalResponse,
        timestamp: new Date().toISOString(),
      });

      console.log(chalk.green.bold('\n✅ Processing complete!\n'));
    } catch (error) {
      console.log(chalk.red.bold('\n❌ Error processing query:'));
      console.log(chalk.red(String(error)));
      awesomeDebugger(`Error: ${error}`, ChalkColors.Red);
    }

    console.log('\n');
    prompt();
  });
}

function handleCommand(command: string) {
  const cmd = command.toLowerCase();

  switch (cmd) {
    case '/help':
      console.log(chalk.yellow('\nAvailable Commands:'));
      console.log(chalk.gray('  /help    - Show this help message'));
      console.log(chalk.gray('  /clear   - Clear the screen'));
      console.log(chalk.gray('  /reset   - Reset conversation history'));
      console.log(chalk.gray('  /history - Show conversation history'));
      console.log(chalk.gray('  /exit    - Exit the program\n'));
      break;

    case '/clear':
      console.clear();
      console.log(chalk.cyan.bold('Screen cleared!\n'));
      break;

    case '/reset':
      conversationHistory = [];
      console.log(chalk.green('✅ Conversation history reset!\n'));
      break;

    case '/history':
      if (conversationHistory.length === 0) {
        console.log(chalk.yellow('\nNo conversation history yet.\n'));
      } else {
        console.log(chalk.cyan.bold('\n📜 Conversation History:\n'));
        conversationHistory.forEach((item, index) => {
          console.log(chalk.blue(`[${index + 1}] ${item.timestamp}`));
          console.log(chalk.white(`You: ${item.user}`));
          console.log(chalk.green(`AI: ${item.response}\n`));
        });
      }
      break;

    case '/exit':
      console.log(chalk.cyan('\n👋 Goodbye!\n'));
      rl.close();
      process.exit(0);

    default:
      console.log(chalk.red(`\n❌ Unknown command: ${command}`));
      console.log(chalk.gray('Type /help for available commands\n'));
  }

  prompt();
}

// Handle Ctrl+C
rl.on('SIGINT', () => {
  console.log(chalk.cyan('\n\n👋 Goodbye!\n'));
  process.exit(0);
});

// Start the CLI
prompt();
