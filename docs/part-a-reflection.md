Part A: Math and Logic Reflection

How I did the math and why: I used US Dollars as the main base. To get the final number, I just took the expense amount and divided it by that currency's exchange rate. I did it this way because the list of rates they gave me was based on 1 USD. After dividing, I added a rule to round the final answer to exactly two decimal points so it looks like real money. This way is super simple, and to get the big total, the app just adds all the new USD numbers together.

What happens if we add a 25th currency tomorrow?
It is very easy and I would not need to change any of the math code. All I have to do is add the new currency name and its rate to our main list. Because the app reads directly from that list, the new currency will automatically show up in the dropdown box and calculate perfectly.

What happens if an exchange rate is missing, and how to fix it:
If an exchange rate is completely missing or broken, the math will get confused and try to divide by nothing. This would cause an error, and the big total at the top of the screen would just show "NaN" (Not a Number). To fix this, I would add a backup rule. The rule would tell the app: "If you cannot find the rate, skip this expense so the total does not break, and put a red warning next to it so the user knows to fix it."
