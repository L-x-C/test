export function getInitialData(type) {
  switch (type) {
  case 'educations':
    return {
      course: [],
      average_point: {
        value: '',
        max: ''
      }
    };
  case 'experiences':
    return {
      content: []
    };
  case 'honors':
    return {
      content: []
    };
  case 'works':
    return {
      content: []
    };
  case 'others':
    return {
      content: []
    };
  default:
    return {};
  }
}
