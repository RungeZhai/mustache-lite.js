# mustache-lite.js

A lightweight implementation of [mustache.js](https://github.com/janl/mustache.js)

## What is this?

The gorgeous [mustache.js](https://github.com/janl/mustache.js) is a masterpiece out of question. But the source code up to now is more than 600 lines and the minimized file is still more than 9KB. I think with the advantage of regular expression, it should have another way, a more clear way, to implement it. So here it is.

I have now just implemented basic features. The features that are not supported **yet** are:

* Custom Delimiters ✘
* comments ✘
* Partials ✘
* Pre-parsing and Caching Templates ✘
* Modularity ✘

Up to now the source code is only 2.6k with 96 lines of code. It is minimal runable. This project is still in progress but if you don't need the features above, it is complete.

## About performance

Because this implementation uses full scope regexp, so the larger the template is, relatively the slower it is.