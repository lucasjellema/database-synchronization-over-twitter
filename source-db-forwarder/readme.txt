Objective:

- send http post requests for database updates and inserts
- turn http post requests into Tweets through  account https://twitter.com/LucasOOW2017 (these tweets contain json mesaage describing DML operation )

- consume Tweet, check Tweet Id (has not been processed before), interpret json
- update remote database with corresponding operation

Open Docker Command Line
Run Oracle Database container:
docker start 62e

Note: in a fresh container, the user ukoug has to be created using
sys-prepare-dll.sql


(see https://technology.amis.nl/2017/11/18/run-oracle-database-in-docker-using-prebaked-image-from-oracle-container-registry-a-two-minute-guide/ for details on running Oracle Database locally in Docker)


Run ngrok in directory C:\ProgramFiles

ngrok http portnumber

where portnumber is the port where the local Node application is listening

ngrok http 8123


ngrok will assign a public URL - something like http://f0de5760.ngrok.io

execute as SYS the following statement (and commit):

(replace the ngrok URL):

begin
  DBMS_NETWORK_ACL_ADMIN.assign_acl (
    acl         => 'dbsynchdatapi_acl_file.xml',
    host        => 'f0de5760.ngrok.io', 
    lower_port  => 80,
    upper_port  => 80);
  commit;      
end;


now the user UKOUG can perform get requests against the URL:

SELECT utl_http.request('http://f0de5760.ngrok.io/about') FROM dual;

I had some problems with getting the POST request to work so I use a GET also for passing information to the node application
run Node aPPLICATION:
node index.js

GET requests to host:port/order are turned into Teeet messages

Note: you can also post your own tweet:

#ukougorderevent {"orderId":"XX1235","customerName":"John Doe","status":"PENDING","customerId":"XYZ-123","shippingDestination":"Northpole","timestamp":"20171204124013"}


