const { format } = require("date-fns");

function nos(s) {
  if (s == null) return 'null';
  return `'${s}'`;
}

function getLogDTStr(d) {
  return format(d, 'yyyy-MM-dd HH:mm:ss.SSS zzz');
}

function getLogDtNowStr() {
  return getLogDTStr(new Date());
}

module.exports = { nos, getLogDTStr, getLogDtNowStr }