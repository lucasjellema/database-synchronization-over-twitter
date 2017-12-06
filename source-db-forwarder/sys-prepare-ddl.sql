REM AS SYS:


create user ukoug identified by ukoug default tablespace users temporary tablespace temp;
grant create table, create procedure , connect to ukoug;
ALTER USER ukoug QUOTA UNLIMITED ON users;
ALTER USER ukoug IDENTIFIED BY ukoug ACCOUNT UNLOCK;
grant create trigger to ukoug;

grant execute on utl_http to ukoug
/

grant execute on dbms_lock to ukoug
/

BEGIN
  DBMS_NETWORK_ACL_ADMIN.create_acl (
    acl          => 'dbsynchdatapi_acl_file.xml', 
    description  => 'Granting ukoug access to connect to external hosts',
    principal    => 'UKOUG',
    is_grant     => TRUE, 
    privilege    => 'connect',
    start_date   => SYSTIMESTAMP,
    end_date     => NULL);
end;
 
begin
  DBMS_NETWORK_ACL_ADMIN.assign_acl (
    acl         => 'dbsynchdatapi_acl_file.xml',
    host        => '87aa2d39.ngrok.io', 
    lower_port  => 80,
    upper_port  => 80);    
end; 

Note:

in order to UTL_HTTP to an HTTPS endpoint (over SSL) requires uploading Certificates to Oracle Wallet and configuring UTL_HTTP for that wallet:
https://oracle-base.com/articles/misc/utl_http-and-ssl#get-site-certificates 
