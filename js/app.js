// Place third party dependencies in the lib folder
//
// Configure loading modules from the lib directory,
// except 'app' ones, 
requirejs.config({
    "baseUrl": "js/lib",
    "paths": {
      "app": "../app",
      "jquery": "//code.jquery.com/jquery-3.3.1",
	  "jquery.ui": "//code.jquery.com/ui/1.12.1/jquery-ui"
    }
});

// Load the main app module to start the app
requirejs(["app/main"]);