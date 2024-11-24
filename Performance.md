# Performance of WeatherWreck

## Introduction and Methodology
**TO DO**
<!-- Briefly state how you gathered data about app performance, and in what environment 
(which browsers, what browser versions, what kind of device, OS,
width and height of viewport as reported in the console with `window.screen`) -->

<!-- Also report overall impact on whatdoesmysitecost results before and after all your changes -->


## Baseline Performance
**TO DO**
<!-- Summarize initial results for each tool that you used. Did the tools
detect all the performance issues you see as a user? -->

## Areas to Improve
**TO DO**

## Summary of Changes 
**TO DO**
<!-- Briefly describe each change and the impact it had on performance (be specific). If there
was no performance improvement, explain why that might be the case -->

### Change 1 - Fix Database Performance
Lead: Iana Feniuc.
Our database performance is very slow. It fetches too much data which makes it too slow for the first loading operation.
We made the db query (generalFetchEventsAndAccidents) to fetch only 2 results by state. 
This speed up the initial loading time by 2 seconds.

### Change 2 - Inefficient Marker Rendering
Lead: Iana Feniuc.
Rendering a large number of markers on the map caused significant performance degradation, especially on slower devices.
Each marker created adds more computations for rendering, leading to slow interactivity and longer Largest Contentful Paint (LCP) times.
We implemented the MarkerClusterGroup functionality provided by the react-leaflet-markercluster library.
This groups nearby markers into clusters and dynamically updates as users zoom in/out, significantly reducing rendering overhead.

### Change 3 - Inefficient Image Format (PNG)
Lead: Iana Feniuc.
Using PNG images for icons and the loading image resulted in larger file sizes, slowing down resource downloads and negatively impacting page load speed and LCP metrics.
We found the [TinyPNG website](https://tinypng.com/) that transforms PNG images into different formats so we converted all PNG images to WebP, a next-gen image format that offers better compression and smaller file sizes while maintaining image quality. 
Now all the images are transformed into the webp format.

### Change 4 - Uncompressed Text Resources
Lead: Iana Feniuc.
Text-based resources such as HTML, CSS, and JavaScript files were served without compression, resulting in larger payload sizes and slower load times for users.
A simple fix was enabling the Gzip compression in the Express server to compress text-based resources before serving them to clients.

### Change 5 - Uncached Endpoint Responses
Lead: Iana Feniuc.
API endpoints fetching data from the database for rendering the map lacked caching.
This led to repeated database queries and slower response times, particularly for frequently requested data.We implemented caching at the API layer using a key-value store (in-memory caching).
Responses for frequently accessed data were cached and served directly without querying the database. This improved greatly the loading time when fetching data !

### Change 6 - Non-prefetched Critical Resources
Lead: Iana Feniuc.
Critical resources like the favicon and loading image (bob.webp) were not prefetched, causing additional network latency during initial page loads.
We added  directives for these critical resources in the HTML head to prioritize their loading.

### Change 7 - Static Files Served Without Caching
Lead: Iana Feniuc.
Static assets such as CSS, JavaScript, and images were being served without caching, leading to unnecessary network requests and increased load times for repeat visitors.
This also affected performance scores, as browsers had to re-fetch unchanged resources.
However, HTML files needed to remain uncached to allow updates when client-side code changed.
The solution was implementing caching for static resources with a 1-year cache duration (max-age=1y) to improve load times for repeat visits while ensuring the HTML files had a no-cache directive for immediate revalidation.

### Change 8 - Unused Libraries
Lead: Youry Nelson.
The previous bundle for this application was marginally larger than expected due to javascript code that seemed to not be used yet still included by the vite bundler, this could result in increase load times.
We narrowed down the issue to the Plotly.js library not having its dead code removed, which resulted in a significant bundle size.
Since we were only use the bar and sunburst charts, it was a waste of space for the whole library to be included in the bundle size.
The solution to this issue was to manually install a section of the library that only included the chart types we needed, and use it instead of the built in plotly library.
![image1](reportImages/image.png)
![image2](reportImages/image-1.png)
![image3](reportImages/image-2.png)
![image4](reportImages/simage-3.png)

### Change 9 - Largest Contentful Paint
Lead: Maara Purici.
In this update, I've implemented lazy-loading for multiple components across the app to improve the initial page load time and optimize the Largest Contentful Paint (LCP) metric.
By lazy-loading components that are not immediately visible or needed, we reduce the amount of resources required upfront, resulting in a faster and more efficient user experience.
Additionally, I made the following optimizations to address potential render-blocking issues that could negatively impact LCP:
1. Removed the import for index.css in main.jsx:
  * I removed the import for index.css in main.jsx because it seemed like this stylesheet contained styles for elements (such as buttons and a tags) that are not actually used or present in main.jsx.
  * This could have been causing unnecessary render-blocking, especially as the browser was still trying to load and apply styles for elements that don’t exist in the component.
2. Removed unnecessary font-family styles:
  * I also removed unnecessary styles related to font-family that were previously defined through out our CSS files.
  * These styles were contributing to the render blocking which wich could have unecessarily delayed text rendering and therefore increase the LCP time.

## Conclusion
**TO DO**
<!-- Summarize which changes had the greatest impact, note any surprising results and list 2-3 main 
things you learned from this experience. -->