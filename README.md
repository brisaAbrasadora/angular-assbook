# AngularAssbook

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.0.5.

This final exercise will be an expansion of the exercises we’ve been doing during this unit. Use week 10 exercise as a starting point.

Web services are the same as in unit 1, with some additions like Google or Facebook login -> https://github.com/arturober/assbook-services

## Progress

🖤 = to do 🩷 = complete

# Not authenticated routes

# auth/register

This page will contain a form for the user to register. Create the same form used in unit 1 project and validate it: all fields are required, email fields must be of type email, and password must have at least 4 characters.

Also, create a validator that validates that both emails are equal. Put the error message for this validator below the “repeat email” input (with the corresponding css class for that input). You can create a group validator to check both values, or just create a normal validator that you put on the second email field and receives the first email field as the input value.

Don’t forget to geolocate the user and send the coordinates to the server.

# auth/login

This page will contain a page with a form to log in (email, password) and the Google and Facebook buttons for login/register. Validate the form (all fields required).

Also geolocate the user here and send the coordinates with the login information (lat, lng). This includes the normal login and also Google/Facebook login.