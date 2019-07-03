'use strict';

import Repo from './repo/repo';
import server from './server';

async function start() {
    'use strict';
    try {
        await Repo.database().connect();
        await server.start();
    } catch (error) {
        process.exit(1);
    }
}

if (require.main === module) {
    start();
}
