# AngularAssbook

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.5.

This final exercise will be an expansion of the exercises we’ve been doing during this unit. Use week 10 exercise as a starting point.

Web services are the same as in unit 1, with some additions like Google or Facebook login -> https://github.com/arturober/assbook-services

## Progress

🖤 = to do 🩷 = complete

# Not authenticated routes

## auth/register

This page will contain a form for the user to register. Create the same form used in unit 1 project and validate it: all fields are required, email fields must be of type email, and password must have at least 4 characters.__

Also, create a validator that validates that both emails are equal. Put the error message for this validator below the “repeat email” input (with the corresponding css class for that input). You can create a group validator to check both values, or just create a normal validator that you put on the second email field and receives the first email field as the input value.

Don’t forget to geolocate the user and send the coordinates to the server.

## auth/login

This page will contain a page with a form to log in (email, password) and the Google and Facebook buttons for login/register. Validate the form (all fields required).

Also geolocate the user here and send the coordinates with the login information (lat, lng). This includes the normal login and also Google/Facebook login.

# Authenticated routes

## posts

This page will show all posts (like in previous exercises). Use the same card you used in unit 1 project.

In the card (important  if the post is yours):
• Put the button to delete the post (this will show a confirm dialog asking if you’re sure you want to delete it using ngBootstrap).
• Put a button to edit the post. The edit button will go to /posts/:id/edit.

Also show the nav-bar with an input to filter posts by title and description.

You can use signals to filter the posts (+0,25) instead of a pipe.

## posts/:id

Like in unit 1 project, this page will show the details of a post (:id). Deleting the post from here will redirect to /posts.
There will be a form to create a new comment (see unit 1 project). The avatar and name of each user in the comments will be a link to their profile page. Comments are mandatory in this project.

## posts/add

This page will contain the form to create a new post. Like in exercise 4, validate the form and don’t let the user send it until it’s valid.

Like in unit 1 project, let the user choose if he/she wants to upload an image or an address (map), with latitude and longitude. The address field will also be checked in the group validator created in exercise 4. A post should contain at least a title, a description, an image, or an address.

## posts/:id/edit

Will edit a post. You must reuse the component to add a post (post-form). For example, if you don’t receive an id, add a new post. But, if you receive an id, edit the post (showing the current info in the inputs). Also change the submit button text.

## profile/me - profile/id

Like in unit 1 project, this page will show an user’s profile information. If you don’t receive an id, show the current logged user, otherwise show the user with the id. Both routes will reuse the same component (profile-page).
Show also a map (and a marker) with the user coordinates.
Show the edit (image, profile, password) buttons only if the profile is yours (logged user).
In this component, put also a link that will show the following:
• User’s posts Will go to the /posts page but sending a query param named creator Example: `/posts?creator=49`
To send query parameters to a route in a link, use the queryParams attribute: `<a [routerLink]="['/posts']" [queryParams]="{ creator: user.id }">...</a>`
This link will generate the following route (example: the user id is 30): `/posts?creator=30`
Use an `@Input()` in the posts-page component to get the value. Keep in mind that this value is optional (maybe it’s not present). Also use a setter to control when the value changes because you could go from this page to the /posts route (top menu link), and Angular won’t reload the component because it’s the same route, so you must check in the setter if there’s a creator or not.
`@Input({ transform: numberAttribute }) set creator(creator?: number) {
// Check if there’s a creator value
}`
The logic will be the following:
• If the 'creator' parameter is no received, load all the posts (`GET /posts`).
• If the creator parameter is received. Load only the posts this user has created (`GET posts/user/:id`)
When you’re loading a user’s posts, put something at the beginning of the page (a header for example with some CSS) that shows these are specific posts.
Example `<h2>Posts created by Pepito Pérez</h2>`
In order to get and show the user name (you only have the id), you can call the service that returns the user profile information.

# Interceptors
You must use an interceptor to insert the authentication token in every HTTP request to the server (See here: `https://fullstackpro.es/angular/servicios`), and another to set the base url for the server (already done in past exercises).

# Services

## Auth service

This service will manage all operations related to login / register.

## Posts service

All operations related with posts (including comments).

## Profile service

Operations related with users (profile).

# Authentication
• AuthService: This service will perform the login (storing the authentication token) and logout (removing the token) actions, and will contain the following attributes and methods:
    ◦ `#logged: WritableSignal<boolean>` By default `false`. Will indicate if the user is logged in or not. Create a getter that returns this signal in read-only mode.
    ◦ `login(data: UserLogin): Observable<void>` Will check the login against the server. If login goes ok, save the token in the Local Storage and set logged to true.
    ◦ `Logout(): void` This method will remove the token from the Local Storage, set this.logged to false.
    ◦ `isLogged(): Observable<boolean>`.
▪ If the this.logged property is false and there’s no token in Local Storage, return `Observable<false> of(false)`. Import the of function from `rxjs`, it returns an observable with that value.
▪ If the this.logged property is true, return `Observable<true> of(true)`
▪ But if it’s false and there’s a token, return the call to the auth/validate service (Observable). Inside the pipe method:
• If there's no error (map function), change this.#logged to true and return true
• If there's an error (catchError function), remove the token from local storage (not valid), and return of(false). The catchError function must return the value inside an observable.
    ◦ Other methods Implement other methods for user registration, login with Google (send credentials with lat and lng) and Facebook (send accessToken with lat and lng). If you think you need to implement anything else, do it

## Showing/hiding menu when login/logut
In the Menu component, show only the menu links when the user is not logged. Create a computed signal with the same value as the logged signal in the AuthService service. The logout functionality is also handled by this component. Call `AuthService.logout()` to remove the token.

# Guards
Create 2 guards for controlling authenticated routes:
• LoginActivateGuard Use it in every route except for auth routes. Will return the call to `AuthService.isLogged()`. In the map function:
    ◦ if the user is not logged (false), return a redirection (urlTree) to /auth/login page.
    ◦ If the user is logged (true), return true. You can go to the route.
• LogoutActivateGuard Use it only for the auth/ routes. Will return the call to `AuthService.isLogged()`. In the map function:
    ◦ if the user is logged (true), return a redirection (urlTree) to /posts.
    ◦ If the user is not logged (false), return true. You can go to the route.
Also, use the leavePageGuard with 'posts/add', 'posts/edit/:id' and '/auth/register' routes. Only ask the user if the he/she has changed something in the form (dirty), or if the data has not been saved yet. Use ngBootstrap modal to ask the user.

# Marks

## Compulsory part
• Registration and login, including Google and Facebook login (2 points)
• Showing posts, including the option to show only posts that a user has created `'/posts?creator=24'` (1,5 points)
• Post cards are correct, updates the number of likes and have the delete and edit buttons when necessary, and work ok (0,5 points).
• Post details, including comments (1,5 points)
• Creating / updating an post (1,5 points)
• Show and edit profile ( 2 points)
• Code, structure, good programming practices, reusing components (post-card, post-form, …). Routes, interceptors, resolvers and guards work ok (1 point)

## Optional
This parts add extra points. Only valid when the base mark is at least 7.
Maximum mark in the project is 12.

• Using Reactive Forms instead of Template Forms (0,5 points).
• Add animations, including transitions between routes with Angular Animations (up to 1 point)
• Create a server-side rendered app that works. (up to 0.5 points)
• Implement that a user can follow another user (up to 1point)
    ◦ In the profile page of other users (not you), check if you're following him/her. Call the service GET -> /users/:id/follow. It should return an object with a boolean in this format: `{ "following": true }`
    ◦ show a button to follow or unfollow that user (you can use an icon that changes color, etc.).
    ◦ If you're not following the user, call POST -> /users/1/follow (empty body) to follow the user
    ◦ If you're following him/her, call DELETE -> /users/1/follow to unfollow
    ◦ In your profile page show the users that you follow (`GET /users/me/following`) and the users that follow you (`GET /users/me/followers`). Use ngBootstrap navs to show followers and following in different sections.
        ▪ Show the avatar and name, and clicking on a user will go to his/her profile page.