import { ChatOpenAI } from '@langchain/openai';
import { JsonOutputFunctionsParser } from 'langchain/output_parsers';
import { ZodSchema } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';

export function jsonAgent(modelName: string, schema: ZodSchema) {
  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName,
    temperature: 0,
    modelKwargs: { seed: 1337 },
  });

  // core functionality functions
  const functionCallingModel = llm.bind({
    functions: [
      {
        name: 'output_formatter',
        description: 'Should always be used to properly format output',
        parameters: zodToJsonSchema(schema),
      },
    ],
    function_call: { name: 'output_formatter' },
  });

  return functionCallingModel.pipe(new JsonOutputFunctionsParser());
}
