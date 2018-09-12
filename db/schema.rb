# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180820022237) do

  create_table "external_calendars", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.string "url"
    t.string "color"
    t.string "diffhash"
    t.text "raw_ics_data", limit: 16777215
    t.boolean "valid_ics"
  end

  create_table "external_events", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.datetime "start"
    t.datetime "end"
    t.bigint "external_calendar_id"
    t.index ["external_calendar_id"], name: "index_external_events_on_external_calendar_id"
  end

  create_table "scheduled_tasks", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "start"
    t.bigint "task_id"
    t.datetime "end"
    t.index ["task_id"], name: "index_scheduled_tasks_on_task_id"
  end

  create_table "tasks", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.text "description"
    t.text "category"
    t.text "tags"
    t.integer "priority"
    t.integer "duration"
    t.integer "occurrence_term"
    t.integer "occurrence_num"
  end

  add_foreign_key "external_events", "external_calendars"
  add_foreign_key "scheduled_tasks", "tasks"
end
