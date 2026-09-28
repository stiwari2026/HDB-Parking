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
