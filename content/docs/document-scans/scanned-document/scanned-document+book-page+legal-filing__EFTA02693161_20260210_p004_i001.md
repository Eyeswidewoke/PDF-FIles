---
source_image: "scanned-document+book-page+legal-filing__EFTA02693161_20260210_p004_i001.png"
source_pdf: "EFTA02693161.pdf"
method: pdf_text
words: 740
confidence: 1.00
extracted: 2026-02-13T17:18:23.535191
---

1694 
T.J. Bra*my er 
Nearofmne 47 (2009) 1691-1700 
MEG Sensor I 
MEG Sensor 62 
Time 
Sensor Weights for X Velocity 
Sensor Weights for Y Velocity 
E 
E 
— 
Decoded — 
Measured 
4 
Nrr.r. ,r r 
Velocey Reconstrudion from MEG Data at 4100 ms (snow above) 
Y velocity Reconstruceon from MEG Oats at 1.100 rre (Maim above) 
x Velocity Recomuructon from MEG Data from mi b 6200 ms 
V velocity Recorstrucson from MEG Data from tlf) b 1-200 rra 
Fig. 2. Didactic model of the linear decoding method. The top raster plot contains time series of 62 MEG sensors extracted 100 ms prior to the current velocity sample of interest. 
Through multiple linear regression. sensor weights were computed separately for x and y velocity that transformed 11w top raster plot to the lower left and right raster plots. The 
transformed time series of the sensors were then summed to produce the reconSnucted velocity profiles (red) that overlay the measured velocity profiles (black). The upper velocity 
profiles are associated with the MEG data shown In the example (100 ms prior to the current velocity sample of interest) and the lower ones with MEG data from0 to 200 ms prior to 
the anent velocity sample of interest. 
measured and decoded hand velocity was computed across folds. Prior to 
computing the CC, the kinematic signals were smoothed with a fourth-
order, low-pass Butterworth filter with a cutoff frequency of 0.6 HL Cross-
validation was executed with m= 9 for all phases of the task except for 
post-exposure where m = 5. For Fig. 3B, standardized velocity profiles 
were computed with I% ' 
with s, replaced by a velocity profile. 
Sensor sensitivity curves 
A curve depicting the relationship between decoding accuracy and 
the number of sensors was computed for the x and y dimensions of 
hand velocity for each subject for each phase of the task. A similar 
method to examine this relationship has been used to analyze 
neuronal recordings (tiancliti ci al., 20114). First, for each subject 
and each phase of the task, each sensor was assigned a rank according 
to I q. '4': 
`Al 
R" 
Ma + 1 
/bm^kw - + bmitLY for all n from I to N 4) 
where R„ is the rank of sensor n and M is the number of folds of the 
cross-validation procedure. Second, the decoding model was iteratively 
executed with only the highest-ranked sensor, the four highest-ranked 
sensors, the seven highest-ranked sensors. etc. until all sensors were 
used. For each phase of the task the mean SD of the CCs computed 
across subjects was plotted against the number of sensors. Finally, each 
plot was fitted to a double-exponential curve. and the coefficient of 
determination. le. was calculated as a measure of the goodness of fit. 
Scalp snaps of sensor contributions 
To graphically assess the relative contributions of scalp regions to 
the reconstruction of hand velocity, the across-subject means of the b 
(from Eqs. X and ;
.l .) vector magnitude were projected onto a time 
series ( — 200 to 0 ms in increments of 10 ms) of scalp maps for each 
phase of the task. These spatial renderings of sensor contributions 
were produced by the topoplot function of EEG AB version 6.01b, an 
open-source MATLAB toolbox for electrophysiological data proces-
sing (Deli-nine and Maketg. 2004: 'thy wen uccd edu eegial) ), 
that performs biharmonic spline interpolation of the sensor values 
before plotting them (Sandwell. 198?). To examine which time lags 
were the most important for decoding. for each scalp map. the 
percentage of reconstruction contribution for a phase of the task was 
computed as 
N 
4)b„ 
+ bfly 2
GTI=100%x  faa tN 
 
 for all i from 0 to L 
(5) 
E E Veenk. + No 2
k=0 
where %I, is the percentage of reconstruction contribution for a scalp 
map at time lag i. 
Comparison of scalp maps across adaptation 
Right-tailed. paired t-tests determined statistically significant 
(p<0.05) changes in sensor contributions between phases of the 
task. Three contrasts between the scalp maps were computed for 
increases from baseline (pre-exposure): early-exposure - pre-expo-
sure. late-exposure - pre-exposure. and post-exposure - pre-expo-
sure: and three contrasts were computed for decreases from baseline: 
pre-exposure - early-exposure. pre-exposure - late-exposure, and 
pre-exposure - post-exposure. The resultant r scores were converted 
to z scores and then rendered onto scalp maps with the topoplot 
function of EEGLAB 
Mdkelg, 
21.11.14) with increases and 
decreases represented with hot and cool colors respectively. 
EFTA_R1_02036243 
EFTA02693164
