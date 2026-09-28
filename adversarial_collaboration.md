# adversarial_collaboration.md

Sanesh Tiwari, Group 6
predictions.md committed at Saturday 26 September 2026, 1:21 AM; first comment for this set on my
board at Saturday 26 September 2026, 10:26 PM

## The four-way table

Raised by: KS = Kartik Surugucchi, SS = Sean So, KCH = Kevin Christianto Husein.
My expected finding 1 covered two problems (the drawn map, and the missing carparks), so it appears twice below.

### 1. Found by both

- Many HDB carparks missing from the map | raised by KCH | my severity 3, theirs 3
- "Nearest" distance not measured from the visitor's location | raised by SS | my severity 3, theirs 3

### 2. Found by them, missed by me

- Comment section crowds out the map | raised by KS, KCH | theirs 4, 3 | arbiter NOT TAKEN
- Most carparks not in the live feed, but shown as "live" | raised by SS | theirs 4 | arbiter NOT TAKEN
- "Drive to" button shows a banner but gives no directions | raised by SS, KCH | theirs 3, 3 | arbiter NOT TAKEN
- Lot and carpark counts on the same screen are unclear | raised by KS | theirs 3 | arbiter NOT TAKEN
- Carpark code "BS14" shown where a place name should be | raised by KS | theirs 2 | arbiter NOT TAKEN
- Several refresh controls for the same action | raised by KS | theirs 2 | arbiter NOT TAKEN
- After a failed sync, figures still look live | raised by SS | theirs 2 | arbiter NOT TAKEN
- Live Sync can be pressed repeatedly while running | raised by SS | theirs 1 | arbiter NOT TAKEN

### 3. Found by me, not by them

- Update times mix two formats ("1 min ago" and "Live 01:02:03") | my severity 2

### 4. Found by both, rated differently

- Map is a drawing that does not match Singapore's shape | raised by KCH | my severity 3, theirs 2 | arbiter 2

## My predictions, checked

- Expected finding 1: HELD, KCH 2 (map shape) and KCH 3 (missing carparks) beside my 3, because Kevin raised both halves of it, rating the map shape a point lower than I did.
- Expected finding 2: HELD, SS 3 beside my 3, because Sean found that the "YOU ARE HERE" point and the "Nearest" distance are the same for every visitor.
- Expected finding 3: BROKE, nobody raised it beside my 2, because no groupmate mentioned the mixed time formats.
- The heuristic I named as my product's worst: BROKE, because more findings (4, including the only 4 given under a single heuristic by SS) fell under #1 Visibility of System Status than under #2 Match Between the System and the Real World (3).
- The finding that would show my evaluation was wrong: NOT RAISED, because Kevin did raise the missing carparks at severity 3, so the condition I set (nobody raising it at 3 or higher) did not happen.

## Q1. Where was confirmation bias in my own evaluation?

The comment section squeezing the map was on my first list of possible findings, but I swapped it out of my predictions for problems with the map and the data. I had added that section myself, so I saw it as part of the page rather than as a problem with the product. Two of my three groupmates raised it straight away, at severities 4 and 3. I kept the findings about the parts I thought of as "the product", and dropped the one about the part I had just added.

## Q2. Which prediction broke, and what did it teach me?

Two predictions broke. The first was the mixed time formats ("1 min ago" next to "Live 01:02:03"), which nobody raised. The second was my claim that #2 Match Between the System and the Real World was my worst heuristic. More findings, and the only severity 4 from someone who tested the data, fell under #1 Visibility of System Status. I had judged the product by what the screen says. My groupmates judged it by whether the screen tells the truth about what the system is doing: which figures are really live, what happens when a sync fails, and what each number counts. That taught me to test behaviour, not only wording.

## Q3. Which groupmate finding did I nearly dismiss, and what did the evidence say?

I nearly dismissed Sean's finding that most of the carparks on my map are not in the live feed, because the banner said the sync had succeeded. When I checked the code, all 20 carparks and their lot figures are built into the app. Only carparks whose codes happen to appear in the feed are ever updated, and the rest keep the same numbers on every reload. After I labelled each carpark as live or sample data, my own live site showed "LIVE: 3 of 20 carparks", the same count Sean found. Sean was right, and the old "EPS LIVE FEED" label had hidden it.

## Q4. What did I revise, which heuristic does it serve, and how do I know it worked?

I made two revisions, one for each finding rated 4.

The first serves #8 Aesthetic and Minimalist Design, for the comment section crowding out the map (Kartik 4, Kevin 3). I first made the comments collapsible. When my coding agent argued against that repair, it pointed out that the map shrank again as soon as the comments were opened, because the page was locked to one screen height. So I replaced it with a scrolling layout: the header and map now fill exactly one screen, and the comments and footer sit below it. I know it worked because I measured the map area. On a 375 × 812 phone it went from 104 px to 612 px, and on a 1280 × 800 desktop from 509 px to 633 px. On both, the comments start exactly at the bottom edge of the screen.

The second serves #1 Visibility of System Status, for carparks shown as live when they are not (Sean 4). Each carpark is now marked live only when the feed returns figures for it. The header says how many are live, and every other card says "Sample data, not live" instead of "Last sensor ping: 1 min ago". I know it worked because the live site now reads "LIVE: 3 of 20 carparks • rest are sample data", and the BS14 card, which is not in the feed, says "Sample data, not live".

## Q5. What did my users give me that I could not have found myself?

Each groupmate found something I had not looked for. Kartik noticed that "2678 lots", "All (20)" and "Carpark List (5)" sit on one screen without saying what each one counts. Sean compared every pin against the live feed and forced a failed sync, which showed the figures still looking live. Kevin and Sean both pressed "Drive to" and found it only shows a banner. I built these screens, so I knew what every number meant and never expected the button to do more.

## Q6. Did the AI help me confirm, or help me falsify?

Both. The AI helped me falsify when it read my code and pointed out that the "Nearest" distances are fixed numbers, not measured from the visitor, which went against my own belief that the feature worked. It also shaped what I confirmed. It suggested my starting predictions, and it set the height of the comment section that my groupmates later rated as the worst problem. From now on I will use it to look for evidence against my product, and check its suggestions against real users.
