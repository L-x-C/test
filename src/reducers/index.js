import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import undoable from 'redux-undo';

import jobReducers from './jobReducers';
import cookieReducers from './cookie';
import { career, uid, comments, editType, editCache } from './career';
import { toolBar } from './toolBarReducers';
import { selector } from './selector';

const rootReducer = combineReducers({
  uid,
  career,
  comments,
  editType,
  editCache,
  selector,
  jobReducers: undoable(jobReducers),
  toolBar,
  routing,
  form: formReducer,
  cookie: cookieReducers
});

export default rootReducer;
