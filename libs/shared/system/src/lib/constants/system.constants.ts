import { MILLISECONDS_UNTIL_SYSTEM_TIMEOUT } from '@card-games-api/environment';

export const ATTEMPT_GRACEFUL_SHUTDOWN_MESSAGE =
    'Attempting graceful shutdown...';
export const CONNECT_CLOSED_MESSAGE =
    'Card Games API API & Database Connection Closed.';
export const DATABASE_ATTEMPTING_SHUTDOWN_MESSAGE =
    "Attempting to shutdown Card Games API's Database connection...";
export const DATABASE_ESTABLISHED_MESSAGE = 'Database Connection Established!';
export const DATABASE_SHUTDOWN_ERROR_MESSAGE =
    "An error occurred while attempting to shutdown the Card Games API's War Database.";
export const FAILED_TO_START_ERROR_MESSAGE = 'Failed to start server.';
export const GRACEFUL_SHUTDOWN_MESSAGE = 'Server has shutdown gracefully.';
export const INITIATE_API_MESSAGE =
    'Initializing Card Games API War Games API...';
export const INITIATE_DATABASE_MESSAGE =
    'Initializing Card Games API War Games Database...';
export const MASTER_CLUSTER_STATUS_MESSAGE = `Master Cluster ${process.pid} is running.`;
export const SERVER_CLOSE_ATTEMPT = 'Attempting to close the server...';
export const TIMEOUT_WARNING_MESSAGE = `The http server still has not closed after ${MILLISECONDS_UNTIL_SYSTEM_TIMEOUT} milliseconds. This is likely because of sockets still being open. Proceeding with a forced shutdown.`;
