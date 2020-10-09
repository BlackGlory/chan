# MPMC

一个受[patchbay.pub]启发的自托管微服务, 提供基于 HTTP 的阻塞式 MPMC 消息队列功能,
并带有基于token和名单的访问控制策略.

基于HTTP的阻塞方式类似于长轮询(long polling), 直到消息入列或出列, 服务器才会返回响应.
未出列的消息位于内存中, 实际的工作方式类似于Golang的Channel.

受原理所限, 此服务不能实现消息的可靠传递(reliable delivery), 也无法重发消息.
因此当遭遇网络故障时, 消息可能会丢失.

所有URL都采用了反射性的CORS, 没有提供针对`Origin`的访问控制策略.

[patchbay.pub]: https://patchbay.pub/

## Install

### 从源代码

```sh
git clone https://github.com/BlackGlory/mpmc
yarn install
yarn build
yarn start
```

### Docker

```sh
docker run --publish 80:8080 blackglory/mpmc
```

## Usage

对消息队列id的要求: `[a-zA-Z0-9\-]{1,256}`

### dequeue

`GET /mpmc/<id>`

对特定消息队列进行出列操作, 如果消息队列为空, 则阻塞直到有新消息入列.
id用于标识消息队列.

如果开启访问控制, 则可能需要在Querystring提供具有dequeue权限的token:
`GET /mpmc/<id>?token=<token>`

#### Example

curl
```sh
curl "http://localhost:8080/mpmc/$uuid"
```

JavaScript
```js
await fetch(`http://localhost:8080/mpmc/${uuid}`).then(res => res.text())
```

### enqueue

`POST /mpmc/<id>`

对特定消息队列进行入列操作, 会阻塞直到此消息出列.
id用于标识消息队列.

如果开启访问控制, 则可能需要在Querystring提供具有enqueue权限的token:
`POST /mpmc/<id>?token=<token>`

#### Example

curl
```sh
curl "http://localhost:8080/mpmc/$uuid" --data 'message'
```

JavaScript
```js
await fetch(`http://localhost:8080/mpmc/${uuid}`, {
  method: 'POST'
, body: 'message'
})
```

## 访问控制 API

MPMC提供两种访问控制策略, 可以一并使用.

所有访问控制API都使用基于口令的Bearer Token Authentication.

口令需通过环境变量`ADMIN_PASSWORD`进行设置.
`ADMIN_PASSWORD`同时也是访问控制的开关, 未提供此环境变量的情况下, 服务会采取无访问控制的运行模式.

访问控制规则是通过[WAL模式]的SQLite3进行持久化的, 开启访问控制后,
服务器的吞吐量和响应速度会受到硬盘性能的影响.

[WAL模式]: https://www.sqlite.org/wal.html

### 基于名单的访问控制

通过设置环境变量`LIST_BASED_ACCESS_CONTROL`开启基于名单的访问控制:
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
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
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
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -X PUT \
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
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -X DELETE \
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
  -H "Authorization: Bearer $ADMIM_PASSWORD" \
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
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -X PUT \
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
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -X DELETE \
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

对token的要求: `[a-zA-Z0-9\-]{1,256}`

通过将环境变量`TOKEN_BASED_ACCESS_CONTROL`设置为`true`开启基于token的访问控制.

基于token的访问控制将根据消息队列具有的token决定其访问规则, 具体行为见下方表格.
一个消息队列可以有多个token, 每个token可以单独设置入列权限和出列权限.
不同消息队列的token不共用.

| 此消息队列存在具有出列权限的token | 此消息队列存在具有入列权限的token | 行为 |
| - | - | - |
| YES | YES | 只有使用具有相关权限的token才能执行操作 |
| YES | NO | 无token可以入列, 只有具有出列权限的token可以出列 |
| NO | YES | 无token可以出列, 只有具有入列权限的token可以入列 |
| NO | NO | 无token可以入列和出列 |

在开启基于token的访问控制时, 可以通过将环境变量`DISABLE_NO_TOKENS`设置为`true`将无token的消息队列禁用.

#### 获取所有具有token的消息队列id

`GET /api/mpmc`

获取所有具有token的消息队列id, 返回由JSON表示的字符串数组`string[]`

##### Example

curl
```sh
curl \
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/mpmc"
```

fetch
```js
await fetch(`http://localhost:8080/api/mpmc`, {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

#### 获取特定消息队列的所有token信息

`GET /api/mpmc/<id>`

获取特定消息队列的所有token信息, 返回JSON表示的token信息数组`Array<{ token: string, enqueue: boolean, dequeue: boolean }>`.

##### Example

curl
```sh
curl \
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  "http://localhost:8080/api/mpmc/$id"
```

fetch
```js
await fetch(`http://localhost:8080/api/mpmc/${id}`, {
  headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
}).then(res => res.json())
```

#### 为特定消息队列的token设置入列权限

`PUT /api/mpmc/<id>/enqueue/<token>`

添加/更新token, 为token设置入列权限.

##### Example

curl
```sh
curl \
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -X PUT \
  "http://localhost:8080/api/mpmc/$id/enqueue/$token"
```

fetch
```js
await fetch(`http://localhost:8080/api/mpmc/${id}/enqueue/$token`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

#### 取消特定消息队列的token的入列权限

`DELETE /api/mpmc/<id>/enqueue/<token>`

取消token的入列权限.

##### Example

curl
```sh
curl \
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -X DELETE \
  "http://localhost:8080/api/mpmc/$id/enqueue/$token"
```

fetch
```js
await fetch(`http://localhost:8080/api/mpmc/${id}/enqueue/${token}`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

#### 为特定消息队列的token设置出列权限

`PUT /api/mpmc/<id>/dequeue/<token>`

添加/更新token, 为token设置出列权限.

##### Example

curl
```sh
curl \
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -X PUT \
  "http://localhost:8080/api/mpmc/$id/dequeue/$token"
```

fetch
```js
await fetch(`http://localhost:8080/api/mpmc/${id}/dequeue/$token`, {
  method: 'PUT'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```

#### 取消特定消息队列的token的入列权限

`DELETE /api/mpmc/<id>/dequeue/<token>`

取消token的出列权限.

##### Example

curl
```sh
curl \
  -H "Authorization: Bearer $ADMIN_PASSWORD" \
  -X DELETE \
  "http://localhost:8080/api/mpmc/$id/dequeue/$token"
```

fetch
```js
await fetch(`http://localhost:8080/api/mpmc/${id}/dequeue/${token}`, {
  method: 'DELETE'
, headers: {
    'Authorization': `Bearer ${adminPassword}`
  }
})
```
