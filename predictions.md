# Predictions: HDB Live Parking

Live site: https://hdbparkinglots.vercel.app/

## My predictions

### 1. The map is far from the reality of Singapore's map

- **Heuristic:** #2 Match Between the System and the Real World
- **Expected severity:** 3
- **What I saw:** the map is a hand-drawn drawing, not a real map of Singapore, and the app holds only 34 carparks in total. The real Singapore map is a lot bigger than this, and many HDB carparks are missing.
- **Factor:** impact. A visitor may not find their own estate's carpark, or be able to read real streets.

### 2. The "nearest carpark" is ambiguous

- **Heuristic:** #2 Match Between the System and the Real World
- **Expected severity:** 3
- **What I saw:** the app does not track the visitor's live location, and the distances are fixed numbers. So "Nearest (BS14 – 0.3km)" is the same for everyone. From where exactly is this "nearest carpark"?
- **Factor:** impact. A visitor who trusts it can drive to the wrong carpark.

### 3. Update times mix two formats

- **Heuristic:** #4 Consistency and Standards
- **Expected severity:** 2
- **What I saw:** the built-in data claims "1 min ago" or "Just now", while carparks updated from the live feed show a clock time such as "Live 01:02:03". This may confuse visitors, who'll doubt the reliability of the "live data".
- **Factor:** frequency. Every visitor sees it, but it mostly confuses rather than blocks them.

## Heuristic I think my product breaks worst

#2 Match Between the System and the Real World

## The one finding that would show my evaluation was wrong

If no groupmate raises the drawn map or the missing carparks at severity 3 or higher, my prediction that #2 is my worst heuristic was wrong.

## Findings I already read in the Week 5 studio

None
