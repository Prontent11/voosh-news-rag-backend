import { retrieveContext } from "../retrieval/retrievalContext";
import { generateAnswer } from "../generation/answerGeneration";

async function test() {
  const question = "What is happening in global markets?";

  const context = await retrieveContext(question);
  const answer = await generateAnswer(question, context);

  console.log("\nANSWER:\n");
  console.log(answer);
}

test();
