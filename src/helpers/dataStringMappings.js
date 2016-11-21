export function getSeekJobStatusString(status) {
  switch (status) {
    case '0':
      return '找工作中';
    default:
      return '暂时没有';
  }
}
