---
source_image: "scanned-document+legal-filing+deposition-transcript__EFTA02693104_20260210_p003_i001.png"
source_pdf: "EFTA02693104.pdf"
method: pdf_text
words: 505
confidence: 1.00
extracted: 2026-02-13T17:19:55.275793
---

Reconstructing 31) hand movements from LEG 
Bradherry et al. 
N 
 kix 2 + basy 
+ 
2 kfr2 
%Ti =100%x 7 1, 
 
 
for all i from 0 to L 
(6) 
EE./b„b2 + b.4.2 + b„,e2
n=1 k 
where %7; is the percentage of reconstruction contribution for a scalp map at time lag i. 
Source estimation with sLORETA. To better estimate the sources of hand velocity encoding, we used 
standardized low-resolution brain electromagnetic tomography (sLORETA) software version 20081104 
(Pascual-Marqui, 2002; http://www.uzh.ch/keyinst/loreta.htm). Preprocessed EEG signals from all 55 channels 
for each subject were fed to sLORETA to estimate current sources. These EEG signals had been pre-processed 
in the same manner as for decoding: standardized, downsampled, and low-pass filtered. First, r values were 
computed between the squared time series of each of the 55 sensors with the 6239 time series from the 
sLORETA solution and then averaged across subjects. Second, the maximum r was assigned to each voxel after 
being multiplied by the regression weight b (from Eqs. 2-4) of its associated sensor. The regression weights had 
been pulled from the regression solution at time lag —60 ms, which had the highest percentage of reconstruction 
contribution. Third, for visualization purposes, the highest 5% of the voxels (r values weighted by b) were set to 
the value one, and the rest of the r values were set to zero. Finally these binary-thresholded r values were 
plotted onto axial slices of the brain from the Colin27 volume (Holmes et al., 1998), the magnetic resonance 
imaging (MRI) template that best illustrated our regions of interest. All reported coordinates of regions of 
interest are in Montreal Neurological Institute (MNI) space. 
Movement variability. For each subject, three measures of movement variability were computed: the coefficient 
of variation (CV) for movement time (MT), the CV for movement length (ML), and the kurtosis of movement. 
MT and ML were computed on a trial basis with a trial defined as the release of a pushbutton to the press of a 
pushbutton (center-to-target or target-to-center). The mean and SD of the measures were then computed, and 
the SD was divided by the mean to produce the CV. Kurtosis was defined as 
k — E(h —14)4 
3 
(7) 
ck
. 
where k is the kurtosis, El) is the expected value operator, h is the hand velocity, and ph and cr„ are 
respectively the mean and SD of the hand velocity. Single trials of velocity profiles for x, y, and z dimensions 
were resampled to normalize for length and then concatenated before computing kurtosis. The relationship 
between movement variability and decoding accuracy was examined by computing r between the quantities. 
The sample sizes were small (n = 5) for decoding accuracy and each measure of movement variability, so 
10,000 r values were bootstrapped for each comparison, and the median and confidence intervals of the 
resultant non-Gaussian distributions were calculated using the bias-corrected and accelerated (BC,) percentile 
method (Efron and Tibshirani, 1998). 
Reference 
Sandwell DT (1987) Biharmonic spline interpolation of GEOS-3 and SEASAT altimeter data. Geophys Res 
Lett 2:139-142. 
EFTA_R1_02036185 
EFTA02693106
