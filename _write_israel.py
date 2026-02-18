import os

with open("israel.html", "w", encoding="utf-8") as f:
    f.write(open("russia.html","r",encoding="utf-8").read())

print(os.path.getsize("israel.html"))
