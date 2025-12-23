FROM clux/muslrust:stable AS chef
USER root
RUN cargo install cargo-chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --target x86_64-unknown-linux-musl --recipe-path recipe.json
COPY . .
RUN cargo build --release --target x86_64-unknown-linux-musl --bin giraffeduck --bin healthcheck

FROM gcr.io/distroless/static:nonroot
WORKDIR /app
COPY --from=builder --chown=nonroot:nonroot /app/target/x86_64-unknown-linux-musl/release/healthcheck /app/healthcheck
COPY --from=builder --chown=nonroot:nonroot /app/target/x86_64-unknown-linux-musl/release/giraffeduck /app/giraffeduck
COPY --from=builder /app/public /app/public
COPY --from=builder /app/templates /app/templates
CMD ["/app/giraffeduck"]
