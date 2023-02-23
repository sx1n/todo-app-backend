#!/usr/bin/env bash

mongosh -u root -p password <<EOF
  use todo_app
  db.createUser({
    user: "todo_app_user",
    pwd: "todo_app_password",
    roles: ["readWrite"]
  })
EOF
