# population-scrape

## Setup

```
$ git clone <repo-url>

$ cd <repo-url>

$ docker build -t population-scrape .
```

## Run

```
$ docker run -it population-scrape
```

This will generate a **.csv** file with the population data from citypopulation.de website.

## Extract

```
$ docker cp <container-ID>/app/citypopulation_de-test.csv .
```
