---
source_image: "book-page+typed-page__EFTA01612898_20260130_p002_i001.png"
source_pdf: "EFTA01612898.pdf"
method: pdf_text
words: 835
confidence: 1.00
extracted: 2026-02-13T16:04:01.161886
---

II. 
THE PRIVACY PROBLEM 
Throughout this paper, we address the privacy concerns 
users face when using third-party services. We focus specifi-
cally on mobile platforms, where services deploy applications 
for users to install. These applications constantly collect high-
resolution personal data of which the user has no specific 
knowledge or control. In our analysis, we assume that the 
services are honest-but-curious (i.e., they follow the protocol). 
Note that the same system could be used for other data-
privacy concerns, such as patients sharing their medical data 
for scientific research, while having the means to monitor how 
it is used and the ability to instantly opt-out. In light of this, our 
system protects against the following common privacy issues: 
Data Ownership. Our framework focuses on ensuring that 
users own and control their personal data. As such, the system 
recognizes the users as the owners of the data and the services 
as guests with delegated permissions. 
Data Transparency and Auditability. Each user has 
complete transparency over what data is being collected about 
her and how they are accessed. 
Fine-grained Access Control. One major concern with 
mobile applications is that users are required to grant a set 
of permissions upon sign-up. These permissions are granted 
indefinitely and the only way to alter the agreement is by 
opting-out. Instead, in our framework, at any given time the 
user may alter the set of permissions and revoke access to 
previously collected data. One application of this mechanism 
would be to improve the existing permissions dialog in mobile 
applications. While the user-interface is likely to remain the 
same, the access-control policies would be securely stored on 
a blockchain, where only the user is allowed to change them. 
Ill. 
PROPOSED SOLUTION 
We begin with an overview of our system. As illustrated 
in Figure I, the three entities comprising our system are 
mobile phone users, interested in downloading and using 
applications; services, the providers of such applications who 
require processing personal data for operational and business-
related reasons (e.g., targeted ads, personalized service); and 
nodes, entities entrusted with maintaining the blockchain and a 
distributed private key-value data store in return for incentives. 
Note that while users in the system normally remain (pseudo) 
anonymous, we could store service profiles on the blockchain 
and verify their identity. 
The system itself is designed as follows. The blockchain 
accepts two new types of transactions: Taccen, used for access 
control management; and T elma, for data storage and retrieval. 
These network operations could be easily integrated into a 
mobile software development kit (SDK) that services can use 
in their development process. 
To illustrate, consider the following example: a user installs 
an application that uses our platform for preserving her privacy. 
As the user signs up for the first time, a new shared (user, 
service) identity is generated and sent, along with the asso-
ciated permissions, to the blockchain in a Taccess transaction. 
Data collected on the phone (e.g., sensor data such as location) 
is encrypted using a shared encryption key and sent to the 
blockchain in a Zhua transaction, which subsequently routes 
it to an off-blockchain key-value store, while retaining only 
a pointer to the data on the public ledger (the pointer is the 
SHA-256 hash of the data). 
Both the service and the user can now query the data using 
a Tdatc, transaction with the pointer (key) associated to it. The 
blockchain then verifies that the digital signature belongs to 
either the user or the service. For the service, its permissions 
to access the data are checked as well. Finally, the user can 
change the permissions granted to a service at any time by 
issuing a Tacc,„ transaction with a new set of permissions, in-
cluding revoking access to previously stored data. Developing 
a web-based (or mobile) dashboard that allows an overview 
of one's data and the ability to change permissions is fairly 
trivial and is similar to developing centralized-wallets, such as 
Coinbase for Bitcoinl. 
The off-blockchain key-value store is an implementation of 
Kademilia 116I, a distributed hashtable (or DHT), with added 
persistence using LevelDB2 and an interface to the blockchain. 
The DHT is maintained by a network of nodes (possibly 
disjoint from the blockchain network), who fulfill approved 
read/write transactions. Data are sufficiently randomized across 
the nodes and replicated to ensure high availability. It is 
instructive to note that alternative off-blockchain solutions 
could be considered for storage. For example, a centralized 
cloud might be used to store the data. While this requires some 
amount of trust in a third-party, it has some advantages in terms 
of scalability and ease of deployment. 
DHT 
Fig. I. Overview of the decentralized platform. 
IV. 
THE NETWORK PROTOCOL 
We now describe in detail the underlying protocol used 
in the system. We utilize standard cryptographic building 
blocks in our platform: a symmetric encryption scheme defined 
by the 3-tuple 
Venc) — the generator, encryption 
and decryption algorithms respectively; a digital signature 
scheme (DSS) described by the 3-tuple (g„„9,$,,,,v„,) - the 
generator, signature and verification algorithms respectively, 
'Coinbase bitcoin wallet. http://www.combase.com 
2LcvelDB. http://githulxcom/gongleileveldb 
EFTA01612899
