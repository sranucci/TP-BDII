# Assignment for Databases course

## MySQL docker container
Create the container:
```shell
> docker run --name bd2_mysql_api -e MYSQL_ROOT_PASSWORD=mysql -p 3306:3306 -d mysql
```
Credentials of the container: `root:mysql`. 
(optional) To open a mysql shell, execute:
```shell
> docker exec -it bd2_mysql_api mysql -u root -p
```
and enter the password `mysql`.

## MongoDB docker container
Create the container:
```shell
> docker run --name bd2_mongodb_api -d -p 27017:27017 mongodb/mongodb-community-server
```

(optional) To open a mongo shell, execute:
```shell
> docker exec -it bd2_mongo_api mongosh
```

## To install necessary dependencies
```shell
> sudo apt install nodejs npm
> cd API && npm install
```

## To do the migration from MySQL to Mongo
```shell
node ./API/migrator
```

## To run the API
```shell
node ./API/app
```

## About the API
The possible endpoints are:
- /{database}/users/ -> GET, POST
- /{database}/users/:id -> GET, PUT, DELETE
- /{database}/products/ -> POST, GET
- /{database}/products/:id -> PUT, GET
Replace `{database}` with `mysql` or `mongo`, depending on the database that you want to use.
