# Watchgate Dashboard (React Web)
Dashboard to see the status of Android phones with [watchgate_android](https://github.com/binokaryg/watchgate_android) and perform some actions.

This app depends on MongoDB stitch app whose ID must be eventually set in [`App.js`](src/components/App.js)

```
15: //TODO: add your MongoDB stitch app id here
16: let appId = WATCHGATE_APP_ID;
```
*Note: No need to update it in the App.js file yourself, if you are using docker (see below):*

### Using `docker-compose`
If you are using the project's [docker-compose](docker-compose.yml) file, you can specify the app ID in the following section:
```
9:      args:
10:        #replace your-app-id below with the actual ID
11:        - WATCHGATE_APP_ID=your-app-id
```
Change the port if required:
```
 ports:
      - 3001:80
```

Then, `docker-compose up`

### Using `docker run`

If you are using `docker run` with the project's [Dockerfile](Dockerfile), the app ID can be passed as a build argument:
```
docker run -it --rm -p 80:80 -e WATCHGATE_APP_ID=your-app-id watchgate
```



Inspired from https://www.creativebloq.com/how-to/create-a-dashboard-app-with-react

