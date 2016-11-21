import { createAction } from 'redux-actions';
import camelCase from 'lodash/camelCase';
import toUpper from 'lodash/toUpper';

function createRequestTypes(base) {
  const res = {};
  ['REQUEST', 'SUCCESS', 'FAILURE'].forEach(type => res[type] = `${base}_${type}`);
  return res;
}

// base is something like my_career;
// camelCase: myCareer
// capitalize: MY_CAREER
export function createFetchTypesAndFuncs(base) {
  const camelCaseBase = camelCase(base);
  const toUpperBase = toUpper(base);

  const TYPES = createRequestTypes(toUpperBase);
  return {
    [toUpperBase]: TYPES,
    [camelCaseBase]: {
      // request(data)
      request: createAction(TYPES.REQUEST),
      success: createAction(TYPES.SUCCESS),
      failure: createAction(TYPES.FAILURE)
    }
  };
}

export function action(type, payload = {}) {
  return { type, ...payload };
}
