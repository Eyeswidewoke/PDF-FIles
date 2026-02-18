---
source_image: "legal-filing+deposition-transcript+book-page__EFTA02702508_20260210_p002_i001.png"
source_pdf: "EFTA02702508.pdf"
method: pdf_text
words: 863
confidence: 1.00
extracted: 2026-02-13T17:08:11.831369
---

chine can be constructed to play the imitation game 
satisfactorily, we need not be troubled by this objection. 
-Turing, Computing Machinery and Intelligence, 1950 
The Turing Test is at (or near) the heart of the research 
program called artificial intelligence. In my youth I described 
artificial intelligence research as an exercise in trying to write 
programs one doesn't know how to write—at least for engi-
neering-type Al research. Some of us generalized this to the 
idea of "exploratory programming: in which one had a gen-
eral sense of what the program should do, and only a partially 
formulated idea of how to achieve it. In recent years the idea 
of what programming is has drifted away from including this 
view toward specifiable. routine. infrastructurish programs 
and systems. i've heard this referred to as the static-verse. in a 
famous debate / discussion, Michael Polanyi and Alan Turing 
talked about whether the mind / the brain was unspecifiable 
or merely not-yet specified [3]. And what would an incorrect 
but Thring-Test-passing system be? 
In his discussion of how the imitation game might go in 
the computer version, Thring wrote this as the first example 
of a question in the game: 
Q: Please write inc a sonnet on the subject of the Forth 
Bridge. 
A: Count me out on this one. I never could write poetry. 
-Turing, Computing Machinery and Intelligence, 1950 
In the Summer of 20151 attended the Warren Wilson Alum-
ni Writing Conference, which is held annually for graduates 
of the Warren Wilson MFA program. i am such a graduate. 
in poetry. The conference was held at Lewis & Clark College 
in Portland, Oregon. The week was unusually hot and humid 
for Portland, and this physical difficulty was reflected in an 
edginess to the conference. My plan was threefold: read the 
eighteen haiku aloud on the first night of the conference to all 
attendees: participate a few days later in a writers' workshop 
as the writer of those eighteen haiku; and on the final day of 
the conference, give a lecture entitled "is My Program a Better 
Writer than You?" The abstract for that lecture was as follows: 
I've been working on a program that thinks like a 
poet and produces nice stuff. I'll show you how it works 
and why it's not like the kinds of progmms that do your 
banking or predict the weather. But everything I'll talk 
about is really about writing. 
i read on Sunday night. After the reading a few of the writers 
came up to me and commented on my reading. My reading 
was short because the poems were short—and the attendees 
knew i didn't normally write haiku. Their comments includ-
ed these: "terse condensations: "evocative: "took the top of 
my head or "funny and profound: "natural, personal, and 
2 
rhythmic: "compact fluid energy: 'wry and elliptical: and 
"whimsical elegance." 
I didn't consider this as evidence that InkWell passed the 
Turing Test. it was the first day of the conference and people 
were jet-lagged and not entirely prepared for the rigors of 
the conference; and my reading took about four minutes of 
an allocated ten. Most writers stretched their reading time at 
least a little, thus my short reading of short pieces stood out 
as energetic and sudden. I was still uncertain whether the 
hint was noticed—the hint contained in the title and abstract 
for my lecture. 
Here is what a haiku is: 
A haiku in English is a very short poem in the Eng-
lish language, following to a greater or lesser extent the 
form and style of the Japanese haiku. A typical haiku 
is a three-line, quirky observation about a fleeting mo-
ment involving nature. 
-Wikipedia 141 
For many, the quintessential haiku poet is Basho in the 17" 
century; an exemplar of his haiku is the following 151: 
On a withered branch 
A crow has alighted: 
Nightfall in autumn. 
The nature of haiku is complex and has changed over the 
centuries—time and place are still essential: counting on is 
not (some mistakenly conflate on and syllables). 
InkWell is a small program (about 45,000 lines of Common 
Lisp code), but it has a lot of data (about 15gb when all the 
dictionaries, databases, and tables are loaded). Turing wrote 
"I should be surprised if more than 10' [binary digits] was re-
quired for satisfactory playing of the imitation game." InkWell 
has more than 10". InkWell "knows" a lot about words, per-
sonality, sentiment, word noise, rhythm, connotations, and 
writing. Its vocabulary is probably more than five times larger 
than yours, gentle reader. The core engine works by taking a 
template in a domain-specific writing language along with a 
set of about fifty writing-related parameters and constraints, 
a description of a writer to imitate, and other hints, and com-
piles all that into an optimization problem which the writing 
engine works to find a good way to express what the template 
and constraints specify. Although some parts of InkWell were 
created through machine learning, the overall approach is 
optimization, not machine-learned transformations. 
The primary research question is to try to isolate and codify 
what separates information transfer from beautiful writing. 
Here is an example of information transfer: 
EFTA_R1_02074940 
EFTA02702509
