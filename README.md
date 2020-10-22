# MPMC

一个受[patchbay]启发的Web友好的自托管ad-hoc微服务,
提供基于 HTTP 的阻塞式 MPMC 消息队列功能,
带有基于token和名单的访问控制策略,
支持JSON Schema.

基于HTTP的阻塞方式类似于长轮询(long polling):
直到消息enqueue或dequeue, 服务器才会返回响应.
未dequeue的消息位于内存中, 实际的工作方式类似于Golang的Channel.

受原理所限, 此服务不能实现消息的可靠传递(reliable delivery), 也无法重发消息.
因此当遭遇网络故障时, 消息可能会丢失.

所有URL都采用了反射性的CORS, 没有提供针对`Origin`的访问控制策略.

[patchbay]: https://patchbay.pub/

## Quickstart

```sh
# 运行
docker run --detach --publish 8080:8080 blackglory/mpmc

# 打开第一个终端
curl http://localhost:8080/mpmc/hello-world # 没有可消费的消息, 阻塞

# 打开第二个终端
curl http://localhost:8080/mpmc/hello-world # 没有可消费的消息, 阻塞

# 打开第三个终端
curl \
  --data 'hello world1' \
  http://localhost:8080/mpmc/hello-world # 生产消息, 第一个终端返回hello world1

curl \
  --data 'hello world2' \
  http://localhost:8080/mpmc/hello-world # 生产消息, 第二个终端返回hello world2

curl \
  --data 'hello world3' \
  http://localhost:8080/mpmc/hello-world # 生产消息, 没有消费者, 阻塞

# 打开第四个终端
curl \
  --data 'hello world4' \
  http://localhost:8080/mpmc/hello-world # 生产消息, 没有消费者, 阻塞

# 打开第五个终端
curl http://localhost:8080/mpmc/hello-world # 消费消息, 返回hello world3, 第三个终端返回
curl http://localhost:8080/mpmc/hello-world # 消费消息, 返回hello world4, 第四个终端返回
```

## Install & Run

### 从源代码运行

可以使用环境变量`MPMC_HOST`和`MPMC_PORT`决定服务器监听的地址和端口, 默认值为localhost和8080.

```sh
git clone https://github.com/BlackGlory/mpmc
cd mpmc
yarn install
yarn build
yarn --silent start
```

### Docker

```sh
docker run \
  --detach \
  --publish 8080:8080 \
  blackglory/mpmc
```

#### 从源代码构建

```sh
git clone https://github.com/BlackGlory/mpmc
cd mpmc
yarn install
yarn docker:build
```

#### Recipes

##### 公开服务器

docker-compose.yml
```yml
version: '3.8'

services:
  mpmc:
    image: 'blackglory/mpmc'
    restart: always
    environment:
      - MPMC_HOST=0.0.0.0
    volumes:
      - 'mpmc-data:/data'
    ports:
      - '8080:8080'

volumes:
  mpmc-data:
```

##### 私人服务器

docker-compose.yml
```yml
version: '3.8'

services:
  mpmc:
    image: 'blackglory/mpmc'
    restart: always
    environment:
      - MPMC_HOST=0.0.0.0
      - MPMC_ADMIN_PASSWORD=password
      - MPMC_TOKEN_BASED_ACCESS_CONTROL=true
      - MPMC_DISABLE_NO_TOKENS=true
    volumes:
      - 'mpmc-data:/data'
    ports:
      - '8080:8080'

volumes:
  mpmc-data:
```

## Usage

对id的要求: `^[a-zA-Z0-9\.\-_]{1,256}$`

### enqueue

`POST /mpmc/<id>`

往特定消息队列放入消息, 会阻塞直到此消息dequeue.
id用于标识消息队列.
enqueue请求的`Content-Type`会在dequeue时原样返回.

如果开启基于token的访问控制, 则可能需要在Querystring提供具有enqueue权限的token:
`POST /mpmc/<id>?token=<token>`

#### Example

curl
```sh
curl \
  --data 'message' \
  "http://localhost:8080/mpmc/$id"
```

JavaScript
```js
await fetch(`http://localhost:8080/mpmc/${id}`, {
  method: 'POST'
, body: 'message'
})
```

### dequeue

`GET /mpmc/<id>`

从特定消息队列取出消息, 如果消息队列为空, 则阻塞直到有新消息enqueue.
id用于标识消息队列.

如果开启基于token的访问控制, 则可能需要在Querystring提供具有dequeue权限的token:
`GET /mpmc/<id>?token=<token>`

#### Example

curl
```sh
curl "http://localhost:8080/mpmc/$id"
```

JavaScript
```js
await fetch(`http://localhost:8080/mpmc/${id}`).then(res => res.text())
```

## 为enqueue添加JSON Schema验证

通过设置环境变量`MPMC_JSON_VALIDATION=true`可开启enqueue的JSON验证功能.
任何带有`Content-Type: application/json`的请求都会被验证,
即使没有设置JSON Schema, 也会拒绝不合法的JSON文本.
JSON验证仅用于验证, 不会重新序列化消息, 因此subscribe得到的消息会与publish发送的消息相同.

在开启验证功能的情况下, 通过环境变量`MPMC_DEFAULT_JSON_SCHEMA`可设置默认的JSON Schema,
该验证仅对带有`Content-Type: application/json`的请求有效.

通过设置环境变量`MPMC_JSON_PAYLOAD_ONLY=true`,
可以强制enqueue只接受带有`Content-Type: application/json`的请求.
此设置在未开启JSON Schema验证的情况下也有效, 但在这种情况下服务器能够接受不合法的JSON.

### 单独为id设置JSON Schema

可单独为id设置JSON Schema, 被设置的id将仅接受`Content-Type: application/json`请求.

#### 获取所有具有JSON Schema的消息队列id

`GET /api/mpmc-with-json-schema`

获取所有具有JSON Schema的消息队列id, 返回由JSON表示的字符串数组`string[]`

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/mpmc-with-json-schema"
```

fetch
```js
await fetch('http://localhost:8080/api/mpmc-with-json-schema', {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

#### 获取JSON Schema

`GET /api/mpmc/<id>/json-schema`

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/mpmc/$id/json-schema"
```

fetch
```js
await fetch(`http://localhost:8080/api/mpmc/${id}/json-schema`, {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

#### 设置JSON Schema

`PUT /api/mpmc/<id>/json-schema`

##### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  --header "Content-Type: application/json" \
  --data "$JSON_SCHEMA" \
  "http://localhost:8080/api/mpmc/$id/jsonschema"
```

fetch
```js
await fetch(`http://localhost:8080/api/mpmc/${id}/json-schema`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
    'Content-Type': 'application/json'
  }
, body: JSON.stringify(jsonSchema)
})
```

#### 移除JSON Schema

`DELETE /api/mpmc/<id>/json-schema`

##### Example

curl
```sh
curl \
  --request DELETE \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/mpmc/$id/json-schema"
```

fetch
```js
await fetch(`http://localhost:8080/api/mpmc/${id}/json-schema`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

## 访问控制

MPMC提供两种访问控制策略, 可以一并使用.

所有访问控制API都使用基于口令的Bearer Token Authentication.
口令需通过环境变量`MPMC_ADMIN_PASSWORD`进行设置.

访问控制规则是通过[WAL模式]的SQLite3持久化的, 开启访问控制后,
服务器的吞吐量和响应速度会受到硬盘性能的影响.

已经存在的阻塞连接不会受到新的访问控制规则的影响.

[WAL模式]: https://www.sqlite.org/wal.html

### 基于名单的访问控制

通过设置环境变量`MPMC_LIST_BASED_ACCESS_CONTROL`开启基于名单的访问控制:
- `whitelist`
  启用基于消息队列白名单的访问控制, 只有在名单内的消息队列允许被访问.
- `blacklist`
  启用基于消息队列黑名单的访问控制, 只有在名单外的消息队列允许被访问.

#### 黑名单

##### 获取黑名单

`GET /api/blacklist`

获取位于黑名单中的所有消息队列id, 返回JSON表示的字符串数组`string[]`.

###### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/blacklist"
```

fetch
```js
await fetch('http://localhost:8080/api/blacklist', {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

##### 添加黑名单

`PUT /api/blacklist/<id>`

将特定消息队列加入黑名单.

###### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/blacklist/$id"
```

fetch
```js
await fetch(`http://localhost:8080/api/blacklist/${id}`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

##### 移除黑名单

`DELETE /api/blacklist/<id>`

将特定消息队列从黑名单中移除.

###### Example

curl
```sh
curl \
  --request DELETE \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/blacklist/$id"
```

fetch
```js
await fetch(`http://localhost:8080/api/blacklist/${id}`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

#### 白名单

##### 获取白名单

`GET /api/whitelist`

获取位于黑名单中的所有消息队列id, 返回JSON表示的字符串数组`string[]`.

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIM_PASSWORD" \
  "http://localhost:8080/api/whitelist"
```

fetch
```js
await fetch('http://localhost:8080/api/whitelist', {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

##### 添加白名单

`PUT /api/whitelist/<id>`

将特定消息队列加入白名单.

###### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/whitelist/$id"
```

fetch
```js
await fetch(`http://localhost:8080/api/whitelist/${id}`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

##### 移除白名单

`DELETE /api/whitelist/<id>`

将特定消息队列从白名单中移除.

###### Example

curl
```sh
curl \
  --request DELETE \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/whitelist/$id"
```

fetch
```js
await fetch(`http://localhost:8080/api/whitelist/${id}`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

### 基于token的访问控制

对token的要求: `^[a-zA-Z0-9\.\-_]{1,256}$`

通过设置环境变量`MPMC_TOKEN_BASED_ACCESS_CONTROL=true`开启基于token的访问控制.

基于token的访问控制将根据消息队列具有的token决定其访问规则, 具体行为见下方表格.
一个消息队列可以有多个token, 每个token可以单独设置enqueue权限和dequeue权限.
不同消息队列的token不共用.

| 此消息队列存在具有dequeue权限的token | 此消息队列存在具有enqueue权限的token | 行为 |
| --- | --- | --- |
| YES | YES | 只有使用具有相关权限的token才能执行操作 |
| YES | NO | 无token可以enqueue, 只有具有dequeue权限的token可以dequeue |
| NO | YES | 无token可以dequeue, 只有具有enqueue权限的token可以enqueue |
| NO | NO | 无token可以enqueue和dequeue |

在开启基于token的访问控制时,
可以通过将环境变量`MPMC_DISABLE_NO_TOKENS`设置为`true`将无token的消息队列禁用.

基于token的访问控制作出了如下假定, 因此不使用加密和消息验证码(MAC):
- token的传输过程是安全的
- token难以被猜测
- token的意外泄露可以被迅速处理

#### 获取所有具有token的消息队列id

`GET /api/mpmc-with-tokens`

获取所有具有token的消息队列id, 返回由JSON表示的字符串数组`string[]`

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/mpmc-with-tokens"
```

fetch
```js
await fetch(`http://localhost:8080/api/mpmc-with-tokens`, {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

#### 获取特定消息队列的所有token信息

`GET /api/mpmc/<id>/tokens`

获取特定消息队列的所有token信息, 返回JSON表示的token信息数组
`Array<{ token: string, enqueue: boolean, dequeue: boolean }>`.

##### Example

curl
```sh
curl \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/mpmc/$id/tokens"
```

fetch
```js
await fetch(`http://localhost:8080/api/mpmc/${id}/tokens`, {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

#### 为特定消息队列的token设置enqueue权限

`PUT /api/mpmc/<id>/tokens/<token>/enqueue`

添加/更新token, 为token设置enqueue权限.

##### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/mpmc/$id/tokens/$token/enqueue"
```

fetch
```js
await fetch(`http://localhost:8080/api/mpmc/${id}/tokens/$token/enqueue`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

#### 取消特定消息队列的token的enqueue权限

`DELETE /api/mpmc/<id>/tokens/<token>/enqueue`

取消token的enqueue权限.

##### Example

curl
```sh
curl \
  --request DELETE \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/mpmc/$id/tokens/$token/enqueue"
```

fetch
```js
await fetch(`http://localhost:8080/api/mpmc/${id}/tokens/${token}/enqueue`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

#### 为特定消息队列的token设置dequeue权限

`PUT /api/mpmc/<id>/tokens/<token>/dequeue`

添加/更新token, 为token设置dequeue权限.

##### Example

curl
```sh
curl \
  --request PUT \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/mpmc/$id/tokens/$token/dequeue"
```

fetch
```js
await fetch(`http://localhost:8080/api/mpmc/${id}/tokens/$token/dequeue`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

#### 取消特定消息队列的token的enqueue权限

`DELETE /api/mpmc/<id>/tokens/<token>/dequeue`

取消token的dequeue权限.

##### Example

curl
```sh
curl \
  --request DELETE \
  --header "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/mpmc/$id/tokens/$token/dequeue"
```

fetch
```js
await fetch(`http://localhost:8080/api/mpmc/${id}/tokens/${token}/dequeue`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

## HTTP/2

MPMC支持HTTP/2, 以多路复用反向代理时的连接, 可通过设置环境变量`MPMC_HTTP2=true`开启.

此HTTP/2支持不提供从HTTP/1.1自动升级的功能, 亦不提供HTTPS.
因此, 在本地curl里进行测试时, 需要开启`--http2-prior-knowledge`选项.

## 特殊用例

### 发送/接收文本文件

```sh
# 发送
cat filename | curl "http://localhost:8080/mpmc/$id" --data-binary @-

# 接收
curl "http://localhost:8080/mpmc/$id" > filename
```

## TODO
- [ ] 中断POST后, 相关消息不应留在服务器内存里
      mpmc在内存中隐式维护队列的行为与patchbay不符
- [ ] 在更新访问控制规则时, 断开受影响的连接
- [ ] Payload大小环境变量
