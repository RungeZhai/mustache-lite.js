# mustache-lite.js

a lightweight implementation of mustache.js.  https://github.com/janl/mustache.js

## What is this?

The gorgeous [mustache.js](https://github.com/janl/mustache.js) is a master piece out of question. But the source code up to now is more than 600 lines and the minimized file is still more than 9KB. I think with the advantage of regular expression, it should have another way, a more clear way, to implement it. So here it is.

I have now just implemented basic functions. The functions that are not supported **yet** are:

* HTML-escaping ✘
* Custom Delimiters ✘
* function as the value of a section key ✘
* comments ✘
* Partials ✘

Up to now the source code is only 1.9k with 68 lines of code and it only contains 3 functions. It is minimal runable. This project is still in progress but if you don't need the features above, it is complete.

## About performance

Sadly the performance of this implementation is slower(On Chrome it is 1.3 times slower and on firefox8 it can be 5 to 7 times slower). But hopefully the time it consumes for one process is still only a couple of milliseconds.