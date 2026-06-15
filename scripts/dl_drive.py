import os, sys, gdown

base = os.path.dirname(os.path.abspath(__file__))
listfile = os.path.join(base, "data", "drive-list.txt")
outroot = os.path.join(base, "data", "drive")
os.makedirs(outroot, exist_ok=True)

with open(listfile, encoding="utf-8") as f:
    rows = [ln.rstrip("\n").split("\t") for ln in f if ln.strip()]

for slug, url in rows:
    out = os.path.join(outroot, slug)
    os.makedirs(out, exist_ok=True)
    print(f"=== {slug} ===", flush=True)
    try:
        gdown.download_folder(url=url, output=out, quiet=True)
    except Exception as e:
        print("  FAIL:", str(e)[:140], flush=True)

print("=== counts ===", flush=True)
for slug, _ in rows:
    d = os.path.join(outroot, slug)
    n = len([x for x in os.listdir(d)]) if os.path.isdir(d) else 0
    print(f"{n}\t{slug}", flush=True)
