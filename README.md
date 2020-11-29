# YAS-backend
---
## Steps

1. Install dependencies
2. Write configuration files 
3. Check styles and pattern rules (optional)
4. Run the app

+

5. Build Docker image
6. Run Docker app ( + MariaDB )



### Install dependencies

~~~
npm install
~~~



### Write configuration files

**Configuration for YAS-backend app (necessary)**

Run

~~~
cp ./src/config/config.json.example ./src/config/config.json
~~~

and then modify configuration values.



**Configuration for MariaDB Docker (optional : if you want to use MariaDB container)**

Run

~~~
cp ./db/db_secret/mysql_root.secret.example ./db/db_secret/mysql_root.secret
~~~

and then modify root password for your MariaDB.



Run 

~~~
cp ./db/db_init/init.sql.example ./db/db_init/init.sql
~~~

and then modify DB initializing command (ex. create database).



### Check styles and pattern rules (optional)

After dependencies are installed (Eslint is included in dependencies)

~~~
npx eslint .
~~~



### Run the app

~~~
npm run test
~~~



### Build Docker image

~~~
docker build -t YOUR_IMAGE_NAME .
~~~



### Run Docker app ( + MariaDB )

Set environment and setting in **docker-compose.yml** file, then run

~~~
docker-compose up
~~~

