import os
import re
import urllib.request

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")
OUT_DIR = "public/fonts"
CSS_OUT = "src/styles/cjk-font.css"

req = urllib.request.Request(
    "https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400..700&display=swap",
    headers={"User-Agent": UA},
)
css = urllib.request.urlopen(req, timeout=60).read().decode("utf-8")

faces = re.findall(r"@font-face \{(.*?)\}", css, re.S)
print("faces:", len(faces))

os.makedirs(OUT_DIR, exist_ok=True)
# 清掉上一次失败运行留下的文件
for name in os.listdir(OUT_DIR):
    if name.startswith("noto-sans-sc-"):
        os.remove(os.path.join(OUT_DIR, name))

out = [
    "/* 自动生成，勿手改：python scripts/fetch-cjk-font.py\n"
    "   Noto Sans SC 按 unicode-range 切成 100+ 片自托管。\n"
    "   浏览器只下载当前页面字符所命中的那几片，首屏不会被整包 CJK 字体拖住。 */\n"
]
total = 0
for idx, body in enumerate(faces):
    src = re.search(r"url\((https://[^)]+\.woff2)\)", body)
    rng = re.search(r"unicode-range: ([^;]+);", body)
    if not src or not rng:
        continue
    name = "noto-sans-sc-%03d.woff2" % idx
    path = os.path.join(OUT_DIR, name)
    data = urllib.request.urlopen(
        urllib.request.Request(src.group(1), headers={"User-Agent": UA}), timeout=60
    ).read()
    with open(path, "wb") as fh:
        fh.write(data)
    total += len(data)
    out.append(
        "@font-face {\n"
        "  font-family: 'Noto Sans SC';\n"
        "  font-style: normal;\n"
        "  font-weight: 400 700;\n"
        "  font-display: swap;\n"
        "  src: url('/fonts/%s') format('woff2');\n"
        "  unicode-range: %s;\n}"
        % (name, rng.group(1).strip())
    )

with open(CSS_OUT, "w", encoding="utf-8") as fh:
    fh.write("\n\n".join(out) + "\n")
print("written faces:", len(out) - 1)
print("total: %.2f MB" % (total / 1024 / 1024))
