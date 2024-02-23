# SQLTools Hive Driver

This is a SQLTools plugin to integrate with Hive.

# Premises and Recommends

This plugin is only for connection testing and local trials, please do not use it in development and production.
- Big data development, recommend to use [DataWorks Data IDE](https://ide-cn-shanghai.data.aliyun.com/) instead.
- Data API development, recommend to use [DataWorks Data API](https://ds-cn-shanghai.data.aliyun.com/) instead.
- Data Analytics development, recommend to use [DataWorks Data Analytics](https://da-cn-shanghai.data.aliyun.com/) instead.

# Quick Start

- Prepare an EMR instance, goto [EMR Console](https://emr-next.console.aliyun.com/) and apply an instance and setup instance password.

![Apply an Hive Instance](https://img.alicdn.com/imgextra/i2/O1CN01EjkVTH1kNMx1nWfFS_!!6000000004671-0-tps-2878-1506.jpg)

![Setting Instance Password](https://img.alicdn.com/imgextra/i3/O1CN017rQmTn1r9oXWCkSGu_!!6000000005589-0-tps-2878-1372.jpg)

- After instances running, goto [EMR on ECS](https://emr-next.console.aliyun.com/#/region/cn-shanghai/resource/all/ecs/list) and open a instance detail page and click master node link.

![Open Master Node](https://img.alicdn.com/imgextra/i3/O1CN01BwIbU61zMeZIa7kgY_!!6000000006700-0-tps-2878-1508.jpg)

- Setup a public network card for EMR Master ECS. After setup will get a public IP address.

![Binding a Public Network Card](https://img.alicdn.com/imgextra/i1/O1CN01dqFHXY1FbnKvj2Bmv_!!6000000000506-0-tps-2878-1508.jpg)

- Install [SQLTools](https://marketplace.visualstudio.com/items?itemName=mtxr.sqltools)
- Install [SQLTools Hive Driver](https://marketplace.visualstudio.com/items?itemName=dataworks.sqltools-driver-hive) plugin.

- Go to ECS security group and allow port 10000 access from used IP address for EMR Master ECS.

![ECS Security Group](https://img.alicdn.com/imgextra/i3/O1CN01zPa1tR1ZTMMBVIG7n_!!6000000003195-0-tps-2878-1508.jpg)

![ECS Security Group Network Ports"](https://img.alicdn.com/imgextra/i2/O1CN01hJi9Dp23yRiEOtDfU_!!6000000007324-0-tps-2878-1342.jpg)

- Open SQLTools and choose Hive as the connection type.

![Hive SQLTools Demo1](https://img.alicdn.com/imgextra/i2/O1CN018Qtrgu1U8E0C53qFQ_!!6000000002472-0-tps-2878-1664.jpg)

- Input EMR Master ECS public IP address and instance password.

![Hive SQLTools Demo2"](https://img.alicdn.com/imgextra/i4/O1CN01xwNlvj1KExfUwZSld_!!6000000001133-0-tps-2878-1682.jpg)

- Aliyun EMR Hive already prepared some sample data, click show table records and see results.

![Hive SQLTools Demo3"](https://img.alicdn.com/imgextra/i1/O1CN01HcTNcQ1GDoD4cJ9EK_!!6000000000589-0-tps-2878-1660.jpg)

- Run SQLs and see results.

![Hive SQLTools Demo4"](https://img.alicdn.com/imgextra/i2/O1CN01quBj0v1VeZahk8HK3_!!6000000002678-0-tps-2878-1670.jpg)

- Support auto database, schema, table and column names completion.

![Hive SQLTools Demo5"](https://img.alicdn.com/imgextra/i2/O1CN01m4kjTO1Lsdb4cntoz_!!6000000001355-0-tps-2878-1672.jpg)

![Hive SQLTools Demo6"](https://img.alicdn.com/imgextra/i2/O1CN01n0OKrV1paiZWB5qR7_!!6000000005377-0-tps-2878-1666.jpg)

- Support generate SQL insert statements.

![Hive SQLTools Demo7"](https://img.alicdn.com/imgextra/i2/O1CN01sPWtTo1VZzd9zuJcR_!!6000000002668-0-tps-2876-1670.jpg)

- Support SQL format.

![Hive SQLTools Demo8"](https://img.alicdn.com/imgextra/i1/O1CN01UxoJKm1aMJsyV5AsZ_!!6000000003315-0-tps-2878-1666.jpg)

