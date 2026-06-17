import os, time, gdown

base = os.path.dirname(os.path.abspath(__file__))
listfile = os.path.join(base, "data", "drive-list.txt")
outroot = os.path.join(base, "data", "drive")

with open(listfile, encoding="utf-8") as f:
    rows = [ln.rstrip("\n").split("\t") for ln in f if ln.strip()]

IMG = (".jpg", ".jpeg", ".png", ".webp", ".heic", ".avif")
def count(slug):
    d = os.path.join(outroot, slug)
    if not os.path.isdir(d):
        return 0
    return len([x for x in os.listdir(d) if x.lower().endswith(IMG)])

for attempt in range(4):
    todo = [(s, u) for s, u in rows if count(s) < 3]
    if not todo:
        break
    print(f"--- pass {attempt+1}: {len(todo)} folders remaining ---", flush=True)
    for slug, url in todo:
        out = os.path.join(outroot, slug)
        os.makedirs(out, exist_ok=True)
        try:
            gdown.download_folder(url=url, output=out, quiet=True)
            print(f"  ok {slug}: {count(slug)} files", flush=True)
        except Exception as e:
            print(f"  retry-later {slug}: {str(e)[:80]}", flush=True)
        time.sleep(45)
    time.sleep(60)

print("=== final counts ===", flush=True)
for slug, _ in rows:
    print(f"{count(slug)}\t{slug}", flush=True)
