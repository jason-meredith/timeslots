# Timeslots

Ever try coordinating regularly scheduled events with a large group of people? Now it's easier
than ever.

Timeslots is a Rails-based web application for aggregating online calendars, finding times when
every one is available, and scheduling regularly occurring events to generate an online calendar
that can be shared and viewed by everyone involved in their native calendar app.


* **Create an account** It's simple and only requires an email address and a password
* **Start a group** Invite group members to your group so they can add their calendar
* **Add Calendars** Using ics links shareable by every major online calendar service to add user
availability time slots
* **Add Tasks** Add your events that need to be scheduled
* **Schedule Tasks** Tasks are events that need to be scheduled on a regularly basis. Every Task
has a minimum number of times it must be scheduled in a given time period (*3* times every 
*14* days)
* **Export your scheduled tasks** Once your Tasks are scheduled, every one in the group can use
a link to add the scheduled tasks to their own personal calendar

## Deployment

Setup and run like any other Rails app


```
$ git clone https://github.com/jason-meredith/timeslots.git
$ cd timeslots
$ bundle install
```

Edit `config/database.yml` to fit your database setup and setup schema

```
$ rake db:setup
```

Run the Rails server
```
$ rails server
```
Point your browser towards [localhost:3000](http://localhost:3000).

## Contributing

Feel free to make pull requests. I'd love all the help I can get.

## License

This project is licensed under the GNU General Public License - see the [LICENSE.md](LICENSE.md) file for details