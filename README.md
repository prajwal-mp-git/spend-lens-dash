Spendlens Expense Dashboard

What this project does?

This is a simple dashboard to help the Spendlens finance team track expenses. Instead of someone manually checking exchange rates on Google, this app takes expenses in different currencies and automatically turns them into US Dollars. It shows the total money spent and which categories are costing the most. It also features a searchable table and an export to CSV function to help the finance team with reporting.

How to run it on your computer?
1. Download or clone this folder to your computer.
2. Open your terminal and go into the folder.
3. Type npm install and press enter to get everything ready.
4. Type npm run dev to start the app.
5. Open the local web link it gives you in your browser.

Live Website: [https://spend-lens-dash.lovable.app]

What the files do?

/src/components: This folder has the visual parts of the app, like the tables, buttons, and the form.
/src/lib: This is where I put the fixed list of exchange rates and the 20 sample expenses.
/src/App.jsx: This is the main file that holds everything together and does the math.
/docs: This folder has my notes about the project.

Things to fix with 4 more hours?
1. Saving data: Right now, if you refresh the page, any new expenses you added will disappear. With more time, I would connect this to a real database so the data saves permanently.
2. Phone screens: The big table looks a bit crowded if you look at it on a very small phone screen. I would fix the design to make it scroll better on mobiles.
3. Live rates: The exchange rates are fixed numbers right now. I would want to connect this to an online service that grabs the fresh rates every single morning.

Things you should know?
1. I built this assuming we only want to see the final totals in US Dollars.
2. I assumed people will only enter normal numbers for the amount (the form blocks letters).
