---
source_image: "scanned-document+legal-filing+typed-page__EFTA01612898_20260130_p001_i001.png"
source_pdf: "EFTA01612898.pdf"
method: pdf_text
words: 817
confidence: 1.00
extracted: 2026-02-13T17:19:57.369193
---

Decentralizing Privacy: Using Blockchain to Protect 
Personal Data 
Guy Zyskind 
MIT Media Lab 
Cambridge, Massachusetts 
Email: guyz@mit.edu 
Oz Nathan 
Tel-Aviv University 
Tel-Aviv, Israel 
Email: oznathan@gmail.com 
Abstract—The recent Increase in reported incidents of surveil-
lance and security breaches compromising users' privacy call into 
question the current model, in which third-panies collect and con-
trol massive amounts of personal data. Bitcoin has demonstrated 
in the financial space that trusted, auditable computing is possible 
using a decentralized network of peers accompanied by a public 
ledger. In this paper. we describe a decentralized personal data 
management system that ensures users own and control their 
data. We implement a protocol that turns a blockchain into an 
automated access-control manager that does not require trust in 
a third party. Unlike Bitcoin, transactions in our system are not 
strictly financial — they are used to carry instructions, such as 
storing, querying and sharing data. Finally, we discuss possible 
future extensions to blockchains that could harness them into a 
well-rounded solution for trusted computing problems in society. 
Keywords—blockchain; privacy; bitcoin; personal data 
I. INTRODUCTION 
The amount of data in our world is rapidly increasing. 
According to a recent report [22], it is estimated that 20% of 
the world's data has been collected in the past couple of years. 
Facebook, the largest online social-network, collected 300 
petabytes of personal data since its inception [I] — a hundred 
times the amount the Library of Congress has collected in over 
200 years [131. In the Big Data era, data is constantly being 
collected and analyzed, leading to innovation and economic 
growth. Companies and organizations use the data they col-
lect to personalize services, optimize the corporate decision-
making process, predict future trends and more. Today, data is 
a valuable asset in our economy [211. 
While we all reap the benefits of a data-driven society, there 
is a growing public concern about user privacy. Centralized 
organizations — both public and private, amass large quantities 
of personal and sensitive information. Individuals have little or 
no control over the data that is stored about them and how it 
is used. In recent years, public media has repeatedly covered 
controversial incidents related to privacy. Among the better 
known examples is the story about government surveillance 
[21, and Facebook's large-scale scientific experiment that was 
apparently conducted without explicitly informing participants 
[101. 
Related Work. There have been various attempts to ad-
dress these privacy issues, both from a legislative perspective 
([4], [201), as well as from a technological standpoint. Open-
PDS, a recently developed framework, presents a model for 
The first two authors contributed equally to this work. 
Alex 'Sandy' Pentland 
MIT Media Lab 
Cambridge, Massachusetts 
Email: pentland@mit.edu 
autonomous deployment of a PDS which includes a mecha-
nism for returning computations on the data, thus returning 
answers instead of the raw data itself [61. Across the industry, 
leading companies chose to implement their own proprietary 
authentication software based on the OAuth protocol [191, in 
which they serve as centralized trusted authorities. 
From a security perspective, researchers developed various 
techniques targeting privacy concerns focused on personal 
data. Data anonymization methods attempt to protect person-
ally identifiable information. k-anonymity, a common property 
of anonymized datasets requires that sensitive information of 
each record is indistinguishable from at least k —1 other records 
[241. Related extensions to k-anonymity include I-diversity, 
which ensures the sensitive data is represented by a diverse 
enough set of possible values [151; and t-closeness, which 
looks at the distribution of sensitive data [14]. Recent research 
has demonstrated how anonymized datasets employing these 
techniques can be de-anonymized [18], [5], given even a small 
amount of data points or high dimensionality data. Other 
privacy-preserving methods include differential privacy, a tech-
nique that perturbs data or adds noise to the computational 
process prior to sharing the data [7], and encryption schemes 
that allow running computations and queries over encrypted 
data. Specifically, fully homomorphic encryption (FHE) [9] 
schemes allow any computation to run over encrypted data, 
but are currently too inefficient to be widely used in practice. 
In recent years, a new class of accountable systems 
emerged. The first such system was Bitcoin, which allows 
users to transfer currency (bitcoins) securely without a cen-
tralized regulator, using a publicly verifiable open ledger (or 
blockchain). Since then, other projects (collectively referred 
to as Bitcoin 2.0 [81) demonstrated how these blockchains 
can serve other functions requiring trusted computing and 
auditability. 
Our Contribution. I) We combine blockchain and off-
blockchain storage to construct a personal data management 
platform focused on privacy. 2) We illustrate through our 
platform and a discussion of future improvements to the 
technology, how blockchains could become a vital resource 
in trusted-computing. 
Organization. Section II discusses the privacy problem we 
solve in this paper, section III provides an overview of the 
platform, whereas section IV describes in detail the techni-
cal implementation; section V discusses future extensions to 
blockchains, and concluding remarks are found in section VI. 
EFTA01612898
