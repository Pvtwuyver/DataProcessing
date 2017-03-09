
#############################################
# Converts CSV file into JSON format
# Opdracht week 5 Dataprocessing
# Peter van Twuyver
# 10872809
############################################

import csv
import json
   
f = open( 'leeuwarden.csv', 'rU' )
# create appropriate field names.
reader = csv.DictReader( f, fieldnames = ( "date","midTemp","maxTemp", "minTemp"))  
# Parse the CSV into JSON format
out = json.dumps( [ row for row in reader ] )  
print "file 1 succesfully parsed"  
# Save the JSONfile  
f = open( 'leeuwarden.json', 'w')  
f.write(out)  
print "JSONfile 1 succesfully saved"

f = open( 'maastricht.csv', 'rU' )
# create appropriate field names.
reader = csv.DictReader( f, fieldnames = ( "date","midTemp","maxTemp", "minTemp"))  
# Parse the CSV into JSON format
out = json.dumps( [ row for row in reader ] )  
print "file 2 succesfully parsed"  
# Save the JSONfile  
f = open( 'maastricht.json', 'w')  
f.write(out)  

print "JSONfile 2 succesfully saved"





# Reads the file the same way that you did
csv_file = csv.DictReader(open('leeuwarden.csv', 'r'))

# Created a list and adds the rows to the list
json_list = []
for row in csv_file:
    json_list.append(row)

# Writes the json output to the file
file('leeuwarden2.json', 'w').write(json.dumps(json_list))