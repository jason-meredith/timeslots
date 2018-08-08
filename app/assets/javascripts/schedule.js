var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ScheduleBuilder = (function () {
    function ScheduleBuilder() {
        this.components = [];
        this.addIndex = 0;
    }
    ScheduleBuilder.prototype.addComponent = function (container, source, process) {
        this.components.push(new ScheduleComponent(container, source, process, this));
    };
    ScheduleBuilder.prototype.addBlocks = function () {
        this.components[this.addIndex].addBlocks();
        this.addIndex++;
    };
    ScheduleBuilder.prototype.addNextComponent = function () {
        if (this.addIndex < this.components.length) {
            this.addBlocks();
        }
        else {
            this.onReady();
        }
    };
    ScheduleBuilder.prototype.resetComponents = function () {
        this.components = [];
    };
    ScheduleBuilder.prototype.setOnReady = function (onReady) {
        this.onReady = onReady;
    };
    return ScheduleBuilder;
}());
var ScheduleComponent = (function () {
    function ScheduleComponent(container, source, process, builder) {
        this.container = container;
        this.source = source;
        this.process = process;
        this.builder = builder;
    }
    ScheduleComponent.prototype.addBlocks = function () {
        new DataLoader(this.source, this.process, this.container, this.builder);
    };
    return ScheduleComponent;
}());
var DataLoader = (function () {
    function DataLoader(source, onFinish, outputContainer, builder) {
        this.source = source;
        this.ajax = new XMLHttpRequest();
        this.ajax.open("GET", this.source, true);
        this.ajax.onreadystatechange = function () {
            var loader = this;
            if (this.readyState == 4) {
                loader.responseCode = this.status;
                if (this.status == 200) {
                    loader.data = this.responseText;
                    onFinish(loader.data, outputContainer);
                    builder.addNextComponent();
                }
            }
        };
        this.ajax.send();
    }
    DataLoader.prototype.load = function () {
        this.ajax.send();
        return this.responseCode;
    };
    return DataLoader;
}());
var Timeslot = (function () {
    function Timeslot() {
    }
    return Timeslot;
}());
var Day = (function () {
    function Day(num) {
        this.hiddenDate = false;
        this.dayNum = num;
        this.blockedOut = false;
        this.timeslots = [];
    }
    Day.prototype.blockOut = function () {
        this.blockedOut = true;
    };
    Day.prototype.hideDate = function () {
        this.hiddenDate = true;
    };
    Day.prototype.getHtml = function () {
        var output = '<div id="day' + this.dayNum + '" class="day';
        if (this.blockedOut)
            output += ' blocked" ';
        else
            output += '" ';
        output += 'style="left: ' + (11 * this.dayNum) + '%;"> ';
        if (!this.blockedOut && !this.hiddenDate) {
            output += '<div style="font-size: x-small; text-align:center;">' + this.date['weekDayStr'];
            output += '<br>' + this.date['monthStr'] + '</div>';
            output += '<div class="dateNum">' + this.date['dateNum'] + '</div>';
        }
        this.timeslots.forEach(function (event) {
            output += event.getHtml();
        });
        output += '</div>';
        return output;
    };
    return Day;
}());
var ExternalEvent = (function (_super) {
    __extends(ExternalEvent, _super);
    function ExternalEvent() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isScheduledTask = false;
        return _this;
    }
    ExternalEvent.prototype.scheduledTask = function () {
        this.isScheduledTask = true;
    };
    ExternalEvent.prototype.getHtml = function () {
        var output = '<div id="event' + this.eventid + '" class="event';
        if (this.isScheduledTask)
            output += ' scheduledTask';
        output += '" style="';
        output += 'top: ' + this.start_pos + '%; ';
        output += 'height: ' + this.duration_pos + '%; ';
        if (!this.isScheduledTask)
            output += 'background: ' + this.calcolor + ';" ';
        else
            output += '" ';
        output += 'data-toggle="tooltip" data-html="true"  title="'
            + '<b>' + this.name + '</b><br>' + this.start_time_str + '<br>-<br>' + this.end_time_str
            + '">';
        output += '<small>' + this.name + '</small><br>';
        output += '</div>';
        return output;
    };
    return ExternalEvent;
}(Timeslot));
var Freetime = (function (_super) {
    __extends(Freetime, _super);
    function Freetime() {
        var _this = _super.call(this) || this;
        _this.id = Freetime.currentId++;
        Freetime.allFreetimeSlots.push(_this);
        return _this;
    }
    Freetime.prototype.getHtml = function () {
        var output = '<div ';
        output += 'data-id=' + this.id + ' ';
        output += 'id="freetime' + this.id + '" class="event freetime" style="';
        output += 'color: black; ';
        output += 'top: ' + this.start_pos + '%; ';
        output += 'height: ' + this.duration_pos + '%;"> ';
        if (this.duration_minutes > 30)
            output += '<b>' + this.start_time_str + '</b><br>';
        if (this.duration_minutes > 120)
            output += '<small>' + this.duration_str + '</small><br>';
        if (this.duration_minutes > 60)
            output += '<span style="position: absolute; bottom: 0;"><b>' + this.end_time_str + '</b></span>';
        output += '</div>';
        return output;
    };
    Freetime.getFreetimeSlot = function (id) {
        for (var _i = 0, _a = Freetime.allFreetimeSlots; _i < _a.length; _i++) {
            var freetimeSlot = _a[_i];
            if (id === freetimeSlot.id) {
                return freetimeSlot;
            }
        }
        return null;
    };
    Freetime.currentId = 0;
    Freetime.allFreetimeSlots = [];
    return Freetime;
}(Timeslot));
function displayExternalEvents(data, outputContainer) {
    var jsondata = JSON.parse(data);
    var days = [];
    var dayNum = 0;
    for (var _i = 0, jsondata_1 = jsondata; _i < jsondata_1.length; _i++) {
        var day_data = jsondata_1[_i];
        var day = new Day(dayNum);
        dayNum++;
        day.date = {
            dateNum: day_data['date']['dateNum'],
            monthNum: day_data['date']['monthNum'],
            weekDayStr: day_data['date']['weekDayStr'],
            monthStr: day_data['date']['monthStr']
        };
        for (var _a = 0, _b = day_data['events']; _a < _b.length; _a++) {
            var event_data = _b[_a];
            var newEvent = new ExternalEvent();
            newEvent.eventid = event_data['id'];
            newEvent.name = event_data['name'];
            newEvent.start_datetime = event_data['start_datetime'];
            newEvent.start_time_str = event_data['start_time_str'];
            newEvent.start_pos = event_data['start_pos'];
            newEvent.end_datetime = event_data['end_datetime'];
            newEvent.end_time_str = event_data['end_time_str'];
            newEvent.end_pos = event_data['end_pos'];
            newEvent.duration_minutes = event_data['duration_minutes'];
            newEvent.duration_pos = event_data['duration_pos'];
            newEvent.calname = event_data['cal_name'];
            newEvent.calcolor = event_data['cal_color'];
            newEvent.day = day;
            day.timeslots.push(newEvent);
        }
        days.push(day);
    }
    var output = "";
    days.forEach(function (day) {
        output += day.getHtml();
    });
    outputContainer.innerHTML += output;
}
function displayScheduledTasks(data, outputContainer) {
    var jsondata = JSON.parse(data);
    var days = [];
    var dayNum = 0;
    for (var _i = 0, jsondata_2 = jsondata; _i < jsondata_2.length; _i++) {
        var day_data = jsondata_2[_i];
        var day = new Day(dayNum);
        dayNum++;
        day.date = {
            dateNum: day_data['date']['dateNum'],
            monthNum: day_data['date']['monthNum'],
            weekDayStr: day_data['date']['weekDayStr'],
            monthStr: day_data['date']['monthStr']
        };
        day.hideDate();
        for (var _a = 0, _b = day_data['events']; _a < _b.length; _a++) {
            var event_data = _b[_a];
            var newEvent = new ExternalEvent();
            newEvent.eventid = event_data['id'];
            newEvent.name = event_data['name'];
            newEvent.start_datetime = event_data['start_datetime'];
            newEvent.start_time_str = event_data['start_time_str'];
            newEvent.start_pos = event_data['start_pos'];
            newEvent.end_datetime = event_data['end_datetime'];
            newEvent.end_time_str = event_data['end_time_str'];
            newEvent.end_pos = event_data['end_pos'];
            newEvent.duration_minutes = event_data['duration_minutes'];
            newEvent.duration_pos = event_data['duration_pos'];
            newEvent.scheduledTask();
            newEvent.day = day;
            day.timeslots.push(newEvent);
        }
        days.push(day);
    }
    var output = "";
    days.forEach(function (day) {
        output += day.getHtml();
    });
    outputContainer.innerHTML += output;
}
function displayFreetimeSlots(data, outputContainer) {
    var jsondata = JSON.parse(data);
    var days = [];
    var dayNum = 0;
    for (var _i = 0, jsondata_3 = jsondata; _i < jsondata_3.length; _i++) {
        var day_data = jsondata_3[_i];
        var day = new Day(dayNum);
        dayNum++;
        day.blockOut();
        day.date = {
            dateNum: day_data['date']['dateNum'],
            monthNum: day_data['date']['monthNum'],
            weekDayStr: day_data['date']['weekDayStr'],
            monthStr: day_data['date']['monthStr']
        };
        for (var _a = 0, _b = day_data['freetime']; _a < _b.length; _a++) {
            var freetime_data = _b[_a];
            var freetimeSlot = new Freetime();
            freetimeSlot.start_datetime = freetime_data['start_datetime'];
            freetimeSlot.start_time_str = freetime_data['start_time_str'];
            freetimeSlot.start_pos = freetime_data['start_pos'];
            freetimeSlot.end_datetime = freetime_data['end_datetime'];
            freetimeSlot.end_time_str = freetime_data['end_time_str'];
            freetimeSlot.end_pos = freetime_data['end_pos'];
            freetimeSlot.duration_minutes = freetime_data['duration_minutes'];
            freetimeSlot.duration_pos = freetime_data['duration_pos'];
            freetimeSlot.duration_str = freetime_data['duration_str'];
            freetimeSlot.day = day;
            day.timeslots.push(freetimeSlot);
        }
        days.push(day);
    }
    var output = "";
    days.forEach(function (day) {
        output += day.getHtml();
    });
    outputContainer.innerHTML += output;
}
var Task = (function () {
    function Task() {
        Task.allTasks.push(this);
    }
    Task.prototype.getHtml = function () {
        var output = '<div id="task' + this.taskid + '" class="task"';
        output += 'data-name="' + this.name + '" ';
        output += 'data-taskId=' + this.taskid + ' ';
        output += 'style="';
        output += 'width: 96%; ';
        output += 'height: ' + this.duration + '%; "> ';
        output += '<b>' + this.name + '</b><br>';
        output += '<p>' + this.duration_text + '</p>';
        output += '<p><em>To be scheduled <b>' + this.occurrence_num + '</b>' + ' ';
        output += ' times every <b>' + this.occurrence_term + '</b> days</p>';
        output += '[ <b>' + this.unscheduled_num + '</b> more times ]</em>';
        output += '</div>';
        return output;
    };
    Task.prototype.getDiv = function () {
        return document.getElementById('task' + this.taskid);
    };
    Task.getTask = function (id) {
        for (var _i = 0, _a = Task.allTasks; _i < _a.length; _i++) {
            var task = _a[_i];
            if (id === "task" + task.taskid) {
                return task;
            }
        }
    };
    Task.prototype.select = function () {
        for (var _i = 0, _a = Task.allTasks; _i < _a.length; _i++) {
            var task = _a[_i];
            task.unselect();
        }
        this.getDiv().classList.add('selected');
        Task.selectedId = this.taskid;
    };
    Task.prototype.unselect = function () {
        this.getDiv().classList.remove('selected');
    };
    Task.prototype.click = function () {
        if (Task.selectedId === this.taskid) {
            this.unselect();
        }
        else {
            this.select();
        }
    };
    Task.allTasks = [];
    return Task;
}());
var TaskQueue = (function () {
    function TaskQueue() {
        this.tasks = [];
    }
    TaskQueue.prototype.getHtml = function () {
        var output = '<div id="taskContainer" style="float: right; width: 23%; ">';
        this.tasks.forEach(function (task) {
            output += task.getHtml();
        });
        output += "</div>";
        return output;
    };
    TaskQueue.prototype.getDiv = function () {
        return document.getElementById("taskQueue");
    };
    return TaskQueue;
}());
function displayTaskQueue(data, outputContainer) {
    var jsondata = JSON.parse(data);
    var queue = new TaskQueue();
    for (var _i = 0, jsondata_4 = jsondata; _i < jsondata_4.length; _i++) {
        var task_data = jsondata_4[_i];
        var task = new Task();
        task.taskid = task_data['id'];
        task.name = task_data['name'];
        task.description = task_data['description'];
        task.category = task_data['category'];
        task.duration = task_data['duration'];
        task.duration_text = task_data['duration_text'];
        task.occurrence_term = task_data['occurrence_term'];
        task.occurrence_num = task_data['occurrence_num'];
        task.unscheduled_num = task_data['unscheduled_num'];
        queue.tasks.push(task);
    }
    outputContainer.innerHTML += queue.getHtml();
}
