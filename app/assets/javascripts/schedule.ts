// JOURNAL [SHORT] Drawing a calendar using a sequential data pipeline framework
/*
 * ScheduleBuilder is the main class. It has Components which represent a portion of the calendar.
 * Each component is given a div, a URL source of JSON data, and a function that processes the data
 * downloaded from the URL into the passed div.
 *
 * After all components have been added, they are processes in the order they were added to the builder.
 * By processing one after another instead of concurrently one component can set up the container for the
 * next component.
 *
 * After the last component is processed, the onReady() callback is triggered, calling the function to be
 * run after the entire calendar is completely built.
 */


class ScheduleBuilder {

    public components: ScheduleComponent[];

    private addIndex: number;

    private onReady: Function;

    constructor() {

        this.components = [];
        this.addIndex = 0;

    }

    addComponent(container: HTMLElement, source: string, process: Function) {
        this.components.push( new ScheduleComponent(container, source, process, this) );
    }

    addBlocks() {
        this.components[this.addIndex].addBlocks();
        this.addIndex++;
    }

    addNextComponent() {
        if(this.addIndex < this.components.length) {
            this.addBlocks();
        } else {
            this.onReady();
        }
    }

    resetComponents() {
        this.components = [];
    }

    setOnReady(onReady: Function) {
        this.onReady = onReady;
    }


}

class ScheduleComponent {

    private container: HTMLElement;
    private source: string;
    private process: Function;
    private builder: ScheduleBuilder;

    constructor(container: HTMLElement, source: string, process: Function, builder: ScheduleBuilder) {
        this.container = container;
        this.source = source;
        this.process = process;
        this.builder = builder;
    }

    addBlocks() {
        new DataLoader(this.source, this.process, this.container, this.builder);
    }

}


// Object wrapper for XMLHttpRequest (AJAX) to load calendar JSON
class DataLoader {

    private ajax: any;
    public data: string;
    public responseCode: number;


    constructor(public source: string, onFinish: Function, outputContainer: HTMLElement, builder:ScheduleBuilder) {
        this.ajax = new XMLHttpRequest();
        this.ajax.open("GET", this.source, true);
        this.ajax.onreadystatechange = function() {
            let loader: DataLoader = this;
            // Response has been received
            if(this.readyState == 4) {
                loader.responseCode = this.status;
                // If status is 200 (success)
                if(this.status == 200) {
                    loader.data = this.responseText;
                    onFinish(loader.data, outputContainer);
                    builder.addNextComponent();
                }
            }
        };
        this.ajax.send();
    }

    public load() {
        this.ajax.send();
        return this.responseCode;
    }
}






/**

 External Event Calendar

 **/

abstract class Timeslot {

    day: Day;

    start_datetime: string;
    start_time_str: string;
    start_pos: number;

    end_datetime: string;
    end_time_str: string;
    end_pos: number;

    duration_minutes: number;
    duration_pos: number;

    abstract getHtml(): string;
}

interface DayDate {
    dateNum: number,
    monthNum: number,
    weekDayStr: string,
    monthStr: string
}


class Day {
    public timeslots:Timeslot[];

    public dayNum: number;
    public date: DayDate;

    private blockedOut: boolean;
    private hiddenDate: boolean = false;

    constructor(num: number) {
        this.dayNum = num;
        this.blockedOut = false;

        this.timeslots = [];
    }

    blockOut():void {
        this.blockedOut = true;
    }

    hideDate():void {
        this.hiddenDate = true;
    }

    getHtml():string {
        let output: string = '<div id="day' + this.dayNum + '" class="day';

        // If in time selection, block out this day
        if(this.blockedOut)
            output += ' blocked" ';
        else
            output += '" ';

        output += 'style="left: ' + (11 * this.dayNum) + '%;"> ';

        if(!this.blockedOut && !this.hiddenDate) {
            output += '<div style="font-size: x-small; text-align:center;">' + this.date['weekDayStr'];
            output += '<br>' + this.date['monthStr'] + '</div>';
            output += '<div class="dateNum">' + this.date['dateNum'] + '</div>';
        }

        this.timeslots.forEach( (event) => {
            output += event.getHtml();
        });

        output += '</div>';

        return output;
    }

}

class ExternalEvent extends Timeslot{
    eventid: number;
    name: string;

    calname: string;
    calcolor: string;

    isScheduledTask: boolean = false;


    scheduledTask():void {
        this.isScheduledTask = true;
    }


    getHtml():string {
        let output: string = '<div id="event' + this.eventid + '" class="event';

        if(this.isScheduledTask)
            output += ' scheduledTask';

        output += '" style="';
        output += 'top: ' + this.start_pos + '%; ';
        output += 'height: ' + this.duration_pos + '%; ';

        if(!this.isScheduledTask)
            output += 'background: ' + this.calcolor + ';" ';
        else
            output += '" ';


        output += 'data-toggle="tooltip" data-html="true"  title="'
            + '<b>' + this.name + '</b><br>' + this.start_time_str + '<br>-<br>' + this.end_time_str
            + '">';

        output += '<small>' + this.name + '</small><br>';

        output += '</div>';

        return output;
    }

}


class Freetime extends Timeslot{

    static currentId: number = 0;
    static allFreetimeSlots: Freetime[] = [];

    public id: number;
    public duration_str: number;

    constructor() {
        super();

        this.id = Freetime.currentId++;
        Freetime.allFreetimeSlots.push(this);
    }


    getHtml():string {

        let output: string = '<div ';
        output += 'data-id=' + this.id + ' ';
        output += 'id="freetime' + this.id + '" class="event freetime" style="';
        output += 'color: black; ';
        output += 'top: ' + this.start_pos + '%; ';
        output += 'height: ' + this.duration_pos + '%;"> ';
        //output += this.start + '<br>';
        if(this.duration_minutes > 30)
            output += '<b>' + this.start_time_str + '</b><br>';

        if(this.duration_minutes > 120)
            output += '<small>' + this.duration_str + '</small><br>';

        //output += '<em>' + this.calname + '</em><br>';
        //output += this.end;
        if(this.duration_minutes > 60)
            output += '<span style="position: absolute; bottom: 0;"><b>' + this.end_time_str + '</b></span>';
        output += '</div>';

        return output;
    }

    static getFreetimeSlot(id: number): Freetime {
        for (let freetimeSlot of Freetime.allFreetimeSlots) {
            if(id === freetimeSlot.id) {
                return freetimeSlot;
            }
        }

        return null;
    }


}


// Convert raw JSON string into an array of Day objects, each containing arrays of ExternalEvent objects
function displayExternalEvents(data: string, outputContainer: HTMLElement) {
    let jsondata = JSON.parse(data);

    let days:Day[] = [];
    let dayNum: number = 0;

    // For each day
    for (let day_data of jsondata) {
        // Create day object
        let day = new Day(dayNum);
        dayNum++;


        day.date = {
            dateNum: day_data['date']['dateNum'],
            monthNum: day_data['date']['monthNum'],
            weekDayStr: day_data['date']['weekDayStr'],
            monthStr: day_data['date']['monthStr']
        };


        // Iterate through timeslots
        for (let event_data of day_data['events']) {
            // Create ExternalEvent object for each event
            let newEvent = new ExternalEvent();
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
            // Add event to Day
            newEvent.day = day;
            day.timeslots.push(newEvent);
        }

        //Add Day to days array
        days.push(day);
    }

    let output: string = "";
    days.forEach( (day:Day) => {
        output += day.getHtml();
    });

    outputContainer.innerHTML += output;
}


// Convert raw JSON string into an array of Day objects, each containing arrays of ExternalEvent objects
function displayScheduledTasks(data: string, outputContainer: HTMLElement) {
    let jsondata = JSON.parse(data);

    let days:Day[] = [];
    let dayNum: number = 0;

    // For each day
    for (let day_data of jsondata) {
        // Create day object
        let day = new Day(dayNum);
        dayNum++;


        day.date = {
            dateNum: day_data['date']['dateNum'],
            monthNum: day_data['date']['monthNum'],
            weekDayStr: day_data['date']['weekDayStr'],
            monthStr: day_data['date']['monthStr']
        };

        day.hideDate();


        // Iterate through timeslots
        for (let event_data of day_data['events']) {
            // Create ExternalEvent object for each event
            let newEvent = new ExternalEvent();
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

            // Add event to Day
            newEvent.day = day;
            day.timeslots.push(newEvent);
        }

        //Add Day to days array
        days.push(day);
    }

    let output: string = "";
    days.forEach( (day:Day) => {
        output += day.getHtml();
    });

    outputContainer.innerHTML += output;
}


// Convert raw JSON string into an array of Day objects, each containing arrays of ExternalEvent objects
function displayFreetimeSlots(data: string, outputContainer: HTMLElement) {
    let jsondata = JSON.parse(data);

    let days:Day[] = [];
    let dayNum: number = 0;

    // For each day
    for (let day_data of jsondata) {
        // Create day object
        let day = new Day(dayNum);
        dayNum++;

        day.blockOut();


        day.date = {
            dateNum: day_data['date']['dateNum'],
            monthNum: day_data['date']['monthNum'],
            weekDayStr: day_data['date']['weekDayStr'],
            monthStr: day_data['date']['monthStr']
        };


        // Iterate through timeslots
        for (let freetime_data of day_data['freetime']) {
            // Create ExternalEvent object for each event
            let freetimeSlot = new Freetime();

            freetimeSlot.start_datetime = freetime_data['start_datetime'];
            freetimeSlot.start_time_str = freetime_data['start_time_str'];
            freetimeSlot.start_pos = freetime_data['start_pos'];

            freetimeSlot.end_datetime = freetime_data['end_datetime'];
            freetimeSlot.end_time_str = freetime_data['end_time_str'];
            freetimeSlot.end_pos = freetime_data['end_pos'];

            freetimeSlot.duration_minutes = freetime_data['duration_minutes'];
            freetimeSlot.duration_pos = freetime_data['duration_pos'];
            freetimeSlot.duration_str = freetime_data['duration_str'];
            // Add event to Day
            freetimeSlot.day = day;
            day.timeslots.push(freetimeSlot);
        }

        //Add Day to days array
        days.push(day);
    }

    let output: string = "";
    days.forEach( (day:Day) => {
        output += day.getHtml();
    });

    //output += '<div id="taskContainer" style="float: right;"></div>';

    outputContainer.innerHTML += output;
}


/**

 Task Queue

 **/



class Task {

    taskid: number;
    name: string;
    description: string;
    category: string;

    duration: number;
    duration_text: string;

    occurrence_term: number;
    occurrence_num: number;

    unscheduled_num: number;

    static allTasks: Task[] = [];
    static selectedId: number;

    constructor() {
        Task.allTasks.push(this);
    }

    getHtml():string {
        let output: string = '<div id="task' + this.taskid + '" class="task"';
        output += 'data-name="' + this.name + '" ';
        output += 'data-taskId=' + this.taskid + ' ';
        output += 'style="';
        output += 'width: 96%; ';
        output += 'height: ' + this.duration + '%; "> ';
        output += '<b>' + this.name + '</b><br>';
        output += '<p>' + this.duration_text + '</p>';
        output += '<p><em>To be scheduled <b>' + this.occurrence_num + '</b>' + ' ';

        output +=  ' times every <b>' + this.occurrence_term + '</b> days</p>';
        output += '[ <b>' + this.unscheduled_num + '</b> more times ]</em>';
        output += '</div>';
        return output;
    }

    getDiv():HTMLElement {
        return document.getElementById('task'+this.taskid);

    }

    static getTask(id: string) {
        for(let task of Task.allTasks) {
            if(id === "task" + task.taskid) {
                return task;
            }
        }
    }

    select() {

        // Unselect all others
        for (let task of Task.allTasks) {
            task.unselect();
        }

        // Select this one
        this.getDiv().classList.add('selected');
        Task.selectedId = this.taskid;

    }

    unselect() {
        this.getDiv().classList.remove('selected');
    }

    click(): void {

        if(Task.selectedId === this.taskid) {
            this.unselect();
        } else {
            this.select();
        }


    }

}

class TaskQueue {

    public tasks:Task[];

    constructor() {
        this.tasks = [];
    }

    getHtml():string {

        let output: string = '<div id="taskContainer" style="float: right; width: 23%; ">';

        this.tasks.forEach( (task) => {
            output += task.getHtml();
        });

        output += "</div>";

        return output;


    }

    getDiv(): HTMLElement {
        return document.getElementById("taskQueue");
    }

}

function displayTaskQueue(data: string, outputContainer: HTMLElement) {

    let jsondata = JSON.parse(data);

    let queue = new TaskQueue();

    for (let task_data of jsondata) {

        let task = new Task();

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