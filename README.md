# Roomer

Implemented:

[Current] Feature 5: Profile tab + modify information
- Created profile tab within navbar
- Within the profile page, created sidebar for user to navigate to different functionalities - viewing their own profile, modifying their profile, uploading a profile picture, viewing their matches and "liked" list, as well as logging out.
- Profile picture gets stored to and pulled from MongoDB, and the profile picture is displayed in the profile tab, as well as in grid, detail, and self view. 
- Users can go into their profile tab and modify their information - changes propgated to their self view, grid view, and detail view. 

Feature 4: Authentication + authorization
- Implemented login and logout backend functionality. 
- Now requires successful verification of JWT token in order to login and view other user's info.
- Created "Welcome" and "NotAuthorized" components to help redirect user to login in order to view pages (both components are reactive). 
- Updated media query screen sizes to reflect standard breakpoints.

Feature 3: Moving to MongoDB
- Moved database from db.json to MongoDB

Feature 2: Login + registration forms
- Created new endpoints to get all user's basic data, as well as individual user's basic, housing, preference, and extra info.
- Added (reactive) login and registration form, built off of Bootstrap.  Login form is purely UI, while registration form updates the backend.

Feature 1: Card views
- Reactive navbar.  Currently linking only works via clicking on the Roomer logo.  
- Grid view, displaying each user's basic information.  Also reactive.
- Single card view containing a user-controlled (reactive) slideshow of basic information, preferences, and a short bio.  Numbers and dots indicate which page of the slideshow the user is on.  Scrollbar added in the case of overfill text.

Quick demo:
[![demo youtube video](https://img.youtube.com/vi/SImqPO9U26c/0.jpg)](https://youtu.be/SImqPO9U26c)
