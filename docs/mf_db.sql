/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     2018/7/7 21:29:06                            */
/*==============================================================*/


drop table if exists sys_customer;

drop table if exists sys_in_order;

drop table if exists sys_in_order_detail;

drop table if exists sys_out_cus_product;

drop table if exists sys_out_order;

drop table if exists sys_out_order_detail;

drop table if exists sys_user;

/*==============================================================*/
/* Table: sys_customer                                          */
/*==============================================================*/
create table sys_customer
(
   id                   int not null auto_increment,
   customer_name        varchar(100),
   address              varchar(100),
   type                 smallint,
   create_time          datetime,
   primary key (id)
);

/*==============================================================*/
/* Table: sys_in_order                                          */
/*==============================================================*/
create table sys_in_order
(
   id                   int not null auto_increment,
   customer_id          int,
   customer_name        varchar(100),
   receipt_address      varchar(100),
   receipt_date         datetime,
   material_type        varchar(50),
   account_payable      decimal(10,2),
   account_paid         decimal(10,2),
   total_amount         decimal(10,2),
   remark               varchar(255),
   order_date           datetime,
   flag                 smallint,
   primary key (id)
);

/*==============================================================*/
/* Table: sys_in_order_detail                                   */
/*==============================================================*/
create table sys_in_order_detail
(
   id                   int not null auto_increment,
   order_id             int,
   model                varchar(100),
   quantity             varchar(50),
   unit_price           decimal(10,2),
   aggregate            decimal(10,2),
   backup1              varchar(255),
   backup2              varchar(255),
   primary key (id)
);

/*==============================================================*/
/* Table: sys_out_cus_product                                   */
/*==============================================================*/
create table sys_out_cus_product
(
   id                   int not null auto_increment,
   parent_id            int,
   model                varchar(50),
   packaging            varchar(100),
   unit_price           decimal(10,2),
   primary key (id)
);

/*==============================================================*/
/* Table: sys_out_order                                         */
/*==============================================================*/
create table sys_out_order
(
   id                   int not null auto_increment,
   customer_id          int,
   customer_name        varchar(100),
   delivery_date        datetime,
   delivery_address     varchar(100),
   account_payable      decimal(10,2),
   account_paid         decimal(10,2),
   total_amount         decimal(10,2),
   remark               varchar(255),
   order_date           datetime,
   flag                 smallint,
   primary key (id)
)
auto_increment = 10000;

/*==============================================================*/
/* Table: sys_out_order_detail                                  */
/*==============================================================*/
create table sys_out_order_detail
(
   id                   int not null auto_increment,
   order_id             int,
   model                varchar(100),
   packaging            varchar(100),
   quantity             varchar(50),
   unit_price           decimal(10,2),
   aggregate            decimal(10,2),
   backup1              varchar(255),
   primary key (id)
);

/*==============================================================*/
/* Table: sys_user                                              */
/*==============================================================*/
create table sys_user
(
   user_id              int not null auto_increment,
   username             varchar(50),
   password             varbinary(100),
   salt                 varbinary(20),
   email                varchar(50),
   mobile               varchar(50),
   status               smallint,
   create_time          datetime,
   primary key (user_id)
)
auto_increment = 1000;

