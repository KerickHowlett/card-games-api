import {
    CLUSTER_API as toClusterAPI,
    HOST,
    PORT
} from '@card-games-api/environment';
import logger from '@card-games-api/logger';
import cluster, { Worker } from 'cluster';
import { map } from 'lodash';
import os from 'os';

import { MASTER_CLUSTER_STATUS_MESSAGE } from '../../../constants';

import type { Server } from 'http';
export async function setApiClusters(server: Server): Promise<Server> {
    // ! Had to disable clusters because multiple instances cannot share the same
    // ! database source file via NeDB. Will need to find a solution to this later.
    if (!toClusterAPI || cluster.isWorker) return server.listen(PORT, HOST);

    // !Note: Replace isMaster with isPrimary if Node is ever upgraded to v16.0.0+.
    if (cluster.isMaster) {
        logger.info(MASTER_CLUSTER_STATUS_MESSAGE);

        const forkCluster = (): Worker => cluster.fork();
        await Promise.all(map(await os.cpus(), forkCluster));

        cluster.on('exit', (worker) => {
            logger.warn(`Worker ${worker.process.pid} just died.`);
            cluster.fork();
        });
    }

    return server;
}
