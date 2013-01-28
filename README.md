doffy: Depth of Field Calculator
=====


Overview
-----
Doffy is a jQuery calculator plugin computes Depth of Field of specified lens attributes.



Usages
-----
It comes with 2 flavors:

### Non-chainable methods for calculation only
```javascript
$(".act").click(function(){
    //-- Fetch Input
    var focalLength     = 50;   // mm
    var fNumber         = 2.8;  // f
    var coc             = 0.032 // mm
    var focusDistance   = 3000  // mm
    
    //-- Calculate
    var hyperfocal      = $.CalculateHyperfocalDistance(focalLength, fNumber, coc);
    var nearFocusLimit  = $.CalculateNearFocusLimit(focalLength, hyperfocal, focusDistance);
    var farFocusLimit   = $.CalculateFarFocusLimit(focalLength, hyperfocal, focusDistance);
    var dof             = $.CalculateDepthOfField(focalLength, hyperfocal, focusDistance);
});
```

### Chainable methods fetch values from designated elements and populate into its target element
```javascript
$(".act").click(function(){
    $(".hyperfocal").hyperfocal(".focal-length", ".f-number", ".coc");
    $(".near-focus-limit").nearFocusLimit(".focal-length", ".hyperfocal", ".focus-distance");
    $(".far-focus-limit").farFocusLimit(".focal-length", ".hyperfocal", ".focus-distance");
    $(".dof").depthOfField(".focal-length", ".hyperfocal", ".focus-distance");
});
```


Limitations
-----
There are some limitations of current version of doffy you should be aware of. These are the known issues that are bound to be addressed in future versions:

* Does no take into account of extension tube or teleconverter.
* Only calculates in unit of millimeters.



License
-----
Copyright (c) Travis Lin licensed under the [MIT License](https://github.com/rockacola/doffy/blob/master/LICENSE.txt). You are free to use/modify the source code whatever you want, as long as you retain names of contributor(s) of this project.



Changelog
-----
### 1.2.0
* Handles infinity on far focus limit
* Handles macro distance and invalid macro distance (eg/ when focus distance is closer to focal length)


### 1.1.0
* Rewrite of originate doffy and formalised as a jQuery plugin.



Contributors
-----
TBA

