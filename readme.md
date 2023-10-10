# Assignment for Databases course

## MySQL docker container
Create the container:
```shell
docker run --name mysql-bd2 -e MYSQL_ROOT_PASSWORD=mysql -p 3306:3306 -d mysql
```
Credentials of the container: `root:mysql`

## MongoDB docker container
```shell
docker run --name bd2_mongodb_api -d -p 27017:27017 mongodb/mongodb-community-server
```

## To install necessary dependencies
```shell
sudo apt install nodejs npm
```

## To run the API
```shell
node ./API/app
```