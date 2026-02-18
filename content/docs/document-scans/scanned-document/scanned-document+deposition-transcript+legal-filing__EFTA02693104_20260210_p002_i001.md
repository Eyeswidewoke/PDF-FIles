---
source_image: "scanned-document+deposition-transcript+legal-filing__EFTA02693104_20260210_p002_i001.png"
source_pdf: "EFTA02693104.pdf"
method: pdf_text
words: 639
confidence: 1.00
extracted: 2026-02-13T17:19:21.388720
---

Reconstructing 3D hand um\ emems from LEG 
Bradberry et al. 
N L 
y[t]— y[t —1]= ay +Ezb„„..s.„ [t-k] 
(3) 
aml 4-0 
N L 
Z[i]— Zit — 11= az +ZEb„k„S„[I—k] 
ROI 4.0 
where x[t]— x[t —1], y[1]— y[t —1] , and z[t]— z[t —1] are the horizontal, vertical, and depth velocities of the 
hand at time sample t respectively, N is the number of EEG sensors, L (= 10) is the number of time lags, 
S„ [t —k] is the standardized difference in voltage measured at EEG sensor n at time lag k, and the a and b 
variables are weights obtained through multiple linear regression. The number of lags (L=10, corresponding to 
100 ms) was chosen based on a previous study that reconstructed hand kinematics from neural signals acquired 
with MEG (Bradberry et al., 2009a). The three most frontal sensors (FP I, FPZ, and FP2 of the International 10-
20 system) were excluded from the analysis to further mitigate the influence of any eye movements on 
reconstruction, resulting in an N of 55 sensors. 
(4) 
For each subject, the collected continuous data contained approximately 80 trials. An 8x8-fold cross-validation 
procedure was employed to assess the decoding accuracy. In this procedure, the entire continuous data were 
divided into 8 parts, 7 parts were used for training, and the remaining part was used for testing. The velocity 
data and EEG data were synchronized, so that if m samples of velocity were to be reconstructed then the aligned 
m samples of EEG data from a single sensor were used along with 10 lagged versions of these m EEG samples 
for a total of m(10 + I) samples per sensor (plus one for the offset a). Based on the sampling rate of 100 Hz and 
collection duration of approximately 5 minutes per subject, m was about 3750 samples per training fold and 
26,250 samples per testing fold. The cross-validation procedure was considered complete when each of the 8 
combinations of training and testing data were exhausted, and the mean Pearson correlation coefficient (r) 
between measured and reconstructed kinematics was computed across folds. Prior to computing r, the kinematic 
signals were smoothed with a zero-phase, fourth-order, low-pass Butterworth filter with a cutoff frequency of 1 
Hz. 
Sensor Sensitivity Curves. Curves depicting the relationship between decoding accuracy and the number of 
sensors used in the decoding method were plotted for the x, y, and z dimensions of hand velocity. First, for each 
subject, each of the 55 sensors was assigned a rank according to 
R — 
±4b 
2 
bmk) 2 
bmks 2 
for all n from to N 
(5) 
L1 El kno 
where R is the rank of sensor n, and the b variables are the best regression weights. This ranking procedure is 
similar to the one described by Sanchez et al. (2004). Next, the decoding method with cross-validation as 
described above and ranking method were iteratively executed using backward elimination with a decrement 
step of three (52 highest-ranked sensors, 49 highest-ranked sensors, 46 highest-ranked sensors, etc.). The mean 
and standard error of the mean (SEM) of r values computed across subjects were plotted against the number of 
sensors. 
Scalp maps of sensor contributions. To graphically assess the relative contributions of scalp regions to the 
reconstruction of hand velocity, the across-subject mean of the magnitude of the best b vectors (from Eqs. 2-4) 
was projected onto a time series (-100-0 ms in increments of 10 ms) of scalp maps. These spatial renderings of 
sensor contributions were produced by the topoplot function of EEGLAB, an open-source MATLAB toolbox 
for electrophysiological data processing (Delorme and Makeig, 2004; http://sccn.ucsd.edu/eeglab/), that 
performs biharmonic spline interpolation of the sensor values before plotting them (Sandwell, 1987). To 
examine which time lags were the most important for decoding, for each scalp map, the percentage of 
reconstruction contribution was defined as 
EFTA_R1_02036184 
EFTA02693105
