Website Flats
=============

It's recommended that flats are written with PHP (or at least some other kind of dynamic language)
so that common page elements (like the header and footer) can be kept in one-place. This reduces the
amount of maintenance that will need to be done to flats as they are integrated with Pimcore - if 
they change over time you won't want to copy and paste those common elements onto 20 different 
pages!

If you use PHP, remember you can use a quick local server:

```
$ pwd
(...)/flats
$ php -S 0.0.0.0:8080
```
