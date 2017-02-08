#!/usr/bin/env python
# Name: Peter van Twuyver
# Student number: 10872809
# 10 feb 2017
'''
This script scrapes IMDB and outputs a CSV file with highest rated tv series.
'''
import os, sys; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from pattern.web import URL, DOM, plaintext
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT

import csv

# from pattern.web import URL, DOM

TARGET_URL = "http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series"
BACKUP_HTML = 'tvseries.html'
OUTPUT_CSV = 'tvseries.csv'

# extra function to convert titles,genres and actornames to UTF-8
# based on code on https://docs.python.org/2/library/csv.html
def convert_unicode(unicode_txt):
    'Returns a UTF-8 encoded version of the Unicode input string'
    return unicode_txt.encode('utf-8')

def extract_tvseries(dom):
    '''
    Extract a list of highest rated TV series from DOM (of IMDB page).

    Each TV series entry should contain the following fields:
    - TV Title
    - Rating
    - Genres (comma separated if more than one)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    '''
    scraperesults = []

    url = URL("http://www.imdb.com/search/title?num_votes=5000,&sort=user_rating,desc&start=1&title_type=tv_series")
    dom = DOM(url.download(cached=True))
    
    # get all serie titles
    for e in dom.by_tag("div.pagecontent"): 
        # mainloop over all series
        for a in e.by_tag("div.lister-item mode-advanced"): 
            # create serie-dicionary with Key fieldnames
            serie = {}
            for d in a.by_tag("div.lister-item-content"): 
                for c in d.by_tag("h3.lister-item-header"):
                    for f in c.by_tag("a."):
                        title = plaintext(f.content)
                        serie["Title"]= convert_unicode(title)
                # get corresponding ratings
                for h in d.by_tag("div.ratings-bar"):
                    for i in h.by_tag("div.inline-block ratings-imdb-rating"):
                        rating = plaintext(i.content)
                        serie["Rating"]= rating
                # get genres and runtime
                for j in d.by_tag("p.text-muted"):
                    for k in j.by_tag("span.genre"):
                        genre = plaintext(k.content)
                        serie["Genre"]= convert_unicode(genre)
                    for m in j.by_tag("span.runtime"):
                        runtime = plaintext(m.content)
                        # remove last 4 characters (=minutes)
                        runtime = runtime[:-4]
                        serie["Runtime"]= runtime
                # get Actors
                actors = []
                for l in d.by_tag("p.")[2].by_tag("a"):
                        actor = plaintext(l.content)
                        actors.append(actor)
                # comma seperate actors in one field
                serie["Actors"]= convert_unicode(", ".join(actors))

            # create scraperesults dictionary
            scraperesults.append(serie)

    return scraperesults  


def save_csv(f, tvseries):
    '''
    Output a CSV file containing highest rated TV-series.
    '''
    # based on code on https://docs.python.org/2/library/csv.html
    fieldnames = ['Title', 'Rating', 'Genre', 'Actors', 'Runtime']
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    # loop through dictionary
    for row in tvseries:
        writer.writerow(row)

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    tvseries = extract_tvseries(dom)

    # Write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'wb') as output_file:
        save_csv(output_file, tvseries)