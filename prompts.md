# Master Prompt — HDB Live Parking by Sanesh Tiwari

The initial prompt given to Google AI Studio at the start of the build.

## Role

You are a senior full-stack developer working in my existing project. Do not rewrite what is already there; add to it.

## Goal

My screen currently shows HDB Live Parking as a hard-coded value. Replace it with real data from `https://api.data.gov.sg/v1/transport/carpark-availability`, fetched through a serverless function of my own.

1. **`api/hdb_parking.js`** — calls `https://api.data.gov.sg/v1/transport/carpark-availability`, returns only the fields my screen needs, and nothing else.
2. **`api/health.js`** — reports whether the credential is configured (`keyConfigured`) and whether the upstream answered, including the HTTP status it returned. It must never print the credential or any part of it.
3. **On the screen**, replace the hard-coded value with the live one, and decide what the user sees in each of these four cases: the data is loading, the data is empty, the upstream refused, and the upstream is unreachable. I want four different sentences, not one spinner.

## Output

- Both functions at `api/` in the **project root**, siblings of `package.json`, never inside `src/`.
- If this project has a server entry file, register the same two routes there too, because that is the shape the preview can answer. If it has no server file, skip that and tell me so rather than inventing one.
- Make sure `package.json` contains `"type": "module"`.

**Before the fetch**, if the credential is missing or empty, return `503` with a message naming the variable, and do not call the upstream at all. A missing variable is sent as the word `"undefined"` and looks exactly like a wrong credential, so stop it early.

**After the fetch**, check `response.ok` before reading the body. A refusal often has an empty body, so calling `.json()` on it throws and my function dies with a `500` instead of telling me what happened. On a non-2xx reply, return the upstream status and a one-line reason in your own JSON.

Cache the response for 60 seconds with `Cache-Control: s-maxage=[N], stale-while-revalidate=[2N]`, matching how often the source actually changes.

In the footer, credit the source in the exact form the provider's licence asks for.

## Guardrails

- Never write the credential into any file, comment or README.
- Never create a variable whose name starts with `VITE_`.
- Never call the upstream from browser code; every call happens inside `api/`.
- Never print the credential, or any part of it, in a response or a log.
- No new npm packages.
- No database, no login.
- Leave every screen I already have working exactly as it is.

## Context

Deployed on Vercel from GitHub. The credential lives only in a Vercel environment variable named `HDB_Parking`.

A real response from the endpoint, called by hand just now, looks like this:

1. `"0 Available"`
2. `"58 Available"`
3. `"3 Available"`

1. `"0 Available"`
2. `"58 Available"`
3. `"3 Available"`

---

## Blind arbiter: distorted Singapore map outline

Run in a new conversation outside the project, so the agent could not tell which reviewer built the product. A coin toss set the order: the arbiter's reading makes Finding A the groupmate's (severity 2) and Finding B mine (severity 3).

### Finding A

- Where: Main screen, Singapore map.
- What I did, what I saw: I looked at the map showing the parking locations, but the visual shape of Singapore did not closely match the actual Singapore map. This made the map look less accurate and slightly confusing when trying to understand where the parking locations were.
- Which heuristic: 2 — Match Between the System and the Real World.
- Screen or system: Screen.
- Severity, and why: 2. The parking information is still visible, but a map should resemble the real geography closely enough for users to understand locations naturally.
- The repair: Adjust the map so that the outline and layout more closely resemble the actual shape of Singapore and place the parking points according to their correct geographic positions.

### Finding B

- Where: Main screen, Singapore map.
- What I did, what I saw: I looked at the map showing the parking locations. It is a hand-drawn drawing, not a real map of Singapore, so the shape and the streets do not match the real country.
- Which heuristic: 2 — Match Between the System and the Real World.
- Screen or system: Screen.
- Severity, and why: 3. A visitor cannot use real streets or landmarks to tell where a carpark is, so they may not recognise their own estate or head to the wrong place.
- The repair: Replace the drawing with a real map of Singapore and place each carpark at its actual position.

### Arbiter's ruling

**1. Is it the same problem?**
Yes. Both reviewers are looking at the same screen and element: the main-screen map, where Singapore's outline doesn't match the real island. Both cite the same heuristic (H2) and propose the same fix. B also describes what the distortion leads to (having to open cards to find out where a point is), but the underlying defect is the same.

**2. The four factors**

Frequency
- What the evidence shows: Both reviewers say the map is on the main screen, so every user sees it on every visit.
- What it can't show: Only 1 of 3 independent reviewers raised it. So although everyone sees the map, not everyone notices the problem or is bothered by it. There is no data on how often users actually rely on the map outline rather than the cards, a list or search.

Cost when it happens
- What the evidence shows: The only cost actually observed is B's. B couldn't tell which town or road a point was in without opening its card. That is an extra step and some confusion. A says the parking information stays visible.
- What it can't show: B's stronger claim, that a driver "may pick one that is further away or in the wrong area," is a prediction. Nobody observed it. It only holds if the points themselves are in the wrong places, and neither reviewer says they checked that. A's repair ("place the parking points according to their correct geographic positions") and B's repair both hint that they might be. If the points are right and only the outline is off, the cost stays at an extra step.

Whether users can learn around it
- What the evidence shows: A workaround exists and B used it: open the card to see the location. A user can learn to trust the cards and ignore the outline.
- What it can't show: Whether heavy vehicle drivers, who have tighter access limits, can afford that workaround while planning a trip. Nobody tested it.

Damage to the product's standing
- What the evidence shows: A says the map "look[s] less accurate." For an app selling live, accurate availability, a map that visibly isn't Singapore could plausibly weaken trust in the data.
- What it can't show: Neither reviewer measured trust, and it's one reviewer's impression. This factor can't be weighted beyond "plausible."

**3. Severity the evidence supports: 2 (Minor)**
Deciding factor: cost. B was right to choose cost as the factor that matters. But the cost the evidence actually shows is an extra tap to open a card, with a workaround that's easy to learn. That is a 2. The cost that would justify a 3 (drivers choosing the wrong carpark) depends on points being misplaced, and nobody has shown that. The 1-of-3 detection rate also argues against rating it higher. This is not a split between A and B. It is A's number, reached because B's case for a 3 rests on something that hasn't been observed.

**4. The observation that would change the rating**
Are the carpark points in their real geographic positions, or only the outline wrong? If points are measurably misplaced (for example, a point shown in the wrong town or on the wrong side of an expressway), the wrong-carpark risk is real and the rating should go to 3.

How to check quickly (under an hour):
1. Pick 10 carparks across different towns.
2. Look up their official coordinates in the HDB carpark information dataset on data.gov.sg (it gives SVY21 x/y values).
3. Compare each point's plotted position with its true position, relative to known landmarks or to the other points.

You could also give 3 to 5 drivers one task: "pick the nearest carpark to [a place you know] using only the map." Then count how many choose wrongly. This would test B's predicted cost directly.

---

## Revision prompts: comment section crowds out the map

Finding: the comment section takes space the map needs (heuristic 8, Aesthetic and Minimalist Design), raised by 2 of 3 groupmates at severities 4 and 3.

### First revision (later replaced)

My prompt:

> Yes please, make it ready for it to be committed

This followed the agent's offer to make the comment section collapsible. The agent made it closed by default, loading Disqus only the first time it is opened. Measured on a 375 × 812 phone, the map area went from 104 px to 384 px with the comments closed.

### Arguments against the repair

My prompt:

> ROLE: You are a sceptical senior developer and usability reviewer working in my existing project. Before you write any code, your job is to argue against the repair I propose.
>
> CONTEXT: Live address, who the product is for, the finding in its six lines, the evidence behind it, the repair I propose.
>
> GOAL: Argue against my repair.
> 1. Does it solve the problem the finding describes, or a problem I already believed I had? Say which, and why.
> 2. Does the problem belong to the screen or to the system, and does my repair sit in the right half?
> 3. Name one heuristic this repair could break while it serves the one above, and how.
> 4. Propose the smallest alternative that would make the same thing true.
> 5. Tell me exactly what to do on the live address to check that the repair worked.
>
> OUTPUT: Your arguments first, as a numbered list. Then stop. Write no code until I reply with the repair I have chosen.
>
> GUARDRAILS: Do not tell me the repair is good. If you have no strong reason to doubt it, say so plainly instead of inventing one. When I do ask you to build, change only what the repair needs. Do not remove Disqus or the privacy notice, and do not break /api/health.

I sent the template with its context lines still blank. The agent asked which finding and repair I meant, and I replied:

> Lets go with "Comment section crowds out the map", looks like the easiest for me to tackle

The agent's arguments, against the collapsible repair already live (it noted that this made the argument come after the code, not before it):

1. **It solves the problem as the groupmates stated it, but only while the section is closed.** The whole page is locked to one screen height (`h-screen overflow-hidden` in `App.tsx`) and never scrolls, so anything added takes space from the map. The moment someone clicks Show comments, the thread takes up to 40% of the screen and the map shrinks again. The repair copied Kevin's suggested fix ("make it collapsible") rather than the cause; Kartik's first suggestion, putting the comments underneath the full map, goes after the cause.
2. **Screen or system: it is a screen problem, and the repair sits on the screen.** No strong reason to doubt this part.
3. **It can break #1 Visibility of System Status.** Closed, the bar gives no sign that comments exist, and Disqus loads only after a click, so a visitor cannot tell whether anyone has commented. Fewer people will open it, which means less feedback. It also leaves a 45 px bar on screen permanently.
4. **Smallest alternative: let the page scroll.** Give the map section a full screen height and put the comments and footer below it. The map is never squeezed, and the thread stays visible to anyone who scrolls. The risk to test is that scrolling the page might fight with dragging the map on a phone.
5. **How to check on the live site:** in Chrome DevTools at 375 × 812, note the height of `<main>` with comments closed and then open; repeat at 1280 × 800; confirm in the Network tab that `embed.js` loads once; confirm `/api/health` still returns 200.

The agent offered three options: keep the collapsible repair, switch to the scrolling layout, or combine them (scrolling plus a comment count on the bar).

### Arguments I turned down

- **Keep the collapsible repair:** turned down, because of argument 1 (the problem returns whenever the comments are open) and argument 3 (hidden comments mean less feedback).
- **Combine scrolling with a comment count on the bar:** turned down. Once the comments sit below the map, there is no bar to put a count on, so it adds work without serving the finding.

### Second revision (live)

My prompt:

> I chose to switch to the scrolling layout in argument 4

The agent wrapped the header, status banner and map in a container exactly one screen tall, let the page scroll, and put the comments and footer below it. It removed the collapse button and the 40% height cap from the comments. Disqus, the privacy notice and `/api/health` were left unchanged. Measured on the built site, the map area went from 104 px to 612 px on a 375 × 812 phone, and from 509 px to 633 px on a 1280 × 800 desktop. On both, the comments start exactly at the bottom edge of the screen.
