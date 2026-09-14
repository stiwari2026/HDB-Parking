# Assessment

## Q1 — Where did the agent make you faster, and by how much?

The designing of the app's interface, along with how the app integrated the same data specifically for heavy vehicles, which required the separation of heavy vehicle parking from regular parking. This would have taken hours if not days if not for the help of Google AI Studio.

## Q2 — Where did it cost you time, and whose fault was that?

Figuring out why the live data was not working on the app took me the most time. This is despite me being careful with the steps in including the API callback on GitHub. I did an API health check; it showed that `keyConfigured` was false but `upstreamStatus` was 200, which means there was a minor blockage somewhere. After a couple of exchanges back and forth, it got fixed. I am very sure it was my own mistake, committed within the master prompt, where I must have misspecified this detail.

## Q3 — Did it ever hand you something that looked right and was not?

The map on the app looks far from the real Singapore map, together with missing areas of Singapore that are somehow not found on the app. To a person without real knowledge of Singapore, he or she might believe the app — but definitely not someone who knows the real Singapore geography.

## Q4 — What did you have to know in order to supervise it?

Seeing the lack of connection between the live data and the app itself made it obvious there was an error. The quick API health check narrowed the error down and let me focus on my prompt.

## Q5 — Which decisions did you keep?

The interface of the HDB Parking Lot Availability app came out okay, though not the best, due to the map orientation. The API refreshes every 60 seconds, hence 60 seconds to refresh the cache was chosen by me.

## Q6 — What does this mean for a team of thirty?

I would have delegated two people to verifying the master prompt itself. Sometimes a tiny misstatement in the master prompt causes a hindrance to producing the desired output. The solution does not need to be complicated: proper human intervention before applying an AI tool is more than enough to prevent silly issues. Having someone else vet the prompts may be very simple, but it follows the principle that an independent check of one's work is essential for quality control.
