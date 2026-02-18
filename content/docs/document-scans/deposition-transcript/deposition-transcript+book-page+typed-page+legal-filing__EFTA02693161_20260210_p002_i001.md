---
source_image: "deposition-transcript+book-page+typed-page+legal-filing__EFTA02693161_20260210_p002_i001.png"
source_pdf: "EFTA02693161.pdf"
method: pdf_text
words: 1159
confidence: 1.00
extracted: 2026-02-13T16:20:34.502911
---

1692 
TJ. Bradbury er at / Numlinage 47 (2009) 1691-1700 
et al.. 2008). and hand position and velocity have been decoded from 
MEG data collected during continuous joystick and trackball move-
ments (Georgopoulos et al., 2005: Jerbi et al. 2007). However, with the 
exception of Hammon et al.. these non-invasive studies have 
constrained subjects to small finger and wrist movements as opposed 
to multi-joint drawing or reaching movements. Also, most impor-
tantly. the tasks employed for non-invasive decoding of hand position 
and velocity have not incorporated discrete center-out movements. 
To examine our hypothesis that hand kinematics of natural. multi-
joint, center-out movements are decodable from non-invasive neural 
signals, we aimed to continuously decode hand velocity from MEG 
data collected during a two-dimensional drawing task. Currently only 
invasive studies have continuously decoded hand velocity during 
discrete center-out movements. Since MEG coupled with our decod-
ing method facilitates the ability to examine sensor involvement on a 
macroscale with high temporal resolution, we also sought to create 
snapshots of sensor importance in a network covering multiple brain 
regions across time during adaptation to a hand-cursor rotation. 
Furthermore, we aimed to examine the importance of estimated 
current sources in the network using sLORETA to determine whether 
they corroborated non-decoding visuomotor adaptation studies that 
employed other imaging modalities like EEG (Contreras-Vidal and 
Kerick, 2004), positron emission tomography (PET) (Inoue et al.. 
2000: Ghilardi et al.. 2000; Krakauer et al.. 2004). and functional 
magnetic resonance imaging (fMRI) (Graydon et al.. 2005; Seidler et 
al., 2006). 
Materials and methods 
Experimental procedure and data collection 
The Institutional Review Board of the University of Maryland at 
College Park approved the following experimental procedure. After 
giving informed consent, five healthy, right-handed subjects drew 
center-out lines with an optic pen on a glass panel positioned in 
front of them while they lay supine with their heads in an MEG 
recording dewar located inside a magnetically shielded room in the 
Kanazawa Institute of Technology (KIT)-Maryland MEG laboratory at 
the University of Maryland (Fig. IA). Cushions were positioned in 
the dewar and under the right elbow to minimize movement of the 
head and upper limb respectively. The distance between the glass 
panel and each subject's head was adjusted for comfort (approxi-
mately 35 cm from nose tip to the center of the panel). A black 
curtain occluded the subjects' vision of their hands while visual 
feedback was provided on a screen located in front of them that 
displayed the position of the pen tip as a cursor. Subjects were 
instructed to position the pen tip in a circle (0.5 cm diameter) 
located in the middle of the screen, wait for one of four circle 
targets (03 cm diameter) to appear in the corner of the screen at 
45. 135. 225. or 315°. wait for the target to change color, and then 
draw a straight line to the target as fast as possible. The inter-trial 
delay was randomized between 2 and 2.5 s. Working space 
dimensions were a 10/ 10 cm virtual square. After 40 trials ( pre-
exposure), the cursor was rotated 60' counterclockwise (exposure). 
The exposure phase consisted of 240 trials with the early-exposure 
phase composed of the first 40 trials and the late-exposure phase 
composed of the last 40 trials. After the exposure phase, the original 
orientation of the cursor was restored, and 20 more trials were 
collected and labeled as the post-exposure phase. The number of 
trials analyzed in the pre-exposure phase was reduced from 40 to 
36 because the behavioral performance during several initial trials 
of some subjects was poor due to lack of familiarization with the 
task To maintain consistency, the number of trials analyzed in the 
early- and late-exposure phases was also reduced from 40 to 36. 
A video camera sampled the movement of the pen tip at 60 Hz. and 
whole-head MEG data were acquired from 157 channels at a sampling 
rate of 1 kHz. The MEG system used coaxial type first-order 
gradiometers with a magnetic field resolution of 4 ft/Hz" or 0.8 
(ft/cm)/ Hzu2 in the white noise region. On-line. electronic circuits 
band-pass and notch-filtered the MEG data from 1-100 Hz and 60 Hz 
respectively. 
Adaptation confirmation 
To quantitatively confirm the occurrence of adaptation. the mean 
initial directional error (IDE) was calculated across subjects for each 
phase of the task. A vector from the center location of the screen 
(home) to the position of the pen at 80 ms after the pen completely 
left the center circle determined the initial direction of the planned 
movement trajectory. The IDE was calculated as the angular difference 
between this vector and a vector extending from the home location to 
the target. Four separate t-tests were performed between the IDE in 
pre-exposure and zero. IDE in pre-exposure and early-exposure. IDE in 
pre-exposure and late-exposure. and IDE in pre-exposure and post-
exposure. 
Signal pre-processing 
Data from each MEG sensor were first standardized according to 
Eq. ( I ): 
S„[t] = salt] 
gn for all n from I to N 
( 1) 
Slk 
where S„Iti and s„ItI are respectively the standardized and measured 
magnetic field strength of sensor n at time r, s, and SD„ are the mean 
and standard deviation of s„ respectively. and N is the number of 
sensors. The kinematic data were resampled from 60 Hz to 1 kHz by 
using a polyphase filter with a factor of 5/3. For computational 
efficiency. the MEG and kinematic data were then decimated from 
kHz to 100 Hz by applying a low-pass anti-aliasing filter with a cutoff 
frequency of 40 Hz and then downsampling. The best decoding results 
were obtained when both the MEG and kinematic data were 
subsequently filtered with a zero-phase. fourth-order, low-pass 
Butterworth filter with a cutoff frequency of 15 Hz. The data for 
each phase of the task were pre-processed separately. 
Decoding model 
In the subsequent analyses. we only considered hand velocity 
based on our previous work that revealed better decoding of hand 
velocity than hand position from MEG signals (Brad berry et al.. 2008). 
To continuously decode hand velocity from the MEG signals, a linear 
decoding model was used (Fig. 2) (Georgopoulos et al.. 2005): 
N 
L 
xitl — x(t - 11=E t 
bffir calt — lc] 
(2) 
n.1 k =0 
Yltl - y[t —11 = E 
E 
bniy.S„Ir — kj 
n-1 t=0 
(3) 
where x(rj and All are the horizontal and vertical position of the pen 
at time sample r respectively. N is the number of MEG sensors. L is the 
number of time lags, S„lt — kl is the magnetic field strength measured 
at MEG sensor n at time lag k and the b variables are coefficients 
obtained through multiple regression. By varying the number of lags 
and sensors independently in a step-wise fashion, the optimal number 
of lags (L= 20. corresponding to 200 ms) and the best sensors 
(N=62; from central and posterior scalp regions) were determined 
experimentally. The data for each phase of the task were decoded 
separately. 
EFTA_R 1_02036241 
EFTA02693162
