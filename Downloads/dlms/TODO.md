# Fix `.split()` Error & Refine Form Validation

## Plan

- [x] 1. Analyze error root cause and audit all forms across codebase
- [x] 2. Fix `AppContext.jsx` — normalize `learnerName` → `name` in `addLearner`
- [x] 3. Fix `AdminApplications.jsx` — guard undefined `row.name` + add validation to Edit/Add dialogs
- [x] 4. Fix `Register.jsx` — add full form validation (name, email, phone, nationalId, password)
- [x] 5. Fix `AdminVehicles.jsx` — add validation (plate number format, required fields)
- [x] 6. Fix `AdminInstructors.jsx` — guard `name[0]` + add validation
- [x] 7. Fix `AdminSchedule.jsx` — add validation (required fields, date not in past)
- [x] 8. Fix `LearnerSchedule.jsx` — add validation (date not in past)
- [x] 9. Refine `LearnerApply.jsx` — align validation with other forms
- [ ] 10. Smoke-test in browser

