# Assignment for Databases course

## To create a MySQL docker container
```shell
docker run --name SQLTP0 -e MYSQL_ROOT_PASSWORD=mysql -p 3306:3306 -d mysql
```

## Credentials of the container
root:mysql

## To install the API
```shell
sudo apt install nodejs npm
```

## To run the API
```shell
node app
```