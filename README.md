App made for testing dot density web maps. [Check it out](http://wpears.github.io/dotdensity)

Uses [census tracts](ftp://ftp.census.gov/) and [HMDA](http://cfpb.github.io/api/hmda/index.html) data. HMDA data is composed of successful mortgage applications from 2007 - 2013.

The census tracts are not quite small enough to capture any enclaves in Yolo county (some exist, such as [Yolo and Madison](http://en.wikipedia.org/wiki/Yolo_County,_California#2011), but these are too small and have too few mortgages originated to be seen. Their points get scattered across the larger tracts). Also, the renderer is surprisingly slow, requiring nearly a second if each mortgage is shown as a point. Usability gets traded away pretty quickly as more points are shown.

That said, with the current parameters, you can pick out the obvious trends:
* More mortgages in denser, urban areas.
* Most successful mortgage applications by whites.
* Largest concentration of hispanics (of any race) in Woodland, Asians found most numerously in Davis and West Sacramento.

Again referring to the [county's demographics](http://en.wikipedia.org/wiki/Yolo_County,_California#2011), one can see that whites compose a larger proportion of originated mortgages than population (non-hispanic whites make up ~50% of Yolo county's population, but account for ~70% of its originated mortgages). The trend is reversed for hispanics, who compose ~30% of Yolo county's population but only ~15% of its originated mortgages. Comparing this map with a separate dot-density view of Yolo's population would likely show this quite prominently.

General advice for dot-density maps would then be to find data in small enough geographic blocks relative to your total map area and find data with enough variation that the render time of this map is justified (and I'd stay away from using dot-density for a single classification; just use polygons)