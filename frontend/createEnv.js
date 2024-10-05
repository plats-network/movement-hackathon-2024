const fs = require('fs');
const { exec } = require('child_process');

// Get command-line arguments (skipping the first two default arguments)
const args = process.argv.slice(2);

// Create an empty object to store the key-value pairs
const config = {};

// Parse the arguments (assuming format key=value)
args.forEach(arg => {
    const [key, value] = arg.split('=');
    config[key] = value;
});
console.log(config)

const AWS_PROFILE = config['AWS_PROFILE'] || ""
const SECRET_MANAGER_NAME = config['SECRET_MANAGER_NAME'] || ""
const TASK_DEFINITION_NAME = config['TASK_DEFINITION_NAME'] || ""

let profileConfig = "";
if (AWS_PROFILE) {
    profileConfig = `--profile ${AWS_PROFILE} `
}

// The Bash command to run
const commandSecret = `aws secretsmanager get-secret-value ${profileConfig}--secret-id ${SECRET_MANAGER_NAME} --query SecretString --output text`;
const commandTaskDefinition = `aws ecs describe-task-definition ${profileConfig}--task-definition ${TASK_DEFINITION_NAME} --query taskDefinition --output json`

// Execute the command
exec(commandTaskDefinition, (error, stdout, stderr) => {
    if (error || stderr) {
        console.log(error);
        console.log(stderr);
        return;
    }
    if (!SECRET_MANAGER_NAME) {
        const keyToValue = {};
        // environments
        const environments = JSON.parse(stdout).containerDefinitions[0].environment;
        for (let i = 0; i < environments.length; i++) {

            keyToValue[environments[i].name] = environments[i].value;
        }
        console.log(keyToValue);
        const envContent = Object.entries(keyToValue).map(([key, value]) => `${key}=${value}`).join('\n');
        fs.writeFileSync('.env', envContent, 'utf8');
        console.log('.env file created successfully');
        return;

    }
    exec(commandSecret, (errorS, stdoutS, stderrS) => {
        if (errorS || stderrS) {
            console.log(errorS);
            console.log(stderrS);
            return;
        }
        const keyToValue = {};

        // environments
        const environments = JSON.parse(stdout).containerDefinitions[0].environment;
        for (let i = 0; i < environments.length; i++) {

            keyToValue[environments[i].name] = environments[i].value;
        }

        // secret Value
        secretValues = JSON.parse(stdoutS)

        // secret
        const secrets = JSON.parse(stdout).containerDefinitions[0].secrets;
        for (let i = 0; i < secrets.length; i++) {
            const regex = /:([^:]+)::$/;
            const match = secrets[i].valueFrom.match(regex);
            const secretKey = match[1];
            keyToValue[secrets[i].name] = secretValues[secretKey];
        }
        const envContent = Object.entries(keyToValue).map(([key, value]) => `${key}=${value}`).join('\n');
        fs.writeFileSync('.env', envContent, 'utf8');
        console.log('.env file created successfully');
        return;
    });
});

//  node createEnv.js AWS_PROFILE=<> SECRET_MANAGER_NAME=<> TASK_DEFINITION_NAME=<>