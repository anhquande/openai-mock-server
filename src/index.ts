import jsonServer from 'json-server';
import { faker } from '@faker-js/faker';
import { program } from 'commander';

const server = jsonServer.create();
const router = jsonServer.router('openai-mock.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

// Custom route to simulate the OpenAI API
server.post('/v1/completions', (req, res) => {
  const { prompt } = req.body;

  // Generate a fake completion using faker
  const fakeCompletion = {
    id: faker.string.uuid(),
    object: 'text_completion',
    created: faker.date.soon,
    model: 'text-davinci-003',
    choices: [
      {
        text: 'you asked ' + prompt + ' ' + faker.lorem.sentence(),
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
});
program
  .option('-p, --port <number>', 'Specify the port number')
  .parse(process.argv);

const port = program.opts().port || 9000;

server.listen(port, () => {
  console.log(`OpenAI mock server is running on port ${port}`);
});
