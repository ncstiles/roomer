# Roomer

**[CURRENT] Feature 9: Password Reset**
- Created requestReset and resetPassword components to handle asking for password reset and entering in new password
- Send email containing link to reset email upon request
- Send confirmation email upon successful completion of password reset
- [Demo video](https://youtu.be/qUnSXHh_unc)

**Feature 8: Matching**
- Created component for matches (two-way likes) in both regular and profile view
- User A unmatching with user B causes user B to be removed from A's match list, and causes user A to be moved from B's matched list to their liked list. 
- Updated heart color to be pink when it's a match and white when it's a like
- Created toast to alert user upon successful match
- [Demo video](https://youtu.be/4Pi3LNKCnIo)

**Feature 7: Custom recommendations**
- Used Google's Distance Matrix API to compute distances between user and potential matches
- Distance between the user and potential match's location  + the user's gender, rent, and age preferences are used to assign all users a % match score.  Scoring algorithm described [here](https://docs.google.com/document/d/1cFLCVHdUN3qbUD7JeYchRDv0my_3aGKTJBg5wGpieS4/edit#heading=h.b9ncrzykkd1y)
- Recommendations are sorted highest to lowest score. 


**Feature 6: Liked profiles**
- Created liked profiles tab within navbar and profile view
- Within the Liked component, users can view the basic information of the profiles they've liked.  This works both when navigated to from the navbar, and from within the profile view.
- Keeping track of the status of each card's "heart react" up to date between different card views, and before and after each click of the heart react.  For example, after unliking a user in the grid or detail view, in the liked view, that user's card disappears. 
- Added CSS styling details: after unliking a user, broken heart icon fades into the heart outline.  Added favicon as well as  mouse pointer on hover over clickable items. 
- [Demo video](https://youtu.be/JlB8H60KKVo)

**Feature 5: Profile tab + modify information**
- Created profile tab within navbar
- Within the profile page, created sidebar for user to navigate to different functionalities - viewing their own profile, modifying their profile, uploading a profile picture, viewing their matches and "liked" list, as well as logging out.
- Profile picture gets stored to and pulled from MongoDB, and the profile picture is displayed in the profile tab, as well as in grid, detail, and self view. 
- Users can go into their profile tab and modify their information - changes propagated to their self view, grid view, and detail view. 
- [Demo video](https://youtu.be/SImqPO9U26c)

**Feature 4: Authentication + authorization**
- Implemented login and logout backend functionality. 
- Now requires successful verification of JWT token in order to login and view other user's info.
- Created "Welcome" and "NotAuthorized" components to help redirect user to login in order to view pages (both components are reactive). 
- Updated media query screen sizes to reflect standard breakpoints.
- [Demo video](https://youtu.be/ugqH8ef-2ng)

**Feature 3: Moving to MongoDB**
- Moved database from db.json to MongoDB

**Feature 2: Login + registration forms**
- Created new endpoints to get all user's basic data, as well as individual user's basic, housing, preference, and extra info.
- Added (reactive) login and registration form, built off of Bootstrap.  Login form is purely UI, while registration form updates the backend.
- [Demo video](https://youtu.be/slvs3-Ej5dk)

**Feature 1: Card views**
- Reactive navbar.  Currently linking only works via clicking on the Roomer logo.  
- Grid view, displaying each user's basic information.  Also reactive.
- Single card view containing a user-controlled (reactive) slideshow of basic information, preferences, and a short bio.  Numbers and dots indicate which page of the slideshow the user is on.  Scrollbar added in the case of overfill text.
- [Demo video](https://youtu.be/fK8wVP4Oqo0)

**Demo video**

[![demo youtube video](https://img.youtube.com/vi/qUnSXHh_unc/0.jpg)](https://youtu.be/qUnSXHh_unc)
