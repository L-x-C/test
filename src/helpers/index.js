import {isClient} from './location';

export function dot(target, ...keys) {
  let result = target;
  for (let i = 0; i < keys.length; i++) {
    if (result) {
      result = result[keys[i]];
    }
    // quit loop earlier
    else {
      return result;
    }
  }
  return result;
}

export function textLength(text) {
  return String(text).replace(/[^\x00-\xff]/g, 'hf').length;
}

//如果没在服务端渲染过,再发
export function SmartDisPatch(store, action) {
  !hasServerRendered() && store.dispatch(action);
}

//是否在服务端渲染过了
function hasServerRendered() {
  return isClient() && window.__INITIAL_STATE__;
}
