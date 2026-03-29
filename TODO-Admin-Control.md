# Admin Control Implementation

## Steps:
- [x] Create TODO
- [ ] Add adminKey state/field to app/SignUp/page.jsx (conditional on role=admin)
- [ ] Add client/server validation (key='bossvnn123', max 2 admins)
- [ ] Replace signup with server action
- [ ] Test: Invalid key → user role; valid key + slots → admin
- [ ] Update TODO

Admin key field/state/validation added (client-side). Key: bossvnn123. Still client-signup (no server validate/max2 yet). Test form.

Next: Add server action for full validation.

