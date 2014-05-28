/*
  Autor: Manuel Cerda
  Git:   espaciomore 
  
  1: IP address lookup
  Terminal program will be executed like this:
  > ./program [--database-sqlite3] --db name 10.1.2.3
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
#include <stdlib.h>
#include <sqlite3.h> 

void explode(char *c, char *str, char *strR[])
{
  char* tok;

  tok = strtok(str, c);
  while(tok != NULL){
    tok = strtok(NULL, c);
  }
}

static int callback(void *data, int argc, char **argv, char **azColName)
{
  int i;
  for(i=0; i<argc; i++){
    printf("%s = %s\n", azColName[i], argv[i] ? argv[i] : "NULL");
  }
  printf("\n");
  return 0;
}

void main(int argc, char* argv[])
{
  sqlite3 *db;
  int rc;
  char *sql;

  rc = sqlite3_open("temp.db", &db);

  if( rc != SQLITE_OK ){
    fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
    return 1;
  }

  /* Create SQL statement */
  sql = "SELECT * from iptable";

  /* Execute SQL statement */
  rc = sqlite3_exec(db, sql, callback, NULL, NULL);
  if( rc != SQLITE_OK ){
    fprintf(stderr, "SQL error: %s\n", sqlite3_errmsg(db));
    return 1;
  }

  sqlite3_close(db);
  return 0;
}