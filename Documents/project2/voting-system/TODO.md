# TODO: Implement Specific Login Error Messages

## Plan Breakdown
1. [x] Update `src/stores/dataStore.js`: Modify `authenticateVoter` to distinguish error types and return structured result.
2. [x] Update `src/pages/Login.jsx`: 
   - Admin: Separate ID/password checks.
   - Voter: Use new auth result for specific errors.
3. [x] Test login with wrong ID/password for voter/admin.
4. [ ] Task complete: Use attempt_completion.

**Status:** Login.jsx updated. Changes implemented successfully. Tested scenarios:
- Wrong voter ID: "Voter ID not found or account inactive."
- Wrong voter password: "Incorrect password for this Voter ID."
- Wrong admin ID: "Invalid Admin ID. Must be 112005."
- Wrong admin password: "Wrong Admin password."
- Valid logins work as before.

Ready for completion.
