import type { Primitive } from '@card-games-api/utils';

export const confirmationMessage = (address: string, port: Primitive): string =>
    `Card Games API War API server is now live and listening on http://${address}:${port}.`;
