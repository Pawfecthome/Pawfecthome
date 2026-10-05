from pathlib import Path
root=Path(__file__).resolve().parent
s=(root/'index.html').read_text()
s=s.replace('<link rel="stylesheet" href="theme.css">','<style>'+(root/'theme.css').read_text()+'</style>')
for name in ('catalogue.js','shop.js'):
 s=s.replace('<script src="'+name+'"></script>','<script>'+(root/name).read_text()+'</script>')
(root/'preview.html').write_text(s)
