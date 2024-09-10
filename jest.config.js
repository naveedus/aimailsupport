/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest", {
      'ts-jest': {
          tsconfig: './tsconfig.json',
      }
    }]
  },
  testMatch: ['**/tests/**/*.test.ts', '**/?(*.)+(spec|test).ts']
};