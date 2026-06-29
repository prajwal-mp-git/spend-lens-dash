8 Ways the App Could Break (Edge Cases)

Before handing this over, I tried to think of all the weird ways a user could break the app. Here is what I found and how we should handle it.

1. Typing negative money

What could go wrong: Someone types "-500" in the amount box to make the total spend go down.

How it handles it now: The number box tries to stop negative signs, but it might not stop a copy and paste.

The correct fix: Add code that checks if the number is less than zero before they can click submit. If it is, show a red error message.

2. Downloading an empty list (New)

What could go wrong: A user types a fake name in the search bar, the table goes blank, and then they click "Export to CSV". The app might break or download a broken file.

How it handles it now: It probably downloads a file with just the headers and no data.

The correct fix: Make the "Export to CSV" button turn gray and unclickable if the table is currently empty.

3. Missing exchange rates

What could go wrong: If the app tries to find the rate for a new currency but it is missing or broken, the math will divide by zero and crash the whole screen.

How it handles it now: The dropdown only lets you pick from the 10 safe currencies we already have.

The correct fix: Write a backup rule so if a rate is missing, the app just skips that single row and shows a "Rate Missing" warning instead of crashing.

4. Crazy huge numbers

What could go wrong: Someone types a billion dollars for a coffee. It makes the total number so big that it pushes the text off the screen.

How it handles it now: It tries to show the whole number, which messes up the design.

The correct fix: Put a limit on how big the number can be in the form.

5. Clicking add too fast

What could go wrong: Someone with slow internet clicks the "Add" button three times in a row, and it charges the company three times.

How it handles it now: It lets you click as many times as you want.

The correct fix: The button should turn gray and lock itself the exact second you click it once.

6. Empty search results (New)

What could go wrong: You search for a merchant we don't have, or filter by a category with zero expenses. The screen just looks blank and broken.

How it handles it now: The table headers stay there, but no rows show up below it.

The correct fix: Show a nice friendly picture or text that says "No expenses found for this search."

7. Currencies without decimals

What could go wrong: Japanese Yen does not use decimals. If we show 50,000.00 JPY, it looks weird to people who use that money.

How it handles it now: The app forces exactly two decimal points on everything so it looks neat.

The correct fix: Add a special rule just for formatting, so it hides decimals for Yen but keeps them for Dollars.

8. Dates from the future

What could go wrong: Someone accidentally picks a date from the year 2030.

How it handles it now: It accepts it and puts it at the top of the list.

The correct fix: The calendar popup should lock dates in the future so you can only pick today or the past.
