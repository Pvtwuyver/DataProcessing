
#############################################
# Converts CSV file into JSON format
# Opdracht week 6 Dataprocessing
# Peter van Twuyver
# 10872809
############################################

import csv
import json
   
f = open( 'populationgrowth.csv', 'rU' )  
# create appropriate field names.
# reader = csv.DictReader( f, fieldnames = ( "CountryName","CountryCode","IndicatorName","IndicatorCode",
# 	"sixty","sixtyOne","sixtyTwo","sixtyThree","sixtyFour","sixtyFive","sixtySix","sixtySeven","sixtyEight","sixtyNine",
# 	"seventy","seventyOne","seventyTwo","seventyThree","seventyFour","seventyFive","seventySix","seventySeven","seventyEight","seventyNine",
# 	"eighty","eightyOne","eightyTwo","eightyThree","eightyFour","eightyFive","eightySix","eightySeven","eightyEight","eightyNine",
# 	"ninety","ninetyOne","ninetyTwo","ninetyThree","ninetyFour","ninetyFive","ninetySix","ninetySeven","ninetyEight","ninetyNine",
# 	"twentyZero","twentyOne","twentyTwo","twentyThree","twentyFour","twentyFive","twentySix","twentySeven","twentyEight","twentyNine",
# 	"twentyTen","twentyEleven","twentyTwelve","twentyThirteen","twentyFourteen","twentyFifteen","twentySixteen"))  
reader = csv.DictReader( f, fieldnames = ("Country Name","Country Code","Indicator Name","Indicator Code",
	"1960","1961","1962","1963","1964","1965","1966","1967","1968","1969",
	"1970","1971","1972","1973","1974","1975","1976","1977","1978","1979",
	"1980","1981","1982","1983","1984","1985","1986","1987","1988","1989",
	"1990","1991","1992","1993","1994","1995","1996","1997","1998","1999",
	"2000","2001","2002","2003","2004","2005","2006","2007","2008","2009",
	"2010","2011","2012","2013","2014","2015","2016"))  
# Parse the CSV into JSON format
out = json.dumps( [ row for row in reader ] )  
print "file succesfully parsed"  
# Save the JSONfile  
f = open( 'populationgrowth.json', 'w')  
f.write(out)  
print "JSONfile succesfully saved"

# f = open( 'populationgrowth_Aruba.csv', 'rU' )  
# # create appropriate field names.
# reader = csv.DictReader( f, fieldnames = ("Country Name","Country Code","Indicator Name","Indicator Code",
# 	"1960","1961","1962","1963","1964","1965","1966","1967","1968","1969",
# 	"1970","1971","1972","1973","1974","1975","1976","1977","1978","1979",
# 	"1980","1981","1982","1983","1984","1985","1986","1987","1988","1989",
# 	"1990","1991","1992","1993","1994","1995","1996","1997","1998","1999",
# 	"2000","2001","2002","2003","2004","2005","2006","2007","2008","2009",
# 	"2010","2011","2012","2013","2014","2015","2016"))  
# # Parse the CSV into JSON format
# out = json.dumps( [ row for row in reader ] )  
# print "file succesfully parsed"  
# # Save the JSONfile  
# f = open( 'populationgrowth_aruba.json', 'w')  
# f.write(out)  
# print "JSONfile succesfully saved"