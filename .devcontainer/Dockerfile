FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

USER root
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        bat \
        fd-find \
        git-lfs \
        jq \
        lsof \
        netcat-openbsd \
        postgresql-client \
        protobuf-compiler \
        ripgrep \
        tmux \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
USER node

RUN npm install --global @anthropic-ai/claude-code @openai/codex

WORKDIR /workspaces/spaceport_bazaar
