import axios from 'axios';
import config from '../config';

export default class PraiseController {
    public escapeRE: RegExp = /<(?<id>.*)\|(?<name>.*)>/g;

    constructor() {
        // Connect to Redis
    }

    public parsePraise(body: any) {
        const groups = body.text.match(this.escapeRE).groups;

        const data = {
            text: body.user_name + ' has praised ' + groups.name + ' w/ id ' + groups.id,
        };

        const cfg = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        axios.post(config.slackwebhook, data, cfg);
    }
}
