/*
  Autor: Manuel Cerda
  Git:   espaciomore 
  
  1: IP address lookup
  Terminal program will be executed like this:
  > ./program --database-sqlite3 --db name 10.1.2.3
  Program description
  database.db will be a sqlite3 database that contains IP address ranges in form of:
  > sqlite3 database.db "SELECT * FROM iptable;"
  1 | 10.1.0.0/16
  2 | 127.0.0.0/8
  3 | 192.168.8.0/24
  ...
  The task of the program is to find and print out all ranges for the IP address supplied as an
  argument.
  Expected output for the above may be:
  10.1.0.0/16
*/
#include <stdio.h>
#include <sqlite3.h> 

void main(int argc, char* argv[])
{
  sqlite3 *db;
  char *zErrMsg = 0;
  int rc;

  rc = sqlite3_open("database.db", &db);

  if( rc ){
    fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
  }else{
    fprintf(stderr, "Opened database successfully\n");
  }
  sqlite3_close(db);
}