# SQLTools Hive Driver

This is a SQLTools plugin to integrate with Hive.

# Premises and Recommends

This plugin is only for connection testing and local trials, please do not use it in development and production.
- Big data development, recommend to use [DataWorks Data IDE](https://ide-cn-shanghai.data.aliyun.com/) instead.
- Data API development, recommend to use [DataWorks Data API](https://ds-cn-shanghai.data.aliyun.com/) instead.
- Data Analytics development, recommend to use [DataWorks Data Analytics](https://da-cn-shanghai.data.aliyun.com/) instead.

# Quick Start

- Prepare an EMR instance, we use Alibaba Cloud EMR for example, goto [EMR Console](https://emr-next.console.aliyun.com/) and [apply](https://emr-next.console.aliyun.com/#/resource/all/create/ecs) an instance and setup instance password.

![Apply an Hive Instance1](https://img.alicdn.com/imgextra/i2/O1CN01EjkVTH1kNMx1nWfFS_!!6000000004671-0-tps-2878-1506.jpg)

![Apply an Hive Instance2](https://img.alicdn.com/imgextra/i2/O1CN01bS4ZWw28rBVrOMTQ4_!!6000000007985-0-tps-2878-1508.jpg)

![Apply an Hive Instance3](https://img.alicdn.com/imgextra/i4/O1CN014cSov11LR9phHSxLS_!!6000000001295-0-tps-2878-1508.jpg)

![Setting Instance Password](https://img.alicdn.com/imgextra/i3/O1CN017rQmTn1r9oXWCkSGu_!!6000000005589-0-tps-2878-1372.jpg)

- After instance application, goto [EMR on ECS](https://emr-next.console.aliyun.com/#/region/cn-shanghai/resource/all/ecs/list) and open new applied instance detail page and click master node link (need to wait for instances running).

![Open Master Node](https://img.alicdn.com/imgextra/i3/O1CN01BwIbU61zMeZIa7kgY_!!6000000006700-0-tps-2878-1508.jpg)

- Setup a public network card for EMR Master ECS. After the network card setup will get a public IP address.

![Binding a Public Network Card](https://img.alicdn.com/imgextra/i1/O1CN01dqFHXY1FbnKvj2Bmv_!!6000000000506-0-tps-2878-1508.jpg)

- Switch navigated tabs to security groups and allow port 10000 access from used IP address for EMR Master ECS.

![ECS Security Group](https://img.alicdn.com/imgextra/i3/O1CN01zPa1tR1ZTMMBVIG7n_!!6000000003195-0-tps-2878-1508.jpg)

![ECS Security Group Network Ports"](https://img.alicdn.com/imgextra/i2/O1CN01hJi9Dp23yRiEOtDfU_!!6000000007324-0-tps-2878-1342.jpg)

- Install [SQLTools](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools)
- Install [SQLTools Hive Driver](https://marketplace.visualstudio.com/items?itemName=dataworks.sqltools-driver-hive) plugin.


- Open SQLTools and choose Hive as the connection type.

![Hive SQLTools Demo1](https://img.alicdn.com/imgextra/i2/O1CN018Qtrgu1U8E0C53qFQ_!!6000000002472-0-tps-2878-1664.jpg)

- Input EMR Master ECS public IP address, port 10000 and instance password.

![Hive SQLTools Demo2"](https://img.alicdn.com/imgextra/i4/O1CN01xwNlvj1KExfUwZSld_!!6000000001133-0-tps-2878-1682.jpg)

- If you use Alibaba Cloud EMR Hive, it already prepared some sample data, click show table records icon and see results.

![Hive SQLTools Demo3"](https://img.alicdn.com/imgextra/i1/O1CN01HcTNcQ1GDoD4cJ9EK_!!6000000000589-0-tps-2878-1660.jpg)

- Run SQLs and see results.

![Hive SQLTools Demo4"](https://img.alicdn.com/imgextra/i2/O1CN01quBj0v1VeZahk8HK3_!!6000000002678-0-tps-2878-1670.jpg)

- Support auto database, schema, table and column names SQL completion.

![Hive SQLTools Demo5"](https://img.alicdn.com/imgextra/i2/O1CN01m4kjTO1Lsdb4cntoz_!!6000000001355-0-tps-2878-1672.jpg)

![Hive SQLTools Demo6"](https://img.alicdn.com/imgextra/i2/O1CN01n0OKrV1paiZWB5qR7_!!6000000005377-0-tps-2878-1666.jpg)

- Support generate SQL insert statements.

![Hive SQLTools Demo7"](https://img.alicdn.com/imgextra/i2/O1CN01sPWtTo1VZzd9zuJcR_!!6000000002668-0-tps-2876-1670.jpg)

- Support SQL format.

![Hive SQLTools Demo8"](https://img.alicdn.com/imgextra/i1/O1CN01UxoJKm1aMJsyV5AsZ_!!6000000003315-0-tps-2878-1666.jpg)

