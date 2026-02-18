---
source_image: "book-page+typed-page+scanned-document__EFTA01612898_20260130_p003_i001.png"
source_pdf: "EFTA01612898.pdf"
method: pdf_text
words: 850
confidence: 1.00
extracted: 2026-02-13T16:03:59.919221
---

implemented using ECDSA with secp256k1 curve [121; and 
a cryptographic hash function 71, instantiated by a SHA-256 
[111 implementation. 
A. Building Blocks 
We now briefly introduce relevant building blocks that are 
used throughout the rest of this paper. We assume familiarity 
with Bitcoin [171 and blockchains. 
I) Identities: Blockchains utilize a pseudo-identity mech-
anism. Essentially a public-key, every user can generate as 
many such pseudo-identities as she desires in order to increase 
privacy. We now introduce compound identities, an extension 
of this model used in our system. A compound identity 
is a shared identity for two or more parties, where some 
parties (at least one) own the identity (owners), and the rest 
have restricted access to it (guests). Protocol I illustrates the 
implementation for a single owner (the user) and a single guest 
(the service). As illustrated, the identity is comprised of signing 
key-pairs for the owner and guest, as well as a symmetric 
key used to encrypt (and decrypt) the data, so that the data 
is protected from all other players in the system. Formally, 
a compound identity is externally (as seen by the network) 
observed by the 2-tuple: 
Compound2): 61k) = (pka;;, 
(I) 
Similarly, the entire identity (including the private keys) is 
the following 5-tuple: 
Compound„,, = (pk;;;;, sk;;;,pkasi;, s eig 
k 
sk:`,11) 
(2) 
Protocol 1 Generating a compound identity 
procedure COMPOUNDIDENTITY0t, 
2: 
u and s form a secure channel 
3: 
u executes: 
4: 
{pk,";;,skauip  4— guy() 
5: 
6: 
7: 
8: 
9: 
10: 
uif 
g
ske , 
e„ c() 
it shares sku,t,pkay s: with s 
s executes: 
(piesi;,sklu) 1- gsigo 
s shares plcsi; with s 
II Both it and s have skeuifc,pk."(9,pk1; 
II: 
return pk:g,pka4,84;isc
12: end procedure 
2) Blockchain Memory: We let L be the blockchain mem-
ory space, represented as the hastable L : {0,1}256 _+
{O, I}N, where N >> 256 and can store sufficiently-
large documents. We assume this memory to be tamper-
proof under the same adversarial model used in Bitcoin and 
other blockchains. To intuitively explain why such a trusted 
data-store can be implemented on any blockchain (including 
Bitcoin), consider the following simplified, albeit inefficient, 
implementation: A blockchain is a sequence of timestamped 
transactions, where each transaction includes a variable num-
ber of output addresses (each address is a 160-bit number). L 
could then be implemented as follows — the first two outputs 
in a transaction encode the 256-bit memory address pointer, 
as well as some auxiliary meta-data. The rest of the outputs 
construct the serialized document. When looking up L[kl, only 
the most recent transaction is returned, which allows update 
and delete operations in addition to inserts. 
3) Policy: A set of permissions a user u grants service s, 
denoted by POLICY„. For example, if u installs a mobile 
application requiring access to the user's location and contacts, 
then POLICY,,,, = {location, contads} . It is instructive to 
note that any type of data could be stored safely this way, 
assuming the service will not subvert the protocol and label 
the data incorrectly. Safeguards to partially prevent this could 
be introduced to the mobile SDK, but in any case, the user 
could easily detect a service that cheats, as all changes are 
visible to her. 
4) Auxiliary Functions: Parse(x) de-seralizes the mes-
sage sent to a transaction, which contains the arguments; 
CheckPolicy(phki.,xp), illustrated in Protocol 2, verifies that 
the originator has the appropriate permissions. 
Protocol 2 Permissions check against the blockchain 
I: procedure CHEcicPoLicr(pkskig,xp) 
2: 
s (— 0 
3: 
., policy = 
skig) 
4: 
if L[a otici,] 0 0 then 
pea" 9" 
PO LICY„, 
Parse(L[apaicy]) 
6: 
if pkskip = SI; or 
7: (pkakig = phs,;; and xp E POLICY.,,,) then 
8: 
‹— I 
9: 
end if 
10: 
end if 
II: 
return s 
12: end procedure 
B. Blockchain Protocols 
Here we provide a detailed description of the core protocols 
executed on the blockchain. Protocol 3 is executed by nodes 
in the network when a Tacces, transaction is received, and 
similarly, Protocol 4 is executed for 'Maga transactions. 
As mentioned earlier in the paper, Zsc„„ transactions 
allow users to change the set of permissions granted to a 
service, by sending a POLICY.,,, set. Sending the empty set 
revokes all access-rights previously granted. Sending a Tata., 
transaction with a new compound identity for the first time is 
interpreted as a user signing up to a service. 
Similarly, Tdata transactions govern read/write operations. 
With the help of CheckPolicy, only the user (always) or the 
service (if allowed) can access the data. Note that in lines 9 and 
16 of Protocol 4 we used shorthand notation for accessing the 
DHT like a normal hashtable. In practice, these instructions 
result in an off-blockchain network message (either read or 
write) that is sent to the DHT. 
C. Privacy and Security Analysis 
We rely on the blockchain being tamper-free, an assump-
tion that requires a sufficiently large network of untrusted 
peers. In addition, we assume that the user manages her keys 
in a secure manner, for example using a secure-centralized 
wallet service. We now show how our system protects against 
adversaries compromising nodes in the system. Currently, we 
EFTA01612900
