import axios from 'axios';
import config from '../config';

export default class PraiseController {
    public escapeRE: RegExp = /<(@[^>]*)> /g;

    constructor() {
        // Connect to Redis
    }

    public parsePraise(body: any) {
        let praisee = this.escapeRE.exec(body.text);
        let praiseesStr = '';

        while (praisee != null) {
            praiseesStr += `<${praisee[1]}> `;
            praisee = this.escapeRE.exec(body.text);
        }

        const message = body.text.replace(this.escapeRE, '');

        const data = {
            text: `<@${body.user_id}> has praised ${praiseesStr} for \`${message}\`!`,
        };

        const cfg = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        axios.post(config.slackwebhook, data, cfg);
    }
}
