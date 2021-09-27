import { errorHandler } from '../../lib/helpers/error-handler';
import { setApiClusters } from '../../lib/helpers/startup/clusters';

export type MockedCluster = jest.MockedFunction<typeof setApiClusters>;
export type MockedErrorHandler = jest.MockedFunction<typeof errorHandler>;
