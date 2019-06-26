interface IConfig {
    name: string;
    port: number;
    slackwebhook: string;
}

// tslint:disable:no-invalid-template-strings
const config: IConfig = {
    name: 'scr-slack-bot',
    port: parseInt(process.env.PORT, 10) || 80,
    slackwebhook: process.env.SLACK_WEBHOOK || '',
};

export default config;
