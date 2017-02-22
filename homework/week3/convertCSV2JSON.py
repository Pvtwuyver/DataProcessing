#############################################
# Converts CSV file into JSON format
# Opdracht week 3 Dataprocessing
# Peter van Twuyver
# 10872809
############################################

import csv
import json
   
f = open( 'reactietijden.csv', 'rU' )  
# create appropriate field names.
reader = csv.DictReader( f, fieldnames = ( "Regio","periode","starttijd","alarmeringstijd","uitruktijd","rijtijd","responsetijd" ))  
# Parse the CSV into JSON format
out = json.dumps( [ row for row in reader ] )  
print "file succesfully parsed"  
# Save the JSONfile  
f = open( 'reactietijden.json', 'w')  
f.write(out)  
print "JSONfile succesfully saved"
