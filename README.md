# Urlshortener Microservice

My solution for one of the tasks from [freecodecamp](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice). This task involved creation of simple timestamp microservice according to the given guidelines that can be found in the above link. The solution is currently available on [my website](https://urlshortener.profresor.net).

## Setup

First, creation of your own <i>.env</i> file is required based on [<i>sample.env</f]() file.

Next, a setup.sh file in setup folder needs to be run. It's purpose is preparing the docker volume containing database with table and a user who can use it.

Finally, icro service can be run using the following command run from the project main directory:
```
sudo docker compose up -d
```

As the result, the microservice will be available at 127.0.0.1:10002.

## Description

The documentation of the application endpoints can be found under [<i>/api/docs</i>](https://urlshortener.profresor.net/api/docs).

NOTE: Remember to update the paths to conform to file layout on your machine in [<i>compose.yaml</i>]().