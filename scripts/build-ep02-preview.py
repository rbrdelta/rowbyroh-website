# Builds the private claude.ai preview of the EP02 draft: site CSS + ep02.js + data inlined,
# links pointed at rowbyroh.com, no tracker. Usage: python3 scripts/build-ep02-preview.py . <out.html>
import re,json,sys
root=sys.argv[1]; out=sys.argv[2]
h=open(root+'/blog/real-music.html').read()
css=''.join(open(root+'/assets/css/'+f).read()+'\n' for f in ['base.css','writing.css','listen.css','ep02.css'])
header=re.search(r'<div class="post-header">.*?</p>\s*</div>',h,re.S).group(0)
art=re.search(r'<article>.*?</article>',h,re.S).group(0)
body=(header+'\n\n    '+art).replace('href="/','href="https://rowbyroh.com/')
data=json.dumps(json.load(open(root+'/assets/data/ep02.json')))
js=open(root+'/assets/js/ep02.js').read()
js2=re.sub(r"fetch\('/assets/data/ep02\.json'\)\.then\(function \(r\) \{ return r\.json\(\); \}\)","Promise.resolve(window.EP02_DATA)",js)
assert js2!=js
page=f'''<title>EP02 Music or Emotion Draft</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@300;400;500;600;700&family=IBM+Plex+Sans:wght@400;600&display=swap" rel="stylesheet">
<style>
{css}
:root {{ color-scheme: light; }}
body {{ background: var(--bg); color: var(--text); padding-left: max(16px, env(safe-area-inset-left, 0px)); padding-right: max(16px, env(safe-area-inset-right, 0px)); }}
figure.chart.listen {{ overflow-x: auto; }}
</style>
<script>document.body.className = 'writing-page zone-research';</script>
<div class="preview-wrap">
<p class="draft-legend"><b>Preview for review on your phone, updated 2026-11-17 (v5).</b> Text copied from the Notion page as of 11-17, with the luck and angles figures. The Notion page stays the place to edit the text. Not public: private to your account.</p>
{body}
</div>
<script>window.EP02_DATA = {data};</script>
<script>
{js2}
</script>
'''
open(out,'w').write(page)
print(len(page))
