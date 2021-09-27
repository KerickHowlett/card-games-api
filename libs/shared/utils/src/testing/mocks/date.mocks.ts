import { chain } from 'lodash';

import { ONE_DAY, SEVEN_DAYS } from '../../lib/constants';

export const EACH_DAY_IN_A_WEEK: number[] = chain(SEVEN_DAYS)
    .add(ONE_DAY)
    .range()
    .value();

export const SECONDS_IN_A_DAY = 86400;
