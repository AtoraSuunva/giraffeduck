use std::{env, sync::Arc};

use giraffeduck::api::{attachments, bee, fox, log};
use ntex::{
    http::{client::Connector, Client},
    web::{self, guard, middleware},
};
use rustls_platform_verifier::{BuilderVerifierExt, ConfigVerifierExt};

#[web::get("/")]
async fn hello() -> impl web::Responder {
    web::HttpResponse::Ok()
        .content_type("text/plain; charset=utf-8")
        .body("Hello world! This server only hosts APIs, you should head to https://atora.dev")
}
async fn p404() -> impl web::Responder {
    web::HttpResponse::NotFound()
        .content_type("text/plain; charset=utf-8")
        .body("404 Not Found! This server only hosts APIs, you should head to https://atora.dev or https://github.com/AtoraSuunva/giraffeduck")
}

#[web::get("/healthcheck")]
async fn health() -> impl web::Responder {
    web::HttpResponse::Ok()
        .content_type("text/plain; charset=utf-8")
        .body("OK")
}

#[ntex::main]
async fn main() -> std::io::Result<()> {
    env::set_var("RUST_LOG", "ntex=info");
    env_logger::init();

    let mut handlebars = handlebars::Handlebars::new();
    handlebars
        .register_template_file("log_viewer", "./templates/log_viewer.hbs")
        .unwrap();
    let handlebars_ref = Arc::new(handlebars);

    web::HttpServer::new(move || {
        let builder = rustls::ClientConfig::builder()
            .with_platform_verifier()
            .unwrap()
            .with_no_client_auth();

        let client = Client::build()
            .connector(Connector::default().rustls(builder).finish())
            .response_payload_limit(1_000_000)
            .finish();

        web::App::new()
            .state(client)
            .state(handlebars_ref.clone())
            .wrap(middleware::Logger::default())
            .wrap(middleware::Compress::default())
            .wrap(middleware::DefaultHeaders::new().header("X-Content-Type-Options", "nosniff"))
            .service(hello)
            .service(health)
            .service(ntex_files::Files::new("/api/fox/img", "public/api/fox/img"))
            .service(web::scope("/api").service((
                attachments::get_attachment,
                bee::bee_movie,
                fox::fox,
                fox::fox_direct,
                log::get_log,
            )))
            .service(ntex_files::Files::new("/", "public"))
            .default_service(
                web::resource("").route(web::get().to(p404)).route(
                    web::route()
                        .guard(guard::Not(guard::Get()))
                        .to(|| async { web::HttpResponse::MethodNotAllowed() }),
                ),
            )
    })
    .bind(env::var("BIND_TO").unwrap_or("127.0.0.1:8080".to_string()))?
    .run()
    .await
}
