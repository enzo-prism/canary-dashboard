#!/usr/bin/env python3
"""Verify the delivered snapshot against preserved Google source responses."""
import datetime as dt,json,pathlib
root=pathlib.Path(__file__).resolve().parents[1]
data=json.loads((root/'src/data/reviewed-google-snapshots.json').read_text())
receipt=json.loads((root/'work/source-20261028/receipt.json').read_text())
start,end=receipt['period']; expected=[(dt.date.fromisoformat(start)+dt.timedelta(days=i)).isoformat() for i in range(28)]
for site,(prop,domain,host) in receipt['sources'].items():
 snap=data[site];assert snap['rangeStart']==start and snap['rangeEnd']==end
 assert [x['date'] for x in snap['analytics']['trafficTrend']]==expected
 searchstart,searchend=receipt['searchPeriod']
 assert [x['date'] for x in snap['search']['trend']]==[(dt.date.fromisoformat(searchstart)+dt.timedelta(days=i)).isoformat() for i in range(28)]
 ga=json.loads((root/f'work/source-20261028/{site}-ga-hostName-current-production-union.json').read_text())
 assert ga['reviewedRequest']['dimensionFilter']['filter']=={'fieldName':'hostName','inListFilter':{'values':[domain,'www.'+domain],'caseSensitive':False}}
 row=ga['rows'];assert len(row)==1
 metric=dict(zip(ga['metrics'],[float(x['value']) for x in row[0]['metricValues']]))
 kpis={x['label']:x for x in snap['analytics']['kpis']}
 for label,key in [('Active users','activeUsers'),('Sessions','sessions'),('New users','newUsers'),('Page views','screenPageViews')]:assert int(kpis[label]['value'].replace(',',''))==metric[key]
 assert sum(x['sessions'] for x in snap['analytics']['trafficTrend'])==metric['sessions']
 gsc=json.loads((root/f'work/source-20261028/{site}-gsc-total-current-final.json').read_text())['rows'][0]
 sk={x['label']:x for x in snap['search']['kpis']}
 for label,key in [('Clicks','clicks'),('Impressions','impressions')]:
  assert int(sk[label]['value'].replace(',',''))==gsc.get(key,0)
  assert sum(x[key] for x in snap['search']['trend'])==gsc.get(key,0)
 assert not snap.get('leads')
 for group in ['channels','devices','topCountries']:
  assert all(0<=r['pct']<=100 for r in snap['analytics'][group])
 assert all('@' not in json.dumps(snap[key]) for key in ['analytics','search'])
 print(site, 'source totals, dates, trends and privacy checked')
main=data['main-house'];assert main['review']=='partial' and not main['analytics']['kpis']
source=json.loads((root/'work/source-20261028/main-house-gsc-total-current-final.json').read_text())
assert source['reviewedFilter']=='page:includingRegex:^https://mainhouse[.]canarycove[.]com/'
mainkpi={x['label']:x for x in main['search']['kpis']}
for label,key in [('Clicks','clicks'),('Impressions','impressions')]:
 assert int(mainkpi[label]['value'])==source['rows'][0].get(key,0)
 assert sum(x[key] for x in main['search']['trend'])==source['rows'][0].get(key,0)
leads=json.loads((root/'src/data/reviewed-leads-summary.json').read_text())
assert leads['totalInquiries']==leads['formspreeVisibleRows']+leads['heldRows']==leads['visibleRows']
assert leads['rawRows']==leads['formspreeVisibleRows']+leads['filteredRows']
assert leads['contactRows']+leads['bookingRows']==leads['rawRows']
assert leads['bookingRequests']+leads['contactRequests']==leads['totalInquiries']
assert sum(x['inquiries'] for x in leads['dailyTrend'])==leads['periodInquiries']
assert [x['date'] for x in leads['dailyTrend']]==expected
assert leads['reviewRows']==0
assert leads['reportingTimeZone']=='America/Los_Angeles'
assert '@' not in json.dumps(leads)
print('Reviewed lead summary reconciles source types, totals, dates and daily trend without PII.')
print('All reviewed snapshots match source evidence; Main House search is independently scoped; GA4 remains unavailable.')
