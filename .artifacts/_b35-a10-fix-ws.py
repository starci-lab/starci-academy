from pathlib import Path

p = Path("src/components/pages/ProfileChallengesPage/ProfileChallenges/index.tsx")
text = p.read_text(encoding="utf-8")
lines = text.splitlines(keepends=True)
out = []
for line in lines:
    if "group-challenges-by-course" in line:
        out.append('} from "@/modules/utils/group-challenges-by-course"\n')
    else:
        out.append(line)
p.write_text("".join(out), encoding="utf-8", newline="\n")
print("rewrote")
