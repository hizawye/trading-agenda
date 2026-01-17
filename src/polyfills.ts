// Global polyfill for tslib helpers
// This manually injects all tslib helpers into the global scope
// to resolve "__extends is undefined" and similar errors

import * as tslib from 'tslib';

// Force tslib helpers into global scope
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
  (global as any).__spreadArray = tslib.__spreadArray;
  (global as any).__await = tslib.__await;
  (global as any).__asyncGenerator = tslib.__asyncGenerator;
  (global as any).__asyncDelegator = tslib.__asyncDelegator;
  (global as any).__asyncValues = tslib.__asyncValues;
  (global as any).__makeTemplateObject = tslib.__makeTemplateObject;
  (global as any).__importStar = tslib.__importStar;
  (global as any).__importDefault = tslib.__importDefault;
  (global as any).__classPrivateFieldGet = tslib.__classPrivateFieldGet;
  (global as any).__classPrivateFieldSet = tslib.__classPrivateFieldSet;
  (global as any).__classPrivateFieldIn = tslib.__classPrivateFieldIn;
}
