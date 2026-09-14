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
