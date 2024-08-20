const logSheetInputs = require("./utils/logSheetInputs.json");
const Fuse = require("fuse.js");

function reformatComment(inputString) {
  const replaceUnderscoreWithHyphen = inputString.replace(/_/g, " - ");

  return replaceUnderscoreWithHyphen;
}

function getLogSheetInput(inputLog) {
  const taskList = logSheetInputs.filter(
    (item) => item.task_list === inputLog.task_list.name
  );
  const task = taskList.filter((item) => item.task_name === inputLog.task.name);

  if (task[0] !== undefined) {
    return task[0];
  } else {
    const options = {
      keys: ["comment"],
    };
    const fuse = new Fuse(taskList, options);
    const comment = reformatComment(inputLog.notes);
    const data = fuse.search(comment);
    return data[0] !== undefined ? data[0].item : data[0];
  }
}

function logSheetInputMapper(data, log) {
  var today = new Date(data.date);
  var month = today.toLocaleString("default", { month: "long" });
  const res = getLogSheetInput(log);
  return {
    Date: data.date,
    Month: month,
    Region: res === undefined ? null : res.region,
    "GMO LEAD": res === undefined ? null : res.gmo_lead,
    Type: res === undefined ? null : res.type,
    Person: log.added_by.name,
    Hours: log.hours_display,
    "Hours (Fractional)": log.total_minutes / 60,
    "Task Title": log.task.name,
    Comment: log.notes.replace(/\n/g, ""),
    "Work Type": res === undefined ? null : res.work_type,
    BU: res === undefined ? null : res.bu,
  };
}

function processLogData(data) {
  return data.tasklogs.map((log) => logSheetInputMapper(data, log));
}

function processTimeLogs(dataInput) {
  if (dataInput !== null || dataInput !== undefined) {
    const result = dataInput.map((data) => processLogData(data));
    return result.flat(1);
  }
  return "Data Not Processed";
}

module.exports = {
  processTimeLogs,
};
