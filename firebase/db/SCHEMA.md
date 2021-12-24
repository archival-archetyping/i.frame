# room

```
room(id: string) {
  id: string
  name: string
  limit: number
  type: string
  is_used: boolean
  is_voice: boolean
  is_chat: boolean
  member: Array<{
    device_id: string
    agora_uid: string
  }>
}
```

# user

```
user(device_id: string) {
  device_id: string
  registered_id: number | null
  is_mute: boolean
  icon_id: number
  key_color_id: number
  created_at: number // unixtime
}
```

# chat

```
chat(room_id: string) {
  room_id: string
  posts: Array<{
    user_data: {
      icon_id: number
      key_color_id: number
      is_registered?: boolean
      name_ja?: string
      name_en?: string
      thumbnail_url?: string
    }
    device_id: string
    datetime: string (e.g. `yyyy-mm-dd hh:mm:ss`)
    content: string
  }>
}
```

---

<b>SpreadSheetから反映される設定DB</b>

# registered

```
registered(id: number) {
  id: number
  name_en: string
  name_ja: string
  password: string
  thumbnail_url: string
}
```

# installation

```
installation(path: string) {
  description: string
  iframe_url: string
  is_public: boolean
  path: string
  tag1: number
  tag2: number
  tag3: number
  thumbnail: string
  title_en: string
  title_ja: string
  user_id: number
}
```
# session

```
session(path: string) {
  description: string
  date: string
  end_time: string
  start_time: string
  iframe_url: string
  is_public: boolean
  path: string
  tag1: number
  tag2: number
  tag3: number
  thumbnail: string
  title_en: string
  title_ja: string
  user_id: number
}
```

# notification

```
notification(id: number) {
  id: number
  content_en: string
  content_ja: string
  is_public: true
  max_display_time: timestamp
  title_en: string
  title_ja: string
}
```

# tag

```
tag(id: number) {
  id: number
  name_en: string
  name_ja: string
  description_en: string
  description_ja: string
}
```
