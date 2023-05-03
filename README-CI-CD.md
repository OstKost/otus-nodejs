## Docker

Этот Dockerfile предназначен для сборки и запуска Nest.js-приложения в контейнере. Файл содержит три основных этапа:

- Этап "dependencies" устанавливает и кэширует зависимости проекта, копирует package.json и package-lock.json в образ и устанавливает их с помощью npm ci. Этот этап отдельный, чтобы ускорить процесс сборки контейнера, поскольку зависимости не изменяются так часто, как остальные файлы проекта.
- Этап "builder" использует предыдущий этап и копирует все остальные файлы проекта в образ. Затем он генерирует TypeScript-код и собирает проект с помощью команды npm run build.
- Этап "run" использует два предыдущих этапа, копирует сгенерированный и собранный код в контейнер, устанавливает только необходимые зависимости и запускает приложение с помощью команды npm run start:prod.

Этот Dockerfile позволяет быстро собрать готовый для запуска веб-сервер, который будет работать на порту 3000.

## PostgreSQL

В качестве базы данных используется бесплатный сервис от neon.tech.
Миграции prisma настраиваются через SHADOW_DATABASE_URL.

## CI на GitHub

Этот проект настроен для автоматической проверки кода при помощи GitHub Actions. На каждый PUSH в ветку `lesson-32-vercel-deploy` запускается набор действий, описанных в файле ci.yml.  
Этот файл содержит описание workflow для GitHub Actions, который запускается при коммите в ветку lesson-32-vercel-deploy.  
Переменная IMAGE_TAG устанавливает тег для Docker-образа, который будет создан на основе Dockerfile в репозитории.  
В workflow определена одна задача test, которая состоит из нескольких шагов:

- Клонирование репозитория через actions/checkout
- Сборка Docker-образа, указанного в переменной IMAGE_TAG, на основе Dockerfile в репозитории
- Проверка стиля кода с помощью Prettier
- Проверка качества кода с помощью ESLint
- Запуск тестов

Если все шаги завершатся успешно, workflow будет считаться пройденным. Если же хотя бы один из них закончится неудачно, workflow завершится с ошибкой.
Публикация Nest приложения на сервис Vercel

## Deploy to Vercel

Удалось запустить REST api.  
https://otus-nodejs-ju4q.vercel.app/

Настройки на Vercel:
- В конфиг Vercel добавлены env переменные (SECRET_KEY_JWT, DATABASE_URL, DIRECT_URL)
- Указана основная ветка для публикаций (lesson-32-vercel-deploy-rest)
- Указана директория, где находится сборка (dist)
- Swagger как обычно не работает, нужно как то через раздачу статики делать
- Проверил запросы через Postman - работают, пример запроса:

      curl --location 'otus-nodejs-ju4q.vercel.app/auth/login' \
      --header 'Content-Type: application/json' \
      --header 'Authorization: Bearer {{token}}' \
      --data-raw '{
      "email": "preview@preview.com",
      "password": "preview"
      }'
  
    
        curl --location 'otus-nodejs-ju4q.vercel.app/auth/profile' \
      --header 'Authorization: Bearer {{token}}' \

  
      curl --location 'otus-nodejs-ju4q.vercel.app/auth/profile' \
      --header 'Authorization: Bearer {{token}}' \
