---
source_image: "legal-filing+deposition-transcript+scanned-document+typed-page__EFTA01612888_20260130_p006_i001.png"
source_pdf: "EFTA01612888.pdf"
method: pdf_text
words: 572
confidence: 1.00
extracted: 2026-02-13T17:08:42.594469
---

FHIR resource by introducing a model for computable conformance statements. This conformance is both 
structural and semantic, allowing not only structural constraints on attributes such as cardinality and type, 
but semantic constraints using value sets. 
Algorithm 2 describes the process in greater detail. Given a transaction, the specified FHIR Profile 
is compared to the known set of allowable Profiles. If the Profile is recognized, conformance to the Profile 
is checked via the CheckProfileConformance function. This operation will ase the FHIR URL to make a 
validate' request to the FHIR server. The result of this request is a FHIR OperationOutcome response, 
which can then be inspected for conformance by the Conforms function. 
Algorithm 2: Proof of Interoperability. 
input 
: A set P of pending transactions. 
input 
: A set F of network agreed-upon FHIR Profile URIs. 
input 
: b0, the current block being assembled. 
output 
: A set V of valid transactions. 
1 V 4- 0; //Begin with an empty set of valid transactions. 
2 foreach t E P do 
s 
u <— CetFhirURL(t);
4 
p F CetFhirProfile(t); 
5 
if p E F then 
cs 
result <- CheckProfileConformance(u,p); //Using the FHIR `validate' operation. 
7 
if Conforms(resuit) then 
v<_vv{t};
Proof of Interoperability does require the network to reach consensus on the set of allowed FHIR Profiles, 
including the content of the attendant value sets. This consensus cannot, however, be reached programtnat-
ically. Network agreement is most likely a human-based process, where network participants negotiate and 
collaborate with the help of both terminology specialists and clinicians. This type of collaboration necessi-
tates a centralized, well known repository. For the value sets, we propose the use of the Value Set Authority 
Center (VSAC)[22J as a value set repository. 
3.5.2 Miner Election 
In a Proof of Work scenario, miners compete for the right to add a block to the blockchain. We instead 
employ a system of guaranteed mining share, similar to the system employed by MultiaminI23). This 
system has several advantages. First, nodes know at the start of the block period who the next miner will 
be, so transactions may he sent directly instead of distributed to the entire network. Next, it ensures that 
the mining work required to keep the network consistent is distributed evenly. Finally, by eliminating the 
competition of Proof of Work, we eliminate wasted computational effort.2
The Miner Election process is described in Algorithm 3. Recall that the last step of adding a block to 
the blockchain is for the participating nodes to sign it (see Algorithm 1). During this signing process, each 
node is required to submit a random number to be used for miner election. This set of random numbers is 
collected on line 1, and is hashed together with the block hash to produce a new number. The next miner 
then becomes the node whose Public Key is closest to this value. This process serves two purposes: (1) The 
probability of becoming a miner for any node in the network N should be 1/INS, and (2) the random number 
used for election is seeded by all participating nodes in the network. This prevents a node from generating 
a non-random number and electing itself or a chosen collaborator. 
I helps: //www .h17.org/fhir/resource-operations.html#validate 
2We do not assert that Proof of Work effort is strictly wasted. The work expended by nodes in a Proof of Work system 
certainly has value, as it is the mechanism by which the network stays consistent. 
6 
EFTA01612893
