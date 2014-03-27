# -*- coding: utf-8 	-*-

from SPARQLWrapper import SPARQLWrapper, JSON
from flask import Flask, render_template, url_for, request, jsonify, Response
import requests, json
import datetime as dt
from dateutil.relativedelta import relativedelta
import urllib
from unidecode import unidecode
import csv

app = Flask(__name__)

def days_before(d,number):
	day=int(d[-2:])
	month=int(d[-5:-3])
	year=int(d[:4])
	return str(dt.date(year,month,day) - relativedelta(days=+number))

def get_age(bdate,ddate):
	start=dt.date(int(bdate[:4]),int(bdate[-5:-3]),int(bdate[-2:]))
	end=dt.date(int(ddate[:4]),int(ddate[-5:-3]),int(ddate[-2:]))
	num_years = int((end - start).days / 365.25)
	return num_years

def get_century(bdate,ddate):
	age=get_age(bdate,ddate)
	start=dt.date(int(bdate[:4]),int(bdate[-5:-3]),int(bdate[-2:]))
	mid_year=(start+relativedelta(years=+age/2)).year
	return int(mid_year/100) + 1

def convert_date(d):
	stuff=d.split("/")
	return stuff[2] + "-" + stuff[0] + "-" + stuff[1]

@app.route('/reincarnation',methods=['GET'])
def reincarnation():
	app.logger.debug('You arrived at ' + url_for('reincarnation'))
#	app.logger.debug('I received the following arguments' + str(request.args) )
	sparql = SPARQLWrapper("http://dbpedia.org/sparql")
	sparql.setReturnFormat(JSON)
	x=1
	date=request.args.get('mydate', 'No date sent')
	if date is None:
		return {}
	print date
	date=convert_date(date)
	print date
	interval=2
	start_date=days_before(date,interval)

	csvfile=open('csvs/ages.csv', 'wb')
	writer = csv.writer(csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
	csv_centuries=open('csvs/centuries.csv','wb')
	w2 = csv.writer(csv_centuries, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)
	csv_agepercentury = open('csvs/agepercentury.csv','wb')
	w3=csv.writer(csv_agepercentury, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

	ages=[0]*12 # Initialize 12 elements, for each of the decades of age (0-9, 10-19, 20-29, ..., 100-109, 110-119). We assume 119 is the maximum possible age.
	cent=[0]*22 # One position for each of the 21 centuries of the new era
	agepercentury=[0]*22 # Array to count average age per century
	writer.writerow(["age","value"])
	w2.writerow(["century","value"])
	w3.writerow(["agepercentury","value"])
#	writer.writerow(["name","date","death date","birth place","age","century","gender"])
	pred=[]
	pred_json='{\'chain\':'
	while True:
		try:
			query1="""
			PREFIX ont: <http://dbpedia.org/ontology/> 
			PREFIX foaf: <http://xmlns.com/foaf/0.1/> 
			PREFIX xsd:    <http://www.w3.org/2001/XMLSchema#> 
			PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>
			SELECT * WHERE { 
			  ?person ont:deathDate ?date;
			    ont:birthDate ?newdate;
			    ont:birthPlace ?bp;
			    <http://dbpedia.org/property/shortDescription> ?desc; 
			    foaf:name ?name;
			    foaf:isPrimaryTopicOf ?wikiLink.
			    ?bp foaf:name ?placeName ;
			    geo:lat ?lat;
			    geo:long ?long.
			    FILTER( 
			    ( ( datatype(?date) = xsd:date ) || ( datatype(?date) = xsd:dateTime ) ) && 
			    ( ?date >= """
			query2="""^^xsd:dateTime ) && ( ?date <= """
			query3="""^^xsd:dateTime)	   
			&& ( regex(str(?date), "[0-9]{4}-[0-9]{2}-[0-9]{2}" ) ) ) 
			}
			LIMIT 1
			"""
			    
			#OPTIONAL { ?person <http://dbpedia.org/ontology/thumbnail> ?thumb } .

			q=query1 + '"' + start_date + '"' + query2 + '"' + date + '"' + query3
			sparql.setQuery(q)

			results = sparql.query().convert()

			x=len(results["results"]["bindings"])
			app.logger.debug(x)
			if x==0:
				break
			result=results["results"]["bindings"][0]
			ddate=result["date"]["value"]
			person=result["person"]["value"]
			date=result["newdate"]["value"]
			bplace=result["placeName"]["value"]
			desc=result["desc"]["value"]
			wiki=result["wikiLink"]["value"]
			glat=result["lat"]["value"]
			glong=result["long"]["value"]

			interval*=2
			start_date=days_before(date,interval)
			name=result["name"]["value"]
			print person, name, date, start_date, ddate,bplace,desc,wiki,glat,glong
			age=get_age(date,ddate)
			century=get_century(date,ddate)
			name=unidecode(name)
			bplace=unidecode(bplace)
			pred.append({"name":name,"date":str(date),"ddate":str(ddate),"bplace":str(bplace),"age":str(age),"century":str(century),"description":desc,"wiki":wiki,"lat":glat,"long":glong})
			decade=age/10
			ages[decade]+=1
			cent[century]+=1
			agepercentury[century]+=age
		except:
			import traceback
			traceback.print_exc()

			# Output ages to csv
			for x in range(0,12):
				start_age=x*10
				end_age=start_age+9
				writer.writerow([str(start_age) + "-" + str(end_age),ages[x]])
			# Output centuries to csv
			for y in range(10,22):
				w2.writerow([y,cent[y]])
				if cent[y]>0:
					agepercentury[y]/=cent[y]
				w3.writerow([y,agepercentury[y]])
			pred_json+=str(pred) + '}'
			print pred_json
			return json.dumps({"chain":pred})
			
	# Output ages to csv
	for x in range(0,12):
		start_age=x*10
		end_age=start_age+9
		writer.writerow([str(start_age) + "-" + str(end_age),ages[x]])
	# Output centuries to csv
	for y in range(10,22):
		w2.writerow([y,cent[y]])
		
		if cent[y]>0:
			agepercentury[y]/=cent[y]
		w3.writerow([y,agepercentury[y]])
	pred_json+=str(pred) + '}'
	print pred_json
	return json.dumps({"chain":pred})

if __name__ == '__main__':
    app.debug = True
    app.run()

