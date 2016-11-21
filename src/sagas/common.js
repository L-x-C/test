import { take, put, call, fork, select } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import * as actions from '../actions';
import * as api from '../helpers/api';
import { getUID, getSelector, getEditCache, getForm } from './selectors';
import forEach from 'lodash/forEach';
import range from 'lodash/range';
import assign from 'lodash/assign';
import isEmpty from 'lodash/isEmpty';
import { getCategory, getSubCategory } from '../constants/categoryGetter';
import initialState from '../reducers/initialState';

const stepsMapping = {
  1: ['intention'],
  2: ['birthday', 'address', 'city', 'start_date', 'end_date', 'skillCategory', 'issuesCategory'],
  3: ['university_domestic', 'university_foreign']
};

function getStepCount(name) {
  let rst;
  forEach(stepsMapping, (names, steps) => {
    if (names.includes(name)) {
      return rst = steps;
    }
  });
  return +rst;
}

function* getDataByNameAndStep(name, step, options) {
  if (['birthday', 'start_date'].includes(name)) {
    if (step === 1) {
      return range(new Date().getFullYear(), 1959, -1);
    } else if (step === 2) {
      const now = new Date();
      const maxMonth = (now.getFullYear() === options[0]) ? (now.getMonth() + 1) : 12;
      return range(1, maxMonth + 1);
    }
  }
  if (['end_date'].includes(name)) {
    if (step === 1) {
      return range(new Date().getFullYear() + 5, 1959, -1);
    } else if (step === 2) {
      return range(1, 13);
    }
  }
  if (['address', 'city'].includes(name)) {
    if (step === 1) {
      const { response } = yield call(api.fetchProvinces);
      return response;
    } else if (step === 2) {
      const value = options[0] && options[0].value;
      const { response } = yield call(api.fetchCities, value);
      return response;
    }
  }
  if (name === 'university_domestic') {
    if (step === 1) {
      const { response } = yield call(api.fetchProvinces);
      return response;
    } else if (step === 2) {
      const value = options[0] && options[0].value;
      const { response } = yield call(api.fetchUniversities, value);
      return response;
    } else if (step === 3) {
      const value = options[1] && options[1].value;
      const { response } = yield call(api.fetchColleges, value);
      return response;
    }
  }
  if (name === 'university_foreign') {
    if (step === 1) {
      const { response } = yield call(api.fetchCountries);
      return response.info;
    } else if (step === 2) {
      const countryId = options[0] && options[0].countryId;
      const { response } = yield call(api.fetchForeignUniversities, countryId);
      return response.info;
    }
    else if (step === 3) {
      const universityId = options[1] && options[1].universityId;
      const { response } = yield call(api.fetchColleges, universityId);
      return response;
    }
  }
  if (name === 'skillCategory') {
    if (step === 1) {
      return getCategory('skills');
    } else if (step === 2) {
      const value = options[0] && options[0].value;
      return getSubCategory('skills', value);
    }
  }
  if (name === 'issuesCategory') {
    if (step === 1) {
      return getCategory('issues');
    } else if (step === 2) {
      const value = options[0] && options[0].value;
      return getSubCategory('issues', value);
    }
  }
  if (name === 'intention') {
    if (step === 1) {
      return getCategory('intention');
    }
  }
}

const TitleMapping = {
  birthday: {
    1: '请选择年份',
    2: '请选择月份'
  },
  start_date: {
    1: '请选择年份',
    2: '请选择月份'
  },
  end_date: {
    1: '请选择年份',
    2: '请选择月份'
  },
  address: {
    1: '请选择省市',
    2: '请选择地区'
  },
  city: {
    1: '请选择省市',
    2: '请选择地区'
  },
  university_domestic: {
    1: '请选择学校所在省市',
    2: '请选择学校',
    3: '请选择学院'
  },
  university_foreign: {
    1: '请选择学校所在国家',
    2: '请选择学校'
  },
  skillCategory: {
    1: '请选择技能类型',
    2: '请选择技能项'
  },
  issuesCategory: {
    1: '请选择专利论文类型',
    2: '请选择项'
  },
  intention: {
    1: '请选择职位类型'
  }
};

function getCloseInfo(data) {
  if (
    (data.section_name === 'experiences') &&
    (data.name === 'end_date') &&
    (data.step === 1)
  ) {
    return {
      text: '至今',
      value: ''
    };
  }
  return initialState.selector.close;
}

function* prepareSelectorData(payload) {
    const selectorData = yield select(getSelector);
    const data = {
      ...payload
    };
    data.step = data.step || 1;

    if (data.step === 1) {
      data.options = [];
    }
    data.stepCount = getStepCount(data.name);
    data.title = TitleMapping[data.name][data.step];
    data.close = getCloseInfo(data);
    data.options = data.step === 1 ? [] : selectorData.options;
    data.data = yield call(getDataByNameAndStep, data.name, data.step, data.options);
    if (isEmpty(data.data)) {
      yield closeSelector(data);
    }
    else {
      yield put(actions.loadSelectorData(data));
    }
}

export function* watchPrepareSelectorData() {
  while (true) {
    const { payload } = yield take(actions.PREPARE_SELECTOR_DATA);
    yield prepareSelectorData(payload);
  }
}

function options2field(name, options) {
  const timestamp = () => {
    const [year, month] = options;
    return +new Date(year, month - 1, 1, 0, 0, 0, 0);
  };
  switch (name) {
  case 'birthday':
    return timestamp();
  case 'start_date':
    return timestamp();
  case 'end_date':
    return (options[0] === '') ? '' : timestamp();
  case 'university_domestic':
    return [{name: options[1].name, value: options[1].value, province: {
      name: options[0].name,
      value: options[0].value
    }}, options[2] || {}];
  case 'university_foreign':
    return [
      {
        name: options[1].name,
        value: options[1].universityId,
        province: {
          name: options[0].name,
          value: options[0].countryId
        }
      },
      options[2] || {}
    ];
  case 'skillCategory':
    return {
      text: options[0].text,
      value: options[0].value,
      sub_category: {
        text: options[1].text,
        value: options[1].value,
        tips: options[1].tips
      }
    };
  case 'issuesCategory':
    return [{
      text: options[0].text,
      value: options[0].value,
      sub_category: {
        text: options[1].text,
        value: options[1].value
      }
    }, options[1].fields];
  case 'address':
    return {name: `${options[0].name}-${options[1].name}`, value: options[1].value};
  case 'city':
    return {name: `${options[0].name}-${options[1].name}`, value: options[1].value};
  case 'intention':
    return options[0];
  default:
     '';
  }
}

// form is destroyOnUnmount:false
function* updateForm(selectorData) {
  let obj = {};
  let editCache = yield select(getEditCache);
  const {name, options, section_name} = selectorData;
  const data = options2field(name,options);
  if (['university_domestic', 'university_foreign'].includes(name)) {
    obj['university'] = data[0];
    obj['college'] = data[1];
  } else if (name === 'skillCategory') {
    obj['category'] = data;
  } else if (name === 'issuesCategory') {
    obj['category'] = data[0];
    obj['fields'] = data[1];
  } else if (name === 'intention') {
    obj['intention_id'] = data.id;
    obj['intention_name'] = data.id ? data.name : '';
  } else {
    obj[name] = data;
  }
  const form = yield select(getForm);
  form[section_name].values = assign({}, form[section_name].values, obj);
  form[section_name].initialValues = form[section_name].values;
  editCache.data = form[section_name].values;
}

function* closeSelector(selectorData) {
  yield call(updateForm, selectorData);
  yield put(actions.loadSelectorData(initialState.selector));
}

export function* watchHandleSelectorClick() {
  while (true) {
    const { payload } = yield take(actions.HANDLE_SELECTOR_CLICK);
    const selectorData = yield select(getSelector);
    selectorData.options[selectorData.step - 1] = payload.value;
    const { step, stepCount, name, section_name } = selectorData;
    if (payload.end || (step === stepCount)) {
      yield closeSelector(selectorData);
    } else {
      yield prepareSelectorData(
        {
          step: step+1,
          name,
          section_name
        }
      );
    }
  }
}
