import { browserModules } from '../webpack.config';

// Source tests use the same replacements as the browser bundle.
jest.doMock('detect-node', browserModules['detect-node']);
jest.doMock('uglify-js', browserModules['uglify-js']);
