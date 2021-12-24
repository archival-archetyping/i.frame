# /api/enter

webページを開いたときにユーザ情報をつくるくん

request

```
{
  data: {
    device_id: string
    icon_id: number
    key_color_id: number
  }
}
```

response

```
{
  is_success: boolean
  // 成功時
  device_id: string
  icon_id: number
  key_color_id number
  is_mute: boolean(true)

  // 失敗時
  msg: string
}
```

# /api/create-room

request

```
{
  data: {
    type: 'registered' | 'anonymous'
    limit: number
    name: string
    is_voice: boolean
    is_chat: boolean
  }
}
```

response

```
{
  is_success: boolean
  // 成功時
  id: string
  limit: number
  name: string
  type: 'registered' | 'anonymous'
  is_voice: boolean
  is_chat: boolean

  // 失敗時
  msg: string
}
```

# /api/create-voice-token


request

```
{
  data: {
    room_id: string
    device_id: string
  }
}
```

response

```
{
  is_success: boolean
  // 成功時
  token: string
  room_id: string
  device_id: string

  // 失敗時
}
```
# /api/join-room


request

```
{
  data: {
    device_id: string
    agora_uid: string
    room_id: string
  }
}
```

response

```
{
  is_success: boolean
  // 成功時
  device_id: string
  room_id: string
  agora_uid: string

  // 失敗時
  msg: string
}
```


# /api/leave-room

request

```
{
  data: {
    device_id: string
    room_id: string
  }
}
```

response

```
{
  is_success: boolean
  // 成功時
  device_id: string
  room_id: string

  // 失敗時
  msg: string
}
```

# /api/toggle-voice

request

```
{
  data: {
    device_id: string
    be_mute: boolean  // スイッチングの行き違いが発生しそうなので取り急ぎtrue/falseで
  }
}
```

response

```
{
  is_success: boolean
  // 成功時
  device_id: boolean
  is_mute: boolean

  // 失敗時
}
```


# /api/login

request

```
{
  data: {
    device_id: string
    registered_id: string
    registered_secret: string
  }
}
```

response

```
{
  is_success: boolean  
  // 成功時
  device_id?: string
  registered_id?: string

  // 失敗時
  msg: string
}
```

# /api/post

request

```
{
  data: {
    device_id: string
    room_id: string
    content: string
  }
}
```

response

```
{
  is_success: boolean  
  // 成功時
  device_id: string
  room_id: string
  content: string
  datetime: string (e.g. `YYYY-MM-DD hh:mm:ss`)

  // 失敗時
  msg: string
}
```

# /api/change-icon

request

```
{
  data: {
    device_id: string
    icon_id?: number
    key_color_id?: number
  }
}
```

response

```
{
  is_success: boolean  
  // 成功時
  device_id: string
  icon_id?: number
  key_color_id?: number

  // 失敗時
  msg: string
}
```

# /api/update-room

request

```
{
  data: {
    room_id: string
  }
}
```

response

```
{
  is_success: boolean  
  // 成功時
  room_id: string

  // 失敗時
  msg: string
}
```
