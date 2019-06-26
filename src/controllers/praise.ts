import axios from 'axios';
import config from '../config';

export default class PraiseController {
    public escapeRE: RegExp = /<(.*)\|(.*)>/g;

    constructor() {
        // Connect to Redis
    }

    public parsePraise(body: any) {
        const data = {
            text: body.user_name + ' has praised ' + this.escapeRE.exec(body.text)[1],
        };

        const cfg = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        axios.post(config.slackwebhook, data, cfg);
    }
}
