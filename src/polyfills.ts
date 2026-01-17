/**
 * Global Polyfill for tslib helpers
 *
 * Forces tslib helpers into global scope to fix "__extends is undefined" error
 * with Sentry on Android builds.
 *
 * Root cause: Metro bundler + Hermes engine not properly resolving tslib imports
 * Solution: Manually inject all helpers before any other code runs
 */

import * as tslib from 'tslib';

if (typeof global !== 'undefined') {
  (global as any).__extends = tslib.__extends;
  (global as any).__assign = tslib.__assign;
  (global as any).__rest = tslib.__rest;
  (global as any).__decorate = tslib.__decorate;
  (global as any).__param = tslib.__param;
  (global as any).__metadata = tslib.__metadata;
  (global as any).__awaiter = tslib.__awaiter;
  (global as any).__generator = tslib.__generator;
  (global as any).__createBinding = tslib.__createBinding;
  (global as any).__exportStar = tslib.__exportStar;
  (global as any).__values = tslib.__values;
  (global as any).__read = tslib.__read;
  (global as any).__spread = tslib.__spread;
  (global as any).__spreadArrays = tslib.__spreadArrays;
  (global as any).__await = tslib.__await;
  (global as any).__asyncGenerator = tslib.__asyncGenerator;
  (global as any).__asyncDelegator = tslib.__asyncDelegator;
  (global as any).__asyncValues = tslib.__asyncValues;
  (global as any).__makeTemplateObject = tslib.__makeTemplateObject;
  (global as any).__importStar = tslib.__importStar;
  (global as any).__importDefault = tslib.__importDefault;
}

export {};
