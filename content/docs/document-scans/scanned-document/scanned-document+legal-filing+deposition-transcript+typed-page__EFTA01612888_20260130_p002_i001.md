---
source_image: "scanned-document+legal-filing+deposition-transcript+typed-page__EFTA01612888_20260130_p002_i001.png"
source_pdf: "EFTA01612888.pdf"
method: pdf_text
words: 547
confidence: 1.00
extracted: 2026-02-13T17:19:53.937777
---

of bulk data to other institutions. Both options introduce unique problems. Centralization increases the 
security risk footprint, and requires centralized trust in a single authority, while bulk data transmission forces 
institutions to yield operational control of their data. 
1.3 Interoperability 
Interoperability of healthcare records is the extent to which the clinical intent can be conveyed across 
institutional boundaries. Given the complexities of data in the healthcare domain, this is inherently difficult 
to achieve[9]. We examine interoperability within the context of two facets: Structure and Semantics, each 
necessary for the successful exchange of healthcare data[10]. 
Data structure, or the attributes and data elements use to convey information, is an important part of 
interoperability. Healthcare data is complex, and heterogeneous structures decrease the effectiveness of anal-
ysis and reduce understandability. To combat this, several industry-wide standards have been advanced[11]. 
While effective, there is no one authoritative standard, and aligning data encoded with disparate standards 
is a non-trivial task. 
Semantics refers to the use of terminologies and vocabularies to describe data meaning, or to codify the 
data. This codification of healthcare data is important to its interpretation, but is only effective if all parties 
agree upon the same codification schemes, or controlled terminologiesilq. Often, subsets of vocabularies are 
used to scope a particular domain of interest. These subsets, called Value Sets, may be used in conjunction 
with structural models to constrain the allowable codifications for attributes or attribute types. 
2 Goals 
The main goal of this work is to describe an approach to effectively and securely share healthcare information 
within a data sharing network. We believe that a patient's record should be consistent and available across 
institutional boundaries, and the terms of its access strictly dictated by the patient. As a secondary goal, 
this data should not only be shared, but shared in such a way that all interested parties can understand the 
structure and meaning, ultimately leading to improved data utility and patient care. 
3 Proposal 
3.1 Assumptions 
Below are general assumptions about healthcare stakeholders (or nodes) participating in a data sharing 
network. These assumptions exclude any regulation/incentives that the network itself defines. 
1. There is value in receiving external data from other nodes, but only if you can understand the data 
structure and semantics. 
2. Without guarantees of security and auditability, nodes will neither share nor receive data. 
3. The patient ultimately controls their record, and authorizes who may access it and when. 
3.2 
Background 
3.2.1 Blockchain 
A blockchain is a distributed transaction ledger[13]. The blockchain itself is composed of blocks, with each 
block representing a set of transactions. As a data structure, a blockchain has several interesting properties. 
First, blocks are provably immutable. This is possible because each block contains a hash, or numeric digest 
of its content, that can be used to verify the integrity of the containing transactions. Next, the hash of a 
block is dependent on the hash of the block before it. This effectively makes the entire blockchain history 
immutable, as changing the hash of any block a — i would also change the hash of block n. 
The blockchain itself does not depend on a central, trusted authority. Rather, it is distributed to all nodes 
participating in the network. Because no centralized authority may verify the validity of the blockchain, 
2 
EFTA01612889
