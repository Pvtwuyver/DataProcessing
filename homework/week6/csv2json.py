import csv
import json
   
f = open( 'agegroups_small.csv', 'rU' )
# create appropriate field names.
reader = csv.DictReader( f, fieldnames = ( "CountryName","0 to 14","15 to 64", "65 and up"))  
# Parse the CSV into JSON format
out = json.dumps( [ row for row in reader ] )  
print "file 1 succesfully parsed"  
# Save the JSONfile  
f = open( 'agegroups_small.json', 'w')  
f.write(out)  
print "JSONfile 1 succesfully saved"
