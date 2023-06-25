"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var json_server_1 = __importDefault(require("json-server"));
var faker_1 = require("@faker-js/faker");
var commander_1 = require("commander");
var server = json_server_1.default.create();
var router = json_server_1.default.router('openai-mock.json');
var middlewares = json_server_1.default.defaults();
server.use(middlewares);
server.use(router);
// Custom route to simulate the OpenAI API
server.post('/v1/completions', function (req, res) {
    var prompt = req.body.prompt;
    // Generate a fake completion using faker
    var fakeCompletion = {
        id: faker_1.faker.string.uuid(),
        object: 'text_completion',
        created: faker_1.faker.date.soon,
        model: 'text-davinci-003',
        choices: [
            {
                text: 'you asked ' + prompt + ' ' + faker_1.faker.lorem.sentence(),
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
commander_1.program
    .option('-p, --port <number>', 'Specify the port number')
    .parse(process.argv);
var port = commander_1.program.opts().port || 9000;
server.listen(port, function () {
    console.log("OpenAI mock server is running on port ".concat(port));
});
