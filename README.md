# Front-end Boilerplate using Sass and Gulp 4, Bootstrap 5.2 and Panini
A starter frontend boilerplate; modified from [thecodercoder's workflow]https://github.com/thecodercoder/frontend-boilerplate to include Bootstrap 5.2 and Panini.

# Main packages
Gulp, Sass, Panini + BrowserSync

# Commands
* Run `npm install`
* Run `gulp bs` 
 
# Issues / Todos
* Bootstraps javascript bundle is concatenated into the final destination script by combining the previous task's output. There are three separate javascript tasks. I would like to be able to import individual bootstrap modules, but I can't figure this out yet :( . The issue appears to be with CommonJS module import vs ES Module and may require another javascript bundler.
 