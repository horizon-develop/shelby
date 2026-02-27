## Si necesitamos modificar la base de datos (cambio de esquema como agregar columna):
```
bunx prisma migrate dev --name {nombre_de_la_migración}
bunx prisma generate
```

## Esto mismo, pero para producción:
```
bunx prisma migrate deploy
```

## Verificar si hay migraciones pendientes
bunx prisma migrate status

## Poblar la base de datos
bunx prisma db seed

## Para forward un port:
```console
cloudflared --url {URL}
```