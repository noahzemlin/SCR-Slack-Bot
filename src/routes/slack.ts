'use strict';

import * as Router from 'koa-router';

import MasterController from '../controllers/master';
import BaseRoute from './base-route';

class SlackRoute extends BaseRoute {
    constructor() {
        super('/slack');
    }

    public mapRoutes(router: Router) {
        router.post('/action', async (ctx, next) => {
            console.log('Action!');
            console.log(ctx.request.body);
            ctx.status = 200;
            ctx.body = '';
            return;
        });
        router.post('/praise', async (ctx, next) => {
            MasterController.PraiseController.parsePraise(ctx.request.body);
            ctx.status = 200;
            ctx.body = '';
            return;
        });
    }
}

const exampleRoute = new SlackRoute();
export default exampleRoute;
