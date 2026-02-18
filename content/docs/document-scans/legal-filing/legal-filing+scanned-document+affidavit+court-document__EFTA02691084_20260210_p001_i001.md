---
source_image: "legal-filing+scanned-document+affidavit+court-document__EFTA02691084_20260210_p001_i001.png"
source_pdf: "EFTA02691084.pdf"
method: pdf_text
words: 745
confidence: 1.00
extracted: 2026-02-13T17:09:20.433173
---

ATorus, LLC Backtest & Trading Assumptions 
Entry/Exit Time: Positions are closed over a five day period with an equal amount of shares/contracts sold 
per day. After being at zero exposure for one period and provided the system has a new price direction 
signal the new position is entered over an equivalent five day period. Given the targeted return profile 
(20+ days of realized volatility, which only occurs over longer term intervals of time). we find averaging in 
over these 5 period intervals increases the probability of a better entry price in contrast to putting on all 
the exposure in one period (i.e. full exposure trade time / median targeted return profile). Additionally, this 
greatly expands the liquidity pool, which further enhances the ability to scale the strategy. 
Price Data: All listed equity prices are VWAP prices for the day. Index and credit data is based on close 
prices. We view VWAP as the true price where a position of size can realistically be expected to be 
transacted at. An added benefit, by committing to a certain size VWAP order for the day. the fund can 
benefit in lower transaction costs or even receive a net credit. On the first trade date of a new signal we 
always wait until midday to determine whether to begin executing the order. Specially, once we have 
seen half a trading interval occur, we can calculate the probability of where VWAP will be end of day. 
which is the price that inputs into the system to determine a trade signal. 
Position Sizing: Positions are sized based upon the amount of dollar risk allocated to the portion of the 
book (global macro instruments or listed equities) than multiplied by the respective maximum portfolio 
target loss (in this case 10%) then multiplied by the current position's realized vol times a factor (7X) and 
divided by the total amount of positions in the portfolio, and finally multiplied by an initial leverage target 
(2X). This approach allows every position, at least at inception, irrespective of dollars allocated to have 
equivalent potential NAV impact to the fund (e.g. higher vol names receive lower dollar amounts of 
exposure, while lower vol names receive higher dollar amounts of exposure) 
Directional Bias: The directional risk is determined by the system on each individual position in isolation. 
Directional bias is not determined, nor are positions resized, based up assumed cross asset correlations 
or the overall portfolio's net exposure at the time. This is a differentiating component of the strategy, 
especially in comparison to 'risk-parity', 'systematic global macro', and 'multi strategy' funds. 
Position Screener. Security characteristics of the listed equity book are based upon a screener that 
begins in 1995. The starting minimum market capitalization is $10B w/ minimum averaged daily dollar 
volume over the preceding 3 months of 2.5% of the $1 OB. The $1 0B threshold appreciates at 7% per 
annum with the relevant 2.5% liquidity parameter being reset to the relevant minimum market cap. The 
screener set to these thresholds, is to eliminate selection bias to small cap equities that appreciated in an 
exponential fashion and generate exceptional outsized returns, in addition to displaying the depth of the 
liquidity pool allowing the strategy to scale markedly. The screen is run on a quarterly basis. The listed 
equities also must be listed in only the following countries: Australia. Hong Kong, Japan. South Korea, 
Brazil, Canada, United States, Austria, Belgium, Finland, France, Germany, Greece, Ireland, Italy, 
Luxembourg, Netherlands, Portugal, Norway, Spain, Sweden, Switzerland, United Kingdom. Once the 
new securities appear, we begin to trade them in accordance with the directional trade signals we receive 
from the system. To the extent the securities no longer meet the market capitalization & liquidity 
thresholds at the next quarter, we still allow them in the portfolio for the subsequent two years. In some 
cases in the event of a merger, bankruptcy, or significant decrease in liquidity the CIO will remove the 
securities. Although we run the screen quarterly, we do not rebalance the portfolio every quarter. Similar 
to utilizing cross asset correlations to determine position weightings, we do not employ a rebalancing 
strategy, but rather let our winners, given MTM gains, dictate our increase/decrease in our exposures. All 
positions continue on their present exposures until such time a new opposing directional trade signal is 
observed. At that time the position sizing is recalculated to reflect the change in fund NAV and the 
number of positions, as described above. 
Private & Confidential 
EFTA_R1_02032430 
EFTA02691084
