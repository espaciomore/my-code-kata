# Autor: Manuel Cerda
# Git:   espaciomore 

# Write a simple script that downloads the daily stock prices of Microsoft from Yahoo Finance. 
# Have the script calculate a 10-day moving average (MA) of the adjusted close price and 
# return the result in an array - the result should be an array with 91 elements since you can't do the MA on the first 9 prices.

# Bonus points if you can generate a graph the two series (the original adjusted close and the MA points - the MA will not have any data for the first 9 days).

# Key requirements:
# - user should not have to download the file, the script should do it
# - parameters should be easy to adjust: moving average window (here it is 10), company symbol (here it is MSFT), and lookback period (here it is the last 100 days)
# - keep the code for computing the average separate from any sort of output in case I want to use your code as part of a more complex calculation

# Data can be downloaded from here (there is a CSV link at the bottom that your script can use): http://finance.yahoo.com/q/hp?s=MSFT+Historical+Prices

# Details on moving averages: http://en.wikipedia.org/wiki/Moving_average
from urllib import urlretrieve
from csv import reader
from decimal import Decimal
import os

def download( src,dst='/tmp/data.csv' ):
  try:
    return urlretrieve( src,dst )
  except Exception as e:
    print e
  return None

def decodecsv( src,mode='rb' ):
  data = []
  with open( src,mode ) as csv_file:
    try:
      table = reader( csv_file )
      for row in table:
        data.append( row )
    except Exception as e:
      return None
    finally:
      csv_file.close()
  return data

def movingaverage( data,d=0,v=6,w=10,l=100 ):
  try:
    ma = []
    for i in range(0,l-w):
      s = 0.0
      for j in range(0,w):
        s += float(data[i+j][v])
      ma.append([ data[i][d], s/w ])
    return ma
  except Exception as e:
    print e
  return None

def format( data,d=0,v=6,w=10,l=100 ):
  try:
    tmp = []
    for row in data[ 0:l-w+1 ]:
      tmp.append([ row[d],float(row[v]) ])
    return tmp
  except Exception as e:
    print e
  return None 

def printgraph( data ):
  maxi = 0
  mini = 100
  for label,value in data:
    if value > maxi:
      maxi = value
    if value < mini:
      mini = value
  for label,value in data:
    ln = label + ' ' + str(Decimal(value).quantize(Decimal('.01')))
    for fv in range(int(mini),int(value),1): 
      ln += '|'
    for dv in range(0,int((value-int(value))*10),1):
      ln += '|'
    print ln

# uncomment the following code to execute functions

# url = 'http://ichart.finance.yahoo.com/table.csv?s=MSFT&d=2&e=26&f=2014&g=d&a=2&b=13&c=1986&ignore=.csv'
# res = download( url )
# sp = decodecsv( res[0] )
# ma = movingaverage( sp[1::] )

# print "ORIGINAL ADJUSTED CLOSE"
# ac = format( sp[1::] )
# printgraph( ac )

# print "MOVING AVERAGE POINTS"
# printgraph( ma )

