---
source_image: "legal-filing+scanned-document+typed-page+book-page__EFTA01612888_20260130_p007_i001.png"
source_pdf: "EFTA01612888.pdf"
method: pdf_text
words: 566
confidence: 1.00
extracted: 2026-02-13T17:09:41.789352
---

Algorithm 3: Miner Election. 
input 
: A set N of Nodes participating in the network. 
input 
: The current (last) block on the blockchain, block bn. 
output 
: A randomly elected miner node a. 
S 
SetRandomSeed(b.); 
2 h 
GetSlockliash(b.); 
s foreach s E S do 
4 L h 
Hash(h+s); 
s a 4— where iGetPublicKey(n) — hi is minimized for node it; 
3.6 Data Discovery and Access 
Even though the block itself does not contain the actual record data, searchability and discoverability 
remain requirements, as well as a mechanism to access data once the appropriate transactions are found. 
External entities, with the appropriate permissions, may query the blockchain using keywords in the Secure 
Index held of the transaction. These keywords may be encrypted to prevent data leakage while still being 
searehable[24, 2]. Once the transactions of interest are located, the FHIR URL can be used to retrieve the 
actual resource. 
3.7 Security 
As stated above, data security (both privacy and anonymity) are fundamental priorities for the system. A 
multi-faceted approach to security for our proposed network includes: 
Blockchain Encryption. Nothing in the blockchain should be stored in plain text. Public information, 
or information intended for all nodes in the network, is expected to be encrypted by a network-shared key, 
while sensitive information should he encrypted by the originating node. 
Privacy Preserving Keyword Searches. To facilitate data searchability and discoverability, Privacy 
Preserving Keyword Searches[24] are used. In this way, an external entity may request a set of transactions 
from the blockchain matching some criteria, with both the query and the transactions remaining encrypted. 
Smart Contracts. In reality, the security landscape around the patient record is much more nuanced than 
simply encrypting data. Patients may authorize access to their record only under certain conditions or for 
a specific reason. This notion of the codification of usage agreements is called smart contracts[25]. There is 
precedent for their use on a blockchain (e.g., the Ethereum project[26]), and given the complexities involved 
with our healthcare use case, smart contracts will play an important role. The intent is to ensure that 
patient authorization is codified and executable - for example. a patient may want their data shared only 
for research of a certain type, or for a given time range. These smart contracts can be placed directly on the 
blockchain as transactions[27], providing not only assurances of validity but an audit mechanism as well. 
3.8 Patient Identification 
Consistently identifying a patient between institutions is a non-trivial problem. Many approaches involve 
some variation of a centralized Master Patient Index (MP0[23], or a single trusted identifier source. This 
approach has many of the same disadvantages as centralizing patient data - mainly, it requires centralized 
trust and consolidates valuable information in a single, known place. While a robust MPI discussion is 
beyond the scope of this work, we can apply some of the design approaches used here. Borrowing from the 
Bitcoin model, we can think of data on the blockchain assigned to addresses, not patients, with patients 
controlling the keys to these addresses. The advantage to this approach is that consensus on a single identifier 
does not need to be reached - a patient may hold multiple blockchain addresses for different institutions. 
This notion requires the patient to manage and maintain keys to these addresses via an electronic wallet, 
and is a significant deviation from current practices where institutions assign and own patient identifiers. 
7 
EFTA01612894
