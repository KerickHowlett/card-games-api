/* eslint-disable @typescript-eslint/no-explicit-any */
import { AddressInfo } from 'net';

import type { Primitive } from '../../lib/types';
import type { JestSpy, MockCallback } from '../types';

export const mockAddress = 'http://mock-address.com';
export const mockPort: Primitive = 5000;
export const mockHttpAddress = (): AddressInfo =>
    ({ address: mockAddress, port: mockPort } as AddressInfo);
export const spyHttpAddress: MockCallback = jest
    .fn()
    .mockImplementation(mockHttpAddress);

export const mockMiddleware = (
    _: Primitive,
    __: Primitive,
    callback: () => any
): void => callback();

export const mockClose: MockCallback = jest
    .fn()
    .mockImplementation(mockMiddleware);
export const mockListen: MockCallback = jest
    .fn()
    .mockImplementation(mockMiddleware);
export const mockOn: MockCallback = jest
    .fn()
    .mockImplementation(mockMiddleware);
export const mockUse: MockCallback = jest
    .fn()
    .mockImplementation(mockMiddleware);

export const setupStubbedHttpServer = (
    addressSpy: JestSpy = spyHttpAddress,
    closeSpy: JestSpy = mockClose,
    listenSpy: JestSpy = mockListen,
    onSpy: JestSpy = mockOn
): any =>
    jest.mock('http', () => ({
        ...jest.requireActual('http'),
        createServer: jest.fn(() => ({
            address: addressSpy,
            close: closeSpy,
            listen: listenSpy,
            on: onSpy
        }))
    }));
