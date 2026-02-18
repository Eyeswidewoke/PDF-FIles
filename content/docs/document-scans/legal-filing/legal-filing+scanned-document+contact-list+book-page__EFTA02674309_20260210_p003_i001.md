---
source_image: "legal-filing+scanned-document+contact-list+book-page__EFTA02674309_20260210_p003_i001.png"
source_pdf: "EFTA02674309.pdf"
method: pdf_text
words: 1461
confidence: 1.00
extracted: 2026-02-13T17:09:26.036908
---

OTC qUe86011 is #P-hard and in PSPACE. The results follow 
from SI Theorem 4, Theorem 8, and Theorem 15. 
Note that the first problem can also be obtained as a spe-
cial case of the second problem. In the payoff matrix (I) we 
can set, for example, a = -1, b = I, e = d = 0. This 'game' 
has the property that type 13 never reproduces and type A 
reproduces until half its neighbors are also of type A. This 
parameter choice leads to the same qualitative behavior and 
the same complexity bounds as described in the first. problem. 
A generalization of games on graphs is the setting where 
the interaction graph and the replacement graph are dis-
tinct (35). Thus each individual interacts with all of its neigh-
bors on the interaction graph to receive payoff. Subsequently 
an individual is chosen for reproduction proportional to its 
fecundity. The offspring is placed randomly among all neigh-
bors of the focal individual on the replacement graph. In this 
case, both the qualitative and quantitative questions become 
PSPACE-complete (SI Theorem 15) 
We also consider a variation of the second problem. In 
particular we change the mapping from payoff to fecundity. 
We now assume that fecundity is an exponential function of 
payoff, mid refer to it as exponential fitness (see Figure 4 for 
an illustration). Therefore the fecundity of an individual is 
always positive (even if its payoff sum is negative). In this 
setting the qualitative question can be decided in polynomial 
time. The reason is that the fixation probability is positive 
if the graph is connected. Thus, in order to answer the qual-
itative question the algorithm only needs to check whether 
the graph is connected; this problem is in P. However, the 
quantitative question has the same complexity as the previ-
ous problem (SI Theorem 16 and Theorem 17). 
A special case of games on graphs is constant selection. 
Type A has constant fecundity a and type 13 has constant 
fecundity b independent of any interactions. The qualitative 
I. Nowak MA. May RM (1992) Emlutionay gams and mad chaos. Nature BOA 
2. Killingback T. Ociegia M (1996) Spatial evolutionary game showy: Hawks and doves 
malted. Prot. FL Soc. B 2634137421135-1144. 
3. Seat., G. Take C (1996) Evolutionary Mantis ek.na Vine on a mime laths 
Phys. Rev. E. 56(1)69-73. 
4. Szabo G. Hatett C (2002) Phase Masada and Mantecring in spatial a lac goods 
gales. Pans. Rea. Lat. 89.110101. 
S. Monet C. Doebdi M (2004) Spatial *mature often inhibits the evolution ol toopcs• 
atlas in the mandrill game Nature 42864). 
6. Liernman E. Haan C. Nowak MA (2005) Evolutiormy Opuntia on graphs. Name 
4330121)112 316. 
7. Novak MA. Tanga CE. Aural T (2009) Evolution/ay dynamics in structural panda 
lions. Ph. Tans R Soc 0 36511537)19-30. 
Allen B. Tanta CE (20121 beamsal success in dm of endiation y macs with 
bed population size ad structure. J. Maki. Bid pp. 1-15. 
9 Allen 13 et al (2015) The natant.. clock of neutial eadution can be accebated 
sacmcil bye morel is sp.atial structure. PIGS Comput Bid 11(2).1004108+. 
It 
Aillani 0. Novak MA (2014) Urnietsality of grabs .osaaia n eandody stoic. 
cured populaces SO RV 44692. 
II. Manama T (1974) A miaow process of gone beciancy charge b a geopaplacally 
stemmed population. Gaieties 1642jser-171. 
12. Banal NH (1993) The probability of Ration of a farmed allele in a subdivided 
populace. Gaieties Roseau. 62149-157. 
11. Nowa MA. Michot F. lama Y (2003) The linear process .4 somatic evolution. Pioc 
Nal Aced S6 USA 100(25). 14966 14969. 
14. Novak MA (2006) brolutionay Dynamic*. (Hamad UtlivaSitt, Pan). 
IS. Smith 10(1902) Evolution and the Theory 04 Canna. (Cambridge Winersity Press. 
Cambridge. UK). 
16. Helbemcv J. Sigmund K. S.. (1968) The bay of evolution and dynamical systems, 
Mathematical aspect* of selection, (Cambidge Univenity Pam. Cambridge). 
17. Ildbaim I. S.aund K (1998) Evolutionary Gamin and Population Dynamic.. (Can' 
bide. um ...my Pieta Cambridge), 
IS. Crewcut R (2003) volutatay dynamic. and ntensive lam days. Economic leant 
ig and social evolution (MIT Press. Cambia)* (Mm.)). 
19. Broom M. Raba J (2013) Game-Theurelical Moat in &any. (Cluane., and 
Hall/CRC Mas. Compd. Bic.. S...). 
20. Mem G (4M) lararang, brat intarattiors and coordneten. 
Economic. 
61(3):1047-1071. 
Fettling Author 
question concerning the fixation probability of A is 111 P. The 
quantitative question is in PSPACE, but any non-trivial lower 
ho 
1 is an open question. 
In summary, we have established complexity results for 
some fundamental problem: in ecology and evolutionary 
games on graphs. In particular, we have solved the open prob-
lems mentioned in the survey (50. Open Problem 2.1 and 2.21. 
Our main results are summarized in Table I. The most in-
teresting aspects of our results are the lower bound.s, which 
shows that in most cases there exists no efficient algorithm, 
under the widely believed conjecture that. P is different from 
NP. A simple equation based solution would give an efficient 
algorithm, and thus our result shows that for evaluating the 
fixation probability in spatial settings there does not exist a 
simple equation based solution in general. 
Finally, while we establish computational hardness for sev-
eral problems, we also show that two classic problems can he 
solved in polynomial time (SI Section 7). Pint, we consider 
the molecular clock, which is the rate at which neutral muta-
tions accumulate over time. The molecular clock is affected 
by population structure (35). We show that the molecular 
clock can be computed in polynomial time because the profs 
gem reduces to solving a set of linear equalities, which can be 
achieved in polynomial time using Gaussian elimination. Sec-
ond, we consider evolutionary games in a well-mixed popula-
tion structure, where the underlying structure is the complete 
graph (51). We show that the exact fixation probability can 
be computed in polynomial time. In this case the problem can 
be reduced to computing absorption probabilities in Marken,
chains, where each state represent the number of mutants. 
Hence the Markov chain Ls linear in the number of vertices 
of the graphs, and since absorption probabilities in Markov 
chains can be computed in polynomial time (by solving a set 
of linear equalit let) we obtain the desired result. 
21. Hot AV (1994) Cdhative phenonane in KM" 
eateneled nolutionor flan  J. 
That Md. 169.65 - 87. 
22. Nauman M. Naomi H. base Y (1991) Score cketrndent deity model fa he 
evolution of semester in a !MOW J. Theo. Bid. 194 101 - 124. 
23. Szabo G. Antal T. Szabo P. Dior M (2000) Spatial erOluticaleY Fedmes dorm"m 
gm with three waters and enema constraints. Phys. Rev. E 621094t. 
24. Ken 0. Riley MA. Feldman MW. Elohannan BIM (MO) Local dispersed promotes 
biodimmb in a mai li e game a rock papa scilicet. Nana. 411:171-174. 
25. Heeling D. Yu W (2000) Migration as a Mechanism to Pomace Cooperation. Ad 
Valgek an Complex Systems 11.641452. 
26. Twat+ CE. Ohba: H. Anlal T. iv F. Nowak MA (2009) Strategy selection In struc-
tured populations. J. Thom. Bd. 259.570 
SID. 
27. Pat M. Szolnoki A (2010) Conchal:unary gam. mud macre. eimagrems 98109
12S 
NI van Veda M. Gm:a J. Rand DG. Nowak MA (2012) Died mcbmity in summed 
populations. P. Nail. Acad. Sci. USA 109.9929-9934 
29. Olasint H. Kauai C. Liebman E. Nome MA (2006) A simple rule fa the evolution 
of cooperation on graphs and social neteaks Name 4410090202- SOS. 
30. UM:, G. Fah G (20071 “CltItiellairy gases on graphs. Phys Rep 446'97-216 
31. Yang HA. VA• 2X. O. WB (2012) EntiulkitIOS VS!, the Katt free Illtheal yeah 
amble degree distrgautice. CPL lEwophysies Latta) 9911210006 
32. Om YT (2013) Sam benefit to cost rules la the evolution of cooperation on regular 
pegs. An. App- Pemba, 23.637-661, 
33. AM. B. Noma MA (2014) Gann on graphs. EMS Sun Math Sa 1.113-151. 
34. Otbarre F. Haan C. Dolby. M (20141 Social manna in structured populations. 
Nat Comm S. 
35. Olauski H. Pacheco IM. Naas MA (2001) Evolutional,' grads Mat betaking the 
trt-sys, beams, ...Tacna and Madement. J That. Bid. 246601-694, 
36. Shawn B. Penang. IL (2000) A dynamic model of social mama India. 
P. Natl. 
Acad. Sa. USA 9711619340 9346. 
37. Pathan> JM. Traub,. A. Noma MA (2006) Comolutiun of many and StruCtitte 
cond. abatis with dynamical linking. Phys. Rev. Lem 97,256103 
38. Fu F. Ilmat C. Nora* MA. Wang L (2006) Reputation Lash tartan choice ptonhotes 
coormation in mad ..aware, Plea Rar. E 78,026117. 
39 Antal T. Olawki H. Wacky A inlet PD. Nowak MA (2009) Evolution of camera 
lion by phenotypic Milano. P. Hata Acid. Sci. USA 106(21)89)7 8400. 
40 Tardia CT. Antal T. Ohisuld H. Norsk MA (2009) Evolution., Mamas in vat 
lotrUCtiaed SOSUSIIIDAL P. Nat Acad. Sci. USA 106(21) bell 8014 
PNAS l elm. Date I Volume I ItStIl. Number I 3 
EFTA_R1_01954780 
EFTA02674311
