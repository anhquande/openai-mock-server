import jsonServer from 'json-server';
import { faker } from '@faker-js/faker';
import { program } from 'commander';
import e from 'express';

const server = jsonServer.create();
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Custom route to simulate the OpenAI API
const handleOpenaiRequest = (req: e.Request, res: e.Response) => {
  const { prompt } = req.body || { prompt: 'EMPTY' };

  // Generate a fake completion using faker
  const fakeCompletion = {
    id: faker.string.uuid(),
    object: 'text_completion',
    created: faker.date.soon,
    model: 'text-davinci-003',
    choices: [
      {
        text: faker.lorem.sentence({ min: 3, max: 300 }),
        logprobs: null,
        finish_reason: 'length',
        index: 0
      }
    ],
    usage: {
      prompt_tokens: 6,
      completion_tokens: 16,
      total_tokens: 22
    }
  };

  // Send the fake completion as the response
  res.json(fakeCompletion);
};

server.post('/v1/completions', handleOpenaiRequest);
server.get('/v1/completions', handleOpenaiRequest);

const router = jsonServer.router('openai-mock.json');

server.use(router);

program
  .option('-p, --port <number>', 'Specify the port number')
  .parse(process.argv);

const port = program.opts().port || 9000;

server.listen(port, () => {
  console.log(`OpenAI mock server is running on port ${port}`);
});
