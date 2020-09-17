## 评测

本OJ目前支前的语言c++,python3(3.5)

c++ 使用g++编译,

```
g++ source_file.cpp -o exec_file -lm -DONLINE_JUDGE
```

可以选择是 自动IO 还是手动IO

如果是手动IO,自行在代码 中读写数据文件

如 本OJ PID 1000 a+b

```
#include <cstdio>
int main(){
    freopen("a+b.in","r",stdin);
    freopen("a+b.out","w",stdout);
    int a,b;
    scanf("%d%d",&a,&b);
    printf("%d",a+b);
    return 0;
}
```

## 个人资料

本站不提供头像存储服务，而是使用 Gravatar 进行头像显示。请使用邮箱注册 WordPress.com，登录 [Gravatar ](https://cn.gravatar.com/) 并上传头像。同样使用 Gravatar 的 OJ 有 Vijos、COGS、UOJ ,loj等。

个性签名只可以使用纯文本

## 测试数据

## Special Judge

## 题目上传
