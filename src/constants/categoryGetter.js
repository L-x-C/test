import map from 'lodash/map';
import omit from 'lodash/omit';
import find from 'lodash/find';
import issuesCategory from './issuesCategory.json';
import skillCategory from './skillCategory.json';
import intentionCategory from './intentionCategory.json';

function getDataByType(type) {
  switch (type) {
  case 'issues':
    return issuesCategory;
  case 'skills':
    return skillCategory;
  case 'intention':
    return intentionCategory;
  }
}

function getSubCategoryNameByType(type) {
  switch (type) {
  case 'issues':
    return 'sub_categories';
  case 'skills':
    return 'certificates';
  }
}

export function getCategory(type) {
  return map(getDataByType(type), (item) => {
    return omit(item, getSubCategoryNameByType(type));
  });
}

export function getSubCategory(type, categoryValue) {
  return find(getDataByType(type), (value, key) => {
    return value.value === categoryValue;
  })[getSubCategoryNameByType(type)];
}
