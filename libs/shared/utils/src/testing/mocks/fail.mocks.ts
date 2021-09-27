export interface FailMock {
    fail?: string;
    test?: string;
}

export const failMock: FailMock = {
    test: 'test'
};

export const failMockArray: FailMock[] = [failMock, failMock];

export const failObject: FailMock = {
    fail: 'fail'
};
