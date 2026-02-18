"""Generate og-image.png (1200x630) for social sharing cards."""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
OUT = os.path.join(os.path.dirname(__file__), "og-image.png")

img = Image.new("RGB", (W, H), "#1a1008")
draw = ImageDraw.Draw(img)

# Background gradient feel — dark bands
for y in range(H):
    r = int(26 + (y / H) * 18)
    g = int(16 + (y / H) * 10)
    b = int(8 + (y / H) * 6)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

# Accent bar at top
draw.rectangle([0, 0, W, 6], fill="#c9a44a")

# Try to use a nice font, fall back to default
try:
    font_title = ImageFont.truetype("arialbd.ttf", 62)
    font_sub = ImageFont.truetype("arialbd.ttf", 28)
    font_stats = ImageFont.truetype("arial.ttf", 22)
    font_tag = ImageFont.truetype("ariali.ttf", 18)
except:
    try:
        font_title = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 62)
        font_sub = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 28)
        font_stats = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 22)
        font_tag = ImageFont.truetype("C:/Windows/Fonts/ariali.ttf", 18)
    except:
        font_title = ImageFont.load_default()
        font_sub = font_title
        font_stats = font_title
        font_tag = font_title

# Title
draw.text((60, 50), "THE PDF FILES", fill="#c9a44a", font=font_title)

# Subtitle
draw.text((60, 130), "The Epstein Files. All of Them. Exposed.", fill="#e8d5b0", font=font_sub)

# Divider line
draw.line([(60, 180), (W - 60, 180)], fill="#5a4a2a", width=2)

# Description
desc = "900,000+ pages of official DOJ Epstein case files —\nsearchable, cross-referenced, and fully indexed."
draw.text((60, 200), desc, fill="#d4c4a0", font=font_stats)

# Stats grid
stats = [
    ("900,000+", "Pages"),
    ("343M", "Words"),
    ("99", "Key Figures"),
    ("58,999", "Artifacts"),
    ("12", "DOJ Datasets"),
    ("682", "Gallery Images"),
]

y_start = 290
x_start = 60
col_w = 180

for i, (num, label) in enumerate(stats):
    col = i % 6
    x = x_start + col * col_w
    y = y_start

    # Stat box
    draw.rounded_rectangle(
        [x, y, x + 160, y + 80],
        radius=8,
        fill="#2a1d10",
        outline="#5a4a2a",
        width=1,
    )
    # Number
    draw.text((x + 12, y + 10), num, fill="#b5280f", font=font_sub)
    # Label
    draw.text((x + 12, y + 48), label, fill="#8a7f74", font=font_tag)

# Divider
draw.line([(60, 400), (W - 60, 400)], fill="#5a4a2a", width=1)

# Key findings teasers
findings = [
    "✈️  Flight log connections mapped across all 12 datasets",
    "💰  Financial transactions traced — shell companies & wire transfers",
    "📑  400,000+ previously unsearchable pages surfaced by deep sweep",
    "🕸️  Inner circle network — 99 key figures mapped by connection strength",
]
for i, line in enumerate(findings):
    draw.text((60, 420 + i * 30), line, fill="#c4b490", font=font_stats)

# Bottom bar
draw.rectangle([0, H - 40, W, H], fill="#0f0a04")
draw.text((60, H - 32), "eyeswidewoke.github.io/PDF-FIles", fill="#8a7f74", font=font_tag)
draw.text((W - 300, H - 32), "Nothing altered. Nothing hidden.", fill="#5a4a2a", font=font_tag)

img.save(OUT, "PNG", optimize=True)
print(f"✅ Saved og-image.png ({W}x{H}) → {OUT}")
