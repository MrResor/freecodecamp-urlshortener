#!/bin/bash

psql -U postgres -c "CREATE USER $PGUSER WITH PASSWORD '$PGPASSWORD'" -c "CREATE DATABASE url_shortener WITH OWNER = $PGUSER"
psql -U postgres -d url_shortener -c "CREATE TABLE urls (ID SERIAL PRIMARY KEY, URL TEXT NOT NULL)" -c "GRANT SELECT, INSERT, UPDATE, DELETE ON urls TO $PGUSER"
psql -U postgres -d url_shortener -c "GRANT USAGE, SELECT ON SEQUENCE urls_id_seq TO $PGUSER"