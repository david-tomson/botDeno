FROM botwayorg/botway:latest AS bw

ARG DISCORD_TOKEN DISCORD_CLIENT_ID
# You can add guild ids of your servers by adding ARG SERVER_NAME_GUILD_ID

COPY . .

RUN botway docker-init

FROM denoland/deno:alpine

ENV PACKAGES "build-dependencies build-base gcc git ffmpeg curl binutils openssl-dev zlib-dev boost boost-dev"

RUN apk update && \
	apk add --no-cache --virtual ${PACKAGES}

# To add more packages
# RUN apk add PACKAGE_NAME

COPY --from=bw /root/.botway /root/.botway

COPY . .

RUN deno cache deps.ts

ENTRYPOINT ["deno", "run", "--allow-all", "main.ts"]
