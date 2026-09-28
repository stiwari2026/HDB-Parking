# feedback_log.md

Sanesh Tiwari, Group 6
Product: HDB Live Parking, https://hdbparkinglots.vercel.app/

My self-evaluation of the product against Nielsen's ten heuristics, one finding per problem, in the six lines. I evaluated the product on Saturday 26 September 2026 and chose my predictions from these findings (see `predictions.md`, committed Saturday 26 September 2026, 1:21 AM). I wrote this log up on Tuesday 29 September 2026 from that evaluation.

## Finding 1: the map is a drawing, not Singapore's real map

- **Where:** https://hdbparkinglots.vercel.app/, main screen, the Singapore map.
- **What I did, what I saw:** I looked at the map showing the parking locations. It is a hand-drawn drawing, not a real map of Singapore, so its shape and streets do not match the real country.
- **Which heuristic:** 2, Match Between the System and the Real World.
- **Screen or system:** Screen. The map is a drawing built into the page.
- **Severity, and why:** 3. A visitor cannot use real streets or landmarks to tell where a carpark is, so they may not recognise their own estate.
- **The repair:** A real map of Singapore, with each carpark placed at its actual position.

## Finding 2: many HDB carparks are missing

- **Where:** https://hdbparkinglots.vercel.app/, main screen, the carparks on the map and in the Carpark List.
- **What I did, what I saw:** I counted the carparks the app can show. It holds only 34 in total, 20 standard and 14 heavy vehicle, while Singapore has thousands of HDB carparks.
- **Which heuristic:** 2, Match Between the System and the Real World.
- **Screen or system:** System. The carparks come from a fixed list inside the app, not from the data source.
- **Severity, and why:** 3. A visitor may not find their own estate's carpark at all.
- **The repair:** Load the carparks from the data source, or say clearly which carparks are included.

## Finding 3: "Nearest" is not measured from the visitor

- **Where:** https://hdbparkinglots.vercel.app/, main screen, the "Nearest (BS14 - 0.3km)" button and the "km away" line on each carpark.
- **What I did, what I saw:** The app never asks for my location, and the distances are fixed numbers in the app's data. "Nearest (BS14 - 0.3km)" is the same for every visitor, wherever they are.
- **Which heuristic:** 2, Match Between the System and the Real World.
- **Screen or system:** Screen. The page could ask the browser for the visitor's location and work out distances from it.
- **Severity, and why:** 3. A visitor who trusts it can drive to the wrong carpark, and nothing on screen tells them.
- **The repair:** Distances and "Nearest" come from the visitor's real location, and when location is not available, the page says which point it measures from.

## Finding 4: update times mix two formats

- **Where:** https://hdbparkinglots.vercel.app/, the carpark card, the update time line.
- **What I did, what I saw:** Carparks from the app's built-in data said "1 min ago" or "Just now", while carparks updated from the live feed said a clock time such as "Live 01:02:03".
- **Which heuristic:** 4, Consistency and Standards.
- **Screen or system:** Screen. Both formats come from the page's own wording.
- **Severity, and why:** 2. Every visitor sees it, but it mostly confuses rather than blocks them. It may make visitors doubt whether the "live" data is really live.
- **The repair:** One time format for every carpark.

## What happened next

- Findings 1, 2 and 3 were raised by groupmates as well. Finding 4 was raised by nobody. See the four-way table in `adversarial_collaboration.md`.
- A blind arbiter rated finding 1 at 2, not 3.
- Finding 4 no longer appears on the live site. Since the revision, carparks without live figures say "Sample data, not live" instead of a made-up update time.
