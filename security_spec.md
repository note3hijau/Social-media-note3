# Security Specification for IdKanca Firestore Rules

## 1. Data Invariants
- A post can only be edited or deleted by its creator.
- Users can read all posts, but can only create posts as themselves (`userId` matches authenticated `request.auth.uid`).
- Users can read messages sent to/from them.
- Users can create items in the marketplace, but can only edit/delete their own products.
- Friend requests can be created by any logged-in user, but accepted/declined only by the target recipient.
- An escrow transaction is mutable only by the parties involved (buyer, seller, or system admin).

## 2. The "Dirty Dozen" Payloads (Attacks to Block)
1. **Identity Spoofing on Post Create**: Attempt to post with another user's `userId`.
2. **Unauthorized Post Editing**: User A tries to edit content on User B's post.
3. **Privilege Escalation on Signup**: Attempt to save profile as `role: 'admin'`.
4. **Spying on Client Chats**: Unauthorized lookup of message histories between User B and User C.
5. **Unauthorized Message Deletion**: Attacker tries to delete or modify a message after delivery.
6. **Market Price Escalation**: Modifying competitor item catalog price without authority.
7. **Ad-hoc Verified Email Spoofing**: Attempt to write critical records with `email_verified` as fake string or false.
8. **Friend Request Hijack**: Approving a friend request sent to a third party.
9. **Spamming Massive IDs**: Project document creation using a 4KB junk alphanumeric ID.
10. **Escrow Log Tampering**: Modifying the state of an escrow transaction when they aren't the buyer/seller.
11. **Injecting shadow fields**: Attempting to add extraneous attributes to user profile database without validating schemas.
12. **Blanket Query Scraping**: Forcing list fetch on `/notifications` or `/friend_requests` without limiting results to owned entities.

## 3. Recommended Test Scenarios
- Authenticated user reads profile -> true.
- Stranger reads private profile details -> false.
- Authenticated user publishes a post under their own UID -> true.
- Authenticated user publishes a post pretending to be another UID -> false.
