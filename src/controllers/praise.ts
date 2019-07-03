import axios from 'axios';
import * as moment from 'moment';
import * as mongoose from 'mongoose';
import config from '../config';
import Repo from '../repo/repo';

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
        Repo.database()
            .mongo()
            .create({
                praiser: body.user_id,
                praisee: praiseesStr,
                reason: message,
                date: moment().toDate(),
            });
    }
}
