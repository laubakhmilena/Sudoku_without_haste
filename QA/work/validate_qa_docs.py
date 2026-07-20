from pathlib import Path
import csv, re, hashlib, json
qa=Path('/mnt/data/QA')
root=Path('/mnt/data')
lines=[]
def check(name, ok, detail=''):
    lines.append(f"{'PASS' if ok else 'FAIL'} | {name} | {detail}")
    return ok
required=[f'{i:02d}_' for i in range(0,25)]
files=[p.name for p in qa.glob('*.md')]
for prefix in required:
    check(f'required document prefix {prefix}', any(x.startswith(prefix) for x in files))
expected_chk=[f'CHK-{i:02d}_' for i in range(1,21)]
chkfiles=[p.name for p in (qa/'checklists').glob('*.md')]
for prefix in expected_chk:
    check(f'checklist {prefix}', any(x.startswith(prefix) for x in chkfiles))
# CSV and IDs
with (qa/'10_TEST_CASES.csv').open(encoding='utf-8-sig') as f: tcs=list(csv.DictReader(f))
with (qa/'14_BUG_REPORTS.csv').open(encoding='utf-8-sig') as f: bugs=list(csv.DictReader(f))
with (qa/'18_TRACEABILITY_MATRIX.csv').open(encoding='utf-8-sig') as f: trace=list(csv.DictReader(f))
check('test case IDs unique', len({r['Test Case ID'] for r in tcs})==len(tcs), str(len(tcs)))
check('bug IDs unique', len({r['Bug ID'] for r in bugs})==len(bugs), str(len(bugs)))
allowed={'PASS','FAIL','BLOCKED','NOT_RUN','NOT_APPLICABLE'}
check('test statuses allowed', all(r['Status'] in allowed for r in tcs), str(sorted({r['Status'] for r in tcs})))
# checklist statuses
bad=[]
for p in (qa/'checklists').glob('*.md'):
    for line in p.read_text().splitlines():
        if line.startswith('| CHK-'):
            cols=[x.strip() for x in line.strip('|').split('|')]
            if len(cols)>=7 and cols[6] not in allowed: bad.append((p.name,cols[0],cols[6]))
check('checklist statuses allowed', not bad, repr(bad))
# Count consistency
counts={s:sum(1 for r in tcs if r['Status']==s) for s in allowed}
report=(qa/'19_TEST_EXECUTION_REPORT.md').read_text()
check('execution total consistent', f'| Total test cases | {len(tcs)} |' in report, str(len(tcs)))
for label,status in [('Passed','PASS'),('Failed','FAIL'),('Blocked','BLOCKED'),('Not Run','NOT_RUN'),('Not Applicable','NOT_APPLICABLE')]:
    check(f'execution {label} consistent', f'| {label} | {counts[status]} |' in report, str(counts[status]))
check('bug count consistent', '- Confirmed: 2.' in report and len(bugs)==2)
# Referenced QA paths
missing=[]
for r in tcs:
    for field in ['Evidence']:
        val=r.get(field,'').strip()
        if val and not (qa/val).exists(): missing.append((r['Test Case ID'],val))
for r in bugs:
    for field in ['Evidence','Logs']:
        val=r.get(field,'').strip()
        if val and not (qa/val).exists(): missing.append((r['Bug ID'],val))
check('evidence/log references exist', not missing, repr(missing))
# Trace feature coverage
check('trace rows cover feature matrix', len(trace)>=18, str(len(trace)))
# Original source hashes unchanged
expected={
'index(2).html':'c27ab7f00b8cbeefff00c9d50f465056d9fe1ac428bbe603a82b13cc3301eed1',
'game(1).js':'e347f3f65ac2f9f761507998e1b5227448b234d93bc413f54870d8db0e6879f1',
'style(2).css':'1a4a72aa5e5c369e19b23edf9ff18d23b8f37acc9b5c9db70608db5f1ae734e8'}
for fn,h in expected.items():
    actual=hashlib.sha256((root/fn).read_bytes()).hexdigest()
    check(f'source unchanged {fn}',actual==h,actual)
# Empty docs and obvious secrets
empty=[str(p.relative_to(qa)) for p in qa.rglob('*') if p.is_file() and p.suffix in {'.md','.csv'} and p.stat().st_size==0]
check('no empty markdown/csv',not empty,repr(empty))
secret_hits=[]
pat=re.compile(r'(?i)(api[_-]?key|secret|token|password)\s*[:=]\s*[A-Za-z0-9_\-]{16,}')
for p in qa.rglob('*'):
    if p.is_file() and p.suffix in {'.md','.csv','.log','.py'}:
        try:t=p.read_text(errors='ignore')
        except:continue
        if pat.search(t):secret_hits.append(str(p.relative_to(qa)))
check('no obvious embedded secrets',not secret_hits,repr(secret_hits))
summary={'pass':sum(x.startswith('PASS') for x in lines),'fail':sum(x.startswith('FAIL') for x in lines)}
lines.append('SUMMARY '+json.dumps(summary,ensure_ascii=False))
(qa/'logs/documentation_validation.log').write_text('\n'.join(lines)+'\n',encoding='utf-8')
print('\n'.join(lines))
raise SystemExit(1 if summary['fail'] else 0)
