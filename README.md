# mustache-lite.js

A lightweight implementation of [mustache.js](https://github.com/janl/mustache.js)

## What is this?

The gorgeous [mustache.js](https://github.com/janl/mustache.js) is a masterpiece out of question. But the source code up to now is more than 600 lines and the minified file is still more than 9KB. I think with the advantage of regular expression, it should have another way, a more clear way, to implement it. So here it is.

I have now just implemented basic features. The features that are not supported **yet** are:

* Partials ✘
* Pre-parsing and Caching Templates ✘
* Modularity ✘

Up to now the source code is only 3.4k with 122 lines of code and 1.6k after minified. It is minimal runable. This project is still in progress but if you don't need the features above, it is complete.

**Customize delimiters** feature is not fully supported. Another simpler way is introduced: anything that is between `{{%` and `%}}` will be rendered as is.

So

```
{{%{{#key}} <p>%}}

{{{%{{#key}} <p>%}}}
```

will be rendered as 

```
{{#key}} &lt;p&gt;

{{#key}} <p>
```

## About performance

This implementation is faster than [mustache.js](https://github.com/janl/mustache.js) in a single rendering (generally more than 2 times faster). But [mustache.js](https://github.com/janl/mustache.js) has pre-parsing feature and it is overall more than 2 times faster for a template to render a thousand times or so repeatedly. So if you have the needs of rendering the same template multiple times, with pre-parse, [mustache.js](https://github.com/janl/mustache.js) would be a better choice.