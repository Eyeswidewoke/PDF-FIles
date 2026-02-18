---
source_image: "typed-page+scanned-document__EFTA02674309_20260210_p001_i001.png"
source_pdf: "EFTA02674309.pdf"
method: pdf_text
words: 998
confidence: 1.00
extracted: 2026-02-13T17:17:57.460251
---

The computational complexity of ecological and 
evolutionary spatial dynamics 
Rasmus Ibsen-Jensen 
Krishnendu Chatterjee ' , and Martin A. Nowak'
'IST Austria. Klosteineuburg. A 3400. Austria. and 'Program for Evolutionary Dynamics. Department of Organismic and Evolutionary Biology. Department of Mathematics. 
Harvard University. Cambridge. MA 02138. USA 
Submitted to Proceedings of the National Academy of Sciences of the United States of America 
There are deep. yet largely unexplored connections between com-
puter science and biology. Both disciplines examine how information 
proliferates in time and space. Central results in computer science 
describe the complexity of algorithms that solve certain classes of 
problems. An algorithm is deemed efficient if it can solve a problem 
in polynomial time, which means the running time of the algorithm 
is a polynomial function of the length of the input. There are classes 
of harder problems for which the fastest possible algorithm requires 
exponential time. Another criterion is the space requirement of the 
algorithm. There is a crucial distinction between algorithms that can 
find a solution. verify a solution. or list several distinct solutions in 
given time and space. The complexity hierarchy that is generated in 
this way is the foundation of theoretical computer science. Precise 
complexity results can be notoriously difficult. The famous P=NP 
question is one of the hardest open problems in computer science 
and all of mathematics. Here we consider simple processes of eco-
logical and evolutionary spatial dynamics. The basic question is: 
what is the probability that a new invader (or a new mutant) takes 
over a resident population? We derive precise complexity results for 
a variety of scenarios. We therefore show that some fundamental 
questions in this area cannot be answered by simple equations. 
Significance 
There is a deep connection between computer science and bi-
ology. as both fields study how information proliferates in time 
and space. In computer science, the space and time require-
ments of algorithms to solve certain problems generate com-
plexity classes, which represent the foundation of theoretical 
computer science. The theory of evolution in structured pop-
ulation has provided an impressive range of results. but an 
understanding of the computational complexity of even sim-
ple questions is still mitering. In this work we prove 
unex-
pectedly 
that some fundamental problems in ecological and 
evolutionary spatial dynamics can be precisely characterized 
by well-established complexity classes of the theory of com-
putation. Since we show computational hardness for several 
basic problems, our results imply that the corresponding ques-
tions cannot be answered by simple equations. For example. 
there cannot he a simple formula for the fixation probabil-
ity of a new mutant given frequency, dependent selection in 
a structured population. We also show that some problems, 
such as calculating the molecular clock of neutral evolution in 
structured populations, admit efficient algorithmic solutions. 
Evolutionary games on greens I Sadao ofobataity I Comigany Sun 
Evolution occurs in populations of reproducing individu-
als. Mutation generates distinct types. Selection favors some 
types over others. The mathematical formalism of evolution 
describes how populations change in their genetic (or pheno-
typic) composition over time. Many papers study evolution-
ary dynamics in structunid populations [I. 2, 3, 4, 5, 6, 7. 8.1
Spatial structure can affect the rate of neutral evolution [91. 
There are results that describe which spatial structure; do or 
do not affect the outcome of constant selection [10, 11, 121. 
Constant selection refers to a situation where the compet-
ing types have constant reproductive rates independent of 
the composition of the population. Sonic population strew-
WM. Cannicti/doi/10,1073/pnas.0709640104 
tures can be amplifiers or suppressors of constant selec-
tion [13. 6, 141 meaning that. they modify the intensity of 
selective differences. 
A large literature deals with evolu-
tionary games [15, 16, 17. IS, 191 in structured populations 
[1, 20. 21, 22, 23. 24, 25, 26, 27, 281. In evolutionary games the 
reproductive success of an individual depends on interactions 
with others. Many population structures and update rules 
can affect the outcome of evolutionary games. For example, 
spatial structure can favor evolution of cooperation [1, 291. 
In this paper we are interested in stochastic evolutionary 
dynamics in populations of finite size. A typical setting is 
provided by evolutionary graph theory [6, 30, 31, 32, 33. 341. 
The individuals of a population occupy the vertices of a graph. 
The links determine who interacts with whom for receiving 
payoff and for reproduction. There can be a single graph for 
game dynamical interaction and evolutionary replacement. or 
the interaction and replacement graphs can be distinct. 1351. 
Often the graph is held constant during evolutionary updat-
ing, but it is also possible to study dynamically changing 
graphs [36, 37. 38, 39, 40, 41. 42, 43. 441. 
The study of spatial dynamics also has a long tradition in 
ecology [45. 46. 47, 48. 491. Here the typical setting is that 
different species compete for ecological niches. Many evolu-
tionary models are formally equivalent to ecological ones - es-
pecially if we consider only selection and not mutation. Then 
we can interpret the different types as individuals of different 
species. 
This paper is structured as follows. First we give an in-
tuitive account of the foundation of theoretical computer sci-
ence. We describe classier of problems that can be solved by al-
gorithms in certain time and space constraints. Subsequently 
we present two simple problems of evolutionary dynamics in 
spatial settings. The first problem is motivated by a very 
simple ecological dynamic: the second problem is the general 
setting of evolutionary games on graphs. In both cases, the 
basic question is to calculate the take over probability (or 
fixation probability) of a new type. That is we introduce a 
new type in a random position in the population and we ask 
what is the complexity of an algorithm that can characterize 
the probability that the new type takes over the population 
(becomes fixed). Unexpectedly we are able to prove exact 
complexity results (see Table I). 
Reserved for Publication Footnotes 
PNAS I Issue Date I Volvnte I Issue Number 
9 
EFTA_R1_0 1954778 
EFTA02674309
