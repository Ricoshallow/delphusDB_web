
## 通用功能

**支持所有列表刷新功能，点击列表上方刷新图标可以重载列表**

**支持所有列表查看功能，查看规则为全局匹配，任何含有查找项的行都会被展示**

**支持所有列表项全选功能，点击Select All全选或取消全选**

**支持换肤功能，点击界面头部换肤图标可以切换头部和导航栏风格**

<br/>
<br/>

## Memory Manager (内存管理)
**支持查看不同节点的内存**

- Sessions Usage (节点的所有会话的内存使用信息)

    ```getSessionMemoryStat();```

- Variables Usage (变量内存,包括其他会话共享的变量表)

    ```objs(true);```



<br/>
<br/>

## Stream Manager (流数据管理)
**支持查看不同节点的流数据**
- pubConns (订阅节点)

    ```getStreamingStat().pubConns;```

- subConns (发布节点)

    ```getStreamingStat().subConns;```

- pubTables ()

    ```getStreamingStat().pubTables;```

- subWorkers (订阅节点的工作线程的状态)

    ```getStreamingStat().subWorkers;```


<br/>
<br/>

## Work Manager (工作管理)
**支持作业查看以及作业terminate**
- Submit (批处理作业列表)

    ```getRecentJobs();```

- Scheduled (定时任务列表)

    ```getScheduledJobs();```

- Console (正在执行的交互式任务列表)

    ```getConsoleJobs();```


<br/>
<br/>

## FuncView Manager (函数视图管理)
**支持函数的查看、添加、修改和删除**
- Function View (函数列表)

  ```getFunctionViews()```

 

<br/>
<br/>

## Access Manager (权限管理)
**支持查看用户和用户组列表**

**支持操作各个用户和用户组的各类权限（Grant、Deny、Revoke）**

**支持删除添加用户和用户组**

**支持添加删除用户组中的成员**
- Users (用户权限管理)

    ```getUserAccess(getUserList())```

- Groups (用户组权限管理)

    ```getGroupAccess(getGroupList())```


## License Version 

**支持license和version查看，点击页面头部文件图标可以展示相应license和version信息**





