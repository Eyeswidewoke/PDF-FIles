---
source_image: "book-page+typed-page__EFTA01612898_20260130_p004_i001.png"
source_pdf: "EFTA01612898.pdf"
method: pdf_text
words: 827
confidence: 1.00
extracted: 2026-02-13T16:04:01.164392
---

Protocol 3 Access Control Protocol 
L: procedure HANDLEAccEssTX(pk.kig, m) 
2: 
s 4— 0 
3: 
pk:g, pk:;:, POLICY,, = Parse(m) 
4: 
if pkikis, = pk:i; then 
5: 
L[7-i(pkts,)] = m 
6: 
s4-1 
7: 
end if 
8: 
return 
9: end procedure 
Protocol 4 Storing or Loading Data 
I: procedure HANDLEDATATX(pkskig,m) 
2: 
C, Xp,rw = Parse(m) 
3: 
if Check Policy(phskig, xp) = True then 
4: 
plz. , pia, POLICY., 
Parse(LIN(ple 
5: 
Or, = it(Pk:;; II xp) 
6: 
if rw = 0 then 
r, rw=0 for write. 1 for read 
7: 
ilc=NW 
8: 
L[azj 4— L[a.p] LI h. 
9: 
(DHT) ds[hc) 4— C 
10: 
return h. 
II: 
else if c E L[a.p] then 
12: 
(DHT) return dd[hc] 
13: 
end if 
14: 
end if 
IS: 
return 0 
16: end procedure 
4-
are less concerned about malicious services that change the 
protocol or record previously read data, as they are likely to be 
reputable, but we provide a possible solution for such behavior 
in section V-A. 
Given this model, only the user has control over her data. 
The decentralized nature of the blockchain combined with 
digitally-signed transactions ensure that an adversary cannot 
pose as the user, or corrupt the network, as that would imply 
the adversary forged a digital-signature, or gained control over 
the majority of the network's resources. Similarly, an adversary 
cannot learn anything from the public ledger, as only hashed 
pointers are stored in it. 
An adversary controlling one or more DHT nodes cannot 
learn anything about the raw data, as it is encrypted with keys 
that none of the nodes posses. Note that while data integrity is 
not ensured in each node, since a single node can tamper with 
its local copy or act in a byzantine way, we can still in practice 
minimize the risk with sufficient distribution and replication of 
the data. 
Finally, generating a new compound identity for each user-
service pair guarantees that only a small fraction of the data is 
compromised in the event of an adversary obtaining both the 
signing and encryption keys. If the adversary obtains only one 
of the keys, then the data is still safe. Note that in practice 
we could further split the identities to limit the exposure of a 
single compromised compound identity. For example, we can 
generate new keys for every hundred records stored. 
V. DISCUSSION OF FUTURE EXTENSIONS 
In this section, we slightly digress to present possible 
future extensions to blockchains. These could play a significant 
role in shaping more mature distributed trusted computing 
platforms, compared to current state-of-the-art systems. More 
specifically. they would greatly increase the usefulness of the 
platform presented earlier. 
A. From Storage to Processing 
One of the major contributions of this paper is demonstrat-
ing how to overcome the public nature of the blockchain. So 
far, our analysis focused on storing pointers to encrypted data. 
While this approach is suitable for storage and random queries, 
it is not very efficient for processing data. More importantly, 
once a service queries a piece of raw data, it could store it for 
future analysis. 
A better approach might be to never let a service observe 
the raw data, but instead, to allow it to run computations 
directly on the network and obtain the final results. If we split 
data into shares (e.g., using Shamir's Secret Sharing 123)), 
rather than encrypting them, we could then use secure Multi-
party Computation (MPC) to securely evaluate any function 
In Figure 2, we illustrate how MPC might work with 
blockchains and specifically in our framework. Consider a 
simple example in which a city holds an election and wishes 
to allow online secret voting. It develops a mobile application 
for voting which makes use of our system, now augmented 
with the proposed MPC capabilities. After the online elections 
take place, the city subsequently submits their back-end code 
to aggregate the results. The network selects a subset of nodes 
at random and an interpreter transforms the code into a secure 
MPC protocol. Finally, the results are stored on the public 
ledger, where they are safe against tampering. As a result, no 
one learns what the individual votes were, but everyone can 
see the results of the elections. 
procedure EVarE((s)ui •••, ( * )Vn) 
nra 
L a. i  V, 
if s < 0 then 
L[Cleiection] 
Ul 
else if s > 0 then 
L[aci 
] 4— u2
end if 
end procedure 
NET Computes: 
if s < 0 then 
L[adection] 
else ifs > 0 then 
L[actection] <— U2 
end if 
MPC Computes: 
Hp. 
broadcast: islp, —> AI PC 
8 4— reconstruct(N) 
broadcast: s —> NET 
Fig. 2. Example of a flow of secure computation in a blockchain network. The 
top left block (EVote procedure) is the unsecure code, where the arguments 
marked in (•) are private and stored as shares on the DHT. The network 
selects a subset of nodes at random to compute a secure version of EVote and 
broadcasts the results back to the entire netwott, that stores it on the ledger. 
EFTA01612901
