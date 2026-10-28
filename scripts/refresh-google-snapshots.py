#!/usr/bin/env python3
"""Read Google reports with gog; build reviewed snapshots without credentials in output."""
import argparse, concurrent.futures, datetime as dt, json, pathlib, subprocess, tempfile, os, urllib.request, urllib.error
ROOT=pathlib.Path(__file__).resolve().parents[1]
START='2026-09-30'; END='2026-10-27'; PREV_START='2026-09-02'; PREV_END='2026-09-29'
SEARCH_START='2026-09-29';SEARCH_END='2026-10-26';SEARCH_PREV_START='2026-09-01';SEARCH_PREV_END='2026-09-28'
OUT=ROOT/'work/source-20261028';OUT.mkdir(parents=True,exist_ok=True)
SITES={
 'canary-cove':('529589780','canarycove.com','www.canarycove.com'),
 'belize-kids':('489942783','belizekids.org','www.belizekids.org'),
 'listwin-ventures':('514358412','listwinventures.com','www.listwinventures.com'),
 'canary-foundation':('311697082','canaryfoundation.org','canaryfoundation.org'),
}
_ACCESS_TOKEN=None
REFRESH=False

def init_google_token():
 global _ACCESS_TOKEN
 # Let gog refresh its existing session with a supported read-only request first.
 refresh=subprocess.run(['gog','analytics','report','529589780','--from',END,'--to',END,'--dimensions','date','--metrics','sessions','--max','1','--account','enzo@design-prism.com','--readonly','--json','--no-input'],capture_output=True,text=True)
 if refresh.returncode:raise RuntimeError('Existing Google authentication could not be refreshed through gog')
 # Routine credential use: export through gog into an owner-only temporary file,
 # hold only the access token in memory, and remove the file before API reads.
 with tempfile.TemporaryDirectory(prefix='oauth-',dir=ROOT/'work') as private:
  os.chmod(private,0o700);tokenfile=pathlib.Path(private)/'token.json'
  result=subprocess.run(['gog','auth','tokens','export','enzo@design-prism.com','--out',str(tokenfile),'--no-input'],capture_output=True,text=True)
  if result.returncode:raise RuntimeError('gog token export failed; authenticate existing account with gog')
  os.chmod(tokenfile,0o600);auth=json.loads(tokenfile.read_text());_ACCESS_TOKEN=auth.get('access_token')
  if not _ACCESS_TOKEN:raise RuntimeError('No current access token available; run a read-only gog report to refresh it')

METRICS='activeUsers,sessions,newUsers,engagementRate,userEngagementDuration,screenPageViews'
def query(site,kind,dims,metrics='',previous=False):
 prop,domain,host=SITES.get(site,('','canarycove.com','mainhouse.canarycove.com'));start,end=(PREV_START,PREV_END) if previous else (START,END)
 if kind=='gsc':start,end=(SEARCH_PREV_START,SEARCH_PREV_END) if previous else (SEARCH_START,SEARCH_END)
 name=f'{site}-{kind}-{dims.replace(",","_") or "total"}-'+('previous' if previous else 'current')+('-final' if kind=='gsc' else '-production-union')+'.json'
 path=OUT/name
 if path.exists() and not REFRESH:return json.loads(path.read_text())
 if kind=='ga':
  api_dims=[d for d in dims.split(',') if d and d!='hostName']
  request={'dateRanges':[{'startDate':start,'endDate':end}],'dimensions':[{'name':d} for d in api_dims],'metrics':[{'name':m} for m in metrics.split(',')],'dimensionFilter':{'filter':{'fieldName':'hostName','inListFilter':{'values':[domain,'www.'+domain],'caseSensitive':False}}},'limit':'100000'}
  req=urllib.request.Request(f'https://analyticsdata.googleapis.com/v1beta/properties/{prop}:runReport',data=json.dumps(request).encode(),headers={'Authorization':'Bearer '+_ACCESS_TOKEN,'Content-Type':'application/json'})
  try:
   with urllib.request.urlopen(req,timeout=45) as response:data=json.load(response)
  except urllib.error.HTTPError as error:raise RuntimeError(f'Google Analytics read failed HTTP {error.code}; no credential values logged') from None
  if data.get('rowCount',0)>=100000:raise RuntimeError('Report requires pagination: '+name)
  data.update({'metrics':metrics.split(','),'dimensions':api_dims,'property':'properties/'+prop,'from':start,'to':end,'row_count':data.get('rowCount',0),'reviewedRequest':request})
  path.write_text(json.dumps(data,indent=2)+'\n');return data
 cmd=['gog']
 if kind=='gsc':cmd+=['searchconsole','query','sc-domain:'+domain,'--dimensions',dims,'--data-state','FINAL','--max','25000']
 if site=='main-house':cmd+=['--filter','page:includingRegex:^https://mainhouse[.]canarycove[.]com/']
 cmd+=['--from',start,'--to',end,'--account','enzo@design-prism.com','--readonly','--json','--no-input']
 p=subprocess.run(cmd,capture_output=True,text=True)
 if p.returncode:raise RuntimeError(f'{site} {kind} {dims}: {p.stderr}')
 data=json.loads(p.stdout)
 if site=='main-house':data['reviewedFilter']='page:includingRegex:^https://mainhouse[.]canarycove[.]com/'
 if data.get('row_count',len(data.get('rows') or []))>=(100000 if kind=='ga' else 25000):raise RuntimeError('Report requires pagination: '+name)
 path.write_text(json.dumps(data,indent=2)+'\n')
 return data
def fetch():
 tasks=[]
 for s in SITES:
  for prev in (False,True):tasks+=[(s,'ga','hostName',METRICS,prev),(s,'gsc','','',prev)]
  for dims,metrics in [('hostName,date','activeUsers,sessions'),('hostName,sessionDefaultChannelGroup','sessions'),('hostName,deviceCategory','sessions'),('hostName,country','activeUsers'),('hostName,pagePath,pageTitle','screenPageViews,userEngagementDuration,activeUsers')]:tasks.append((s,'ga',dims,metrics,False))
  for dims in ['DATE','QUERY','PAGE']:tasks.append((s,'gsc',dims,'',False))
 for prev in (False,True):tasks.append(('main-house','gsc','','',prev))
 for dims in ['DATE','QUERY','PAGE']:tasks.append(('main-house','gsc',dims,'',False))
 with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
  for task,result in zip(tasks,pool.map(lambda t:query(*t),tasks)):print(task[0],task[1],task[2] or 'total',len(result.get('rows') or []))
def ga(site,dims,metrics,prev=False):
 d=query(site,'ga',dims,metrics,prev);out=[]
 for r in d.get('rows') or []:
  vals=[v['value'] for v in r.get('dimensionValues',[])];ms=[float(v['value']) for v in r['metricValues']]
  out.append((vals,dict(zip(metrics.split(','),ms))))
 return out
def gsc(site,dims='',prev=False):return query(site,'gsc',dims,'',prev).get('rows') or []
def delta(v,p):return round((v-p)/p*100,1) if p else None
def kpi(label,v,p=None,formatted=None,**extra):
 o={'label':label,'value':formatted if formatted is not None else f'{v:,.0f}',**extra}
 if p is not None and delta(v,p) is not None:o['deltaPct']=delta(v,p)
 return o
def days(start=START):return [(dt.date.fromisoformat(start)+dt.timedelta(days=i)).isoformat() for i in range(28)]
def build():
 stamp=dt.datetime.now(dt.timezone.utc).isoformat(timespec='seconds').replace('+00:00','Z');snapshots={}
 for s,(prop,domain,host) in SITES.items():
  cur=ga(s,'hostName',METRICS);prev=ga(s,'hostName',METRICS,True)
  if len(cur)!=1:raise RuntimeError('Missing canonical host totals: '+s)
  c=cur[0][1];p=prev[0][1] if prev else dict.fromkeys(METRICS.split(','),0)
  avg=c['userEngagementDuration']/c['activeUsers'] if c['activeUsers'] else 0
  pa=p['userEngagementDuration']/p['activeUsers'] if p['activeUsers'] else 0
  ks=[kpi('Active users',c['activeUsers'],p['activeUsers']),kpi('Sessions',c['sessions'],p['sessions']),kpi('New users',c['newUsers'],p['newUsers']),kpi('Engagement rate',c['engagementRate'],p['engagementRate'],f'{c["engagementRate"]*100:.1f}%'),kpi('Avg. engagement',avg,pa,f'{avg:.0f}s',caption='Engagement time per active user'),kpi('Page views',c['screenPageViews'],p['screenPageViews'])]
  def bars(dim,metric,denom):
   rows=ga(s,'hostName,'+dim,metric)
   denom=sum(m[metric] for _,m in rows)
   return [{'label':d[0],'value':int(m[metric]),'pct':round(m[metric]/denom*100,1) if denom else 0} for d,m in sorted(rows,key=lambda r:r[1][metric],reverse=True)][:10]
  daily={d[0]:m for d,m in ga(s,'hostName,date','activeUsers,sessions')}
  traffic=[{'date':day,'users':int(daily.get(day.replace('-',''),{}).get('activeUsers',0)),'sessions':int(daily.get(day.replace('-',''),{}).get('sessions',0))} for day in days()]
  pages=ga(s,'hostName,pagePath,pageTitle','screenPageViews,userEngagementDuration,activeUsers')
  # Combine titles for a path; active-user engagement is not additive across titles,
  # so keep each source page/title row separate using the source's page identity.
  toppages=[{'path':d[0], 'title':d[1] or d[0], 'views':int(m['screenPageViews']),'avgEngagementSec':round(m['userEngagementDuration']/m['activeUsers'],2) if m['activeUsers'] else 0} for d,m in sorted(pages,key=lambda r:r[1]['screenPageViews'],reverse=True) if m['screenPageViews']>0][:10]
  gc=(gsc(s) or [{}])[0];gp=(gsc(s,prev=True) or [{}])[0]
  searchks=[kpi('Clicks',gc.get('clicks',0),gp.get('clicks',0)),kpi('Impressions',gc.get('impressions',0),gp.get('impressions',0)),kpi('CTR',gc.get('ctr',0),gp.get('ctr',0),f'{gc.get("ctr",0)*100:.1f}%'),kpi('Avg. position',gc.get('position',0),gp.get('position',0),f'{gc.get("position",0):.1f}',invertDelta=True)]
  searchdaily={r['keys'][0]:r for r in gsc(s,'DATE')}
  trend=[{'date':day,'clicks':searchdaily.get(day,{}).get('clicks',0),'impressions':searchdaily.get(day,{}).get('impressions',0)} for day in days(SEARCH_START)]
  def searchrows(dim,key):return [{key:r['keys'][0],'clicks':r.get('clicks',0),'impressions':r.get('impressions',0),'ctr':r.get('ctr',0)*100,'position':r.get('position',0)} for r in sorted(gsc(s,dim),key=lambda r:(r.get('clicks',0),r.get('impressions',0)),reverse=True)][:10]
  note=f'GA4 {prop}: {domain} + www.{domain}; localhost, previews and other hosts excluded. Search Console: sc-domain:{domain} (all domain hosts). GA4 newest days can revise. Search final data: Sep 29–Oct 26, compared with Sep 1–28. Comparisons use the same production-host filter.'
  snapshots[s]={'siteId':s,'review':'reviewed','note':note,'periodLabel':'Last 28 complete calendar days','comparisonLabel':'vs. Sep 2–29, 2026','rangeStart':START,'rangeEnd':END,'searchRangeStart':SEARCH_START,'searchRangeEnd':SEARCH_END,'updatedAt':stamp,'analytics':{'kpis':ks,'trafficTrend':traffic,'channels':bars('sessionDefaultChannelGroup','sessions',c['sessions']),'devices':bars('deviceCategory','sessions',c['sessions']),'topPages':toppages,'topCountries':bars('country','activeUsers',c['activeUsers'])},'search':{'kpis':searchks,'trend':trend,'topQueries':searchrows('QUERY','query'),'topPages':searchrows('PAGE','page')}}
  print(s,'users',int(c['activeUsers']),'sessions',int(c['sessions']),'clicks',gc.get('clicks',0),'impressions',gc.get('impressions',0))
 mg=(gsc('main-house') or [{}])[0];mp=(gsc('main-house',prev=True) or [{}])[0]
 md={r['keys'][0]:r for r in gsc('main-house','DATE')}
 def main_search_rows(dim,key):return [{key:r['keys'][0],'clicks':r.get('clicks',0),'impressions':r.get('impressions',0),'ctr':r.get('ctr',0)*100,'position':r.get('position',0)} for r in sorted(gsc('main-house',dim),key=lambda r:(r.get('clicks',0),r.get('impressions',0)),reverse=True)][:10]
 snapshots['main-house']={'siteId':'main-house','review':'partial','note':'Search Console is filtered to https://mainhouse.canarycove.com/ inside the Canary Cove domain property. Final search data: Sep 29–Oct 26, compared with Sep 1–28. No Main House hostname events were returned by the three accessible Cove GA4 properties for Sep 2–Oct 27; GA4 measurements remain unavailable.','periodLabel':'Search-only snapshot','comparisonLabel':'vs. Sep 1–28, 2026','rangeStart':START,'rangeEnd':END,'searchRangeStart':SEARCH_START,'searchRangeEnd':SEARCH_END,'updatedAt':stamp,'analytics':{'kpis':[],'trafficTrend':[],'channels':[],'devices':[],'topPages':[],'topCountries':[]},'search':{'kpis':[kpi('Clicks',mg.get('clicks',0),mp.get('clicks',0)),kpi('Impressions',mg.get('impressions',0),mp.get('impressions',0)),kpi('CTR',mg.get('ctr',0),mp.get('ctr',0),f'{mg.get("ctr",0)*100:.1f}%'),kpi('Avg. position',mg.get('position',0),mp.get('position',0),f'{mg.get("position",0):.1f}',invertDelta=True)],'trend':[{'date':day,'clicks':md.get(day,{}).get('clicks',0),'impressions':md.get(day,{}).get('impressions',0)} for day in days(SEARCH_START)],'topQueries':main_search_rows('QUERY','query'),'topPages':main_search_rows('PAGE','page')}}
 (ROOT/'src/data/reviewed-google-snapshots.json').write_text(json.dumps(snapshots,indent=2)+'\n')
 (OUT/'receipt.json').write_text(json.dumps({'exportedAt':stamp,'period':[START,END],'comparison':[PREV_START,PREV_END],'sources':SITES,'searchPeriod':[SEARCH_START,SEARCH_END],'searchComparison':[SEARCH_PREV_START,SEARCH_PREV_END],'gscDataState':'FINAL','gaScope':'Exact production apex+www hostname union filtered inside Analytics Data API; period distinct-user totals are API aggregates, never host sums.','limitations':['Latest GA4 days can revise.','GSC final data is one day behind the GA4 window; periods and comparisons are separately labeled.','Top query/page reports are API-limited and privacy-filtered; totals come from dimensionless reports.','GA4 daily distinct users are not summed into period active users.','GA4 calendar dates follow each property timezone; GSC dates follow Pacific time.','Search scope includes all hosts in each domain property.','Main House has exact-host-prefix search data only; GA4 unavailable.']},indent=2)+'\n')
if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--refresh',action='store_true',help='Read new source reports instead of cached exports');options=parser.parse_args()
 REFRESH=options.refresh
 # Initialize auth only when an API read is necessary; cached rebuilds are offline.
 ga_cache_count=len(list(OUT.glob('*-ga-*-production-union.json')))
 if REFRESH or ga_cache_count<28:init_google_token()
 fetch();build()
